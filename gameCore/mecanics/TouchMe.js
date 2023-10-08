import { Formula } from "./Formula.js";
class TouchMe {
  order = 0;
  _touchZone;
  _touch;
  _unity = "px";
  _moves;
  _controlsM;
  _stringCss;
  _Formula = null;
  constructor(controlsM = false) {
    this._stringCss =
      ":root{--DirectionThumbWidth:70px;}_direction{position:absolute;width:var(--DirectionThumbWidth);height:var(--DirectionThumbWidth);top:calc(100%-(var(--DirectionThumbWidth)*2));left:calc((var(--DirectionThumbWidth)));background-color:rgba(54,59,26,0.473);border-radius:50%;}_direction_thumb{position:absolute;background-color:rgba(0,0,255,0.644);top:15%;left:15%;width:70%;height:70%;border-radius:50%;}_direction_thumb:hover{background-color:rgba(0,255,34,0.644);/*top:7.5%;left:7.5%;width:85%;height:85%;*/}";
    this._Formula = new Formula();
    this._controlsM = controlsM;
    this.thetaDeg = 0;
    this._init();
    this.addCss(this._stringCss, "touchme");
    this._addToDom();
  }
  get_Directions = (x, y) => {
    return this._moves;
  };
  _init_Directions() {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;
  }
  _setMoves = (x, y) => {
    this.forward = y < this._touch.initPos.top ? true : false;
    this.reverse = y > this._touch.initPos.top ? true : false;

    this.right = x > this._touch.initPos.left ? true : false;
    this.left = x < this._touch.initPos.left ? true : false;

    this.thetaDeg = this._Formula.get_DegreeWithTwoPos(
      this._touch.initPos.left,
      this._touch.initPos.top,
      x,
      y
    );
    this._refreshPlayerMoves();
    this._moves = {
      forward: this.forward,
      right: this.right,
      reverse: this.reverse,
      left: this.left,
    };
    // console.log(x, y, this._touch.initPos.left, this._touch.initPos.top, this.thetaDeg);
    // console.log(this._moves);
  };
  _init = () => {
    this._init_Directions();
    this._touchZone = {
      div: document.createElement("div"),
      initPos: { x: 40, y: 40 },
      size: { x: 80, y: 80 },
      id: "direction",
      position: "absolute",
      borderRadius: "50%",
      bgColor: "rgba(0,0,255,.3)",
    };
    this._touch = {
      div: document.createElement("div"),
      initPos: { x: 0, y: 0 },
      size: { x: 50, y: 50 },
      id: "thumb",
      position: "absolute",
      borderRadius: "50%",
      bgColor: "rgba(0,255,255,.5)",
    };
    this._touch.initPos.x =
      this._touchZone.initPos.x +
      this._touchZone.size.x / 2 -
      this._touch.size.x / 2;
    this._touch.initPos.y = this._touchZone.size.y - this._touch.size.y / 2;
    this._touch.initPos.top =
      window.innerHeight - this._touchZone.size.y - this._touch.size.y / 2;
    this._touch.initPos.left =
      this._touchZone.initPos.x +
      this._touchZone.size.x / 2 -
      this._touch.size.x / 2;
  };
  _addToDom = (x, y) => {
    this._setAndAddDiv(this._touchZone);
    this._setAndAddDiv(this._touch);
    document.onpointerdown = this._downHandler;
  };
  _setAndAddDiv(elem) {
    elem.div.id = elem.id;
    elem.div.style.bottom = this._addPX(elem.initPos.y);
    elem.div.style.left = this._addPX(elem.initPos.x);
    elem.div.className = elem.id;
    elem.div.style.width = this._addPX(elem.size.x);
    elem.div.style.height = this._addPX(elem.size.y);
    elem.div.style.position = elem.position;
    elem.div.style.borderRadius = elem.borderRadius;
    elem.div.style.backgroundColor = elem.bgColor;
    document.body.appendChild(elem.div);
  }
  //--
  _addPX(thing) {
    return typeof thing === "string" ? thing : thing + this._unity;
  }
  _downHandler = (eve) => {
    this._touch.div.setPointerCapture(eve.pointerId);
    document.addEventListener("touchstart", (eve) => {
      this._touch.div.style.backgroundColor = "rgba(255,255,0,.2)";
      if (this._controlsM) this._refreshPlayerMoves();
    });
    document.addEventListener("touchend", (eve) => {
      this._settouchPos();
      this._init_Directions();
      if (this._controlsM) this._refreshPlayerMoves();
    });
    document.addEventListener("touchcancel", (eve) => {
      this._settouchPos();
      this._init_Directions();
      if (this._controlsM) this._refreshPlayerMoves();
    });
    document.addEventListener("touchmove", (eve) => {
      this._touch.div.style.left =
        eve.changedTouches[0].clientX - this._touch.size.x / 2 + "px";
      this._touch.div.style.top =
        eve.changedTouches[0].clientY - this._touch.size.y / 2 + "px";
      this._setMoves(
        eve.changedTouches[0].clientX,
        eve.changedTouches[0].clientY
      );
    });
  };
  _settouchPos() {
    this._touch.div.style.top = "";
    this._touch.div.style.left = this._addPX(this._touch.initPos.x);
    this._touch.div.style.bottom = this._addPX(this._touch.initPos.y);
    this._touch.div.style.backgroundColor = this._touch.bgColor;
  }
  _refreshPlayerMoves() {
    if (this._controlsM) {
      this._controlsM.forward = this.forward;
      this._controlsM.left = this.left;
      this._controlsM.right = this.right;
      this._controlsM.reverse = this.reverse;
      this._controlsM.thetaDeg = this.thetaDeg;
    }
  }
  addCss(stringcss, styleid) {
    let style = document.createElement("style");
    style.textContent = stringcss;
    style.id = styleid;
    document.getElementsByTagName("head")[0].appendChild(style);
  }
}
export { TouchMe };
