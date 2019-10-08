'use strict'
module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'files',
      [
        {
          user_id: 1,
          name: 'image.PNG',
          path: 'image1.png'
        },
        {
          user_id: 1,
          name: 'image.PNG',
          path: 'image2.png'
        },
        {
          user_id: 1,
          name: 'image.PNG',
          path: 'image3.png'
        },
        {
          user_id: 1,
          name: 'image.PNG',
          path: 'image4.png'
        },
        {
          user_id: 1,
          name: 'image.PNG',
          path: 'image5.png'
        }
      ],
      {}
    )
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('files', null, {})
  }
}
