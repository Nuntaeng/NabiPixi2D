class NabiPoint {

    constructor (x, y) {
        this.x = x;
        this.y = y;
    }
}

function NabiBox2D(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.isCollide = function(other) {
        return this.x + this.w > other.x &&
            this.x < other.x + other.w &&
            this.y + this.h > other.y &&
            this.y < other.y + other.h;
    }

    this.isCircleCollide = function(pos, rad) {
        var dots = new Array();
        dots.push(new NabiPoint(x, y));
        dots.push(new NabiPoint(x + w, y));
        dots.push(new NabiPoint(x, y + h));
        dots.push(new NabiPoint(x + w, y + h));

        for (var i in dots) {
            if (Math.sqrt(Math.pow(pos.x - dots[i].x, 2) + Math.pow(pos.y - dots[i].y, 2)) < rad)
                return true;
        }

        return false;
    }
}