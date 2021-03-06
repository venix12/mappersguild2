import express from 'express';
import { FeaturedArtistModel } from '../../models/featuredArtist';
import { FeaturedArtistStatus } from '../../interfaces/featuredArtist';
import { isLoggedIn, isSecret } from '../../helpers/middlewares';

const featuredArtistsRouter = express.Router();

featuredArtistsRouter.use(isLoggedIn);

/* GET artists for new map entry */
featuredArtistsRouter.get('/', async (req, res) => {
    const featuredArtists = await FeaturedArtistModel.find({ status: FeaturedArtistStatus.Public });

    res.json(featuredArtists);
});

/* GET showcase artists for new map entry */
featuredArtistsRouter.get('/showcase', isSecret, async (req, res) => {
    const featuredArtists = await FeaturedArtistModel.find({ status: FeaturedArtistStatus.Showcase });

    res.json(featuredArtists);
});

/* GET songs for new map entry */
featuredArtistsRouter.get('/:id/songs', async (req, res) => {
    const fa = await FeaturedArtistModel
        .findOne({ _id: req.params.id, status: FeaturedArtistStatus.Public })
        .populate({ path: 'songs', select: 'artist title' })
        .sort({ label: -1 })
        .orFail();

    res.json(fa.songs);
});

/* GET showcase songs for new map entry */
featuredArtistsRouter.get('/:id/showcaseSongs', isSecret, async (req, res) => {
    const fa = await FeaturedArtistModel
        .findOne({ _id: req.params.id, status: FeaturedArtistStatus.Showcase })
        .populate({ path: 'songs', select: 'artist title' })
        .sort({ label: -1 })
        .orFail();

    res.json(fa.songs);
});

export default featuredArtistsRouter;
