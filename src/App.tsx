import Header from './components/Header';
import Footer from './components/Footer';
import TopupForm from './components/TopupForm';
import FAQ from './components/FAQ';
import WhatsAppButton from './components/WhatsAppButton';
import { Zap, Clock, Shield } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function App() {
  return (
    <div className="min-h-screen bg-brand-dark font-sans selection:bg-brand-primary/30">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Game Banner Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mb-12 overflow-hidden rounded-2xl border border-brand-border bg-brand-card"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
            alt="Gaming Background" 
            className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="relative z-20 flex min-h-[300px] flex-col justify-center p-8 sm:p-12 lg:w-2/3">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3 py-1 text-sm font-medium text-brand-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-primary"></span>
              </span>
              Instant Delivery
            </div>
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl md:text-6xl">
              Free Fire <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Diamonds</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-gray-300">
              Top up your Free Fire account instantly. Enter your Player ID, choose your diamonds, and pay securely using Easy Paisa, Naya Pay, SadaPay, or U Paisa.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Zap className="h-5 w-5 text-brand-primary" />
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield className="h-5 w-5 text-brand-secondary" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="h-5 w-5 text-blue-400" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top-up Form Section */}
        <TopupForm />

        {/* Knowledgebase & FAQ Section */}
        <FAQ />

      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
