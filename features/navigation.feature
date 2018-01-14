Feature: Navigate through the application

  Background:
    Given I am on the homepage

  Scenario: Launching the application

    And I wait 1 second
    Then I should see "Welcome to AllMyWallets!" in the "h2" element

  Scenario: Going to the statistics page

    When I follow "Statistics"
    Then I should see "Statistics" in the "h2" element

  Scenario: Going to the settings page

    When I follow "Settings"
    Then I should see "Application settings" in the "h2" element

  Scenario: Going to the contribute page

    When I follow "Contribute"
    Then I should see "Contribute" in the "h2" element
