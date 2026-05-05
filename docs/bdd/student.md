## Feature: Student Management

As a Personal Trainer
I want to manage my student list
So that I can organize their assessments

## Scenario: Create a new Student

Given I am logged in
When I click the "+ Aluno" button in the header
And I fill in the "Nome completo" field with "Maria Oliveira"
And I click the "Criar" button
Then I should see "Maria Oliveira" in the student selection dropdown
And "Maria Oliveira" should be selected as the current student

## Scenario: Select an existing Student

Given I have multiple students registered
When I select "João Silva" from the student selection dropdown
Then I should see the assessment history for "João Silva" in the sidebar

## Scenario: Remove a Student

Given I have selected a student "Maria Oliveira"
When I click the "Remover aluno" button
And I confirm the action in the modal
Then "Maria Oliveira" should no longer be in the student selection dropdown
And I should see the empty state message
