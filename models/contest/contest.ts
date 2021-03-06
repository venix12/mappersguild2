import mongoose, { Document, Schema } from 'mongoose';
import { Contest as IContest } from '../../interfaces/contest/contest';

export interface Contest extends IContest, Document {
    id: string;
}

const contestSchema = new Schema({
    name: { type: String, required: true },
    status: { type: String, enum: ['beatmapping', 'screening', 'judging', 'complete'], default: 'beatmapping' },
    contestStart: { type: Date },
    submissions: [{ type: 'ObjectId', ref: 'Submission' }],
    screeners: [{ type: 'ObjectId', ref: 'User' }],
    judges: [{ type: 'ObjectId', ref: 'User' }],
    voters: [{ type: 'ObjectId', ref: 'User' }],
    judgingThreshold: { type: Number },
    isTheme: { type: Boolean },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

const ContestModel = mongoose.model<Contest>('Contest', contestSchema);

export { ContestModel };
