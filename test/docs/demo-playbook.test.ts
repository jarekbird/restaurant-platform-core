import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Demo Playbook Documentation', () => {
  const playbookPath = join(process.cwd(), 'docs', 'demo-playbook.md');
  let playbookContent: string;

  beforeAll(() => {
    playbookContent = readFileSync(playbookPath, 'utf-8');
  });

  describe('Cart Flow Demo Section', () => {
    it('should include detailed step-by-step instructions for adding items to cart', () => {
      expect(playbookContent).toContain('## Cart Flow Demo');
      expect(playbookContent).toContain('Step 1: Adding Items to Cart');
      expect(playbookContent).toContain('Navigate to Preview Page');
      expect(playbookContent).toContain('Add First Item');
      expect(playbookContent).toContain('Expected Behavior');
    });

    it('should include detailed instructions for viewing and managing cart', () => {
      expect(playbookContent).toContain('Step 2: Viewing and Managing Cart');
      expect(playbookContent).toContain('Open Cart Drawer');
      expect(playbookContent).toContain('Adjust Item Quantities');
      expect(playbookContent).toContain('Remove Items');
    });

    it('should include detailed instructions for checkout process', () => {
      expect(playbookContent).toContain('Step 3: Checkout Process');
      expect(playbookContent).toContain('Initiate Checkout');
      expect(playbookContent).toContain('Fill Out Checkout Form');
      expect(playbookContent).toContain('Submit Order');
    });

    it('should include cart persistence verification steps', () => {
      expect(playbookContent).toContain('Step 4: Verify Cart Persistence');
      expect(playbookContent).toContain('Add Items and Reload');
    });

    it('should include key talking points for cart flow', () => {
      expect(playbookContent).toContain('Key Talking Points for Cart Flow');
      expect(playbookContent).toContain('Cart Persistence');
      expect(playbookContent).toContain('Mobile Responsive');
      expect(playbookContent).toContain('Accessibility');
    });

    it('should include answers to likely questions about cart flow', () => {
      expect(playbookContent).toContain('Answers to Likely Questions');
      expect(playbookContent).toMatch(/Q:.*happens if I add the same item multiple times/i);
      expect(playbookContent).toMatch(/Q:.*Can I remove items/i);
      expect(playbookContent).toMatch(/Q:.*What happens if I close the cart drawer/i);
    });
  });

  describe('AI Chatbot Ordering Flow Demo Section', () => {
    it('should include detailed step-by-step instructions for starting a chat session', () => {
      expect(playbookContent).toContain('## AI Chatbot Ordering Flow Demo');
      expect(playbookContent).toContain('Step 1: Starting a Chat Session');
      expect(playbookContent).toContain('Navigate to Preview Page with Chat Enabled');
      expect(playbookContent).toContain('Locate Chat Assistant Button');
      expect(playbookContent).toContain('Open Chat Panel');
    });

    it('should include instructions for using conversation starter buttons', () => {
      expect(playbookContent).toContain('Step 2: Using Conversation Starter Buttons');
      expect(playbookContent).toContain('Identify Starter Buttons');
      expect(playbookContent).toContain('What can I get?');
    });

    it('should include detailed instructions for adding items via chat', () => {
      expect(playbookContent).toContain('Step 3: Adding Items via Chat');
      expect(playbookContent).toContain('Type a Natural Language Request');
      expect(playbookContent).toContain('Observe AI Processing');
      expect(playbookContent).toContain('Review AI Response');
    });

    it('should include detailed instructions for removing items via chat', () => {
      expect(playbookContent).toContain('Step 4: Removing Items via Chat');
      expect(playbookContent).toContain('Remove a Specific Item');
      expect(playbookContent).toContain('Observe Removal Process');
    });

    it('should include instructions for checking cart via chat', () => {
      expect(playbookContent).toContain('Step 5: Checking Cart via Chat');
      expect(playbookContent).toContain('Ask About Cart Contents');
      expect(playbookContent).toContain('Review Cart Summary');
    });

    it('should include instructions for adjusting quantities via chat', () => {
      expect(playbookContent).toContain('Step 6: Adjusting Quantities via Chat');
      expect(playbookContent).toContain('Update Item Quantity');
    });

    it('should include detailed instructions for checkout via chat', () => {
      expect(playbookContent).toContain('Step 7: Checkout via Chat');
      expect(playbookContent).toContain('Initiate Checkout Through Chat');
      expect(playbookContent).toContain('Observe Checkout Process');
      expect(playbookContent).toContain('Complete Checkout Form');
    });

    it('should include error handling and edge cases', () => {
      expect(playbookContent).toContain('Step 8: Error Handling and Edge Cases');
      expect(playbookContent).toContain('Request Non-Existent Item');
      expect(playbookContent).toContain('Ambiguous Requests');
    });

    it('should include instructions for combining chat and cart drawer', () => {
      expect(playbookContent).toContain('Step 9: Combining Chat and Cart Drawer');
      expect(playbookContent).toContain('Add Items via Chat, View in Cart Drawer');
    });

    it('should include key talking points for AI chatbot flow', () => {
      expect(playbookContent).toContain('Key Talking Points for AI Chatbot Flow');
      expect(playbookContent).toContain('Natural Language Processing');
      expect(playbookContent).toContain('Context Awareness');
      expect(playbookContent).toContain('Error Handling');
    });

    it('should include answers to likely questions about chatbot flow', () => {
      expect(playbookContent).toContain('Answers to Likely Questions');
      expect(playbookContent).toMatch(/Q:.*How does the AI know what items are on the menu/i);
      expect(playbookContent).toMatch(/Q:.*Can I use the chat and the regular cart buttons/i);
      expect(playbookContent).toMatch(/Q:.*What happens if the AI doesn't understand/i);
      expect(playbookContent).toMatch(/Q:.*Can I checkout entirely through chat/i);
    });
  });

  describe('Content Quality', () => {
    it('should have talking points for each major section', () => {
      expect(playbookContent).toMatch(/Talking Point:/g);
      const talkingPointMatches = playbookContent.match(/Talking Point:/g);
      expect(talkingPointMatches?.length).toBeGreaterThanOrEqual(10);
    });

    it('should include expected behavior descriptions', () => {
      expect(playbookContent).toContain('Expected Behavior');
      const expectedBehaviorMatches = playbookContent.match(/Expected Behavior:/g);
      expect(expectedBehaviorMatches?.length).toBeGreaterThanOrEqual(5);
    });

    it('should have detailed step-by-step instructions', () => {
      // Check for numbered steps
      expect(playbookContent).toMatch(/\d+\.\s+\*\*[A-Z]/); // Pattern for numbered steps with bold headers
    });
  });
});
