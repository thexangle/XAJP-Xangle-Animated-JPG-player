
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

var editionPack = false;
var serverConected = false;
/*
* Jquery plugin
* Create the player with selected options. 
* The plugin will determine if HTML5 is supported otherwise jpeg will be render in the img tag
* but some of the functionality will be lost.
*/

$.fn.Player = function (options, path) {
    var player;
    
    $(this).append(
           '<div id="player-content"></div>' + //Player.js dynamicly insert canvas or img tag here
           '<div class="player-sharing"></div>' +
           '<div id="status"></div>' +
           '<div class="infoBox"></div>' +
           '<div id="play-container"><a href="#" id="big-btn-play"><img src="img/play-button.png" ></a></div>' +
           '<div class="player-controls"></div>'
           );


    //Verify if canvas are suported
    function isCanvasSupported() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }


    if (isCanvasSupported()) {
        //create canvas tag if suported by the browser
        $(this).append(
            '<div id="canvas-wrapper">' +
            '<canvas id="canvas"></canvas>' +
            '<canvas id="watermark"></canvas>' +
            '</div>'
            );
        player = new Player(options, document.getElementById('canvas').getContext("2d"), path);

    } else {

        //create img tag if canvas are not suported by the browser (IE9 and previous)
        options.canvas = false;
        options.crossFade = false;

        $("#player-content").append("<img id='canvas'  src='#' >");
        $("#player-content").append("<img id='watermark'  src='#' >");
        player = new Player(options, null, path);
    }

    return player;
}



/**
* Player constructor
*/
function Player(options, context, path) {

    //Public Settings can be modified at the creation
    this.settings = {

        canvas: true,
        shuffle: false,
        autoPlay: false,
        autoPlaySpeed: 10000,
        crossFade: false,
        rotationSpeed: 100,
        autoUpdateSpeed: 2000,

        credit: "",
        creditUrl: "#",
        faceBookUrl: "#",
        permUrl: "",
        shortUrl: "",
        downloadUrl: "",
        embedUrl: "#",

        playOnStart: false,
        startPosition: 0,
        singleImageSet: false, //Unbind and remove unnecessary buttons like next/previous...
        serverServices: false, //Add server side service
        fullScreen: false,
        height: 640,
        width: 960,
        updateToLast: false, //At each new image the player will skip to the latest one

        //UI
        controlBar: true,
        keyBindings: true,
        touchBiddings: true,
        
        record: false
    }

    if (options) {
        $.extend(this.settings, options);
    }

    //Public
    this.dataArray = new NodeList();
    this.context = context; // Canvas context
    this.imageSet; // Object composed of image
    this.id; //Player ID for rotation  speed
    this.autoPlayId;//Player ID for autoplay speed
    this.isAnimated = false;
    this.crossFadingProcess = false;
    this.updateFlag = false;
    this.initRecorder = true;
    this.screenRatio = 1;
    this.clockwise = true;

    //Detect if the path comes from the html-index or from the server
    if (path != undefined) {
        this.dataArray.stringToData(path);
    } else {
        if (this.settings.serverSideEvent) {
            this.autoUpdateSSE();
        } else {
            this.autoUpdateAJX();
        }
    }

    this.init();
}

/**
* Initiate the settings for the first run
*/
Player.prototype.init = function () {
    var obj = this;

    realInit = function (obj) {
        obj.start();
        obj.play();
    }

    //Initialisation
    this.controlBar();//Initialize the control bar
    this.initBinddings();
    this.setResponsive();

    
    if (obj.settings.playOnStart) {
        realInit(obj);

    } else {
        $("#play-container").show();

        var tmpDataArray = new NodeList();
        tmpDataArray.stringToData(obj.dataArray.getElement().folderName + '/' + obj.dataArray.getElement().fileName[obj.settings.startPosition ]);
        obj.imageSet = new ImageSet(tmpDataArray.getElement(), obj.settings);

        //Load the first image 
        var tmpImg = obj.imageSet.getElement();

        tmpImg.onload = function () {
            obj.render(tmpImg);
        };
    }
}


