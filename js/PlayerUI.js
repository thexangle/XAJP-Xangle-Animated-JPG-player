/*
* LIVEPX ANIMATED JPG PLAYER
*
* This player is designed to animate jpgs pre-loaded in memory. This allows fast frame display 
* for various application such as 360 degree photos (bullet-time) made with multiple camera. It
* is also able to animate stop-motion sequence, cinemagraphs or any jpg sequence
* 
* Created and supported by http://orangium.com | info@orangium.com
* Download the latest version http://livepx.com 
* Licence : GNU GPL v3.0 http://www.gnu.org/copyleft/gpl.html
*/

Player.prototype.initBinddings = function () {
    this.setKeyBinddings();
    this.setTouchBinddings();
    this.setFrameSwipe();
    this.setFullScreenListener();
    if (serverConected) {
        this.serverServices();
    }
}


/**
* Set the faceBook Like Button
*/
Player.prototype.setLikeButton = function () {

    if (this.settings.faceBookUrl != "#") {
        var obj = this;
        $('.player-controls ul.right').append(
            '<li class="btn-area"><div class="fb-like" data-href="' + obj.settings.faceBookUrl + '" data-send="false" data-layout="button_count" data-width="25" data-show-faces="false" data-font="verdana" data-colorscheme="dark"></div></li>'
        );
    }
}


/**
* Set the sharing module
*/
Player.prototype.initSharing = function () {
    if (this.settings.permUrl != "#") {
        //insert the share button in the player
        $('.player-controls ul.right').append(
                  '<li class="btn-area"><a href="http://livepx.com" target="_blank" class="btn btn-info" title="LivePixel Info"><span>LivePixel Info</span></a></li>' +
                  '<li class="btn-area"><a href="#" class="btn btn-share" title="share"><span>Share</span></a></li>'
        );


        $('.player-sharing').append(
                '<div class="sharing-box">' +
                  '<div id="ctn-close"><a href="#"><div class="btn-close"></div></a></div>' +
                      '<h1>SHARE THIS PHOTO</h1>' +
                      '<div class="group" id="permanentAddress">' +
                            '<label>Permanent Address:</label>' +
                            '<input " type="text" onClick="this.select();" value="' + this.settings.permUrl + '">' +
                       '</div>' +
                        '<div class="group" id="shortAddress">' +
                            '<label>Short Address:</label>' +
                            '<input type="text" onClick="this.select();" value="' + this.settings.shortUrl + '">' +
                        '</div>' +
                        '<div class="group" id="embed-options-panel">' +
                                    '<label>Embed:</label>' +
                                        "<a href='#' class='button embed-size' data-embed= '&lt;iframe style=&#39;width: 600px; height:436px; border: none; overflow: hidden;&#39; src=&#39;" + this.settings.embedUrl + "&#39; scrolling=&#39;no&#39; allowfullscreen webkitallowfullscreen mozallowfullscreen &gt;&lt;/iframe&gt;' >600px</a>" +
                                        "<a href='#' class='button embed-size'data-embed='&lt;iframe style=&#39;width: 800px; height:568px; border: none; overflow: hidden;&#39; src=&#39; " + this.settings.embedUrl + "&#39; scrolling=&#39;no&#39; allowfullscreen webkitallowfullscreen mozallowfullscreen &gt;&lt;/iframe&gt;'>800px</a>" +
                                        "<a href='#' class='button embed-size' data-embed='&lt;iframe style=&#39;width: 960px; height:640px; border: none; overflow: hidden;&#39; src=&#39;" + this.settings.embedUrl + "&#39; scrolling=&#39;no&#39; allowfullscreen webkitallowfullscreen mozallowfullscreen &gt;&lt;/iframe&gt;'>960px</a>" +
                                        "<a href='#' class='button embed-size active' data-embed='&lt;div style=&#39;position: relative; padding-bottom: 66.75%; &#39;&gt;&lt;iframe src=&#39;" + this.settings.embedUrl + "&#39; scrolling=&#39;no&#39; width=&#39;960&#39; height=&#39;640&#39; style=&#39;position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; overflow: hidden;&#39; allowfullscreen webkitallowfullscreen mozallowfullscreen &gt;&lt;/iframe&gt;&lt;/div&gt;'>Responsive</a>" +
                                        "<input type='text' id='embed-code' onClick='this.select();'  value='&lt;div style=&#39;position: relative; padding-bottom: 66.75%; &#39;&gt;&lt;iframe src=&#39;" + this.settings.embedUrl + "&#39; scrolling=&#39;no&#39; width=&#39;960&#39; height=&#39;" + this.settings.height + "&#39; style=&#39;position: absolute; top: 0; left: 0; width: 100%; border: none; overflow: hidden;&#39; allowfullscreen webkitallowfullscreen mozallowfullscreen &gt;&lt;/iframe&gt;&lt;/div&gt;' />" +
                        '</div>' +
                        '<div class="group" id="download" >' +
                                '<label>Download:</label>' +
                                   '<a href="' + this.settings.downloadUrl + '" class="button embed-size" >Frames</a>' +
                                   '<a href="#" id="animatedGif" class="button embed-size" >Animated Gif</a>' +
                                   '<a href="#" id="mp4Video" class="button embed-size">MP4</a>' +
                                   '<a href="#" id="saveToDropbox" class="button embed-size">Dropbox</a>' +
                                '<div id="mp4Length" style="display:none;">' +
                                    '<label>MP4 length (Between 1 and 240, default is ' + this.settings.mp4Length + ')</label>' +
                                    '<input id="mp4Duration" value="' + this.settings.mp4Length + '" type="number" min="1" max="240">' +
                                '</div>' +
                        '</div>' +
                 '</div>'
            );
    }
}

