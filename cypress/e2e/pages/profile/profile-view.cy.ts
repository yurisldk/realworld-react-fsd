describe('Profile View Page', { tags: ['@functional', '@prod-safe'] }, () => {
  let usernameFoo: string;

  beforeEach(() => {
    cy.loginByApiWithSession();
    cy.createArticleByApi().then((article) => {
      usernameFoo = article.author.username;
      cy.visit(`/profile/${usernameFoo}`);
    });
  });

  it('should display username and user articles', () => {
    cy.getByTest('app-header-username').should('contain', usernameFoo);
    cy.getByTest('article-preview').should('have.length.greaterThan', 0);
  });

  it('should switch between "My Articles" and "Favorited Articles" tabs', () => {
    cy.getByTest('profile-tab-my-articles').should('have.class', 'active');
    cy.getByTest('profile-tab-favorited-articles').click();
    cy.getByTest('profile-tab-favorited-articles').should('have.class', 'active');
  });

  it('should display a message when there are no articles', () => {
    cy.createUserByApi().then(({ username, email, password }) => {
      cy.loginByApiWithSession({ email, password });
      cy.visit(`/profile/${username}`);
      cy.contains('No articles are here... yet.').should('be.visible');
    });
  });

  it('should display Follow/Unfollow button', () => {
    cy.createUserByApi().then(({ username }) => {
      cy.visit(`/profile/${username}`);
      cy.getByTest('follow-button').should('be.visible');
    });
  });
});
