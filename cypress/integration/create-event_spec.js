import {toLocaleDatetimeString} from '../../src/utils/datetime'

let token = ''

describe('Create event', () => {
    const email = 'sebastianthegreatful@gmail.com'

    it('Opens the create event page', () => {
        cy.visit('/create-event')
    })

    it('Create an event', () => {
        cy.get('#title').type('Cypress')
        cy.get('#datetime').type('2022-01-01T12:00')
        cy.get('#email').type(email)
        cy.get('input[type=submit]').click()
    })

    it('Show the modal', () => {
//        cy.get('#createEventModalLabel', { timeout: 10000 }).should('have.value', 'Event created')
//        cy.get('#createEventModalBody')
//            .should('be.visible')
//            .contains(email)
    })

    it('Get the token', () => {
        cy.get('#token', {timeout: 10000}).should('not.have.value', '')

        cy.get('#token')
            .invoke('val')
            .then(value => {
                token = value
            })
    })
})

describe('Edit event', () => {
    it('Opens the edit event page', () => {
        cy.visit('/edit-event?token=' + token)
    })

    const group1Datetime = '2022-01-01T12:00';
    it('Add a group', () => {
        cy.get('#maxParticipants').type('2')
        cy.get('#datetime').type(group1Datetime)
        cy.get('#submit-group').click()
    })

    it('Confirm group was added', () => {
        cy.get('#groups').find('li', { timeout: 10000 }).should('have.length', 1)
        cy.get('#groups > li:nth-child(1)').contains(toLocaleDatetimeString(group1Datetime))
    })

    const group2Datetime = '2023-01-01T12:00';
    it('Add another group', () => {
        cy.get('#maxParticipants').type('2')
        cy.get('#datetime').type(group2Datetime)
        cy.get('#submit-group').click()
    })

    it('Confirm group was added', () => {
        cy.get('#groups').find('li', { timeout: 10000 }).should('have.length', 2)
        cy.get('#groups > li:nth-child(2)').contains(toLocaleDatetimeString(group2Datetime))
    })

    it('Upload participants', () => {
        cy.get('input[type="file"]').attachFile('participants.csv')
        cy.get('#submit-participants').click()
    })

    it('Has uploaded participants', () => {
        cy.get('#upload-response', { timeout: 10000 }).should('be.visible')
        cy.get('#upload-response').contains(/^3 participants parsed, found 3 new$/)
    })

    it('Re-upload participants', () => {
        cy.get('input[type="file"]').attachFile('participants.csv')
        cy.get('#submit-participants').click()
    })

    it('Has re-uploaded participants', () => {
        cy.get('#upload-response', { timeout: 10000 }).should('be.visible')
        cy.get('#upload-response').contains(/^3 participants parsed, found 0 new$/)
    })
})

describe('Show event', () => {
    it('Opens the show event page', () => {
        cy.visit('/show-event?token=' + token)
    })
})