/**
* Set right button
*/
Player.prototype.initCredit = function () {

    if (this.settings.credit != "") {
        $('.player-controls ul.right').append(
              '<li class="btn-area"><span><a class="btn credit" href="' + this.settings.creditUrl + '" target="_blank">' + this.settings.credit + '</a></span></li>'
        );
    }
}


/**
* Player control bar
*/
Player.prototype.controlBar = function () {
    obj = this;

    if (!obj.settings.controlBar) {
        $('.player-controls').css({ display: "none" });
        obj.settings.controlFixed = true;
    }


    $('.player-controls').append(
              '<ul class="left"><li><a href="#" class="btn btn-play" title="Play/Pause"><span>Play</span></a></li></ul>' +
              '<ul class="right"></ul>'
    );


    obj.setLikeButton(); //add the facebook button to the toolBar
    obj.initCredit(); //Initialize the credit name and the link;
    obj.initSharing(); //Initialize the sharing and embed options
    obj.initInfoBox();


    //When the player serve only one image, these buttons are not displayed
    if (!obj.settings.singleImageSet) {
        $('.player-controls ul.left').append(
                    '<li class="btn-area"><a href="#" class="btn btn-previous" title="Previous"><span>previous</span></a></li>' +
                    '<li class="btn-area"><a href="#" class="btn btn-next" title="Next"><span>Next</span></a></li>' +
                    '<li class="btn-area"><a href="#" class="btn btn-shuffle" title="Shuffle"><span>shuffle</span></a></li>'
        );


        $(".btn-previous").click(function () { 
            obj.previous(); 
            return false;
        });
        $(".btn-next").click(function () {
            obj.next();
            return false;
        });
        $(".btn-shuffle").click(function () { 
            obj.settings.shuffle = true; 
            return false;
        });
    }

    if (obj.settings.loop) {
        $('.player-controls ul.left').append(
                 '<li class="btn-area"><a href="#" class="btn btn-reverse" title="Reverse"><span>Reverse</span></a></li>'
                 );
    }


    $('.player-controls ul.left').append(
                 '<li class="btn-area"><a href="#" class="btn btn-speedUp" title="speedUp"><span>speedUp</span></a></li>' +
                 '<li class="btn-area"><a href="#" class="btn btn-speedDown" title="speedDown"><span>speedDown</span></a></li>' +
                 '<li class="btn-area"><a href="#" class="btn btn-fullScreen" title="Full Screen"><span>Full Screen</span></a></li>'
    );




    $(".btn-play, #big-btn-play").click(function () {

        if (obj.isAnimated) {
            obj.stop();

        } else {
            $('#big-btn-play').hide();
            $("#status").fadeIn();
            obj.start();

            /*if ($('#big-btn-play').is(":visible")) {//Init the start sequence if the center-play button is visible else it does regular play/pause
                $('#big-btn-play').fadeOut();
                $("#status").fadeIn();
                obj.start();

            } else {
                obj.play();
            }*/
        }
        return false;
    });


    $("#canvas").dblclick(function () {

        if (obj.isAnimated) {
            obj.stop();
        } else {
            obj.play();
        }
        return false;
    });



    $(".btn-reverse").click(function () {
        obj.imageSet.listImage.reverse();
        obj.clockwise = !obj.clockwise;
        return false;
    });

    $(".btn-speedUp").click(function () {
        if (obj.settings.rotationSpeed < 60) {
            obj.settings.rotationSpeed += 5;
            obj.stop();
            obj.play();
        };
        return false;
    });

    $(".btn-speedDown").click(function () {
        if (obj.settings.rotationSpeed > 10) {
            obj.settings.rotationSpeed -= 5;
            obj.stop();
            obj.play();
        };
        return false;
    });


    $(".btn-fullScreen").click(function () {
        toggleFullScreen();
        return false;
    });


    $(".btn-share, .btn-close").click(function () {
        $('.player-sharing').fadeToggle('fast');
        return false;
    });

    // Data-embed to input box
    $(".embed-size").click(function () {
        $(".embed-size").removeClass('active');
        $(this).addClass('active');
        $('#embed-code').val($(this).data("embed"));
        return false;
    });

    $("#animatedGif").click(function () { 
        obj.animatedGif(); 
        return false;
    });

    $("#mp4Video").click(function () { 
        obj.mp4Video(); 
        return false;
    });

    $("#saveToDropbox").click(function () { 
        obj.saveToDropbox(); 
        return false;
    });
}

