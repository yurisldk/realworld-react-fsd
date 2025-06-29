/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Logs in a user using the API by sending credentials.
     * If no user is passed, uses default environment credentials.
     */
    loginByApi(user?: { email: string; password: string }): void;

    /**
     * Logs in a user using the API and saves the session using Cypress session caching.
     * If no user is passed, uses default environment credentials.
     */
    loginByApiWithSession(user?: { email: string; password: string }): void;

    /**
     * Logs out the currently authenticated user by clearing local/session storage.
     */
    logout(): void;

    /**
     * Runs a seeded database task via backend to populate test data.
     */
    task(event: 'seed-db'): Chainable<unknown>;

    /**
     * Retrieves an element by data-test attribute value.
     * @param value The value of the data-test attribute to search for.
     */
    getByTest(value: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Creates an article using the API.
     * @param token Optional authorization token. If not provided, it will be extracted from localStorage.
     * @returns The created article object.
     */
    createArticleByApi(token?: string): Chainable<{
      slug: string;
      title: string;
      description: string;
      body: string;
      tagList: string[];
      author: {
        username: string;
        bio: string | null;
        image: string | null;
        following: boolean;
      };
    }>;

    /**
     * Creates a user using the API with optional overrides.
     * Returns user credentials including the password.
     * @param data Partial user data to override the default test user.
     * @returns The newly created user's full auth payload.
     */
    createUserByApi(data?: { username?: string; email?: string; password?: string }): Chainable<{
      email: string;
      username: string;
      token: string;
      password: string;
    }>;
  }
}
