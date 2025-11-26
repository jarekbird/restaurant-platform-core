/**
 * LLM Menu Generation Module
 * 
 * This module contains the function for calling OpenAI's GPT-4 Vision API
 * to generate menu JSON from raw text or images.
 */

import OpenAI from 'openai';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

/**
 * Create menu extraction prompt based on documentation
 */
function createMenuExtractionPrompt(rawText: string): string {
  return `You are a menu extraction expert. Extract menu information from the provided text and/or images and convert it into structured JSON format.

## Rules and Constraints

1. **No Hallucinations**: 
   - Do not invent menu items that are not present in the input
   - Do not add descriptions, prices, or other details that are not explicitly stated
   - If information is missing, use appropriate defaults or omit optional fields

2. **Preserve Order**:
   - Maintain the order of categories and items as they appear in the input
   - Do not reorder or alphabetize items

3. **Price Parsing**:
   - Extract prices accurately from text (handle formats like "$10.99", "10.99", "ten dollars", etc.)
   - Convert all prices to numbers (not strings)
   - If a price cannot be determined, use 0.00 as a fallback

4. **Category Detection**:
   - Identify category headers/sections in the input
   - If no explicit categories are found, create a single "Main Menu" category containing all items

5. **Modifier Extraction**:
   - Identify modifier groups (e.g., "Size: Small, Medium, Large")
   - Extract modifier options and any associated price deltas
   - If min/max constraints are mentioned, extract them; otherwise use defaults (min: 0, max: unlimited)

6. **Tag Extraction**:
   - Identify common tags from item descriptions or explicit labels
   - Common tags include: "vegetarian", "vegan", "gluten-free", "spicy", "popular", "new"
   - Only include tags that are explicitly mentioned or clearly implied

7. **ID Generation**:
   - Generate unique, URL-friendly IDs for all items, categories, and modifier groups
   - Use kebab-case format (e.g., "california-roll", "spicy-tuna-roll")
   - Ensure IDs are stable and deterministic

## Output Format

You MUST return valid JSON matching this EXACT structure. All required fields must be present:

{
  "id": "extracted-menu",           // REQUIRED: unique menu identifier
  "name": "Main Menu",              // REQUIRED: menu name
  "currency": "USD",                // REQUIRED: currency code (default: "USD")
  "categories": [                    // REQUIRED: array with at least one category
    {
      "id": "category-id",           // REQUIRED: unique category identifier
      "name": "Category Name",       // REQUIRED: category name
      "description": "Optional description",  // Optional
      "items": [                     // REQUIRED: array with at least one item
        {
          "id": "item-id",           // REQUIRED: unique item identifier
          "name": "Item Name",       // REQUIRED: item name
          "description": "Optional description",  // Optional
          "price": 10.99,            // REQUIRED: price as number (not string)
          "image": "https://...",    // Optional: image URL
          "tags": ["optional", "tags"],  // Optional: array of strings
          "modifiers": [             // Optional: array of modifier groups
            {
              "id": "modifier-id",   // Optional: modifier group ID
              "name": "Modifier Group Name",  // REQUIRED if modifiers present
              "min": 0,              // Optional: minimum selections
              "max": 1,              // Optional: maximum selections
              "options": [           // REQUIRED if modifiers present: array with at least one option
                {
                  "id": "option-id", // Optional: option ID
                  "name": "Option Name",  // REQUIRED: option name
                  "priceDelta": 0     // REQUIRED: price change as number
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

CRITICAL: The JSON must have these top-level fields: "id", "name", "currency", and "categories". The "categories" array must contain at least one category, and each category must have at least one item.

## Input to Process

${rawText || '(No text provided - extracting from images only)'}

Extract the menu information and return ONLY the JSON object, no additional text or explanation.`;
}

/**
 * Transform LLM response to match expected schema
 * Handles cases where LLM wraps response in "menu" object or uses different structure
 */
