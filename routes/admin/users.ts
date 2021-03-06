import express from 'express';
import { isLoggedIn, isAdmin, isSuperAdmin } from '../../helpers/middlewares';
import { UserModel } from '../../models/user';
import { updateUserPoints } from '../../helpers/points';
import { webhookPost, webhookColors } from '../../helpers/discordApi';
import { UserGroup, User } from '../../interfaces/user';

const adminUsersRouter = express.Router();

adminUsersRouter.use(isLoggedIn);
adminUsersRouter.use(isAdmin);
adminUsersRouter.use(isSuperAdmin);

/* GET users */
adminUsersRouter.get('/load', async (req, res) => {
    const users = await UserModel.find({}).sort({ username: 1 });

    res.json(users);
});

/* POST update user queuedBadge */
adminUsersRouter.post('/:id/updateBadge', async (req, res) => {
    const badge = parseInt(req.body.badge, 10);
    const user = await UserModel.findByIdAndUpdate(req.params.id, { queuedBadge: badge }).orFail();

    res.json(badge);
});

/* POST update user group */
adminUsersRouter.post('/:id/updateGroup', async (req, res) => {
    await UserModel.findByIdAndUpdate(req.params.id, { group: req.body.group }).orFail();

    res.json(req.body.group);
});

/* POST update user discordId */
adminUsersRouter.post('/:id/updateDiscordId', async (req, res) => {
    await UserModel.findByIdAndUpdate(req.params.id, { discordId: req.body.discordId }).orFail();

    res.json(req.body.discordId);
});

/* POST calculate user points */
adminUsersRouter.post('/:id/calculateUserPoints', async (req, res) => {
    const points = await updateUserPoints(req.params.id);

    res.json(points);
});

/* POST update user points */
adminUsersRouter.post('/updateAllUserPoints', async (req, res) => {
    const users = await UserModel.find({}).select('username').orFail();

    for (const user of users) {
        updateUserPoints(user.id);
    }

    res.json('user points updated');
});

/* POST toggle bypassLogin */
adminUsersRouter.post('/:id/toggleBypassLogin', async (req, res) => {
    const bypassLogin = req.body.bypassLogin;
    const group = bypassLogin ? UserGroup.User : UserGroup.Spectator;

    await UserModel.findByIdAndUpdate(req.params.id, { bypassLogin, group }).orFail();

    res.json({ bypassLogin, group });
});

/* GET find tiered users */
adminUsersRouter.get('/findTieredUsers', async (req, res) => {
    const [osuUsers, taikoUsers, catchUsers, maniaUsers] = await Promise.all([
        UserModel
            .find({ rank: { $gte: 1 }, osuPoints: { $gte: 1 } })
            .orFail(),
        UserModel
            .find({ rank: { $gte: 1 }, taikoPoints: { $gte: 1 } })
            .orFail(),
        UserModel
            .find({ rank: { $gte: 1 }, catchPoints: { $gte: 1 } })
            .orFail(),
        UserModel
            .find({ rank: { $gte: 1 }, maniaPoints: { $gte: 1 } })
            .orFail(),
    ]);

    res.json({ osuUsers, taikoUsers, catchUsers, maniaUsers });
});

/* POST find input users for DiscordHighlightGenerator */
adminUsersRouter.post('/findInputUsers', async (req, res) => {
    const inputUsers = req.body.inputUsers;
    const usernames = inputUsers.split('\n');
    const users: User[] = [];

    for (const username of usernames) {
        const user = await UserModel.findOne({ username }).orFail();
        users.push(user);
    }

    res.json({ users });
});

export default adminUsersRouter;
