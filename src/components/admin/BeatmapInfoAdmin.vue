<template>
    <modal-dialog id="editBeatmap" :loaded="Boolean(beatmap)">
        <template #header>
            <a
                v-if="beatmap.url"
                :href="beatmap.url"
                target="_blank"
            >
                {{ beatmap.song.artist }} - {{ beatmap.song.title }}
            </a>
            <span v-else>{{ beatmap.song.artist }} - {{ beatmap.song.title }}</span>
            (<a :href="'https://osu.ppy.sh/users/' + beatmap.host.osuId" target="_blank">{{ beatmap.host.username }}</a>)
        </template>

        <template #default>
            <div class="container">
                <p class="form-row">
                    <select v-model="status" class="form-control form-control-sm w-25 mx-2">
                        <option value="WIP">
                            WIP
                        </option>
                        <option value="Done">
                            Done
                        </option>
                        <option value="Qualified">
                            Qualified
                        </option>
                        <option value="Ranked">
                            Ranked
                        </option>
                    </select>
                    <button class="btn btn-sm btn-outline-info" @click="updateBeatmapStatus($event)">
                        Save status
                    </button>
                </p>
                <p class="form-row">
                    <select v-model="taskId" class="form-control form-control-sm w-50 mx-2">
                        <option v-for="task in sortedTasks" :key="task.id" :value="task.id">
                            {{ task.name }} ---
                            <template v-for="(mapper, i) in task.mappers">
                                {{ listUser(mapper.username, i, task.mappers.length) }}
                            </template>
                            {{ task.name == 'Storyboard' ? ' --- ' + task.sbQuality : '' }}
                        </option>
                    </select>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteTask($event)">
                        Remove difficulty
                    </button>
                </p>
                <p class="form-row">
                    <select v-model="modderId" class="form-control form-control-sm w-50 mx-2">
                        <option v-for="modder in beatmap.modders" :key="modder.id" :value="modder.id">
                            {{ modder.username }}
                        </option>
                    </select>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteModder($event)">
                        Remove modder
                    </button>
                </p>
                <p class="form-row">
                    <input
                        v-model="beatmapUrl"
                        class="form-control form-control-sm mx-2 w-75"
                        type="text"
                        autocomplete="off"
                        placeholder="beatmap url..."
                    >
                    <button class="btn btn-sm btn-outline-info" @click="updateUrl($event)">
                        Save URL
                    </button>
                </p>
                <p v-if="storyboardTaskId" class="form-row">
                    <select v-model="storyboardQuality" class="form-control form-control-sm w-25 mx-2">
                        <option value="1">
                            1
                        </option>
                        <option value="2">
                            2
                        </option>
                        <option value="3">
                            3
                        </option>
                    </select>
                    <button class="btn btn-sm btn-outline-info" @click="updateStoryboardQuality($event)">
                        Save Storyboard Quality
                    </button>
                </p>
                <p class="form-row">
                    <input
                        v-model="packId"
                        class="form-control form-control-sm mx-2 w-50"
                        type="text"
                        autocomplete="off"
                        placeholder="osu! beatmap pack ID..."
                    >
                    <button class="btn btn-sm btn-outline-info" @click="updatePackId($event)">
                        Save pack ID
                    </button>
                </p>
                <p>
                    Featured Artist showcase:
                    <span class="text-danger">{{ beatmap.isShowcase ? 'true' : 'false' }}</span>
                    <button class="btn btn-sm btn-outline-info" @click="updateIsShowcase($event)">
                        Toggle
                    </button>
                </p>
            </div>
        </template>
    </modal-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import ModalDialog from '@components/ModalDialog.vue';
import { Beatmap } from '../../../interfaces/beatmap/beatmap';
import { Task } from '../../../interfaces/beatmap/task';

