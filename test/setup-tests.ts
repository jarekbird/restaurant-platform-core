import '@testing-library/jest-dom';
import { testCleanup } from './test-cleanup';
import { vi } from 'vitest';
import React from 'react';

// Mock Next.js Image component to avoid image configuration issues in tests
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    return React.createElement('img', { src, alt, ...props });
  },
}));

// Register global cleanup to ensure all resources are shut down after tests
// This prevents tests from hanging and ensures clean process exit
testCleanup.registerGlobalCleanup();

