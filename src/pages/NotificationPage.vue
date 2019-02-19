<template>

<div class="row">
    <div class="col-md-6">
        <h2>Notifications <button class="btn btn-mg btn-sm" @click.prevent="hideAll($event)">Mark all as read</button></h2> 
        <transition-group name="list" tag="div" class="row">
            <notification-card
                v-for="notification in notifications"
                :notification="notification"
                :key="notification.id"
                @hide-notification="hideNotification($event)"
            ></notification-card>
        </transition-group>
        <p v-if="!notifications || notifications.length == 0" class="ml-4">No notifications...</p>
    </div>

    <div class="col-md-6">
        <h2>Invites <button class="btn btn-mg-used btn-sm" @click.prevent="declineAll($event)">Decline all</button></h2> 
        <transition-group name="list" tag="div" class="row">
            <invite-card
                v-for="invite in invites"
                :invite="invite"
                :key="invite.id"
                @update:info="info = $event"
                @hide-invite="hideInvite($event)"
            ></invite-card>
        </transition-group>
        <p v-if="!invites || invites.length == 0" class="ml-4">No invites...</p>
    </div>
</div>

</template>

<script>
import NotificationCard from '../components/notifications/NotificationCard.vue';
import InviteCard from '../components/notifications/InviteCard.vue';

export default {
    name: 'notification-page',
    components: {
        NotificationCard,
        InviteCard
    },
    methods: {
        executePost: async function (path, data, e) {
            if (e) e.target.disabled = true;

            try {
                const res = await axios.post(path, data)
                
                if (res.data.error) {
                    this.info = res.data.error;
                } else {
                    if (e) e.target.disabled = false;
                    return res.data;
                }
            } catch (error) {
                console.log(error)
            }

            if (e) e.target.disabled = false;
        },
        //mark as read
        hideNotification: async function(args){
            let id = args.id;
            let e = args.e;
            const i = this.notifications.findIndex(notif => notif.id === id);
            this.notifications.splice(i, 1);
            await this.executePost('/notifications/hideNotification/' + id, {}, e);
        },
        //mark all as read
        hideAll: async function(e){
            this.notifications = null;
            await this.executePost('/notifications/hideAll/', {}, e);
        },
        //accept various invites
        acceptInvite: async function(id, actionType, e){
            this.info = null;
            let invite;
            if(actionType == "collab"){
                invite = await this.executePost('/notifications/acceptCollab/' + id, {}, e);
            }else if(actionType == "task"){
                invite = await this.executePost('/notifications/acceptDiff/' + id, {}, e);
            }else if(actionType == "host"){
                invite = await this.executePost('/notifications/acceptHost/' + id, {}, e);
            }else if(actionType == "join"){
                invite = await this.executePost('/notifications/acceptJoin/' + id, {}, e);
            }

            if(invite){
                const i = this.invites.findIndex(inv => inv.id === invite.id);
                this.invites.splice(i, 1);
            }
        },
        //decline invite
        hideInvite: async function(args){
            let id = args.id;
            console.log(args);
            let e = args.e;
            const i = this.invites.findIndex(inv => inv.id === id);
            this.invites.splice(i, 1);
            await this.executePost('/notifications/hideInvite/' + id, {}, e);
        },
        //decline all invites
        declineAll: async function(e){
            this.invites = null;
            await this.executePost('/notifications/declineAll/', {}, e);
        },
    },
    data() {
        return {
            notifications: null,
            invites: null,
            info: ''
        }
    },
    created() {
        axios
            .get('/notifications/relevantInfo')
            .then(response => {
                this.notifications = response.data.notifications;
                this.invites = response.data.invites;
            }).then(function(){
                $("#loading").fadeOut();
                $("#app").attr("style", "visibility: visible").hide().fadeIn();
            });
    },
    mounted () {
        setInterval(() => {
            axios
                .get('/notifications/relevantInfo')
                .then(response => {
                    this.notifications = response.data.notifications;
                    this.invites = response.data.invites;
                });
        }, 30000);
    }
}
</script>