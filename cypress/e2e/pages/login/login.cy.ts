describe('Login Page @functional', { tags: ['@functional'] }, () => {
  let user: { username: string; email: string; password: string };

  before(() => {
    cy.createUserByApi().then((createdUser) => {
      user = createdUser;
    });
  });

  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form', () => {
    cy.getByTest('login-email').should('be.visible');
    cy.getByTest('login-password').should('be.visible');
    cy.getByTest('login-submit').should('be.visible');
  });

  it('should not allow submission with empty fields', () => {
    cy.getByTest('login-submit').should('be.disabled');
  });

  it('should show an error for invalid credentials', () => {
    cy.getByTest('login-email').type('wrong@email.com');
    cy.getByTest('login-password').type('wrongpassword');
    cy.getByTest('login-submit').click();
    cy.getByTest('login-error').should('be.visible');
  });

  it('should log in successfully with valid credentials', () => {
    cy.getByTest('login-email').type(user.email);
    cy.getByTest('login-password').type(user.password);
    cy.getByTest('login-submit').click();
    cy.getByTest('app-header-username').should('contain', user.username);
  });
});
