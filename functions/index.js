const functions = require('firebase-functions')
const admin = require('firebase-admin')
const stripe = require('stripe')(functions.config().stripe.secret)

admin.initializeApp()

const APP_URL = functions.config().app?.url || 'https://lovepage.app'

// ─── Create Stripe Checkout Session ───────────────────────────────────────────
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  const { draftId } = data

  if (!draftId) {
    throw new functions.https.HttpsError('invalid-argument', 'draftId is required')
  }

  // Verify draft exists and is pending
  const draftRef = admin.firestore().collection('pages').doc(draftId)
  const draft = await draftRef.get()
  if (!draft.exists || draft.data().status !== 'pending') {
    throw new functions.https.HttpsError('not-found', 'Draft not found or already published')
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'LovePage — Personalized Love Letter',
          description: 'Lifetime access to your personalized love page. Share via link or QR code.',
          images: [`${APP_URL}/og-preview.png`],
        },
        unit_amount: 1200, // $12.00 in cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&draft=${draftId}`,
    cancel_url: `${APP_URL}/preview/${draftId}`,
    metadata: { draftId },
  })

  return { url: session.url }
})

// ─── Verify Payment & Activate Page ───────────────────────────────────────────
exports.verifyPayment = functions.https.onCall(async (data, context) => {
  const { sessionId, draftId } = data

  if (!sessionId || !draftId) {
    throw new functions.https.HttpsError('invalid-argument', 'sessionId and draftId are required')
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status !== 'paid') {
    throw new functions.https.HttpsError('failed-precondition', 'Payment not completed')
  }

  if (session.metadata.draftId !== draftId) {
    throw new functions.https.HttpsError('permission-denied', 'Draft ID mismatch')
  }

  // Check if already active (idempotent)
  const draftRef = admin.firestore().collection('pages').doc(draftId)
  const draft = await draftRef.get()
  if (draft.exists && draft.data().status === 'active') {
    return { success: true, alreadyActive: true }
  }

  await draftRef.update({
    status: 'active',
    stripeSessionId: sessionId,
    publishedAt: admin.firestore.Timestamp.now(),
    expiresAt: admin.firestore.FieldValue.delete(),
  })

  return { success: true }
})

// ─── Cleanup Expired Drafts (hourly) ──────────────────────────────────────────
exports.cleanupExpiredDrafts = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now()
    const snapshot = await admin.firestore()
      .collection('pages')
      .where('status', '==', 'pending')
      .where('expiresAt', '<=', now)
      .get()

    if (snapshot.empty) {
      console.log('No expired drafts to delete')
      return null
    }

    const batch = admin.firestore().batch()
    snapshot.forEach(doc => batch.delete(doc.ref))
    await batch.commit()

    console.log(`Deleted ${snapshot.size} expired drafts`)
    return null
  })
