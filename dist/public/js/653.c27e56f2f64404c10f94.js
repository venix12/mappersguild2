(self.webpackChunkmappersguild=self.webpackChunkmappersguild||[]).push([[653],{4653:(t,e,s)=>{"use strict";s.d(e,{Z:()=>v});var i=s(5393);const o={class:"container"},a={class:"row"},r={class:"row"},n={class:"row"},u={class:"row"},d={class:"row"},c={class:"row"},p={class:"row"},l={class:"col-sm-6"},m=(0,i.createTextVNode)("Scheduled for completion: "),h={class:"text-danger"},q={class:"row"},f={class:"row"};var x=s(1516),y=s(5607),$=s(8834),b=function(t,e,s,i){return new(s||(s=Promise))((function(o,a){function r(t){try{u(i.next(t))}catch(t){a(t)}}function n(t){try{u(i.throw(t))}catch(t){a(t)}}function u(t){var e;t.done?o(t.value):(e=t.value,e instanceof s?e:new s((function(t){t(e)}))).then(r,n)}u((i=i.apply(t,e||[])).next())}))};const g=(0,i.defineComponent)({name:"QuestInfo",components:{AssociatedBeatmaps:y.Z,ModalDialog:x.Z,ModesIcons:$.Z},props:{quest:{type:Object,required:!0}},data(){return{renameQuestName:this.quest.name,price:this.quest.price,requiredMapsets:this.quest.requiredMapsets,minParty:this.quest.minParty,maxParty:this.quest.maxParty,description:this.quest.descriptionMain,duplicateQuestName:this.quest.name,expiration:this.quest.expiration?this.quest.expiration.toString():""}},watch:{quest(){this.renameQuestName=this.quest.name,this.price=this.quest.price,this.requiredMapsets=this.quest.requiredMapsets,this.minParty=this.quest.minParty,this.maxParty=this.quest.maxParty,this.description=this.quest.descriptionMain,this.duplicateQuestName=this.quest.name,this.expiration=this.quest.expiration?this.quest.expiration.toString():""}},methods:{renameQuest(t){return b(this,void 0,void 0,(function*(){const e=yield this.$http.executePost(`/admin/quests/${this.quest.id}/rename`,{name:this.renameQuestName},t);this.$http.isError(e)||(this.$store.dispatch("updateToastMessages",{message:"renamed quest",type:"info"}),this.$store.commit("renameQuest",{questId:this.quest.id,name:e}))}))},updatePrice(t){return b(this,void 0,void 0,(function*(){const e=yield this.$http.executePost(`/admin/quests/${this.quest.id}/updatePrice`,{price:this.price},t);this.$http.isError(e)||(this.$store.dispatch("updateToastMessages",{message:"updated price",type:"info"}),this.$store.commit("updatePrice",{questId:this.quest.id,price:e}))}))},updateRequiredMapsets(t){return b(this,void 0,void 0,(function*(){const e=yield this.$http.executePost(`/admin/quests/${this.quest.id}/updateRequiredMapsets`,{requiredMapsets:this.requiredMapsets},t);this.$http.isError(e)||(this.$store.dispatch("updateToastMessages",{message:"updated required mapsets",type:"info"}),this.$store.commit("updateRequiredMapsets",{questId:this.quest.id,requiredMapsets:e}))}))},updateDescription(t){return b(this,void 0,void 0,(function*(){const e=yield this.$http.executePost(`/admin/quests/${this.quest.id}/updateDescription/`,{description:this.description},t);this.$http.isError(e)||(this.$store.dispatch("updateToastMessages",{message:"updated quest description",type:"info"}),this.$store.commit("updateDescription",{questId:this.quest.id,description:e}))}))},dropQuest(t){return b(this,void 0,void 0,(function*(){const e=yield this.$http.executePost(`/admin/quests/${this.quest.id}/drop`,{},t);this.$http.isError(e)||(this.$store.dispatch("updateToastMessages",{message:"quest force dropped",type:"info"}),this.$store.commit("updateStatus",{questId:this.quest.id,status:e}))}))},scheduleQuestForCompletion(t){return b(this,void 0,void 0,(function*(){const e=yield this.$http.executePost(`/admin/quests/${this.quest.id}/scheduleForCompletion`,{queuedForCompletion:!this.quest.queuedForCompletion},t);this.$http.isError(e)||(this.$store.dispatch("updateToastMessages",{message:`quest queued for completion toggled: ${e}`,type:"info"}),this.$store.commit("updateQueuedForCompletion",{questId:this.quest.id,queuedForCompletion:e}))}))},duplicateQuest(t){return b(this,void 0,void 0,(function*(){const e=yield this.$http.executePost(`/admin/quests/${this.quest.id}/duplicate`,{name:this.duplicateQuestName},t);this.$http.isError(e)||(this.$store.dispatch("updateToastMessages",{message:"quest duplicated",type:"info"}),this.$store.commit("addQuest",{quest:e}))}))},resetQuestDeadline(t){return b(this,void 0,void 0,(function*(){const e=yield this.$http.executePost(`/admin/quests/${this.quest.id}/reset`,{},t);this.$http.isError(e)||(this.$store.dispatch("updateToastMessages",{message:`reset quest deadline to ${e}`,type:"info"}),this.$store.commit("resetQuestDeadline",{questId:this.quest.id,deadline:e}))}))},deleteQuest(t){return b(this,void 0,void 0,(function*(){if(confirm("Are you sure?")){const e=yield this.$http.executePost(`/admin/quests/${this.quest.id}/delete`,{},t);this.$http.isError(e)||(this.$bs.hideModal("editQuest"),this.$store.dispatch("updateToastMessages",{message:"quest deleted",type:"info"}),this.$store.commit("deleteQuest",{questId:this.quest.id}))}}))},toggleQuestMode(t){return b(this,void 0,void 0,(function*(){const e=yield this.$http.executePost(`/admin/quests/${this.quest.id}/toggleMode`,{mode:t});this.$http.isError(e)||(this.$store.dispatch("updateToastMessages",{message:"changed quest modes",type:"info"}),this.$store.commit("quests/updateQuest",e))}))},updateExpiration(t){return b(this,void 0,void 0,(function*(){const e=yield this.$http.executePost(`/admin/quests/${this.quest.id}/updateExpiration/`,{expiration:this.expiration},t);this.$http.isError(e)||(this.$store.dispatch("updateToastMessages",{message:"updated quest expiration",type:"info"}),this.$store.commit("updateExpiration",{questId:this.quest.id,expiration:e}))}))},updateMinParty(t){return b(this,void 0,void 0,(function*(){const e=yield this.$http.executePost(`/admin/quests/${this.quest.id}/updateMinParty/`,{minParty:this.minParty},t);this.$http.isError(e)||(this.$store.dispatch("updateToastMessages",{message:"updated minParty",type:"info"}),this.$store.commit("updateMinParty",{questId:this.quest.id,minParty:e}))}))},updateMaxParty(t){return b(this,void 0,void 0,(function*(){const e=yield this.$http.executePost(`/admin/quests/${this.quest.id}/updateMaxParty/`,{maxParty:this.maxParty},t);this.$http.isError(e)||(this.$store.dispatch("updateToastMessages",{message:"updated maxParty",type:"info"}),this.$store.commit("updateMaxParty",{questId:this.quest.id,maxParty:e}))}))}}});g.render=function(t,e,s,x,y,$){const b=(0,i.resolveComponent)("user-link"),g=(0,i.resolveComponent)("modes-icons"),v=(0,i.resolveComponent)("associated-beatmaps"),N=(0,i.resolveComponent)("modal-dialog");return(0,i.openBlock)(),(0,i.createBlock)(N,{id:"editQuest"},{header:(0,i.withCtx)((()=>[(0,i.createTextVNode)((0,i.toDisplayString)(t.quest.name)+" by ",1),t.quest.creator?((0,i.openBlock)(),(0,i.createBlock)(b,{key:0,class:"text-dark",user:t.quest.creator},null,8,["user"])):(0,i.createCommentVNode)("",!0)])),default:(0,i.withCtx)((()=>[(0,i.createVNode)("div",o,[(0,i.createVNode)("p",a,[(0,i.withDirectives)((0,i.createVNode)("input",{"onUpdate:modelValue":e[1]||(e[1]=e=>t.renameQuestName=e),class:"form-control form-control-sm mx-2 w-50",type:"text",autocomplete:"off",placeholder:"quest name..."},null,512),[[i.vModelText,t.renameQuestName]]),(0,i.createVNode)("button",{class:"btn btn-sm btn-outline-info w-25",onClick:e[2]||(e[2]=e=>t.renameQuest(e))}," Rename quest ")]),(0,i.createVNode)("p",r,[(0,i.withDirectives)((0,i.createVNode)("input",{"onUpdate:modelValue":e[3]||(e[3]=e=>t.price=e),class:"form-control form-control-sm mx-2 w-50",type:"text",autocomplete:"off",placeholder:"price..."},null,512),[[i.vModelText,t.price]]),(0,i.createVNode)("button",{class:"btn btn-sm btn-outline-info w-25",onClick:e[4]||(e[4]=e=>t.updatePrice(e))}," Update price ")]),(0,i.createVNode)("p",n,[(0,i.withDirectives)((0,i.createVNode)("input",{"onUpdate:modelValue":e[5]||(e[5]=e=>t.requiredMapsets=e),class:"form-control form-control-sm mx-2 w-50",type:"text",autocomplete:"off",placeholder:"required mapsets..."},null,512),[[i.vModelText,t.requiredMapsets]]),(0,i.createVNode)("button",{class:"btn btn-sm btn-outline-info w-25",onClick:e[6]||(e[6]=e=>t.updateRequiredMapsets(e))}," Update required mapsets ")]),(0,i.createVNode)("p",u,[(0,i.withDirectives)((0,i.createVNode)("input",{"onUpdate:modelValue":e[7]||(e[7]=e=>t.minParty=e),class:"form-control form-control-sm mx-2 w-50",type:"text",autocomplete:"off",placeholder:"minParty..."},null,512),[[i.vModelText,t.minParty]]),(0,i.createVNode)("button",{class:"btn btn-sm btn-outline-info w-25",onClick:e[8]||(e[8]=e=>t.updateMinParty(e))}," Update minParty ")]),(0,i.createVNode)("p",d,[(0,i.withDirectives)((0,i.createVNode)("input",{"onUpdate:modelValue":e[9]||(e[9]=e=>t.maxParty=e),class:"form-control form-control-sm mx-2 w-50",type:"text",autocomplete:"off",placeholder:"maxParty..."},null,512),[[i.vModelText,t.maxParty]]),(0,i.createVNode)("button",{class:"btn btn-sm btn-outline-info w-25",onClick:e[10]||(e[10]=e=>t.updateMaxParty(e))}," Update maxParty ")]),(0,i.createVNode)("p",c,[(0,i.withDirectives)((0,i.createVNode)("textarea",{"onUpdate:modelValue":e[11]||(e[11]=e=>t.description=e),class:"form-control form-control-sm mx-2 mt-2 w-50",type:"text",autocomplete:"off",placeholder:"quest description..."},null,512),[[i.vModelText,t.description]]),(0,i.createVNode)("button",{class:"btn btn-sm btn-outline-info w-25",onClick:e[12]||(e[12]=e=>t.updateDescription(e))}," Update description ")]),"wip"==t.quest.status?((0,i.openBlock)(),(0,i.createBlock)(i.Fragment,{key:0},[(0,i.createVNode)("p",null,[(0,i.createVNode)("button",{class:"btn btn-sm btn-outline-danger w-100",onClick:e[13]||(e[13]=e=>t.dropQuest(e))}," Drop quest ")]),(0,i.createVNode)("p",null,[(0,i.createVNode)("button",{class:"btn btn-sm btn-outline-info w-100",onClick:e[14]||(e[14]=e=>t.resetQuestDeadline(e))}," Reset quest deadline ")]),(0,i.createVNode)("p",p,[(0,i.createVNode)("span",l,[m,(0,i.createVNode)("span",h,(0,i.toDisplayString)(t.quest.queuedForCompletion?"true":"false"),1)]),(0,i.createVNode)("button",{class:"btn btn-sm btn-outline-success col-sm-6 ms-3 w-25",onClick:e[15]||(e[15]=e=>t.scheduleQuestForCompletion(e))}," Toggle ")])],64)):(0,i.createCommentVNode)("",!0),(0,i.createVNode)("p",q,[(0,i.withDirectives)((0,i.createVNode)("input",{"onUpdate:modelValue":e[16]||(e[16]=e=>t.duplicateQuestName=e),class:"form-control form-control-sm mx-2 w-50",type:"text",autocomplete:"off",placeholder:"new quest name..."},null,512),[[i.vModelText,t.duplicateQuestName]]),(0,i.createVNode)("button",{class:"btn btn-sm btn-outline-info w-25",onClick:e[17]||(e[17]=e=>t.duplicateQuest(e))}," Duplicate quest ")]),(0,i.createVNode)("p",f,[(0,i.withDirectives)((0,i.createVNode)("input",{"onUpdate:modelValue":e[18]||(e[18]=e=>t.expiration=e),class:"form-control form-control-sm mx-2 w-50",type:"text",autocomplete:"off",placeholder:t.quest.expiration},null,8,["placeholder"]),[[i.vModelText,t.expiration]]),(0,i.createVNode)("button",{class:"btn btn-sm btn-outline-info w-25",onClick:e[19]||(e[19]=e=>t.updateExpiration(e))}," Set expiration date ")]),(0,i.createVNode)("p",null,[(0,i.createVNode)(g,{modes:t.quest.modes,toggler:!0,onToggle:e[20]||(e[20]=e=>t.toggleQuestMode(e))},null,8,["modes"])]),"done"==t.quest.status||"wip"==t.quest.status?((0,i.openBlock)(),(0,i.createBlock)(v,{key:1,class:"mb-4","associated-maps":t.quest.associatedMaps},null,8,["associated-maps"])):(0,i.createCommentVNode)("",!0),(0,i.createVNode)("p",null,[(0,i.createVNode)("button",{class:"btn btn-sm btn-outline-danger w-100",onClick:e[21]||(e[21]=e=>t.deleteQuest(e))}," Delete quest ")])])])),_:1})};const v=g}}]);