# AI-Suitable Tasks

This document lists concrete future tasks that are suitable for AI agents to implement.

## Menu Ingestion

### Implement `callLLMToGenerateMenuJson`

**Location**: `scripts/llm-menu.ts`

**Current State**: Placeholder function that throws an error

**Task**: Implement the function to:
- Call an LLM API (OpenAI, Anthropic, etc.)
- Use the prompt template from `docs/ai/prompts.md`
- Parse the LLM response as JSON
- Validate the response against `menuSchema`
- Return the validated menu object

**Requirements**:
- Handle API errors gracefully
- Support different LLM providers
- Implement retry logic for transient failures
- Log processing steps for debugging

**Testing**:
- Mock LLM API calls in tests
- Test with various input formats
- Verify schema validation works correctly

## Theme System

### Add Third Theme

**Location**: `lib/themes/index.ts`

**Task**: Add a new theme (e.g., `"pizza-bright"` is already defined, but could add more):
- Define theme colors and typography
- Ensure theme works with all components
- Test theme application in preview pages

**Examples**:
- `"italian-elegant"`: Elegant Italian restaurant theme
- `"bbq-rustic"`: Rustic BBQ restaurant theme
- `"vegan-fresh"`: Fresh, green theme for vegan restaurants

### Improve Theme Token System

**Task**: Enhance theme system to support:
- CSS custom properties (CSS variables)
- Dark/light mode variants
- Responsive theme adjustments
- Animation/transition tokens

## Component Improvements

### Enhance MenuItemCard Styling

**Location**: `components/menu/MenuItemCard.tsx`

**Task**: Improve the visual design:
- Add hover effects
- Improve spacing and typography
- Add image support with Next.js Image
- Add loading states for images
- Improve modifier display

### Add Menu Item Detail Modal

**Task**: Create a modal component that:
- Shows full item details when clicked
- Displays all modifiers with selection UI
- Allows adding item to cart from modal
- Includes item images and descriptions

### Improve CartDrawer Functionality

**Location**: `components/order/CartDrawer.tsx`

**Task**: Enhance cart drawer:
- Add item quantity controls
- Show item modifiers in cart
- Add remove item confirmation
- Improve empty cart state
- Add cart persistence (localStorage)

## Internationalization

### Add Multi-Language Support

**Task**: Implement i18n system:
- Add language detection
- Create translation files
- Translate menu items and UI text
- Support RTL languages
- Add language switcher component

**Files to Create**:
- `lib/i18n/` directory
- Translation JSON files
- `useTranslation` hook
- Language context provider

## Data Enhancements

### Add Menu Item Images

**Task**: Enhance menu schema and components:
- Add image URL validation
- Display images in MenuItemCard
- Add image optimization
- Support multiple images per item
- Add image fallbacks

### Add Nutritional Information

**Task**: Extend menu schema:
- Add calories, protein, carbs, fat fields
- Create nutrition display component
- Add filter by dietary restrictions
- Display nutrition labels

### Add Allergen Information

**Task**: Add allergen tracking:
- Extend menu schema with allergen fields
- Add allergen icons/indicators
- Create allergen filter component
- Display allergen warnings

## Ordering System

### Implement Full Order Flow

**Task**: Complete the ordering system:
- Connect CheckoutForm to backend API
- Add order confirmation page
- Implement order tracking
- Add email notifications
- Store order history

### Add Payment Integration

**Task**: Integrate payment processing:
- Add Stripe/PayPal integration
- Create payment form component
- Handle payment callbacks
- Add payment status tracking

## Preview System

### Add Restaurant Comparison View

**Task**: Create comparison feature:
- Allow viewing multiple restaurants side-by-side
- Compare menus, themes, and features
- Add comparison controls

### Add Preview Customization

**Task**: Allow preview customization:
- Let users change theme in preview
- Add layout options
- Preview different color schemes
- Export preview as image

## Scaffolding Enhancements

### Add Template Variants

**Task**: Create multiple site templates:
- Minimal template (current)
- Full-featured template
- E-commerce template
- Blog template

### Add Post-Scaffold Scripts

**Task**: Create setup scripts:
- Install dependencies automatically
- Run initial build
- Set up Git repository
- Configure deployment

## Performance

### Add Image Optimization

**Task**: Optimize image handling:
- Implement Next.js Image optimization
- Add image CDN support
- Create image placeholder system
- Optimize image loading

### Add Caching Strategy

**Task**: Implement caching:
- Cache restaurant data
- Add ISR (Incremental Static Regeneration)
- Implement client-side caching
- Add cache invalidation

## Documentation

### Add Component Storybook

**Task**: Create Storybook documentation:
- Document all components
- Add interactive examples
- Show theme variations
- Document props and usage

### Add API Documentation

**Task**: Document internal APIs:
- Document loader functions
- Document schema structures
- Add usage examples
- Create API reference

## Testing

### Add E2E Tests

**Task**: Implement end-to-end testing:
- Set up Playwright or Cypress
- Test preview page flows
- Test cart functionality
- Test scaffolding process

### Improve Test Coverage

**Task**: Increase test coverage:
- Add edge case tests
- Add integration tests
- Test error scenarios
- Add performance tests

## Deployment

### Add Deployment Scripts

**Task**: Create deployment automation:
- Vercel deployment config
- Docker containerization
- CI/CD pipeline setup
- Environment configuration

### Add Monitoring

**Task**: Implement monitoring:
- Add error tracking (Sentry)
- Add analytics
- Performance monitoring
- Usage metrics

## Accessibility

### Improve Accessibility

**Task**: Enhance a11y:
- Add ARIA labels
- Improve keyboard navigation
- Add screen reader support
- Test with accessibility tools
- Fix WCAG compliance issues

## Security

### Add Security Features

**Task**: Implement security measures:
- Input sanitization
- XSS prevention
- CSRF protection
- Rate limiting
- Security headers

---

## Priority Recommendations

1. **High Priority**:
   - Implement `callLLMToGenerateMenuJson` (core functionality)
   - Add menu item images
   - Enhance MenuItemCard styling
   - Add E2E tests

2. **Medium Priority**:
   - Add third theme
   - Improve cart drawer
   - Add multi-language support
   - Add nutritional information

3. **Low Priority**:
   - Add component Storybook
   - Add deployment scripts
   - Add monitoring
   - Add accessibility improvements

