describe("Physical Assessment Flow", () => {
  beforeEach(() => {
    cy.setupSession();
  });

  it("Scenario: Create a new Assessment for a Student", () => {
    // Ensure we are on the home page (not redirected to login)
    cy.url().should("eq", Cypress.config().baseUrl + "/");

    // Given I have selected a student
    cy.get("select").select("s1");

    // And I create a new assessment
    cy.contains("+ Nova avaliação").click();

    // When I fill in the "Peso" field with "80,5"
    cy.get('input[placeholder="0,0 kg"]').first().type("80,5");

    // And I fill in the "Cintura" field with "90"
    cy.get('input[placeholder="0,0 cm"]').first().type("90");

    // And I upload a front photo
    // Click the slot to trigger the hidden input creation (common in some web implementations)
    cy.get('[data-testid="photo-slot-front-before"]').click();
    cy.get('input[type="file"]')
      .first()
      .selectFile(
        {
          contents: Cypress.Buffer.from("fake-image-content"),
          fileName: "front.jpg",
          mimeType: "image/jpeg",
        },
        { force: true },
      );

    // And I click the "Salvar Avaliação" button
    cy.contains("Salvar Avaliação").click();

    // Then I should see a success toast "Avaliação salva com sucesso"
    cy.contains("Avaliação salva com sucesso").should("be.visible");

    // And the assessment should be listed in the student's history
    cy.get('[data-testid="sidebar"]').within(() => {
      cy.contains("João Silva").should("be.visible");
      cy.contains("80,5 kg").should("be.visible");
    });
  });

  it("Scenario: Validation error in Assessment Form", () => {
    // Given I am on the assessment form
    cy.get("select").select("s1");
    cy.contains("+ Nova avaliação").click();

    // When I leave the mandatory "Peso" field empty
    cy.get('input[placeholder="0,0 kg"]').first().clear();

    // And I click the "Salvar Avaliação" button
    cy.contains("Salvar Avaliação").click();

    // Then I should see a validation error "O peso é obrigatório" inline
    cy.contains("O peso é obrigatório").should("be.visible");
  });

  it("Scenario: Automatic data persistence (Draft)", () => {
    // Given I am filling out an assessment form
    cy.get("select").select("s1");
    cy.contains("+ Nova avaliação").click();

    // When I change the "Peso" field to "82"
    cy.get('input[placeholder="0,0 kg"]').first().clear().type("82");

    // And I wait for 4 seconds (debounce is 3s in hook)
    cy.wait(4000);

    // Then the data should be automatically saved as a draft in local storage
    cy.window().then((win) => {
      const db = JSON.parse(
        win.localStorage.getItem("@caio_oliver_db") || "{}",
      );
      const assessments = Object.values(db.assessments || {});
      const hasDraft = assessments.some(
        (a: any) => a.front_before_weight === "82 kg",
      );
      expect(hasDraft).to.equal(true);
    });
  });
});
