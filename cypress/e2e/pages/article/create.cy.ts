describe('Create Article Page', () => {
  beforeEach(() => {
    cy.loginByApiWithSession();
    cy.visit('/editor');
  });

  it('should display the article creation form', { tags: ['@functional'] }, () => {
    cy.getByTest('article-title-input').should('be.visible');
    cy.getByTest('article-description-input').should('be.visible');
    cy.getByTest('article-body-input').should('be.visible');
    cy.getByTest('article-tags-input').should('be.visible');
    cy.getByTest('article-submit').should('be.visible');
  });

  it('should validate required fields', { tags: ['@functional'] }, () => {
    cy.getByTest('article-submit').should('be.disabled');
  });

  it('should create a new article with valid data', { tags: ['@destructive'] }, () => {
    const title = `Test article ${Date.now()}`;
    const description = 'Some description';
    const body = 'This is the body of the article';
    const tags = 'cypress, test';

    cy.getByTest('article-title-input').type(title);
    cy.getByTest('article-description-input').type(description);
    cy.getByTest('article-body-input').type(body);
    cy.getByTest('article-tags-input').type(tags);
    cy.getByTest('article-submit').click();

    cy.url().should('include', '/article/');
    cy.getByTest('article-title').should('contain', title);
    cy.getByTest('article-body').should('contain', body);
  });

  it('should redirect unauthorized user to login', { tags: ['@access'] }, () => {
    cy.logout();
    cy.visit('/editor');
    cy.url().should('include', '/login');
  });
});
