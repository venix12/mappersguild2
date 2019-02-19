<template>
<div>
<div class="row">
    <div class="col-md-12">
        <h2>Beatmaps</h2> 
        <table class="small table">
            <thead>
                <th scope="col" style="padding: 2px;">id</th>
                <th scope="col" style="padding: 2px;">artist - title</th>
                <th scope="col" style="padding: 2px;">host</th>
                <th scope="col" style="padding: 2px;">status</th>
                <th scope="col" style="padding: 2px;">edit</th>
            </thead>
            <tbody>
                <tr v-for="beatmap in beatmaps" :key="beatmap.id">
                    <td scope="row" style="padding: 1px;">{{beatmap.id}}</td>
                    <td scope="row" style="padding: 1px;">{{beatmap.song.artist}} - {{beatmap.song.title}}</td>
                    <td scope="row" style="padding: 1px;"><a :href="'https://osu.ppy.sh/users/' + beatmap.host.osuId" target="_blank">{{beatmap.host.username}}</a></td>
                    <td scope="row" style="padding: 1px;">{{beatmap.status}}</td>
                    <td scope="row" style="padding: 1px;" data-toggle="modal" data-target="#editMap" :data-mapid="beatmap.id" @click.prevent="extendedMap(beatmap)"><a href="#">edit</a></td>
                </tr>
            </tbody>
        </table>

        <h2>Quests <button class="btn btn-mg btn-sm temp float-right" data-toggle="modal" data-target="#createQuest">new quest</button></h2> 
        <table class="small table">
            <thead>
                <th scope="col" style="padding: 2px;">id</th>
                <th scope="col" style="padding: 2px;">name</th>
                <th scope="col" style="padding: 2px;">status</th>
                <th scope="col" style="padding: 2px;">edit</th>
            </thead>
            <tbody>
                <tr v-for="quest in quests" :key="quest.id">
                    <td scope="row" style="padding: 1px;">{{quest._id}}</td>
                    <td scope="row" style="padding: 1px;">{{quest.name}}</td>
                    <td scope="row" style="padding: 1px;">{{quest.status}}</td>
                    <td scope="row" style="padding: 1px;" data-toggle="modal" data-target="#editQuest" :data-questid="quest.id" @click.prevent="extendedQuest(quest)"><a href="#">edit</a></td>
                </tr>
            </tbody>
        </table>
        <h2>Parties <button class="btn btn-mg btn-sm temp float-right" @click="updatePartyRanks($event)">refresh party ranks</button></h2>
        <table class="small table">
            <thead>
                <th scope="col" style="padding: 2px;">id</th>
                <th scope="col" style="padding: 2px;">name</th>
                <th scope="col" style="padding: 2px;">leader</th>
                <th scope="col" style="padding: 2px;">edit</th>
            </thead>
            <tbody>
                <tr v-for="party in parties" :key="party.id">
                    <td scope="row" style="padding: 1px;">{{party._id}}</td>
                    <td scope="row" style="padding: 1px;">{{party.name}}</td>
                    <td scope="row" style="padding: 1px;"><a :href="'https://osu.ppy.sh/users/' + party.leader.osuId" target="_blank">{{party.leader.username}}</a></td>
                    <td scope="row" style="padding: 1px;" data-toggle="modal" data-target="#editParty" :data-partyid="party.id" @click.prevent="extendedParty(party)"><a href="#">edit</a></td>
                </tr>
            </tbody>
        </table>
        <h2>Users 
            <button class="btn btn-mg btn-sm temp float-right" @click="updateUserPoints($event);">refresh user points</button>
        </h2>
        <table class="small table">
            <thead>
                <th scope="col" style="padding: 2px;">id</th>
                <th scope="col" style="padding: 2px;">name</th>
                <th scope="col" style="padding: 2px;">group</th>
                <th scope="col" style="padding: 2px;">edit</th>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td scope="row" style="padding: 1px;">{{user._id}}</td>
                    <td scope="row" style="padding: 1px;"><a :href="'https://osu.ppy.sh/users/' + user.osuId" target="_blank">{{user.username}}</a></td>
                    <td scope="row" style="padding: 1px;">{{user.group}}</td>
                    <td scope="row" style="padding: 1px;" data-toggle="modal" data-target="#editUser" :data-userid="user.id" @click.prevent="extendedUser(user)"><a href="#">edit</a></td>
                </tr>
            </tbody>
        </table>
        <h2>Featured Artists <button class="btn btn-mg btn-sm temp float-right" data-toggle="modal" data-target="#newArtist">new artist</button></h2>
        <table class="small table">
            <thead>
                <th scope="col" style="padding: 2px;">id</th>
                <th scope="col" style="padding: 2px;">artist</th>
                <th scope="col" style="padding: 2px;">songs</th>
                <th scope="col" style="padding: 2px;">edit</th>
            </thead>
            <tbody>
                <tr v-for="featuredArtist in featuredArtists" :key="featuredArtist.id">
                    <td scope="row" style="padding: 1px;">{{featuredArtist._id}}</td>
                    <td scope="row" style="padding: 1px;"><a :href="'https://osu.ppy.sh/beatmaps/artists/' + featuredArtist.osuId" target="_blank">{{featuredArtist.label}}</a></td>
                    <td scope="row" style="padding: 1px;">{{featuredArtist.songs.length}}</td>
                    <td scope="row" style="padding: 1px;" data-toggle="modal" data-target="#editSongs" :data-artistid="featuredArtist.id" @click.prevent="extendedArtist(featuredArtist)"><a href="#">edit</a></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div id="editMap" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content custom-bg-dark" v-if="selectedMap">
            <div class="modal-header text-dark" :class="'bg-' + selectedMap.status.toLowerCase()">
                <h5 class="modal-title">{{selectedMap.song.artist}} - {{selectedMap.song.title}} ({{selectedMap.host.username}})</h5>
                <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="container">
                    <div>
                        <div class="input-group input-group-sm mb-3">
                            <div class="input-group-prepend">
                                <button style="border-radius: 100px 0 0 100px;" class="rounded-circle-left btn btn-mg" type="submit" @click="setStatus(selectedMap.id, $event)">save status</button>
                            </div>
                                <select class="custom-select select-arrow small" id="mapStatusSelect" style="filter: drop-shadow(1px 1px 1px #000000); border-radius: 0 100px 100px 0">
                                <option selected value="WIP">WIP</option>
                                <option value="Done">Done</option>
                                <option value="Ranked">Ranked</option>
                            </select>
                        </div>
                    </div>
                    
                    <hr>

                    <div class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                            <button style="border-radius: 100px 0 0 100px;" class="rounded-circle-left btn btn-mg-used" @click="removeDiff(selectedMap.id, $event)">remove diff</button>
                        </div>
                        <select class="custom-select select-arrow small" id="removeDiffSelection" style="filter: drop-shadow(1px 1px 1px #000000); border-radius: 0 100px 100px 0">
                            <option v-for="task in selectedMap.tasks" :value="task.id" :key="task.id">{{task.name}} - <template v-for="(mapper, i) in task.mappers"><a :key="i" :href="'https://osu.ppy.sh/users/' + mapper.osuId" target="_blank">{{ mapper.username + (i < task.mappers.length - 1 ? ', ' : '') }}</a></template></option>
                        </select>
                    </div>

                    <hr>

                    <div class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                            <button style="border-radius: 100px 0 0 100px;" class="rounded-circle-left btn btn-mg-used" @click="removeModder(selectedMap.id, $event)">remove modder</button>
                        </div>
                        <select class="custom-select select-arrow small" id="removeModderSelection" style="filter: drop-shadow(1px 1px 1px #000000); border-radius: 0 100px 100px 0">
                            <option v-for="modder in selectedMap.modders" :value="modder.id" :key="modder.id">{{modder.username}}</option>
                        </select>
                    </div>

                    <hr>

                    <div class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                            <button style="border-radius: 100px 0 0 100px;" class="rounded-circle-left btn btn-mg-used" @click="removeNominator(selectedMap.id, $event)">remove bn</button>
                        </div>
                        <select class="custom-select select-arrow small" id="removeNominatorSelection" style="filter: drop-shadow(1px 1px 1px #000000); border-radius: 0 100px 100px 0">
                            <option v-for="bn in selectedMap.bns" :value="bn.id" :key="bn.id">{{bn.username}}</option>
                        </select>
                    </div>
                    <hr>
                    <div>
                        <a v-if="selectedMap.url" :href="selectedMap.url">{{selectedMap.url}}</a>
                        <div class="input-group input-group-sm mb-3" id="setLink">
                            <div class="input-group-prepend">
                                <button style="border-radius: 100px 0 0 100px;" class="rounded-circle-left btn btn-mg" type="submit" @click="updateMapUrl(selectedMap.id, $event)">save link</button>
                            </div>
                                <input class="form-control form-control-sm" type="text" placeholder="URL" id="newLink" style="border-radius: 0 100px 100px 0"></input>
                        </div>
                    </div>
                    <hr>
                    <div>
                        <button type="button" class="btn btn-mg-used btn-sm" @click="deleteMap(selectedMap.id, $event)">delete</button>
                    </div>
                    
                    <p id="errors"></p>
                </div>
            </div>
        </div>
    </div>
