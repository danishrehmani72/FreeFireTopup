export default function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-border bg-brand-card pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display text-2xl font-bold uppercase tracking-wider text-white">
                NEXUS<span className="text-brand-primary">TOPUP</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">
              The ultimate gaming top-up store. Instant delivery, secure payments, and 24/7 customer support for all your gaming needs.
            </p>
          </div>
          
          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-brand-primary transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">All Games</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Support Center</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white mb-4">Payment Methods</h3>
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1 bg-brand-dark rounded border border-brand-border text-xs font-semibold text-green-500">Easy Paisa</div>
              <div className="px-3 py-1 bg-brand-dark rounded border border-brand-border text-xs font-semibold text-orange-500">Naya Pay</div>
              <div className="px-3 py-1 bg-brand-dark rounded border border-brand-border text-xs font-semibold text-teal-400">SadaPay</div>
              <div className="px-3 py-1 bg-brand-dark rounded border border-brand-border text-xs font-semibold text-blue-400">U Paisa</div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-brand-border pt-8 text-center md:flex md:justify-between md:text-left">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NexusTopup. All rights reserved.
          </p>
          <p className="mt-4 text-xs text-gray-600 md:mt-0">
            Free Fire is a registered trademark of Garena. We are not affiliated with Garena.
          </p>
        </div>
      </div>
    </footer>
  );
}
