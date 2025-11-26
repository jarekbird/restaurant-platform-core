import '@testing-library/jest-dom';
import { testCleanup } from './test-cleanup';

// Register global cleanup to ensure all resources are shut down after tests
// This prevents tests from hanging and ensures clean process exit
testCleanup.registerGlobalCleanup();

