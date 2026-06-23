import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-0">
      <div className="container-nabbis">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-serif text-lg font-bold text-white mb-4">NABBIS</h3>
            <p className="text-sm text-gray-400 mb-4">
              Premium fashion, lifestyle, and household products delivered across Kenya.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/nabbiscollections" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lavender transition-colors" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
              </a>
              <a href="https://facebook.com/nabbiscollections" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lavender transition-colors" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://tiktok.com/@nabbiscollections" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lavender transition-colors" aria-label="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 0h4.5a5.5 5.5 0 0 0 5.5 5.5v4a9.5 9.5 0 0 1-5.5-1.6V14a7 7 0 1 1-8-6.9V11.6a3.5 3.5 0 1 0 4 3.4V0Z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop?category=shoes" className="hover:text-lavender transition-colors">Shoes</Link></li>
              <li><Link href="/shop?category=clothing" className="hover:text-lavender transition-colors">Clothing</Link></li>
              <li><Link href="/shop?category=bags" className="hover:text-lavender transition-colors">Bags</Link></li>
              <li><Link href="/shop?category=household" className="hover:text-lavender transition-colors">Household</Link></li>
              <li><Link href="/shop?orderby=date" className="hover:text-lavender transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop?on_sale=true" className="hover:text-gold transition-colors">Sale</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-lavender transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-lavender transition-colors">FAQ</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-lavender transition-colors">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-lavender transition-colors">Return Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-lavender transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>+254 758 516135</li>
              <li>+254 720 144325</li>
              <li>info@nabbiscollections.co.ke</li>
              <li>Nairobi, Kenya</li>
            </ul>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mt-6 mb-4">We Accept</h4>
            <p className="text-sm">M-Pesa | Visa | Mastercard | Bank Transfer</p>
          </div>
        </div>
        <div className="border-t border-gray-800 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} Nabbis Collections. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-lavender transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-lavender transition-colors">Terms</Link>
            <Link href="/shipping-policy" className="hover:text-lavender transition-colors">Shipping</Link>
          </div>
        </div>
      </div>
      {/* WhatsApp Float */}
      <a
        href="https://chat.whatsapp.com/L2ZQwAUbsL16HLuIEeNGCK"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>
    </footer>
  );
}
