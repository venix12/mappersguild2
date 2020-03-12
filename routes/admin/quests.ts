import express from 'express';
import { isLoggedIn, isAdmin, isSuperAdmin } from '../../helpers/middlewares';
import { QuestService, Quest } from '../../models/quest';
import { QuestStatus } from '../../interfaces/quest';
import { LogService } from '../../models/log';
import { User } from '../../models/user';
import { LogCategory } from '../../interfaces/log';
import { webhookPost } from '../../helpers/discordApi';
import { UserService } from '../../models/user';
import { BeatmapService } from '../../models/beatmap/beatmap';
import { PartyService } from '../../models/party';
import { canFail } from '../../helpers/helpers';

const adminQuestsRouter = express.Router();

adminQuestsRouter.use(isLoggedIn);
adminQuestsRouter.use(isAdmin);
adminQuestsRouter.use(isSuperAdmin);

/* GET quests - admin page */
adminQuestsRouter.get('/', (req, res) => {
    res.render('admin/quests', {
        title: 'Quests - Admin',
        script: 'adminQuests.js',
        loggedInAs: req.session?.osuId,
        userTotalPoints: res.locals.userRequest.totalPoints,
    });
});

/* GET quests */
adminQuestsRouter.get('/load', async (req, res) => {
    const q = await QuestService.queryAll({
        defaultPopulate: true,
        sort: { status: -1, name: 1 },
    });

    res.json(q);
});

/* POST add quest */
adminQuestsRouter.post('/create', async (req, res) => {
    req.body.modes = ['osu', 'taiko', 'catch', 'mania'];
    const quest = await QuestService.create(req.body);

    if (!QuestService.isError(quest)) {
        LogService.create(req.session?.mongoId, `created quest "${quest.name}"`, LogCategory.Quest);

        webhookPost([{
            author: {
                name: `New Quest: ${quest.name}`,
                url: `https://mappersguild.com/quests`,
            },
            thumbnail: {
                url: `https://assets.ppy.sh/artists/${quest.art}/cover.jpg`,
            },
            color: 16734308,
            fields: [{
                name: 'Objective',
                value: `${quest.descriptionMain}`,
            },
            {
                name: 'Party',
                value: `${quest.minParty == quest.maxParty ? quest.maxParty : quest.minParty + '-' + quest.maxParty} member${quest.maxParty == 1 ? '' : 's'}`,
            },
            {
                name: 'Bonus',
                value: `${quest.reward} points for each member`,
            }],
        }]);
    }

    res.json(quest);
});

/* POST rename quest */
adminQuestsRouter.post('/:id/rename', canFail(async (req, res) => {
    await QuestService.updateOrFail(req.params.id, { name: req.body.name });

    res.json(req.body.name);
}));

/* POST rename quest */
adminQuestsRouter.post('/:id/updateDescription', canFail(async (req, res) => {
    await QuestService.updateOrFail(req.params.id, { descriptionMain: req.body.description });

    res.json(req.body.description);
}));

/* POST drop quest */
adminQuestsRouter.post('/:id/drop', canFail(async (req, res) => {
    let q = await QuestService.queryByIdOrFail(req.params.id, { defaultPopulate: true });
    const openQuest = await QuestService.queryOne({
        query: {
            name: q.name,
            status: QuestStatus.Open,
        },
    });

    if (openQuest && !QuestService.isError(openQuest)) {
        await Promise.all([
            QuestService.update(openQuest._id, {
                $push: { modes: q.modes },
            }),
            QuestService.remove(req.params.id),
        ]);
    } else {
        await QuestService.update(req.params.id, {
            status: QuestStatus.Open,
            currentParty: null,
        });
    }

    for (let i = 0; i < q.currentParty.members.length; i++) {
        const member = await UserService.queryByIdOrFail(q.currentParty.members[i]);
        member.penaltyPoints = member.penaltyPoints + q.reward;
        await UserService.saveOrFail(member);
    }

    const maps = await BeatmapService.queryAllOrFail({});

    for (let i = 0; i < maps.length; i++) {
        if (maps[i].quest && maps[i].quest.toString() == q.id) {
            BeatmapService.updateOrFail(maps[i]._id, { quest: undefined });
        }
    }

    await PartyService.remove(q.currentParty._id);

    if (openQuest && !QuestService.isError(openQuest)) {
        res.json(q);
    } else {
        q = await QuestService.queryByIdOrFail(req.params.id, { defaultPopulate: true });

        res.json(q);
    }

    LogService.create(req.session?.mongoId, `forced party to drop quest "${q.name}"`, LogCategory.Quest);
}));