Player.prototype.start = function () {

    function checkStatus(obj) {
        if (obj.imageSet.status > 90) {
            $("#status").fadeOut();
            obj.play();

        } else {
            //Update the status until 100%
            setTimeout(function () {
                $("#status").show();
                $("#status").progressbar({ value: obj.imageSet.status });
                checkStatus(obj);
            }, 10);
        }
    }

    if (this.settings.controlBar) {
        this.toggleControl();
    }

    this.load(this.dataArray.getElement());
    checkStatus(this);

    if (editionPack) {
        this.setAdvancedKeyBindings();
        this.settings.editionPack = true;
    }
}

/**
* Apply a watermark
*/
Player.prototype.applyWatermark = function () {
    wmElement = document.getElementById("watermark");
    var obj = this;
    if(obj.settings.watermark && obj.settings.watermark != ""){
        var img = new Image();
        img.src = obj.settings.watermark;
        img.onload = function () {
            var height, width, x, y;
            // Vertical image
            if(img.height/img.width > 1) {
                height = wmElement.height / 3;
                width = img.width * height / img.height;
            }
            // Horizontal image
            else {
                width = wmElement.width / 4;
                height = img.height * width / img.width;
            }
            // Location
            x = wmElement.width - width;
            y = wmElement.height - height;

            wmElement.getContext("2d").drawImage(img, x - 5, y - 5, width, height);
        }
    }
}

/**
* Load file path in a array
*/
Player.prototype.autoUpdateSSE = function () {
    var obj = this;

    var source = new EventSource("getFoldersSSE.aspx");
    source.addEventListener("newfile", handleFile,false);

    source.onopen = function () {
        console.log("Conecting...");
    };

    source.onerror = function (event) {
        console.log("Error: " + event.data);
    };


    function handleFile(event) {
        obj.dataArray.stringToData(event.data);
        obj.updateFlag = true;
    }

}

/**
* Load file path in a array
*/
Player.prototype.autoUpdateAJX = function (){

    var obj = this;
    var current = "";

    function readCurrent(obj) {

        $.ajax({
            url: "getFoldersAJX.aspx",
            cache: false,
            async: false,
            success: function (msg) {
                if (current != msg) {
                    obj.dataArray.stringToData(msg);
                    obj.updateFlag = true;
                    current = msg;
                }
            }
        });
        setTimeout(function () { readCurrent(obj); }, obj.settings.autoUpdateSpeed);
    }
    readCurrent(obj);
}


/**
* Load ImageSet in the player
*/
Player.prototype.load = function (data) {
    var obj = this;
    obj.imageSet = new ImageSet(obj.dataArray.getElement(), obj.settings);
}


/**
* Animate the player
*/
Player.prototype.play = function (type) {

    var obj = this; // Obj refers to the player itself such as "this"
    clearInterval(obj.id);
    obj.isAnimated = true;

    if (obj.settings.autoPlay && obj.autoPlayId == undefined) {
        obj.autoPlay();
    }

    $(".btn-play").removeClass("btn-play").addClass("btn-pause");

    obj.id = setInterval(function () {

        if (type == undefined) {

            if (!obj.updateFlag) { //If no new stuff
                obj.render(obj.imageSet.next()); //Regular ImageSet animation

            } else { //If new stuff is uploaded
                obj.updateFlag = false;

                if (obj.settings.updateToLast) {
                    obj.load(obj.dataArray.getElement());
                }
            }
        } else if (type == "series") {
            obj.render(obj.imageSet.nextSeries()); //Series animation in stopMotion

        } else if (type == "camera") {
            obj.render(obj.imageSet.nextCamera()); //Camera animation in stopMotion
        }
    }, obj.settings.rotationSpeed);  
}


/**
* Change image automaticaly
*/
Player.prototype.autoPlay = function () {
    var obj = this;
    obj.autoPlayId = setInterval(function () {
        if (!obj.crossFadingProcess) {
            obj.next();
        }
    }, obj.settings.autoPlaySpeed);
}


