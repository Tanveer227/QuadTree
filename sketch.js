import {QuadTree, Point, Rectangle} from './QuadTreee.js';

let canv = document.querySelector("#imageSpace");
let cnt = canv.getContext("2d");
let isDrawing = false;

canv.width = 500;
canv.height = 500;

let rect = new Rectangle(canv.width/2, canv.height/2, canv.width, canv.height);

let qtree = new QuadTree(rect, 4);

let cntData = cnt.getImageData(0, 0, canv.width, canv.height);
let range = new Rectangle(250, 250, 100, 100);

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    console.log(rect);
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return {x, y};
}

function drawPixel (x, y, r, g, b, a) {
    let index = (x + y * canv.width) * 4;
    //console.log(r, g, b, a);
    cntData.data[index + 0] = Number(r);
    cntData.data[index + 1] = Number(g);
    cntData.data[index + 2] = Number(b);
    cntData.data[index + 3] = Number(a);
}

function draw_rectangle(rectangle, color) {
    cnt.beginPath();
    cnt.strokeStyle = color;
    cnt.rect(rectangle.x - rectangle.w/2, rectangle.y - rectangle.h/2, rectangle.w, rectangle.h);
    cnt.stroke();
}
function draw_qtree(q) {
    if(!q) return;
    draw_rectangle(q.rect, "black")

    if(q.divided) {
        draw_qtree(q.ne);
        draw_qtree(q.nw);
        draw_qtree(q.se);
        draw_qtree(q.sw);
    }
    
    return;
}
function drawPoint(e) {
    console.log("draw")
    let pt = new Point(getMousePosition(canv, e).x, getMousePosition(canv, e).y)
    qtree.insert(pt);
    console.log(qtree);
    for(let i=0;i<3;i++) {
        for(let j=0;j<3;j++){
            drawPixel (i+pt.x, j+pt.y, 0, 0, 0, 55);
        }
    }
    cnt.putImageData(cntData, 0, 0);
    draw_qtree(qtree)
    draw_rectangle(range, "red")
    let found = []
    qtree.query(range, found)

    for(let pt of found) {
        for(let i=0;i<3;i++) {
            for(let j=0;j<3;j++){
                drawPixel (i+pt.x, j+pt.y, 0, 255, 0, 255);
            }
        }
    }
    console.log(found)
}

canv.addEventListener("mousedown", function(e) {
    isDrawing = true;
    drawPoint(e);
});

canv.addEventListener("mousemove", function(e) {
    if (!isDrawing) return;
    drawPoint(e);
});

canv.addEventListener("mouseup", function(e) {
    isDrawing = false;
});
draw_rectangle(range, "red")


// console.log(range)