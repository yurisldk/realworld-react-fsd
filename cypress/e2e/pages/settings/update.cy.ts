describe('Settings Page', () => {
  const newBio = `Updated bio ${Date.now()}`;

  beforeEach(() => {
    cy.loginByApiWithSession();
    cy.visit('/settings');
  });

  it('should display the settings form', { tags: ['@functional'] }, () => {
    cy.getByTest('settings-form').should('be.visible');
    cy.getByTest('settings-email').should('be.visible');
    cy.getByTest('settings-username').should('be.visible');
    cy.getByTest('settings-bio').should('be.visible');
    cy.getByTest('settings-submit').should('be.visible');
  });

  it('should successfully update the user data', { tags: ['@destructive'] }, () => {
    cy.getByTest('settings-bio').clear().type(newBio);
    cy.intercept('PUT', '/api/user').as('updateUser');
    cy.getByTest('settings-submit').click();
    cy.wait('@updateUser');

    cy.visit('/settings');
    cy.getByTest('settings-bio').should('have.value', newBio);
  });

  it('should logout the user', { tags: ['@functional'] }, () => {
    cy.getByTest('logout-button').click();
    cy.getByTest('global-feed-tab').should('have.class', 'active');
  });

  it('should redirect unauthorized user', { tags: ['@access'] }, () => {
    cy.logout();
    cy.visit('/settings');
    cy.url().should('include', '/login');
  });
});
