import cypressGrepPlugin from '@cypress/grep/src/plugin';
import axios from 'axios';
import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL,
    async setupNodeEvents(_on, config) {
      cypressGrepPlugin(config);

      const isRunMode = config.isTextTerminal;
      if (isRunMode) {
        const tags = getTagsForEnv();
        if (tags) {
          config.env.grepTags = tags.join(' ');
          config.env.grepFilterSpecs = true;
        }
      }

      try {
        const user = await createE2ETestUser();
        config.env.testUser = user;
        return config;
      } catch (error) {
        console.error('[setupNodeEvents] Failed to create test user:', error);
        throw error;
      }
    },
    env: {
      apiUrl: process.env.API_URL,
    },
  },
});

async function createE2ETestUser() {
  const id = Date.now();
  const userPayload = {
    username: `e2e_user_${id}`,
    email: `e2e_user_${id}@example.com`,
    password: 'testpassword123',
  };

  try {
    const response = await axios.post(
      `${process.env.API_URL}/users`,
      { user: userPayload },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return {
      ...response.data.user,
      password: userPayload.password,
    };
  } catch (error) {
    console.error('[createE2ETestUser] error:', error.response?.data || error.message);
    throw error;
  }
}

const TAGS_BY_ENV = {
  preview: ['@smoke', '@access'],
  develop: ['@functional', '@destructive', '@access'],
  stage: ['@functional', '@destructive', '@access', '@prod-safe'],
  prod: ['@smoke', '@prod-safe', '@access'],
} as const;

function getTagsForEnv() {
  const env = process.env.CYPRESS_ENV;
  if (!env) {
    throw new Error(
      '[cypress.config] CYPRESS_ENV is not defined. Set it to one of: preview, develop, stage, prod, debug',
    );
  }

  if (env === 'debug') {
    return null;
  }

  const tags = TAGS_BY_ENV?.[env as keyof typeof TAGS_BY_ENV];
  if (!tags) {
    throw new Error(
      `[cypress.config] Unknown CYPRESS_ENV "${env}". Set it to one of: preview, develop, stage, prod, debug`,
    );
  }
  return tags;
}
