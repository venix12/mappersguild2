const express = require('express');
const beatmaps = require('../models/beatmap.js');
const tasks = require('../models/task.js');
const quests = require('../models/quest.js');
const parties = require('../models/party.js');
const users = require('../models/user.js');
const logs = require('../models/log.js');
const featuredArtists = require('../models/featuredArtists.js');
const api = require('../models/api.js');

const router = express.Router();

router.use(api.isLoggedIn);
router.use(async (req, res, next) => {
    if (!req.session.osuId) {
        logs.service.create(req.session.mongoId || null, `${req.session.osuId} trying to go to ${req.originalUrl} from ${req.ip}`, null, 'error');
        return res.redirect('/');
    } else {
        const user = await users.service.query({ osuId: req.session.osuId });

        if (user && user.group === 'admin') {
            return next();
        }
        logs.service.create(req.session.mongoId || null, `${req.session.osuId} trying to go to ${req.originalUrl} from ${req.ip}`, null, 'error');
        return res.redirect('/');
    }
});

//population
const defaultMapPopulate = [
    { populate: 'host',  display: '_id osuId username' },
    { populate: 'bns',  display: '_id osuId username' },
    { populate: 'modders',  display: '_id osuId username' },
    { populate: 'quest',  display: '_id name' },
    { populate: 'song',  display: 'artist title' },
    { innerPopulate: 'tasks',  populate: { path: 'mappers' } },
];
const defaultMapSort = {status: 1, mode: 1};

const questPopulate = [
    { innerPopulate: 'parties',  populate: { path: 'members leader' } },
    { innerPopulate: 'currentParty',  populate: { path: 'members leader' } },
    { populate: 'completedMembers',  display: 'username osuId rank' },
    { innerPopulate: 'associatedMaps',  populate: { path: 'song host' } }
];

const defaultUserPopulate = [
    { populate: 'completedQuests',  display: 'name' },
];

const defaultArtistPopulate = [
        { populate: 'songs',  display: 'artist title' }
];

/* GET admin page */
router.get('/', async (req, res, next) => {
    if(req.session.osuId == 3178418 || req.session.osuId == 1052994 || req.session.osuId == 1541323){
        res.render('admins', { 
            title: 'Admin', 
            script: '../javascripts/admin.js', 
            loggedInAs: req.session.osuId,
            userTotalPoints: res.locals.userRequest.totalPoints,
        });
    }
});

/* GET relevant info for page load */
router.get('/relevantInfo/', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994 || req.session.osuId == 1541323) {
        let b = await beatmaps.service.query({}, defaultMapPopulate, defaultMapSort, true);
        for (let i = 0; i < b.length; i++) {
            let bm = b[i];
            if ((bm.status == 'Done' || bm.status == 'Qualified') && bm.url) {
                if (bm.url.indexOf('osu.ppy.sh/beatmapsets/') == -1) {
                    bm.status = `${bm.status}: with wrong link`;
                } else {
                    let indexStart = bm.url.indexOf('beatmapsets/') + 'beatmapsets/'.length;
                    let indexEnd = bm.url.indexOf('#');
                    let bmId;

                    if (indexEnd !== -1) {
                        bmId = bm.url.slice(indexStart, indexEnd);
                    } else {
                        bmId = bm.url.slice(indexStart);
                    }
                    
                    const bmInfo = await api.beatmapsetInfo(bmId);
                    let status = '';
                    if (bmInfo) {
                        switch (bmInfo.approved) {
                            case '4':
                                status = 'loved';
                                break;
                            case '3':
                                status = 'qualified';
                                break;
                            case '2':
                                status = 'approved';
                                break;
                            case '1':
                                status = 'ranked';
                                break;
                            default:
                                status = 'probably pending';
                                break;
                        }
    
                    }
                    bm.status = `${bm.status}: ${status}`;
                }
            }
        }
                
        const [q, u, fa, l] = await Promise.all([
            quests.service.query({}, {}, {status: 1, name: 1}, true), 
            users.service.query({}, defaultUserPopulate, {username: 1}, true), 
            featuredArtists.service.query({}, defaultArtistPopulate, {artist: 1}, true),             
            logs.service.query(
                { category: 'error' }, 
                [{ populate: 'user', display: 'username' }], 
                { createdAt: -1 }, 
                true,
                50
            ),
        ]);
    
        res.json({b: b, q: q, u: u, fa: fa, l: l});   
    }
});

