<template>
    <div>
        <p class="row">
            <input
                v-model.number="screenerInput"
                class="form-control form-control-sm w-50"
                autocomplete="off"
                placeholder="new screener username/osuId..."
                @keyup.enter="addScreener($event)"
            >
        </p>

        <ul v-if="screeners.length">
            <li
                v-for="screener in screeners"
                :key="screener.id"
            >
                <user-link :user="screener" />

                <a
                    v-if="confirmDelete != screener.id"
                    href="#"
                    class="text-danger"
                    @click.prevent="confirmDelete = screener.id"
                >
                    delete
                </a>
                <a
                    v-else
                    class="text-danger"
                    href="#"
                    @click.prevent="removeScreener(screener.id, $event)"
                >
                    confirm
                </a>
            </li>
        </ul>

        <div v-else class="text-white-50 m-4">
            None...
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { User } from '@interfaces/user';

export default defineComponent({
    name: 'ScreenersInfo',
    props: {
        contestId: {
            type: String,
            required: true,
        },
        screeners: {
            type: Array as PropType<User[]>,
            required: true,
        },
    },
    data () {
        return {
            screenerInput: null,
            confirmDelete: null,
        };
    },
    methods: {
        async addScreener(e): Promise<void> {
            const screener = await this.$http.executePost(`/admin/contests/${this.contestId}/screeners/add`, { screenerInput: this.screenerInput }, e);

            if (!this.$http.isError(screener)) {
                this.$store.dispatch('updateToastMessages', {
                    message: `added ${this.screenerInput} (${this.screeners.length + 1})`,
                    type: 'info',
                });
                this.$store.commit('addScreener', {
                    contestId: this.contestId,
                    screener,
                });
            }
        },
        async removeScreener(screenerId, e): Promise<void> {
            const res = await this.$http.executePost(`/admin/contests/${this.contestId}/screeners/remove`, { screenerId }, e);

            if (!this.$http.isError(res)) {
                this.$store.dispatch('updateToastMessages', {
                    message: `deleted`,
                    type: 'info',
                });
                this.$store.commit('deleteScreener', {
                    contestId: this.contestId,
                    screenerId,
                });
            }
        },
    },
});
</script>