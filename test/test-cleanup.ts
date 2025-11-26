/**
 * Test cleanup utility
 * Ensures all resources (servers, Redis, timers, etc.) are properly shut down after tests
 * 
 * This prevents tests from hanging and ensures clean process exit.
 */

interface CleanupResource {
  name: string;
  cleanup: () => Promise<void> | void;
}

class TestCleanup {
  private resources: CleanupResource[] = [];
  private isRegistered = false;

  /**
   * Register a cleanup function to be called after all tests
   * @param name - Descriptive name for the resource (for error messages)
   * @param cleanup - Function to clean up the resource
   */
  register(name: string, cleanup: () => Promise<void> | void): void {
    this.resources.push({ name, cleanup });
  }

  /**
   * Register a server that needs to be stopped
   * @param name - Name of the server
   * @param server - Server instance with a stop() method
   */
  registerServer<T extends { stop?: () => Promise<void> | void }>(
    name: string,
    server: T | null | undefined
  ): void {
    if (!server) return;
    
    this.register(name, async () => {
      if (server.stop) {
        await server.stop();
      }
    });
  }

  /**
   * Register a Redis client that needs to be closed
   * @param name - Name of the Redis client
   * @param redis - Redis client with a quit() method
   */
  registerRedis<T extends { quit?: () => Promise<void> | void }>(
    name: string,
    redis: T | null | undefined
  ): void {
    if (!redis) return;
    
    this.register(name, async () => {
      if (redis.quit) {
        await redis.quit();
      }
    });
  }

  /**
   * Clean up all registered resources
   */
  async cleanup(): Promise<void> {
    const errors: Array<{ name: string; error: unknown }> = [];

    for (const resource of this.resources) {
      try {
        await resource.cleanup();
      } catch (error) {
        errors.push({ name: resource.name, error });
      }
    }

    this.resources = [];

    if (errors.length > 0) {
      console.error('Test cleanup errors:', errors);
      throw new Error(
        `Failed to clean up resources: ${errors.map((e) => e.name).join(', ')}`
      );
    }
  }

  /**
   * Register global cleanup hook with Vitest
   * This should be called once in the test setup file
   * 
   * Note: Requires Vitest globals to be enabled (globals: true in vitest.config)
   */
  registerGlobalCleanup(): void {
    if (this.isRegistered) return;
    this.isRegistered = true;

    // Register cleanup to run after all tests
    // @ts-expect-error - afterAll is available as a global when globals: true
    if (typeof afterAll !== 'undefined') {
      // @ts-expect-error - afterAll is available as a global when globals: true
      afterAll(async () => {
        await this.cleanup();
      });
    }
  }
}

// Global instance
export const testCleanup = new TestCleanup();

/**
 * Helper function to register cleanup in individual test files
 * Usage: registerTestCleanup('my-server', () => server.stop())
 */
export function registerTestCleanup(
  name: string,
  cleanup: () => Promise<void> | void
): void {
  testCleanup.register(name, cleanup);
}

/**
 * Helper to register a server for cleanup
 * Usage: registerTestServer('api-server', myServer)
 */
export function registerTestServer<T extends { stop?: () => Promise<void> | void }>(
  name: string,
  server: T | null | undefined
): void {
  testCleanup.registerServer(name, server);
}

/**
 * Helper to register a Redis client for cleanup
 * Usage: registerTestRedis('cache', redisClient)
 */
export function registerTestRedis<T extends { quit?: () => Promise<void> | void }>(
  name: string,
  redis: T | null | undefined
): void {
  testCleanup.registerRedis(name, redis);
}

