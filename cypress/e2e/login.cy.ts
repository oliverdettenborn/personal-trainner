describe("Login Flow", () => {
  beforeEach(() => {
    // Intercept Supabase Auth calls
    cy.intercept("POST", "**/auth/v1/token*", (req) => {
      if (
        req.body.email === "trainer@example.com" &&
        req.body.password === "password123"
      ) {
        req.reply({
          access_token: "fake-token",
          token_type: "bearer",
          expires_in: 3600,
          refresh_token: "fake-refresh-token",
          user: { id: "u_123", email: "trainer@example.com" },
        });
      } else {
        req.reply({
          statusCode: 400,
          body: {
            error: "invalid_grant",
            error_description: "Invalid login credentials",
          },
        });
      }
    }).as("signIn");

    cy.visit("/");
    // Expo Router will redirect to /login if unauthenticated
    cy.url().should("include", "/login");
  });

  it("should show validation error for empty fields", () => {
    cy.contains("Entrar").click();
    cy.contains("Por favor, preencha todos os campos.").should("be.visible");
  });

  it("should show error for invalid credentials", () => {
    cy.get("input").eq(0).type("wrong@example.com");
    cy.get("input").eq(1).type("wrongpass");
    cy.contains("Entrar").click();

    cy.wait("@signIn");
    cy.contains("E-mail ou senha inválidos.").should("be.visible");
  });

  it("should login successfully with valid credentials", () => {
    cy.get("input").eq(0).type("trainer@example.com");
    cy.get("input").eq(1).type("password123");
    cy.contains("Entrar").click();

    cy.wait("@signIn").then((interception) => {
      expect(interception.request.body.email).to.eq("trainer@example.com");
      expect(interception.response?.statusCode).to.eq(200);
    });
    // After login, it should redirect to home
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });
});
