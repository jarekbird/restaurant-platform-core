# Task Splitting Summary

This document tracks which tasks have been split into more granular subtasks.

## Completed Splits

### TASK-1.3 → Split into 3 subtasks:
- **1.3.1**: Extend Theme interface with accent and optional tokens
- **1.3.2**: Update existing themes with new tokens
- **1.3.3**: Verify backward compatibility and write tests

### TASK-1.4 → Split into 4 subtasks (one per theme):
- **1.4.1**: Implement warm-pizza theme
- **1.4.2**: Implement modern-sushi theme
- **1.4.3**: Implement breakfast-diner theme
- **1.4.4**: Implement fast-casual theme (or 4th theme)

### TASK-1.5 → Split into 4 subtasks (one per component group):
- **1.5.1**: Wire themes through HeroSection
- **1.5.2**: Wire themes through RestaurantLayout
- **1.5.3**: Wire themes through MenuItemCard
- **1.5.4**: Wire themes through other components

### TASK-2.6 → Split into 3 subtasks:
- **2.6.1**: Add tagline/benefit line to HeroSection
- **2.6.2**: Add primary CTA button to HeroSection
- **2.6.3**: Ensure responsive layout and accessibility

## Remaining Splits Needed

### TASK-2.7 → Should split into 4 subtasks:
- **2.7.1**: Add logo and restaurant name to header
- **2.7.2**: Update OrderButton label to "Order Online"
- **2.7.3**: Apply theme colors to header
- **2.7.4**: Add mobile sticky bottom bar (optional)

### TASK-3.8 → Should split into 3 subtasks:
- **3.8.1**: Implement image-forward layout with consistent aspect ratio
- **3.8.2**: Refine visual hierarchy (name → description → price → button)
- **3.8.3**: Apply theme tokens to MenuItemCard

### TASK-4.13 → Should split into 2 subtasks:
- **4.13.1**: Create VipSignupBanner component
- **4.13.2**: Create VipSignupSection component

### TASK-6.19 → Should split into 3 subtasks:
- **6.19.1**: Create JSON-LD helper function
- **6.19.2**: Create JsonLd React component
- **6.19.3**: Integrate JSON-LD into preview page

### TASK-7.21 → Should split into 5 subtasks (one per component):
- **7.21.1**: Add page view event to preview page
- **7.21.2**: Add add to cart event to MenuItemCard
- **7.21.3**: Add checkout events to CartDrawer
- **7.21.4**: Add capture events to VipSignup components
- **7.21.5**: Add menu category view event (optional)

### TASK-8.22 → Should split into 3 subtasks:
- **8.22.1**: Update restaurant themes in demo data
- **8.22.2**: Update hero and menu images in demo data
- **8.22.3**: Update descriptive copy in demo data

## Tasks That Don't Need Splitting

These tasks are already granular enough:
- 0.1, 0.2 (discovery/documentation tasks)
- 3.9 (simple verification task)
- 4.10, 4.11, 4.12, 4.14 (single component tasks)
- 5.15 (optional, single route)
- 6.16, 6.17, 6.18 (single helper/component tasks)
- 7.20 (single helper file)
- 8.23 (final validation task)