</div>

<!--quest-->

<div id="createQuest" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content custom-bg-dark">
            <div class="modal-header text-dark bg-rest">
                <h5 class="modal-title">Create quest</h5>
                <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="container">
                    <div class="form-group row">
                        <label class="col-sm-4" for="questName"> Quest name:</label><input class="col-sm-8 form-control" type="text" id="questName">
                        <label class="col-sm-4" for="questReward"> Reward:</label><input class="col-sm-8 form-control" type="text" id="questReward">
                        <label class="col-sm-4" for="questDescriptionMain"> Objective:</label><input class="col-sm-8 form-control" type="text" id="questDescriptionMain">
                        <label class="col-sm-4" for="questDescriptionFluff"> Flavor text:</label><input class="col-sm-8 form-control" type="text" id="questDescriptionFluff">
                        <label class="col-sm-4" for="questTimeframe"> Timeframe:</label><input class="col-sm-8 form-control" type="text" id="questTimeframe">
                        <label class="col-sm-4" for="questMinParty"> Min Party:</label><input class="col-sm-8 form-control" type="text" id="questMinParty">
                        <label class="col-sm-4" for="questMaxParty"> Max Party:</label><input class="col-sm-8 form-control" type="text" id="questMaxParty">
                        <label class="col-sm-4" for="questMinRank"> Min Rank:</label><input class="col-sm-8 form-control" type="text" id="questMinRank">
                        <label class="col-sm-4" for="art"> FA id:</label><input class="col-sm-8 form-control" type="text" id="art">
                        <label class="col-sm-4" for="exclusive"> Exclusive?:</label><input class="col-sm-8 form-control" type="text" id="exclusive">
                        <label class="col-sm-4" for="medal"> Medal?:</label><input class="col-sm-8 form-control" type="text" id="medal">
                    </div>
                    <p id="errors"></p>
                </div>
                    
                <div class="modal-footer">
                    <button type="button" class="btn btn-mg" @click="createQuest($event)">Save</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="editQuest" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content custom-bg-dark" v-if="selectedQuest">
            <div class="modal-header text-dark" :class="'bg-' + selectedQuest.status">
                <h5 class="modal-title">{{selectedQuest.name}}</h5>
                <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="container">
                    <div>
                        <button type="button" class="btn btn-mg btn-sm" @click="dropQuest(selectedQuest.id, $event)">force drop</button>
                    </div>
                    <hr>
                    <div>
                        <button type="button" class="btn btn-mg btn-sm" @click="completeQuest(selectedQuest.id, $event)">mark as complete (only wip quests)</button>
                    </div>
                    <hr>
                    <div>
                        <button type="button" class="btn btn-mg btn-sm" @click="hideQuest(selectedQuest.id, $event)">hide (for open quests)</button>
                    </div>
                    <hr>
                    <div>
                        <button type="button" class="btn btn-mg btn-sm" @click="unhideQuest(selectedQuest.id, $event)">unhide (for hidden quests)</button>
                    </div>
                    <hr>
                    <div>
                        <button type="button" class="btn btn-mg-used btn-sm" @click="deleteQuest(selectedQuest.id, $event)">delete (for open quests)</button>
                    </div>
                    <p id="errors"></p>
                </div>
            </div>
        </div>
    </div>
