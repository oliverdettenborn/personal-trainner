describe("App Smoke Test", () => {
  it("should load the home page", () => {
    cy.visit("/");
    // Basic check to see if the app is rendering
    // Expo apps usually have a root view or body
    cy.get("body").should("be.visible");
  });

  it("should have the login link or be on login page if unauthenticated", () => {
    cy.visit("/");
    // We expect to be redirected to /login if not authenticated
    // or see a login button if that's the home page
    cy.url().should("include", "/login");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
  });
});