export default Vue.extend({
    name: 'BeatmapInfoAdmin',
    components: {
        ModalDialog,
    },
    props: {
        beatmap: {
            type: Object as () => Beatmap,
            required: true,
        },
    },
    data() {
        return {
            status: this.beatmap.status,
            taskId: null,
            modderId: null,
            beatmapUrl: this.beatmap.url,
            storyboardQuality: null,
            storyboardTaskId: null,
            packId: this.beatmap.packId,
        };
    },
    computed: {
        sortedTasks(): Task[] {
            const sortOrder = ['Easy', 'Normal', 'Hard', 'Insane', 'Expert', 'Storyboard'];

            return [...this.beatmap.tasks].sort(function(a, b) {
                return sortOrder.indexOf(a.name) - sortOrder.indexOf(b.name);
            });
        },
    },
    watch: {
        beatmap(): void {
            this.findBeatmapInfo();
        },
    },
    mounted() {
        this.findBeatmapInfo();
    },
    methods: {
        findBeatmapInfo(): void {
            this.status = this.beatmap.status;
            this.taskId = null;
            this.modderId = null;
            this.beatmapUrl = this.beatmap.url;
            this.storyboardQuality = null;
            this.storyboardTaskId = null;
            this.packId = this.beatmap.packId;
            this.beatmap.tasks.forEach(task => {
                if (task.name == 'Storyboard') {
                    if (task.sbQuality) this.storyboardQuality = task.sbQuality;
                    this.storyboardTaskId = task.id;
                }
            });
        },
        async updateBeatmapStatus(e): Promise<void> {
            const status = await this.executePost(`/admin/beatmaps/${this.beatmap.id}/updateStatus`, { status: this.status }, e);

            if (!this.isError(status)) {
                this.$store.dispatch('updateToastMessages', {
                    message: `updated beatmap status`,
                    type: 'info',
                });
                this.$store.commit('updateBeatmapStatus', {
                    beatmapId: this.beatmap.id,
                    status,
                });
            }
        },
        async deleteTask(e): Promise<void> {
            const res = await this.executePost(`/admin/beatmaps/${this.beatmap.id}/tasks/${this.taskId}/delete`, {}, e);

            if (!this.isError(res)) {
                this.$store.dispatch('updateToastMessages', {
                    message: `deleted task`,
                    type: 'info',
                });
                this.$store.commit('deleteTask', {
                    beatmapId: this.beatmap.id,
                    taskId: this.taskId,
                });
            }
        },
        async deleteModder(e): Promise<void> {
            const res = await this.executePost(`/admin/beatmaps/${this.beatmap.id}/modders/${this.modderId}/delete`, {}, e);

            if (!this.isError(res)) {
                this.$store.dispatch('updateToastMessages', {
                    message: `deleted modder`,
                    type: 'info',
                });
                this.$store.commit('deleteModder', {
                    beatmapId: this.beatmap.id,
                    modderId: this.modderId,
                });
            }
        },
        async updateUrl(e): Promise<void> {
            const url = await this.executePost(`/admin/beatmaps/${this.beatmap.id}/updateUrl`, { url: this.beatmapUrl }, e);

            if (!this.isError(url)) {
                this.$store.dispatch('updateToastMessages', {
                    message: `updated URL`,
                    type: 'info',
                });
                this.$store.commit('updateUrl', {
                    beatmapId: this.beatmap.id,
                    url,
                });
            }
        },
        async updateStoryboardQuality(e): Promise<void> {
            const task = await this.executePost(`/admin/beatmaps/${this.beatmap.id}/updateStoryboardQuality`, { storyboardQuality: this.storyboardQuality, taskId: this.storyboardTaskId }, e);

            if (!this.isError(task)) {
                this.$store.dispatch('updateToastMessages', {
                    message: `updated storyboard quality`,
                    type: 'info',
                });
                this.$store.commit('updateStoryboardQuality', {
                    beatmapId: this.beatmap.id,
                    taskId: this.storyboardTaskId,
                    task,
                });
            }
        },
        async updatePackId(e): Promise<void> {
            const packId = await this.executePost(`/admin/beatmaps/${this.beatmap.id}/updatePackId`, { packId: this.packId }, e);

            if (!this.isError(packId)) {
                this.$store.dispatch('updateToastMessages', {
                    message: `updated pack id`,
                    type: 'info',
                });
                this.$store.commit('updatePackId', {
                    beatmapId: this.beatmap.id,
                    packId,
                });
            }
        },
        async updateIsShowcase(e): Promise<void> {
            const isShowcase = await this.executePost(`/admin/beatmaps/${this.beatmap.id}/updateIsShowcase`, { isShowcase: !this.beatmap.isShowcase }, e);

            if (!this.isError(isShowcase)) {
                this.$store.dispatch('updateToastMessages', {
                    message: `updated isShowcase`,
                    type: 'info',
                });
                this.$store.commit('updateIsShowcase', {
                    beatmapId: this.beatmap.id,
                    isShowcase,
                });
            }
        },
    },
});
</script>