</div>

<!--party-->

<div id="editParty" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content custom-bg-dark" v-if="selectedParty">
            <div class="modal-header text-dark bg-rest">
                <h5 class="modal-title">{{selectedParty.name}}</h5>
                <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="container">
                    <div class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                            <button style="border-radius: 100px 0 0 100px;" class="rounded-circle-left btn btn-mg" type="submit" @click="renameParty(selectedParty.id, $event)">save name</button>
                        </div>
                            <input class="form-control form-control-sm" type="text" placeholder="new name" id="newName" style="border-radius: 0 100px 100px 0"></input>
                    </div>

                    <hr>

                    <div class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                            <button style="border-radius: 100px 0 0 100px;" class="rounded-circle-left btn btn-mg-used" type="submit" @click="removeMember(selectedParty.id, $event)">remove member</button>
                        </div>
                        <select class="custom-select select-arrow small" id="removeMemberSelection" style="filter: drop-shadow(1px 1px 1px #000000); border-radius: 0 100px 100px 0">
                            <option v-for="member in selectedParty.members" :value="member.id" :key="member.id">{{member.username}}</option>
                        </select>
                    </div>

                    <hr>

                    <div class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                            <button style="border-radius: 100px 0 0 100px;" class="rounded-circle-left btn btn-mg" type="submit" @click="transferLeader(selectedParty.id, $event)">transfer leader</button>
                        </div>
                        <select class="custom-select select-arrow small" id="transferLeaderSelection" style="filter: drop-shadow(1px 1px 1px #000000); border-radius: 0 100px 100px 0">
                            <option v-for="member in selectedParty.members" :value="member.id" :key="member.id">{{member.username}}</option>
                        </select>
                    </div>

                    <hr>

                    <div class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                            <button style="border-radius: 100px 0 0 100px;" class="rounded-circle-left btn btn-mg" type="submit" @click="editBanner(selectedParty.id, $event)">edit banner</button>
                        </div>
                        <input class="form-control form-control-sm" type="text" placeholder="map id banner" id="bannerInput" style="border-radius: 0 100px 100px 0"></input>
                    </div>

                    <hr>

                    <div class="input-group input-group-sm mb-3">
                        <button class="rounded-circle-left btn btn-mg-used btn-sm" type="submit" @click="deleteParty(selectedParty.id, $event)">delete party</button>
                    </div>
                    
                    <p id="errors"></p>
                </div>
            </div>
        </div>
    </div>
