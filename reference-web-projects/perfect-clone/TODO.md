# 1Capture Clone - TODO

## ✅ Completed (Mock Data)

### Core Infrastructure
- [x] Design system (dark/light theme, CSS variables, gradients)
- [x] Constants file (APP_NAME, STORAGE_KEYS, NAV_SECTIONS, PLAN_TIERS)
- [x] TypeScript types for all entities
- [x] Utility functions (calculations, formatting, storage)
- [x] Custom hooks (useLocalStorage, useTheme)
- [x] Mock data for all entities
- [x] Central layout system (DashboardLayout, AppSidebar, AppHeader)

### Pages (30 pages)
- [x] Dashboard - Overview with charts and stats
- [x] Analytics - Deep dive metrics with charts
- [x] Reports - Report generation and export
- [x] Trials - Active trials management
- [x] Conversions - Trial-to-paid tracking
- [x] Funnel - Visual conversion funnel
- [x] Smart Charge - Configuration and stats
- [x] Customers - Customer list with search/filter
- [x] Segments - Customer segmentation
- [x] Blocked Users - Disputer blocking (CRUD with localStorage)
- [x] Transactions - Payment transaction list
- [x] Chargebacks - Dispute management
- [x] Revenue - Revenue metrics and charts
- [x] Invoices - Invoice management
- [x] AI Insights - AI-powered recommendations
- [x] Experiments - A/B test management
- [x] Recommendations - Actionable suggestions
- [x] Checkout Pages - Checkout page management
- [x] Channels - Attribution by channel
- [x] Events - Custom event tracking
- [x] Campaigns - Campaign performance
- [x] Integrations - Third-party integrations
- [x] Webhooks - Webhook endpoint management
- [x] API Keys - API key management with reveal/copy
- [x] Settings - General preferences (localStorage)
- [x] Team - Team member management
- [x] Billing - Subscription and plan management
- [x] Notification Settings - Email/Slack notification config (localStorage)
- [x] Audit Log - Action tracking with search
- [x] Discount Codes - Coupon management

### Features
- [x] Dark/light theme toggle (localStorage persisted)
- [x] Collapsible sidebar (localStorage persisted)
- [x] Mobile responsive sidebar
- [x] Notification dropdown in header
- [x] Profile dropdown with logout
- [x] Search and filter on list pages
- [x] Status badges with semantic colors
- [x] Charts (Area, Bar, Pie) with Recharts
- [x] Data tables with column configuration
- [x] Smart Charge settings (localStorage CRUD)
- [x] Blocked users (localStorage CRUD)
- [x] Notification preferences (localStorage CRUD)
- [x] General settings (localStorage CRUD)

## 🔄 Future Enhancements (Requires Backend)
- [ ] Real authentication (login/signup/password reset)
- [ ] Stripe integration for actual payments
- [ ] Real-time webhook delivery
- [ ] Database-backed CRUD operations
- [ ] File upload for checkout page customization
- [ ] Email sending for notifications
- [ ] Slack bot integration
- [ ] Real A/B test engine
- [ ] AI/ML model for insights
- [ ] Role-based access control
- [ ] Multi-tenant support
- [ ] Real-time dashboard updates (WebSocket)
- [ ] CSV/PDF export functionality
- [ ] Search across all entities
- [ ] Pagination for large datasets
- [ ] Drag-and-drop checkout page builder
