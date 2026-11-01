/**
 * ──────────────────────────────────────────────────────────────
 *  5 HAZAAR TAK — Admin Order Detail Page
 *
 *  Full order inspection with all PII visible to admin:
 *  - Customer contact (phone, email, WhatsApp link, click-to-call)
 *  - Complete delivery address
 *  - Itemized order ledger
 *  - Inline mutation form for status/courier/tracking/notes
 * ──────────────────────────────────────────────────────────────
 */

import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Package,
  Hash,
  Calendar,
  Truck,
  CreditCard,
} from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import type {
  AdminOrderWithItems,
  OrderStatus,
} from '@/lib/orders/admin-order-types'
import AdminOrderMutationForm from '@/app/admin/_components/AdminOrderMutationForm'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return { title: `Order ${id.slice(0, 8)}…` }
}

// ── Helpers ──────────────────────────────────────────────────

function formatPKR(amount: number) {
  return `₨${amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-PK', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    '#fbbf24',
  confirmed:  '#60a5fa',
  processing: '#a78bfa',
  shipped:    '#818cf8',
  delivered:  '#34d399',
  cancelled:  '#f87171',
  returned:   '#94a3b8',
}

// ── Page ─────────────────────────────────────────────────────

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params

  // Validate UUID format before DB call
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!UUID_REGEX.test(id)) {
    notFound()
  }

  const adminDb = createAdminClient()

  // Fetch order with items in one query using join
  const { data: order, error } = await adminDb
    .from('orders')
    .select(
      `
      *,
      order_items (
        id, product_id, product_title, product_slug,
        unit_price, quantity, line_total, image_url, created_at
      )
      `
    )
    .eq('id', id)
    .single()

  if (error || !order) {
    notFound()
  }

  const typedOrder = order as AdminOrderWithItems
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const waText = encodeURIComponent(
    `Assalam-o-Alaikum! Calling about order ${typedOrder.order_number} on 5 Hazaar Tak. Please confirm your order.`
  )
  const statusColor = STATUS_COLORS[typedOrder.order_status] ?? '#94a3b8'

  return (
    <div className="order-detail">
      {/* Back Navigation */}
      <Link href="/admin/orders" className="order-back-link">
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      {/* Page Header */}
      <div className="order-detail-header">
        <div>
          <div className="order-detail-number">{typedOrder.order_number}</div>
          <div className="order-detail-date">
            <Calendar size={14} />
            {formatDateTime(typedOrder.created_at)}
          </div>
        </div>
        <span
          className="order-status-badge"
          style={{ color: statusColor, borderColor: `${statusColor}40`, background: `${statusColor}12` }}
        >
          {typedOrder.order_status.charAt(0).toUpperCase() + typedOrder.order_status.slice(1)}
        </span>
      </div>

      <div className="order-detail-grid">
        {/* LEFT COLUMN */}
        <div className="order-detail-left">

          {/* Customer Card */}
          <section className="order-card">
            <h2 className="order-card-title">
              <Phone size={16} /> Customer
            </h2>
            <div className="order-info-list">
              <div className="order-info-row">
                <span className="order-info-label">Name</span>
                <span className="order-info-value">{typedOrder.customer_name}</span>
              </div>
              <div className="order-info-row">
                <span className="order-info-label">Phone</span>
                <div className="order-info-actions">
                  <a href={`tel:${typedOrder.phone}`} className="order-contact-link order-contact-link--call">
                    <Phone size={13} /> {typedOrder.phone}
                  </a>
                  {whatsappNum && (
                    <a
                      href={`https://wa.me/${typedOrder.phone.replace(/^0/, '92')}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="order-contact-link order-contact-link--whatsapp"
                    >
                      <MessageCircle size={13} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
              {typedOrder.email && (
                <div className="order-info-row">
                  <span className="order-info-label">Email</span>
                  <a href={`mailto:${typedOrder.email}`} className="order-info-value order-email-link">
                    <Mail size={13} /> {typedOrder.email}
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Delivery Address Card */}
          <section className="order-card">
            <h2 className="order-card-title">
              <MapPin size={16} /> Delivery Address
            </h2>
            <div className="order-info-list">
              <div className="order-info-row">
                <span className="order-info-label">Province</span>
                <span className="order-info-value">{typedOrder.province}</span>
              </div>
              <div className="order-info-row">
                <span className="order-info-label">City</span>
                <span className="order-info-value">{typedOrder.city}</span>
              </div>
              <div className="order-info-row">
                <span className="order-info-label">Area</span>
                <span className="order-info-value">{typedOrder.area}</span>
              </div>
              <div className="order-info-row">
                <span className="order-info-label">Address</span>
                <span className="order-info-value">{typedOrder.address}</span>
              </div>
              {typedOrder.landmark && (
                <div className="order-info-row">
                  <span className="order-info-label">Landmark</span>
                  <span className="order-info-value">{typedOrder.landmark}</span>
                </div>
              )}
              {typedOrder.postal_code && (
                <div className="order-info-row">
                  <span className="order-info-label">Postal Code</span>
                  <span className="order-info-value">{typedOrder.postal_code}</span>
                </div>
              )}
              {typedOrder.delivery_notes && (
                <div className="order-info-row">
                  <span className="order-info-label">Notes</span>
                  <span className="order-info-value order-notes">{typedOrder.delivery_notes}</span>
                </div>
              )}
            </div>
          </section>

          {/* Order Items Card */}
          <section className="order-card">
            <h2 className="order-card-title">
              <Package size={16} /> Items ({typedOrder.order_items.length})
            </h2>
            <div className="order-items-list">
              {typedOrder.order_items.map((item) => (
                <div key={item.id} className="order-item-row">
                  <div className="order-item-info">
                    <a
                      href={`/product/${item.product_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="order-item-title"
                    >
                      {item.product_title}
                    </a>
                    <div className="order-item-meta">
                      {formatPKR(item.unit_price)} × {item.quantity}
                    </div>
                  </div>
                  <div className="order-item-total">{formatPKR(item.line_total)}</div>
                </div>
              ))}
            </div>

            {/* Financials */}
            <div className="order-financials">
              <div className="order-financial-row">
                <span>Subtotal</span>
                <span>{formatPKR(typedOrder.subtotal)}</span>
              </div>
              <div className="order-financial-row">
                <span>Delivery Fee</span>
                <span>{formatPKR(typedOrder.delivery_fee)}</span>
              </div>
              {typedOrder.discount > 0 && (
                <div className="order-financial-row order-financial-row--discount">
                  <span>Discount</span>
                  <span>−{formatPKR(typedOrder.discount)}</span>
                </div>
              )}
              <div className="order-financial-row order-financial-row--total">
                <span>Total</span>
                <span>{formatPKR(typedOrder.total)}</span>
              </div>
            </div>
          </section>

          {/* Audit Card */}
          <section className="order-card">
            <h2 className="order-card-title">
              <Hash size={16} /> Audit Info
            </h2>
            <div className="order-info-list">
              <div className="order-info-row">
                <span className="order-info-label">Order ID</span>
                <span className="order-info-value order-mono">{typedOrder.id}</span>
              </div>
              <div className="order-info-row">
                <span className="order-info-label">Payment</span>
                <span className="order-info-value">
                  <CreditCard size={13} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  {typedOrder.payment_method.toUpperCase()} — {typedOrder.payment_status}
                </span>
              </div>
              {typedOrder.courier_name && (
                <div className="order-info-row">
                  <span className="order-info-label">Courier</span>
                  <span className="order-info-value">
                    <Truck size={13} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    {typedOrder.courier_name}
                    {typedOrder.tracking_number && ` — ${typedOrder.tracking_number}`}
                  </span>
                </div>
              )}
              <div className="order-info-row">
                <span className="order-info-label">Created</span>
                <span className="order-info-value">{formatDateTime(typedOrder.created_at)}</span>
              </div>
              <div className="order-info-row">
                <span className="order-info-label">Updated</span>
                <span className="order-info-value">{formatDateTime(typedOrder.updated_at)}</span>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN — Mutation Form */}
        <div className="order-detail-right">
          <section className="order-card order-card--sticky">
            <AdminOrderMutationForm
              orderId={typedOrder.id}
              currentOrderStatus={typedOrder.order_status}
              currentPaymentStatus={typedOrder.payment_status}
              currentCourierName={typedOrder.courier_name}
              currentTrackingNumber={typedOrder.tracking_number}
              currentAdminNotes={typedOrder.admin_notes}
            />
          </section>
        </div>
      </div>

      <style>{`
        .order-detail {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 1100px;
        }

        .order-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          color: #64748b;
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.15s;
        }
        .order-back-link:hover { color: #a5b4fc; }

        .order-detail-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .order-detail-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f8fafc;
          font-family: 'SF Mono', 'Fira Code', monospace;
        }

        .order-detail-date {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        .order-status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.375rem 1rem;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 600;
          border: 1px solid;
        }

        .order-detail-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 1.5rem;
          align-items: start;
        }

        .order-detail-left,
        .order-detail-right {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .order-card {
          background: #1e293b;
          border: 1px solid rgba(99,102,241,0.12);
          border-radius: 0.75rem;
          padding: 1.25rem;
        }

        .order-card--sticky {
          position: sticky;
          top: 2rem;
        }

        .order-card-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9375rem;
          font-weight: 600;
          color: #e2e8f0;
          margin: 0 0 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(99,102,241,0.1);
        }

        .order-info-list {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .order-info-row {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .order-info-label {
          font-size: 0.8125rem;
          color: #64748b;
          min-width: 100px;
          flex-shrink: 0;
          padding-top: 0.1rem;
        }

        .order-info-value {
          font-size: 0.875rem;
          color: #e2e8f0;
          flex: 1;
        }

        .order-notes {
          color: #94a3b8;
          font-style: italic;
        }

        .order-mono {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.75rem;
          color: #94a3b8;
          word-break: break-all;
        }

        .order-email-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: #a5b4fc;
          text-decoration: none;
        }

        .order-info-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .order-contact-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.3rem 0.7rem;
          border-radius: 0.375rem;
          font-size: 0.8125rem;
          font-weight: 500;
          text-decoration: none;
          transition: opacity 0.15s;
        }

        .order-contact-link:hover { opacity: 0.8; }

        .order-contact-link--call {
          background: rgba(96,165,250,0.1);
          border: 1px solid rgba(96,165,250,0.25);
          color: #93c5fd;
        }

        .order-contact-link--whatsapp {
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.25);
          color: #6ee7b7;
        }

        .order-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .order-item-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(99,102,241,0.07);
        }

        .order-item-row:last-child { border-bottom: none; padding-bottom: 0; }

        .order-item-info { flex: 1; }

        .order-item-title {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #e2e8f0;
          text-decoration: none;
          margin-bottom: 0.25rem;
        }
        .order-item-title:hover { color: #a5b4fc; }

        .order-item-meta {
          font-size: 0.75rem;
          color: #64748b;
        }

        .order-item-total {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #f8fafc;
          white-space: nowrap;
        }

        .order-financials {
          border-top: 1px solid rgba(99,102,241,0.12);
          padding-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .order-financial-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #94a3b8;
        }

        .order-financial-row--discount { color: #f87171; }

        .order-financial-row--total {
          font-size: 1rem;
          font-weight: 700;
          color: #34d399;
          border-top: 1px solid rgba(99,102,241,0.12);
          padding-top: 0.5rem;
          margin-top: 0.25rem;
        }

        @media (max-width: 900px) {
          .order-detail-grid {
            grid-template-columns: 1fr;
          }
          .order-card--sticky {
            position: static;
          }
          .order-detail-right {
            order: -1;
          }
        }
      `}</style>
    </div>
  )
}
