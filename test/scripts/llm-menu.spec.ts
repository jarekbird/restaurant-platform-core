/**
 * Tests for LLM menu generation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock OpenAI before importing the module
const mockCreate = vi.fn();
const mockChatCompletions = {
  create: mockCreate,
};
const mockChat = {
  completions: mockChatCompletions,
};

vi.mock('openai', () => {
  return {
    default: class MockOpenAI {
      chat = mockChat;
      constructor() {
        // Constructor does nothing, we use the shared mock instance
      }
    },
    APIError: class extends Error {
      status?: number;
      constructor(message: string, status?: number) {
        super(message);
        this.status = status;
        this.name = 'APIError';
      }
    },
  };
});

// Import after mocking
import { callLLMToGenerateMenuJson } from '@/scripts/llm-menu';

describe('callLLMToGenerateMenuJson', () => {
  beforeEach(() => {
    // Set up environment variable
    process.env.OPENAI_API_KEY = 'test-api-key';
    
    // Reset mocks
    vi.clearAllMocks();
    mockCreate.mockReset();
  });

  it('should throw error if OPENAI_API_KEY is not set', async () => {
    delete process.env.OPENAI_API_KEY;
    
    await expect(
      callLLMToGenerateMenuJson('test text')
    ).rejects.toThrow('OPENAI_API_KEY environment variable is not set');
  });

  it('should call OpenAI API with correct parameters for text input', async () => {
    const mockResponse = {
      choices: [{
        message: {
          content: JSON.stringify({
            id: 'test-menu',
            name: 'Test Menu',
            currency: 'USD',
            categories: [
              {
                id: 'appetizers',
                name: 'Appetizers',
                items: [
                  {
                    id: 'bruschetta',
                    name: 'Bruschetta',
                    price: 8.99,
                  },
                ],
              },
            ],
          }),
        },
      }],
    };

    mockCreate.mockResolvedValue(mockResponse);

    const result = await callLLMToGenerateMenuJson('Appetizers\nBruschetta - $8.99');

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.model).toBe('gpt-4o');
    expect(callArgs.response_format).toEqual({ type: 'json_object' });
    expect(callArgs.messages).toHaveLength(2); // system + user
    expect(callArgs.messages[0].role).toBe('system');
    expect(callArgs.messages[1].role).toBe('user');
    expect(callArgs.messages[1].content).toBeDefined();
    
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should handle image inputs', async () => {
    const mockResponse = {
      choices: [{
        message: {
          content: JSON.stringify({
            id: 'test-menu',
            name: 'Test Menu',
            currency: 'USD',
            categories: [],
          }),
        },
      }],
    };

    mockCreate.mockResolvedValue(mockResponse);

    const imageDataUri = 'data:image/webp;base64,dGVzdA==';
    await callLLMToGenerateMenuJson('', [imageDataUri]);

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const callArgs = mockCreate.mock.calls[0][0];
    const userContent = callArgs.messages[1].content;
    expect(Array.isArray(userContent)).toBe(true);
    expect(userContent.length).toBeGreaterThan(0);
    
    // Check that image is included
    const imagePart = userContent.find((part: { type: string }) => part.type === 'image_url');
    expect(imagePart).toBeDefined();
  });

  it('should handle mixed text and image inputs', async () => {
    const mockResponse = {
      choices: [{
        message: {
          content: JSON.stringify({
            id: 'test-menu',
            name: 'Test Menu',
            currency: 'USD',
            categories: [],
          }),
        },
      }],
    };

    mockCreate.mockResolvedValue(mockResponse);

    const imageDataUri = 'data:image/webp;base64,dGVzdA==';
    await callLLMToGenerateMenuJson('Menu text', [imageDataUri]);

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const callArgs = mockCreate.mock.calls[0][0];
    const userContent = callArgs.messages[1].content;
    expect(Array.isArray(userContent)).toBe(true);
    
    // Should have both text and image
    const textPart = userContent.find((part: { type: string }) => part.type === 'text');
    const imagePart = userContent.find((part: { type: string }) => part.type === 'image_url');
    expect(textPart).toBeDefined();
    expect(imagePart).toBeDefined();
  });

  it('should throw error if no input provided', async () => {
    await expect(
      callLLMToGenerateMenuJson('', [])
    ).rejects.toThrow('No input provided: both text and images are empty');
  });

  it('should throw error if API returns no content', async () => {
    const mockResponse = {
      choices: [{
        message: {
          content: null,
        },
      }],
    };

    mockCreate.mockResolvedValue(mockResponse);

    await expect(
      callLLMToGenerateMenuJson('test text')
    ).rejects.toThrow('No content returned from OpenAI API');
  });

  it('should throw error if API returns invalid JSON', async () => {
    const mockResponse = {
      choices: [{
        message: {
          content: 'not valid json',
        },
      }],
    };

    mockCreate.mockResolvedValue(mockResponse);

    await expect(
      callLLMToGenerateMenuJson('test text')
    ).rejects.toThrow('Failed to parse JSON response from OpenAI');
  });

  it('should handle OpenAI API errors', async () => {
    const apiError = {
      status: 401,
      message: 'Invalid API key',
    };
    
    mockCreate.mockRejectedValue(apiError);

    await expect(
      callLLMToGenerateMenuJson('test text')
    ).rejects.toThrow('OpenAI API error: Invalid API key (status: 401)');
  });
});

