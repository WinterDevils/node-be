var express = require('express')
var router = express.Router()
var moment = require('moment')
const uuid1 = require('uuid/v1')
const { Address } = require('../database')

var db = require('../database')

router.get('/', function (req, res) {
  db.Profile.findAll()
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving profiles.',
      })
    })
})

router.get('/:id', function (req, res) {
  const id = req.params.id
  db.Profile.findAll({
    where: { uuid: id },
    include: {
      model: db.Address,
    },
  })
    .then((profile) => {
      res.status(200).send(JSON.stringify(profile))
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err))
    })
})

router.post('/', async function (req, res) {
  const uniqueId = uuid1()
  const t = await db.sequelize.transaction()

  try {
    await db.Profile.create(
      {
        uuid: uniqueId,
        mrn: req.body.mrn,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: moment(req.body.dob, 'DD-MM-YYYY'),
        gender: req.body.gender,
        contactNo: req.body.contactNo,
        email: req.body.email,
        isActive: req.body.isActive,
      },
      { transaction: t }
    )
    await db.Address.create(
      {
        one: req.body.address.one,
        two: req.body.address.two,
        postcode: req.body.address.postcode,
        state: req.body.address.state,
        lat: req.body.address.lat,
        long: req.body.address.long,
        ProfileUuid: uniqueId,
      },
      { transaction: t }
    )

    await t.commit()
    res.status(200).send(JSON.stringify(`Profile with ID:${uniqudId} has been created`))
  } catch (err) {
    await t.rollback()
    res.status(504).send(JSON.stringify(err))
  }
})

router.put('/:id', async function (req, res) {
  const id = req.params.id
  const t = await db.sequelize.transaction()

  try {
    await db.Profile.update(
      {
        mrn: req.body.mrn,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: moment(req.body.dob, 'DD-MM-YYYY'),
        gender: req.body.gender,
        contactNo: req.body.contactNo,
        email: req.body.email,
        isActive: req.body.isActive,
      },
      { where: { uuid: id }, transaction: t }
    )

    await db.Address.update(
      {
        one: req.body.address.one,
        two: req.body.address.two,
        postcode: req.body.address.postcode,
        state: req.body.address.state,
        lat: req.body.address.lat,
        long: req.body.address.long,
        ProfileUuid: id,
      },
      { where: { ProfileUuid: id }, transaction: t }
    )

    await t.commit()
    res.status(200).send(JSON.stringify(`Profile with ID:${id} has been updated successfully.`))
  } catch (err) {
    await t.rollback()
    res.status(504).send(JSON.stringify(err))
  }
})

router.delete('/:id', function (req, res) {
  const id = req.params.id
  db.Profile.destroy({
    where: { uuid: id },
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
