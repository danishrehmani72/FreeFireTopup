import type React from 'react';
import { useState, useEffect } from 'react';
import { ShieldCheck, Zap, HelpCircle, CheckCircle2, User, Gift, Copy, Check } from 'lucide-react';
import * as motion from 'motion/react-client';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthProvider';
import { processTopup } from '../services/topupService';
import { loginWithFreeFireId } from '../services/authService';

const diamondPackages = [
  { id: 1, amount: 13, bonus: 0, originalPrice: 40, price: 23 },
  { id: 2, amount: 35, bonus: 0, originalPrice: 100, price: 58 },
  { id: 3, amount: 70, bonus: 0, originalPrice: 200, price: 115, popular: true },
  { id: 4, amount: 140, bonus: 0, originalPrice: 400, price: 230 },
  { id: 5, amount: 355, bonus: 0, originalPrice: 1000, price: 575 },
  { id: 6, amount: 713, bonus: 0, originalPrice: 2000, price: 1150 },
  { id: 7, amount: 1426, bonus: 0, originalPrice: 4000, price: 2300 },
  { id: 8, amount: 3565, bonus: 0, originalPrice: 10000, price: 5750 },
  { id: 9, amount: 7130, bonus: 0, originalPrice: 20000, price: 11500 },
  { id: 10, amount: 14260, bonus: 0, originalPrice: 40000, price: 23000 },
];

