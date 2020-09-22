const express = require('express')
const indexRouter = express.Router()
const adminRouter = express.Router()
const userRouter = express.Router()
const { User, Activities, Activity, ActivityGeometry, ActivityProperties } = require(
  './model')
const convert = require('xml-js')
const ObjectsToCsv = require('objects-to-csv')

const crypto = require('crypto')
const algorithm = 'aes-256-ctr'
const IV_LENGTH = 16

function encrypt (text, encryption_key) {
  encryption_key = Buffer.from(crypto.createHash('sha256').
    update(encryption_key).
    digest('base64').
    substr(0, 32))
  let iv = crypto.randomBytes(IV_LENGTH)
  let cipher = crypto.createCipheriv(algorithm,
    Buffer.from(encryption_key, 'hex'), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  console.log(encrypted.toString('hex'))
  return encrypted.toString('hex')
}

let user = new User({
  _id: encrypt('giorgos.dimitropoulos@gmail.com', 'qwerQWER1234!@#$'),
  name: 'Giorgos Dimitropoulos',
  email: 'giorgos.dimitropoulos@gmail.com',
  password: 'qwerQWER1234!@#$',
  type: 'ADMIN',
})

user.save(err => {
  console.log(err)
})

function setAuthorized (session, email, type) {
  session.type = type
  session.authenticated = true
  session.email = email
}

function unsetAuthorized (session) {
  session.authenticated = false
  session.email = null
}

function authUser (req, res, next) {
  if (req.session.type !== 'USER') {
    req.json('Unauthorized')
    req.status(400)
  }
  next()
}

function authAdmin (req, res, next) {
  if (req.session.type !== 'ADMIN') {
    req.json('Unauthorized')
    req.status(400)
  }
  next()
}

indexRouter.post('/login', function (req, res, next) {
  User.findOne({ email: req.body.email }, {
    _id: false,
    email: true,
    name: true,
    type: true,
    password: true,
  }, function (err, user) {
    if (err) throw err
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (err) throw err
      if (isMatch) {
        setAuthorized(req.session, user.email, user.type)
        user.password = undefined
        res.json(user)
        res.status(200)
      }
    })
  })

})

indexRouter.post('/logout', function (req, res, next) {
  unsetAuthorized(req.session)
  res.json('')
  res.status(200)
})

indexRouter.post('/register', function (req, res, next) {
  let user = new User(req.body)
  user.activities = { type: 'FeatureCollection', features: [] }
  user.type = 'USER'
  user._id = encrypt(user.email, user.password)
  user.save(err => {
    res.send(err)
    res.status(400)
  })
})

/*-----------------------------------------------------------------------------------------------------------------------------------------*/
adminRouter.get('/activities/user', authAdmin, function (req, res, next) {
  User.aggregate([
    {
      $project: {
        _id: false,
        name: true,
        count: {
          $cond: {
            if: { $isArray: '$activities.features' },
            then: { $size: '$activities.features' },
            else: 'NA',
          },
        },
      },
    },
    { '$match': { 'count': { '$ne': 'NA' } } },
  ]).exec((err, res1) => {
    if (err) {
      console.log(res1)
    } else {
      res.json(res1)
      res.status(200)
    }
  })
})

adminRouter.get('/activities/type', authAdmin, function (req, res, next) {
  User.aggregate([
    { $unwind: '$activities.features' },
    {
      $group: {
        _id: '$activities.features.properties.type',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: false,
        type: '$_id',
        count: true,
      },
    },
  ]).exec((err, res1) => {
    if (err) {
      console.log(res1)
    } else {
      res.json(res1)
      res.status(200)
    }
  })
})

