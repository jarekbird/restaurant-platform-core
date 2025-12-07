# Prototype Constraints

**Phase 3 Implementation Guidelines**

This document defines the constraints for Phase 3 implementation of `restaurant-platform-core`. This application is a **prototype/demo tool**, not a production ordering platform.

## Core Constraints

### Payment Processing
- ❌ **NO payment gateway integration** (Stripe, PayPal, Square, etc.)
- ❌ **NO payment processing of any kind**
- ✅ Orders are mock/demo-only (console logs, confirmation modals)

### POS Integration
- ❌ **NO POS system integration**
- ❌ **NO order routing to kitchen systems**
- ✅ Orders exist only in client-side state and console logs

### Backend Persistence
- ❌ **NO order persistence to database**
- ❌ **NO backend API for order submission**
- ✅ Cart state is client-side only (localStorage)
- ✅ Orders are logged to console only

### Order Routing
- ❌ **NO live order routing**
- ❌ **NO order fulfillment systems**
- ✅ Orders are displayed in confirmation modals only

## What IS Allowed

### Front-End Only Features
- ✅ **Analytics events** (console.log, front-end tracking)
- ✅ **Toast notifications** (user feedback)
- ✅ **Confirmation modals** (visual feedback)
- ✅ **Cart state management** (localStorage, React Context)
- ✅ **Form validation** (client-side only)

### Demo/Mock Behavior
- ✅ Console logging of orders
- ✅ Visual confirmation modals
- ✅ Toast notifications for user actions
- ✅ Cart persistence in localStorage
- ✅ Analytics event tracking (front-end only)

## Implementation Guidelines

### Code Comments
All order placement handlers must include comments stating they are mock/demo-only:

```typescript
/**
 * Handle order placement (MOCK/DEMO-ONLY)
 * 
 * PROTOTYPE CONSTRAINT: This is a demo-only implementation.
 * - No payment gateway integration
 * - No POS integration
 * - No backend persistence
 */
```

### Testing
Tests should verify:
- No network calls to payment gateways (Stripe, PayPal, etc.)
- No network calls to POS systems
- Order placement only logs to console (no real API calls)

### New Features
Any new Phase 3 features (analytics, capture forms, etc.) must:
- Remain front-end only
- Not integrate with payment/POS systems
- Follow the mock/demo-only pattern

## Edge Cases

### What If Someone Tries to Add Real Payment Code?
- Code reviews should catch this
- Tests should fail if payment gateway calls are detected
- Documentation should make constraints clear

### Analytics Events
- ✅ Allowed: Front-end event tracking (console.log, in-memory tracking)
- ❌ Not allowed: Backend analytics that persist order data
- ✅ Allowed: Event tracking for demo purposes (no real order data sent)

## Phase 3 Scope

Phase 3 focuses on:
- Design system improvements (themes, styling)
- UX enhancements (hero sections, navigation, menu presentation)
- SEO and AI search optimization (metadata, structured data)
- Social proof and capture components (demo-only forms)
- Analytics instrumentation (front-end event tracking)

Phase 3 does **NOT** include:
- Real payment processing
- POS integration
- Backend order persistence
- Live order routing

## Related Documentation

- `docs/phase-3-architecture-review.md` - Current architecture overview
- `plan/phase-3/master-plan-redacted.md` - Phase 3 master plan with constraints

