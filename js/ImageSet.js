/**
* ImageSet constructor
*/
function ImageSet(data, options) {

    //Public Settings
    this.settings = {
        stopMotion: false,
        totalCamera: 24,
        trim: false,
        trimSize: 24,
        loop: true
    }

        if (options) { $.extend(this.settings, options) } //Over

        this.data = data;
        this.listImage = new NodeList();
        this.trimIncr = 0;
        this.status = 0;

        this.preloadImages(); //Load images in the listImage Array at the creation
}


/**
* Load ImageSet in the player
*/
ImageSet.prototype.preloadImages = function () {
    //Load all the images in the array as image $thisect 
    for (var i = 0; i < this.data.fileName.length; i++) {
        var img = new Image();
        img.src = this.data.folderName + "\\" + this.data.fileName[i];
        img.fileName = this.data.fileName[i];
        img.folderName = this.data.folderName[i];
        this.listImage.push(img);
    }


    function statusUpdate($this) {
        if ($this.status != 100) {
            for (var i = 0; i < $this.listImage.length; i++) {
                if ($this.listImage[i] == undefined || $this.listImage[i].complete) {
                    var percent = Math.round(i / ($this.listImage.length-1) * 100);
                    if (percent > $this.status) {
                        $this.status = percent;
                    }
                }
            }
            setTimeout(function () {
                statusUpdate($this);
            }, 50);
        } 
    }

    statusUpdate(this);

}



/**
* Pick the current image of an image Set
*/
ImageSet.prototype.getElement = function () {
    return this.listImage.getElement();
}

/**
* Pick the current image of an image Set
*/
ImageSet.prototype.getElementAt = function (position) {
    return this.listImage.getElementAt(position);
}

/**
* Pick the next image of an image Set
*/
ImageSet.prototype.next = function () {
    if (this.settings.stopMotion) {
        if (this.settings.trim) {
            this.trimNext();
        } else {
            this.stopMotionNext();
        }

    } else {
        if (this.listImage.isLast() && !this.settings.loop) {
            this.listImage.reverse();
        }
        this.listImage.next();
    }

    return this.listImage.getElement();
}


/**
* Pick the previous image of an image Set
*/
ImageSet.prototype.previous = function () {

    if (this.settings.stopMotion) {
        if (this.settings.trim) {
            this.trimPrevious();
        } else {
            this.stopMotionPrevious();
        }

    } else {
        if (this.listImage.isFirst() && !this.settings.loop) {
            this.listImage.reverse();
        }
        this.listImage.previous();
    }

    return this.listImage.getElement();
}



/**
* Increment to next camera
*/
ImageSet.prototype.nextCamera = function () {

    if (this.listImage.cursor % this.settings.totalCamera == 23) {
        this.listImage.cursor -= this.settings.totalCamera;
    }

    this.listImage.cursor++;

    return this.listImage.getElement();
}



/**
*  Increment to previous camera
*/
ImageSet.prototype.previousCamera = function () {

    if (this.listImage.cursor % this.settings.totalCamera == 0) {
        this.listImage.cursor += this.settings.totalCamera;
    }

    this.listImage.cursor--;

    return this.listImage.getElement();
}



/**
* Increment to next series
*/
ImageSet.prototype.nextSeries = function () {

    if (this.settings.stopMotion) {
        if ((this.up && (this.listImage.cursor + this.settings.totalCamera > this.listImage.length)) || (!this.up && (this.listImage.cursor - this.settings.totalCamera < 0))) {
            this.up = !this.up;
        }

        if (this.up) {
            this.listImage.cursor += this.settings.totalCamera;

        } else if (!this.up) {
            this.listImage.cursor -= this.settings.totalCamera;
        }
    }
    return this.listImage.getElement();
}


/**
* Increment to previous series 
*/
ImageSet.prototype.previousSeries = function () {
    if (this.settings.stopMotion) {
        if ((!this.up && (this.listImage.cursor + this.settings.totalCamera > this.listImage.length)) || (this.up && (this.listImage.cursor - this.settings.totalCamera < 0))) {
            this.up = !this.up;
        }

        if (this.up) {
            this.listImage.cursor -= this.settings.totalCamera;

        } else if (!this.up) {
            this.listImage.cursor += this.settings.totalCamera;
        }
    }
    return this.listImage.getElement();
}



/**
* Set the next cursor position when we are in stopMotion
*/
ImageSet.prototype.stopMotionNext = function () {

    this.nextSeries();
    this.nextCamera();

    return this.listImage.getElement();
}


/**
* Set the previous cursor position when we are in stopMotion
*/
ImageSet.prototype.stopMotionPrevious = function () {

    this.previousSeries();
    this.previousCamera();

    return this.listImage.getElement();
}


/**
* Static motion next for web format
*/
ImageSet.prototype.trimNext = function () {

    if (this.trimIncr == this.settings.trimSize) {
        this.webUp = !this.webUp;
        this.trimIncr = 0;
    }

    if (this.webUp) {
        this.stopMotionNext();

    } else {
        this.nextCamera();
        this.previousSeries();
    }

    this.trimIncr++;

    return this.listImage.getElement();
}


/**
* Static motion next for web format
*/
ImageSet.prototype.trimPrevious = function () {

    if (this.trimIncr == 0) {
        this.webUp = !this.webUp;
    }

    if (this.webUp) {
        this.stopMotionPrevious();

    } else {
        this.previousCamera();
        this.nextSeries();
    }

    this.trimIncr--;

    return this.listImage.getElement();
}
