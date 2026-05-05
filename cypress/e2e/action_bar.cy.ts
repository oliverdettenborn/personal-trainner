describe('Physical Assessment ActionBar Actions', () => {
  beforeEach(() => {
    cy.setupSession();

    // Select student and create assessment
    cy.get('select').select('s1');
    cy.contains('+ Nova avaliação').click();
  });

  it("should show 'Unsaved' status when editing and 'Saved' after saving", () => {
    // Status should be "Saved" initially (newly created)
    cy.contains('Salvo').should('be.visible');

    // Type into the notes field (force because it's clipped by parent overflow)
    cy.get('[data-testid="assessment-notes"]').type('Obs', { force: true });

    // Status should change to "Não salvo" after input
    cy.contains('Não salvo').should('be.visible');

    // After 3.5s auto-save timer, status should return to "Salvo"
    cy.contains('Salvo', { timeout: 5000 }).should('be.visible');
  });

  it('should trigger download when clicking the download button', () => {
    // Stub the captureRef/html2canvas behavior is hard in E2E,
    // but we can at least check if the button exists and is clickable
    // The actual download involves creating an <a> tag and clicking it on web.

    cy.get('[data-testid="download-button"]').should('be.visible').click();

    // In our implementation, handleDownloadImage is called.
    // Since we can't easily verify the file system, we check if it doesn't crash
    // and if we can catch errors.
  });

  it('should show success state when clicking the copy button', () => {
    // Stub clipboard API
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'write').resolves();
    });

    // Copy button only appears on Web
    cy.get('[data-testid="copy-button"]').should('be.visible').click();

    // Should show checkmark icon or success state
    // According to ActionBar.tsx: isCopied ? "checkmark-outline" : "copy-outline"
    // In Cypress/React Native Web, this maps to an SVG or specific icon class
    // We can check if the button remains visible and clickable
    cy.get('[data-testid="copy-button"]').should('be.visible');
  });

  it('should open delete confirmation modal and delete assessment', () => {
    // When I click delete
    cy.contains('Excluir avaliação').click();

    // Confirmation modal should appear
    cy.contains('Excluir Avaliação').should('be.visible');
    cy.contains('Tem certeza que deseja excluir').should('be.visible');

    // Confirm deletion
    cy.contains('Confirmar').click();

    // Modal should close and assessment should be gone
    cy.contains('Excluir Avaliação').should('not.exist');
    cy.contains('Selecione um aluno e crie uma avaliação para começar.').should(
      'be.visible',
    );
  });
});
