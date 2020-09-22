const mongoose = require('mongoose')
const { Schema } = require('mongoose')
bcrypt = require('bcrypt')

const ActivityProperties = new Schema({
  timestamp: {
    type: Date,
    require: true,
  },
  type: {
    type: String,
    enum: [
      'STILL',
      'ON_FOOT',
      'WALKING',
      'ON_BICYCLE',
      'IN_VEHICLE',
      'TILTING',
      'EXITING_VEHICLE'],
    required: true,
  },
  confidence: {
    type: Number,
  },
  verticalAccuracy: {
    type: Number,
  },
  velocity: {
    type: Number,
  },
  accuracy: {
    type: Number,
  },
  altitude: {
    type: Number,
  },
})

const ActivityGeometry = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },

})

const Activity = new Schema({
  type: {
    type: String,
    enum: ['Feature'],
    required: true,
  },
  geometry: {
    type: ActivityGeometry,
  },
  properties: {
    type: ActivityProperties,
    required: true,
  },
})

const Activities = new Schema({
  type: {
    type: String,
    enum: ['FeatureCollection'],
    required: true,
  },
  features: {
    type: [Activity],
    required: true,
  },
})

const EcoScore = new Schema({
  overall: {
    type: Number,
  },
  history: {
    type: [Number],
  },
})

const User = new Schema({
  _id: { type: String, required: true },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastUpload: {
    type: Date,
  },
  type: {
    type: String,
    enum: ['ADMIN', 'USER'],
    required: true,
  },
  ecoScore: EcoScore,
  activities: Activities,
})

User.pre('save', function (next) {
  let user = this

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

User.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

mongoose.connect('mongodb://user:password@city-lens-storage:27017/city-lens',
  { useNewUrlParser: true })

Activity.index({ geometry: '2dsphere' })

let user = mongoose.model('User', User)
let activities = mongoose.model('Activities', Activities)
let activity = mongoose.model('Activity', Activity)
let activityProperties = mongoose.model('ActivityProperties',
  ActivityProperties)
let activityGeometry = mongoose.model('ActivityGeometry', ActivityGeometry)

user.remove({}, null)
activity.remove({}, null)
activities.remove({}, null)
activityProperties.remove({}, null)
activityGeometry.remove({}, null)

module.exports = {
  User: user,
  Activity: activity,
  Activities: activities,
  ActivityProperties: activityProperties,
  ActivityGeometry: activityGeometry,
}