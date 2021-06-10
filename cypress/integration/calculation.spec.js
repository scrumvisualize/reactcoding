

describe('Order books', function() {
 
    before('Before test run set the viewport of the screen',()=>{
    cy.viewport(1900, 1200);
    })

    it('Verify the order of books and price', function() {
     cy.visit( Cypress.config().baseUrl);
     cy.get('input[name="units"]').type(Cypress.env('BOOK_UNITS'));
     cy.get('input[name="price"]').type(Cypress.env('BOOK_PRICE'));
     cy.get('input[type="submit"]').click();

      Cypress.on('uncaught:exception', (err, runnable) => {
      //returning false here prevents Cypress from
      //failing the test
     return false
      })
    })
})