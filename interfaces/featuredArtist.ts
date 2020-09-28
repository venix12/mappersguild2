import { FeaturedSong } from './featuredSong';

export enum FeaturedArtistStatus {
    Public = 'public',
    Private = 'private',
    Showcase = 'showcase',
}

export interface FeaturedArtist {
    _id: any;
    id: string;
    label: string;
    osuId: number;
    status: FeaturedArtistStatus;
    songs: FeaturedSong[];
    lastContacted: Date;
    notes: string;

    // discussion
    isContacted: boolean;
    isResponded: boolean;
    tracksSelected: boolean;
    isRejected: boolean;

    // contract
    contractSent: boolean;
    contractFinalized: boolean;

    // publication
    projectedRelease?: Date;
    songsReceived: boolean;
    songsTimed: boolean;
    assetsReceived: boolean;
    isUpToDate: boolean;

    // other
    hasRankedMaps: boolean;
    isMinor: boolean;
}