</div>

<!--user-->

<div id="editUser" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content custom-bg-dark" v-if="selectedUser">
            <div class="modal-header text-dark" :class="'bg-rank-' + selectedUser.rank">
                <h5 class="modal-title">{{selectedUser.username}} ({{selectedUser.group}})</h5>
                <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="container">
                    <div class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                            <button style="border-radius: 100px 0 0 100px;" class="rounded-circle-left btn btn-mg-used" type="submit" @click="updateUserGroup(selectedUser.id, $event)">update usergroup</button>
                        </div>
                        <select class="custom-select select-arrow small" id="userGroupSelect" style="filter: drop-shadow(1px 1px 1px #000000); border-radius: 0 100px 100px 0">
                            <option selected value="user">user</option>
                            <option value="hidden">hidden</option>
                            <option value="admin">admin</option>
                        </select>
                    </div>
                    <div class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                            <button style="border-radius: 100px 0 0 100px;" class="rounded-circle-left btn btn-mg-used" type="submit" @click="updatePenaltyPoints(selectedUser.id, $event)">edit penaltypoints</button>
                        </div>
                        <input class="form-control form-control-sm" type="text" placeholder="penalty points" id="penaltyPointsInput" style="border-radius: 0 100px 100px 0"></input>
                    </div>
                    <p id="errors"></p>
                </div>
            </div>
        </div>
    </div>
</div>

<!--artist-->

