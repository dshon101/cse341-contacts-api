const express = require('express');
const router = express.Router();
const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

// GET all contacts
router.get('/', async (req, res) => {
  const result = await mongodb.getDb().collection('contacts').find();
  result.toArray().then((contacts) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  });
});

router.get('/:id', async (req, res) => {
  const contactId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().collection('contacts').find({ _id: contactId });
  result.toArray().then((contacts) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts[0]);
  });
});

// POST - create a new contact
router.post('/', async (req, res) => {
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };

  if (
    !contact.firstName ||
    !contact.lastName ||
    !contact.email ||
    !contact.favoriteColor ||
    !contact.birthday
  ) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const response = await mongodb.getDb().collection('contacts').insertOne(contact);
  if (response.acknowledged) {
    res.status(201).json({ id: response.insertedId });
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the contact.');
  }
});

// PUT - update an existing contact
router.put('/:id', async (req, res) => {
  const contactId = new ObjectId(req.params.id);

  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };

  const response = await mongodb
    .getDb()
    .collection('contacts')
    .replaceOne({ _id: contactId }, contact);

  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the contact.');
  }
});

// DELETE - remove a contact
router.delete('/:id', async (req, res) => {
  const contactId = new ObjectId(req.params.id);

  const response = await mongodb
    .getDb()
    .collection('contacts')
    .deleteOne({ _id: contactId });

  if (response.deletedCount > 0) {
  res.status(204).send();
} else {
  res.status(404).json({ message: 'No contact found with that id.' });
}
});

module.exports = router;