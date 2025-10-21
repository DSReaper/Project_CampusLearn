const express = require('express'); 
const dashboardRouter = express.Router();


//DashBoard imports
const {
  getSummary,
  getNotifications
} = require('../Controller/dashboardController');

dashboardRouter.get('/', (req, res) => res.render('studentDashboard'));
dashboardRouter.get('/profile/settings', (req, res) => res.render('profileSettings'));
dashboardRouter.get('/summary', getSummary);
dashboardRouter.get('/notifications', getNotifications);

module.exports = {
  dashboardRouter
};