var glide;
var videoRatio = 1;
var center_media_width = 0;
var center_media_height = 0;
var top_media_height = 0;
var left_media_width = 0;
var left_move_div_width = 0;
var left_move_div_height = 0;
var top_move_div_height = 0;
var gradient_y_delta = 0;
var videoTitle = "Demo";

$(document).ready(function () {

    // layout config
    videoRatio = $('#center').width() / $('#center').height();
    if ($('#left_media').length > 0) {
        left_media_width = 600;
        left_move_div_width = center_media_width / 8;
        left_move_div_height = center_media_height - 40;
    }
    if ($('#top_media').length > 0) {
        top_media_height = 350;
        top_move_div_height = center_media_height / 8;
        gradient_y_delta = 75;
    }

    // set width and height of center media in order to make it the biggest possible while respecting the video ratio
    center_media_width = $(window).width();
    center_media_height = $(window).height();
    if (center_media_height > center_media_width / videoRatio) {
        center_media_height = center_media_width / videoRatio;
    } else {
        center_media_width = center_media_height * videoRatio;
    }

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
    $(".map").each(function (index) {
        console.log(index);
        var mapId = "inner_map_" + index;
        var map, layer, markers;

        $(this).append("<div class='comments'></div>");
        $(this).append("<div id='" + mapId + "'></div>");
        $('#' + mapId).width(left_media_width)
            .height(center_media_height);
        map = new OpenLayers.Map(mapId, {numZoomLevels: 2});
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
    });

    // glide init
    glide = $('.slider').glide({
        autoplay: false,
        arrowRightText: '→',
        arrowLeftText: '←',
        nav: false
    }).data('api_glide');
    // synchronize glide with video
    $(".slider").each(function (index) {
        synchronizeSliderAndVideo($(this), "center");
    });

    // synchronize cue points of the video
    projekktor('#center').syncCuePoints();

    // set layout
    $('#center').width(center_media_width)
        .height(center_media_height)
        .css({top: 0, left: 0});

    if ($('#left_media').length > 0) {
        $('body').append('<img id="leftArrow" class="imageOverVideo arrow" src="img/leftArrow.svg" alt="left arrow">');
        $('#leftArrow').css({left: 30, top: ((center_media_height - $('#leftArrow').height()) / 2)});
        $('#left_media').width(left_media_width)
            .height(center_media_height)
            .css({top: 0, left: -left_media_width});
        // add move div
        $('#left_media').wrap('<div id="move_left" class="move"></div>');
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
    }

    if ($('#top_media').length > 0) {
        $('body').append('<img id="upArrow" class="imageOverVideo arrow" src="img/upArrow.svg" alt="up arrow">');
        $('body').append('<img id="topGradient" class="imageOverVideo" src="img/gradient.svg" alt="gradient">');
        $('#upArrow').css({top: 30, left: ((center_media_width - $('#upArrow').width()) / 2)});
        $('#topGradient').width(center_media_width)
            .height(150)
            .css({top: -gradient_y_delta, left: 0})
            .mouseenter(function () {
                showTopMedia();
            });
        $('#top_media').width(center_media_width)
            .height(top_media_height)
            .css({top: -top_media_height, left: 0});
        // add move div
        $('#top_media').wrap('<div id="move_top" class="move"></div>');
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
    }

    // moving medias according to mouse position
    $('#center').mouseenter(function () {
        showCenterMedia();
    });
    projekktor('#center').addListener("mouseenter", function () {
        showCenterMedia();
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

function synchronizeSliderAndVideo(glideElement, videoId) {
    var timePositions = new Array();
    var player = projekktor('#' + videoId);
    // fill up the timePositions array
    glideElement.find('.slide').each(function (index) {
        var timePosition = $(this).attr('timePosition');
        timePositions[index] = timePosition;
    });
    // make slider automatically go to the next image when its time in the video
    $.each(timePositions, function (index, value) {
        player.setCuePoint({
            on: value,
            callback: function () {
                glide.jump(index + 1);
                blinkElement($("#upArrow"));
            }
        });
    });
    // make the video go to the corresponding time when an image is displayed in the slider
    glideElement.find('.slider-arrow').click(function () {
        player.setPlayhead(parseInt(timePositions[glide.current() - 1]));
    });
    // display the relevant image in the slider when the position in the video is manually changed by the user
    player.addListener("seek", function (str) {
        if (str == 'SEEKED') {
            var pos = player.getPosition();
            var index = 0;
            for (index = 0; index < timePositions.length; index++)
                if (timePositions[index] > pos)
                    break;
            if (index == 0)
                index++;
            glide.jump(index);
        }
    });
}

function synchronizeMapAndVideo(map, markers, locationsSelector, infoElemSelector, videoId) {
    var timePositions = new Array();
    var player = projekktor('#' + videoId);
    $(locationsSelector).each(function (index) {
        // alert(index + " - " + $(this).attr('timePosition'));
        var lonlat = new OpenLayers.LonLat($(this).attr('longitude'), $(this).attr('latitude')).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
        var locElem = $(this);
        player.setCuePoint({
            on: $(this).attr('timePosition'),
            callback: function () {
                map.panTo(lonlat);
                $(infoElemSelector).html(locElem.html());
                blinkElement($("#leftArrow"));
            }
        });
        timePositions[index] = $(this).attr('timePosition');
        markers.addMarker(new OpenLayers.Marker(lonlat));
    });
}

// very basic implementation for making an element blink
function blinkElement(elem) {
    elem.show();
    setTimeout(function () {
        elem.hide()
        setTimeout(function () {
            elem.show()
            setTimeout(function () {
                elem.hide()
            }, 500);
        }, 500);
    }, 500);
}