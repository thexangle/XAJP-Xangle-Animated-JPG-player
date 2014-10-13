function NodeList() {
    array = new Array;
    array.NodeList();
    return array;
}


Array.prototype.NodeList = function () {
        this.cursor = 0;
        this.prevCursor = 0;
}

Array.prototype.setPosition = function (position) {
    this.prevCursor = this.cursor;
    var ok = false;
    if ( position >= 0 && position <= this.length ) {
        this.cursor = position;
        ok = true;
    }
    return ok;
}


Array.prototype.next = function () {
    this.prevCursor = this.cursor;
    if (!this.isLast()) {
        this.cursor++;
    } else {
        this.cursor = 0;
    }
    return this.getElement();
}



Array.prototype.previous = function () {
    this.prevCursor = this.cursor;
    if (!this.isFirst()) {
        this.cursor--;
    } else {
        this.cursor = this.length - 1;
    }
    return this.getElement();
}



Array.prototype.clear = function () {
    while (this.length > 0) {
        this.pop();
    }
    return this;
}

Array.prototype.random = function () {
    this.prevCursor = this.cursor;
    this.cursor = Math.floor(Math.random() * this.length - 1);
    return this.cursor;
}

Array.prototype.isFirst = function () {
    return this.cursor == 0;
}

Array.prototype.isLast = function () {
    return this.cursor == this.length - 1;
}

Array.prototype.getPosition = function () {
    return this.cursor;
}

Array.prototype.getPreviousPostition = function () {
    return this.prevCursor;
}

Array.prototype.getElement = function () {
    return this[this.cursor];
}

Array.prototype.update = function (data) {
    this.empty();
    for (var i = 0; i < data.length; i++) {
        this.push(data[i]);
    }
}

Array.prototype.getElementAt = function (position) {
    return this[position];
}



   



