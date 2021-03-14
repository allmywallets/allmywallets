describe("Navigating", () => {
  it("show welcome", () => {
    cy.visit("/")
    cy.get("h2").contains("Welcome to AllMyWallets!")
  })
})
