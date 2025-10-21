const express = require('express'); 
const dashboardRouter = express.Router();
const auth = require('../MiddleWare/JWTAuth');

//DashBoard imports
const {
  getSummary,
  getNotifications
} = require('../Controller/dashboardController');

dashboardRouter.get('/', (req, res) => res.render('studentDashboard'));
dashboardRouter.get('/profile/settings', (req, res) => res.render('profileSettings'));
dashboardRouter.get('/summary', auth, getSummary);
dashboardRouter.get('/notifications', auth, getNotifications);

module.exports = {
  dashboardRouter
};