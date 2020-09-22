const axios = require('axios')

let instance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

class Api {
  ecoScore = () => {
    return instance.get('/user/eco-score')
  }

  activitiesInterval = () => {
    return instance.get('/user/activities/interval')
  }

  activitiesLastUpload = () => {
    return instance.get('/user/activities/last-upload')
  }

  activitiesLeaderboard = () => {
    return instance.get('/user/leaderboard')
  }

  mostRecordsByDOWPerActivity = (params) => {
    return instance.get('/user/activities/most-records-by-dow-per-activity',
      { params: params })
  }

  mostRecordsByHourPerActivity = (params) => {
    return instance.get('/user/activities/most-records-by-hour-per-activity',
      { params: params })
  }

  activitiesPerType = (params) => {
    return instance.get('/user/activities/type', { params: params })
  }

  uploadActivities = (data) => {
    return instance.post('/user/activities', data)
  }
}

export default new Api()