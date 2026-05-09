import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import loveGiftsLogo from '../../LoveGiftsLogo.png';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-primary-light pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-14 w-14 rounded-full bg-white border border-primary-light shadow-sm p-1.5 flex items-center justify-center">
                <img
                  src={loveGiftsLogo}
                  alt="LoveGifts"
                  className="h-full w-full object-contain rounded-full"
                />
              </div>
            </Link>
            <p className="text-secondary text-sm">
              Create beautiful, interactive love pages for your partners. 
              A gift they'll never forget.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-bold text-dark mb-4">Product</h4>
            <ul className="space-y-2 text-secondary text-sm">
              <li><Link to="/templates" className="hover:text-primary-pink transition-colors">Templates</Link></li>
              <li><a href="/#how-it-works" className="hover:text-primary-pink transition-colors">How it works</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-bold text-dark mb-4">Legal</h4>
            <ul className="space-y-2 text-secondary text-sm">
              <li><Link to="/privacy" className="hover:text-primary-pink transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary-pink transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-dark mb-4">Contact</h4>
            <p className="text-secondary text-sm mb-2"><a href="mailto:support@lovepage.app" className="hover:text-primary-pink transition-colors">support@lovepage.app</a></p>
            <p className="text-secondary text-sm italic">Made with ♥ by LovePage team</p>
          </div>
        </div>

        <div className="border-t border-primary-light pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-secondary text-sm">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white border border-primary-light p-1 flex items-center justify-center">
              <img src={loveGiftsLogo} alt="LoveGifts" className="h-full w-full object-contain rounded-full" />
            </div>
            <p>© 2025 LovePage. All rights reserved.</p>
          </div>
          <p className="flex items-center gap-1">Made with <Heart size={14} className="text-primary-pink fill-primary-pink" /> in Paris</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
