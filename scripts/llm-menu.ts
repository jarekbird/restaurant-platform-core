/**
 * LLM Menu Generation Module
 * 
 * This module contains the placeholder function for calling an LLM
 * to generate menu JSON from raw text or images. This is a stub to be implemented
 * by future agents.
 */

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
  // TODO: Implement LLM call to generate menu JSON
  // This is a placeholder that will be implemented by future agents
  // Parameters are intentionally unused in this stub implementation
  void rawText; // Suppress unused parameter warning
  void images; // Suppress unused parameter warning
  
  if (images.length > 0) {
    throw new Error(
      'callLLMToGenerateMenuJson with image support is not yet implemented. This is a placeholder. ' +
      'Image processing requires a vision-capable LLM (e.g., GPT-4 Vision, Claude with vision, etc.).'
    );
  }
  
  throw new Error(
    'callLLMToGenerateMenuJson is not yet implemented. This is a placeholder.'
  );
}

