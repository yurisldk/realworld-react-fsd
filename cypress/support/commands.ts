const testUser = Cypress.env('testUser');
const apiUrl = Cypress.env('apiUrl');

Cypress.Commands.add('getByTest', (value: string) => {
  return cy.get(`[data-test="${value}"]`);
});

Cypress.Commands.add('createArticleByApi', (token?: string) => {
  let authToken = token;

  if (!authToken) {
    const persisted = JSON.parse(localStorage.getItem('persist:root') || '{}')?.session;
    const parsed = persisted ? JSON.parse(persisted) : {};
    authToken = parsed?.token;

    if (!authToken) {
      throw new Error('Token not found in localStorage');
    }
  }

  const article = {
    title: `Test Article ${Date.now()}`,
    description: 'Created via API',
    body: 'This article was created automatically by Cypress.',
    tagList: ['cypress', 'test'],
  };

  return cy
    .request({
      method: 'POST',
      url: `${apiUrl}/articles`,
      body: { article },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response) => {
      expect(response.status).to.eq(201);
      return response.body.article;
    });
});

Cypress.Commands.add('createUserByApi', (data) => {
  const uniqueSuffix = Date.now();
  const user = {
    username: `testuser_${uniqueSuffix}`,
    email: `testuser_${uniqueSuffix}@example.com`,
    password: 'testpassword123',
    demo: true,
    ...data,
  };

  return cy
    .request({
      method: 'POST',
      url: `${apiUrl}/users`,
      body: { user },
    })
    .then((response) => {
      expect(response.status).to.eq(201);
      return {
        ...response.body.user,
        password: user.password,
      };
    });
});

Cypress.Commands.add('loginByApi', (data) => {
  const { email, password } = data ?? testUser;

  return cy
    .request({
      method: 'POST',
      url: `${apiUrl}/users/login`,
      body: {
        user: { email, password },
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200);

      const rootState = {
        session: JSON.stringify(response.body.user),
      };

      localStorage.setItem('persist:root', JSON.stringify(rootState));
    });
});

Cypress.Commands.add('loginByApiWithSession', (data) => {
  const { email, password } = data ?? testUser;

  cy.session([email, password], () => cy.loginByApi({ email, password }), {
    validate() {
      const rootStr = window.localStorage.getItem('persist:root');
      if (!rootStr) {
        throw new Error('persist:root not found');
      }

      let root;
      try {
        root = JSON.parse(rootStr);
      } catch {
        throw new Error('invalid JSON in persist:root');
      }

      const sessionStr = root.session;
      if (!sessionStr) throw new Error('session not found in persist:root');

      let session;
      try {
        session = JSON.parse(sessionStr);
      } catch {
        throw new Error('invalid JSON in session');
      }

      const token = session?.token;
      if (!token || token.length < 50) {
        throw new Error('token missing or malformed');
      }
    },
  });
});

Cypress.Commands.add('logout', () => {
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.removeItem('persist:root');
    },
  });
  cy.clearCookies();
});
