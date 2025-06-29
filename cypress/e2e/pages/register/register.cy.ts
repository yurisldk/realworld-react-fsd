describe('Register Page', { tags: ['@functional'] }, () => {
  const user = {
    username: `testuser_${Date.now()}`,
    email: `test+${Date.now()}@example.com`,
    password: 'password123',
  };

  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display the registration form', () => {
    cy.getByTest('register-username').should('be.visible');
    cy.getByTest('register-email').should('be.visible');
    cy.getByTest('register-password').should('be.visible');
    cy.getByTest('register-submit').should('be.visible');
  });

  it('should not submit the form with empty fields', () => {
    cy.getByTest('register-submit').should('be.disabled');
  });

  it('should successfully register a new user', () => {
    cy.getByTest('register-username').type(user.username);
    cy.getByTest('register-email').type(user.email);
    cy.getByTest('register-password').type(user.password);
    cy.getByTest('register-submit').click();
    cy.getByTest('app-header-username').should('contain', user.username);
  });

  it('should show an error for already registered email', () => {
    cy.getByTest('register-username').type(user.username);
    cy.getByTest('register-email').type(user.email);
    cy.getByTest('register-password').type(user.password);
    cy.getByTest('register-submit').click();
    cy.getByTest('register-error').should('contain', 'email has already been taken');
  });
});