//webhook testing
router.post('/generateWebhook/', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        let u = await users.service.query({_id: req.session.mongoId})
        api.webhookPost([{
            author: {
                name: `New Featured Artist: Imperial Circus Dead Decadence`,
                icon_url: `https://assets.ppy.sh/artists/35/cover.jpg`,
                url: `https://osu.ppy.sh/beatmaps/artists/35`
            },
            color: '9325350',
        }]);
        res.json("webhooked");

    }
});

//beatmap

/* POST update map lengths */
router.post('/updateDiffModes', async (req, res) => {
    if(req.session.osuId == 3178418 || req.session.osuId == 1052994){
        let bms = await beatmaps.service.query({}, defaultMapPopulate, {}, true);

       bms.forEach(bm => {
            bm.tasks.forEach(task => {
                if(task.name == "Storyboard"){
                    tasks.service.update(task._id, {mode: "sb"});
                }else{
                    tasks.service.update(task._id, {mode: bm.mode});
                }
            })
       })
        

        //logs.service.create(req.session.mongoId, `updated map lengths`, null, 'beatmaps' );
        res.json("set diff modes");
        
    }
});

/* POST update map status */
router.post('/updateMapStatus/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994 || req.session.osuId == 1541323) {
        let b = await beatmaps.service.update(req.params.id, {status: req.body.status});
        if(req.body.status == "Done"){
            for (let i = 0; i < b.tasks.length; i++) {
                await tasks.service.update(b.tasks[i], {status: "Done"});
            }
        }
        if(req.body.status == "Ranked"){
            let indexStart = b.url.indexOf('beatmapsets/') + 'beatmapsets/'.length;
            let indexEnd = b.url.indexOf('#');
            let bmId;

            if (indexEnd !== -1) {
                bmId = b.url.slice(indexStart, indexEnd);
            } else {
                bmId = b.url.slice(indexStart);
            }
            const bmInfo = await api.beatmapsetInfo(bmId);
            await beatmaps.service.update(b._id, {length: bmInfo.hit_length});
            b = await beatmaps.service.query({_id: req.params.id}, defaultMapPopulate);

            let names = [];
            b.tasks.forEach(task => {
                task.mappers.forEach(mapper => {
                    if(names.indexOf(mapper.username) == -1 && mapper.username != b.host.username){
                        names.push(mapper.username);
                    }
                });
            });
            let nameString;
            if(!names.length){
                nameString = "No guest difficulties";
            }else if(names.length > 1){
                nameString = "Guest difficulties: ";
            }else if(names.length == 1){
                nameString = "Guest difficulty: ";
            }
            for (let i = 0; i < names.length; i++) {
                nameString += names[i];
                if(i != names.length - 1){
                    nameString += ", "
                }
            }

            api.webhookPost([{
                author: {
                    name: `Ranked: ${b.song.artist} - ${b.song.title}`,
                    url: b.url,
                    icon_url: 'https://a.ppy.sh/' + b.host.osuId,
                },
                thumbnail: {
                    url: `https://assets.ppy.sh/beatmaps/${bmId}/covers/list.jpg`
                },
                color: '10221039',
                fields:[
                    {
                        name: `Host: ${b.host.username}`,
                        value: nameString
                    }
                ]
            }]);
        }
        if(req.body.status != "Ranked") b = await beatmaps.service.query({_id: req.params.id}, defaultMapPopulate);
        res.json(b);
        
        //logs.service.create(req.session.mongoId, `set status of "${b.song.artist} - ${b.song.title}" to "${req.body.status}"`, req.params.id, 'beatmap' );
    }
});

/* POST remove diff */
router.post('/removeDiff/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994 || req.session.osuId == 1541323) {
        let t = await tasks.service.query({_id: req.body.taskId});
        let b = await beatmaps.service.update(req.params.id, { $pull: { tasks: req.body.taskId } });
        
        await tasks.service.remove(req.body.taskId);

        b = await beatmaps.service.query({ _id: req.params.id }, defaultMapPopulate);
        res.json(b);
        
        logs.service.create(req.session.mongoId, `removed "${t.name}" from "${b.song.artist} - ${b.song.title}"`, req.body.id, 'beatmap' );
    }
});

