var express = require('express')
var router = express.Router()
var db = require('../database')

router.get('/', async function (req, res) {
  const uuids = req.query.p
  const profiles = await db.Profile.findAll({
    where: { uuid: uuids },
    include: {
      model: db.Address,
    },
  })

  const hqLat = 3.046449
  const hqLng = 101.646685
  let r = []

  profiles.forEach((p, i) => {
    let temp = p.toJSON()
    temp.distanceToHq = calcCrow(hqLat, hqLng, p.Address.lat, p.Address.lng)
    r.push(temp)
  })
  r = sortByKey(r, 'distanceToHq')

  res.status(200).send(r)
})

module.exports = router

function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key]
    var y = b[key]
    return x < y ? -1 : x > y ? 1 : 0
  })
}

function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 6371 // km
  var dLat = toRad(lat2 - lat1)
  var dLon = toRad(lon2 - lon1)
  lat1 = toRad(lat1)
  lat2 = toRad(lat2)

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(Value) {
  return (Value * Math.PI) / 180
}
