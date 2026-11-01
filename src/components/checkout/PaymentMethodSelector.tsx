"use client";

import React from "react";
import { Banknote, ShieldCheck, PhoneCall, CheckCircle2 } from "lucide-react";

export default function PaymentMethodSelector() {
  return (
    <div className="space-y-4 font-['Outfit',var(--font-outfit),sans-serif]">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#8C3A02]">
          Payment Method
        </label>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          Zero Upfront Payment
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Payment method selection"
        className="space-y-3"
      >
        {/* ── Active Cash on Delivery Option ── */}
        <div
          role="radio"
          aria-checked="true"
          tabIndex={0}
          className="relative rounded-2xl p-5 border-2 border-[#F47514] bg-[#FFFBF8] shadow-sm transition-all cursor-pointer flex flex-col gap-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F47514]/15 border border-[#F47514]/30 flex items-center justify-center text-[#DF5E03] shrink-0">
                <Banknote size={22} strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-neutral-900 tracking-tight">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F47514] text-white px-2 py-0.5 rounded-md">
                    Active
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Pay securely in Pakistani Rupees (₨) when your parcel arrives at your doorstep.
                </p>
              </div>
            </div>

            <CheckCircle2
              size={20}
              className="text-[#F47514] shrink-0 mt-0.5"
            />
          </div>

          {/* Verification & Trust Notice */}
          <div className="mt-1 pt-3 border-t border-[rgba(244,117,20,0.15)] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700">
            <div className="flex items-center gap-2">
              <PhoneCall size={14} className="text-[#DF5E03] shrink-0" />
              <span>Free phone/WhatsApp confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
              <span>Official courier delivery receipt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