/* POST update sb quality */
router.post('/updateStoryboardQuality/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994 || req.session.osuId == 1541323) {
        console.log(req.body.sbQuality);
        await tasks.service.update(req.body.taskId, {sbQuality: req.body.sbQuality});
        b = await beatmaps.service.query({ _id: req.params.id }, defaultMapPopulate);
        res.json(b);
        
        //logs.service.create(req.session.mongoId, `updated sb quality`, req.params.id, 'beatmap' );
    }
});

/* POST remove modder */
router.post('/removeModder/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994 || req.session.osuId == 1541323) {
        let u = await users.service.query({_id: req.body.userId});
        let b = await beatmaps.service.update(req.params.id, { $pull: { modders: req.body.userId } });

        b = await beatmaps.service.query({_id: req.params.id}, defaultMapPopulate);
        res.json(b);
        
        logs.service.create(req.session.mongoId, `removed "${u.username}" from modders on "${b.song.artist} - ${b.song.title}"`, req.body.id, 'beatmap' );
    }
});

/* POST update map url */
router.post('/updateMapUrl/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994 || req.session.osuId == 1541323) {
        let b = await beatmaps.service.update(req.params.id, {url: req.body.link});
        b = await beatmaps.service.query({_id: req.params.id}, defaultMapPopulate);
        res.json(b);
        
        logs.service.create(req.session.mongoId, `updated link on "${b.song.artist} - ${b.song.title}"`, req.body.id, 'beatmap' );
    }
});

/* POST delete beatmap */
router.post('/deleteMap/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        let b = await beatmaps.service.query({_id: req.params.id}, defaultMapPopulate);
        await beatmaps.service.remove(req.params.id);
        
        res.json(`deleted "${b.song.artist} - ${b.song.title}"`);
        
        //logs.service.create(req.session.mongoId, `deleted "${b.song.artist} - ${b.song.title}"`, req.params.id, 'beatmap' );
    }
});


//quest

/* POST new quest */
router.post('/createQuest', async (req, res) => {
    if(req.session.osuId == 3178418 || req.session.osuId == 1052994){
        var quest = await quests.service.create(req.body);
        if (quest) {
            logs.service.create(req.session.mongoId, `created quest "${quest.name}"`, quest._id, 'quest' );
            api.webhookPost([{
                author: {
                    name: `New Quest: ${quest.name}`,
                    url: `https://mappersguild.com/quests`
                },
                thumbnail: {
                    url: `https://assets.ppy.sh/artists/${quest.art}/cover.jpg`
                },
                color: '16734308',
                fields:[{
                    name: "Objective",
                    value: `${quest.descriptionMain}`
                },
                {
                    name: "Party",
                    value: `${quest.minParty}-${quest.maxParty} members`
                },
                {
                    name: "Bonus",
                    value: `${quest.reward} points for each member`
                }]
            }]);
            res.send(quest);
        }
    }
});



/* POST force drop quest */
router.post('/forceDropQuest/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        let q = await quests.service.query({_id: req.params.id}, questPopulate);
        if(q.status == "wip"){
            await quests.service.update(req.params.id, {
                status: "open",
                currentParty: null,
            });
        }
        
        for (let i = 0; i < q.currentParty.members.length; i++) {
            let member = await users.service.query({_id: q.currentParty.members[i]});
            await users.service.update(member._id, {penaltyPoints: (member.penaltyPoints + q.reward)});
        }

        let maps = await beatmaps.service.query({}, {}, {}, true);
        for (let i = 0; i < maps.length; i++) {
            if(maps[i].quest && maps[i].quest.toString() == q._id.toString()){
                beatmaps.service.update(maps[i]._id, {quest: undefined});
            }
        }
        await parties.service.remove(q.currentParty.id);

        q = await quests.service.query({_id: req.params.id}, questPopulate);
        res.json(q);

        logs.service.create(req.session.mongoId, `forced party to drop quest "${q.name}"`, req.params.id, 'quest' );
    }
});

