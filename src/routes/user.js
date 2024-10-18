const express = require('express');
const { UserService } = require('../services/user');

module.exports = (app) => {
  const router = express.Router();

  app.use('/v1/users', router);

  router.get('/', async (req, res) => {
    try {
      const data = await UserService.getAllUsers();

      res.status(200).json({ data, message: 'Successfully get all users data.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  });

  router.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const data = await UserService.getUserById(userId);

      res.status(200).json({ data, message: `Successfully get user data by ID: ${userId}.` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const newUser = new UserService(name, email, password);

      const data = await newUser.addUser();

      res.status(201).json({ data, message: 'Successfully created a new user.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  });
};
