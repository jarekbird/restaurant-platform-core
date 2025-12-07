# Task Splitting Guide

This document identifies tasks that should be split into more granular subtasks for easier development.

## Tasks Already Split

### TASK-001: Create Python Project Skeleton
**Status**: ✅ Complete (5 subtasks created)
- **1.1**: Create Package Directory Structure
- **1.2**: Set Up Build System (pyproject.toml)
- **1.3**: Configure Testing Framework
- **1.4**: Create Initial Documentation
- **1.5**: Write and Verify Smoke Test

### TASK-002: Define Core Domain Models
**Status**: 🟡 In Progress (1 of 4 subtasks created)
- **2.1**: ✅ Install Pydantic and Set Up Models Module Structure
- **2.2**: ⏳ Implement Restaurant Model (needs creation)
- **2.3**: ⏳ Implement Location Model (needs creation)
- **2.4**: ⏳ Implement Menu Models (MenuItem, MenuCategory, Menu) (needs creation)

## Tasks Recommended for Splitting

### TASK-004: Implement RestaurantTheme Schema
**Recommended Split**: 7 subtasks
- **4.1**: Implement Color Tokens
- **4.2**: Implement Typography Tokens
- **4.3**: Implement Spacing Tokens
- **4.4**: Implement Shape Tokens (Border Radius)
- **4.5**: Implement Shadow Tokens
- **4.6**: Implement Layout Tokens
- **4.7**: Combine into RestaurantTheme Model

**Rationale**: Each token type is independent and can be developed/tested separately.

### TASK-005: Add Owner-Style Theme Families
**Recommended Split**: 5 subtasks
- **5.1**: Implement Warm Casual Pizza/Bistro Family
- **5.2**: Implement Modern Asian/Sushi Family
- **5.3**: Implement Breakfast/Diner/Comfort Family
- **5.4**: Implement Fast-Casual/Street Food Family
- **5.5**: Implement Theme Selection Logic

**Rationale**: Each theme family is independent and can be developed separately.

### TASK-007: Implement URL Builder Utilities
**Recommended Split**: 6 subtasks
- **7.1**: Install Slugification Dependency
- **7.2**: Create URL Utilities Module Structure
- **7.3**: Implement Slugification Function
- **7.4**: Implement Restaurant Path Builders (home, menu, catering)
- **7.5**: Implement Index Page Path Builders (city, cuisine)
- **7.6**: Implement Promo and News Path Builders

**Rationale**: Slugification is independent from path builders, and different path types can be developed separately.

### TASK-015: Build RestaurantHomeConfig Generator
**Recommended Split**: 9 subtasks
- **15.1**: Create Page Config Builder Module Structure
- **15.2**: Implement Base Restaurant Home Config Builder (URLs, SEO, headings, theme)
- **15.3**: Build Hero Section
- **15.4**: Build Menu Highlights Section
- **15.5**: Build About/Story Section
- **15.6**: Build Reviews/Testimonials Section
- **15.7**: Build Location & Hours Section
- **15.8**: Build FAQs Section (Optional)
- **15.9**: Assemble Final Config and Validate

**Rationale**: Each section is independent and can be developed/tested separately. The base builder can be done first, then sections added incrementally.

## Tasks That May Benefit from Splitting

### TASK-003: Define Output Contract Models
**Consideration**: Has multiple config types (RestaurantHomeConfig, MenuPageConfig, etc.)
- Could split into: 3.1 (Base models), 3.2 (RestaurantHomeConfig), 3.3 (MenuPageConfig), etc.
- **Decision**: Keep as single task - models are closely related and benefit from being developed together

### TASK-006: Implement Theme Serialization & Selection
**Consideration**: Has serialization and selection logic
- Could split into: 6.1 (Serialization), 6.2 (Selection)
- **Decision**: Keep as single task - small enough, closely related

### TASK-008: Implement Internal Linking Planner
**Consideration**: Has multiple link types
- Could split into: 8.1 (Restaurant links), 8.2 (City/Cuisine links), 8.3 (Multi-location links)
- **Decision**: Keep as single task - all link types are similar patterns

### TASK-009: Implement SEO Metadata Generator
**Consideration**: Has multiple page types
- Could split into: 9.1 (Base generator), 9.2 (Restaurant pages), 9.3 (Index pages), 9.4 (OG/Twitter)
- **Decision**: Keep as single task - generator handles all types in one function

### TASK-012: Implement Restaurant JSON-LD Generator
**Consideration**: Has multiple schema components
- Could split into: 12.1 (Base schema), 12.2 (Address formatting), 12.3 (Hours conversion), 12.4 (Rating schema)
- **Decision**: Keep as single task - all components are part of one schema

### TASK-016-020: Page Config Builders
**Consideration**: Each builds a different page type
- **Decision**: Keep as separate tasks - each is already focused on one page type

## Implementation Strategy

1. **High Priority Splits** (do first):
   - ✅ TASK-001 (Complete)
   - 🟡 TASK-002 (In Progress - complete 2.2-2.4)
   - TASK-004 (7 subtasks - high complexity)
   - TASK-015 (9 subtasks - high complexity)

2. **Medium Priority Splits**:
   - TASK-005 (5 subtasks - independent families)
   - TASK-007 (6 subtasks - independent components)

3. **Low Priority** (may not need splitting):
   - Tasks 3, 6, 8, 9, 10, 11, 12, 13, 14, 16-34
   - These are already reasonably granular or benefit from being single tasks

## Template for Creating Subtasks

When creating subtasks, follow this pattern:

1. **Task ID**: `{PARENT}.{NUMBER}` (e.g., `2.2`, `4.1`)
2. **Parent Task**: Reference the parent task
3. **Description**: Focus on the specific subtask scope
4. **Prerequisites**: List parent task and previous subtasks
5. **Checklist**: Focus only on the subtask's specific work
6. **Definition of Done**: Include git commit/push requirements

## Notes

- Subtasks should be independently testable
- Each subtask should be completable in a reasonable time (1-4 hours)
- Subtasks should have clear dependencies
- All subtasks follow the same template as main tasks