/**
* Info
*/
Player.prototype.toggleControl = function () {
    //if (obj.settings.fullScreen) {
    //ControlBarAnimation when full screen
    var obj = this;

    if (obj.settings.playOnStart) {
        setTimeout(function () {
            $(".player-controls").fadeOut('slow');
            $('#canvas').css({ cursor: 'none' });
            $('#watermark').css({ cursor: 'none' });
        }, 3000);
    }

    var i = 7;
    $(".livePixel").bind("mousemove click touchstart", function (e) {

        if (e.type == "touchstart" || i >= 7) { //Mousse sensivity --> reset the timer if a touch move is detected 
            var timer;
            if (timer) {
                clearTimeout(timer);
                timer = 0;
            }

            $(".player-controls").fadeIn('slow');
            $('#canvas').css({ cursor: '' });
            $('#watermark').css({ cursor: '' });


            timer = setTimeout(function () {
                if (!$('.player-controls').is(":hover")) {
                    $(".player-controls").fadeOut('slow');
                    $('#canvas').css({ cursor: 'none' });
                    $('#watermark').css({ cursor: 'none' });
                }
            }, 3000);

        }
        i++;
        setTimeout(function () { i = 0; }, 100);
    });
}


/**
* InfoBox
*/
Player.prototype.initInfoBox = function () {

    $('.infoBox').append(
        "<p id='fileName'><span></span></p>" +
        "<p id='speed'>Speed: <span></span></p>" +
        "<p id='frame'>Frame: <span></span></p>" +
        "<p id='serie'>Serie: <span></span></p>" +
        "<p id='camera'>Camera: <span></span></p>"
        );
}

/**
* SetSpeed
*/
Player.prototype.setSpeed = function (speed) {
    var obj = this;
    obj.settings.rotationSpeed = speed;
    obj.reset();
}


/**
* SetLoop
*/
Player.prototype.setLoop = function (loop) {
    var obj = this;
    obj.imageSet.settings.loop = loop;
    obj.reset();
}



/**
* Info
*/
Player.prototype.fillInfoBox = function () {
    var fileName = this.imageSet.listImage.getElement().src.split("/");
    $("#fileName span").empty().append(fileName[fileName.length - 1]);
    $("#speed span").empty().append(this.settings.rotationSpeed + " fps");
    $("#camera span").empty().append(pad(((this.imageSet.listImage.getPosition() % this.imageSet.settings.totalCamera) + 1)) + " / " + pad(this.imageSet.settings.totalCamera));
    $("#frame span").empty().append(pad((this.imageSet.listImage.getPosition() + 1)) + " / " + pad(this.imageSet.listImage.length));
    $("#serie span").empty().append(pad(Math.ceil(this.imageSet.listImage.getPosition() / this.imageSet.settings.totalCamera)) + " / " + pad(this.imageSet.listImage.length / this.imageSet.settings.totalCamera));


    function pad(num) {
        if (num < 10) {
            num = '0' + num;
        }
        return num;
    }
}


