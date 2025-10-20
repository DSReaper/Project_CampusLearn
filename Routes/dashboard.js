const express = require('express'); 
const dashboardRouter = express.Router();
const auth = require('../MiddleWare/JWTAuth');

//DashBoard imports
const {
  getSummary,
  getNotifications
} = require('../Controller/dashboardController');

dashboardRouter.get('/api/dashboard', (req, res) => res.render('studentDashboard'));
dashboardRouter.get('/api/dashboard/profile/settings', (req, res) => res.render('profileSettings'));
dashboardRouter.get('/api/dashboard/summary', auth, getSummary);
dashboardRouter.get('/api/dashboard/notifications', auth, getNotifications);

module.exports = {
  dashboardRouter
};