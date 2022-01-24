// tutorial

var express = require('express')
var router = express.Router()

// var bodyParser = require('body-parser');
var db = require('../database')
// var app = express();

router.get('/', function (req, res) {
  db.Profile.findAll()
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving tutorials.',
      })
    })
})

router.get('/:id', function (req, res) {
  db.Profile.findByPk(req.params.id)
    .then((profile) => {
      res.status(200).send(JSON.stringify(profile))
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err))
    })
})

router.post('/', function (req, res) {
  db.Profile.create(
    {
      mrn: req.body.mrn,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      // dob: req.body.dob,
      gender: req.body.gender,
      contactNo: req.body.contactNo,
      email: req.body.email,
      isActive: req.body.isActive,
      addresses: {
        one: req.body.address.one,
        two: req.body.address.two,
        state: req.body.address.state,
        postcode: req.body.address.postcode,
      },
    },
    {
      include: [{ association: db.Profile.Addresses, include: [db.Profile.Addresses] }],
    }
  )
    .then((profile) => {
      res.status(200).send(JSON.stringify(profile))
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err))
    })
})

router.put('/:id', function (req, res) {
  const id = req.params.id
  db.Profile.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: `Profile ${id} was updated successfully.`,
        })
      } else {
        res.send({
          message: `Cannot update profile with id=${id}. Maybe profile was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating profile with id=' + id,
      })
    })
})

router.delete('/:id', function (req, res) {
  const id = req.params.id
  db.Profile.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: `Profile ${id} was deleted successfully!`,
        })
      } else {
        res.send({
          message: `Cannot delete profile with id=${id}. Maybe profile was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete profile with id=' + id,
      })
    })
})

module.exports = router