/**
* Keyboard bindings
*/
Player.prototype.setKeyBinddings = function () {

    var obj = this; // Obj refers to the player itself such as "this"
    $(document).keydown(function basicBinddings(e) {

        switch (e.keyCode) {

            case 32:  /*Toggle play --> spaceBar*/
                e.preventDefault();
                if (obj.isAnimated) {
                    obj.stop();
                } else {
                    obj.play();
                    $('#big-btn-play').fadeOut();
                }
                break;

            case 122://F11 --> FullScreen
                if (obj.settings.fullScreen) {
                    e.preventDefault();
                }
                break;

            case 27: /*Quit fullscreen --> escape*/
                e.preventDefault();
                if (obj.settings.fullScreen) {
                    obj.fullScreen();
                }
                break;

            case 73: /*Show the info pannel --> I*/
                //obj.settings.infoDisplay = !obj.settings.infoDisplay;
                $(".infoBox").toggle();
                break;

            case 187:/*Speed Up --> + */
                if (obj.settings.rotationSpeed < 60) {
                    obj.settings.rotationSpeed += 10;
                    obj.stop();
                    obj.play();
                };
                break;

            case 189:/*SpeedDown --> - */
                if (obj.settings.rotationSpeed > 10) {
                    obj.settings.rotationSpeed -= 10;
                    obj.stop();
                    obj.play();
                };
                break;

            default:

                //Previous image set --> key left
                if ((!e.ctrlKey && e.which == 37) && !obj.settings.singleImageSet && !obj.settings.record) {
                    obj.next(); // Inverse for studio reason
                }
                    // Next image set --> key right
                else if ((!e.ctrlKey && e.which == 39) && !obj.settings.singleImageSet && !obj.settings.record) {
                    obj.previous();

                } else if (e.ctrlKey && e.which == 39) {/*Skip to next camera --> ctrl + right*/
                    obj.stop();
                    obj.render(obj.imageSet.nextCamera());

                } else if (e.ctrlKey && e.which == 37) {/* Skip to previous camera --> ctrl + left*/
                    obj.stop();
                    obj.render(obj.imageSet.previousCamera());
                }

        }//END SWITCH

    });//END basicBindding

}


