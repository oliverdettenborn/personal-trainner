// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      setupSession(initialDb?: any): Chainable<void>;
    }
  }
}

Cypress.Commands.add("setupSession", (initialDb = null) => {
  // Intercept Supabase Auth to simulate logged in state
  cy.intercept("GET", "**/auth/v1/user", {
    statusCode: 200,
    body: { id: "u_123", email: "trainer@example.com" },
  }).as("getUser");

  cy.intercept("POST", "**/auth/v1/token*", {
    statusCode: 200,
    body: {
      access_token: "fake-token",
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: "fake-refresh-token",
      user: { id: "u_123", email: "trainer@example.com" },
    },
  }).as("refreshToken");

  // Mock session
  const session = {
    access_token: "fake-token",
    token_type: "bearer",
    expires_in: 3600,
    refresh_token: "fake-refresh-token",
    user: { id: "u_123", email: "trainer@example.com" },
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  };

  // Set initial data
  const defaultDb = {
    students: {
      s1: { id: "s1", name: "João Silva", createdAt: Date.now() },
    },
    assessments: {},
  };

  // Use onBeforeLoad to set localStorage on the AUT window (not the spec runner window)
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem("sb-auth-token", JSON.stringify(session));
      win.localStorage.setItem(
        "@caio_oliver_db",
        JSON.stringify(initialDb || defaultDb),
      );
    },
  });
});
