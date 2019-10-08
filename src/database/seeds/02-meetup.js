'use strict'
const faker = require('faker')
module.exports = {
  up: queryInterface => {
    const meetups = generateMeetups(10)
    console.log(meetups)
    return queryInterface.bulkInsert('meetups', meetups, {})
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('meetups', null, {})
  }
}

function generateMeetups(count) {
  const items = []
  for (let i = 0; i < count; i++) {
    const newItem = {
      user_id: 1,
      title: faker.lorem.words(10),
      location: `${faker.address.streetAddress()}, ${faker.address.city()}`,
      date: faker.date.future(),
      banner_id: Math.floor(Math.random() * 4) + 1,
      description: faker.lorem.paragraphs(2),
      created_at: new Date(),
      updated_at: new Date()
    }
    items.push(newItem)
  }
  return items
}
