# Cart System Review - TASK-2.1.1

This document summarizes the review of existing cart-related code to establish a foundation for integrating the cart system into preview routes.

## useCart Hook (`components/order/useCart.ts`)

### CartItem Interface
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: Array<{
    groupName: string;
    selectedOptions: string[];
  }>;
}
```

### API Surface

**Return Type: `UseCartReturn`**
- `items: CartItem[]` - Array of cart items
- `addItem: (item: Omit<CartItem, 'quantity'>) => void` - Add item to cart
- `removeItem: (itemId: string) => void` - Remove item by ID
- `updateQuantity: (itemId: string, quantity: number) => void` - Update item quantity
- `clearCart: () => void` - Clear all items
- `total: number` - Computed total price
- `itemCount: number` - Computed total item count

### Key Behaviors

1. **addItem**: 
   - Checks if item exists (same ID and modifiers using JSON.stringify comparison)
   - If exists: increments quantity
   - If new: adds with quantity 1
   - Uses `useCallback` for memoization

2. **removeItem**:
   - Filters out item by ID (removes all items with that ID)
   - Uses `useCallback` for memoization

3. **updateQuantity**:
   - If quantity <= 0, calls `removeItem` instead
   - Otherwise updates quantity for matching item ID
   - Uses `useCallback` with `removeItem` dependency

4. **clearCart**:
   - Sets items array to empty
   - Uses `useCallback` for memoization

5. **total**:
   - Computed: `items.reduce((sum, item) => sum + item.price * item.quantity, 0)`
   - Recalculates on every render when items change

6. **itemCount**:
   - Computed: `items.reduce((sum, item) => sum + item.quantity, 0)`
   - Recalculates on every render when items change

### State Management
- Uses `useState<CartItem[]>([])` for cart items
- All methods use `useCallback` for performance
- State updates are immutable (spread operators, map, filter)

### Edge Cases Handled
- Quantity <= 0 in `updateQuantity` → removes item
- Duplicate items (same ID + modifiers) → increments quantity
- Empty cart → total and itemCount return 0

## CartDrawer Component (`components/order/CartDrawer.tsx`)

### Props Interface
```typescript
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];  // Note: Uses simplified CartItem without modifiers
  className?: string;
}
```

### Current Features
- Conditional rendering (returns null if `!isOpen`)
- Backdrop with click-to-close
- Drawer positioned right side, full height, max-width md
- Header with title and close button
- Items list with empty state message
- Footer with total (only shown when items exist)
- Accessibility: `role="dialog"`, `aria-modal="true"`, `aria-label`

### Missing Props (for full functionality)
- `onRemoveItem?: (itemId: string) => void` - For remove buttons
- `onUpdateQuantity?: (itemId: string, quantity: number) => void` - For quantity controls

### Current Limitations
- No remove buttons on items
- No quantity adjustment controls
- No checkout form integration
- Items display simplified (no modifiers shown)

## OrderButton Component (`components/order/OrderButton.tsx`)

### Props Interface
```typescript
interface OrderButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}
```

### Current Features
- Simple button component
- Customizable label (default: "Order Now")
- Customizable className
- Click handler prop

### Missing Features
- No item count badge support
- No visual indication of cart state

## CheckoutForm Component (`components/order/CheckoutForm.tsx`)

### Props Interface
```typescript
interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  className?: string;
}

interface CheckoutFormData {
  name: string;
  phone: string;
  notes?: string;
}
```

### Current Features
- Form with name, phone, notes fields
- Name and phone are required
- Notes is optional
- Form validation (HTML5 required attributes)
- Accessibility: `aria-label="Checkout form"`
- Calls `onSubmit` with form data on submit

### Form Fields
- Name: text input, required
- Phone: tel input, required
- Notes: textarea, optional

## Integration Points

### Components Needing Cart Context
1. **MenuItemCard** - Needs `addItem` to add items to cart
2. **CartDrawer** - Needs `items`, `removeItem`, `updateQuantity` for full functionality
3. **OrderButton** - Needs `itemCount` for badge display
4. **Layout components** - Need cart state for drawer management

### Server/Client Component Boundaries
- Preview route (`app/preview/[slug]/page.tsx`) is a server component
- `CartProvider` must be a client component (uses hooks)
- Components using cart context must be client components
- `MenuItemCard` currently server component → needs conversion

### CartProvider Requirements
- Must wrap preview route content
- Must provide cart context to all child components
- Must match `useCart` return type exactly
- Must throw error if `useCartContext` used outside provider

## Test Coverage Gaps

### useCart Hook
- ✅ Basic add/remove/update operations
- ❌ Edge cases (empty cart, duplicate items, quantity edge cases)
- ❌ Modifier matching logic
- ❌ Total and itemCount calculations

### CartDrawer
- ❌ No tests found
- ❌ Open/close behavior
- ❌ Empty state
- ❌ Item display
- ❌ Total calculation

### OrderButton
- ❌ No tests found
- ❌ Click handling
- ❌ Label customization

### CheckoutForm
- ❌ No tests found
- ❌ Form submission
- ❌ Validation
- ❌ Data extraction

## Dependencies Between Components

```
useCart (hook)
  ↓
CartProvider (context wrapper)
  ↓
├─ MenuItemCard (uses addItem)
├─ CartDrawer (uses items, removeItem, updateQuantity)
├─ OrderButton (uses itemCount)
└─ CheckoutForm (standalone, receives onSubmit)
```

## Next Steps

1. Create `CartProvider` context (TASK-2.1.2)
2. Wire `CartProvider` to `useCart` (TASK-2.1.3)
3. Wrap preview route with `CartProvider` (TASK-2.1.4)
4. Update layout to be cart-aware (TASK-2.1.5)
5. Integrate components into preview route

