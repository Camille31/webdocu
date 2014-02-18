var glide;
var videoRatio;
var center_media_width;
var center_media_height;
var top_media_height;
var left_media_width;
var left_move_div_width;
var left_move_div_height;
var top_move_div_height;
var gradient_y_delta;
var videoTitle;

$(document).ready(function () {

    // layout config
    videoRatio = $('#center').width() / $('#center').height();
    top_media_height = 350;
    left_media_width = 600;
    center_media_width = $(window).width();
    center_media_height = $(window).height();
    if (center_media_height > center_media_width / videoRatio) {
        center_media_height = center_media_width / videoRatio;
    } else {
        center_media_width = center_media_height * videoRatio;
    }
    left_move_div_width = center_media_width / 8;
    left_move_div_height = center_media_height - 40;
    top_move_div_height = center_media_height / 8;
    gradient_y_delta = 75;

    // other config
    videoTitle = "Demo";

    // video init
    projekktor('#center', {
        volume: 0.5,
        title: videoTitle,
        debug: false,
        imageScaling: 'none',
        playerFlashMP4: 'http://www.projekktor.com/wp-content/manual/jarisplayer.swf',
        playerFlashMP3: 'http://www.projekktor.com/wp-content/manual/jarisplayer.swf',
        plugin_controlbar: {
            showCuePoints: true
        },
        controls: true,
        width: center_media_width,
        ratio: videoRatio
    });

    // map init
    var map, layer, markers;
    $('#map').width(left_media_width)
        .height(center_media_height);
    map = new OpenLayers.Map('map', {numZoomLevels: 2});
    layer = new OpenLayers.Layer.OSM("Simple OSM Map");
    map.addLayer(layer);
    map.setCenter(
        new OpenLayers.LonLat(-71.147, 42.472).transform(
            new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject()
        ), 12
    );
    markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);

    // synchronize map and video
    synchronizeMapAndVideo(map, markers, "#left_media .location", "#left_media .comments", "center");

    // glide init
    glide = $('.slider').glide({
        autoplay: false,
        arrowRightText: '→',
        arrowLeftText: '←',
        nav: false
    }).data('api_glide');

    // synchronize glide with video
    synchronizeSliderAndVideo("#top_media", "center");

    // set layout
    $('#center').width(center_media_width)
        .height(center_media_height)
        .css({top: 0, left: 0});
    $('#topGradient').width(center_media_width)
        .height(150)
        .css({top: -gradient_y_delta, left: 0})
        .mouseenter(function () {
            showTopMedia();
        });
    $('#top_media').width(center_media_width)
        .height(top_media_height)
        .css({top: -top_media_height, left: 0});
    $('#left_media').width(left_media_width)
        .height(center_media_height)
        .css({top: 0, left: -left_media_width});

    // add move divs
    $('#top_media').wrap('<div id="move_top" class="move"></div>');
    $('#left_media').wrap('<div id="move_left" class="move"></div>');
    $('#move_top').css({
        "position": "absolute",
        "top": 0,
        "left": left_move_div_width
    })
        .width(center_media_width)
        .height(top_move_div_height)
        .mouseenter(function () {
            showTopMedia();
        });
    $('#move_left').css({
        "position": "absolute",
        "top": 0,
        "left": 0
    })
        .width(left_move_div_width)
        .height(left_move_div_height)
        .mouseenter(function () {
            showLeftMedia();
        });

    // positioning arrows
    $('#leftArrow').css({left: 30, top: ((center_media_height - $('#leftArrow').height()) / 2)});
    $('#upArrow').css({top: 30, left: ((center_media_width - $('#upArrow').width()) / 2)});
    $('#top_media li').width(center_media_width);

    // moving medias according to mouse position
    $('#center').mouseenter(function () {
        showCenterMedia();
    });
    projekktor('#center').addListener("mouseenter", function () {
        showCenterMedia();
    });
    $('#top_media .slider-arrow').mouseenter(function () {
        $("#move_top").mouseenter();
    });
});

