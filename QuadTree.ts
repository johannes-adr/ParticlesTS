const MAX_LEVEL = 20;

enum QuadNode{
    NORTH_LEFT =0,
    NORTH_RIGHT = 1,
    SOUTH_LEFT = 2,
    SOUTH_RIGHT = 3
}
interface QuadElement {
    x: number;
    y: number;
    w: number;
    h: number;
}

class QuadTree{
    maxObj: number;
    x: number;
    y: number;
    w: number;
    h: number;
    lv: number;
    elements: QuadElement[] = [];

    hasSubnode = false;
    subNodes: QuadTree[] = [];
    constructor(maxObj: number, x: number, y: number, w: number, h: number, lv: number) {
        this.maxObj = maxObj;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.lv = lv;
    }
    public insert(e: QuadElement) {
        if(this.hasSubnode){
            this.insertInSubNode(e);
            return;
        }
        if(this.elements.length < this.maxObj || this.lv >= MAX_LEVEL){
            this.elements.push(e);
        }else{
            this.hasSubnode = true;
            this.genSubnodeAndfill();
            this.insertInSubNode(e);
            this.elements.forEach(le=>{
                this.insertInSubNode(le);
            });
            this.elements = [];
        }
    }
    private genSubnodeAndfill() {
        let northLeft = new QuadTree(this.maxObj, this.x, this.y, this.w / 2, this.h / 2, this.lv+1);
        let northRight = new QuadTree(this.maxObj, this.x + this.w / 2, this.y, this.w / 2, this.h / 2, this.lv+1);
        let southLeft = new QuadTree(this.maxObj, this.x, this.y + this.h / 2, this.w / 2, this.h / 2, this.lv+1);
        let southRight = new QuadTree(this.maxObj, this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2, this.lv+1);
        this.subNodes[QuadNode.NORTH_LEFT] = northLeft;
        this.subNodes[QuadNode.NORTH_RIGHT] = northRight;
        this.subNodes[QuadNode.SOUTH_LEFT] = southLeft;
        this.subNodes[QuadNode.SOUTH_RIGHT] = southRight;
    }

    private insertInSubNode(e: QuadElement) {
        this.subNodes[this.getElementSection(e)].insert(e);
    }

    private getElementSection(e: QuadElement): QuadNode {
        if (e.x < this.x + this.w / 2) {
            if (e.y < this.y + this.h / 2) {
                return QuadNode.NORTH_LEFT;
            } else {
                return QuadNode.SOUTH_LEFT;
            }
        } else {
            if (e.y < this.y + this.h / 2) {
                return QuadNode.NORTH_RIGHT;
            } else {
                return QuadNode.SOUTH_RIGHT;
            }
        }
    }
    public getElementsAtLocation(x: number, y: number, w: number, h: number): QuadElement[] {
        let elements: QuadElement[] = [];

        this.addElementfromSubLocation(x-w/2,y-w/2,w,h, elements);
        return elements;
    }

    private addElementfromSubLocation(x: number, y: number, w: number, h: number, es: QuadElement[]) {
        if(this.intersecting(x,y,w,h)){
            if(!this.hasSubnode){
                es.push.apply(es,this.elements);

            }else{
                this.subNodes.forEach(s=>{
                    s.addElementfromSubLocation(x,y,w,h,es);
                });
            }
        }else{
        }
    }

    private intersecting(x: number, y: number, w: number, h: number) {
        return(this.x < x + w &&
            this.x + this.w > x &&
            this.y < y + h &&
            this.y + this.h > y);
    }

    public paint(g: CanvasRenderingContext2D) {
        g.lineWidth = 1 / this.lv;
        g.strokeRect(this.x, this.y, this.w, this.h);
        if(this.hasSubnode){
            this.subNodes.forEach(s=>{
               s.paint(g);
            });
        }
    }
}



function buildQuadtree(elements: QuadElement[], maxObj: number, w: number, h: number): QuadTree {
    let root = new QuadTree(maxObj,0,0,w,h,0);
    elements.forEach(e=>{root.insert(e)});
    return root;
}