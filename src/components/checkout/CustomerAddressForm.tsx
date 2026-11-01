"use client";

import React from "react";
import { User, Phone, Mail, MapPin, Building, Navigation, FileText } from "lucide-react";
import { PAKISTAN_PROVINCES, type PakistanProvince } from "@/lib/checkout/constants";

export interface CustomerFormData {
  customerName: string;
  phone: string;
  email: string;
  province: PakistanProvince | "";
  city: string;
  area: string;
  address: string;
  landmark: string;
  postalCode: string;
  deliveryNotes: string;
}

interface CustomerAddressFormProps {
  formData: CustomerFormData;
  errors: Partial<Record<keyof CustomerFormData, string>>;
  onChange: (field: keyof CustomerFormData, value: string) => void;
  disabled?: boolean;
}

export default function CustomerAddressForm({
  formData,
  errors,
  onChange,
  disabled = false,
}: CustomerAddressFormProps) {
  return (
    <div className="space-y-6 font-['Outfit',var(--font-outfit),sans-serif]">
      {/* ── Section: Contact Details ── */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#8C3A02] mb-3 flex items-center gap-1.5">
          <User size={14} className="text-[#F47514]" />
          <span>Contact Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label
              htmlFor="customerName"
              className="block text-xs font-bold text-neutral-800 mb-1"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="customerName"
                name="customerName"
                type="text"
                autoComplete="name"
                required
                disabled={disabled}
                placeholder="Muhammad Ali"
                value={formData.customerName}
                onChange={(e) => onChange("customerName", e.target.value)}
                aria-invalid={Boolean(errors.customerName)}
                aria-describedby={errors.customerName ? "customerName-error" : undefined}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                  errors.customerName
                    ? "border-red-400 focus:ring-red-300"
                    : "border-[#E5DAC8] focus:border-[#F47514] focus:ring-[#F47514]/20"
                }`}
              />
            </div>
            {errors.customerName && (
              <p
                id="customerName-error"
                role="alert"
                className="mt-1 text-xs text-red-600 font-semibold"
              >
                {errors.customerName}
              </p>
            )}
          </div>

          {/* Mobile Phone (Pakistani) */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-bold text-neutral-800 mb-1"
            >
              Mobile Number (WhatsApp/Call) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Phone size={14} />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                disabled={disabled}
                placeholder="0300-1234567"
                value={formData.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby="phone-hint"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                  errors.phone
                    ? "border-red-400 focus:ring-red-300"
                    : "border-[#E5DAC8] focus:border-[#F47514] focus:ring-[#F47514]/20"
                }`}
              />
            </div>
            <p id="phone-hint" className="mt-1 text-[11px] text-neutral-500">
              Format: 03001234567 or 03XX-XXXXXXX (Jazz, Zong, Ufone, Telenor, SCOM)
            </p>
            {errors.phone && (
              <p
                role="alert"
                className="mt-1 text-xs text-red-600 font-semibold"
              >
                {errors.phone}
              </p>
            )}
          </div>

          {/* Optional Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-neutral-800 mb-1"
            >
              Email Address <span className="text-neutral-400 text-[11px] font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Mail size={14} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                disabled={disabled}
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => onChange("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                  errors.email
                    ? "border-red-400 focus:ring-red-300"
                    : "border-[#E5DAC8] focus:border-[#F47514] focus:ring-[#F47514]/20"
                }`}
              />
            </div>
            {errors.email && (
              <p
                role="alert"
                className="mt-1 text-xs text-red-600 font-semibold"
              >
                {errors.email}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Section: Shipping & Delivery Address ── */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#8C3A02] mb-3 flex items-center gap-1.5">
          <MapPin size={14} className="text-[#F47514]" />
          <span>Delivery Address (Pakistan)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Province Dropdown */}
          <div>
            <label
              htmlFor="province"
              className="block text-xs font-bold text-neutral-800 mb-1"
            >
              Province / Territory <span className="text-red-500">*</span>
            </label>
            <select
              id="province"
              name="province"
              required
              disabled={disabled}
              value={formData.province}
              onChange={(e) => onChange("province", e.target.value)}
              aria-invalid={Boolean(errors.province)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 transition-all disabled:opacity-60 cursor-pointer ${
                errors.province
                  ? "border-red-400 focus:ring-red-300"
                  : "border-[#E5DAC8] focus:border-[#F47514] focus:ring-[#F47514]/20"
              }`}
            >
              <option value="">Select Province / Territory</option>
              {PAKISTAN_PROVINCES.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
            {errors.province && (
              <p
                role="alert"
                className="mt-1 text-xs text-red-600 font-semibold"
              >
                {errors.province}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-xs font-bold text-neutral-800 mb-1"
            >
              City <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Building size={14} />
              </div>
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                required
                disabled={disabled}
                placeholder="Lahore, Karachi, Islamabad..."
                value={formData.city}
                onChange={(e) => onChange("city", e.target.value)}
                aria-invalid={Boolean(errors.city)}
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                  errors.city
                    ? "border-red-400 focus:ring-red-300"
                    : "border-[#E5DAC8] focus:border-[#F47514] focus:ring-[#F47514]/20"
                }`}
              />
            </div>
            {errors.city && (
              <p
                role="alert"
                className="mt-1 text-xs text-red-600 font-semibold"
              >
                {errors.city}
              </p>
            )}
          </div>

          {/* Area / Town / Sector */}
          <div className="sm:col-span-2">
            <label
              htmlFor="area"
              className="block text-xs font-bold text-neutral-800 mb-1"
            >
              Area / Town / Sector / Mohallah <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Navigation size={14} />
              </div>
              <input
                id="area"
                name="area"
                type="text"
                required
                disabled={disabled}
                placeholder="Gulberg III, DHA Phase 5, F-10/2, Clifton Block 2..."
                value={formData.area}
                onChange={(e) => onChange("area", e.target.value)}
                aria-invalid={Boolean(errors.area)}
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                  errors.area
                    ? "border-red-400 focus:ring-red-300"
                    : "border-[#E5DAC8] focus:border-[#F47514] focus:ring-[#F47514]/20"
                }`}
              />
            </div>
            {errors.area && (
              <p
                role="alert"
                className="mt-1 text-xs text-red-600 font-semibold"
              >
                {errors.area}
              </p>
            )}
          </div>

          {/* Complete Street Address */}
          <div className="sm:col-span-2">
            <label
              htmlFor="address"
              className="block text-xs font-bold text-neutral-800 mb-1"
            >
              Complete Street Address / House / Flat No <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              rows={2}
              autoComplete="street-address"
              required
              disabled={disabled}
              placeholder="House # 12, Street # 4, Main Boulevard"
              value={formData.address}
              onChange={(e) => onChange("address", e.target.value)}
              aria-invalid={Boolean(errors.address)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 resize-none ${
                errors.address
                  ? "border-red-400 focus:ring-red-300"
                  : "border-[#E5DAC8] focus:border-[#F47514] focus:ring-[#F47514]/20"
              }`}
            />
            {errors.address && (
              <p
                role="alert"
                className="mt-1 text-xs text-red-600 font-semibold"
              >
                {errors.address}
              </p>
            )}
          </div>

          {/* Nearest Landmark (Optional) */}
          <div>
            <label
              htmlFor="landmark"
              className="block text-xs font-bold text-neutral-800 mb-1"
            >
              Nearest Landmark <span className="text-neutral-400 text-[11px] font-normal">(Optional)</span>
            </label>
            <input
              id="landmark"
              name="landmark"
              type="text"
              disabled={disabled}
              placeholder="Near Bilal Masjid, Opposite Shell pump"
              value={formData.landmark}
              onChange={(e) => onChange("landmark", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DAC8] text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:border-[#F47514] focus:ring-2 focus:ring-[#F47514]/20 transition-all disabled:opacity-60"
            />
          </div>

          {/* Postal Code (Optional) */}
          <div>
            <label
              htmlFor="postalCode"
              className="block text-xs font-bold text-neutral-800 mb-1"
            >
              Postal Code <span className="text-neutral-400 text-[11px] font-normal">(Optional)</span>
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              disabled={disabled}
              placeholder="54000"
              value={formData.postalCode}
              onChange={(e) => onChange("postalCode", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DAC8] text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:border-[#F47514] focus:ring-2 focus:ring-[#F47514]/20 transition-all disabled:opacity-60"
            />
          </div>

          {/* Delivery Notes (Optional) */}
          <div className="sm:col-span-2">
            <label
              htmlFor="deliveryNotes"
              className="block text-xs font-bold text-neutral-800 mb-1 flex items-center gap-1"
            >
              <FileText size={13} className="text-neutral-500" />
              <span>Special Delivery Instructions</span>
              <span className="text-neutral-400 text-[11px] font-normal">(Optional)</span>
            </label>
            <input
              id="deliveryNotes"
              name="deliveryNotes"
              type="text"
              disabled={disabled}
              placeholder="e.g. Please call before delivery, or deliver after 2:00 PM"
              value={formData.deliveryNotes}
              onChange={(e) => onChange("deliveryNotes", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DAC8] text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:border-[#F47514] focus:ring-2 focus:ring-[#F47514]/20 transition-all disabled:opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
