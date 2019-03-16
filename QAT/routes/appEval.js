const express = require('express');
const bnApps = require('../models/bnApp.js');
const evals = require('../models/evaluation.js');
const users = require('../models/qatUser.js');
const api = require('../models/api.js');

const router = express.Router();

router.use(api.isLoggedIn);

/* GET bn app page */
router.get('/', async (req, res, next) => {
    res.render('appeval', { title: 'bn app eval', script: '../javascripts/appEval.js', isAppEval: true, layout: 'qatlayout' });
});

//population
const defaultPopulate = [
    { populate: 'applicant', display: 'username osuId', model: users.QatUser },
    { populate: 'evaluations', display: 'evaluator behaviorComment moddingComment vote', model: evals.Evaluation }
];

const defaultDiscussPopulate = [
    { populate: 'applicant', display: 'username osuId', model: users.QatUser },
    { populate: 'evaluations', display: 'evaluator behaviorComment moddingComment vote', model: evals.Evaluation },
    { innerPopulate: 'evaluations', model: evals.Evaluation, populate: { path: 'evaluator', select: 'username osuId', model: users.QatUser } },
];

/* GET applicant listing. */
router.get('/relevantInfo', async (req, res, next) => {
    const [a] = await Promise.all([
        await bnApps.service.query({active: true}, defaultDiscussPopulate, {createdAt: 1}, true ),
        //await bnApps.service.query({active: true, discussion: true}, defaultDiscussPopulate, {createdAt: 1}, true ),
    ]);
    res.json({ a: a, evaluator: req.session.qatMongoId });
});


/* POST submit or edit eval */
router.post('/submitEval/:id', async (req, res) => {
    if(req.body.evaluationId){
        await evals.service.update(req.body.evaluationId, {behaviorComment: req.body.behaviorComment, moddingComment: req.body.moddingComment, vote: req.body.vote});
    }else{
        let ev = await evals.service.create(req.session.qatMongoId, req.body.behaviorComment, req.body.moddingComment, req.body.vote);
        a = await bnApps.service.update(req.params.id, {$push: {evaluations: ev._id}});
    }
    
    res.json(await bnApps.service.query({ _id: req.params.id }, defaultDiscussPopulate));
});

/* POST set group eval */
router.post('/setGroupEval/', async (req, res) => {
    for (let i = 0; i < req.body.checkedApps.length; i++) {
        await bnApps.service.update(req.body.checkedApps[i], {discussion: true});
    }

    let a = await bnApps.service.query({active: true}, defaultDiscussPopulate, {createdAt: 1}, true );
    res.json(a);
});

/* POST set invidivual eval */
router.post('/setIndividualEval/', async (req, res) => {
    for (let i = 0; i < req.body.checkedApps.length; i++) {
        await bnApps.service.update(req.body.checkedApps[i], {discussion: false});
    }
    
    let a = await bnApps.service.query({active: true}, defaultDiscussPopulate, {createdAt: 1}, true );
    res.json(a);
});

/* POST set invidivual eval */
router.post('/setComplete/', async (req, res) => {
    for (let i = 0; i < req.body.checkedApps.length; i++) {
        await bnApps.service.update(req.body.checkedApps[i], {active: false});
    }
    
    let a = await bnApps.service.query({active: true}, defaultDiscussPopulate, {createdAt: 1}, true );
    res.json(a);
});

module.exports = router;
