const axios = require('axios');

let instance = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

class Api {
    activities = (params) => {
        return instance.get('/admin/activities', {params:params});
    }

    activitiesPerUser = () => {
        return instance.get('/admin/activities/user');
    }

    activitiesPerType = () => {
        return instance.get('/admin/activities/type');
    };

    activitiesPerMonth = () => {
        return instance.get('/admin/activities/month');
    };

    activitiesPerDOW = () => {
        return instance.get('/admin/activities/dow');
    };

    activitiesPerHour = () => {
        return instance.get('/admin/activities/hour');
    };

    activitiesPerYear = () => {
        return instance.get('/admin/activities/year')
    };

    exportActivities = () => {
        return instance.get('/admin/activities/export')
    }

    deleteDatabase = () => {
        return instance.delete('/admin');
    };
}

export default new Api();