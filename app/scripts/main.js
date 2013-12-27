function getFromYoutube(e){
    
    e.feed.getVideoId = function(){
        return this.link[0].href.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/)[2];
    }

    var template = "{{#entry}}"+
                    '<div class="thumbnail-container mix" data-video="{{getVideoId}}">'+
                    ' <div class="thumbnail-scroll">'+
                        "{{#media$group.media$thumbnail}}"+
                         '<img class="thumbnail" src="{{url}}" >'+
                        "{{/media$group.media$thumbnail}}"+
                    ' </div>'+
                    '<div class="hover-video">'+
                    " <h1>{{title.$t}}</h1>"+
                    ' <i class="fa fa-play"></i>'+
                    ' </div>'+
                    "</div>"+
                    "{{/entry}}";

    var html = Mustache.to_html(template, e.feed)
    //$("body").append(html);
    $("#container-videos").append(html);
}

function addEventsToContainers(){
    $(".thumbnail-container").on("click", function(){
        var videoId = $(this).data("video"),
            videoName = $(this).find("h1").text(),
            iframeHtml = '<div id="player" class="yt-player"> </div>';

        actualVideoContainer = $(this);
        
        //quita el player anterior
        $("#player").remove();
        $(this).append(iframeHtml);

        player = new YT.Player('player', {
          height: '100%',
          width: '100%',
          videoId: videoId,
          events: {
            'onReady': function(event) {
                //reproduce el video
                $("#video-name").text(videoName);
                event.target.playVideo();
              },
            'onStateChange': function(event) {
                //reproduce el siguiente
                switch(event.data){
                    case YT.PlayerState.ENDED:
                        //reproduce el siguiente 
                        actualVideoContainer.next().click();
                    break;
                    case YT.PlayerState.PLAYING:
                        //actualVideoContainer.scrollIntoView();
                        $(".menu-player .fa-forward, .menu-player .fa-backward").show();
                        $(".fa-pause").show();
                        $(".fa-play").hide();
                    break;
                    case YT.PlayerState.PAUSED:
                        $(".fa-pause").hide();
                        $(".fa-play").show();
                    break;
                }
              }
          }
        });
    });
}

var actualVideoContainer, player;

$(document).ready(function(){
    actualVideoContainer = $(".thumbnail-container")[0];

    addEventsToContainers();

    //player events
    $(".menu-player .fa-forward").on("click", function(){ actualVideoContainer.next().click(); });
    $(".menu-player .fa-backward").on("click", function(){ actualVideoContainer.prev().click(); });
    $(".menu-player .fa-pause").on("click", function(){ player.pauseVideo(); });
    $(".menu-player .fa-play").on("click", function(){ 
        if(player){
            player.playVideo();    
        }else{
            actualVideoContainer.click();
        }
    });

    $(".menu-player .fa-forward, .menu-player .fa-backward, .menu-player .fa-pause").hide();

    $(".title-area .name a").text("Los " + $(".thumbnail-container").length +" Youtubazos 2013");

    $("#randomize-videos").on("click", function(){
        $("#container-videos").mixitup();
        $("#container-videos").mixitup('sort','random');
        addEventsToContainers();
    });
});