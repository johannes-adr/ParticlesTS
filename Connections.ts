const canvas = document.getElementById("connections")!;
//@ts-ignore
canvas.width = window.innerWidth;
//@ts-ignore
canvas.height = window.innerHeight;
//@ts-ignore
const g: CanvasRenderingContext2D = canvas.getContext("2d");
var w = canvas.clientWidth;
var h = canvas.clientHeight;
const mousew = 100, defaultSpeed = 0.3;
const color = canvas.getAttribute("color");

function loadSize() {
    //@ts-ignore
    canvas.width = window.innerWidth;
    //@ts-ignore
    canvas.height = window.innerHeight;
    w = canvas.clientWidth;
    h = canvas.clientHeight;

}

var particles: Particle[] = [];
var mx = 0, my = 0;

class Particle implements QuadElement{
    h: number;
    w: number;
    x: number;
    y: number;
    dir: number;
    speed: number = getRandomNumber(1)+0.1;
    constructor( x: number, y: number, dir: number, size: number) {
        this.x = x;
        this.y = y;
        this.w = size/2;
        this.h = size/2;
        this.dir = dir;
    }
}


window.addEventListener("scroll", (e)=>{
        particles.forEach(p=>{
            p.y = p.y+2;
        });
});
document.onmousemove = (e)=>{
    mx = e.clientX;
    my = e.clientY;
    //my+=document.documentElement.scrollTop;
}
document.onclick = ()=>{
    particles.push(new Particle(mx +(getRandomNumber(1)>0?5:-5),my,getRandomNumber(Math.PI),getRandomNumber(4)+1));
}


for(let i = 0; i<150; i++) {
    particles.push(new Particle(getRandomNumber(w),getRandomNumber(h),getRandomNumber(Math.PI),getRandomNumber(4)+1));
}


function tick() {
    render();
    update();
}

function update() {
    particles.forEach(e=>{
        if(e.x < 0)e.x = w; else if(e.x > w)e.x = 0;
        if(e.y < 0)e.y = h; else if(e.y > h)e.y = 0;
        //e.speed = 20 * (1/distanceOf2Points(e.x,e.y,mx,my)*10);
        //if(e.speed < 0.2)e.speed = getRandomNumber(2)+0.1;

        e.x = (e.x+ Math.cos(e.dir)*e.speed);
        e.y = (e.y+ Math.sin(e.dir)*e.speed);
    });
}


function render() {
    loadSize();

    if(color != null){
        g.fillStyle = color;
        g.strokeStyle = color;
    }
    g.clearRect(0,0,w,h);
    particles.forEach(e=>{
        g.beginPath();
        g.arc(e.x,e.y,e.w,0,2*Math.PI);
        g.fill();
    });
    let quadTree = buildQuadtree(particles, 5, w, h);
    quadTree.getElementsAtLocation(mx, my, 200, 200).forEach(e=>{
        let p = e as Particle;
        let a = getAngleFromTwoPoints(e.x, e.y,mx, my);

        p.dir = a;
        p.speed = 10*(1/distanceOf2Points(e.x,e.y,mx,my)*10);
        if(p.speed < 0.2)p.speed = getRandomNumber(2)+0.1;
        if(p.speed > 10)p.speed = 10;


    });
    let calculations = 0;
    particles.forEach(p=>{
        quadTree.getElementsAtLocation(p.x,p.y, 50, 50).forEach(e=>{
            calculations++;
            let distOf2Points = distanceOf2Points(p.x,p.y,e.x,e.y);
            if(distOf2Points > 10){
                g.lineWidth = 10 / distOf2Points;
            }

            if(distOf2Points< 120){
                g.beginPath();
                g.moveTo(p.x, p.y);
                g.lineTo(e.x, e.y);
                g.stroke();
            }
        });
    });
   //console.log(calculations);
   //quadTree.paint(g);
}
setInterval(tick, 1000/60);

