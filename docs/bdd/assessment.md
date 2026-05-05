# BDD: Initial Assessment Feature

## Feature: Initial Physical Assessment

As a Personal Trainer
I want to register a student's initial assessment
So that I can track their progress over time

## Scenario: Create a new Assessment for a Student

Given I am logged in
And I have selected a student from the sidebar
When I fill in the "Peso" field with "80.5"
And I fill in the "Cintura" field with "90"
And I upload a front photo
And I click the "Salvar Avaliação" button
Then I should see a success message "Avaliação salva com sucesso"
And the assessment should be listed in the student's history

## Scenario: Validation error in Assessment Form

Given I am on the assessment form
When I leave the mandatory "Peso" field empty
And I click the "Salvar Avaliação" button
Then I should see a validation error "O peso é obrigatório"
And the assessment should not be saved

## Scenario: Automatic data persistence (Draft)

Given I am filling out an assessment form
When I change the "Peso" field to "82"
And I wait for 4 seconds
Then the data should be automatically saved as a draft in local storage
