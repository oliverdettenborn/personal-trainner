// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

export { };

declare global {
  namespace Cypress {
    type Chainable = {
      setupSession(initialDb?: Record<string, unknown>): Chainable<void>;
    };
  }
}

Cypress.Commands.add('setupSession', (initialDb = null) => {
  // Create a valid-looking JWT (3 parts: header.payload.signature)
  // This is just for testing - it doesn't need to be cryptographically valid
  const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1XzEyMyIsImVtYWlsIjoidHJhaW5lckBleGFtcGxlLmNvbSIsImV4cCI6OTk5OTk5OTk5OX0.fake-signature';

  // Intercept Supabase Auth to simulate logged in state
  cy.intercept('GET', '**/auth/v1/user', {
    statusCode: 200,
    body: { id: 'u_123', email: 'trainer@example.com' },
  }).as('getUser');

  cy.intercept('POST', '**/auth/v1/token*', {
    statusCode: 200,
    body: {
      access_token: fakeJwt,
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: fakeJwt,
      user: { id: 'u_123', email: 'trainer@example.com' },
    },
  }).as('refreshToken');

  // Set initial data
  const defaultDb = {
    students: {
      s1: { id: 's1', name: 'João Silva', createdAt: Date.now() },
    },
    assessments: {},
  };

  const db = initialDb || defaultDb;

  // Mock Supabase REST API calls with actual data
  cy.intercept('GET', '**/rest/v1/students*', {
    statusCode: 200,
    body: Object.values(db.students || {}),
  }).as('getStudents');

  cy.intercept('GET', '**/rest/v1/assessments*', {
    statusCode: 200,
    body: Object.values(db.assessments || {}),
  }).as('getAssessments');

  cy.intercept('POST', '**/rest/v1/students*', (req) => {
    const newStudent = req.body;
    req.reply({ statusCode: 201, body: newStudent });
  }).as('createStudent');

  cy.intercept('POST', '**/rest/v1/assessments*', (req) => {
    const newAssessment = req.body;
    req.reply({ statusCode: 201, body: newAssessment });
  }).as('createAssessment');

  cy.intercept('PATCH', '**/rest/v1/**', (req) => {
    req.reply({ statusCode: 200, body: req.body });
  }).as('patchSupabase');

  cy.intercept('DELETE', '**/rest/v1/**', {
    statusCode: 204,
    body: {},
  }).as('deleteSupabase');

  // Mock session
  const session = {
    access_token: fakeJwt,
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: fakeJwt,
    user: { id: 'u_123', email: 'trainer@example.com' },
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  };

  // Use onBeforeLoad to set localStorage on the AUT window (not the spec runner window)
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('sb-auth-token', JSON.stringify(session));
      win.localStorage.setItem(
        '@caio_oliver_db',
        JSON.stringify(db),
      );
    },
  });

  // Wait for the app to be ready by checking for a common element
  cy.get('body', { timeout: 10000 }).should('be.visible');
});
