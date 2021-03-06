import { Module } from 'vuex';
import { MainState } from './main';
import { Beatmap, BeatmapStatus } from '@interfaces/beatmap/beatmap';
import { Quest } from '@interfaces/quest';
import { User } from '@interfaces/user';

interface AdminState {
    actionBeatmaps: Beatmap[];
    actionBeatmapsLoading: boolean;
    actionQuests: Quest[];
    actionQuestsLoading: boolean;
    actionUsers: User[];
    actionUsersLoading: boolean;
    selectedBeatmap: null | Beatmap;
    selectedQuest: null | Quest;
    selectedUser: null | User;
}

const store: Module<AdminState, MainState> = {
    state: {
        actionBeatmaps: [],
        actionBeatmapsLoading: false,
        actionQuests: [],
        actionQuestsLoading: false,
        actionUsers: [],
        actionUsersLoading: false,
        selectedBeatmap: null,
        selectedQuest: null,
        selectedUser: null,
    },
    mutations: {
        setActionBeatmaps (state, actionBeatmaps: Beatmap[]): void {
            state.actionBeatmaps = actionBeatmaps;
        },
        setActionBeatmapsLoading (state, value: boolean): void {
            state.actionBeatmapsLoading = value;
        },
        setActionQuests (state, actionQuests: Quest[]): void {
            state.actionQuests = actionQuests;
        },
        setActionQuestsLoading (state, value: boolean): void {
            state.actionQuestsLoading = value;
        },
        setActionUsers (state, actionUsers: User[]): void {
            state.actionUsers = actionUsers;
        },
        setActionUsersLoading (state, value: boolean): void {
            state.actionUsersLoading = value;
        },
        setSelectedBeatmap (state, selectedBeatmap: Beatmap): void {
            state.selectedBeatmap = selectedBeatmap;
        },
        setSelectedQuest (state, selectedQuest: Quest): void {
            state.selectedQuest = selectedQuest;
        },
        setSelectedUser (state, selectedUser: User): void {
            state.selectedUser = selectedUser;
        },

        // beatmaps
        updateBeatmapStatus (state, payload): void {
            const beatmap = state.actionBeatmaps.find(b => b.id == payload.beatmapId);

            if (beatmap) {
                beatmap.status = payload.status;

                if (beatmap.status == BeatmapStatus.Ranked) {
                    const i = state.actionBeatmaps.findIndex(b => b.id === payload.beatmapId);
                    state.actionBeatmaps.splice(i,1);
                }
            }
        },
        deleteTask (state, payload): void {
            const beatmap = state.actionBeatmaps.find(b => b.id == payload.beatmapId);

            if (beatmap) {
                const i = beatmap.tasks.findIndex(t => t.id == payload.taskId);

                if (i !== -1) {
                    beatmap.tasks.splice(i, 1);
                }
            }
        },
        deleteModder (state, payload): void {
            const beatmap = state.actionBeatmaps.find(b => b.id == payload.beatmapId);

            if (beatmap) {
                const i = beatmap.modders.findIndex(m => m.id == payload.modderId);

                if (i !== -1) {
                    beatmap.modders.splice(i, 1);
                }
            }
        },
        updateUrl (state, payload): void {
            const beatmap = state.actionBeatmaps.find(b => b.id == payload.beatmapId);

            if (beatmap) {
                beatmap.url = payload.url;
            }
        },
        updateStoryboardQuality (state, payload): void {
            const beatmap = state.actionBeatmaps.find(b => b.id == payload.beatmapId);

            if (beatmap) {
                const i = beatmap.tasks.findIndex(t => t.id == payload.taskId);

                if (i !== -1) beatmap.tasks[i] = payload.task;
            }
        },
        updatePackId (state, payload): void {
            const beatmap = state.actionBeatmaps.find(b => b.id == payload.beatmapId);

            if (beatmap) {
                beatmap.packId = payload.packId;
            }
        },
        updateIsShowcase (state, payload): void {
            const beatmap = state.actionBeatmaps.find(b => b.id == payload.beatmapId);

            if (beatmap) {
                beatmap.isShowcase = payload.isShowcase;
            }
        },
        updateQueuedForRank (state, payload): void {
            const beatmap = state.actionBeatmaps.find(b => b.id == payload.beatmapId);

            if (beatmap) {
                beatmap.queuedForRank = payload.queuedForRank;
            }
        },

        // quests
        updateArt (state, payload): void {
            const quest = state.actionQuests.find(q => q.id == payload.questId);

            if (quest) {
                quest.art = payload.art;
            }
        },
        renameQuest (state, payload): void {
            const quest = state.actionQuests.find(q => q.id == payload.questId);

            if (quest) {
                quest.name = payload.name;
            }
        },
        updateDescription (state, payload): void {
            const quest = state.actionQuests.find(q => q.id == payload.questId);

            if (quest) {
                quest.descriptionMain = payload.description;
            }
        },
        updateRequiredMapsets (state, payload): void {
            const quest = state.actionQuests.find(q => q.id == payload.questId);

            if (quest) {
                quest.requiredMapsets = payload.requiredMapsets;
            }
        },
        updatePrice (state, payload): void {
            const quest = state.actionQuests.find(q => q.id == payload.questId);

            if (quest) {
                quest.price = payload.price;
            }
        },
        updateTimeframe (state, payload): void {
            const quest = state.actionQuests.find(q => q.id == payload.questId);

            if (quest) {
                quest.timeframe = payload.timeframe * (24*3600*1000);
            }
        },
        updateMinParty (state, payload): void {
            const quest = state.actionQuests.find(q => q.id == payload.questId);

            if (quest) {
                quest.minParty = payload.minParty;
            }
        },
        updateMaxParty (state, payload): void {
            const quest = state.actionQuests.find(q => q.id == payload.questId);

            if (quest) {
                quest.maxParty = payload.maxParty;
            }
        },
        updateStatus (state, payload): void {
            const quest = state.actionQuests.find(q => q.id == payload.questId);

            if (quest) {
                quest.status = payload.status;

                if (quest.status == 'open' || quest.status == 'rejected') {
                    const i = state.actionQuests.findIndex(q => q.id === payload.questId);
                    state.actionQuests.splice(i,1);
                }
            }
        },
        updateQueuedForCompletion (state, payload): void {
            const quest = state.actionQuests.find(q => q.id == payload.questId);

            if (quest) {
                console.log(payload.queuedForCompletion);
                quest.queuedForCompletion = payload.queuedForCompletion;
            }
        },

        // users
        updateGroup (state, payload): void {
            const user = state.actionUsers.find(u => u.id == payload.userId);

            if (user) {
                user.group = payload.group;
            }
        },
        updateBadge (state, payload): void {
            const user = state.actionUsers.find(u => u.id == payload.userId);

            if (user) {
                user.queuedBadge = payload.badge;
            }
        },
        updateDiscordId (state, payload): void {
            const user = state.actionUsers.find(u => u.id == payload.userId);

            if (user) {
                user.discordId = payload.discordId;
            }
        },
        updateBypassLogin (state, payload): void {
            const user = state.actionUsers.find(u => u.id == payload.userId);

            if (user) {
                user.bypassLogin = payload.bypassLogin;
            }
        },
    },
};

export default store;