/* POST complete quest */
adminQuestsRouter.post('/:id/complete', canFail(async (req, res) => {
    let quest = await QuestService.queryByIdOrFail(req.params.id, { defaultPopulate: true });

    if (quest.status == QuestStatus.WIP) {
        //webhook
        const memberList = (quest.currentParty.members as User[])
            .map(m => m.username)
            .join(', ');

        webhookPost([{
            author: {
                name: `Party completed quest: "${quest.name}"`,
                url: `https://mappersguild.com/quests`,
                icon_url: `https://a.ppy.sh/${quest.currentParty.leader.osuId}`,
            },
            color: 3138274,
            thumbnail: {
                url: `https://assets.ppy.sh/artists/${quest.art}/cover.jpg`,
            },
            fields: [{
                name: 'Members',
                value: memberList,
            }],
        }]);

        //quest changes
        await PartyService.remove(quest.currentParty._id);
        await QuestService.update(quest._id, {
            status: QuestStatus.Done,
            currentParty: null,
            completedMembers: quest.currentParty.members,
            completed: new Date(),
        });

        quest = await QuestService.queryByIdOrFail(req.params.id, { defaultPopulate: true });
    }

    res.json(quest);

    LogService.create(req.session.mongoId, `marked quest "${quest.name}" as complete`, LogCategory.Quest);
}));

/* POST duplicate quest */
adminQuestsRouter.post('/:id/duplicate', canFail(async (req, res) => {
    const q = await QuestService.queryByIdOrFail(req.params.id);
    const body: Partial<Quest> = {
        name: req.body.name,
        reward: q.reward,
        descriptionMain: q.descriptionMain,
        timeframe: q.timeframe,
        minParty: q.minParty,
        maxParty: q.maxParty,
        minRank: q.minRank,
        art: q.art,
        modes: ['osu', 'taiko', 'catch', 'mania'],
    };
    const newQuest = await QuestService.create(body);

    res.json(newQuest);
}));

/* POST reset quest deadline */
adminQuestsRouter.post('/:id/reset', canFail(async (req, res) => {
    const date = new Date();
    date.setDate(date.getDate() + 7);

    await QuestService.updateOrFail(req.params.id, { deadline: date });

    res.json(date);
}));

/* POST delete quest */
adminQuestsRouter.post('/:id/delete', canFail(async (req, res) => {
    const q = await QuestService.queryByIdOrFail(req.params.id);

    if (q.status == QuestStatus.Open) {
        await QuestService.removeOrFail(req.params.id);
        res.json({ success: 'ok' });

        LogService.create(req.session.mongoId, `deleted quest "${q.name}"`, LogCategory.Quest);
    } else {
        res.json({ success: 'ok' });
    }
}));


/* POST toggle quest mode */
adminQuestsRouter.post('/:id/toggleMode', canFail(async (req, res) => {
    let quest = await QuestService.queryByIdOrFail(req.params.id);

    if (quest.modes.includes(req.body.mode)) {
        await QuestService.update(req.params.id, { $pull: { modes: req.body.mode } });
    } else {
        await QuestService.update(req.params.id, { $push: { modes: req.body.mode } });
    }

    quest = await QuestService.queryByIdOrFail(req.params.id);
    res.json(quest);
}));

export default adminQuestsRouter;