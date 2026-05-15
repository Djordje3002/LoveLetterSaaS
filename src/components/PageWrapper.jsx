import { motion, useReducedMotion } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';

const PageWrapper = ({ children }) => {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const disableMotion = isMobile || prefersReducedMotion;

  if (disableMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
