# BDD: Set Password Feature

## Feature: Set New Password
  As a New or Recovering User
  I want to set a new password
  So that I can securely access the application in the future

## Scenario: Successful Password Setup
  Given I am on the "Set Password" page
  When I enter a new password "newpassword123"
  And I confirm the new password "newpassword123"
  And I click the "Salvar senha" button
  Then the password should be updated successfully
  And I should be redirected to the home page

## Scenario: Password Mismatch Validation
  Given I am on the "Set Password" page
  When I enter a new password "password123"
  And I enter a different confirmation password "password321"
  And I click the "Salvar senha" button
  Then I should see an error message "As senhas não coincidem."
  And I should remain on the "Set Password" page

## Scenario: Password Too Short Validation
  Given I am on the "Set Password" page
  When I enter a new password "short"
  And I confirm the new password "short"
  And I click the "Salvar senha" button
  Then I should see an error message "A senha deve ter no mínimo 8 caracteres."

## Scenario: Empty Fields Validation
  Given I am on the "Set Password" page
  When I leave the password or confirmation fields empty
  And I click the "Salvar senha" button
  Then I should see an error message "Por favor, preencha todos os campos."