<div id="newArtist" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content custom-bg-dark">
            <div class="modal-header text-dark bg-rest">
                <h5 class="modal-title">New Artist</h5>
                <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="container">
                    <div class="input-group input-group-sm mb-3">
                        <input class="form-control" id="newArtistInput" placeholder="new artist (as written on FA listing)...">
                    </div>
                    <div class="input-group input-group-sm mb-3">
                        <input class="form-control" id="artistId" placeholder="artist's osu id (leave blank if none)">
                    </div>
                    <p id="errors"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-mg" @click="addArtist($event)">Save</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="editSongs" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content custom-bg-dark" v-if="selectedArtist">
            <div class="modal-header text-dark bg-rest">
                <h5 class="modal-title">{{selectedArtist.label}} ({{selectedArtist.songs.length}})</h5>
                <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="container">
                    <div>
                    <div class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                            <button style="border-radius: 100px 0 0 100px;" class="rounded-circle-left btn btn-mg" type="submit" @click="renameLabel(selectedArtist.id, $event)">rename</button>
                        </div>
                            <input class="form-control form-control-sm" type="text" placeholder="new name" id="newLabelName" style="border-radius: 0 100px 100px 0"></input>
                    </div>
                    </div>
                    <hr>
                    <div>
                        <div class="form-group row">
                        <label class="col-sm-3 text-shadow" for="artist"> Artist:</label><input class="col-sm-9 form-control" style="border-radius: 100px 100px 100px 100px" type="text" id="artist">
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-3 text-shadow" for="title"> Title:</label><input class="col-sm-9 form-control" style="border-radius: 100px 100px 100px 100px" type="text" id="title">
                        </div>
                        <button type="button" class="btn btn-mg btn-sm" @click="addSong(selectedArtist.id, $event)">add song</button>
                    </div>
                    <hr>
                    <div>
                        <p class="text-shadow">remove song:</p>
                        <div class="input-group input-group-sm mb-3" id="removeSongForm">
                            <div class="input-group-prepend">
                                <button style="border-radius: 100px 0 0 100px;" class="rounded-circle-left btn btn-mg-used"  @click="removeSong(selectedArtist.id, $event)">delete song</button>
                            </div>
                            <select class="custom-select select-arrow small" id="removeSongSelection" style="filter: drop-shadow(1px 1px 1px #000000); border-radius: 0 100px 100px 0">
                                <option v-for="song in selectedArtist.songs" :value="song.id" :key="song.id">{{song.artist}} - {{song.title}}</option>
                            </select>
                        </div>
                    </div>
                    <hr>
                    <div>
                        <div class="mb-4">
                            <select class="custom-select select-arrow small" id="editSongSelection" style="filter: drop-shadow(1px 1px 1px #000000); border-radius: 100px 100px 100px 100px; width: 100%">
                                <option v-for="song in selectedArtist.songs" :value="song.id" :key="song.id">{{song.artist}} - {{song.title}}</option>
                            </select>
                        </div>
                        
                        <div class="form-group row">
                        <label class="col-sm-3 text-shadow" for="editedArtist">edit artist:</label><input class="col-sm-9 form-control" style="border-radius: 100px 100px 100px 100px" type="text" id="editedArtist">
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-3 text-shadow" for="editedTitle">edit title:</label><input class="col-sm-9 form-control" style="border-radius: 100px 100px 100px 100px" type="text" id="editedTitle">
                        </div>
                        <button type="button" class="btn btn-mg btn-sm" @click="updateMetadata(selectedArtist.id, $event)">edit metadata</button>
                    </div>
                    <p id="errors">{{info}}</p>
                </div>
            </div>
        </div>
    </div>
</div>

</div>

</template>

<script>