/* POST mark quest as complete */
router.post('/completeQuest/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        let quest = await quests.service.query({_id: req.params.id}, questPopulate);

        if(quest.status == "wip"){
            //webhook
            let memberList = "";
            for (let i = 0; i < quest.currentParty.members.length; i++) {
                memberList += quest.currentParty.members[i].username
                if(i != quest.currentParty.members.length - 1){
                    memberList += ", ";
                }
            }
            api.webhookPost([{
                author: {
                    name: `Party completed quest: "${quest.name}"`,
                    url: `https://mappersguild.com/quests`,
                    icon_url: `https://a.ppy.sh/${quest.currentParty.leader.osuId}`,
                },
                color: '3138274',
                thumbnail: {
                    url: `https://assets.ppy.sh/artists/${quest.art}/cover.jpg`
                },
                fields: [{
                    name: "Members",
                    value: memberList
                }]
            }]);

            //quest changes
            await parties.service.remove(quest.currentParty.id);
            await quests.service.update(quest._id, {
                status: "done",
                currentParty: null,
                completedMembers: quest.currentParty.members,
                completed: new Date()
            });
            
            quest = await quests.service.query({_id: req.params.id}, questPopulate);
            res.json(quest);

            logs.service.create(req.session.mongoId, `marked quest "${quest.name}" as complete`, req.params.id, 'quest' );            
        }
    }
});

/* POST hide open quest */
router.post('/hideQuest/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        await quests.service.update(req.params.id, {status: "hidden"});
        let quest = await quests.service.query({_id: req.params.id});
        res.json(quest);
        
        logs.service.create(req.session.mongoId, `hid a quest`, req.params.id, 'quest' );
    }
});

/* POST unhide quest */
router.post('/unhideQuest/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        await quests.service.update(req.params.id, {status: "open"});
        let quest = await quests.service.query({_id: req.params.id});
        res.json(quest);
        
        logs.service.create(req.session.mongoId, `revealed a quest`, req.params.id, 'quest' );
    }
});

/* POST duplicate quest */
router.post('/duplicateQuest/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        let q = await quests.service.query({_id: req.params.id});
        let body = {name: req.body.name,
                    reward: q.reward,
                    descriptionMain: q.descriptionMain,
                    timeframe: q.timeframe,
                    minParty: q.minParty,
                    maxParty: q.maxParty,
                    minRank: q.minRank,
                    art: q.art,
                    medal: q.medal,
                    color: q.color}
        let newQuest = await quests.service.create(body);
        res.json(newQuest);
    }
});

/* POST reset quest deadline */
router.post('/resetQuestDeadline/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        let date = new Date();
        date.setDate(date.getDate() + 7);
        await quests.service.update(req.params.id, {deadline: date});
        let quest = await quests.service.query({_id: req.params.id});
        res.json(quest);
    }
});


/* POST delete quest */
router.post('/deleteQuest/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        let q = await quests.service.query({_id: req.params.id});
        if(q.status == "open"){
            await quests.service.remove(req.params.id);
            res.json("deleted quest");
            
            logs.service.create(req.session.mongoId, `deleted a quest`, req.params.id, 'quest' );
        }else{
            res.json({})
        }
    }
});

//user

/* POST update user group */
router.post('/updateUserGroup/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        let user = await users.service.query({_id: req.params.id});
        let success = await users.service.update(req.params.id, {group: req.body.group});
        if(success){
            //logs.service.create(req.session.mongoId, `user group of "${user.username}" set to "${req.body.group}"`, req.params.id, 'user' );
            user = await users.service.query({_id: req.params.id}, defaultUserPopulate)
            res.json(user);
        } 
    }
});

/* POST update user penatly points */
router.post('/updatePenaltyPoints/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        let user = await users.service.query({_id: req.params.id});
        let success = await users.service.update(req.params.id, {penaltyPoints: req.body.points});
        if(success){
            logs.service.create(req.session.mongoId, `edited penalty points of "${user.username}" to ${req.body.points}`, req.params.id, 'user' );
            user = await users.service.query({_id: req.params.id}, defaultUserPopulate)
            res.json(user);
        } 
    }
});

