"use strict";
const MAX_LEVEL = 20;
var QuadNode;
(function (QuadNode) {
    QuadNode[QuadNode["NORTH_LEFT"] = 0] = "NORTH_LEFT";
    QuadNode[QuadNode["NORTH_RIGHT"] = 1] = "NORTH_RIGHT";
    QuadNode[QuadNode["SOUTH_LEFT"] = 2] = "SOUTH_LEFT";
    QuadNode[QuadNode["SOUTH_RIGHT"] = 3] = "SOUTH_RIGHT";
})(QuadNode || (QuadNode = {}));
class QuadTree {
    constructor(maxObj, x, y, w, h, lv) {
        this.elements = [];
        this.hasSubnode = false;
        this.subNodes = [];
        this.maxObj = maxObj;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.lv = lv;
    }
    insert(e) {
        if (this.hasSubnode) {
            this.insertInSubNode(e);
            return;
        }
        if (this.elements.length < this.maxObj || this.lv >= MAX_LEVEL) {
            this.elements.push(e);
        }
        else {
            this.hasSubnode = true;
            this.genSubnodeAndfill();
            this.insertInSubNode(e);
            this.elements.forEach(le => {
                this.insertInSubNode(le);
            });
            this.elements = [];
        }
    }
    genSubnodeAndfill() {
        let northLeft = new QuadTree(this.maxObj, this.x, this.y, this.w / 2, this.h / 2, this.lv + 1);
        let northRight = new QuadTree(this.maxObj, this.x + this.w / 2, this.y, this.w / 2, this.h / 2, this.lv + 1);
        let southLeft = new QuadTree(this.maxObj, this.x, this.y + this.h / 2, this.w / 2, this.h / 2, this.lv + 1);
        let southRight = new QuadTree(this.maxObj, this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2, this.lv + 1);
        this.subNodes[QuadNode.NORTH_LEFT] = northLeft;
        this.subNodes[QuadNode.NORTH_RIGHT] = northRight;
        this.subNodes[QuadNode.SOUTH_LEFT] = southLeft;
        this.subNodes[QuadNode.SOUTH_RIGHT] = southRight;
    }
    insertInSubNode(e) {
        this.subNodes[this.getElementSection(e)].insert(e);
    }
    getElementSection(e) {
        if (e.x < this.x + this.w / 2) {
            if (e.y < this.y + this.h / 2) {
                return QuadNode.NORTH_LEFT;
            }
            else {
                return QuadNode.SOUTH_LEFT;
            }
        }
        else {
            if (e.y < this.y + this.h / 2) {
                return QuadNode.NORTH_RIGHT;
            }
            else {
                return QuadNode.SOUTH_RIGHT;
            }
        }
    }
    getElementsAtLocation(x, y, w, h) {
        let elements = [];
        this.addElementfromSubLocation(x - w / 2, y - w / 2, w, h, elements);
        return elements;
    }
    addElementfromSubLocation(x, y, w, h, es) {
        if (this.intersecting(x, y, w, h)) {
            if (!this.hasSubnode) {
                es.push.apply(es, this.elements);
            }
            else {
                this.subNodes.forEach(s => {
                    s.addElementfromSubLocation(x, y, w, h, es);
                });
            }
        }
        else {
        }
    }
    intersecting(x, y, w, h) {
        return (this.x < x + w &&
            this.x + this.w > x &&
            this.y < y + h &&
            this.y + this.h > y);
    }
    paint(g) {
        g.lineWidth = 1 / this.lv;
        g.strokeRect(this.x, this.y, this.w, this.h);
        if (this.hasSubnode) {
            this.subNodes.forEach(s => {
                s.paint(g);
            });
        }
    }
}
function buildQuadtree(elements, maxObj, w, h) {
    let root = new QuadTree(maxObj, 0, 0, w, h, 0);
    elements.forEach(e => { root.insert(e); });
    return root;
}
