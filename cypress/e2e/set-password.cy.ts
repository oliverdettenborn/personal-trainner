describe("Set Password Flow", () => {
  beforeEach(() => {
    // Inject a fake session into localStorage
    const fakeSession = {
      currentSession: {
        access_token: "fake-token",
        refresh_token: "fake-refresh",
        expires_in: 3600,
        token_type: "bearer",
        user: { id: "u_123", email: "trainer@example.com" },
      },
      expiresAt: Date.now() + 3600000,
    };

    // We'll set it for multiple possible keys to be sure
    const keys = [
      "sb-auth-token",
      "sb-127-0-0-1-auth-token",
      "sb-localhost-auth-token",
    ];
    keys.forEach((key) => {
      localStorage.setItem(key, JSON.stringify(fakeSession));
    });

    // Intercept the user call
    cy.intercept("GET", "**/auth/v1/user*", {
      statusCode: 200,
      body: { id: "u_123", email: "trainer@example.com" },
    }).as("getUser");

    // Intercept ANY PUT to the auth user endpoint
    cy.intercept("PUT", "**/auth/v1/user*", {
      statusCode: 200,
      body: { user: { id: "u_123", email: "trainer@example.com" } },
    }).as("updatePassword");

    cy.visit("/set-password?type=recovery", { failOnStatusCode: false });
    cy.url().should("include", "/set-password");
  });

  it("should show validation error for empty fields", () => {
    cy.contains("Salvar senha").as("submitBtn");
    cy.get("@submitBtn").click({ force: true });
    cy.contains("Por favor, preencha todos os campos.").should("be.visible");
  });

  it("should show error for short password", () => {
    cy.get("input").eq(0).type("short");
    cy.get("input").eq(1).type("short");
    cy.contains("Salvar senha").click({ force: true });
    cy.contains("A senha deve ter no mínimo 8 caracteres.").should(
      "be.visible",
    );
  });

  it("should show error for password mismatch", () => {
    cy.get("input").eq(0).type("password123");
    cy.get("input").eq(1).type("password321");
    cy.contains("Salvar senha").click({ force: true });
    cy.contains("As senhas não coincidem.").should("be.visible");
  });

  it("should update password successfully", () => {
    cy.get("input").eq(0).type("newpassword123");
    cy.get("input").eq(1).type("newpassword123");
    
    // Force click to avoid detachment issues
    cy.contains("Salvar senha").click({ force: true });

    // Expecting a redirect away from the set-password page
    cy.url().should("not.include", "/set-password");
  });
});
