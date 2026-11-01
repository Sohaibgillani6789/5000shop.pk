"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import CustomerAddressForm, {
  type CustomerFormData,
} from "./CustomerAddressForm";
import PaymentMethodSelector from "./PaymentMethodSelector";
import CheckoutSummary from "./CheckoutSummary";
import {
  PAKISTAN_MOBILE_REGEX,
  PAKISTAN_PROVINCES,
  type PakistanProvince,
} from "@/lib/checkout/constants";

const INITIAL_FORM_DATA: CustomerFormData = {
  customerName: "",
  phone: "",
  email: "",
  province: "",
  city: "",
  area: "",
  address: "",
  landmark: "",
  postalCode: "",
  deliveryNotes: "",
};

export default function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, isHydrated, clearCart } = useCart();

  const [formData, setFormData] = useState<CustomerFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Idempotency Key Generation (Per Mount / Session) ──
  const idempotencyKeyRef = useRef<string>("");
  useEffect(() => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `5ht-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
  }, []);

  const handleFieldChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear specific field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (apiError) {
      setApiError(null);
    }
  };

  /** Client-side validation before sending request to server */
  const validateForm = (): { isValid: boolean; firstKey?: string } => {
    const newErrors: Partial<Record<keyof CustomerFormData, string>> = {};

    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      newErrors.customerName = "Name must be at least 2 characters long.";
    }

    // Phone sanitization for validation
    const rawPhone = formData.phone.replace(/[\s\-()]/g, "");
    let normalizedPhone = rawPhone;
    if (rawPhone.startsWith("+92")) {
      normalizedPhone = "0" + rawPhone.slice(3);
    } else if (rawPhone.startsWith("0092")) {
      normalizedPhone = "0" + rawPhone.slice(4);
    } else if (rawPhone.startsWith("92") && rawPhone.length === 12) {
      normalizedPhone = "0" + rawPhone.slice(2);
    }

    if (!PAKISTAN_MOBILE_REGEX.test(normalizedPhone)) {
      newErrors.phone =
        "Enter a valid 11-digit Pakistani mobile number (e.g. 03001234567).";
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!formData.province || !PAKISTAN_PROVINCES.includes(formData.province as PakistanProvince)) {
      newErrors.province = "Please select your province / territory.";
    }

    if (!formData.city.trim() || formData.city.trim().length < 2) {
      newErrors.city = "City is required.";
    }

    if (!formData.area.trim() || formData.area.trim().length < 2) {
      newErrors.area = "Area / Town / Sector is required.";
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      newErrors.address = "Complete address must be at least 5 characters.";
    }

    setErrors(newErrors);
    const errorKeys = Object.keys(newErrors);
    return {
      isValid: errorKeys.length === 0,
      firstKey: errorKeys[0],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (items.length === 0) {
      setApiError("Your cart is empty. Please add items before checking out.");
      return;
    }

    const validation = validateForm();
    if (!validation.isValid) {
      // Scroll smoothly to the first error
      if (validation.firstKey) {
        document.getElementById(validation.firstKey)?.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        province: formData.province,
        city: formData.city.trim(),
        area: formData.area.trim(),
        address: formData.address.trim(),
        landmark: formData.landmark.trim() || null,
        postalCode: formData.postalCode.trim() || null,
        deliveryNotes: formData.deliveryNotes.trim() || null,
        paymentMethod: "cod" as const,
        idempotencyKey: idempotencyKeyRef.current,
        items: items.map((item) => ({
          productId: item.productId,
          slug: item.slug,
          quantity: item.quantity,
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          // Map field errors from Zod if available
          const serverFieldErrors: Partial<Record<keyof CustomerFormData, string>> = {};
          data.details.forEach((issue: { path?: string[]; message?: string }) => {
            const field = issue.path?.[0] as keyof CustomerFormData;
            if (field && issue.message) {
              serverFieldErrors[field] = issue.message;
            }
          });
          if (Object.keys(serverFieldErrors).length > 0) {
            setErrors(serverFieldErrors);
          }
        }
        throw new Error(data.error || "Unable to place your order. Please review your details.");
      }

      // Order created successfully!
      const { orderNumber, confirmationToken } = data;

      // Clear client cart after verified 201 response
      clearCart();

      // Redirect immediately to secure confirmation page
      router.push(`/order-confirmation/${orderNumber}?token=${confirmationToken}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected network error occurred. Please check your connection and try again.";
      setApiError(message);
      setIsSubmitting(false);
    }
  };

  // ── Hydration Guard ──
  if (!isHydrated) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-[#F47514] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs uppercase font-bold tracking-wider text-neutral-400">
          Loading Checkout...
        </p>
      </div>
    );
  }

  // ── Empty Cart View ──
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#FFF5EB] border border-[#F47514]/25 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <ShoppingBag size={38} className="text-[#F47514]" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
          You don&apos;t have any products in your cart yet. Browse our verified products under ₨5,000 to begin checkout.
        </p>
        <Link
          href="/#categories"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#1A1108] hover:bg-[#F47514] active:bg-[#DF5E03] text-white hover:text-black font-extrabold text-sm uppercase tracking-wider shadow-lg transition-all"
        >
          <span>Explore Catalog</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ── API Error Alert ── */}
      {apiError && (
        <div
          role="alert"
          className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 shadow-sm"
        >
          <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold">Failed to Complete Order</p>
            <p className="mt-0.5 text-red-700">{apiError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DAC8] shadow-sm">
          {/* Customer & Address Form */}
          <CustomerAddressForm
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
            disabled={isSubmitting}
          />

          {/* Payment Method Selector */}
          <div className="pt-6 border-t border-[rgba(244,117,20,0.15)]">
            <PaymentMethodSelector />
          </div>

          {/* Submit Action (Mobile & Desktop) */}
          <div className="pt-6 border-t border-[rgba(244,117,20,0.15)]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-8 rounded-full bg-[#F47514] hover:bg-[#DF5E03] active:bg-[#B44100] disabled:opacity-60 disabled:cursor-not-allowed text-black font-extrabold text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin text-black" />
                  <span>Processing Your Order...</span>
                </>
              ) : (
                <>
                  <Lock size={18} className="text-black" />
                  <span>Place Cash on Delivery Order</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-neutral-500 font-semibold text-center">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>By placing your order, you agree to inspect & pay in cash on arrival.</span>
            </div>
          </div>
        </div>

        {/* Right Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 sticky top-28">
          <CheckoutSummary items={items} subtotal={subtotal} />
        </div>
      </div>
    </form>
  );
}
