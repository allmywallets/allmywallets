Feature: Changing the language of the application

  Scenario: Changing the language on the homepage

    Given I am on the homepage
    And I wait 1 second
    Then I should see "Welcome to AllMyWallets!" in the "h2" element
    Given I select "Français (French)" from "select.language"
    Then I should see "Bienvenue sur AllMyWallets!" in the "h2" element
