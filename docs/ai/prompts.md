# AI Prompts Documentation

This document describes the prompts and templates used for AI-powered menu ingestion.

## Menu Extraction Prompt

### Overview

The menu extraction prompt is used to convert unstructured menu text into structured JSON format that matches the `menuSchema` defined in `lib/schemas/menu.ts`.

### Implementation Target

The prompt is implemented in the `callLLMToGenerateMenuJson` function located in `scripts/llm-menu.ts`. This function should be implemented by future agents to call an LLM (e.g., OpenAI, Anthropic, etc.) with the prompt template described below.

### Input Format

The input to the menu extraction process is raw text that may contain:
- Menu item names
- Descriptions
- Prices
- Categories/sections
- Modifiers/customization options
- Tags (e.g., "vegetarian", "gluten-free", "spicy")

The text may be in various formats:
- Plain text
- Markdown
- HTML (should be stripped to plain text first)
- PDF text extraction output

### Output JSON Shape

The output must conform to the `menuSchema` structure:

```typescript
{
  id: string;              // Unique identifier for the menu
  name: string;            // Menu name (e.g., "Main Menu", "Dinner Menu")
  currency: string;        // Currency code (default: "USD")
  categories: Array<{
    id: string;            // Unique identifier for category
    name: string;          // Category name (e.g., "Appetizers", "Main Courses")
    description?: string;  // Optional category description
    items: Array<{
      id: string;          // Unique identifier for item
      name: string;        // Item name
      description?: string; // Optional item description
      price: number;       // Price as a number (not string)
      image?: string;      // Optional image URL
      tags?: string[];     // Optional tags array
      modifiers?: Array<{
        id?: string;       // Optional modifier group ID
        name: string;      // Modifier group name (e.g., "Size", "Toppings")
        min?: number;      // Minimum selections required
        max?: number;      // Maximum selections allowed
        options: Array<{
          id?: string;     // Optional option ID
          name: string;    // Option name
          priceDelta: number; // Price change (can be negative)
        }>;
      }>;
    }>;
  }>;
}
```

### Rules and Constraints

1. **No Hallucinations**: 
   - Do not invent menu items that are not present in the input text
   - Do not add descriptions, prices, or other details that are not explicitly stated
   - If information is missing, use appropriate defaults or omit optional fields

2. **Preserve Order**:
   - Maintain the order of categories and items as they appear in the input text
   - Do not reorder or alphabetize items unless explicitly requested

3. **Price Parsing**:
   - Extract prices accurately from text (handle formats like "$10.99", "10.99", "ten dollars", etc.)
   - Convert all prices to numbers (not strings)
   - If a price cannot be determined, use 0.00 as a fallback (but log a warning)

4. **Category Detection**:
   - Identify category headers/sections in the input text
   - If no explicit categories are found, create a single "Main Menu" category containing all items

5. **Modifier Extraction**:
   - Identify modifier groups (e.g., "Size: Small, Medium, Large")
   - Extract modifier options and any associated price deltas
   - If min/max constraints are mentioned, extract them; otherwise use defaults

6. **Tag Extraction**:
   - Identify common tags from item descriptions or explicit labels
   - Common tags include: "vegetarian", "vegan", "gluten-free", "spicy", "popular", "new"
   - Only include tags that are explicitly mentioned or clearly implied

7. **ID Generation**:
   - Generate unique, URL-friendly IDs for all items, categories, and modifier groups
   - Use kebab-case format (e.g., "california-roll", "spicy-tuna-roll")
   - Ensure IDs are stable and deterministic (same input should produce same IDs)

8. **Error Handling**:
   - If the input text cannot be parsed, return a clear error message
   - Validate output against `menuSchema` before returning
   - Provide helpful error messages for validation failures

### Example Input

```
APPETIZERS

Bruschetta - $8.99
Toasted bread with fresh tomatoes and basil

Wings - $12.99
Spicy chicken wings (6 pieces)
Available in: Mild, Medium, Hot

MAIN COURSES

California Roll - $9.00
Crab, avocado, cucumber
Add-ons: Extra Wasabi (+$0.50), Spicy Mayo (+$0.75)

Spicy Tuna Roll - $11.00
Tuna, sriracha, cucumber
Tags: Spicy, Popular
```

### Example Output

```json
{
  "id": "extracted-menu",
  "name": "Main Menu",
  "currency": "USD",
  "categories": [
    {
      "id": "appetizers",
      "name": "Appetizers",
      "items": [
        {
          "id": "bruschetta",
          "name": "Bruschetta",
          "description": "Toasted bread with fresh tomatoes and basil",
          "price": 8.99
        },
        {
          "id": "wings",
          "name": "Wings",
          "description": "Spicy chicken wings (6 pieces)",
          "price": 12.99,
          "modifiers": [
            {
              "name": "Spice Level",
              "min": 1,
              "max": 1,
              "options": [
                { "name": "Mild", "priceDelta": 0 },
                { "name": "Medium", "priceDelta": 0 },
                { "name": "Hot", "priceDelta": 0 }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "main-courses",
      "name": "Main Courses",
      "items": [
        {
          "id": "california-roll",
          "name": "California Roll",
          "description": "Crab, avocado, cucumber",
          "price": 9.00,
          "modifiers": [
            {
              "name": "Add-ons",
              "min": 0,
              "max": 2,
              "options": [
                { "name": "Extra Wasabi", "priceDelta": 0.50 },
                { "name": "Spicy Mayo", "priceDelta": 0.75 }
              ]
            }
          ]
        },
        {
          "id": "spicy-tuna-roll",
          "name": "Spicy Tuna Roll",
          "description": "Tuna, sriracha, cucumber",
          "price": 11.00,
          "tags": ["spicy", "popular"]
        }
      ]
    }
  ]
}
```

### Implementation Notes

- The `callLLMToGenerateMenuJson` function should accept raw text as input
- It should construct a prompt that includes these rules and examples
- The prompt should instruct the LLM to return valid JSON matching the schema
- The function should parse and validate the LLM response before returning
- Consider using structured output features of modern LLMs (e.g., OpenAI JSON mode, Anthropic structured outputs)

