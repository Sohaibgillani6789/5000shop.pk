/**
 * ──────────────────────────────────────────────────────────────
 *  5 HAZAAR TAK — Admin Orders List
 *
 *  Server-rendered table of all orders, sorted by created_at DESC.
 *  Filterable by order_status and searchable by order_number/phone.
 *  Uses service-role client to bypass RLS for admin access.
 * ──────────────────────────────────────────────────────────────
 */

import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import type { AdminOrderListItem, OrderStatus } from '@/lib/orders/admin-order-types'
import { ORDER_STATUSES } from '@/lib/orders/admin-order-types'
import { Search, Package, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Orders',
}

// Force dynamic rendering so searchParams are always fresh
export const dynamic = 'force-dynamic'

const PAGE_SIZE = 25

interface PageProps {
  searchParams: Promise<{
    status?: string
    q?: string
    page?: string
  }>
}

// ── Status Badge Config ──────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  pending:    { label: 'Pending',    color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)' },
  confirmed:  { label: 'Confirmed',  color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)' },
  processing: { label: 'Processing', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)' },
  shipped:    { label: 'Shipped',    color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.3)' },
  delivered:  { label: 'Delivered',  color: '#34d399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.3)' },
  cancelled:  { label: 'Cancelled',  color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)' },
  returned:   { label: 'Returned',   color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.3)' },
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.2rem 0.6rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  )
}

