# BDD: ActionBar Feature

## Feature: Assessment ActionBar Actions

As a Personal Trainer
I want to interact with the assessment action bar
So that I can manage, export, and track the save state of my assessments

## Scenario: Show 'Unsaved' status when editing and 'Saved' after auto-save

Given I have created a new assessment for a student
And the status indicator shows "Salvo"
When I edit any field in the assessment form
Then the status should change to "Não salvo"
And after the auto-save timer (3.5s), the status should return to "Salvo"

## Scenario: Download assessment as image

Given I have an active assessment open
When I click the download button
Then the assessment should be exported as a PNG image

## Scenario: Copy assessment image to clipboard

Given I have an active assessment open
When I click the copy button
Then the assessment image should be copied to the clipboard

## Scenario: Delete an assessment

Given I have an active assessment open
When I click the "Excluir avaliação" button
Then a confirmation modal should appear
When I click "Confirmar"
Then the assessment should be deleted
And I should see the empty state message
