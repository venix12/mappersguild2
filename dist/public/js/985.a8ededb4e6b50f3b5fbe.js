(self.webpackChunkmappersguild=self.webpackChunkmappersguild||[]).push([[985],{285:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});var o=a(5393);const s={name:"CopyPaste",props:{distinct:{type:String,default:""}},methods:{copy(){const e=document.querySelector(`#copyText${this.distinct}`);e.classList.add("animate-flicker"),this.$store.dispatch("updateToastMessages",{message:"Copied",type:"info"}),setTimeout((()=>{e.classList.remove("animate-flicker")}),500);const t=e.innerHTML.replace(/<br>/gi,"\r\n"),a=document.createElement("div");a.innerHTML=t,navigator.clipboard.writeText(a.textContent.trim())}},render:function(e,t,a,s,i,d){return(0,o.openBlock)(),(0,o.createBlock)("div",{id:"copyText"+a.distinct,class:"copy-text small text-white-50 font-monospace",onClick:t[1]||(t[1]=(...e)=>d.copy&&d.copy(...e))},[(0,o.renderSlot)(e.$slots,"default")],8,["id"])}}},1516:(e,t,a)=>{"use strict";a.d(t,{Z:()=>m});var o=a(5393);const s={class:"modal fade",tabindex:"-1"},i={key:0,class:"modal-content the-a-background"},d={class:"modal-title"},r=(0,o.createVNode)("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal"},null,-1),l={class:"modal-body"},n={key:0,class:"modal-footer"},c=(0,o.defineComponent)({name:"ModalDialog",props:{title:{type:String,default:""},modalSize:{type:String,default:"lg"},headerClass:{type:String,default:"bg-primary"},loaded:{type:Boolean,default:!0}}});c.render=function(e,t,a,c,m,p){return(0,o.openBlock)(),(0,o.createBlock)("div",s,[(0,o.createVNode)("div",{class:["modal-dialog modal-fullscreen-lg-down",`modal-${e.modalSize}`]},[e.loaded?((0,o.openBlock)(),(0,o.createBlock)("div",i,[(0,o.createVNode)("div",{class:["modal-header",e.headerClass||"bg-primary"]},[(0,o.createVNode)("h5",d,[(0,o.renderSlot)(e.$slots,"header",{},(()=>[(0,o.createTextVNode)((0,o.toDisplayString)(e.title),1)]))]),r],2),(0,o.createVNode)("div",l,[(0,o.renderSlot)(e.$slots,"default")]),e.$slots.footer?((0,o.openBlock)(),(0,o.createBlock)("div",n,[(0,o.renderSlot)(e.$slots,"footer")])):(0,o.createCommentVNode)("",!0)])):(0,o.createCommentVNode)("",!0)],2)])};const m=c},8834:(e,t,a)=>{"use strict";a.d(t,{Z:()=>c});var o=a(5393);const s={key:0,class:"fas fa-circle mode-margin"},i={key:1,class:"fas fa-drum mode-margin"},d={key:2,class:"fas fa-apple-alt mode-margin"},r={key:3,class:"fas fa-stream mode-margin"},l={key:4,class:"fas fa-check-double mode-margin"},n=(0,o.defineComponent)({name:"ModesIcons",props:{modes:{type:Array,required:!0},toggler:Boolean},emits:["toggle"]});n.render=function(e,t,a,n,c,m){const p=(0,o.resolveDirective)("bs-tooltip");return e.toggler?((0,o.openBlock)(),(0,o.createBlock)(o.Fragment,{key:0},[(0,o.createVNode)("a",{class:"mode-margin",href:"#",onClick:t[1]||(t[1]=(0,o.withModifiers)((t=>e.$emit("toggle","osu")),["prevent"]))},[(0,o.withDirectives)((0,o.createVNode)("i",{class:["fas fa-circle",e.modes.includes("osu")?"":"text-white-50"]},null,2),[[p,"toggle osu!"]])]),(0,o.createVNode)("a",{class:"mode-margin",href:"#",onClick:t[2]||(t[2]=(0,o.withModifiers)((t=>e.$emit("toggle","taiko")),["prevent"]))},[(0,o.withDirectives)((0,o.createVNode)("i",{class:["fas fa-drum",e.modes.includes("taiko")?"":"text-white-50"]},null,2),[[p,"toggle osu!taiko"]])]),(0,o.createVNode)("a",{class:"mode-margin",href:"#",onClick:t[3]||(t[3]=(0,o.withModifiers)((t=>e.$emit("toggle","catch")),["prevent"]))},[(0,o.withDirectives)((0,o.createVNode)("i",{class:["fas fa-apple-alt",e.modes.includes("catch")?"":"text-white-50"]},null,2),[[p,"toggle osu!catch"]])]),(0,o.createVNode)("a",{class:"mode-margin",href:"#",onClick:t[4]||(t[4]=(0,o.withModifiers)((t=>e.$emit("toggle","mania")),["prevent"]))},[(0,o.withDirectives)((0,o.createVNode)("i",{class:["fas fa-stream",e.modes.includes("mania")?"":"text-white-50"]},null,2),[[p,"toggle osu!"]])])],64)):((0,o.openBlock)(),(0,o.createBlock)(o.Fragment,{key:1},[e.modes.includes("osu")?(0,o.withDirectives)(((0,o.openBlock)(),(0,o.createBlock)("i",s,null,512)),[[p,"osu!"]]):(0,o.createCommentVNode)("",!0),e.modes.includes("taiko")?(0,o.withDirectives)(((0,o.openBlock)(),(0,o.createBlock)("i",i,null,512)),[[p,"osu!taiko"]]):(0,o.createCommentVNode)("",!0),e.modes.includes("catch")?(0,o.withDirectives)(((0,o.openBlock)(),(0,o.createBlock)("i",d,null,512)),[[p,"osu!catch"]]):(0,o.createCommentVNode)("",!0),e.modes.includes("mania")?(0,o.withDirectives)(((0,o.openBlock)(),(0,o.createBlock)("i",r,null,512)),[[p,"osu!mania"]]):(0,o.createCommentVNode)("",!0),e.modes.includes("hybrid")?(0,o.withDirectives)(((0,o.openBlock)(),(0,o.createBlock)("i",l,null,512)),[[p,"multiple game modes"]]):(0,o.createCommentVNode)("",!0)],64))};const c=n},1659:(e,t,a)=>{"use strict";a.d(t,{Z:()=>B});var o=a(5393);const s={key:1},i=(0,o.createTextVNode)(" | "),d={class:"container"},r={class:"row"},l=(0,o.createVNode)("option",{value:"WIP"}," WIP ",-1),n=(0,o.createVNode)("option",{value:"Done"}," Done ",-1),c=(0,o.createVNode)("option",{value:"Qualified"}," Qualified ",-1),m=(0,o.createVNode)("option",{value:"Ranked"}," Ranked ",-1),p={class:"row"},u={class:"row"},h={class:"row"},b={key:0,class:"row"},k=(0,o.createVNode)("option",{value:"1"}," 1 ",-1),f=(0,o.createVNode)("option",{value:"2"}," 2 ",-1),y=(0,o.createVNode)("option",{value:"3"}," 3 ",-1),g={class:"row"},v=(0,o.createTextVNode)(" Featured Artist showcase: "),w={class:"text-danger me-2"};var V=a(1516),I=a(8834),N=function(e,t,a,o){return new(a||(a=Promise))((function(s,i){function d(e){try{l(o.next(e))}catch(e){i(e)}}function r(e){try{l(o.throw(e))}catch(e){i(e)}}function l(e){var t;e.done?s(e.value):(t=e.value,t instanceof a?t:new a((function(e){e(t)}))).then(d,r)}l((o=o.apply(e,t||[])).next())}))};const $=(0,o.defineComponent)({name:"BeatmapInfoAdmin",components:{ModalDialog:V.Z,ModesIcons:I.Z},props:{beatmap:{type:Object,required:!0}},data(){return{status:this.beatmap.status,taskId:null,modderId:null,beatmapUrl:this.beatmap.url,storyboardQuality:null,storyboardTaskId:null,packId:this.beatmap.packId}},computed:{sortedTasks(){const e=["Easy","Normal","Hard","Insane","Expert","Storyboard"];return[...this.beatmap.tasks].sort((function(t,a){return e.indexOf(t.name)-e.indexOf(a.name)}))}},watch:{beatmap(){this.findBeatmapInfo()}},mounted(){this.findBeatmapInfo()},methods:{findBeatmapInfo(){this.status=this.beatmap.status,this.taskId=null,this.modderId=null,this.beatmapUrl=this.beatmap.url,this.storyboardQuality=null,this.storyboardTaskId=null,this.packId=this.beatmap.packId,this.beatmap.tasks.forEach((e=>{"Storyboard"==e.name&&(e.sbQuality&&(this.storyboardQuality=e.sbQuality),this.storyboardTaskId=e.id)}))},findTaskInfo(e){let t=`${e.name} --- `;return t+=e.mappers.map((e=>e.username)).join(", "),"Storyboard"==e.name&&(t+=` --- ${e.sbQuality}`),t},updateBeatmapStatus(e){return N(this,void 0,void 0,(function*(){const t=yield this.$http.executePost(`/admin/beatmaps/${this.beatmap.id}/updateStatus`,{status:this.status},e);this.$http.isError(t)||(this.$store.dispatch("updateToastMessages",{message:"updated beatmap status",type:"info"}),this.$store.commit("updateBeatmapStatus",{beatmapId:this.beatmap.id,status:t}))}))},deleteTask(e){return N(this,void 0,void 0,(function*(){const t=yield this.$http.executePost(`/admin/beatmaps/${this.beatmap.id}/tasks/${this.taskId}/delete`,{},e);this.$http.isError(t)||(this.$store.dispatch("updateToastMessages",{message:"deleted task",type:"info"}),this.$store.commit("deleteTask",{beatmapId:this.beatmap.id,taskId:this.taskId}))}))},deleteModder(e){return N(this,void 0,void 0,(function*(){const t=yield this.$http.executePost(`/admin/beatmaps/${this.beatmap.id}/modders/${this.modderId}/delete`,{},e);this.$http.isError(t)||(this.$store.dispatch("updateToastMessages",{message:"deleted modder",type:"info"}),this.$store.commit("deleteModder",{beatmapId:this.beatmap.id,modderId:this.modderId}))}))},updateUrl(e){return N(this,void 0,void 0,(function*(){const t=yield this.$http.executePost(`/admin/beatmaps/${this.beatmap.id}/updateUrl`,{url:this.beatmapUrl},e);this.$http.isError(t)||(this.$store.dispatch("updateToastMessages",{message:"updated URL",type:"info"}),this.$store.commit("updateUrl",{beatmapId:this.beatmap.id,url:t}))}))},updateStoryboardQuality(e){return N(this,void 0,void 0,(function*(){const t=yield this.$http.executePost(`/admin/beatmaps/${this.beatmap.id}/updateStoryboardQuality`,{storyboardQuality:this.storyboardQuality,taskId:this.storyboardTaskId},e);this.$http.isError(t)||(this.$store.dispatch("updateToastMessages",{message:"updated storyboard quality",type:"info"}),this.$store.commit("updateStoryboardQuality",{beatmapId:this.beatmap.id,taskId:this.storyboardTaskId,task:t}))}))},updatePackId(e){return N(this,void 0,void 0,(function*(){const t=yield this.$http.executePost(`/admin/beatmaps/${this.beatmap.id}/updatePackId`,{packId:this.packId},e);this.$http.isError(t)||(this.$store.dispatch("updateToastMessages",{message:"updated pack id",type:"info"}),this.$store.commit("updatePackId",{beatmapId:this.beatmap.id,packId:t}))}))},updateIsShowcase(e){return N(this,void 0,void 0,(function*(){const t=yield this.$http.executePost(`/admin/beatmaps/${this.beatmap.id}/updateIsShowcase`,{isShowcase:!this.beatmap.isShowcase},e);this.$http.isError(t)||(this.$store.dispatch("updateToastMessages",{message:"updated isShowcase",type:"info"}),this.$store.commit("updateIsShowcase",{beatmapId:this.beatmap.id,isShowcase:t}))}))}}});$.render=function(e,t,a,V,I,N){const $=(0,o.resolveComponent)("user-link"),B=(0,o.resolveComponent)("modes-icons"),S=(0,o.resolveComponent)("modal-dialog");return(0,o.openBlock)(),(0,o.createBlock)(S,{id:"editBeatmap",loaded:Boolean(e.beatmap)},{header:(0,o.withCtx)((()=>[e.beatmap.url?((0,o.openBlock)(),(0,o.createBlock)("a",{key:0,href:e.beatmap.url,target:"_blank"},(0,o.toDisplayString)(e.beatmap.song.artist)+" - "+(0,o.toDisplayString)(e.beatmap.song.title),9,["href"])):((0,o.openBlock)(),(0,o.createBlock)("span",s,(0,o.toDisplayString)(e.beatmap.song.artist)+" - "+(0,o.toDisplayString)(e.beatmap.song.title),1)),i,(0,o.createVNode)($,{class:"me-1",user:e.beatmap.host},null,8,["user"]),(0,o.createVNode)(B,{modes:[e.beatmap.mode]},null,8,["modes"])])),default:(0,o.withCtx)((()=>[(0,o.createVNode)("div",d,[(0,o.createVNode)("p",r,[(0,o.withDirectives)((0,o.createVNode)("select",{"onUpdate:modelValue":t[1]||(t[1]=t=>e.status=t),class:"form-select form-select-sm w-50 mx-2"},[l,n,c,m],512),[[o.vModelSelect,e.status]]),(0,o.createVNode)("button",{class:"btn btn-sm btn-outline-info w-25",onClick:t[2]||(t[2]=t=>e.updateBeatmapStatus(t))}," Save status ")]),(0,o.createVNode)("p",p,[(0,o.withDirectives)((0,o.createVNode)("select",{"onUpdate:modelValue":t[3]||(t[3]=t=>e.taskId=t),class:"form-select form-select-sm w-50 mx-2"},[((0,o.openBlock)(!0),(0,o.createBlock)(o.Fragment,null,(0,o.renderList)(e.sortedTasks,(t=>((0,o.openBlock)(),(0,o.createBlock)("option",{key:t.id,value:t.id},(0,o.toDisplayString)(e.findTaskInfo(t)),9,["value"])))),128))],512),[[o.vModelSelect,e.taskId]]),(0,o.createVNode)("button",{class:"btn btn-sm btn-outline-danger w-25",onClick:t[4]||(t[4]=t=>e.deleteTask(t))}," Remove difficulty ")]),(0,o.createVNode)("p",u,[(0,o.withDirectives)((0,o.createVNode)("select",{"onUpdate:modelValue":t[5]||(t[5]=t=>e.modderId=t),class:"form-select form-select-sm w-50 mx-2"},[((0,o.openBlock)(!0),(0,o.createBlock)(o.Fragment,null,(0,o.renderList)(e.beatmap.modders,(e=>((0,o.openBlock)(),(0,o.createBlock)("option",{key:e.id,value:e.id},(0,o.toDisplayString)(e.username),9,["value"])))),128))],512),[[o.vModelSelect,e.modderId]]),(0,o.createVNode)("button",{class:"btn btn-sm btn-outline-danger w-25",onClick:t[6]||(t[6]=t=>e.deleteModder(t))}," Remove modder ")]),(0,o.createVNode)("p",h,[(0,o.withDirectives)((0,o.createVNode)("input",{"onUpdate:modelValue":t[7]||(t[7]=t=>e.beatmapUrl=t),class:"form-control form-control-sm mx-2 w-50",type:"text",autocomplete:"off",placeholder:"beatmap url..."},null,512),[[o.vModelText,e.beatmapUrl]]),(0,o.createVNode)("button",{class:"btn btn-sm btn-outline-info w-25",onClick:t[8]||(t[8]=t=>e.updateUrl(t))}," Save URL ")]),e.storyboardTaskId?((0,o.openBlock)(),(0,o.createBlock)("p",b,[(0,o.withDirectives)((0,o.createVNode)("select",{"onUpdate:modelValue":t[9]||(t[9]=t=>e.storyboardQuality=t),class:"form-select form-select-sm w-50 mx-2"},[k,f,y],512),[[o.vModelSelect,e.storyboardQuality]]),(0,o.createVNode)("button",{class:"btn btn-sm btn-outline-info w-25",onClick:t[10]||(t[10]=t=>e.updateStoryboardQuality(t))}," Save Storyboard Quality ")])):(0,o.createCommentVNode)("",!0),(0,o.createVNode)("p",g,[(0,o.withDirectives)((0,o.createVNode)("input",{"onUpdate:modelValue":t[11]||(t[11]=t=>e.packId=t),class:"form-control form-control-sm mx-2 w-50",type:"text",autocomplete:"off",placeholder:"osu! beatmap pack ID..."},null,512),[[o.vModelText,e.packId]]),(0,o.createVNode)("button",{class:"btn btn-sm btn-outline-info w-25",onClick:t[12]||(t[12]=t=>e.updatePackId(t))}," Save pack ID ")]),(0,o.createVNode)("p",null,[v,(0,o.createVNode)("span",w,(0,o.toDisplayString)(e.beatmap.isShowcase?"true":"false"),1),(0,o.createVNode)("button",{class:"btn btn-sm btn-outline-info",onClick:t[13]||(t[13]=t=>e.updateIsShowcase(t))}," Toggle ")])])])),_:1},8,["loaded"])};const B=$}}]);