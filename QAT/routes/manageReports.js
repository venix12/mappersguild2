const express = require('express');
const api = require('../models/api.js');
const bnApps = require('../models/bnApp.js');
const evals = require('../models/evaluation.js');
const reports = require('../models/report.js');
const users = require('../models/qatUser.js');

const router = express.Router();

router.use(api.isLoggedIn);

/* GET bn app page */
router.get('/', async (req, res, next) => {
    res.render('managereports', { title: 'manage reports', script: '../javascripts/manageReports.js', isManageReports: true, layout: 'qatlayout' });
});

//population
const defaultPopulate = [
    { populate: 'culprit', display: 'username osuId', model: users.QatUser },

];

/* GET applicant listing. */
router.get('/relevantInfo', async (req, res, next) => {
    let r = await reports.service.query({}, defaultPopulate, {createdAt: 1}, true );
    res.json({ r: r });
});


/* POST submit or edit eval */
router.post('/submitReportEval/:id', async (req, res) => {
    if(req.body.feedback && req.body.feedback.length){
        await reports.service.update(req.params.id, {feedback: req.body.feedback});
    }
    if(req.body.valid){
        await reports.service.update(req.params.id, {valid: req.body.valid});
    }
    let r = await reports.service.query({_id: req.params.id}, defaultPopulate);

    res.json(r);
});

module.exports = router;