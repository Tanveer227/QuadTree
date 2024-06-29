export class Point{
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

export class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        if(point.x <= this.x+this.w && 
            point.x>=this.x-this.w && 
            point.y>=this.y-this.h && 
            point.y<=this.y+this.w) return true;

        return false;
    }
}

export class QuadTree {
    constructor(rect, cap) {
        this.rect = rect;
        this.cap = cap;
        this.points = [];
        this.divided = false;
    }

    subdivide() {

        let x = this.rect.x
        let y = this.rect.y
        let h = this.rect.h
        let w = this.rect.w

        let ne = new Rectangle(x + (w/4), y - (h/4), w/2, h/2);
        let se = new Rectangle(x + (w/4), y + (h/4), w/2, h/2);
        let sw = new Rectangle(x - (w/4), y + (h/4), w/2, h/2);
        let nw = new Rectangle(x - (w/4), y - (h/4), w/2, h/2);

        this.ne = new QuadTree(ne, this.cap);
        this.se = new QuadTree(se, this.cap);
        this.sw = new QuadTree(sw, this.cap);
        this.nw = new QuadTree(nw, this.cap);
    }

    insert(point) {
        if(!this.rect.contains(point)) return;
        if(this.points.length<this.cap) this.points.push(point);
        else {
            if(!this.divided) {
                this.subdivide();
                this.divided = true;
            }
            this.ne.insert(point);
            this.se.insert(point);
            this.sw.insert(point);
            this.nw.insert(point);
        }
    }
}