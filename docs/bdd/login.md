# BDD: Login Feature

## Feature: User Authentication
  As a Personal Trainer
  I want to log in to the application
  So that I can access my students' assessments securely

## Scenario: Successful Login
  Given I am on the login page
  When I enter a valid email "trainer@example.com"
  And I enter the correct password "password123"
  And I click the "Entrar" button
  Then I should be redirected to the home page
  And I should see the sidebar with my students' list

## Scenario: Login Failure with Invalid Credentials
  Given I am on the login page
  When I enter an invalid email "wrong@example.com"
  And I enter an incorrect password "wrongpass"
  And I click the "Entrar" button
  Then I should see an error message "Credenciais inválidas"
  And I should remain on the login page

## Scenario: Redirect to Login when Unauthenticated
  Given I am not logged in
  When I try to access the home page "/"
  Then I should be redirected to the login page "/login"