/* POST update user points */
router.post('/updateUserPoints', async (req, res) => {
    if(req.session.osuId == 3178418 || req.session.osuId == 1052994 || req.session.osuId == 1541323){
        
        let u = await users.service.query({}, {}, null, true);

        const populate = [
            { populate: 'host',  display: '_id osuId username' },
            { populate: 'modders',  display: '_id osuId username' },
            { populate: 'quest',  display: '_id name status reward completed deadline' },
            { innerPopulate: 'tasks',  populate: { path: 'mappers' } },
        ];
        let maps = await beatmaps.service.query({status: "Ranked"}, populate, null, true);
        
        u.forEach(user => {
            let pointsObject = {
                "Easy":{"num":5, "total":0}, 
                "Normal":{"num":6, "total":0}, 
                "Hard":{"num":7, "total":0}, 
                "Insane":{"num":8, "total":0}, 
                "Expert":{"num":8, "total":0}, 
                "Storyboard":{"num":10, "total":0}, 
                "Mod":{"num":1, "total":0}, 
                "Host":{"num":5, "total":0},
                "QuestReward":{"num":0, "total":0},
                "Rank":{"value":0},
                "osu":{"total":0},
                "taiko":{"total":0},
                "catch":{"total":0},
                "mania":{"total":0},
                "Quests":{"list":[]}};
    
            maps.forEach(map => {
                let questParticipation = false;
                let length;

                if(map.length <= 90){
                    length = map.length
                }else if (map.length <= 150){
                    length = ((map.length - 90)/2) + 90;
                }else if (map.length <= 210){
                    length = ((map.length - 150)/3) + 120;
                }else if (map.length <= 270){
                    length = ((map.length - 210)/4) + 140;
                }else{
                    length = ((map.length - 270)/5) + 155;
                }
                
                let lengthNerf = 124.666; //130=3:00, 120=2:30, 124.666=median of all ranked mg maps (2:43)
    
                
                //task points
                map.tasks.forEach(task => {
                    task.mappers.forEach(mapper => {
                        if(mapper._id.toString() == user._id.toString()){
                            if(task.name != "Storyboard"){
                                let questBonus = 0;
                                if(map.quest){
                                    questBonus = 2;
                                    questBonus *= (length/lengthNerf);
                                    questParticipation = true;
                                }
                                let taskPoints = pointsObject[task.name]["num"];
                                taskPoints *= (length/lengthNerf);
                                /*if(task.mode == 'taiko'){
                                    taskPoints *= 0.75;
                                }*/
                                pointsObject[task.name]["total"] += (taskPoints + questBonus) / task.mappers.length;
                                pointsObject[task.mode]["total"] += (taskPoints + questBonus) / task.mappers.length;
                            }else{
                                if(task.sbQuality){
                                    if(task.sbQuality == 2){
                                        pointsObject[task.name]["total"] += 7.5 / task.mappers.length;
                                    }else{
                                        pointsObject[task.name]["total"] += (task.sbQuality*task.sbQuality + 1) / task.mappers.length; //sb worth 2 or 10
                                    }
                                    
                                }
                                
                            }

                        }
                    });
                });

                //mod points
                map.modders.forEach(modder => {
                    if(modder.id == user.id){
                        pointsObject["Mod"]["total"] += pointsObject["Mod"]["num"];
                    }
                });

                //host points
                let host = map.host.id == user.id;
                if(host){
                    pointsObject["Host"]["total"] += pointsObject["Host"]["num"];
                }

                //quest reward points
                if(questParticipation){
                    if(pointsObject["Quests"]["list"].indexOf(map.quest._id) < 0 && map.quest.status=="done"){
                        pointsObject["Quests"]["list"].push(map.quest._id);
                        if(map.quest.deadline - map.quest.completed > 0){
                            pointsObject["QuestReward"]["total"] += map.quest.reward;
                        }
                    }
                }


            });
            //set rank
            let totalPoints = pointsObject["Easy"]["total"] + 
                pointsObject["Normal"]["total"] + 
                pointsObject["Hard"]["total"] + 
                pointsObject["Insane"]["total"] + 
                pointsObject["Expert"]["total"] + 
                pointsObject["Storyboard"]["total"] + 
                pointsObject["Mod"]["total"] + 
                pointsObject["Host"]["total"] + 
                pointsObject["QuestReward"]["total"] + 
                user.legacyPoints - user.penaltyPoints;
            if(totalPoints < 100){
                pointsObject["Rank"]["value"] = 0;
            }else if(totalPoints < 250){
                pointsObject["Rank"]["value"] = 1;
            }else if(totalPoints < 500){
                pointsObject["Rank"]["value"] = 2;
            }else{
                pointsObject["Rank"]["value"] = 3;
            } 
            
            users.service.update(user._id, {easyPoints: pointsObject["Easy"]["total"]});
            users.service.update(user._id, {normalPoints: pointsObject["Normal"]["total"]});
            users.service.update(user._id, {hardPoints: pointsObject["Hard"]["total"]});
            users.service.update(user._id, {insanePoints: pointsObject["Insane"]["total"]});
            users.service.update(user._id, {expertPoints: pointsObject["Expert"]["total"]});
            users.service.update(user._id, {storyboardPoints: pointsObject["Storyboard"]["total"]});
            users.service.update(user._id, {modPoints: pointsObject["Mod"]["total"]});
            users.service.update(user._id, {hostPoints: pointsObject["Host"]["total"]});
            users.service.update(user._id, {questPoints: pointsObject["QuestReward"]["total"]});
            users.service.update(user._id, {rank: pointsObject["Rank"]["value"]});
            users.service.update(user._id, {osuPoints: pointsObject["osu"]["total"]});
            users.service.update(user._id, {taikoPoints: pointsObject["taiko"]["total"]});
            users.service.update(user._id, {catchPoints: pointsObject["catch"]["total"]});
            users.service.update(user._id, {maniaPoints: pointsObject["mania"]["total"]});
            users.service.update(user._id, {completedQuests: pointsObject["Quests"]["list"]});
        });
        res.json("user points updated")
    }
});