function formatPKR(amount: number) {
  return `₨${amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

// ── Main Component ────────────────────────────────────────────

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const { status: statusFilter, q: query, page: pageStr } = await searchParams

  const page = Math.max(1, parseInt(pageStr ?? '1', 10))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const adminDb = createAdminClient()

  // ── Build query ──────────────────────────────────────────
  let dbQuery = adminDb
    .from('orders')
    .select(
      'id, order_number, customer_name, phone, city, province, total, payment_method, payment_status, order_status, courier_name, tracking_number, created_at',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to)

  // Status filter
  if (statusFilter && ORDER_STATUSES.includes(statusFilter as OrderStatus)) {
    dbQuery = dbQuery.eq('order_status', statusFilter)
  }

  // Text search (order_number or phone)
  if (query && query.trim().length > 0) {
    const q = query.trim()
    dbQuery = dbQuery.or(`order_number.ilike.%${q}%,phone.ilike.%${q}%,customer_name.ilike.%${q}%`)
  }

  const { data: orders, error, count } = await dbQuery

  if (error) {
    return (
      <div style={{ padding: '2rem', color: '#f87171' }}>
        <h2>Error loading orders</h2>
        <pre style={{ fontSize: '0.75rem' }}>{error.message}</pre>
      </div>
    )
  }

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)
  const typedOrders = (orders ?? []) as AdminOrderListItem[]

  // Build URL helper for pagination
  function buildUrl(newPage: number) {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (query) params.set('q', query)
    if (newPage > 1) params.set('page', String(newPage))
    const qs = params.toString()
    return `/admin/orders${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="orders-page">
      {/* Page Header */}
      <div className="orders-header">
        <div>
          <h1 className="orders-title">Orders</h1>
          <p className="orders-subtitle">
            {count ?? 0} total order{(count ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="orders-filters">
        {/* Search */}
        <form method="GET" className="orders-search-form">
          {statusFilter && (
            <input type="hidden" name="status" value={statusFilter} />
          )}
          <div className="orders-search-wrap">
            <Search size={15} className="orders-search-icon" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search by order #, phone, or name…"
              className="orders-search-input"
              aria-label="Search orders"
            />
          </div>
          <button type="submit" className="orders-filter-btn">Search</button>
          {(query || statusFilter) && (
            <Link href="/admin/orders" className="orders-clear-btn">Clear</Link>
          )}
        </form>

        {/* Status Filter Pills */}
        <div className="orders-status-pills">
          <Link
            href={query ? `/admin/orders?q=${encodeURIComponent(query)}` : '/admin/orders'}
            className={`orders-pill ${!statusFilter ? 'orders-pill--active' : ''}`}
          >
            All
          </Link>
          {ORDER_STATUSES.map((s) => {
            const cfg = STATUS_CONFIG[s]
            const params = new URLSearchParams({ status: s })
            if (query) params.set('q', query)
            return (
              <Link
                key={s}
                href={`/admin/orders?${params}`}
                className={`orders-pill ${statusFilter === s ? 'orders-pill--active' : ''}`}
                style={
                  statusFilter === s
                    ? { color: cfg.color, borderColor: cfg.border, background: cfg.bg }
                    : {}
                }
              >
                {cfg.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Orders Table */}
      {typedOrders.length === 0 ? (
        <div className="orders-empty">
          <Package size={40} strokeWidth={1} style={{ color: '#475569' }} />
          <p>No orders found</p>
          {(query || statusFilter) && (
            <Link href="/admin/orders" className="orders-filter-btn">Clear filters</Link>
          )}
        </div>
      ) : (
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Location</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {typedOrders.map((order) => (
                <tr key={order.id} className="orders-row">
                  <td>
                    <span className="orders-order-num">{order.order_number}</span>
                  </td>
                  <td>
                    <div className="orders-customer-name">{order.customer_name}</div>
                    <div className="orders-customer-phone">{order.phone}</div>
                  </td>
                  <td>
                    <div className="orders-location">{order.city}</div>
                    <div className="orders-province">{order.province}</div>
                  </td>
                  <td>
                    <span className="orders-total">{formatPKR(order.total)}</span>
                  </td>
                  <td>
                    <StatusBadge status={order.order_status} />
                  </td>
                  <td>
                    <span className="orders-payment-method">
                      {order.payment_method.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className="orders-date">{formatDate(order.created_at)}</span>
                  </td>
                  <td>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="orders-view-btn"
                      aria-label={`View order ${order.order_number}`}
                    >
                      <ExternalLink size={14} />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="orders-pagination">
          <Link
            href={buildUrl(page - 1)}
            className={`orders-page-btn ${page <= 1 ? 'orders-page-btn--disabled' : ''}`}
            aria-disabled={page <= 1}
            tabIndex={page <= 1 ? -1 : 0}
          >
            <ChevronLeft size={16} /> Previous
          </Link>
          <span className="orders-page-info">
            Page {page} of {totalPages}
          </span>
          <Link
            href={buildUrl(page + 1)}
            className={`orders-page-btn ${page >= totalPages ? 'orders-page-btn--disabled' : ''}`}
            aria-disabled={page >= totalPages}
            tabIndex={page >= totalPages ? -1 : 0}
          >
            Next <ChevronRight size={16} />
          </Link>
        </div>
      )}

      <style>{`
        .orders-page { display: flex; flex-direction: column; gap: 1.5rem; }

        .orders-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .orders-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f8fafc;
          margin: 0 0 0.25rem;
        }

        .orders-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .orders-filters {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          background: #1e293b;
          border: 1px solid rgba(99,102,241,0.12);
          border-radius: 0.75rem;
          padding: 1rem;
        }

        .orders-search-form {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          flex-wrap: wrap;
        }

        .orders-search-wrap {
          position: relative;
          flex: 1;
          min-width: 220px;
        }

        .orders-search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }

        .orders-search-input {
          width: 100%;
          padding: 0.625rem 0.875rem 0.625rem 2.25rem;
          background: rgba(15,23,42,0.8);
          border: 1px solid rgba(71,85,105,0.5);
          border-radius: 0.5rem;
          color: #e2e8f0;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .orders-search-input:focus { border-color: #6366f1; }
        .orders-search-input::placeholder { color: #475569; }

        .orders-filter-btn {
          padding: 0.625rem 1rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .orders-clear-btn {
          padding: 0.625rem 0.875rem;
          background: rgba(71,85,105,0.2);
          border: 1px solid rgba(71,85,105,0.3);
          border-radius: 0.5rem;
          color: #94a3b8;
          font-size: 0.8125rem;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .orders-status-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }

        .orders-pill {
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid rgba(71,85,105,0.3);
          color: #64748b;
          text-decoration: none;
          transition: all 0.15s;
        }

        .orders-pill:hover { border-color: rgba(99,102,241,0.3); color: #a5b4fc; }
        .orders-pill--active { color: #a5b4fc; border-color: rgba(99,102,241,0.3); background: rgba(99,102,241,0.1); }

        .orders-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 4rem 1rem;
          color: #64748b;
          font-size: 0.9375rem;
          background: #1e293b;
          border: 1px solid rgba(99,102,241,0.12);
          border-radius: 0.75rem;
        }

        .orders-table-wrap {
          background: #1e293b;
          border: 1px solid rgba(99,102,241,0.12);
          border-radius: 0.75rem;
          overflow: hidden;
          overflow-x: auto;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
          min-width: 800px;
        }

        .orders-table thead tr {
          background: rgba(15,23,42,0.5);
          border-bottom: 1px solid rgba(99,102,241,0.12);
        }

        .orders-table th {
          padding: 0.875rem 1rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        .orders-row {
          border-bottom: 1px solid rgba(99,102,241,0.07);
          transition: background 0.12s;
        }

        .orders-row:hover { background: rgba(99,102,241,0.05); }
        .orders-row:last-child { border-bottom: none; }

        .orders-table td {
          padding: 0.875rem 1rem;
          vertical-align: middle;
        }

        .orders-order-num {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #a5b4fc;
        }

        .orders-customer-name { font-weight: 500; color: #e2e8f0; }
        .orders-customer-phone { font-size: 0.75rem; color: #64748b; margin-top: 0.125rem; }
        .orders-location { font-size: 0.875rem; color: #cbd5e1; }
        .orders-province { font-size: 0.75rem; color: #64748b; margin-top: 0.125rem; }
        .orders-total { font-weight: 700; color: #34d399; font-size: 0.9375rem; }
        .orders-payment-method { font-size: 0.75rem; color: #94a3b8; font-weight: 600; }
        .orders-date { font-size: 0.75rem; color: #64748b; white-space: nowrap; }

        .orders-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 0.375rem;
          color: #a5b4fc;
          font-size: 0.8125rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.15s;
        }

        .orders-view-btn:hover {
          background: rgba(99,102,241,0.2);
          border-color: rgba(99,102,241,0.4);
        }

        .orders-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1rem;
        }

        .orders-page-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 1rem;
          background: #1e293b;
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 0.5rem;
          color: #a5b4fc;
          font-size: 0.875rem;
          text-decoration: none;
          transition: all 0.15s;
        }

        .orders-page-btn:hover:not(.orders-page-btn--disabled) {
          background: rgba(99,102,241,0.1);
        }

        .orders-page-btn--disabled {
          opacity: 0.4;
          pointer-events: none;
        }

        .orders-page-info {
          font-size: 0.875rem;
          color: #64748b;
        }
      `}</style>
    </div>
  )
}