function showTopMedia() {
    $('#center').stop(true, false);
    $('#center').animate({top: top_media_height, left: 0}, 1500, "swing");
    $('#topGradient').stop(true, false);
    $('#topGradient').animate({top: top_media_height - gradient_y_delta, left: 0}, 1500, "swing");
    $('#top_media').stop(true, false);
    $('#top_media').animate({top: 0}, 1500, "swing");
    $('#top_media').css("zIndex", 10);
    $('#left_media').stop(true, false);
    $('#left_media').animate({left: -left_media_width}, 1500, "swing");
    $('#left_media').css("zIndex", 9);
    $('#move_left').stop(true, false);
    $('#move_left').animate({top: top_media_height}, 1500);
}

function showLeftMedia() {
    $('#center').stop(true, false);
    $('#center').animate({top: 0, left: left_media_width}, 1500, "swing");
    $('#topGradient').stop(true, false);
    $('#topGradient').animate({top: -gradient_y_delta, left: left_media_width}, 1500, "swing");
    $('#top_media').stop(true, false);
    $('#top_media').animate({top: -top_media_height, left: 0}, 1500, "swing");
    $('#top_media').css("zIndex", 9);
    $('#left_media').stop(true, false);
    $('#left_media').animate({left: 0}, 1500, "swing");
    $('#left_media').css("zIndex", 10);
}

function showCenterMedia() {
    $('#center').stop(true, false);
    $('#center').animate({top: 0, left: 0}, 1500, "swing");
    $('#topGradient').stop(true, false);
    $('#topGradient').animate({top: -gradient_y_delta, left: 0}, 1500, "swing");
    $('#top_media').stop(true, false);
    $('#top_media').animate({top: -top_media_height, left: 0}, 1500, "swing");
    $('#top_media').css("zIndex", 9);
    $('#left_media').stop(true, false);
    $('#left_media').animate({left: -left_media_width}, 1500, "swing");
    $('#left_media').css("zIndex", 9);
    $('#move_left').stop(true, false);
    $('#move_left').animate({top: 0}, 1500);
}

function synchronizeSliderAndVideo(sliderSelector, videoId) {
    var timePositions = new Array();
    $(sliderSelector).find('.slide').each(function (index) {
        // alert(index + " - " + $(this).attr('timePosition'));
        projekktor('#' + videoId).setCuePoint({
            on: $(this).attr('timePosition'),
            callback: function () {
                glide.jump(index + 1);
                $("#upArrow").show();
                setTimeout(function () {
                    $("#upArrow").hide()
                    setTimeout(function () {
                        $("#upArrow").show()
                        setTimeout(function () {
                            $("#upArrow").hide()
                        }, 500);
                    }, 500);
                }, 500);
            }
        });
        timePositions[index] = $(this).attr('timePosition');
    });
    projekktor('#' + videoId).syncCuePoints();
    $(sliderSelector + ' .slider-arrow').click(function () {
        projekktor('#' + videoId).setPlayhead(parseInt(timePositions[glide.current() - 1]));
    });
}

function synchronizeMapAndVideo(map, markers, locationsSelector, infoElemSelector, videoId) {
    var timePositions = new Array();
    var features = new Array();
    $(locationsSelector).each(function (index) {
        // alert(index + " - " + $(this).attr('timePosition'));
        var lonlat = new OpenLayers.LonLat($(this).attr('longitude'), $(this).attr('latitude')).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
        var locElem = $(this);
        projekktor('#' + videoId).setCuePoint({
            on: $(this).attr('timePosition'),
            callback: function () {
                map.panTo(lonlat);
                $(infoElemSelector).html(locElem.html());
                $("#leftArrow").show();
                setTimeout(function () {
                    $("#leftArrow").hide()
                    setTimeout(function () {
                        $("#leftArrow").show()
                        setTimeout(function () {
                            $("#leftArrow").hide()
                        }, 500);
                    }, 500);
                }, 500);
            }
        });
        timePositions[index] = $(this).attr('timePosition');
        markers.addMarker(new OpenLayers.Marker(lonlat));
    });
    projekktor('#' + videoId).syncCuePoints();
}