const paymentMethods = [
  { id: 'easypaisa', name: 'Easy Paisa', num: '03316215263', icon: 'EP', color: 'border-green-500 text-green-500', bg: 'bg-green-500/10' },
  { id: 'nayapay', name: 'Naya Pay', num: '03482640090', icon: 'NP', color: 'border-orange-500 text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'sadapay', name: 'SadaPay', num: '03482640090', icon: 'SP', color: 'border-teal-400 text-teal-400', bg: 'bg-teal-400/10' },
  { id: 'upaisa', name: 'U Paisa', num: '03316215263', icon: 'UP', color: 'border-blue-400 text-blue-400', bg: 'bg-blue-400/10' },
];

export default function TopupForm() {
  const { user, userProfile, identifyGuest } = useAuth();
  const [playerId, setPlayerId] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentStep, setPaymentStep] = useState(false);
  const [screenshot, setScreenshot] = useState<any>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    if (userProfile?.email && !userProfile.email.includes('@')) {
      setPlayerId(userProfile.email);
    }
  }, [userProfile]);

  useEffect(() => {
    if (isSuccess) {
      const colors = ['#FF5E00', '#00ff66', '#00f0ff', '#ffb700', '#a855f7'];

      // Center celebratory burst
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: colors,
      });

      // Delayed left side burst
      const leftTimeout = setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 55,
          origin: { x: 0.1, y: 0.75 },
          colors: colors,
        });
      }, 200);

      // Delayed right side burst
      const rightTimeout = setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 55,
          origin: { x: 0.9, y: 0.75 },
          colors: colors,
        });
      }, 400);

      return () => {
        clearTimeout(leftTimeout);
        clearTimeout(rightTimeout);
      };
    }
  }, [isSuccess]);

  const handlePlayerIdBlur = async () => {
    if (playerId.trim()) {
      await identifyGuest(playerId.trim());
    }
  };

  const getDiscountedPrice = (price: number) => {
    if (promoCode.toUpperCase() === 'LOVEYOU') {
      return Math.floor(price * 0.99);
    }
    return price;
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerId) {
      setErrorMsg('Please enter your Player ID to continue.');
      return;
    }
    if (!selectedPackage) {
      setErrorMsg('Please select a recharge package.');
      return;
    }
    if (!selectedPayment) {
      setErrorMsg('Please select a payment method before proceeding.');
      return;
    }
    
    setErrorMsg('');
    setPaymentStep(true);
  };

  const handleConfirmPayment = async () => {
    if (!playerId || !selectedPackage || !selectedPayment) return;
    
    setIsProcessing(true);
    setErrorMsg('');
    
    let activeUid = user?.uid || playerId;
    
    // Ensure profile exists in Firestore (identifyGuest already listeners, 
    // but loginWithFreeFireId creates the record if missing)
    await loginWithFreeFireId(playerId);
    
    const pkgInfo = diamondPackages.find(p => p.id === selectedPackage);
    const totalDiamonds = pkgInfo ? pkgInfo.amount + pkgInfo.bonus : 0;
    
    try {
      const success = await processTopup(activeUid, totalDiamonds, promoCode);
      
      setIsProcessing(false);
      if (success) {
        setIsSuccess(true);
        setPaymentStep(false);
      } else {
        setErrorMsg('Transaction failed. Please try again.');
      }
    } catch (e: any) {
      setIsProcessing(false);
      setErrorMsg(`Transaction failed: ${e.message}`);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-brand-secondary/30 bg-brand-card p-8 text-center shadow-[0_0_50px_-12px_rgba(0,255,102,0.15)]"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#00ff66]/20">
          <CheckCircle2 className="h-10 w-10 text-brand-secondary" />
        </div>
        <h2 className="font-display text-3xl font-bold uppercase tracking-wider text-white">Top-Up Successful!</h2>
        <p className="mt-2 text-gray-400">Your diamonds have been instantly credited. Your payment has been processed successfully.</p>
        <button 
          onClick={() => {
            setIsSuccess(false);
            setPlayerId('');
            setSelectedPackage(null);
            setSelectedPayment(null);
            setScreenshot(null);
          }}
          className="mt-8 rounded-md bg-brand-primary px-8 py-3 font-display font-bold uppercase tracking-wide text-white transition-all hover:bg-brand-primary/90 hover:shadow-[0_0_20px_-5px_rgba(255,94,0,0.5)]"
        >
          Make Another Top-Up
        </button>
      </motion.div>
    );
  }

  if (paymentStep && !isSuccess) {
    const paymentMethodDetails = paymentMethods.find(p => p.id === selectedPayment);
    const packageDetails = diamondPackages.find(p => p.id === selectedPackage);
    const finalPrice = packageDetails ? getDiscountedPrice(packageDetails.price) : 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-brand-border bg-brand-card p-6 sm:p-8 text-center shadow-[0_0_50px_-12px_rgba(255,100,0,0.15)] mx-auto max-w-2xl"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/20">
          <Zap className="h-8 w-8 text-brand-primary" />
        </div>
        <h2 className="font-display text-3xl font-bold uppercase tracking-wider text-white">Complete Payment</h2>
        <p className="mt-2 text-gray-400">Please send <span className="font-bold text-brand-secondary">Rs {finalPrice.toLocaleString()}</span> to the account below.</p>
        
        <div className="mt-8 bg-brand-dark rounded-lg border border-brand-border p-6 text-left shadow-inner">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-brand-border/50 pb-2">Payment Details</div>
          
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <span className="text-gray-400">Method</span>
            <span className="font-bold text-white text-lg flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded border ${paymentMethodDetails?.color} ${paymentMethodDetails?.bg}`}>{paymentMethodDetails?.icon}</span>
              {paymentMethodDetails?.name}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between mb-4 items-start sm:items-center">
            <span className="text-gray-400">Account Number</span>
            <div className="flex items-center gap-2 mt-1 sm:mt-0">
              <span className="font-mono text-xl font-bold text-brand-secondary tracking-wider bg-brand-card px-3 py-1 rounded border border-brand-border">
                {paymentMethodDetails?.num}
              </span>
              <button 
                onClick={() => copyToClipboard(paymentMethodDetails?.num || '', 'final-num')}
                className="p-2 rounded-md bg-brand-card border border-brand-border text-gray-400 hover:text-brand-secondary hover:border-brand-secondary transition-all"
                title="Copy Account Number"
              >
                {copiedId === 'final-num' ? (
                  <Check className="h-5 w-5 text-brand-secondary" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between pt-4 border-t border-brand-border/50">
            <span className="text-gray-400">Exact Amount</span>
            <span className="font-display text-2xl font-bold text-white">Rs {finalPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
           <button 
             onClick={() => setPaymentStep(false)}
             className="flex-1 rounded-md border border-brand-border py-4 font-display font-bold uppercase tracking-wide text-gray-300 hover:bg-brand-dark transition-all"
           >
             Go Back
           </button>
           <button 
             onClick={handleConfirmPayment}
             disabled={isProcessing}
             className={`flex-1 flex justify-center items-center gap-2 rounded-md py-4 font-display font-bold uppercase tracking-wide transition-all ${
               isProcessing ? 'bg-brand-dark text-gray-500 border border-brand-border/50 cursor-not-allowed' : 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-[0_0_20px_-5px_rgba(255,94,0,0.5)]'
             }`}
           >
             {isProcessing ? (
               <span className="flex items-center gap-2">
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Processing...
               </span>
             ) : (
               <>Confirm Payment</>
             )}
           </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        
        {/* Step 1: User ID */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-brand-border bg-brand-card p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-3 font-display text-xl font-bold uppercase tracking-wider">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-primary text-sm shadow-[0_0_15px_-3px_rgba(255,94,0,0.4)]">1</span>
              Account Info
            </h2>
            <button className="text-gray-400 hover:text-brand-primary transition-colors">
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="playerId" className="mb-1 block text-sm text-gray-400">Player ID</label>
              <div className="relative">
                <input
                  type="text"
                  id="playerId"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  onBlur={handlePlayerIdBlur}
                  className="block w-full rounded-md border border-brand-border bg-brand-dark px-4 py-3 font-mono text-white placeholder-gray-600 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder="Enter your Free Fire Player ID"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">To find your Player ID, click on your avatar in the top left corner of the main lobby.</p>
            </div>
            
            {(!userProfile || !userProfile.referredBy) && (
              <div>
                <label htmlFor="promoCode" className="mb-1 block text-sm text-brand-secondary">Promo Code (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    id="promoCode"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="block w-full rounded-md border border-brand-border bg-brand-dark px-4 py-3 font-mono text-white placeholder-gray-600 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                    placeholder="Enter promo code"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Gift className="h-5 w-5 text-brand-secondary" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-brand-secondary/80">Support your favorite creator or use a special promo code for discounts.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Step 2: Select Package */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-brand-border bg-brand-card p-6 shadow-sm"
        >
          <h2 className="mb-6 flex items-center gap-3 font-display text-xl font-bold uppercase tracking-wider">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-primary text-sm shadow-[0_0_15px_-3px_rgba(255,94,0,0.4)]">2</span>
            Select Recharge
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {diamondPackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative overflow-hidden rounded-lg border-2 p-4 text-center transition-all ${
                  selectedPackage === pkg.id 
                    ? 'border-brand-primary bg-brand-primary/10 shadow-[0_0_20px_-5px_rgba(255,94,0,0.3)]' 
                    : 'border-brand-border bg-brand-dark hover:border-gray-600'
                }`}
              >
                <div className="absolute top-0 left-0 rounded-br-lg bg-brand-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-black shadow-sm z-10">
                  Special Discount
                </div>
                {pkg.popular && (
                  <div className="absolute top-0 right-0 rounded-bl-lg bg-brand-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-sm z-10">
                    Most Popular
                  </div>
                )}
                <div className="mb-2 flex justify-center">
                  <div className="relative">
                    <Zap className={`h-8 w-8 ${selectedPackage === pkg.id ? 'text-brand-primary' : 'text-blue-400'}`} />
                    <Zap className={`h-8 w-8 absolute top-0 blur-sm ${selectedPackage === pkg.id ? 'text-brand-primary' : 'text-blue-400/50'}`} />
                  </div>
                </div>
                <div className="font-display font-bold text-xl leading-none">
                  {pkg.amount}
                </div>
                {pkg.bonus > 0 && (
                  <div className="mt-1 text-xs text-brand-secondary font-semibold">
                    + {pkg.bonus} Bonus
                  </div>
                )}
                <div className="mt-3 border-t border-brand-border/50 pt-2 text-sm text-gray-300">
                  <span className="line-through text-gray-500 text-xs mr-2">Rs {pkg.originalPrice.toLocaleString()}</span>
                  <span className="text-white font-bold">Rs {pkg.price.toLocaleString()}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Step 3: Payment Method */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-brand-border bg-brand-card p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-3 font-display text-xl font-bold uppercase tracking-wider">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-primary text-sm shadow-[0_0_15px_-3px_rgba(255,94,0,0.4)]">3</span>
              Payment Method
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedPayment(method.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedPayment(method.id); }}
                className={`flex items-center gap-4 rounded-lg border-2 p-4 transition-all cursor-pointer ${
                  selectedPayment === method.id 
                    ? 'border-brand-primary bg-brand-primary/5 shadow-[0_0_15px_-5px_rgba(255,94,0,0.2)]' 
                    : 'border-brand-border bg-brand-dark hover:border-gray-600'
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border ${method.bg} ${method.color}`}>
                  <span className="font-bold">{method.icon}</span>
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium">{method.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{method.num}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(method.num, method.id);
                      }}
                      className="text-gray-500 hover:text-brand-primary transition-colors p-1"
                      title="Copy Number"
                    >
                      {copiedId === method.id ? <Check className="h-3 w-3 text-brand-secondary" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
                {selectedPayment === method.id && (
                  <CheckCircle2 className="ml-auto h-5 w-5 text-brand-primary" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sidebar - Order Summary */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-1"
      >
        <div className="sticky top-24 rounded-xl border border-brand-border bg-brand-card p-6 shadow-sm">
          <h3 className="mb-4 font-display text-xl font-bold uppercase tracking-wider border-b border-brand-border pb-4">Order Summary</h3>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Player ID</span>
              <span className="font-mono text-white">{playerId || '---'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Game</span>
              <span className="font-medium text-white">Free Fire</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Item</span>
              {selectedPackage ? (
                <span className="flex items-center gap-1 font-bold text-blue-400">
                  <Zap className="h-4 w-4" /> 
                  {diamondPackages.find(p => p.id === selectedPackage)?.amount} + {diamondPackages.find(p => p.id === selectedPackage)?.bonus}
                </span>
              ) : (
                <span className="text-gray-600">Please select</span>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Payment</span>
              {selectedPayment ? (
                <span className="font-medium text-white">
                  {paymentMethods.find(m => m.id === selectedPayment)?.name}
                </span>
              ) : (
                <span className="text-gray-600">Please select</span>
              )}
            </div>

            <div className="border-t border-brand-border pt-4 mt-4">
              <div className="flex justify-between items-end">
                <span className="text-gray-300 font-medium pb-1">Total Price</span>
                <div className="text-right">
                  {selectedPackage && (
                    <div className="text-xs text-brand-secondary font-bold mb-1">
                      {promoCode.toUpperCase() === 'LOVEYOU' ? 'Promo Discount (1%)' : 'Special Discount (-42.5%)'}
                    </div>
                  )}
                  <div className="flex items-center gap-2 justify-end">
                    {selectedPackage && (
                      <span className="line-through text-gray-500 text-lg">
                        Rs {diamondPackages.find(p => p.id === selectedPackage)?.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="font-display text-3xl font-bold text-white">
                      Rs {selectedPackage ? getDiscountedPrice(diamondPackages.find(p => p.id === selectedPackage)!.price).toLocaleString() : '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 rounded border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-500">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleProceedToPayment}
            disabled={isProcessing || !playerId || !selectedPackage || !selectedPayment}
            className={`mt-6 w-full flex justify-center items-center gap-2 rounded-md py-4 font-display font-bold uppercase tracking-wide transition-all ${
              (isProcessing || !playerId || !selectedPackage || !selectedPayment)
                ? 'bg-brand-dark text-gray-500 cursor-not-allowed border border-brand-border/50'
                : 'bg-brand-primary text-white hover:bg-brand-primary/90 hover:shadow-[0_0_20px_-5px_rgba(255,94,0,0.5)]'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5" />
                Proceed to Payment
              </>
            )}
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="h-4 w-4" />
            Secure TLS encrypted payment
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// User icon is inexplicably missing from import due to auto-complete, let's fix it above.
// It will be imported from lucide-react if I add it.