export default {
    name: 'admin-page',
    components: {

    },
    methods: {
        extendedMap: function (map) {
            this.selectedMap = map;
        },
        extendedQuest: function (quest) {
            this.selectedQuest = quest;
        },
        extendedParty: function (party) {
            this.selectedParty = party;
        },
        extendedUser: function (user) {
            this.selectedUser = user;
        },
        extendedArtist: function (artist) {
            this.selectedArtist = artist;
        },
        updateMap: function(bm) {
			const i = this.beatmaps.findIndex(b => b.id == bm.id);
			this.beatmaps[i] = bm;
            this.selectedMap = bm;
        },
        updateQuest: function(q) {
			const i = this.quests.findIndex(quest => quest.id == q.id);
			this.quests[i] = q;
            this.selectedQuest = q;
        },
        updateParty: function(p) {
			const i = this.parties.findIndex(party => party.id == p.id);
			this.parties[i] = p;
            this.selectedParty = p;
        },
        updateUser: function(u) {
			const i = this.users.findIndex(user => user.id == u.id);
			this.users[i] = u;
            this.selectedUser = u;
        },
        updateArtist: function(fa) {
			const i = this.featuredArtists.findIndex(a => a.id == fa.id);
			this.featuredArtists[i] = fa;
            this.selectedArtist = fa;
            this.info = null;
		},
        executePost: async function (path, data, e) {
            if (e) e.target.disabled = true;

            try {
                const res = await axios.post(path, data)
                console.log(res);

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

        //beatmaps
        setStatus: async function(id, e){
            const status = $('#mapStatusSelect').val();
            const bm = await this.executePost('/admin/updateMapStatus/' + id, {status: status}, e);
            if(bm){
                this.updateMap(bm);
            }
        },
        removeDiff: async function(id, e){
            const taskId = $("#removeDiffSelection").val();
            const bm = await this.executePost('/admin/removeDiff/' + id, {taskId: taskId}, e);
            if(bm){
                this.updateMap(bm);
            }
        },
        removeModder: async function(id, e){
            var userId = $("#removeModderSelection").val();
            const bm = await this.executePost('/admin/removeModder/' + id, {userId: userId}, e);
            if(bm){
                this.updateMap(bm);
            }
        },
        removeNominator: async function(id, e){
            var userId = $("#removeNominatorSelection").val();
            const bm = await this.executePost('/admin/removeNominator/' + id, {userId: userId}, e);
            if(bm){
                this.updateMap(bm);
            }
        },
        updateMapUrl: async function(id, e){
            var link = $("#newLink").val()
            const bm = await this.executePost('/admin/updateMapUrl/' + id, {link: link}, e);
            if(bm){
                this.updateMap(bm);
            }
        },
        deleteMap: async function(id, e){
            const bm = await this.executePost('/admin/deleteMap/' + id, {}, e);
            if(bm){
                $('#editMap').modal('hide');
                axios
                    .get('/admin/relevantInfo')
                    .then(response => {
                        this.beatmaps = response.data.b;
                        this.quests = response.data.q;
                        this.parties = response.data.p;
                        this.users = response.data.u;
                        this.featuredArtists = response.data.fa;
                    });   
            }
        },

        //quest
        dropQuest: async function(id, e){
            const q = await this.executePost('/admin/forceDropQuest/' + id, {}, e);
            if(q){
                this.updateQuest(q);
            }
        },
        completeQuest: async function(id, e){
            const q = await this.executePost('/admin/completeQuest/' + id, {}, e);
            if(q){
                this.updateQuest(q);
            }
        },
        hideQuest: async function(id, e){
            const q = await this.executePost('/admin/hideQuest/' + id, {}, e);
            if(q){
                this.updateQuest(q);
            }
        },
        unhideQuest: async function(id, e){
            const q = await this.executePost('/admin/unhideQuest/' + id, {}, e);
            if(q){
                this.updateQuest(q);
            }
        },
        deleteQuest: async function(id, e){
            const q = await this.executePost('/admin/deleteQuest/' + id, {}, e);
            if(q){
                $('#editQuest').modal('hide');
                axios
                    .get('/admin/relevantInfo')
                    .then(response => {
                        this.beatmaps = response.data.b;
                        this.quests = response.data.q;
                        this.parties = response.data.p;
                        this.users = response.data.u;
                        this.featuredArtists = response.data.fa;
                    });   
            }
        },
        createQuest: async function(e){
            let name = $("#questName").val();
            let reward = $("#questReward").val();
            let descriptionMain = $("#questDescriptionMain").val();
            let descriptionFluff = $("#questDescriptionFluff").val();
            let timeframe = $("#questTimeframe").val();
            let minParty = $("#questMinParty").val();
            let maxParty = $("#questMaxParty").val();
            let minRank = $("#questMinRank").val();
            let art = $("#art").val();
            let exclusive = $("#exclusive").val();
            let medal = $("#medal").val();
            const q = await this.executePost('/admin/createQuest/', { 
                name: name, 
                reward: reward, 
                descriptionMain: descriptionMain, 
                descriptionFluff: descriptionFluff, 
                timeframe: timeframe, 
                minParty: minParty, 
                maxParty: maxParty, 
                minRank: minRank, 
                art: art, 
                exclusive: exclusive, 
                medal: medal 
            }, e);
            if(q){
                $('#createQuest').modal('hide');
                axios
                    .get('/admin/relevantInfo')
                    .then(response => {
                        this.beatmaps = response.data.b;
                        this.quests = response.data.q;
                        this.parties = response.data.p;
                        this.users = response.data.u;
                        this.featuredArtists = response.data.fa;
                    });   
            }
        },

        //party

        renameParty: async function(id, e){
            var name = $("#newName").val()
            const p = await this.executePost('/admin/renameParty/' + id, {name: name}, e);
            if(p){
                this.updateParty(p);
            }
        },
        removeMember: async function(id, e){
            var userId = $("#removeMemberSelection").val();
            const p = await this.executePost('/admin/removeMember/' + id, {userId: userId}, e);
            if(p){
                this.updateParty(p);
            }
        },
        transferLeader: async function(id, e){
            var userId = $("#transferLeaderSelection").val();
            const p = await this.executePost('/admin/transferLeader/' + id, {userId: userId}, e);
            if(p){
                this.updateParty(p);
            }
        },
        editBanner: async function(id, e){
            var banner = $("#bannerInput").val();
            const p = await this.executePost('/admin/editBanner/' + id, {banner: banner}, e);
            if(p){
                this.updateParty(p);
            }
        },
        deleteParty: async function(id, e){
            const p = await this.executePost('/admin/deleteParty/' + id, {}, e);
            if(p){
                $('#editParty').modal('hide');
                axios
                    .get('/admin/relevantInfo')
                    .then(response => {
                        this.beatmaps = response.data.b;
                        this.quests = response.data.q;
                        this.parties = response.data.p;
                        this.users = response.data.u;
                        this.featuredArtists = response.data.fa;
                    });   
            }
        },
        updatePartyRanks: async function(e){
            const success = await this.executePost('/admin/updatePartyRanks/', {}, e);
            if(success){
                console.log('update party ranks worked');
            }
        },

        //users

        updateUserGroup: async function(id, e){
            var group = $("#userGroupSelect").val();
            const u = await this.executePost('/admin/updateUserGroup/' + id, {group: group}, e);
            if(u){
                this.updateUser(u);
            }
        },
        updatePenaltyPoints: async function(id, e){
            var points = $("#penaltyPointsInput").val();
            const u = await this.executePost('/admin/updatePenaltyPoints/' + id, {points: points}, e);
            if(u){
                this.updateUser(u);
            }
        },
        updateUserPoints: async function(e){
            const success = await this.executePost('/admin/updateUserPoints/', {}, e);
            if(success){
                console.log('update user points worked');
            }
        },

        //featured artist

        addArtist: async function(e){
            let label = $("#newArtistInput").val();
            let osuId = $("#artistId").val();
            const fa = await this.executePost('/admin/addArtist/' + label, {osuId: osuId}, e);
            if(fa){
                $('#newArtist').modal('hide');
                axios
                    .get('/admin/relevantInfo')
                    .then(response => {
                        this.beatmaps = response.data.b;
                        this.quests = response.data.q;
                        this.parties = response.data.p;
                        this.users = response.data.u;
                        this.featuredArtists = response.data.fa;
                    });   
            }

        },

        renameLabel: async function(id, e){
            let name = $("#newLabelName").val();
            const fa = await this.executePost('/admin/renameLabel/' + id, {name: name}, e);
            if(fa){
                this.updateArtist(fa);
            }
        },
        addSong: async function(id, e){
            let artist = $("#artist").val();
            let title = $("#title").val();
            const fa = await this.executePost('/admin/addSong/' + id, {artist: artist, title: title}, e);
            if(fa){
                this.updateArtist(fa);
                this.info = `song added`
            }
        },
        removeSong: async function(id, e){
            let songId = $("#removeSongSelection").val();
            const fa = await this.executePost('/admin/removeSong/' + id, {songId: songId}, e);
            if(fa){
                this.updateArtist(fa);
                this.info = `song removed`
            }
        },
        updateMetadata: async function(id, e){
            let artist = $("#editedArtist").val();
            let title = $("#editedTitle").val();
            let songId = $("#editSongSelection").val();
            const fa = await this.executePost('/admin/updateMetadata/' + id, {artist: artist, title: title, songId: songId}, e);
            if(fa){
                this.updateArtist(fa);
                this.info = `edited metadata`
            }
        }
    },
    data() {
        return {
            beatmaps: null,
            quests: null,
            parties: null,
            users: null,
            featuredArtists: null,
            selectedMap: null,
            selectedQuest: null,
            selectedParty: null,
            selectedUser: null,
            selectedArtist: null,
            info: null
        }
    },
    mounted() {
        axios
            .get('/admin/relevantInfo')
            .then(response => {
                this.beatmaps = response.data.b;
                this.quests = response.data.q;
                this.parties = response.data.p;
                this.users = response.data.u;
                this.featuredArtists = response.data.fa;
            }).then(function(){
                $("#loading").fadeOut();
				$("#app").attr("style", "visibility: visible").hide().fadeIn();
			});
    }
}
</script>

<style>

</style>