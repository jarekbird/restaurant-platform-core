/**
 * LLM Menu Generation Module
 * 
 * This module contains the function for calling OpenAI's GPT-4 Vision API
 * to generate menu JSON from raw text or images.
 */

import OpenAI from 'openai';

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

Return ONLY valid JSON matching this structure:
{
  "id": "extracted-menu",
  "name": "Main Menu",
  "currency": "USD",
  "categories": [
    {
      "id": "category-id",
      "name": "Category Name",
      "description": "Optional description",
      "items": [
        {
          "id": "item-id",
          "name": "Item Name",
          "description": "Optional description",
          "price": 10.99,
          "tags": ["optional", "tags"],
          "modifiers": [
            {
              "name": "Modifier Group Name",
              "min": 0,
              "max": 1,
              "options": [
                { "name": "Option Name", "priceDelta": 0 }
              ]
            }
          ]
        }
      ]
    }
  ]
}

## Input to Process

${rawText || '(No text provided - extracting from images only)'}

Extract the menu information and return ONLY the JSON object, no additional text or explanation.`;
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

