(self.webpackChunkmappersguild=self.webpackChunkmappersguild||[]).push([[345],{9352:(e,t,s)=>{"use strict";s.d(t,{Z:()=>r});var d=s(5393);const a={key:0,class:"table table-sm"},n=(0,d.createVNode)("th",null,"EDIT",-1),o={key:1,class:"text-white-50"},i=(0,d.defineComponent)({name:"DataTable",props:{data:{type:Array,required:!0},headers:{type:Array,required:!0},isLoading:Boolean,customDataTarget:{type:String,default:null}},emits:["update:selectedId"]});i.render=function(e,t,s,i,r,u){return(0,d.openBlock)(),(0,d.createBlock)("div",null,[e.data.length?((0,d.openBlock)(),(0,d.createBlock)("table",a,[(0,d.createVNode)("thead",null,[(0,d.createVNode)("tr",null,[((0,d.openBlock)(!0),(0,d.createBlock)(d.Fragment,null,(0,d.renderList)(e.headers,(e=>((0,d.openBlock)(),(0,d.createBlock)("th",{key:e},(0,d.toDisplayString)(e),1)))),128)),n])]),(0,d.createVNode)("tbody",null,[((0,d.openBlock)(!0),(0,d.createBlock)(d.Fragment,null,(0,d.renderList)(e.data,(t=>((0,d.openBlock)(),(0,d.createBlock)("tr",{key:t.id,class:"text-white-50"},[(0,d.renderSlot)(e.$slots,"default",{obj:t}),(0,d.createVNode)("td",null,[(0,d.createVNode)("a",{href:"#","data-bs-toggle":"modal","data-bs-target":e.customDataTarget||"#edit",onClick:(0,d.withModifiers)((s=>e.$emit("update:selectedId",t.id)),["prevent"])}," edit ",8,["data-bs-target","onClick"])])])))),128))])])):e.isLoading?(0,d.createCommentVNode)("",!0):((0,d.openBlock)(),(0,d.createBlock)("span",o,"None..."))])};const r=i},6576:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>f});var d=s(5393);const a={class:"container card card-body py-1"},n={class:"row"},o={class:"col"},i=(0,d.createVNode)("button",{class:"btn btn-sm btn-info w-100 mb-1","data-bs-toggle":"modal","data-bs-target":"#submitQuest"}," Add quest ",-1);var r=s(6564),u=s(3837),c=s(6958),l=s(9352);const p={state:{quests:[]},mutations:{setQuests(e,t){e.quests=t},updateQuest(e,t){const s=e.quests.findIndex((e=>e.id===t.id));-1!==s&&(e.quests[s]=t)},addQuest(e,t){e.quests.push(t)},deleteQuest(e,t){const s=e.quests.findIndex((e=>e.id===t.id));e.quests.splice(s,1)},renameQuest(e,t){const s=e.quests.find((e=>e.id==t.questId));s&&(s.name=t.name)},updatePrice(e,t){const s=e.quests.find((e=>e.id==t.questId));s&&(s.price=t.price)},updateRequiredMapsets(e,t){const s=e.quests.find((e=>e.id==t.questId));s&&(s.requiredMapsets=t.requiredMapsets)},updateDescription(e,t){const s=e.quests.find((e=>e.id==t.questId));s&&(s.descriptionMain=t.description)},resetQuestDeadline(e,t){const s=e.quests.find((e=>e.id==t.questId));s&&(s.deadline=t.deadline)},updateExpiration(e,t){const s=e.quests.find((e=>e.id==t.questId));s&&(s.expiration=t.expiration)},updateMinParty(e,t){const s=e.quests.find((e=>e.id==t.questId));s&&(s.minParty=t.minParty)},updateMaxParty(e,t){const s=e.quests.find((e=>e.id==t.questId));s&&(s.maxParty=t.maxParty)}}};var m=s(8834),q=function(e,t,s,d){return new(s||(s=Promise))((function(a,n){function o(e){try{r(d.next(e))}catch(e){n(e)}}function i(e){try{r(d.throw(e))}catch(e){n(e)}}function r(e){var t;e.done?a(e.value):(t=e.value,t instanceof s?t:new s((function(e){e(t)}))).then(o,i)}r((d=d.apply(e,t||[])).next())}))};const h=(0,d.defineComponent)({components:{DataTable:l.Z,SubmitQuestModal:u.Z,QuestInfo:c.Z,ModesIcons:m.Z},data:()=>({selectedQuestId:""}),computed:Object.assign(Object.assign({},(0,r.rn)({quests:e=>e.questsAdmin.quests})),{selectedQuest(){return this.quests.find((e=>e.id===this.selectedQuestId))}}),beforeCreate(){this.$store.hasModule("questsAdmin")||this.$store.registerModule("questsAdmin",p)},unmounted(){this.$store.hasModule("questsAdmin")&&this.$store.unregisterModule("questsAdmin")},created(){return q(this,void 0,void 0,(function*(){const e=yield this.$http.initialRequest("/admin/quests/load");this.$http.isError(e)||this.$store.commit("setQuests",e)}))},methods:{deleteQuest(e){const t=this.quests.findIndex((t=>t.id==e.id));this.quests.splice(t,1)},updateQuest(e){const t=this.quests.findIndex((t=>t.id==e.id));-1!==t&&(this.quests[t]=e)},removeDuplicatePartyMembers(e){return q(this,void 0,void 0,(function*(){(yield this.$http.executePost("/admin/quests/removeDuplicatePartyMembers",{},e))&&this.$store.dispatch("updateToastMessages",{message:"removed duplicate party members",type:"success"})}))}}});h.render=function(e,t,s,r,u,c){const l=(0,d.resolveComponent)("modes-icons"),p=(0,d.resolveComponent)("data-table"),m=(0,d.resolveComponent)("submit-quest-modal"),q=(0,d.resolveComponent)("quest-info");return(0,d.openBlock)(),(0,d.createBlock)("div",null,[(0,d.createVNode)("div",a,[(0,d.createVNode)("div",n,[(0,d.createVNode)("div",o,[i,(0,d.createVNode)("button",{class:"btn btn-sm btn-info w-100 mb-1",onClick:t[1]||(t[1]=t=>e.removeDuplicatePartyMembers(t))}," Remove duplicate party members "),(0,d.createVNode)(p,{data:e.quests,headers:["name","creator","modes","status","mapsets"],"custom-data-target":"#editQuest","onUpdate:selectedId":t[2]||(t[2]=t=>e.selectedQuestId=t)},{default:(0,d.withCtx)((({obj:e})=>[(0,d.createVNode)("td",null,(0,d.toDisplayString)(e.name),1),(0,d.createVNode)("td",null,(0,d.toDisplayString)(e.creator.username),1),(0,d.createVNode)("td",null,[(0,d.createVNode)(l,{modes:e.modes},null,8,["modes"])]),(0,d.createVNode)("td",null,(0,d.toDisplayString)(e.status),1),(0,d.createVNode)("td",null,(0,d.toDisplayString)(e.requiredMapsets),1)])),_:1},8,["data"])])])]),(0,d.createVNode)(m,{"is-admin":!0}),e.selectedQuest?((0,d.openBlock)(),(0,d.createBlock)(q,{key:0,quest:e.selectedQuest,onUpdateQuest:t[3]||(t[3]=t=>e.updateQuest(t)),onDeleteQuest:t[4]||(t[4]=t=>e.deleteQuest(t))},null,8,["quest"])):(0,d.createCommentVNode)("",!0)])};const f=h}}]);