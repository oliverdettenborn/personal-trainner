describe("Set Password Flow", () => {
  beforeEach(() => {
    // Ignore React hydration errors (expected with ?type=recovery query param)
    cy.on("uncaught:exception", (err) => {
      if (
        err.message.includes("Minified React error #418") ||
        err.message.includes("Hydration")
      ) {
        return false;
      }
    });

    // Inject a fake session into localStorage
    const fakeSession = {
      access_token: "fake-token",
      refresh_token: "fake-refresh",
      expires_in: 3600,
      token_type: "bearer",
      user: { id: "u_123", email: "trainer@example.com" },
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    };

    // Intercept the user call
    cy.intercept("GET", "**/auth/v1/user*", {
      statusCode: 200,
      body: { id: "u_123", email: "trainer@example.com" },
    }).as("getUser");

    // Intercept ANY PUT to the auth user endpoint
    cy.intercept("PUT", "**/auth/v1/user*", {
      statusCode: 200,
      body: {
        id: "u_123",
        email: "trainer@example.com",
        user_metadata: {},
        aud: "authenticated",
        role: "authenticated",
      },
    }).as("updatePassword");

    cy.visit("/set-password?type=recovery", {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        win.localStorage.setItem("sb-auth-token", JSON.stringify(fakeSession));
      },
    });
    cy.url().should("include", "/set-password");
    // Ensure the form is loaded and wait for layout to settle
    cy.contains("Nova senha").should("be.visible");
    cy.wait(500); // Small stability wait
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

    // Wait for the intercept and validate
    cy.wait("@updatePassword").then((interception) => {
      console.log("Cypress Interception:", interception);
      expect(interception.request.body).to.have.property(
        "password",
        "newpassword123",
      );
      expect(interception.response?.statusCode).to.eq(200);
    });

    // Expecting a redirect away from the set-password page
    cy.url().should("not.include", "/set-password");
  });
});
