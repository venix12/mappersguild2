import Vue from 'vue';
import BeatmapArchivePage from './pages/BeatmapArchivePage.vue';

$(document).ready(function() {
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
    var src = "../images/small.png"
    $("#load").attr("src", src);
});

new Vue({
    el: '#app',
    components: {
        BeatmapArchivePage,
    },
});