/**
* Mouse swipping making the frame moving next or previous
*/
Player.prototype.setFrameSwipe = function () {

    if (!('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0)) {// disable the function if it's a touch device

        var obj = this;
        var wasAnimated;
        var sensibility = 1;

        $('#canvas').bind("mousedown", function (e) {
            wasAnimated = obj.isAnimated; //detect the state of the player at the begining to replace it like it was

            e.preventDefault();
            e.stopPropagation();

            if (obj.isAnimated) {
                obj.stop();
            }

            var prevX = e.pageX;
            var prevY = e.pageY;

            var slideY;
            var slideX;

            $(this).addClass("closed");

            $(this).bind("mousemove", function (e) {

                e.preventDefault();
                e.stopPropagation();

                slideX = e.pageX - prevX;
                slideY = e.pageY - prevY;

                prevX = e.pageX;
                prevY = e.pageY;


                if (obj.imageSet.settings.stopMotion) {
                    switch (slideY) {
                        case -1: //UP
                            obj.render(obj.imageSet.nextSeries());
                            break;

                        case 1: //DOWN
                            obj.render(obj.imageSet.previousSeries());
                            break;
                    }

                }


                switch (slideX) {

                    case -1: //LEFT
                        obj.render(obj.imageSet.next());
                        break;

                    case 1: //RIGHT
                        obj.render(obj.imageSet.previous());
                        break;
                }
            });


        }).bind("mouseup", function () {

            $(this).removeClass("closed");
            $(this).unbind('mousemove');

            if (wasAnimated) { //Replace the player in the same state it was at the begining
                obj.play();
            }
        });
    }

}



/**
* Touch bindings for multiple image set swipe to go to the next set
*/
Player.prototype.setTouchBinddings = function () {
    //console.log("swipe");
    if ((('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0))) {
        var obj = this;

        $('#canvas').bind('swipeleft', function (e) {
            obj.stop();
            obj.render(obj.imageSet.next());
        });

        $('#canvas').bind('swiperight', function (e) {
            obj.stop();
            obj.render(obj.imageSet.previous());
        });

        //Disable elastic scrolling on ipad
        $(document).bind('touchmove', function (e) {
            e.preventDefault();
        });
    }
}


Player.prototype.setResponsive = function () {

    var obj = this;
    var originalWidth = obj.settings.width;
    var originalHeight = obj.settings.height;
    var originalRatio = obj.settings.width / obj.settings.height;

    //Detect at initialization the size of the screen
    if ($(".livePixel").parent().width() < originalWidth) {

        obj.settings.width = $(".livePixel").parent().width();
        obj.settings.height = $(".livePixel").parent().width() / originalRatio;
        $(".livePixel").css({ 'width': obj.settings.width });
        $("#canvas-wrapper").attr({ 'height': obj.settings.height, 'width': obj.settings.width });
        $("#canvas").attr({ 'height': obj.settings.height, 'width': obj.settings.width });
        $("#watermark").attr({ 'height': obj.settings.height, 'width': obj.settings.width });
    } else {
        obj.setScreenRatio();
    }


    $(window).resize(function () {

        if ($(".livePixel").parent().width() >= originalWidth) {

            obj.settings.width = originalWidth;
            obj.settings.height = originalHeight;

        } else {
            obj.settings.width = $(".livePixel").parent().width();
            obj.settings.height = $(".livePixel").parent().width() / originalRatio;

        }
        obj.setScreenRatio();
    });

}


/**
* Full screen mode
*/
Player.prototype.setScreenRatio = function () {

    obj = this;

    if (obj.settings.fullScreen) {

        $(".livePixel").css({ 'width': screen.width, 'height': screen.height });
        $("#canvas-wrapper").attr({ 'height': screen.height, 'width': screen.width });
        $("#canvas").attr({ 'height': screen.height, 'width': screen.width });
        $("#watermark").attr({ 'height': screen.height, 'width': screen.width });

    } else {
        obj.screenRatio = 1;
        $(".livePixel").css({ 'width': obj.settings.width * obj.screenRatio, 'height': obj.settings.height * obj.screenRatio });
        $("#canvas-wrapper").attr({ 'height': obj.settings.height * obj.screenRatio, 'width': obj.settings.width * obj.screenRatio });
        $("#canvas").attr({ 'height': obj.settings.height * obj.screenRatio, 'width': obj.settings.width * obj.screenRatio });
        $("#watermark").attr({ 'height': obj.settings.height * obj.screenRatio, 'width': obj.settings.width * obj.screenRatio });
    }

    if (!obj.isAnimated && obj.imageSet != undefined) {
        obj.render(obj.imageSet.listImage.getElement());
    }

    this.applyWatermark();
}


Player.prototype.setFullScreenListener = function () {
    if (this.settings.canvas) { //if canvas then html5 then fullScreen api
        obj = this;
        document.addEventListener("fullscreenchange", function () {
            obj.fullScreen();
        }, false);

        document.addEventListener("mozfullscreenchange", function () {
            obj.fullScreen();
        }, false);

        document.addEventListener("webkitfullscreenchange", function () {
            obj.fullScreen();

        }, false);
    }
}


Player.prototype.fullScreen = function () {
    obj = this;
    obj.settings.fullScreen = !obj.settings.fullScreen;
    obj.setScreenRatio();
    //obj.toggleControl();
}



function toggleFullScreen() {
    var elem = $(".livePixel").get(0); //return the element as an object for js maniplation

    if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }

    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }

}

/**
* Download an animated gif
*/
Player.prototype.animatedGif = function () {
    var obj = this;
    console.log(this.settings.rotationSpeed);
    var url = "/index.aspx?a=ImageToContent.CreateGif&nh=1&ajax=1" +
              "&speed=" + this.settings.rotationSpeed +
              "&loop=" + this.settings.loop +
              "&clockwise=" + obj.clockwise +
              "&path=" + this.imageSet.data.folderName + "/";

    window.location.href = url;
}

/**
* Download an MP4 Video
*/
Player.prototype.mp4Video = function () {
    var obj = this;
    var url = "/index.aspx?a=ImageToContent.CreateMP4Video&nh=1&ajax=1" +
        "&speed=" + this.settings.rotationSpeed +
        "&loop=" + this.settings.loop +
        "&clockwise=" + obj.clockwise +
        "&path=" + this.imageSet.data.folderName + "/"+
        "&duration=" + $('#mp4Duration').val();

    window.location.href = url;
}

Player.prototype.saveToDropbox = function () {
    // Dropbox options
    var options = {
                files: [
                    // You can specify up to 100 files.
                    // {'url': '...', 'filename': '...'},
                    {'url': this.settings.downloadUrl}
                    // ...
                ],

                // Success is called once all files have been successfully added to the user's
                // Dropbox, although they may not have synced to the user's devices yet.
                success: function () {
                    // Indicate to the user that the files have been saved.
                    alert("Success! Files saved to your Dropbox.");
                },

                // Progress is called periodically to update the application on the progress
                // of the user's downloads. The value passed to this callback is a float
                // between 0 and 1. The progress callback is guaranteed to be called at least
                // once with the value 1.
                progress: function (progress) {
                    console.log((progress*100) + "%");
                },

                // Cancel is called if the user presses the Cancel button or closes the Saver.
                cancel: function () {
                    console.log('Canceled');
                },

                // Error is called in the event of an unexpected response from the server
                // hosting the files, such as not being able to find a file. This callback is
                // also called if there is an error on Dropbox or if the user is over quota.
                error: function (errorMessage) {
                    console.log(errorMessage);
                }
            };
    Dropbox.save(options);
}