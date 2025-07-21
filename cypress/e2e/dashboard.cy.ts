describe('Dashboard E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should load the dashboard successfully', () => {
    cy.get('[data-testid="dashboard"]').should('be.visible');
    cy.get('[data-testid="sidebar"]').should('be.visible');
    cy.get('[data-testid="header"]').should('be.visible');
  });

  it('should display content feed', () => {
    cy.get('[data-testid="content-feed"]').should('be.visible');
    cy.get('[data-testid="content-card"]').should('have.length.greaterThan', 0);
  });

  it('should toggle dark mode', () => {
    cy.get('[data-testid="theme-toggle"]').click();
    cy.get('html').should('have.class', 'dark');
    cy.get('[data-testid="theme-toggle"]').click();
    cy.get('html').should('not.have.class', 'dark');
  });

  it('should search for content', () => {
    cy.get('[data-testid="search-input"]').type('technology');
    cy.get('[data-testid="search-results"]').should('be.visible');
  });

  it('should add content to favorites', () => {
    cy.get('[data-testid="favorite-button"]').first().click();
    cy.get('[data-testid="favorites-section"]').should('contain', '1');
  });

  it('should drag and drop content', () => {
    cy.get('[data-testid="content-card"]').first().trigger('mousedown');
    cy.get('[data-testid="content-card"]').last().trigger('mousemove');
    cy.get('[data-testid="content-card"]').last().trigger('mouseup');
  });

  it('should display trending section', () => {
    cy.get('[data-testid="trending-section"]').should('be.visible');
    cy.get('[data-testid="trending-item"]').should('have.length.greaterThan', 0);
  });

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-6');
    cy.get('[data-testid="sidebar"]').should('not.be.visible');
    cy.get('[data-testid="mobile-menu"]').click();
    cy.get('[data-testid="sidebar"]').should('be.visible');
  });

  it('should handle loading states', () => {
    cy.intercept('GET', '/api/content', { delay: 1000 }).as('getContent');
    cy.visit('http://localhost:3000');
    cy.get('[data-testid="loading-spinner"]').should('be.visible');
    cy.wait('@getContent');
    cy.get('[data-testid="content-feed"]').should('be.visible');
  });

  it('should handle error states', () => {
    cy.intercept('GET', '/api/content', { statusCode: 500 }).as('getContentError');
    cy.visit('http://localhost:3000');
    cy.wait('@getContentError');
    cy.get('[data-testid="error-message"]').should('be.visible');
  });
}); 