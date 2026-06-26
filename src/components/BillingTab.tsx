/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CreditCard, Check, Sparkles, AlertCircle, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SubscriptionPlan } from '../types';
import { SUBSCRIPTION_PLANS } from '../data';

interface BillingTabProps {
  currentPlanId: string;
  onUpgradePlan: (planId: string) => void;
  isDark: boolean;
}

export default function BillingTab({
  currentPlanId,
  onUpgradePlan,
  isDark
}: BillingTabProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');
  const [toast, setToast] = useState<string | null>(null);

  // Stripe simulation form details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('***');

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setLoading(true);

    // Simulate standard Stripe secure handshake
    setTimeout(() => {
      onUpgradePlan(selectedPlan.id);
      setLoading(false);
      setSelectedPlan(null);
      setToast(`Stripe secure authorization complete! Your Apex Agency workspace has been upgraded to the "${selectedPlan.name}" tier.`);
      setTimeout(() => setToast(null), 5000);
    }, 1500);
  };

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === currentPlanId) || SUBSCRIPTION_PLANS[1];

  return (
    <div className="space-y-8">
      {/* Active limits summary header */}
      <div className={`p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="space-y-1.5 flex-1">
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 text-[9px] font-black rounded-md uppercase">
            Active Workspace Plan
          </span>
          <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currentPlan.name} Tier Subscription
          </h3>
          <p className="text-[11px] text-slate-500 font-sans">
            Your billing cycle renews on the 10th of next month. Searching limit: {currentPlan.leadLimit.toLocaleString()} monthly.
          </p>
        </div>

        {/* Limit Bar */}
        <div className="w-full md:w-56 shrink-0 space-y-1.5 text-xs text-slate-500 font-bold">
          <div className="flex justify-between items-center text-[10px] uppercase font-black text-slate-400">
            <span>Scan Quota Used</span>
            <span>24 / {currentPlan.leadLimit.toLocaleString()}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(24 / currentPlan.leadLimit) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Pricing Grids */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Premium SaaS Subscriptions</p>
          <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 p-1 rounded-lg text-xs">
            <button
              onClick={() => setBillingPeriod('month')}
              className={`px-3 py-1 rounded-md transition-all font-bold cursor-pointer ${
                billingPeriod === 'month' ? 'bg-white dark:bg-slate-900 shadow text-blue-600' : 'text-slate-500'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod('year')}
              className={`px-3 py-1 rounded-md transition-all font-bold cursor-pointer ${
                billingPeriod === 'year' ? 'bg-white dark:bg-slate-900 shadow text-blue-600' : 'text-slate-500'
              }`}
            >
              Annual Save 20%
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            const price = billingPeriod === 'year' ? Math.round(plan.price * 0.8) : plan.price;

            return (
              <div
                key={plan.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between shadow-sm relative transition-all ${
                  plan.isPopular
                    ? 'border-indigo-500 ring-2 ring-indigo-500/10'
                    : isDark
                      ? 'bg-slate-900 border-slate-800'
                      : 'bg-white border-slate-200'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-black uppercase text-[8px] px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 animate-pulse" /> Agency Pick
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h4>
                    <div className="flex items-baseline mt-2 gap-1 text-slate-500">
                      <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>${price}</span>
                      <span className="text-[10px] font-sans">/ {plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-sans">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <Check className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    disabled={isCurrent}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                        : plan.isPopular
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                          : 'bg-slate-850 hover:bg-slate-950 dark:bg-slate-800 dark:hover:bg-slate-750 text-white'
                    }`}
                  >
                    {isCurrent ? 'Active Subscription' : 'Select Package'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stripe payment overlay pop up */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-sm rounded-2xl border shadow-xl p-5 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <span className="text-[10px] uppercase font-black text-slate-400 flex items-center gap-1">
                💳 Stripe Secure Checkout
              </span>
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-150 dark:border-slate-850 text-xs text-slate-500 space-y-1">
                <p className="font-bold text-[10px] uppercase text-slate-400">Upgrading Plan:</p>
                <p className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedPlan.name} Subscrition
                </p>
                <p className="font-semibold text-emerald-500">
                  Total Bill: ${selectedPlan.price}/month
                </p>
              </div>

              {/* Card specifications */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Credit Card Number</label>
                  <input
                    type="text"
                    required
                    className={`w-full py-2 px-3 rounded-lg text-xs outline-none border font-mono ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Expiration</label>
                    <input
                      type="text"
                      required
                      className={`w-full py-2 px-3 rounded-lg text-xs outline-none border font-mono ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">CVC Code</label>
                    <input
                      type="text"
                      required
                      className={`w-full py-2 px-3 rounded-lg text-xs outline-none border font-mono ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  {loading ? 'Processing Encrypted Gateway...' : 'Authorize Stripe Settlement'}
                </button>
              </div>

              <p className="text-[9px] text-slate-400 text-center font-mono">
                Powered by Stripe Checkout API • SSL Secured 256-bit
              </p>
            </form>
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2 animate-fadeIn text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}
    </div>
  );
}