function transformLLMResponse(response: unknown): unknown {
  if (!response || typeof response !== 'object') {
    return response;
  }

  const responseObj = response as Record<string, unknown>;

  // If response is wrapped in a "menu" object, unwrap it
  if ('menu' in responseObj && typeof responseObj.menu === 'object') {
    const menuData = responseObj.menu as Record<string, unknown>;
    
    // Check if menuData has category-like structure (keys are category names, values are item arrays)
    const categoryKeys = Object.keys(menuData);
    const looksLikeCategoryStructure = categoryKeys.every(key => 
      Array.isArray(menuData[key])
    );

    if (looksLikeCategoryStructure) {
      // Transform to expected schema
      const categories = categoryKeys.map((categoryName, index) => {
        const items = (menuData[categoryName] as Array<Record<string, unknown>>) || [];
        return {
          id: generateId(categoryName),
          name: categoryName,
          items: items.map((item, itemIndex) => ({
            id: generateId(item.name as string || `item-${index}-${itemIndex}`),
            name: item.name || 'Unnamed Item',
            description: item.description,
            price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price || 0)),
            image: item.image,
            tags: item.tags,
            modifiers: item.modifiers,
          })),
        };
      });

      return {
        id: 'extracted-menu',
        name: 'Main Menu',
        currency: 'USD',
        categories,
      };
    }
  }

  // If response already has the expected structure, return as-is
  if ('id' in responseObj && 'name' in responseObj && 'categories' in responseObj) {
    return response;
  }

  // If response has categories at top level but missing id/name
  if ('categories' in responseObj && Array.isArray(responseObj.categories)) {
    return {
      id: 'extracted-menu',
      name: 'Main Menu',
      currency: responseObj.currency || 'USD',
      categories: responseObj.categories,
    };
  }

  return response;
}

/**
 * Generate URL-friendly ID from name
 */
function generateId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

/**
 * Extract base64 data from data URI
 */
function extractBase64FromDataUri(dataUri: string): string {
  // Data URI format: data:image/webp;base64,<base64-data>
  const base64Index = dataUri.indexOf(',');
  if (base64Index === -1) {
    return dataUri; // Already just base64
  }
  return dataUri.substring(base64Index + 1);
}

/**
 * Extract MIME type from data URI
 */
function extractMimeTypeFromDataUri(dataUri: string): string {
  const mimeMatch = dataUri.match(/data:([^;]+)/);
  return mimeMatch ? mimeMatch[1] : 'image/png';
}

/**
 * Call LLM to generate menu JSON from raw text and/or images
 * 
 * @param rawText - Raw menu text to process (empty string if only images provided)
 * @param images - Array of base64-encoded images (data URIs) to process
 * @returns Promise resolving to menu JSON object
 * @throws Error if LLM call fails
 */
export async function callLLMToGenerateMenuJson(
  rawText: string,
  images: string[] = []
): Promise<unknown> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY environment variable is not set. ' +
      'Please set it to your OpenAI API key to use menu ingestion.'
    );
  }

  const openai = new OpenAI({ apiKey });

  try {
    // Build the messages array
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    
    // Add system message
    messages.push({
      role: 'system',
      content: 'You are a menu extraction expert. Extract menu information from text and/or images and return it as valid JSON matching the specified schema. Return ONLY the JSON object, no additional text.',
    });

    // Build user message content
    const userContent: (OpenAI.Chat.Completions.ChatCompletionContentPartText | OpenAI.Chat.Completions.ChatCompletionContentPartImage)[] = [];
    
    // Add text if provided
    if (rawText.trim()) {
      userContent.push({
        type: 'text',
        text: createMenuExtractionPrompt(rawText),
      });
    }

    // Add images if provided
    for (const imageDataUri of images) {
      const base64Data = extractBase64FromDataUri(imageDataUri);
      const mimeType = extractMimeTypeFromDataUri(imageDataUri);
      
      userContent.push({
        type: 'image_url',
        image_url: {
          url: `data:${mimeType};base64,${base64Data}`,
        },
      });
    }

    // If no text and no images, throw error
    if (userContent.length === 0) {
      throw new Error('No input provided: both text and images are empty');
    }

    messages.push({
      role: 'user',
      content: userContent,
    });

    // Call OpenAI API with GPT-4 Vision
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Using GPT-4o which has vision capabilities
      messages,
      response_format: { type: 'json_object' }, // Force JSON output
      temperature: 0.3, // Lower temperature for more consistent extraction
      max_tokens: 4000, // Allow for large menus
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content returned from OpenAI API');
    }

    // Parse JSON response
    let menuJson: unknown;
    try {
      menuJson = JSON.parse(content);
    } catch (parseError) {
      throw new Error(
        `Failed to parse JSON response from OpenAI: ${parseError instanceof Error ? parseError.message : 'Unknown error'}. ` +
        `Response was: ${content.substring(0, 500)}`
      );
    }

    // Transform response if it's wrapped in a "menu" object or has a different structure
    menuJson = transformLLMResponse(menuJson);

    return menuJson;
  } catch (error) {
    // Check for OpenAI APIError (checking for status property as a fallback)
    if (error && typeof error === 'object' && 'status' in error && 'message' in error) {
      const apiError = error as { message: string; status?: number };
      throw new Error(
        `OpenAI API error: ${apiError.message} (status: ${apiError.status ?? 'unknown'})`
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unexpected error: ${String(error)}`);
  }
}