/**
* Stop the player
*/
Player.prototype.stop = function () {
    $(".btn-pause").removeClass("btn-pause").addClass("btn-play");
    clearInterval(this.id);
    clearInterval(this.autoPlayId);
    this.autoPlayId = undefined;
    this.isAnimated = false;
}

/**
* Reset the player
*/
Player.prototype.reset = function () {
    var obj = this;
    obj.stop();
    obj.play();
}


/**
* Print the image in the canvas
*/
Player.prototype.render = function (image) {

    if (this.settings.canvas) {
        //var wratio = $(".livePixel").height() / image.height;
        //Apart for the drawImage that render in a canvas, all the calculus are made to view landscape pictures as well as portrait
        //this.context.drawImage(image, ($(".livePixel").width() - (image.width * wratio)) / 2 , 0, image.width * wratio, $(".livePixel").height());
        var canvas = document.getElementById('canvas');
        var x, y, width, height;
        // Vertical image
        if(image.height / image.width > 1) {
            height = canvas.height;
            width = image.width * height / image.height;
            x = (canvas.width - width) / 2;
            y = 0;
        }
        // Horizontal image
        else {
            width = canvas.width;
            height = image.height * width / image.width;
            x = 0;
            y = (canvas.height - height) / 2;
        }
        this.context.drawImage(image, x, y, width, height);
    } else {
        document.getElementById("canvas").src = image.src;
    }

    if ($(".infoBox").css("display") != "none") {
        this.fillInfoBox();
    }

    if (this.settings.editionPack) {
        this.record();
    }
}



/**
* Next Image Set
*/
Player.prototype.next = function () {

    if (this.settings.shuffle) {
        this.dataArray.random();
    }

    if (this.isAnimated) {
        clearInterval(this.id);
        if (this.settings.crossFade) {
            this.crossFader("next");
        } else {
            this.load(this.dataArray.next());
            this.context.clearRect(0, 0, screen.width, screen.height);
            this.play();
        }
    } else {
        this.load(this.dataArray.next());
        this.render(this.imageSet.next());
    }
}



/**
* Previous Image Set
*/
Player.prototype.previous = function () {

    if (this.settings.shuffle) {
        this.dataArray.random();
    }

    if (this.isAnimated) {
        clearInterval(this.id);
        if (this.settings.crossFade) {
            this.crossFader();
        } else {
            this.load(this.dataArray.previous("previous"));
            this.context.clearRect(0, 0, screen.width, screen.height);
            this.play();
        }
    } else {
        this.load(this.dataArray.previous());
        this.render(this.imageSet.previous());
    }
}


/**
* Apply a crossfade effect at image transition
*/
Player.prototype.crossFader = function (event) {
    if (!this.crossFadingProcess) {

        var obj = this;// Obj refers to the player itself such as "this"
        obj.crossFadingProcess = true;
        var alpha = 0.00;
        var alphaPrev = 1;

        if (event == "next") {
            var imgSetNext = new ImageSet(obj.dataArray.next());
        } else {
            var imgSetNext = new ImageSet(obj.dataArray.previous());
        }

        obj.context.globalCompositeOperation = "source-over";

        var id = setInterval(function () {
            if (alpha < 1.00) {
                obj.context.globalAlpha = alphaPrev; //Opacity 100%
                obj.render(obj.imageSet.next());
                obj.context.globalAlpha = alpha; //Opacity reduction
                obj.render(imgSetNext.next());

                //Opacity update change these value for faster or slower crossFade ---> both should be the same for coerent result...
                alpha += 0.04;
                alphaPrev -= 0.04;

            } else {
                clearInterval(id);
                obj.context.globalAlpha = 1;
                obj.imageSet = imgSetNext;
                obj.infoDisplay();
                obj.play();
                obj.crossFadingProcess = false;
            }
        }, 100);
    }
}
