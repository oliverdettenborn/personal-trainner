describe("Student Management Flow", () => {
  beforeEach(() => {
    cy.setupSession();
  });

  it("Scenario: Create a new Student", () => {
    // When I click the "+ Aluno" button in the header
    cy.contains("+ Aluno").click();

    // And I fill in the "Nome completo" field with "Maria Oliveira"
    cy.get('input[placeholder="Ex: João Silva"]').type("Maria Oliveira");

    // And I click the "Criar" button
    cy.get("div").contains("Criar").click();

    // Then I should see "Maria Oliveira" in the student selection dropdown
    cy.get("select").should("contain", "Maria Oliveira");

    // And "Maria Oliveira" should be selected as the current student
    cy.get("select").invoke("val").should("not.be.empty");
    cy.get("select option:selected").should("have.text", "Maria Oliveira");
  });

  it("Scenario: Select an existing Student", () => {
    // Given I have multiple students registered
    // Setup with 2 students
    const db = {
      students: {
        s1: { id: "s1", name: "João Silva", createdAt: Date.now() },
        s2: { id: "s2", name: "Maria Oliveira", createdAt: Date.now() },
      },
      assessments: {
        a1: {
          id: "a1",
          studentId: "s1",
          createdAt: Date.now(),
          front_before_weight: "80 kg",
        },
      },
    };
    cy.setupSession(db);

    // When I select "João Silva" from the student selection dropdown
    cy.get("select").select("s1");

    // Then I should see the assessment history for "João Silva" in the sidebar
    cy.get("#sidebar").within(() => {
      cy.contains("João Silva").should("be.visible");
      cy.contains("80 kg").should("be.visible");
    });
  });

  it("Scenario: Remove a Student", () => {
    // Given I have selected a student "Maria Oliveira"
    const db = {
      students: {
        s1: { id: "s1", name: "Maria Oliveira", createdAt: Date.now() },
      },
      assessments: {},
    };
    cy.setupSession(db);
    cy.get("select").select("s1");

    // When I click the "Remover aluno" button
    cy.contains("Remover aluno").click();

    // And I confirm the action in the modal
    cy.contains("Remover Aluno").should("be.visible");
    cy.contains("Confirmar").click();

    // Then "Maria Oliveira" should no longer be in the student selection dropdown
    cy.get("select").should("not.contain", "Maria Oliveira");

    // And I should see the empty state message
    cy.contains("Selecione um aluno e crie uma avaliação para começar.").should(
      "be.visible",
    );
  });
});
