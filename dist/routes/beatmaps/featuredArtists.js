"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const featuredArtist_1 = require("../../models/featuredArtist");
const featuredArtist_2 = require("../../interfaces/featuredArtist");
const middlewares_1 = require("../../helpers/middlewares");
const featuredArtistsRouter = express_1.default.Router();
featuredArtistsRouter.use(middlewares_1.isLoggedIn);
featuredArtistsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const featuredArtists = yield featuredArtist_1.FeaturedArtistModel.find({ status: featuredArtist_2.FeaturedArtistStatus.Public });
    res.json(featuredArtists);
}));
featuredArtistsRouter.get('/showcase', middlewares_1.isSecret, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const featuredArtists = yield featuredArtist_1.FeaturedArtistModel.find({ status: featuredArtist_2.FeaturedArtistStatus.Showcase });
    res.json(featuredArtists);
}));
featuredArtistsRouter.get('/:id/songs', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fa = yield featuredArtist_1.FeaturedArtistModel
        .findOne({ _id: req.params.id, status: featuredArtist_2.FeaturedArtistStatus.Public })
        .populate({ path: 'songs', select: 'artist title' })
        .sort({ label: -1 })
        .orFail();
    res.json(fa.songs);
}));
featuredArtistsRouter.get('/:id/showcaseSongs', middlewares_1.isSecret, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fa = yield featuredArtist_1.FeaturedArtistModel
        .findOne({ _id: req.params.id, status: featuredArtist_2.FeaturedArtistStatus.Showcase })
        .populate({ path: 'songs', select: 'artist title' })
        .sort({ label: -1 })
        .orFail();
    res.json(fa.songs);
}));
exports.default = featuredArtistsRouter;
