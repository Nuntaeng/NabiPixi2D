var NabiMath  = function(){


    function Box2D () {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;


        this.isCollide = fucntion(other) {
            return this.x + this.width > other.x &&
                this.x < other.x + other.width &&
                this.y + this.height > other.y &&
                this.y < other.y + other.height;
        }
    }
}