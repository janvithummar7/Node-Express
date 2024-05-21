'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert( 'users', [
    {
      name : "JANVI",
      email :"janvi@gmail.com",
      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      name : "HINALI",
      email :"hinali@gmail.com",
      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      name : "DIVISHA",
      email :"divisha@gmail.com",
      createdAt : new Date(),
      updatedAt : new Date()
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users",null, [
      {
        id :2
      }
    ])
  }
};
