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
        if(point.x <= this.x+this.w/2 && 
            point.x>=this.x-this.w/2 && 
            point.y>=this.y-this.h/2 && 
            point.y<=this.y+this.w/2) return true;

        return false;
    }

    intersects(range) {
            return !(range.x - range.w/2 > this.x + this.w/2 ||
                range.x + range.w/2 < this.x - this.w/2 ||
                range.y + range.h/2 < this.y - this.w/2 ||
                range.y - range.h/2 > this.y + this.w/2
            );
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
        console.log(this.points)
        if(point in this.points) {
            console.log("p")
            return;
        }
        if(this.points.length<this.cap) {
            this.points.push(point);
            // console.log("inserted")
        }
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

    query(range, found) {
        let count = 0;
        if(!this.rect.intersects(range)) {
            return found;
        }

        for(let p of this.points) {
            if(range.contains(p)) {
                found.push(p);
            }
        }
        if(this.divided) {
            this.nw.query(range, found);
            this.ne.query(range, found);
            this.sw.query(range, found);
            this.se.query(range, found);
        }
        return;
    }
}