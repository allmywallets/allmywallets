context('Navigating', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('show welcome', () => {
    cy.get('h2').contains('Welcome to AllMyWallets!')
  })
})
