import { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Clock, CreditCard, Search, MessageCircle } from 'lucide-react';
import * as motion from 'motion/react-client';

interface FAQItem {
  id: string;
  category: 'payment' | 'delivery' | 'safety' | 'general';
  question: string;
  answer: string;
  icon: any;
}

const faqItems: FAQItem[] = [
  {
    id: 'pay-verif',
    category: 'payment',
    question: 'How long does the payment verification take?',
    answer: 'Once you transfer the funds and upload your transaction screenshot, our verification system usually processes it in 2 to 5 minutes. Please make sure the Transaction ID (TID) or sender details are clearly visible in the screenshot for instant processing.',
    icon: CreditCard,
  },
  {
    id: 'how-to-pay',
    category: 'payment',
    question: 'What payment methods do you support?',
    answer: 'We support all major Pakistani mobile wallets and banking methods including EasyPaisa, SadaPay, NayaPay, and U Paisa. When you select a package and payment partner, the correct account number and sender name will be instantly displayed for you to copy.',
    icon: CreditCard,
  },
  {
    id: 'delivery-time',
    category: 'delivery',
    question: 'When will the Free Fire Diamonds be added to my account?',
    answer: 'Immediately upon payment verification! Since we leverage direct integrated gaming APIs, the diamonds are dispatched instantly to your exact in-game Player ID. You will also see your updated balance right here on Elite Gaming Top-Up.',
    icon: Clock,
  },
  {
    id: 'acc-safety',
    category: 'safety',
    question: 'Is my Free Fire account safe from bans or flags?',
    answer: 'Dual-bonded security runs through our core: We only use authorized official Garena developer channels to top up your diamonds. Furthermore, we only require your Player ID to send your packages; We NEVER ask for Facebook, Google, or VK passwords.',
    icon: ShieldCheck,
  },
  {
    id: 'wrong-id',
    category: 'safety',
    question: 'What happens if I enter the wrong Player ID?',
    answer: 'Our Player ID lookup automatically loads and caches your verified guest configuration directly linked to Garena servers. However, to guarantee maximum safety, please verify the avatar name before proceeding with any transfer.',
    icon: ShieldCheck,
  },
  {
    id: 'promo-apply',
    category: 'general',
    question: 'How do I use Promo Codes and discounts?',
    answer: 'In the top-up configuration, type in any valid promo code (such as the secret LOVEYOU code) and click checkout. The system automatically computes and displays your 1% or tiered rate deductions instantly on the payment display.',
    icon: HelpCircle,
  },
  {
    id: 'help-support',
    category: 'general',
    question: 'What if I need urgent help with my transaction?',
    answer: 'If you encounter any delays or have custom requests, always press the floating WhatsApp icon on the bottom right. Our dedicated elite gamer helpline is online 24 hours a day, 7 days a week, to assist you instantly.',
    icon: MessageCircle,
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'payment' | 'delivery' | 'safety' | 'general'>('all');
  const [openId, setOpenId] = useState<string | null>('pay-verif'); // Default first item open

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'payment', label: 'Payments' },
    { id: 'delivery', label: 'Delivery Speed' },
    { id: 'safety', label: 'Account Safety' },
    { id: 'general', label: 'General & Promos' },
  ];

  const filteredItems = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="mt-16 w-full rounded-2xl border border-brand-border bg-brand-card/30 p-6 sm:p-10 backdrop-blur-sm shadow-xl" id="faq-section">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border/40 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-brand-primary text-sm font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="h-4 w-4" />
            <span>Support Knowledgebase</span>
          </div>
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-white">
            Frequently Asked <span className="text-brand-secondary">Questions</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400 max-w-xl">
            Everything you need to know about processing times, payment modes, safety, and instant high-tier diamond delivery.
          </p>
        </div>

        {/* Search tool */}
        <div className="relative w-full md:max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            id="faq-search-input"
            type="text"
            className="block w-full rounded-md border border-brand-border bg-brand-dark px-3 py-2 pl-10 text-sm text-gray-200 placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-8" id="faq-categories-container">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`faq-cat-btn-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-all ${
              selectedCategory === cat.id
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                : 'bg-brand-dark/50 text-gray-400 border border-brand-border/50 hover:border-brand-primary/40 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-4 max-w-4xl" id="faq-accordion-list">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const IconComponent = item.icon;
            const isOpen = openId === item.id;
            
            return (
              <motion.div
                key={item.id}
                layout="position"
                className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                  isOpen 
                    ? 'border-brand-primary/60 bg-brand-dark/30 shadow-md shadow-brand-primary/5' 
                    : 'border-brand-border/60 bg-brand-card/20 hover:border-brand-border'
                }`}
              >
                <button
                  id={`faq-trigger-${item.id}`}
                  onClick={() => toggleOpen(item.id)}
                  className="flex w-full items-center justify-between p-5 text-left focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                      isOpen 
                        ? 'border-brand-primary/30 bg-brand-primary/10 text-brand-primary' 
                        : 'border-brand-border bg-brand-dark/50 text-gray-400'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </span>
                    <span className={`font-medium text-sm sm:text-base transition-colors ${
                      isOpen ? 'text-white font-semibold' : 'text-gray-200'
                    }`}>
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180 text-brand-primary' : ''
                  }`} />
                </button>

                <motion.div
                  initial={false}
                  animate={{ 
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0
                  }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-1 text-sm text-gray-300 leading-relaxed border-t border-brand-border/30 bg-brand-dark/10 pl-14 sm:pl-16">
                    {item.answer}
                  </div>
                </motion.div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-10 border border-dashed border-brand-border rounded-xl">
            <p className="text-gray-400 text-sm">No match found for "{searchQuery}". Please search another topic or contact live support.</p>
          </div>
        )}
      </div>

      {/* Trust reassurance banner in footer */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-brand-border/30 pt-8" id="faq-trust-features">
        <div className="flex items-center gap-3 bg-brand-dark/20 p-4 rounded-xl border border-brand-border/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">No Passwords Required</h4>
            <p className="text-[11px] text-gray-400 mt-1">Authorized Garena ID top-up keeping your data completely safe.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-brand-dark/20 p-4 rounded-xl border border-brand-border/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Speedy Turnaround</h4>
            <p className="text-[11px] text-gray-400 mt-1">Usually loaded within 2-5 minutes of manual payment lookup.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-brand-dark/20 p-4 rounded-xl border border-brand-border/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">24/7 Helpline Support</h4>
            <p className="text-[11px] text-gray-400 mt-1">Get immediate WhatsApp help if we ever hit verification bumps.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