adminRouter.get('/activities/month', authAdmin, function (req, res, next) {
  User.aggregate([
    { $unwind: '$activities.features' },
    {
      $group: {
        _id: { $month: '$activities.features.properties.timestamp' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: false,
        month: '$_id',
        count: true,
      },
    },
    { $sort: { 'month': 1 } },
  ]).exec((err, res1) => {
    if (err) {
      console.log(res1)
    } else {
      res.json(res1)
      res.status(200)
    }
  })
})

adminRouter.get('/activities/dow', authAdmin, function (req, res, next) {
  User.aggregate([
    { $unwind: '$activities.features' },
    {
      $group: {
        _id: { $dayOfWeek: '$activities.features.properties.timestamp' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: false,
        dayOfWeek: '$_id',
        count: true,
      },
    },
    { $sort: { 'dayOfWeek': 1 } },
  ]).exec((err, res1) => {
    if (err) {
      console.log(res1)
    } else {
      res.json(res1)
      res.status(200)
    }
  })
})

adminRouter.get('/activities/hour', authAdmin, function (req, res, next) {
  User.aggregate([
    { $unwind: '$activities.features' },
    {
      $group: {
        _id: { $hour: '$activities.features.properties.timestamp' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: false,
        hour: '$_id',
        count: true,
      },
    },
    { $sort: { 'hour': 1 } },
  ]).exec((err, res1) => {
    if (err) {
      console.log(res1)
    } else {
      res.json(res1)
      res.status(200)
    }
  })
})

adminRouter.get('/activities/year', authAdmin, function (req, res, next) {
  User.aggregate([
    { $unwind: '$activities.features' },
    {
      $group: {
        _id: { $year: '$activities.features.properties.timestamp' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: false,
        year: '$_id',
        count: true,
      },
    },
    { $sort: { 'year': 1 } },
  ]).exec((err, res1) => {
    if (err) {
      console.log(res1)
    } else {
      res.json(res1)
      res.status(200)
    }
  })
})

adminRouter.get('/activities', authAdmin, function (req, res, next) {
  let conds = []
  let activitiesTypes

  if (req.query.fromYear)
    conds.push({
      $gte: [
        { $year: '$activities.features.properties.timestamp' },
        parseInt(req.query.fromYear, 10)],
    })

  if (req.query.toYear)
    conds.push({
      $lte: [
        { $year: '$activities.features.properties.timestamp' },
        parseInt(req.query.toYear, 10)],
    })

  if (req.query.fromDOW)
    conds.push({
      $gte: [
        { $dayOfWeek: '$activities.features.properties.timestamp' },
        parseInt(req.query.fromDOW, 10)],
    })

  if (req.query.toDOW)
    conds.push({
      $lte: [
        { $dayOfWeek: '$activities.features.properties.timestamp' },
        parseInt(req.query.toDOW, 10)],
    })

  if (req.query.fromHour)
    conds.push({
      $gte: [
        { $hour: '$activities.features.properties.timestamp' },
        parseInt(req.query.fromHour, 10)],
    })

  if (req.query.toHour)
    conds.push({
      $lte: [
        { $hour: '$activities.features.properties.timestamp' },
        parseInt(req.query.toHour, 10)],
    })

  if (req.query.activitiesTypes)
    activitiesTypes = req.query.activitiesTypes
  else
    activitiesTypes = [
      'STILL',
      'ON_FOOT',
      'WALKING',
      'ON_BICYCLE',
      'IN_VEHICLE',
      'TILTING',
      'EXITING_VEHICLE']

  User.aggregate([
    { $unwind: '$activities.features' },
    {
      $match:
        {
          $expr: {
            $and: conds,
          },
          'activities.features.properties.type': { $in: activitiesTypes },
        },
    },
    {
      $project: {
        type: '$activities.features.type',
        geometry: '$activities.features.geometry',
        properties: '$activities.features.geometry',
      },
    },
    {
      $project: {
        'geometry._id': false,
        'properties._id': false,
      },
    }]).exec(async (err, res1) => {
    if (err) {
      console.log(res1)
    } else {
      if (req.query.export && req.query.exportFormat) {
        switch (req.query.exportFormat) {
          case 'JSON':
            res.set(
              { 'Content-Disposition': 'attachment; filename="data.json"' })
            res.send(res1)
            break
          case 'XML':
            res.set(
              { 'Content-Disposition': 'attachment; filename="data.xml"' })
            res1 = convert.json2xml(res1, { compact: true, spaces: 4 }) //TODO
            res.send(res1)
            break
          case 'CSV':
            res.set(
              { 'Content-Disposition': 'attachment; filename="data.csv"' })
            res1 = await new ObjectsToCsv(res1).toString()
            res.send(res1)
            break
        }
      } else {
        res.json(res1)
        res.status(200)
      }
    }
  })
})

adminRouter.delete('/', authAdmin, function (req, res, next) {
  User.remove({ type: { $ne: 'ADMIN' } }, err => {
    res.send('')
    res.status(200)
  })
})
/*-----------------------------------------------------------------------------------------------------------------------------------------*/

userRouter.get('/eco-score/', authUser, function (req, res, next) {
  //TODO sort maybe?
  User.findOne({ email: req.session.email }, { _id: false, 'ecoScore': true },
    (err, res1) => {
      if (err) {
        res.send(err)
        res.status(400)
      } else {
        res.json(res1)
        res.status(200)
      }
    })
})

userRouter.get('/activities/interval', authUser, function (req, res, next) {
  User.aggregate([
    { $match: { email: req.session.email } },
    { $unwind: '$activities.features' },
    {
      $group: {
        _id: null,
        start: { $min: '$activities.features.properties.timestamp' },
        end: { $max: '$activities.features.properties.timestamp' },
      },
    },
    {
      $project: {
        _id: false,
      },
    },
  ]).exec((err, res1) => {
    if (err) {
      res.send(err)
      res.status(400)
    } else {
      res.json(res1)
      res.status(200)
    }
  })
})

userRouter.get('/activities/last-upload', authUser, function (req, res, next) {
  User.findOne({ email: req.session.email }, { _id: false, lastUpload: true },
    (err, res1) => {
      if (err) {
        res.send(err)
        res.status(400)
      } else {
        res.json(res1)
        res.status(200)
      }
    })
})

userRouter.get('/leaderboard', authUser, function (req, res, next) {
  User.aggregate([
    { $match: { 'ecoScore.overall': { $exists: true } } },
    {
      $project: {
        'name': true,
        'ecoScore.overall': true,
      },
    },
    { $sort: { 'ecoScore.overall': -1 } },
    { $limit: 3 },
  ]).exec((err, res1) => {
    if (err) {
      res.send(err)
      res.status(400)
    } else {
      res.json(res1)
      res.status(200)
    }
  })
})

userRouter.get('/activities/type', authUser, function (req, res, next) {
  let conds = []

  if (req.query.fromYear)
    conds.push({
      $gte: [
        { $year: '$activities.features.properties.timestamp' },
        parseInt(req.query.fromYear, 10)],
    })

  if (req.query.toYear)
    conds.push({
      $lte: [
        { $year: '$activities.features.properties.timestamp' },
        parseInt(req.query.toYear, 10)],
    })

  if (req.query.fromMonth)
    conds.push({
      $gte: [
        { month: '$activities.features.properties.timestamp' },
        parseInt(req.query.fromMonth, 10)],
    })

  if (req.query.toMonth)
    conds.push({
      $lte: [
        { $month: '$activities.features.properties.timestamp' },
        parseInt(req.query.toMonth, 10)],
    })

  User.aggregate([
    { $match: { email: req.session.email } },
    { $unwind: '$activities.features' },
    {
      $match:
        {
          $expr: {
            $and: conds,
          },
        },
    },
    {
      $group: {
        _id: '$activities.features.properties.type',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: false,
        type: '$_id',
        count: true,
      },
    },
  ]).exec((err, res1) => {
    if (err) {
      res.send(err)
      res.status(400)
    } else {
      res.json(res1)
      res.status(200)
    }
  })
})

userRouter.get('/activities/most-records-by-dow-per-activity', authUser,
  function (req, res, next) {
    let conds = []

    if (req.query.fromYear)
      conds.push({
        $gte: [
          { $year: '$activities.features.properties.timestamp' },
          parseInt(req.query.fromYear, 10)],
      })

    if (req.query.toYear)
      conds.push({
        $lte: [
          { $year: '$activities.features.properties.timestamp' },
          parseInt(req.query.toYear, 10)],
      })

    if (req.query.fromMonth)
      conds.push({
        $gte: [
          { month: '$activities.features.properties.timestamp' },
          parseInt(req.query.fromMonth, 10)],
      })

    if (req.query.toMonth)
      conds.push({
        $lte: [
          { $month: '$activities.features.properties.timestamp' },
          parseInt(req.query.toMonth, 10)],
      })

    User.aggregate([
      { $match: { email: req.session.email } },
      { $unwind: '$activities.features' },
      {
        $match:
          {
            $expr: {
              $and: conds,
            },
          },
      },
      {
        $group: {
          _id: {
            type: '$activities.features.properties.type',
            dayOfWeek: { $dayOfWeek: '$activities.features.properties.timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.type',
          count: { $max: '$count' },
          dayOfWeek: { $first: '$_id.dayOfWeek' },
        },
      },
      {
        $project: {
          _id: false,
          type: '$_id',
          count: true,
          dayOfWeek: true,
        },
      }]).exec((err, res1) => {
      if (err) {
        res.json('')
        res.status(400)
      } else {
        res.json(res1)
        res.status(200)
      }
    })
  })

userRouter.get('/activities/most-records-by-hour-per-activity', authUser,
  function (req, res, next) {
    let conds = []

    if (req.query.fromYear)
      conds.push({
        $gte: [
          { $year: '$activities.features.properties.timestamp' },
          parseInt(req.query.fromYear, 10)],
      })

    if (req.query.toYear)
      conds.push({
        $lte: [
          { $year: '$activities.features.properties.timestamp' },
          parseInt(req.query.toYear, 10)],
      })

    if (req.query.fromMonth)
      conds.push({
        $gte: [
          { month: '$activities.features.properties.timestamp' },
          parseInt(req.query.fromMonth, 10)],
      })

    if (req.query.toMonth)
      conds.push({
        $lte: [
          { $month: '$activities.features.properties.timestamp' },
          parseInt(req.query.toMonth, 10)],
      })

    User.aggregate([
      { $match: { email: req.session.email } },
      { $unwind: '$activities.features' },
      {
        $match:
          {
            $expr: {
              $and: conds,
            },
          },
      },
      {
        $group: {
          _id: {
            type: '$activities.features.properties.type',
            hour: { $hour: '$activities.features.properties.timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.type',
          count: { $max: '$count' },
          hour: { $first: '$_id.hour' },
        },
      },
      {
        $project: {
          _id: false,
          type: '$_id',
          count: true,
          hour: true,
        },
      }]).exec((err, res1) => {
      if (err) {
        res.send(err)
        res.status(400)
      } else {
        res.json(res1)
        res.status(200)
      }
    })
  })

userRouter.post('/activities', authUser, function (req, res, next) {
  //TODO add transaction functionality

  let activities = new Activities(req.body)
  let lastUpload = Date.now()
  let ecoScoreOverall, totalActivities, ecoScoreHistory

  User.findOneAndUpdate(
    { email: req.session.email },
    {
      $push: {
        'activities.features': {
          $each: req.body.features,
        },
      }
      , lastUpload: lastUpload,
    },
    { new: true },
    (err, res1) => {
      if (err) {
        res.send(err)
        res.status(400)
      } else {
        User.aggregate([
          {
            $match: { email: req.session.email },
          },
          {
            $project: {
              totalActivities: { $size: '$activities.features' },
            },
          }]).exec((err, res1) => {
          if (err) {
            console.log(err)
            res.send(err)
            res.status(400)
          } else {
            totalActivities = res1[0].totalActivities
            User.aggregate([
              {
                $match: { email: req.session.email },
              },
              { $unwind: '$activities.features' },
              {
                $addFields: {
                  'ecoFriendly': {
                    $in: [
                      '$activities.features.properties.type',
                      ['STILL', 'ON_FOOT', 'WALKING', 'BICYCLE']],
                  },
                },
              },
              {
                $match: {
                  ecoFriendly: true,
                  'activities.features.properties.timestamp': {
                    $gte: new Date(new Date() - 365 * 24 * 60 * 60 * 1000),
                  },
                },
              },

              {
                $group: {
                  _id: {
                    ecoFriendly: '$ecoFriendly',
                    month: { $month: '$activities.features.properties.timestamp' },
                  },
                  count: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: false,
                  month: '$_id.month',
                  ecoScore: { $divide: ['$count', totalActivities] },
                },
              },
            ]).exec((err, res1) => {
              ecoScoreHistory = Array(12).fill(0)
              for (let b of res1) {
                ecoScoreHistory[b.month - 1] = b.ecoScore
              }

              User.aggregate([
                {
                  $match: { email: req.session.email },
                },
                { $unwind: '$activities.features' },
                {
                  $addFields: {
                    'ecoFriendly': {
                      $in: [
                        '$activities.features.properties.type',
                        ['STILL', 'ON_FOOT', 'WALKING', 'BICYCLE']],
                    },
                  },
                },
                {
                  $match: {
                    ecoFriendly: true,
                  },
                },
                {
                  $group: {
                    _id: null,
                    count: { $sum: 1 },
                  },
                },
                {
                  $project: {
                    _id: false,
                    ecoScoreOverall: { $divide: ['$count', totalActivities] },
                  },
                },
                { $sort: { ecoScoreOverall: -1 } },
              ]).exec((err, res1) => {
                if (err) {
                  res.send(err)
                  res.status(400)
                } else {
                  ecoScoreOverall = res1[0].ecoScoreOverall
                  User.findOneAndUpdate(
                    { email: req.session.email },
                    {
                      $set: {
                        'ecoScore.history': ecoScoreHistory,
                        'ecoScore.overall': ecoScoreOverall,
                      },
                    },
                    {},
                    err => {
                      if (err) {
                        res.send(err)
                        res.status(400)
                      } else {
                        res.send('')
                        res.status(200)
                      }
                    })
                }
              })
            })
          }
        })
      }
    })
  /*});*/
})

module.exports = {
  indexRouter: indexRouter,
  userRouter: userRouter,
  adminRouter: adminRouter,
}
