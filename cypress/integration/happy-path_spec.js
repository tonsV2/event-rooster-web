import {toLocaleDatetimeString} from '../../src/utils/datetime'

let token = ''

describe('Create event', () => {
    const email = 'test@mail.com'

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
        cy.get('#createEventModal', { timeout: 10000 }).first().should('be.visible')
        cy.get('.modal-header').first().contains('Event created')
        cy.get('.modal-body').first().contains(email)
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
        //cy.get('#maxParticipants').type('2')
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

    it('Confirm upload', () => {
        cy.get('.btn.btn-primary').click()
    })

    it('Has uploaded participants', () => {
        cy.get('#upload-response', { timeout: 10000 }).should('be.visible')
        cy.get('#upload-response').contains(/^3 participants parsed, found 3 new$/)
    })

    it('Re-upload participants', () => {
        cy.get('input[type="file"]').attachFile('participants.csv')
        cy.get('#submit-participants').click()
    })

    it('Confirm upload', () => {
        cy.get('.btn.btn-primary').click()
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

    it('Select first ungrouped participant', () => {
        cy.get('#ungrouped-participants', { timeout: 10000 }).should('be.visible')
        cy.get('#ungrouped-participants > li > a').first().click()
    })
})

describe('Join a group', () => {
    it('Join first group', () => {
        cy.get('.group', { timeout: 10000 }).first().should('be.visible')
        cy.get('.group').first().click()
        cy.get('input[type=submit]').click()
        cy.get('.modal-header', { timeout: 10000 }).first().should('be.visible')
        cy.get('.modal-header').first().contains('Good choice!')
        cy.get('.modal-body').first().contains('test@mail.com')
        cy.get('body').first().type('{esc}')
        cy.go('back')
    })

    it('Select second ungrouped participant', () => {
        cy.reload()
        cy.get('#ungrouped-participants', { timeout: 10000 }).should('be.visible')
        cy.get('#ungrouped-participants > li:nth-child(2) > a').first().click()
    })
})

describe('Join another group', () => {
    it('Join second group', () => {
        cy.get('#join-group > div > div:nth-child(2) > label', { timeout: 10000 }).first().should('be.visible')
        cy.get('#join-group > div > div:nth-child(2) > label').first().click()
        cy.get('input[type=submit]').click()
        cy.get('.modal-header', { timeout: 10000 }).first().should('be.visible')
        cy.get('.modal-header').first().contains('Good choice!')
        cy.get('.modal-body').first().contains('test2@mail.com')
        cy.get('body').first().type('{esc}')
        cy.go('back')
    })

    it('Select first ungrouped participant again', () => {
        cy.reload()
        cy.get('#ungrouped-participants', { timeout: 10000 }).should('be.visible')
        cy.get('#ungrouped-participants > li > a').first().click()
    })

    it('Join first group again', () => {
        cy.get('.group', { timeout: 10000 }).first().should('be.visible')
        cy.get('.group').first().click()
        cy.get('input[type=submit]').click()
        cy.get('.modal-header', { timeout: 10000 }).first().should('be.visible')
        cy.get('.modal-header').first().contains('Good choice!')
        cy.get('.modal-body').first().contains('test1@mail.com')
        cy.get('body').first().type('{esc}')
        cy.go('back')
    })
})

describe('Change group for grouped participant', () => {

    it('Join second group again', () => {
        cy.reload()
        cy.get('#grouped-participants', {timeout: 10000}).should('be.visible')
        cy.get('#grouped-participants > li > a').first().click()

        cy.get('#join-group > div > div:nth-child(2) > label', {timeout: 10000}).first().should('be.visible')
        cy.get('#join-group > div > div:nth-child(2) > label').first().click()
        cy.get('input[type=submit]').click()
        cy.get('.modal-header', {timeout: 10000}).first().should('be.visible')
        cy.get('.modal-header', {timeout: 10000}).first().contains('Good choice!')
//        cy.get('.modal-body', {timeout: 10000}).first().contains('test@mail.com')
//        cy.get('body').first().type('{esc}')
//        cy.go('back')
    })

})
