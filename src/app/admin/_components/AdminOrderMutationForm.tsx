'use client'

/**
 * ──────────────────────────────────────────────────────────────
 *  5 HAZAAR TAK — Admin Order Mutation Form
 *
 *  Client component for updating order status, payment status,
 *  courier details, and admin notes via PATCH /api/admin/orders/[id]
 * ──────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react'
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAKISTANI_COURIERS,
  type OrderStatus,
  type PaymentStatus,
} from '@/lib/orders/admin-order-types'
import { Save, CheckCircle2, AlertCircle } from 'lucide-react'

interface AdminOrderMutationFormProps {
  orderId: string
  currentOrderStatus: OrderStatus
  currentPaymentStatus: PaymentStatus
  currentCourierName: string | null
  currentTrackingNumber: string | null
  currentAdminNotes: string | null
}

type SaveState = 'idle' | 'saving' | 'success' | 'error'

export default function AdminOrderMutationForm({
  orderId,
  currentOrderStatus,
  currentPaymentStatus,
  currentCourierName,
  currentTrackingNumber,
  currentAdminNotes,
}: AdminOrderMutationFormProps) {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(currentOrderStatus)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(currentPaymentStatus)
  const [courierName, setCourierName] = useState(currentCourierName ?? '')
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber ?? '')
  const [adminNotes, setAdminNotes] = useState(currentAdminNotes ?? '')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaveState('saving')
    setErrorMessage(null)

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_status: orderStatus,
          payment_status: paymentStatus,
          courier_name: courierName.trim() || null,
          tracking_number: trackingNumber.trim() || null,
          admin_notes: adminNotes.trim() || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`)
      }

      setSaveState('success')
      // Reset success state after 3 seconds
      setTimeout(() => setSaveState('idle'), 3000)
    } catch (err) {
      setSaveState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save changes.')
    }
  }

  const statusLabels: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    returned: 'Returned',
  }

  const paymentLabels: Record<PaymentStatus, string> = {
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
  }

  return (
    <form onSubmit={handleSubmit} className="mutation-form">
      <div className="mutation-form-header">
        <h3 className="mutation-form-title">Update Order</h3>
        <p className="mutation-form-subtitle">Changes are saved immediately to the database</p>
      </div>

      <div className="mutation-fields">
        {/* Order Status */}
        <div className="mutation-field">
          <label className="mutation-label" htmlFor={`order-status-${orderId}`}>
            Order Status
          </label>
          <select
            id={`order-status-${orderId}`}
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
            className="mutation-select"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status */}
        <div className="mutation-field">
          <label className="mutation-label" htmlFor={`payment-status-${orderId}`}>
            Payment Status
          </label>
          <select
            id={`payment-status-${orderId}`}
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
            className="mutation-select"
          >
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {paymentLabels[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Courier Name */}
        <div className="mutation-field">
          <label className="mutation-label" htmlFor={`courier-${orderId}`}>
            Courier
          </label>
          <select
            id={`courier-${orderId}`}
            value={courierName}
            onChange={(e) => setCourierName(e.target.value)}
            className="mutation-select"
          >
            <option value="">Not assigned</option>
            {PAKISTANI_COURIERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Tracking Number */}
        <div className="mutation-field">
          <label className="mutation-label" htmlFor={`tracking-${orderId}`}>
            Tracking Number
          </label>
          <input
            id={`tracking-${orderId}`}
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g. TCS-1234567890"
            className="mutation-input"
            maxLength={100}
          />
        </div>

        {/* Admin Notes */}
        <div className="mutation-field mutation-field--full">
          <label className="mutation-label" htmlFor={`notes-${orderId}`}>
            Admin Notes (internal only)
          </label>
          <textarea
            id={`notes-${orderId}`}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Internal notes about this order…"
            className="mutation-textarea"
            rows={3}
            maxLength={2000}
          />
        </div>
      </div>

      {/* Feedback Messages */}
      {saveState === 'error' && errorMessage && (
        <div role="alert" className="mutation-feedback mutation-feedback--error">
          <AlertCircle size={16} />
          {errorMessage}
        </div>
      )}

      {saveState === 'success' && (
        <div role="status" className="mutation-feedback mutation-feedback--success">
          <CheckCircle2 size={16} />
          Order updated successfully
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={saveState === 'saving'}
        className="mutation-submit"
      >
        {saveState === 'saving' ? (
          <>
            <span className="mutation-spinner" aria-hidden="true" />
            Saving…
          </>
        ) : (
          <>
            <Save size={16} />
            Save Changes
          </>
        )}
      </button>

      <style>{`
        .mutation-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .mutation-form-header { margin-bottom: 0.25rem; }
        .mutation-form-title {
          font-size: 1rem;
          font-weight: 600;
          color: #f8fafc;
          margin: 0 0 0.25rem;
        }
        .mutation-form-subtitle {
          font-size: 0.8125rem;
          color: #64748b;
          margin: 0;
        }
        .mutation-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .mutation-field {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .mutation-field--full { grid-column: 1 / -1; }
        .mutation-label {
          font-size: 0.8125rem;
          font-weight: 500;
          color: #94a3b8;
        }
        .mutation-select,
        .mutation-input {
          padding: 0.625rem 0.875rem;
          background: rgba(15,23,42,0.8);
          border: 1px solid rgba(71,85,105,0.5);
          border-radius: 0.5rem;
          color: #e2e8f0;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .mutation-select:focus,
        .mutation-input:focus { border-color: #6366f1; }
        .mutation-textarea {
          padding: 0.625rem 0.875rem;
          background: rgba(15,23,42,0.8);
          border: 1px solid rgba(71,85,105,0.5);
          border-radius: 0.5rem;
          color: #e2e8f0;
          font-size: 0.875rem;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .mutation-textarea:focus { border-color: #6366f1; }
        .mutation-feedback {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }
        .mutation-feedback--error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          color: #fca5a5;
        }
        .mutation-feedback--success {
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.25);
          color: #6ee7b7;
        }
        .mutation-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
          align-self: flex-start;
        }
        .mutation-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .mutation-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          .mutation-fields { grid-template-columns: 1fr; }
          .mutation-field--full { grid-column: 1; }
        }
      `}</style>
    </form>
  )
}