//featured artists

/* POST add artist to db */
router.post('/addArtist/:label', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        let fa = await featuredArtists.service.createArtist(req.params.label, req.body.osuId);

        res.json(`${fa.label} added`);

        logs.service.create(req.session.mongoId, `added "${fa.label}" to the Featured Artist database`, fa._id, 'artist' );
    }
});

/* POST rename artist */
router.post('/renameLabel/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        let fa = await featuredArtists.service.update(req.params.id, {label: req.body.name});
        fa = await featuredArtists.service.query({_id: req.params.id}, defaultArtistPopulate)

        res.json(fa);
        logs.service.create(req.session.mongoId, `renamed a featured artist`, fa._id, 'artist' );
    }
});

/* POST update artist osuId */
router.post('/updateLabelOsuId/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        let fa = await featuredArtists.service.update(req.params.id, {osuId: req.body.osuId});
        fa = await featuredArtists.service.query({_id: req.params.id}, defaultArtistPopulate)

        res.json(fa);
    }
});

/* POST add song to artist */
router.post('/addSong/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        let song = await featuredArtists.service.createSong(req.body.artist, req.body.title);
        console.log(req.body.artist + req.body.title);
        let fa = await featuredArtists.service.update(req.params.id, { $push: { songs: song } })
        fa = await featuredArtists.service.query({_id: req.params.id}, defaultArtistPopulate);

        res.json(fa);
        logs.service.create(req.session.mongoId, `added "${req.body.artist} - ${req.body.title}" to the Featured Artist songs database`, fa._id, 'artist' );
    }
});

/* POST remove song from artist */
router.post('/removeSong/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        await featuredArtists.service.update(req.params.id, { $pull: {songs: req.body.songId} });
        await featuredArtists.service.removeSong(req.body.songId);
        let fa = await featuredArtists.service.query({_id: req.params.id}, defaultArtistPopulate);
        res.json(fa);

        logs.service.create(req.session.mongoId, `removed a song from the Featured Artist database`, fa._id, 'artist' );
    }
});

/* POST edit metadata */
router.post('/updateMetadata/:id', async (req, res) => {
    if (req.session.osuId == 3178418 || req.session.osuId == 1052994) {
        await featuredArtists.service.updateSong(req.body.songId, {artist: req.body.artist});
        await featuredArtists.service.updateSong(req.body.songId, {title: req.body.title});
       
        let fa = await featuredArtists.service.query({_id: req.params.id}, defaultArtistPopulate);
        res.json(fa);

        logs.service.create(req.session.mongoId, `edited a song's metadata`, fa._id, 'artist' );
    }
});

module.exports = router;
