var H5P = H5P || {};

/**
 * Shape module
 *
 * @param {jQuery} $
 */
H5P.Shape = (function ($) {
  /**
   * Initialize module.
   *
   * @param {Object} params Behavior settings
   * @param {Number} id Content identification
   * @returns {C} self
   */
  function C(params, id) {
    H5P.EventDispatcher.call(this);
    this.params = $.extend(true, {
      type: 'rectangle',
      shape: {
        fillColor: '#ccc',
        borderWidth: 0,
        borderStyle: 'solid',
        borderColor: '#000',
        borderRadius: 0
      }
    }, params);
    this.contentId = id;
  }

  C.prototype = Object.create(H5P.EventDispatcher.prototype);
  C.prototype.constructor = C;

  /**
   * Attach h5p inside the given container.
   *
   * @param {jQuery} $container
   */
  C.prototype.attach = function ($container) {
    this.$inner = $container.addClass('h5p-shape');
    this.$shape = $('<div class="h5p-shape-element h5p-shape-' + this.params.type + '"></div>');
    this.styleShape();
    this.$shape.appendTo(this.$inner);
  };

  /**
   * Is this a line?
   * @return {boolean}
   */
  C.prototype.isLine = function () {
    return this.params.type === 'vertical-line' ||
           this.params.type === 'horizontal-line';
  };

  /**
   * Style the shape
   */
  C.prototype.styleShape = function () {
    var props = this.isLine() ? this.params.line : this.params.shape;
    var borderWidth = (props.borderWidth * 0.0835) + 'em';
    var css = {
      'border-color': props.borderColor
    };

    if (this.params.type == "vertical-line") {
      css['border-left-width'] = borderWidth;
      css['border-left-style'] = props.borderStyle;
      this.trigger('set-size', {width: borderWidth, maxWidth: borderWidth});
    }
    else if (this.params.type == "horizontal-line") {
      css['border-top-width'] = borderWidth;
      css['border-top-style'] = props.borderStyle;
      this.trigger('set-size', {height: borderWidth, maxHeight: borderWidth});
    }
    else {
      css['background-color'] = props.fillColor;
      css['border-width'] = borderWidth;
      css['border-style'] = props.borderStyle;
    }

    if (this.params.type == "rectangle") {
      css['border-radius'] = props.borderRadius * 0.25 + 'em';
    }

    this.$shape.css(css);
  };

  return C;
})(H5P.jQuery);
;
var H5P = H5P || {};

/**
 * Constructor.
 *
 * @param {Object} params Options for this library.
 * @param {Number} id Content identifier
 * @returns {undefined}
 */
(function ($) {
  H5P.Image = function (params, id, extras) {
    H5P.EventDispatcher.call(this);
    this.extras = extras;

    if (params.file === undefined || !(params.file instanceof Object)) {
      this.placeholder = true;
    }
    else {
      this.source = H5P.getPath(params.file.path, id);
      this.width = params.file.width;
      this.height = params.file.height;
    }

    this.alt = params.alt !== undefined ? params.alt : 'New image';

    if (params.title !== undefined) {
      this.title = params.title;
    }
  };

  H5P.Image.prototype = Object.create(H5P.EventDispatcher.prototype);
  H5P.Image.prototype.constructor = H5P.Image;

  /**
   * Wipe out the content of the wrapper and put our HTML in it.
   *
   * @param {jQuery} $wrapper
   * @returns {undefined}
   */
  H5P.Image.prototype.attach = function ($wrapper) {
    var self = this;
    var source = this.source;

    if (self.$img === undefined) {
      if(self.placeholder) {
        self.$img = $('<div>', {
          width: '100%',
          height: '100%',
          class: 'h5p-placeholder',
          title: this.title === undefined ? '' : this.title,
          on: {
            load: function () {
              self.trigger('loaded');
            }
          }
        });
      } else {
        self.$img = $('<img>', {
          width: '100%',
          height: '100%',
          src: source,
          alt: this.alt,
          title: this.title === undefined ? '' : this.title,
          on: {
            load: function () {
              self.trigger('loaded');
            }
          }
        });
      }
    }

    $wrapper.addClass('h5p-image').html(self.$img);
  };

  return H5P.Image;
}(H5P.jQuery));
;
!function(){"use strict";var t={};function e(t){return function(t){if(Array.isArray(t))return i(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return i(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return i(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,n=new Array(e);i<e;i++)n[i]=t[i];return n}function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}t.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),function(){var e;t.g.importScripts&&(e=t.g.location+"");var i=t.g.document;if(!e&&i&&(i.currentScript&&(e=i.currentScript.src),!e)){var n=i.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),t.p=e}();var s=function(){function t(){}return t.extend=function(){for(var t=1;t<arguments.length;t++)for(var e in arguments[t])Object.prototype.hasOwnProperty.call(arguments[t],e)&&("object"===n(arguments[0][e])&&"object"===n(arguments[t][e])?this.extend(arguments[0][e],arguments[t][e]):arguments[0][e]=arguments[t][e]);return arguments[0]},t.htmlDecode=function(t){return(new DOMParser).parseFromString(t,"text/html").documentElement.textContent},t.stripHTML=function(t){var e=document.createElement("div");return e.innerHTML=t,e.textContent||e.innerText||""},t.formatTime=function(t){var e=[],i=Math.floor(t/3600),n=Math.floor((t-3600*i)/60),s=t-3600*i-60*n;return i>0&&(i<10&&(i="0".concat(i)),e.push("".concat(i))),n<10&&(n="0".concat(n)),e.push("".concat(n)),s<10&&(s="0".concat(s)),e.push("".concat(s)),e.join(":")},t.toISO8601TimePeriod=function(t){if("number"!=typeof t||t<0)return null;var e=[],i=Math.floor(t/3600),n=Math.floor((t-3600*i)/60),s=t-3600*i-60*n;return i>0&&(i<10&&(i="0".concat(i)),e.push("".concat(i,"H"))),(n>0||0===n&&i>0)&&(n<10&&(n="0".concat(n)),e.push("".concat(n,"M"))),s<10&&(s="0".concat(s)),e.push("".concat(s,"S")),"PT".concat(e.join(""))},t.closestParent=function(t,e){if("object"!==n(t)||"string"!=typeof e)return null;if(!t.parentNode)return null;if("."===e.substr(0,1)){if(e.split(".").filter((function(t){return""!==t})).every((function(e){var i,n;return null===(i=t.parentNode)||void 0===i||null===(n=i.classList)||void 0===n?void 0:n.contains(e)})))return t.parentNode}else if("#"===e.substr(0,1)){if("function"==typeof t.parentNode.getAttribute&&t.parentNode.getAttribute("id")===e.substr(1))return t.parentNode}else if(t.parentNode.tagName.toLowerCase()===e.toLowerCase())return t.parentNode;return this.closestParent(t.parentNode,e)},t.shuffleArray=function(t){var i,n,s,a=e(t);for(s=a.length-1;s>0;s--)i=Math.floor(Math.random()*(s+1)),n=a[s],a[s]=a[i],a[i]=n;return a},t.getRelativePosition=function(t,e){if(null==t||!t.x||null==t||!t.y||"function"!=typeof(null==e?void 0:e.getBoundingClientRect))return null;var i=e.getBoundingClientRect();return{x:t.x/i.width,y:t.y/i.height}},t.getAbsolutePosition=function(t,e){if(null==t||!t.x||null==t||!t.y||"function"!=typeof(null==e?void 0:e.getBoundingClientRect))return null;var i=e.getBoundingClientRect();return{x:t.x*i.width,y:t.y*i.height}},t}(),a=s,o=function(){function t(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this.params=e,this.callbacks=a.extend({onPuzzleTileCreated:function(){},onPuzzleTileMoveStarted:function(){},onPuzzleTileMoved:function(){},onPuzzleTileMoveEnded:function(){},onHintClosed:function(){}},i),this.pathBorders={},this.moveInitialX=null,this.moveInitialY=null,this.deltaX=null,this.deltaY=null,this.isDone=!1,this.scale=1,this.backgroundImage=new Image,this.backgroundImage.addEventListener("load",(function(){t.handleImageLoaded()})),this.backgroundImage.crossOrigin=e.imageCrossOrigin,this.backgroundImage.src=e.imageSource,this.handleTileMoveStarted=this.handleTileMoveStarted.bind(this),this.handleTileMoved=this.handleTileMoved.bind(this),this.handleTileMoveEnded=this.handleTileMoveEnded.bind(this),this.handleAnimationMoveEnded=this.handleAnimationMoveEnded.bind(this),this.tile=document.createElement("div"),this.tile.classList.add("h5p-jigsaw-puzzle-tile"),this.setScale(this.scale)}var e=t.prototype;return e.getDOM=function(){return this.tile},e.getHTML=function(){return this.tile.outerHTML},e.buildSVG=function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=document.createElement("svg");i.setAttribute("width","100%"),i.setAttribute("height","100%"),i.setAttribute("viewBox","0 0 ".concat(e.width+e.stroke," ").concat(e.height+e.stroke));var n=document.createElement("defs"),s=document.createElement("pattern");s.setAttribute("id","h5p-jigsaw-puzzle-".concat(this.params.uuid,"-pattern-").concat(this.params.id)),s.setAttribute("width",this.params.size.width),s.setAttribute("height",this.params.size.height),s.setAttribute("x",-(this.params.gridPosition.x*this.params.baseWidth*this.scale-Math.sign(this.params.gridPosition.x)*this.knob/2)/this.width),s.setAttribute("y",-(this.params.gridPosition.y*this.params.baseHeight*this.scale-Math.sign(this.params.gridPosition.y)*this.knob/2)/this.height);var a=document.createElement("image");a.setAttribute("width",e.image.naturalWidth),a.setAttribute("height",e.image.naturalHeight),a.setAttribute("href",e.image.src),s.appendChild(a),n.appendChild(s),i.appendChild(n);var o=document.createElement("path");return o.setAttribute("fill","url(#h5p-jigsaw-puzzle-".concat(this.params.uuid,"-pattern-").concat(this.params.id,")")),o.setAttribute("stroke-opacity","0"),o.setAttribute("stroke-width",e.stroke),o.setAttribute("d",this.buildPathDash({width:e.baseWidth,height:e.baseHeight,type:e.type,stroke:e.stroke})),i.appendChild(o),["top","right","bottom","left"].forEach((function(n){t.pathBorders[n]=t.buildPathDOM({stroke:e.stroke,color:t.params.borderColor,width:e.baseWidth,height:e.baseHeight,orientation:t.params.borders[n].orientation,opacity:t.params.borders[n].opacity,side:n,gridPosition:{x:t.params.gridPosition.x,y:t.params.gridPosition.y},className:"border-".concat(n)}),i.appendChild(t.pathBorders[n])})),i},e.buildPathDOM=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=document.createElement("path");return t.className&&e.classList.add(t.className),e.setAttribute("fill-opacity","0"),e.setAttribute("stroke",t.color),e.setAttribute("stroke-width",t.stroke),e.setAttribute("stroke-opacity",t.opacity),e.setAttribute("d",this.buildPathSegment({width:t.width,height:t.height,orientation:t.orientation,stroke:t.stroke,side:t.side,gridPosition:{x:this.params.gridPosition.x,y:this.params.gridPosition.y}})),e},e.buildPathSegment=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=Math.min(e.width,e.height)/2,n="right"===e.side?e.width:0;0!==e.gridPosition.x&&(n+=e.stroke/2+i/2);var s="bottom"===e.side?e.height:0;0!==e.gridPosition.y&&(s+=e.stroke/2+i/2);var a="M ".concat(n,", ").concat(s),o="top"===e.side||"bottom"===e.side?"horizontal":"vertical",r=t.PATHS_BORDER["".concat(o,"-").concat(e.orientation)];return"".concat(a," ").concat(r).replace(/@w/g,e.width).replace(/@h/g,e.height).replace(/@knob/g,i).replace(/@gapw/g,(e.width-i)/2).replace(/@gaph/g,(e.height-i)/2)},e.buildPathDash=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=Math.min(e.width,e.height)/2;return t.PATHS[e.type].replace(/@offknob/g,e.stroke/2+i/2).replace(/@off/g,e.stroke/2).replace(/@w/g,e.width).replace(/@h/g,e.height).replace(/@knob/g,i).replace(/@gapw/g,(e.width-i)/2).replace(/@gaph/g,(e.height-i)/2)},e.setZIndex=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";""!==t&&"number"!=typeof t||(this.tile.style.zIndex=t)},e.getGridPosition=function(){return{x:this.params.gridPosition.x,y:this.params.gridPosition.y}},e.getId=function(){return this.params.id},e.setScale=function(t){"number"!=typeof t||t<0||(this.scale=t,this.width=this.scale*this.params.width,this.height=this.scale*this.params.height,this.knob=this.scale*this.params.knobSize,this.stroke=this.scale*this.params.stroke,this.tile.style.width="".concat(this.width+this.stroke,"px"),this.tile.style.height="".concat(this.height+this.stroke,"px"))},e.getSize=function(){return this.tile.style.width&&this.tile.style.height?{baseWidth:this.params.baseWidth,baseHeight:this.params.baseHeight,width:this.width,height:this.height,knob:this.knob,stroke:this.stroke}:null},e.getPosition=function(){return this.tile.style.left&&this.tile.style.top?{x:parseFloat(this.tile.style.left),y:parseFloat(this.tile.style.top)}:null},e.setPosition=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if("number"==typeof t.x&&"number"==typeof t.y){var e=this.params.container,i=e.offsetLeft,n=e.offsetLeft+e.offsetWidth-this.width,s=e.offsetTop,a=e.offsetTop+e.offsetHeight-this.height;this.tile.style.left="".concat(Math.min(Math.max(i,t.x),n),"px"),this.tile.style.top="".concat(Math.min(Math.max(s,t.y),a),"px")}},e.setDone=function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this.isDone=t},e.show=function(){this.tile.classList.remove("hidden")},e.hide=function(){this.tile.classList.add("hidden")},e.showHint=function(){this.isShowingHint=!0,this.tile.classList.add("hint")},e.hideHint=function(){this.tile.classList.remove("hint"),this.isShowingHint=!1},e.ghost=function(){this.tile.classList.add("ghosted")},e.unghost=function(){this.tile.classList.remove("ghosted")},e.enable=function(){this.tile.removeAttribute("disabled","disabled"),this.isDisabled=!1},e.disable=function(){this.isDisabled=!0,this.tile.setAttribute("disabled","disabled")},e.putInBackground=function(){this.tile.classList.remove("onTop")},e.putOnTop=function(){this.tile.classList.add("onTop")},e.animateMove=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};e.duration=e.duration||t.HINT_DURATION,this.tile.removeEventListener("transitionend",this.handleAnimationMoveEnded),this.tile.addEventListener("transitionend",this.handleAnimationMoveEnded),e.duration!==t.HINT_DURATION&&(this.tile.style.transitionDuration="".concat(e.duration,"s")),this.tile.classList.add("animate-move")},e.setBorders=function(t){for(var e in t){if("boolean"!=typeof t[e])return;var i=this.tile.querySelector(".border-".concat(e));i&&i.setAttribute("stroke-opacity",t[e]?"1":"0")}},e.repaintSVG=function(){var t=this.buildSVG({id:this.params.id,gridPosition:this.params.gridPosition,baseWidth:this.params.baseWidth,baseHeight:this.params.baseHeight,width:this.params.width,height:this.params.height,stroke:this.params.stroke,image:this.backgroundImage,type:this.params.type});this.tile.innerHTML=t.outerHTML},e.handleImageLoaded=function(){this.setScale(this.scale),this.repaintSVG(),this.callbacks.onPuzzleTileCreated(this),this.tile.addEventListener("touchstart",this.handleTileMoveStarted,!0),this.tile.addEventListener("mousedown",this.handleTileMoveStarted,!0)},e.handleTileMoveStarted=function(t){this.isDisabled?this.isShowingHint&&this.callbacks.onHintClosed():((t=t||window.event).preventDefault(),this.handleAnimationMoveEnded(),"touchstart"===t.type?(this.moveInitialX=this.tile.offsetLeft-t.touches[0].clientX,this.moveInitialY=this.tile.offsetTop-t.touches[0].clientY,this.tile.addEventListener("touchmove",this.handleTileMoved,!1),this.tile.addEventListener("touchend",this.handleTileMoveEnded,!1)):(this.moveInitialX=this.tile.offsetLeft-t.clientX,this.moveInitialY=this.tile.offsetTop-t.clientY,document.addEventListener("mousemove",this.handleTileMoved,!0),document.addEventListener("mouseup",this.handleTileMoveEnded,!0)),this.callbacks.onPuzzleTileMoveStarted(this))},e.handleTileMoved=function(t){(t=t||window.event).preventDefault(),"touchmove"===t.type?this.setPosition({x:this.moveInitialX+t.touches[0].clientX,y:this.moveInitialY+t.touches[0].clientY}):this.setPosition({x:this.moveInitialX+t.clientX,y:this.moveInitialY+t.clientY}),this.callbacks.onPuzzleTileMoved(this)},e.handleTileMoveEnded=function(){this.tile.removeEventListener("touchmove",this.handleTileMoved,!1),this.tile.removeEventListener("touchend",this.handleTileMoveEnded,!1),document.removeEventListener("mousemove",this.handleTileMoved,!0),document.removeEventListener("mouseup",this.handleTileMoveEnded,!0),this.callbacks.onPuzzleTileMoveEnded(this)},e.handleAnimationMoveEnded=function(){this.tile.style.transitionDuration="",this.tile.classList.remove("animate-move"),this.tile.removeEventListener("transitionend",this.handleAnimationMoveEnded)},t}();o.PATHS={"top-left":"M @off, @off l @w, 0 l 0, @gaph a 1 1 0 0 0 0 @knob l 0, @gaph l -@gapw, 0 a 1 1 0 0 0 -@knob 0 l -@gapw, 0 l 0 -@h Z","top-inner":"M @offknob, @off l @w, 0 l 0, @gaph a 1 1 0 0 0 0 @knob l 0, @gaph l -@gapw, 0 a 1 1 0 0 0 -@knob 0 l -@gapw, 0 l 0, -@gaph a 1 1 0 0 1 0 -@knob l 0, -@gaph Z","top-right":"M @offknob, @off l @w, 0 l 0, @h l -@gapw, 0 a 1 1 0 0 0 -@knob 0 l -@gapw, 0 l 0, -@gaph a 1 1 0 0 1 0 -@knob l 0, -@gaph Z","inner-left":"M @off, @offknob l @gapw, 0 a 1 1 0 0 1 @knob 0 l @gapw, 0 l 0, @gaph a 1 1 0 0 0 0 @knob l 0, @gaph l -@gapw, 0 a 1 1 0 0 0 -@knob 0 l -@gapw, 0 l 0, -@h Z","inner-inner":"M @offknob, @offknob l @gapw, 0 a 1 1 0 0 1 @knob 0 l @gapw, 0 l 0, @gaph a 1 1 0 0 0 0 @knob l 0, @gaph l -@gapw, 0 a 1 1 0 0 0 -@knob 0 l -@gapw, 0 l 0, -@gaph a 1 1 0 0 1 0 -@knob l 0, -@gaph Z","inner-right":"M @offknob, @offknob l @gapw, 0 a 1 1 0 0 1 @knob 0 l @gapw, 0 l 0, @h l -@gapw, 0 a 1 1 0 0 0 -@knob 0 l -@gapw, 0 l 0, -@gaph a 1 1 0 0 1 0 -@knob l 0, -@gaph Z","bottom-left":"M @off, @offknob l @gapw, 0 a 1 1 0 0 1 @knob 0 l @gapw, 0 l 0, @gaph a 1 1 0 0 0 0 @knob l 0, @gaph l -@w, 0 l 0, -@h Z","bottom-inner":"M @offknob, @offknob l @gapw, 0 a 1 1 0 0 1 @knob 0 l @gapw, 0 l 0, @gaph a 1 1 0 0 0 0 @knob l 0, @gaph l -@w, 0 l 0, -@gaph a 1 1 0 0 1 0 -@knob l 0, -@gaph Z","bottom-right":"M @offknob, @offknob l @gapw, 0 a 1 1 0 0 1 @knob 0 l @gapw, 0 l 0, @h l -@w, 0 l 0, -@gaph a 1 1 0 0 1 0 -@knob l 0, -@gaph Z"},o.PATHS_BORDER={"horizontal-straight":"l @w, 0","horizontal-up":"l @gapw, 0 a 1 1 0 0 1 @knob 0 l @gapw, 0","horizontal-down":"l @gapw, 0 a 1 1 0 0 0 @knob 0 l @gapw, 0","vertical-straight":"l 0, @h","vertical-left":"l 0, @gaph a 1 1 0 0 0 0 @knob l 0, @gaph","vertical-right":"l 0, @gaph a 1 1 0 0 1 0 @knob l 0, @gaph"},o.HINT_DURATION=.5;var r=function(){function t(t,e){var i=this;this.params=a.extend({a11y:{active:"",disabled:"",inactive:""},active:!1,classes:[],disabled:!1,hidden:!1,type:"pulse",noTabWhenDisabled:!1},t||{}),Array.isArray(this.params.classes)||(this.params.classes=[this.params.classes]),"pulse"===this.params.type&&(this.params.a11y.inactive||(this.params.a11y.inactive=this.params.a11y.active||""),this.params.a11y.active||(this.params.a11y.active=this.params.a11y.inactive||"")),this.active=this.params.active,this.disabled=this.params.disabled,this.callbacks=a.extend({onClick:function(){}},e),this.button=document.createElement("button"),this.params.classes&&this.params.classes.forEach((function(t){i.button.classList.add(t)})),this.button.setAttribute("aria-pressed",this.params.active),this.button.setAttribute("tabindex","0"),!0===this.params.active?this.activate():this.deactivate(),!0===this.params.disabled?this.disable():this.enable(),!0===this.params.hidden?this.hide():this.show(),this.button.addEventListener("click",(function(t){i.disabled||("toggle"===i.params.type&&i.toggle(),i.callbacks.onClick(t))}))}var e=t.prototype;return e.getDOM=function(){return this.button},e.show=function(){this.button.classList.remove("h5p-jigsaw-puzzle-display-none")},e.hide=function(){this.button.classList.add("h5p-jigsaw-puzzle-display-none")},e.enable=function(){this.disabled=!1,this.button.classList.remove("h5p-jigsaw-puzzle-button-disabled"),this.params.noTabWhenDisabled&&this.button.setAttribute("tabindex",0),this.active?this.activate():this.deactivate()},e.disable=function(){this.button.classList.add("h5p-jigsaw-puzzle-button-disabled"),this.button.setAttribute("aria-label",this.params.a11y.disabled),this.params.noTabWhenDisabled&&this.button.setAttribute("tabindex",-1),this.disabled=!0},e.activate=function(){this.disabled||("toggle"===this.params.type&&(this.button.classList.add("h5p-jigsaw-puzzle-button-active"),this.button.setAttribute("aria-pressed",!0)),this.button.setAttribute("aria-label",this.params.a11y.active),this.active=!0)},e.deactivate=function(){this.disabled||(this.active=!1,"toggle"===this.params.type&&(this.button.classList.remove("h5p-jigsaw-puzzle-button-active"),this.button.setAttribute("aria-pressed",!1)),this.button.setAttribute("aria-label",this.params.a11y.inactive))},e.toggle=function(t){this.disabled||((t="boolean"==typeof t?t:!this.active)?this.activate():this.deactivate())},e.isActive=function(){return this.active},e.isDisabled=function(){return this.disabled},t}(),l=function(){function t(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.params=a.extend({l10n:{timeLeft:"Time left:",hintsUsed:"Hints used:"},timeLeft:!1,hintsUsed:0},t),this.statusInfo=document.createElement("div"),this.statusInfo.classList.add("h5p-jigsaw-puzzle-status-info"),this.addTimeLeftBlock(),this.addHintsUsedBlock()}var e=t.prototype;return e.getDOM=function(){return this.statusInfo},e.addTimeLeftBlock=function(){this.statusTime=document.createElement("div"),this.statusTime.classList.add("h5p-jigsaw-puzzle-status"),this.statusTime.classList.add("hidden");var t=document.createElement("div");t.classList.add("h5p-jigsaw-puzzle-status-icon"),t.classList.add("h5p-jigsaw-puzzle-status-icon-time"),this.statusTime.appendChild(t),this.statusTextTime=document.createElement("div"),this.statusTime.appendChild(this.statusTextTime),this.statusInfo.appendChild(this.statusTime)},e.addHintsUsedBlock=function(){this.statusHint=document.createElement("div"),this.statusHint.classList.add("h5p-jigsaw-puzzle-status"),this.statusHint.classList.add("hidden");var t=document.createElement("div");t.classList.add("h5p-jigsaw-puzzle-status-icon"),t.classList.add("h5p-jigsaw-puzzle-status-icon-hint"),this.statusHint.appendChild(t),this.statusTextHint=document.createElement("div"),this.statusHint.appendChild(this.statusTextHint),this.statusInfo.appendChild(this.statusHint)},e.setTimeLeft=function(t){this.statusTime.classList.remove("hidden"),this.statusTextTime.innerHTML="number"==typeof t?a.formatTime(t):t},e.setHintsUsed=function(t){this.statusHint.classList.remove("hidden"),this.statusTextHint.innerHTML=t},t}(),h=function(){function t(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this.params=a.extend({a11y:{buttonFullscreenEnter:"Enter fullscreen mode",buttonFullscreenExit:"Exit fullscreen mode",buttonAudioMute:"Mute background music",buttonAudioUnmute:"Unmute background music"}},e),this.callbacks=a.extend({onButtonFullscreenClicked:function(){},onButtonAudioClicked:function(){}},i),this.titleBar=document.createElement("div"),this.titleBar.classList.add("h5p-jigsaw-puzzle-title-bar"),this.statusInfo=new l,this.titleBar.appendChild(this.statusInfo.getDOM()),this.buttonAudio=new r({type:"toggle",classes:["h5p-jigsaw-puzzle-button","h5p-jigsaw-puzzle-button-audio"],disabled:!0,noTabWhenDisabled:!0,hidden:!0,a11y:{active:this.params.a11y.buttonAudioMute,inactive:this.params.a11y.buttonAudioUnmute,disabled:this.params.a11y.disabled}},{onClick:function(e){t.callbacks.onButtonAudioClicked(e)}}),this.titleBar.appendChild(this.buttonAudio.getDOM()),this.buttonFullscreen=new r({type:"toggle",classes:["h5p-jigsaw-puzzle-button","h5p-jigsaw-puzzle-button-fullscreen"],disabled:!0,noTabWhenDisabled:!0,hidden:!0,a11y:{active:this.params.a11y.buttonFullscreenExit,inactive:this.params.a11y.buttonFullscreenEnter,disabled:this.params.a11y.disabled}},{onClick:function(){t.callbacks.onButtonFullscreenClicked()}}),this.titleBar.appendChild(this.buttonFullscreen.getDOM())}var e=t.prototype;return e.getDOM=function(){return this.titleBar},e.setHintsUsed=function(t){this.statusInfo.setHintsUsed(t)},e.setTimeLeft=function(t){this.statusInfo.setTimeLeft(t)},e.showFullscreenButton=function(){this.buttonFullscreen.show()},e.showAudioButton=function(){this.buttonAudio.show()},e.disableFullscreenButton=function(){this.buttonFullscreen.disable()},e.disableAudioButton=function(){this.buttonAudio.disable()},e.enableFullscreenButton=function(){this.buttonFullscreen.enable()},e.enableAudioButton=function(){this.buttonAudio.enable()},e.getAudioButtonState=function(){return this.buttonAudio.isActive()},e.toggleFullscreenButton=function(t){"string"==typeof t&&("enter"===t?t=!1:"exit"===t&&(t=!0)),"boolean"==typeof t&&this.buttonFullscreen.toggle(t)},e.toggleAudioButton=function(t){"string"==typeof t&&("mute"===t?t=!1:"unmute"===t&&(t=!0)),"boolean"==typeof t&&this.buttonAudio.toggle(t)},t}(),u=t.p+"assets/puzzle-default-song-1.mp3",d=t.p+"assets/puzzle-default-song-2.mp3",c=t.p+"assets/puzzle-default-song-3.mp3",p=t.p+"assets/puzzle-default-song-4.mp3",m=t.p+"assets/shaky-puzzle.mp3",g=t.p+"assets/puzzle-tile-pickup.mp3",f=t.p+"assets/puzzle-tile-correct.mp3",b=t.p+"assets/puzzle-tile-incorrect.mp3",v=t.p+"assets/puzzle-fully-complete.mp3",z=t.p+"assets/puzzle-hint.mp3",y=function(){function t(){var t,e,i,n,s,o=this,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},l=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(this.params=r,this.callbacks=a.extend({onResize:function(){},onCompleted:function(){},onButtonFullscreenClicked:function(){},onHintDone:function(){},onInteracted:function(){},onPuzzleReset:function(){},onChanged:function(){}},l),this.audios=[],this.audiosToKeepAlive=["backgroundMusic"],this.tiles=[],this.originalSize=null,this.maxSize={heigth:null,width:null},this.borderWidth=2,this.hintsUsed=(null===(t=this.params.previousState)||void 0===t?void 0:t.hintsUsed)||0,this.timeLeft=null!==(e=null===(i=this.params.previousState)||void 0===i?void 0:i.timeLeft)&&void 0!==e?e:this.params.timeLimit,this.isAnswerGiven=!1,this.h5pQuestionContent=null,this.h5pQuestionButtons=null,this.content=document.createElement("div"),this.content.classList.add("h5p-jigsaw-puzzle-content"),null===(n=this.params)||void 0===n||null===(s=n.puzzleImageInstance)||void 0===s||!s.source){var h=document.createElement("div");return h.classList.add("h5p-jigsaw-puzzle-message"),h.innerText=this.params.l10n.messageNoImage,void this.content.appendChild(h)}this.addTitlebar(),this.addPuzzleArea(),this.overlay=document.createElement("button"),this.overlay.classList.add("h5p-jigsaw-puzzle-overlay"),this.overlay.classList.add("disabled"),this.content.appendChild(this.overlay),this.image=document.createElement("img"),this.image.addEventListener("load",(function(){o.handleImageLoaded(o.params.imageFormat)})),this.imageCrossOrigin="function"==typeof H5P.getCrossOrigin?H5P.getCrossOrigin(r.puzzleImageInstance.source):"Anonymous",this.image.src=r.puzzleImageInstance.source,this.attentionSeeker=new H5P.AttentionSeeker,"undefined"==typeof H5PEditor&&this.addAudios()}var e=t.prototype;return e.getDOM=function(){return this.content},e.addTitlebar=function(){var t=this;this.titlebar=new h({a11y:{buttonFullscreenEnter:this.params.a11y.buttonFullscreenEnter,buttonFullscreenExit:this.params.a11y.buttonFullscreenExit,buttonAudioMute:this.params.a11y.buttonAudioMute,buttonAudioUnmute:this.params.a11y.buttonAudioUnmute,disabled:this.params.a11y.disabled}},{onButtonAudioClicked:function(e){t.handleButtonAudioClicked(e)},onButtonFullscreenClicked:function(e){t.handleButtonFullscreenClicked(e)}}),this.params.showHintCounter&&this.titlebar.setHintsUsed(this.hintsUsed),this.timeLeft&&this.titlebar.setTimeLeft(this.timeLeft),this.content.appendChild(this.titlebar.getDOM())},e.addPuzzleArea=function(){var t=this;this.puzzleArea=document.createElement("div"),this.puzzleArea.classList.add("h5p-jigsaw-puzzle-puzzle-area"),this.content.appendChild(this.puzzleArea),this.puzzleDropzone=document.createElement("div"),this.puzzleDropzone.classList.add("h5p-jigsaw-puzzle-tile-container"),this.puzzleArea.appendChild(this.puzzleDropzone),window.requestAnimationFrame((function(){var e=window.getComputedStyle(t.puzzleDropzone);t.borderWidth=parseFloat(e.getPropertyValue("border-width"))||t.borderWidth}));var e=document.createElement("div");e.classList.add("h5p-jigsaw-puzzle-sorting-area"),e.style.width="".concat(100*this.params.sortingSpace/(100-this.params.sortingSpace),"%"),this.puzzleArea.appendChild(e)},e.createPuzzleTile=function(t){var e=this,i=this.image.naturalWidth/this.params.size.width,n=this.image.naturalHeight/this.params.size.height,s=Math.min(i,n)/2,a=i+(t.x>0?s/2:0),r=n+(t.y>0?s/2:0),l={top:{orientation:0===t.y?"straight":"up",opacity:1},right:{orientation:t.x+1===this.params.size.width?"straight":"left",opacity:1},bottom:{orientation:t.y+1===this.params.size.height?"straight":"up",opacity:1},left:{orientation:0===t.x?"straight":"left",opacity:1}},h="inner";0===t.y?h="top":t.y+1===this.params.size.height&&(h="bottom");var u="inner";0===t.x?u="left":t.x+1===this.params.size.width&&(u="right");var d="".concat(h,"-").concat(u);return new o({id:t.y*this.params.size.width+t.x,baseWidth:i,baseHeight:n,width:a,height:r,gridPosition:{x:t.x,y:t.y},knobSize:s,imageSource:this.image.src,imageCrossOrigin:this.imageCrossOrigin,type:d,stroke:this.params.stroke,borderColor:this.params.tileBorderColor,borders:l,uuid:this.params.uuid,container:this.puzzleArea,size:this.params.size},{onPuzzleTileCreated:function(t){e.handlePuzzleTileCreated(t)},onPuzzleTileMoveStarted:function(t){e.handlePuzzleTileMoveStarted(t)},onPuzzleTileMoved:function(t){e.handlePuzzleTileMoved(t)},onPuzzleTileMoveEnded:function(t){e.handlePuzzleTileMoveEnded(t)},onHintClosed:function(){e.overlay.click()}})},e.setTilePosition=function(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};e.tile&&("number"!=typeof e.x||e.x<0||"number"!=typeof e.y||e.y<0||(e.animate=null!==(t=e.animate)&&void 0!==t&&t,e.animate&&e.tile.animateMove({duration:e.duration}),this.tiles[e.tile.getId()].position={x:(e.x-this.puzzleDropzone.offsetLeft)/this.puzzleArea.offsetWidth,y:(e.y-this.puzzleDropzone.offsetTop)/this.puzzleArea.offsetHeight},e.tile.setPosition({x:e.x,y:e.y})))},e.getAssetPath=function(t){var e,i;if(-1!==t.indexOf("sites/default/files/h5p/development"))return t;var n=null,s=null===(e=H5PIntegration)||void 0===e||null===(i=e.contents["cid-".concat(this.params.contentId)])||void 0===i?void 0:i.library;if(-1!==(null==s?void 0:s.indexOf("H5P.JigsawPuzzleKID "))&&(n=s.replace(" ","-")),!n){var a,o,r=null===(a=H5PIntegration)||void 0===a||null===(o=a.contents["cid-".concat(this.params.contentId)])||void 0===o?void 0:o.jsonContent;if(!r)return null;var l=RegExp('"library":"(H5P.JigsawPuzzleKID [0-9]+.[0-9]+)"'),h=r.match(l);h&&(n=h[1].replace(" ","-"))}if(!n)return null;var u=H5P.getLibraryPath(n),d=t.substr(t.indexOf("/assets"));return"".concat(u,"/dist").concat(d)},e.getTimeLeft=function(){var t;return null!==(t=this.timeLeft)&&void 0!==t?t:null},e.addAudios=function(){var e=this;if(this.params.sound&&!this.audiosDefined&&H5P.SoundJS.initializeDefaultPlugins()){H5P.SoundJS.alternateExtensions=["mp3"];var i=null;if("custom"===this.params.sound.backgroundMusic)this.params.sound.backgroundMusicCustom&&this.params.sound.backgroundMusicCustom.length>0&&this.params.sound.backgroundMusicCustom[0].path&&(i=H5P.getPath(this.params.sound.backgroundMusicCustom[0].path,this.params.contentId));else if(this.params.sound.backgroundMusic){var n=this.getAssetPath(t.AUDIOS[this.params.sound.backgroundMusic]);n&&(i=n)}i&&(this.titlebar.showAudioButton(),this.addAudio("backgroundMusic",i,{interrupt:H5P.SoundJS.INTERRUPT_NONE,loop:-1})),["puzzleStarted","puzzleTilePickUp","puzzleTileCorrect","puzzleTileIncorrect","puzzleCompleted","puzzleHint"].forEach((function(i){var n;(n=e.params.sound[i]&&e.params.sound[i].length>0&&e.params.sound[i][0].path?H5P.getPath(e.params.sound[i][0].path,e.params.contentId):e.getAssetPath(t.AUDIOS[i]))&&e.addAudio(i,n,{interrupt:H5P.SoundJS.INTERRUPT_NONE})}))}},e.addAudio=function(t,e){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};this.removeAudio(t),this.audios[t]={params:i},H5P.SoundJS.registerSound(e,t)},e.removeAudio=function(t){H5P.SoundJS.removeSound(t),delete this.audios[t]},e.startAudio=function(t){this.audios[t]&&H5P.SoundJS.play(t,this.audios[t].params||{})},e.stopAudios=function(){H5P.SoundJS.stop()},e.setH5PQuestionElements=function(t){this.h5pQuestionContent=t.querySelector(".h5p-question-content"),this.h5pQuestionButtons=t.querySelector(".h5p-question-buttons")},e.enableFullscreenButton=function(){this.titlebar&&(this.titlebar.enableFullscreenButton(),this.titlebar.showFullscreenButton())},e.toggleFullscreen=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.titlebar.toggleFullscreenButton(t),this.setFixedHeight(t)},e.setFixedHeight=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(t){var e=window.getComputedStyle(this.h5pQuestionContent),i=parseFloat(e.getPropertyValue("margin-bottom")),n=parseFloat(e.getPropertyValue("margin-left"))+parseFloat(e.getPropertyValue("margin-right")),s=window.getComputedStyle(this.h5pQuestionButtons),a=parseFloat(s.getPropertyValue("margin-bottom"))+parseFloat(s.getPropertyValue("margin-top"));this.maxSize={height:window.innerHeight-2*this.params.stroke-this.puzzleArea.offsetTop-i-a-this.h5pQuestionButtons.offsetHeight,width:(window.innerWidth-2*this.params.stroke-n)*(100-this.params.sortingSpace)/100}}else this.maxSize={heigth:null,width:null};this.handleResized()},e.runTimer=function(){var t=this;this.titlebar.setTimeLeft(this.timeLeft),0!==this.timeLeft?(clearTimeout(this.timer),this.timer=setTimeout((function(){t.timeLeft--,t.runTimer()}),1e3)):this.handleTimeUp()},e.stopHintTimer=function(){clearTimeout(this.hintTimer)},e.stopAttentionTimer=function(){clearTimeout(this.attentionTimer),this.attentionSeeker.unregisterAll()},e.runHintTimer=function(){var t,e,i=this;null===(t=this.params)||void 0===t||!t.autoHintInterval||this.timeLeft&&(null===(e=this.params)||void 0===e?void 0:e.autoHintInterval)>this.timeLeft||(this.stopHintTimer(),this.hintTimer=setTimeout((function(){i.showHint(i.attentionTile)}),1e3*this.params.autoHintInterval))},e.runAttentionTimer=function(){var t,e,i,n=this,s=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};null===(t=this.params.attentionSeeker)||void 0===t||!t.style||null===(e=this.params.attentionSeeker)||void 0===e||!e.interval||this.timeLeft&&(null===(i=this.params.attentionSeeker)||void 0===i?void 0:i.interval)>this.timeLeft||(s.keepAlive||(this.stopAttentionTimer(),this.attentionTile=null),this.attentionTimer=setTimeout((function(){n.stopAttentionTimer();var t=n.tiles.filter((function(t){return!t.instance.isDone}));if(0!==t.length){t.forEach((function(t){t.instance.putInBackground()})),n.attentionTile=n.attentionTile||t[Math.floor(Math.random()*t.length)].instance;var e=n.attentionSeeker.register({element:n.attentionTile.getDOM(),style:n.params.attentionSeeker.style,interval:0,repeat:1});n.attentionTile.putOnTop(),n.attentionSeeker.run(e),n.runAttentionTimer({keepAlive:!0})}}),1e3*this.params.attentionSeeker.interval))},e.stopOverlayShowing=function(){this.isOverlayShowing&&(this.titlebar.enableAudioButton(),this.titlebar.enableFullscreenButton(),clearTimeout(this.animateHintTimeout),this.hideOverlay(),this.callbacks.onHintDone())},e.reset=function(){var t=this;this.stopOverlayShowing(),setTimeout((function(){t.tiles.forEach((function(e){t.showTileBorders(e.instance),e.instance.enable(),e.instance.setDone(!1)})),t.randomizeTiles({useFullArea:t.params.useFullArea,layout:t.params.randomizerPattern,keepDone:!1}),t.hintsUsed=0,t.params.showHintCounter&&t.titlebar.setHintsUsed(t.hintsUsed),t.isAnswerGiven=!1,t.params.timeLimit&&(t.timeLeft=t.params.timeLimit,t.runTimer()),t.runAttentionTimer(),t.runHintTimer(),t.startAudio("puzzleStarted",{silence:!0,keepAlives:t.audiosToKeepAlive})}),0)},e.randomizeTiles=function(){for(var e=this,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=a.shuffleArray(this.tiles),s=n.length;s>=0;s--)this.puzzleArea.appendChild(n[Math.random()*s|0].instance.getDOM());i.keepDone&&(n=n.map((function(t){return t.instance.isDone?null:t})));var o=this.tiles.reduce((function(t,e){return{width:Math.max(t.width,e.instance.getSize().width),height:Math.max(t.height,e.instance.getSize().height)}}),{width:0,height:0}),r=i.useFullArea||this.puzzleArea.offsetWidth*this.params.sortingSpace/100<o.width,l=r?this.puzzleArea.offsetLeft+0:this.puzzleArea.offsetLeft+this.puzzleArea.offsetWidth*(1-this.params.sortingSpace/100),h={width:r?this.puzzleArea.offsetWidth-o.width:this.puzzleArea.offsetWidth*this.params.sortingSpace/100-o.width,height:this.puzzleArea.offsetHeight-o.height};n.forEach((function(n,s){if(null!==n){var a=n.instance,r=Math.floor(s/e.params.size.width),u=s%e.params.size.width,d=0,c=0;if(i.layout===t.LAYOUT_STAGGERED){if(r%2==1){var p=h.width-h.width/e.params.size.width;d=p/(e.params.size.width-1)/2+l+p/(e.params.size.width-1)*u+(o.width-a.getSize().width)}else d=l+h.width/(e.params.size.width-1)*u+(o.width-a.getSize().width);c=e.puzzleArea.offsetTop+h.height/(e.params.size.height-1)*r+(o.height-a.getSize().height)}else d=l+Math.random()*h.width,c=e.puzzleArea.offsetTop+Math.random()*h.height;e.setTilePosition({tile:a,x:d,y:c,animate:!0})}}))},e.moveTileToTarget=function(t){var e,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};i.animate=null!==(e=i.animate)&&void 0!==e&&e;var n=t.getSize(),s=t.getGridPosition(),a={x:this.puzzleDropzone.offsetLeft+s.x*n.width-Math.sign(s.x)*n.knob/2-s.x*n.knob/2,y:this.puzzleDropzone.offsetTop+s.y*n.height-Math.sign(s.y)*n.knob/2-s.y*n.knob/2};this.setTilePosition({tile:t,x:a.x,y:a.y,animate:i.animate})},e.moveTilesToTarget=function(t){var e,i,n=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};t=t?t.map((function(t){return t.instance?t:{instance:t}})):this.tiles,s.animate=null===(e=s.animate)||void 0===e||e,s.finalize=null===(i=s.finalize)||void 0===i||i,t.forEach((function(t){n.moveTileToTarget(t.instance,{animate:s.animate}),s.finalize&&n.finalizeTile(t.instance)}))},e.finalizeTile=function(t){t.disable(),t.hideHint(),t.putInBackground(),this.hideTileBorders(t),t.setDone(!0)},e.incrementHintCounter=function(){this.hintsUsed++,this.titlebar.setHintsUsed(this.hintsUsed)},e.showHint=function(t){var e=this;this.stopAttentionTimer(),this.stopHintTimer(),this.titlebar.disableAudioButton(),this.titlebar.disableFullscreenButton(),this.startAudio("puzzleHint",{silence:!0,keepAlives:this.audiosToKeepAlive});var i=this.tiles.filter((function(t){return!t.instance.isDone}));i.forEach((function(t){t.instance.putInBackground()})),t&&i.some((function(e){return e.instance.getId()===t.getId()}))||(t=i[Math.floor(Math.random()*i.length)].instance),t.putOnTop();var n=t.getSize(),s=t.getGridPosition(),a=t.getPosition(),o={x:this.puzzleDropzone.offsetLeft+s.x*n.width-Math.sign(s.x)*n.knob/2-s.x*n.knob/2,y:this.puzzleDropzone.offsetTop+s.y*n.height-Math.sign(s.y)*n.knob/2-s.y*n.knob/2};this.showOverlay((function(){e.setTilePosition({tile:t,x:a.x,y:a.y,animate:!0}),e.titlebar.enableAudioButton(),e.titlebar.enableFullscreenButton(),clearTimeout(e.animateHintTimeout),e.hideOverlay(),t.hideHint(),t.enable(),e.runAttentionTimer(),e.runHintTimer(),e.callbacks.onHintDone()})),t.disable(),t.showHint(),this.animateHint({tile:t,currentPosition:a,targetPosition:o})},e.animateHint=function(){var t,e,i,n=this,s=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};s.duration=null!==(t=s.duration)&&void 0!==t?t:1,s.delay=null!==(e=s.delay)&&void 0!==e?e:.75,s.toTarget=null===(i=s.toTarget)||void 0===i||i,s.toTarget?this.setTilePosition({tile:s.tile,x:s.targetPosition.x,y:s.targetPosition.y,animate:!0,duration:s.duration}):this.setTilePosition({tile:s.tile,x:s.currentPosition.x,y:s.currentPosition.y,animate:!0,duration:s.duration}),clearTimeout(this.animateHintTimeout),this.animateHintTimeout=setTimeout((function(){s.toTarget=!s.toTarget,n.animateHint(s)}),1e3*(s.duration+s.delay))},e.updatePuzzleOutlines=function(t,e){var i=e.getDOM(),n=this.puzzleOutlines[t];n.style.width=i.style.width,n.style.height=i.style.height;var s=e.getSize(),a=e.getGridPosition(),o={x:this.puzzleDropzone.offsetLeft+a.x*s.width-Math.sign(a.x)*s.knob/2-a.x*s.knob/2,y:this.puzzleDropzone.offsetTop+a.y*s.height-Math.sign(a.y)*s.knob/2-a.y*s.knob/2};if(this.puzzleOutlines[t].style.left="".concat(o.x,"px"),this.puzzleOutlines[t].style.top="".concat(o.y,"px"),!n.isConnected){if(this.puzzleDropzone.appendChild(n),e.getId()<this.params.size.width){var r=n.querySelector(".border-top");r&&r.setAttribute("stroke-opacity","0")}if(e.getId()%this.params.size.width==this.params.size.width-1){var l=n.querySelector(".border-right");l&&l.setAttribute("stroke-opacity","0")}if(this.params.size.width*(this.params.size.height-1)-1<e.getId()){var h=n.querySelector(".border-bottom");h&&h.setAttribute("stroke-opacity","0")}if(e.getId()%this.params.size.width==0){var u=n.querySelector(".border-left");u&&u.setAttribute("stroke-opacity","0")}}},e.showOverlay=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){};this.isOverlayShowing=!0,this.overlay.clickCallback=t,this.overlay.setAttribute("tabindex",0),this.overlay.setAttribute("aria-label",this.params.a11y.close),this.overlay.addEventListener("click",this.overlay.clickCallback),this.overlay.classList.remove("disabled"),this.overlay.focus()},e.hideOverlay=function(){this.overlay.classList.add("disabled"),this.overlay.setAttribute("tabindex",-1),this.overlay.setAttribute("aria-label",""),this.overlay.removeEventListener("click",this.overlay.clickCallback),this.overlay.clickCallback=null,this.isOverlayShowing=!1},e.showTileBorders=function(t){t.setBorders({top:!0,right:!0,bottom:!0,left:!0})},e.hideTileBorders=function(t){if(t.getId()<this.params.size.width)t.setBorders({top:!1});else{var e=this.tiles[t.getId()-this.params.size.width].instance;e.isDisabled&&(t.setBorders({top:!1}),e.setBorders({bottom:!1}))}if(t.getId()%this.params.size.width==this.params.size.width-1)t.setBorders({right:!1});else{var i=this.tiles[t.getId()+1].instance;i.isDisabled&&(t.setBorders({right:!1}),i.setBorders({left:!1}))}if(this.params.size.width*(this.params.size.height-1)-1<t.getId())t.setBorders({bottom:!1});else{var n=this.tiles[t.getId()+this.params.size.width].instance;n.isDisabled&&(t.setBorders({bottom:!1}),n.setBorders({top:!1}))}if(t.getId()%this.params.size.width==0)t.setBorders({left:!1});else{var s=this.tiles[t.getId()-1].instance;s.isDisabled&&(t.setBorders({left:!1}),s.setBorders({right:!1}))}},e.getAnswerGiven=function(){return this.isAnswerGiven},e.getScore=function(){return this.tiles.reduce((function(t,e){return t+(e.instance.isDone?1:0)}),0)},e.getCurrentState=function(){var t=this;return{timeLeft:this.timeLeft,hintsUsed:this.hintsUsed,backgroundMusic:this.titlebar.getAudioButtonState(),tiles:this.tiles.map((function(e){return{isDone:e.instance.isDone,position:a.getRelativePosition(e.instance.getPosition(),t.puzzleArea)}}))}},e.handleImageLoaded=function(t){var e;this.originalSize={width:this.image.naturalWidth,height:this.image.naturalHeight};for(var i=0;i<this.params.size.height;i++)for(var n=0;n<this.params.size.width;n++)this.tiles.push({instance:this.createPuzzleTile({x:n,y:i,format:t}),position:{x:0,y:0}});if(this.params.showBackground){var s=document.createElement("img");s.classList.add("h5p-jigsaw-puzzle-background-image"),s.setAttribute("src",this.image.src),this.puzzleDropzone.appendChild(s)}this.audios.backgroundMusic&&this.titlebar.enableAudioButton(),this.params.sound.autoplayBackgroundMusic&&!1!==this.params.previousState.backgroundMusic&&(this.titlebar.toggleAudioButton("unmute"),this.startAudio("backgroundMusic")),0===Object.keys(this.params.previousState).length||null!==(e=this.params.previousState)&&void 0!==e&&e.tiles.some((function(t){return!t.isDone}))?this.timeLeft>0&&"undefined"==typeof H5PEditor&&(this.runTimer(),this.runAttentionTimer(),this.runHintTimer()):this.titlebar.setTimeLeft(this.timeLeft),this.handleResized()},e.handleResized=function(){var t=this;if(this.originalSize){var e=(this.puzzleDropzone.offsetWidth-this.borderWidth)/this.originalSize.width,i={height:e*this.originalSize.height-this.borderWidth,width:e*this.originalSize.width-this.borderWidth};this.maxSize.height&&(this.puzzleDropzone.style.width||i.height>this.maxSize.height||i.width>this.maxSize.width)?((this.maxSize.height-this.borderWidth)/this.originalSize.height<(this.maxSize.width-this.borderWidth)/this.originalSize.width?(this.scale=(this.maxSize.height-this.borderWidth)/this.originalSize.height,this.puzzleDropzone.style.height="".concat(this.maxSize.height-2*this.borderWidth,"px"),this.puzzleDropzone.style.width="".concat(this.scale*this.originalSize.width-this.borderWidth,"px")):(this.scale=(this.maxSize.width-this.borderWidth)/this.originalSize.width,this.puzzleDropzone.style.height="".concat(this.scale*this.originalSize.height-this.borderWidth,"px"),this.puzzleDropzone.style.width="".concat(this.maxSize.width-2*this.borderWidth,"px")),this.puzzleDropzone.style.flexShrink=0):(this.scale=e,this.puzzleDropzone.style.height="".concat(i.height,"px"),this.puzzleDropzone.style.width="",this.puzzleDropzone.style.flexShrink=""),this.tiles.forEach((function(e,i){e.instance.setScale(t.scale),e.instance.setPosition({x:e.position.x*t.puzzleArea.offsetWidth+t.puzzleDropzone.offsetLeft,y:e.position.y*t.puzzleArea.offsetHeight+t.puzzleDropzone.offsetTop}),t.puzzleOutlines&&t.updatePuzzleOutlines(i,e.instance)}))}this.callbacks.onResize()},e.handlePuzzleTileMoveStarted=function(t){this.stopAttentionTimer(),this.stopHintTimer(),this.tiles.forEach((function(t){t.instance.putInBackground(),t.instance.isDisabled||t.instance.ghost()})),t.putOnTop(),t.unghost(),this.startAudio("puzzleTilePickUp",{silence:!0,keepAlives:this.audiosToKeepAlive})},e.handlePuzzleTileMoved=function(){},e.handlePuzzleTileMoveEnded=function(e){this.tiles.forEach((function(t){t.instance.unghost()}));var i=e.getPosition(),n=e.getSize(),s=e.getGridPosition();this.tiles[e.getId()].position=i;var a={x:this.puzzleDropzone.offsetLeft+s.x*n.width-Math.sign(s.x)*n.knob/2-s.x*n.knob/2,y:this.puzzleDropzone.offsetTop+s.y*n.height-Math.sign(s.y)*n.knob/2-s.y*n.knob/2},o=Math.min(n.width,n.height)*t.SLACK_FACTOR;Math.abs(i.x-a.x)<o&&Math.abs(i.y-a.y)<o?(this.setTilePosition({tile:e,x:a.x,y:a.y}),this.finalizeTile(e),this.startAudio("puzzleTileCorrect",{silence:!0,keepAlives:this.audiosToKeepAlive})):(this.setTilePosition({tile:e,x:i.x,y:i.y}),e.setDone(!1),this.startAudio("puzzleTileIncorrect",{silence:!0,keepAlives:this.audiosToKeepAlive})),this.isAnswerGiven=!0,this.callbacks.onInteracted(),this.tiles.every((function(t){return t.instance.isDone}))?this.handlePuzzleCompleted({xAPI:!0}):(this.runAttentionTimer(),this.runHintTimer()),this.callbacks.onChanged()},e.handleButtonAudioClicked=function(t){null!=t&&t.currentTarget.classList.contains("h5p-jigsaw-puzzle-button-active")?this.startAudio("backgroundMusic"):this.stopAudios()},e.handleButtonFullscreenClicked=function(){this.callbacks.onButtonFullscreenClicked()},e.handlePuzzleCompleted=function(t){this.stopOverlayShowing(),clearTimeout(this.timer),this.stopAttentionTimer(),this.stopHintTimer(),this.startAudio("puzzleCompleted",{silence:!0,keepAlives:this.audiosToKeepAlive}),this.callbacks.onCompleted(t)},e.handlePuzzleTileCreated=function(t){var e,i,n=this,s=null===(e=this.params)||void 0===e||null===(i=e.previousState)||void 0===i?void 0:i.tiles[t.getId()];if(!0===s.isDone)this.moveTilesToTarget([t],{animate:!1,finalize:!0});else if(s.position.x&&s.position.y){var o=a.getAbsolutePosition(s.position,this.puzzleArea);this.setTilePosition({tile:t,x:o.x,y:o.y})}if(this.puzzleArea.appendChild(t.getDOM()),t.getId()+1===this.params.size.width*this.params.size.height&&this.params.showPuzzleOutlines){var r=window.getComputedStyle(this.puzzleDropzone).getPropertyValue("border-color").replace(/[^.^\d,]/g,"").split(",").map((function(t){return parseFloat(t,10)}));4===r.length?r[3]:r=[0,0,0,.1],r="rgba(".concat(r.join(","),")"),setTimeout((function(){n.puzzleOutlines=n.tiles.map((function(t){var e=t.instance.getDOM().cloneNode(!0);e.setAttribute("disabled","disabled");var i=e.querySelector("svg path");return i&&i.parentNode.removeChild(i),e.querySelectorAll("svg path").forEach((function(t){t.setAttribute("stroke",r)})),e})),n.handleResized(),n.handleAllTilesCreated()}),0)}},e.handleAllTilesCreated=function(){var t,e=this,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:500,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1/0;if((null===(t=this.puzzleArea)||void 0===t?void 0:t.offsetWidth)>0)this.handleDOMVisible();else{if(0===n)return void this.tiles.forEach((function(t){t.instance.show()}));this.tiles.forEach((function(t){t.instance.hide()})),clearTimeout(this.timeoutWaitForPuzzleArea),this.timeoutWaitForPuzzleArea=setTimeout((function(){e.handleAllTilesCreated(i,n-1)}),i)}},e.handleDOMVisible=function(){var t=this;this.tiles.forEach((function(t){t.instance.show()})),0===Object.keys(this.params.previousState).length&&this.moveTilesToTarget(this.tiles,{animate:!1,finalize:!1}),setTimeout((function(){0===Object.keys(t.params.previousState).length&&t.randomizeTiles({useFullArea:t.params.useFullArea,layout:t.params.randomizerPattern,keepDone:Object.keys(t.params.previousState).length>0}),t.runAttentionTimer(),t.runHintTimer(),t.startAudio("puzzleStarted"),window.requestAnimationFrame((function(){t.isPuzzleSetUp=!0,t.callbacks.onPuzzleReset(),setTimeout((function(){t.handleResized()}),250)}))}),500)},e.handleTimeUp=function(){this.handlePuzzleCompleted({xAPI:!0}),this.moveTilesToTarget()},t}();function w(t,e){return w=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},w(t,e)}y.SLACK_FACTOR=.25,y.LAYOUT_STAGGERED="staggered",y.AUDIOS={puzzleDefaultSong1:u,puzzleDefaultSong2:d,puzzleDefaultSong3:c,puzzleDefaultSong4:p,puzzleStarted:m,puzzleTilePickUp:g,puzzleTileCorrect:f,puzzleTileIncorrect:b,puzzleCompleted:v,puzzleHint:z};var T=function(t){var e,i;function n(e,i){var n,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};for(var o in(n=t.call(this,"jigsaw-puzzle")||this).params=a.extend({tilesHorizontal:4,tilesVertical:3,behaviour:{sortingSpace:50,useFullArea:!1,randomizerPattern:"random",enableComplete:!0,enableHint:!0,enableSolutionsButton:!0,enableRetry:!0,showBackground:!0,showPuzzleOutlines:!0},l10n:{complete:"Complete",hint:"Hint",tryAgain:"Retry",messageNoImage:"There was no image given for this jigsaw puzzle.",timeLimit:"time limit",shuffle:"Shuffle"},a11y:{buttonFullscreenEnter:"Enter fullscreen mode",buttonFullscreenExit:"Exit fullscreen mode",buttonAudioMute:"Mute background music",buttonAudioUnmute:"Unmute background music",complete:"Complete the puzzle. All tiles will be put to their correct position.",hint:"Receive a visual hint to where a puzzle tile needs to go.",tryAgain:"Retry the puzzle. All puzzle tiles will be shuffled on the canvas.",disabled:"Disabled",close:"Close",shuffle:"Shuffle puzzle tiles."}},e),n.params.l10n)n.params.l10n[o]=a.stripHTML(a.htmlDecode(n.params.l10n[o]));for(var r in n.params.a11y)n.params.a11y[r]=a.stripHTML(a.htmlDecode(n.params.a11y[r]));return n.contentId=i,n.extras=s,n.previousState=n.extras.previousState||{},n.uuid=H5P.createUUID(),n.params.puzzleImage&&(n.puzzleImageInstance=H5P.newRunnable(n.params.puzzleImage,n.contentId)),n.on("resize",(function(){n.handleH5PResized()})),n}i=t,(e=n).prototype=Object.create(i.prototype),e.prototype.constructor=e,w(e,i);var s=n.prototype;return s.registerDomElements=function(){var t,e,i,n,s,a,o,r,l=this;this.content=new y({attentionSeeker:this.params.behaviour.attentionSeeker,autoHintInterval:this.params.behaviour.autoHintInterval,contentId:this.contentId,imageFormat:null===(t=this.params)||void 0===t||null===(e=t.puzzleImage)||void 0===e||null===(i=e.params)||void 0===i||null===(n=i.file)||void 0===n?void 0:n.mime,previousState:this.previousState,puzzleImageInstance:this.puzzleImageInstance,randomizerPattern:this.params.behaviour.randomizerPattern,showBackground:this.params.behaviour.showBackground,showPuzzleOutlines:this.params.behaviour.showPuzzleOutlines,showHintCounter:this.params.behaviour.enableHint,size:{width:this.params.tilesHorizontal,height:this.params.tilesVertical},sortingSpace:this.params.behaviour.sortingSpace,sound:this.params.sound||{},stroke:Math.max(window.innerWidth/750,1.75),tileBorderColor:"rgba(88, 88, 88, 0.5)",timeLimit:this.params.behaviour.timeLimit||null,useFullArea:this.params.behaviour.useFullArea,uuid:this.uuid,a11y:{buttonFullscreenEnter:this.params.a11y.buttonFullscreenEnter,buttonFullscreenExit:this.params.a11y.buttonFullscreenExit,buttonAudioMute:this.params.a11y.buttonAudioMute,buttonAudioUnmute:this.params.a11y.buttonAudioUnmute,disabled:this.params.a11y.disabled,close:this.params.a11y.close},l10n:{messageNoImage:this.params.l10n.messageNoImage}},{onResize:function(){l.handleOnResize()},onCompleted:function(t){l.handlePuzzleCompleted(t)},onButtonFullscreenClicked:function(){l.toggleFullscreen()},onHintDone:function(){l.handleHintDone()},onInteracted:function(){l.handleInteracted()},onPuzzleReset:function(){l.handlePuzzleReset()},onChanged:function(){l.handleContentChanged()}}),this.setContent(this.content.getDOM()),null!==(s=this.params)&&void 0!==s&&null!==(a=s.puzzleImage)&&void 0!==a&&null!==(o=a.params)&&void 0!==o&&null!==(r=o.file)&&void 0!==r&&r.path&&(this.addButtons(),"complete"===document.readyState?window.requestAnimationFrame((function(){l.handleDOMInitialized()})):document.addEventListener("readystatechange",(function(){"complete"===document.readyState&&window.requestAnimationFrame((function(){l.handleDOMInitialized()}))})),window.addEventListener("orientationchange",(function(){H5P.isFullscreen&&setTimeout((function(){l.content.setFixedHeight(!0)}),200)}),!1))},s.addButtons=function(){var t,e,i,n,s,a,o,r,l,h,u=this;this.addButton("complete",this.params.l10n.complete,(function(){u.handleClickButtonComplete({xAPI:!0})}),this.params.behaviour.enableComplete&&(null===(t=this.previousState)||void 0===t||null===(e=t.tiles)||void 0===e?void 0:e.some((function(t){return!t.isDone}))),{"aria-label":this.params.a11y.complete},{}),this.addButton("hint",this.params.l10n.hint,(function(){u.handleClickButtonHint()}),this.params.behaviour.enableHint&&(null===(i=this.previousState)||void 0===i||null===(n=i.tiles)||void 0===n?void 0:n.some((function(t){return!t.isDone}))),{"aria-label":this.params.a11y.hint},{}),this.addButton("shuffle",this.params.l10n.shuffle,(function(){u.handleClickButtonShuffle()}),void 0===(null===(s=this.previousState)||void 0===s?void 0:s.tiles)||(null===(a=this.previousState)||void 0===a||null===(o=a.tiles)||void 0===o?void 0:o.every((function(t){return!t.isDone}))),{"aria-label":this.params.a11y.shuffle},{}),this.addButton("try-again",this.params.l10n.tryAgain,(function(){u.handleClickButtonRetry()}),this.params.behaviour.enableRetry&&!(null===(r=this.previousState)||void 0===r||!r.tiles)&&(null===(l=this.previousState)||void 0===l||null===(h=l.tiles)||void 0===h?void 0:h.some((function(t){return t.isDone}))),{"aria-label":this.params.a11y.tryAgain},{})},s.disableButtons=function(){for(var t in this.buttons)this.disableButton(t)},s.disableButton=function(t){this.buttons[t]&&(this.buttons[t].setAttribute("disabled",!0),this.buttons[t].classList.add("disabled"))},s.enableButtons=function(){for(var t in this.buttons)this.enableButton(t)},s.enableButton=function(t){this.buttons[t]&&(this.buttons[t].removeAttribute("disabled"),this.buttons[t].classList.remove("disabled"))},s.toggleFullscreen=function(t){var e=this;this.container&&("string"==typeof t&&("enter"===t?t=!1:"exit"===t&&(t=!0)),"boolean"!=typeof t&&(t=!H5P.isFullscreen),!0===t?H5P.fullScreen(H5P.jQuery(this.container),this):(H5P.exitFullScreen(),setTimeout((function(){e.trigger("resize")}),100),setTimeout((function(){e.trigger("resize")}),500)))},s.getAnswerGiven=function(){return!!this.content&&this.content.getAnswerGiven()},s.getScore=function(){return this.content?this.content.getScore():0},s.getMaxScore=function(){return this.params.tilesHorizontal*this.params.tilesVertical},s.showSolutions=function(){this.content||(this.content.stopOverlayShowing(),this.handleClickButtonComplete({xAPI:!1}),this.trigger("resize"))},s.resetTask=function(){this.params.behaviour.enableComplete&&this.showButton("complete"),this.params.behaviour.enableHint&&this.showButton("hint"),this.showButton("shuffle"),this.hideButton("try-again"),this.content&&this.content.reset(),this.handlePuzzleReset(),this.trigger("resize")},s.getXAPIData=function(){return{statement:this.getXAPIAnsweredEvent().data.statement}},s.getXAPIAnsweredEvent=function(){var t=this.createXAPIEvent("answered");return t.setScoredResult(this.getScore(),this.getMaxScore(),this,!0,this.isPassed()),t.data.statement=a.extend({result:{extensions:{"https://snordian.de/x-api/extension/time-left":a.toISO8601TimePeriod(this.content.getTimeLeft())}}},t.data.statement),t},s.getXAPIPressedEvent=function(t){var e=this.createXAPIEvent("");return e.data.statement.verb={id:"https://w3id.org/xapi/seriousgames/verbs/pressed",display:{"en-US":"pressed"}},e.data.statement.object.definition.extensions["http://id.tincanapi.com/extension/purpose"]=t,e},s.createXAPIEvent=function(t){var e=this.createXAPIEventTemplate(t);return a.extend(e.getVerifiedStatementValue(["object","definition"]),this.getxAPIDefinition()),e},s.getxAPIDefinition=function(){var t=this.getDescription();return this.params.behaviour.timeLimit&&(t="".concat(t," (").concat(this.params.l10n.timeLimit,": ").concat(a.formatTime(this.params.behaviour.timeLimit),")")),{name:{"en-US":this.getTitle()},description:{"en-US":t},type:"http://adlnet.gov/expapi/activities/cmi.interaction",interactionType:"other",extensions:{"https://snordian.de/x-api/extension/time-limit":a.toISO8601TimePeriod(this.params.behaviour.timeLimit)}}},s.isPassed=function(){return this.getScore()>=this.getMaxScore()},s.getTitle=function(){var t;return this.extras.metadata&&(t=this.extras.metadata.title),t=t||n.DEFAULT_DESCRIPTION,H5P.createTitle(t)},s.getDescription=function(){return this.params.taskDescription||n.DEFAULT_DESCRIPTION},s.getCurrentState=function(){var t,e,i,n;if(null!==(t=this.params)&&void 0!==t&&null!==(e=t.puzzleImage)&&void 0!==e&&null!==(i=e.params)&&void 0!==i&&null!==(n=i.file)&&void 0!==n&&n.path&&this.content)return this.content.getCurrentState()},s.handleDOMInitialized=function(){var t=this;this.container=a.closestParent(this.content.getDOM(),".h5p-container.h5p-jigsaw-puzzle"),this.container&&(this.content.setH5PQuestionElements(this.container),this.content.enableFullscreenButton(),this.on("enterFullScreen",(function(){setTimeout((function(){t.content.toggleFullscreen(!0)}),200)})),this.on("exitFullScreen",(function(){t.content.toggleFullscreen(!1)})),this.buttons={},this.buttons.complete=this.container.querySelector(".h5p-question-complete"),this.buttons.hint=this.container.querySelector(".h5p-question-hint"),this.buttons["try-again"]=this.container.querySelector(".h5p-question-try-again"))},s.handleH5PResized=function(){!this.bubblingUpwards&&this.content&&this.content.handleResized()},s.handleOnResize=function(){this.bubblingUpwards=!0,this.trigger("resize"),this.bubblingUpwards=!1},s.handleHintStarted=function(){this.disableButtons(),this.content.showHint()},s.handleHintDone=function(){this.enableButtons()},s.handleInteracted=function(){this.getScore()>0&&(this.showButton("try-again"),this.hideButton("shuffle")),this.triggerXAPI("interacted")},s.handlePuzzleCompleted=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.hideButton("complete"),this.hideButton("hint"),this.hideButton("shuffle"),this.showButton("try-again"),t.xAPI&&this.trigger(this.getXAPIAnsweredEvent())},s.handleClickButtonComplete=function(t){this.handleInteracted(),this.trigger(this.getXAPIPressedEvent("complete")),this.content.handlePuzzleCompleted(t),this.content.moveTilesToTarget(),this.handleContentChanged()},s.handleClickButtonHint=function(){this.trigger(this.getXAPIPressedEvent("show hint")),this.content.incrementHintCounter(),this.handleHintStarted()},s.handleClickButtonShuffle=function(){this.content.randomizeTiles({useFullArea:this.params.behaviour.useFullArea,layout:this.params.behaviour.randomizerPattern}),this.handleContentChanged()},s.handleClickButtonRetry=function(){this.resetTask()},s.handlePuzzleReset=function(){this.trigger("reset"),this.handleContentChanged()},s.handleContentChanged=function(){this.trigger("kllStoreSessionState",void 0,{bubbles:!0,external:!0})},n}(H5P.Question);T.DEFAULT_DESCRIPTION="Jigsaw Puzzle",H5P=H5P||{},H5P.JigsawPuzzleKID=T}();;
var oldTether = window.Tether;
!function(t,e){"function"==typeof define&&define.amd?define(e):"object"==typeof exports?module.exports=e(require,exports,module):t.Tether=e()}(this,function(t,e,o){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t){var e=getComputedStyle(t),o=e.position;if("fixed"===o)return t;for(var i=t;i=i.parentNode;){var n=void 0;try{n=getComputedStyle(i)}catch(r){}if("undefined"==typeof n||null===n)return i;var s=n.overflow,a=n.overflowX,f=n.overflowY;if(/(auto|scroll)/.test(s+f+a)&&("absolute"!==o||["relative","absolute","fixed"].indexOf(n.position)>=0))return i}return document.body}function r(t){var e=void 0;t===document?(e=document,t=document.documentElement):e=t.ownerDocument;var o=e.documentElement,i={},n=t.getBoundingClientRect();for(var r in n)i[r]=n[r];var s=x(e);return i.top-=s.top,i.left-=s.left,"undefined"==typeof i.width&&(i.width=document.body.scrollWidth-i.left-i.right),"undefined"==typeof i.height&&(i.height=document.body.scrollHeight-i.top-i.bottom),i.top=i.top-o.clientTop,i.left=i.left-o.clientLeft,i.right=e.body.clientWidth-i.width-i.left,i.bottom=e.body.clientHeight-i.height-i.top,i}function s(t){return t.offsetParent||document.documentElement}function a(){var t=document.createElement("div");t.style.width="100%",t.style.height="200px";var e=document.createElement("div");f(e.style,{position:"absolute",top:0,left:0,pointerEvents:"none",visibility:"hidden",width:"200px",height:"150px",overflow:"hidden"}),e.appendChild(t),document.body.appendChild(e);var o=t.offsetWidth;e.style.overflow="scroll";var i=t.offsetWidth;o===i&&(i=e.clientWidth),document.body.removeChild(e);var n=o-i;return{width:n,height:n}}function f(){var t=void 0===arguments[0]?{}:arguments[0],e=[];return Array.prototype.push.apply(e,arguments),e.slice(1).forEach(function(e){if(e)for(var o in e)({}).hasOwnProperty.call(e,o)&&(t[o]=e[o])}),t}function h(t,e){if("undefined"!=typeof t.classList)e.split(" ").forEach(function(e){e.trim()&&t.classList.remove(e)});else{var o=new RegExp("(^| )"+e.split(" ").join("|")+"( |$)","gi"),i=u(t).replace(o," ");p(t,i)}}function l(t,e){if("undefined"!=typeof t.classList)e.split(" ").forEach(function(e){e.trim()&&t.classList.add(e)});else{h(t,e);var o=u(t)+(" "+e);p(t,o)}}function d(t,e){if("undefined"!=typeof t.classList)return t.classList.contains(e);var o=u(t);return new RegExp("(^| )"+e+"( |$)","gi").test(o)}function u(t){return t.className instanceof SVGAnimatedString?t.className.baseVal:t.className}function p(t,e){t.setAttribute("class",e)}function c(t,e,o){o.forEach(function(o){-1===e.indexOf(o)&&d(t,o)&&h(t,o)}),e.forEach(function(e){d(t,e)||l(t,e)})}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function g(t,e){var o=void 0===arguments[2]?1:arguments[2];return t+o>=e&&e>=t-o}function m(){return"undefined"!=typeof performance&&"undefined"!=typeof performance.now?performance.now():+new Date}function v(){for(var t={top:0,left:0},e=arguments.length,o=Array(e),i=0;e>i;i++)o[i]=arguments[i];return o.forEach(function(e){var o=e.top,i=e.left;"string"==typeof o&&(o=parseFloat(o,10)),"string"==typeof i&&(i=parseFloat(i,10)),t.top+=o,t.left+=i}),t}function y(t,e){return"string"==typeof t.left&&-1!==t.left.indexOf("%")&&(t.left=parseFloat(t.left,10)/100*e.width),"string"==typeof t.top&&-1!==t.top.indexOf("%")&&(t.top=parseFloat(t.top,10)/100*e.height),t}function b(t,e){return"scrollParent"===e?e=t.scrollParent:"window"===e&&(e=[pageXOffset,pageYOffset,innerWidth+pageXOffset,innerHeight+pageYOffset]),e===document&&(e=e.documentElement),"undefined"!=typeof e.nodeType&&!function(){var t=r(e),o=t,i=getComputedStyle(e);e=[o.left,o.top,t.width+o.left,t.height+o.top],U.forEach(function(t,o){t=t[0].toUpperCase()+t.substr(1),"Top"===t||"Left"===t?e[o]+=parseFloat(i["border"+t+"Width"]):e[o]-=parseFloat(i["border"+t+"Width"])})}(),e}var w=function(){function t(t,e){for(var o=0;o<e.length;o++){var i=e[o];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,o,i){return o&&t(e.prototype,o),i&&t(e,i),e}}(),C=void 0;"undefined"==typeof C&&(C={modules:[]});var O=function(){var t=0;return function(){return++t}}(),E={},x=function(t){var e=t._tetherZeroElement;"undefined"==typeof e&&(e=t.createElement("div"),e.setAttribute("data-tether-id",O()),f(e.style,{top:0,left:0,position:"absolute"}),t.body.appendChild(e),t._tetherZeroElement=e);var o=e.getAttribute("data-tether-id");if("undefined"==typeof E[o]){E[o]={};var i=e.getBoundingClientRect();for(var n in i)E[o][n]=i[n];T(function(){delete E[o]})}return E[o]},A=[],T=function(t){A.push(t)},S=function(){for(var t=void 0;t=A.pop();)t()},W=function(){function t(){i(this,t)}return w(t,[{key:"on",value:function(t,e,o){var i=void 0===arguments[3]?!1:arguments[3];"undefined"==typeof this.bindings&&(this.bindings={}),"undefined"==typeof this.bindings[t]&&(this.bindings[t]=[]),this.bindings[t].push({handler:e,ctx:o,once:i})}},{key:"once",value:function(t,e,o){this.on(t,e,o,!0)}},{key:"off",value:function(t,e){if("undefined"==typeof this.bindings||"undefined"==typeof this.bindings[t])if("undefined"==typeof e)delete this.bindings[t];else for(var o=0;o<this.bindings[t].length;)this.bindings[t][o].handler===e?this.bindings[t].splice(o,1):++o}},{key:"trigger",value:function(t){if("undefined"!=typeof this.bindings&&this.bindings[t])for(var e=0;e<this.bindings[t].length;){var o=this.bindings[t][e],i=o.handler,n=o.ctx,r=o.once,s=n;"undefined"==typeof s&&(s=this);for(var a=arguments.length,f=Array(a>1?a-1:0),h=1;a>h;h++)f[h-1]=arguments[h];i.apply(s,f),r?this.bindings[t].splice(e,1):++e}}}]),t}();C.Utils={getScrollParent:n,getBounds:r,getOffsetParent:s,extend:f,addClass:l,removeClass:h,hasClass:d,updateClasses:c,defer:T,flush:S,uniqueId:O,Evented:W,getScrollBarSize:a};var M=function(){function t(t,e){var o=[],i=!0,n=!1,r=void 0;try{for(var s,a=t[Symbol.iterator]();!(i=(s=a.next()).done)&&(o.push(s.value),!e||o.length!==e);i=!0);}catch(f){n=!0,r=f}finally{try{!i&&a["return"]&&a["return"]()}finally{if(n)throw r}}return o}return function(e,o){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,o);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),w=function(){function t(t,e){for(var o=0;o<e.length;o++){var i=e[o];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,o,i){return o&&t(e.prototype,o),i&&t(e,i),e}}();if("undefined"==typeof C)throw new Error("You must include the utils.js file before tether.js");var P=C.Utils,n=P.getScrollParent,r=P.getBounds,s=P.getOffsetParent,f=P.extend,l=P.addClass,h=P.removeClass,c=P.updateClasses,T=P.defer,S=P.flush,a=P.getScrollBarSize,k=function(){for(var t=document.createElement("div"),e=["transform","webkitTransform","OTransform","MozTransform","msTransform"],o=0;o<e.length;++o){var i=e[o];if(void 0!==t.style[i])return i}}(),B=[],_=function(){B.forEach(function(t){t.position(!1)}),S()};!function(){var t=null,e=null,o=null,i=function n(){return"undefined"!=typeof e&&e>16?(e=Math.min(e-16,250),void(o=setTimeout(n,250))):void("undefined"!=typeof t&&m()-t<10||("undefined"!=typeof o&&(clearTimeout(o),o=null),t=m(),_(),e=m()-t))};["resize","scroll","touchmove"].forEach(function(t){window.addEventListener(t,i)})}();var z={center:"center",left:"right",right:"left"},F={middle:"middle",top:"bottom",bottom:"top"},L={top:0,left:0,middle:"50%",center:"50%",bottom:"100%",right:"100%"},Y=function(t,e){var o=t.left,i=t.top;return"auto"===o&&(o=z[e.left]),"auto"===i&&(i=F[e.top]),{left:o,top:i}},H=function(t){var e=t.left,o=t.top;return"undefined"!=typeof L[t.left]&&(e=L[t.left]),"undefined"!=typeof L[t.top]&&(o=L[t.top]),{left:e,top:o}},X=function(t){var e=t.split(" "),o=M(e,2),i=o[0],n=o[1];return{top:i,left:n}},j=X,N=function(){function t(e){var o=this;i(this,t),this.position=this.position.bind(this),B.push(this),this.history=[],this.setOptions(e,!1),C.modules.forEach(function(t){"undefined"!=typeof t.initialize&&t.initialize.call(o)}),this.position()}return w(t,[{key:"getClass",value:function(){var t=void 0===arguments[0]?"":arguments[0],e=this.options.classes;return"undefined"!=typeof e&&e[t]?this.options.classes[t]:this.options.classPrefix?this.options.classPrefix+"-"+t:t}},{key:"setOptions",value:function(t){var e=this,o=void 0===arguments[1]?!0:arguments[1],i={offset:"0 0",targetOffset:"0 0",targetAttachment:"auto auto",classPrefix:"tether"};this.options=f(i,t);var r=this.options,s=r.element,a=r.target,h=r.targetModifier;if(this.element=s,this.target=a,this.targetModifier=h,"viewport"===this.target?(this.target=document.body,this.targetModifier="visible"):"scroll-handle"===this.target&&(this.target=document.body,this.targetModifier="scroll-handle"),["element","target"].forEach(function(t){if("undefined"==typeof e[t])throw new Error("Tether Error: Both element and target must be defined");"undefined"!=typeof e[t].jquery?e[t]=e[t][0]:"string"==typeof e[t]&&(e[t]=document.querySelector(e[t]))}),l(this.element,this.getClass("element")),this.options.addTargetClasses!==!1&&l(this.target,this.getClass("target")),!this.options.attachment)throw new Error("Tether Error: You must provide an attachment");this.targetAttachment=j(this.options.targetAttachment),this.attachment=j(this.options.attachment),this.offset=X(this.options.offset),this.targetOffset=X(this.options.targetOffset),"undefined"!=typeof this.scrollParent&&this.disable(),this.scrollParent="scroll-handle"===this.targetModifier?this.target:n(this.target),this.options.enabled!==!1&&this.enable(o)}},{key:"getTargetBounds",value:function(){if("undefined"==typeof this.targetModifier)return r(this.target);if("visible"===this.targetModifier){if(this.target===document.body)return{top:pageYOffset,left:pageXOffset,height:innerHeight,width:innerWidth};var t=r(this.target),e={height:t.height,width:t.width,top:t.top,left:t.left};return e.height=Math.min(e.height,t.height-(pageYOffset-t.top)),e.height=Math.min(e.height,t.height-(t.top+t.height-(pageYOffset+innerHeight))),e.height=Math.min(innerHeight,e.height),e.height-=2,e.width=Math.min(e.width,t.width-(pageXOffset-t.left)),e.width=Math.min(e.width,t.width-(t.left+t.width-(pageXOffset+innerWidth))),e.width=Math.min(innerWidth,e.width),e.width-=2,e.top<pageYOffset&&(e.top=pageYOffset),e.left<pageXOffset&&(e.left=pageXOffset),e}if("scroll-handle"===this.targetModifier){var t=void 0,o=this.target;o===document.body?(o=document.documentElement,t={left:pageXOffset,top:pageYOffset,height:innerHeight,width:innerWidth}):t=r(o);var i=getComputedStyle(o),n=o.scrollWidth>o.clientWidth||[i.overflow,i.overflowX].indexOf("scroll")>=0||this.target!==document.body,s=0;n&&(s=15);var a=t.height-parseFloat(i.borderTopWidth)-parseFloat(i.borderBottomWidth)-s,e={width:15,height:.975*a*(a/o.scrollHeight),left:t.left+t.width-parseFloat(i.borderLeftWidth)-15},f=0;408>a&&this.target===document.body&&(f=-11e-5*Math.pow(a,2)-.00727*a+22.58),this.target!==document.body&&(e.height=Math.max(e.height,24));var h=this.target.scrollTop/(o.scrollHeight-a);return e.top=h*(a-e.height-f)+t.top+parseFloat(i.borderTopWidth),this.target===document.body&&(e.height=Math.max(e.height,24)),e}}},{key:"clearCache",value:function(){this._cache={}}},{key:"cache",value:function(t,e){return"undefined"==typeof this._cache&&(this._cache={}),"undefined"==typeof this._cache[t]&&(this._cache[t]=e.call(this)),this._cache[t]}},{key:"enable",value:function(){var t=void 0===arguments[0]?!0:arguments[0];this.options.addTargetClasses!==!1&&l(this.target,this.getClass("enabled")),l(this.element,this.getClass("enabled")),this.enabled=!0,this.scrollParent!==document&&this.scrollParent.addEventListener("scroll",this.position),t&&this.position()}},{key:"disable",value:function(){h(this.target,this.getClass("enabled")),h(this.element,this.getClass("enabled")),this.enabled=!1,"undefined"!=typeof this.scrollParent&&this.scrollParent.removeEventListener("scroll",this.position)}},{key:"destroy",value:function(){var t=this;this.disable(),B.forEach(function(e,o){return e===t?void B.splice(o,1):void 0})}},{key:"updateAttachClasses",value:function(t,e){var o=this;t=t||this.attachment,e=e||this.targetAttachment;var i=["left","top","bottom","right","middle","center"];"undefined"!=typeof this._addAttachClasses&&this._addAttachClasses.length&&this._addAttachClasses.splice(0,this._addAttachClasses.length),"undefined"==typeof this._addAttachClasses&&(this._addAttachClasses=[]);var n=this._addAttachClasses;t.top&&n.push(this.getClass("element-attached")+"-"+t.top),t.left&&n.push(this.getClass("element-attached")+"-"+t.left),e.top&&n.push(this.getClass("target-attached")+"-"+e.top),e.left&&n.push(this.getClass("target-attached")+"-"+e.left);var r=[];i.forEach(function(t){r.push(o.getClass("element-attached")+"-"+t),r.push(o.getClass("target-attached")+"-"+t)}),T(function(){"undefined"!=typeof o._addAttachClasses&&(c(o.element,o._addAttachClasses,r),o.options.addTargetClasses!==!1&&c(o.target,o._addAttachClasses,r),delete o._addAttachClasses)})}},{key:"position",value:function(){var t=this,e=void 0===arguments[0]?!0:arguments[0];if(this.enabled){this.clearCache();var o=Y(this.targetAttachment,this.attachment);this.updateAttachClasses(this.attachment,o);var i=this.cache("element-bounds",function(){return r(t.element)}),n=i.width,f=i.height;if(0===n&&0===f&&"undefined"!=typeof this.lastSize){var h=this.lastSize;n=h.width,f=h.height}else this.lastSize={width:n,height:f};var l=this.cache("target-bounds",function(){return t.getTargetBounds()}),d=l,u=y(H(this.attachment),{width:n,height:f}),p=y(H(o),d),c=y(this.offset,{width:n,height:f}),g=y(this.targetOffset,d);u=v(u,c),p=v(p,g);for(var m=l.left+p.left-u.left,b=l.top+p.top-u.top,w=0;w<C.modules.length;++w){var O=C.modules[w],E=O.position.call(this,{left:m,top:b,targetAttachment:o,targetPos:l,elementPos:i,offset:u,targetOffset:p,manualOffset:c,manualTargetOffset:g,scrollbarSize:A,attachment:this.attachment});if(E===!1)return!1;"undefined"!=typeof E&&"object"==typeof E&&(b=E.top,m=E.left)}var x={page:{top:b,left:m},viewport:{top:b-pageYOffset,bottom:pageYOffset-b-f+innerHeight,left:m-pageXOffset,right:pageXOffset-m-n+innerWidth}},A=void 0;return document.body.scrollWidth>window.innerWidth&&(A=this.cache("scrollbar-size",a),x.viewport.bottom-=A.height),document.body.scrollHeight>window.innerHeight&&(A=this.cache("scrollbar-size",a),x.viewport.right-=A.width),(-1===["","static"].indexOf(document.body.style.position)||-1===["","static"].indexOf(document.body.parentElement.style.position))&&(x.page.bottom=document.body.scrollHeight-b-f,x.page.right=document.body.scrollWidth-m-n),"undefined"!=typeof this.options.optimizations&&this.options.optimizations.moveElement!==!1&&"undefined"==typeof this.targetModifier&&!function(){var e=t.cache("target-offsetparent",function(){return s(t.target)}),o=t.cache("target-offsetparent-bounds",function(){return r(e)}),i=getComputedStyle(e),n=o,a={};if(["Top","Left","Bottom","Right"].forEach(function(t){a[t.toLowerCase()]=parseFloat(i["border"+t+"Width"])}),o.right=document.body.scrollWidth-o.left-n.width+a.right,o.bottom=document.body.scrollHeight-o.top-n.height+a.bottom,x.page.top>=o.top+a.top&&x.page.bottom>=o.bottom&&x.page.left>=o.left+a.left&&x.page.right>=o.right){var f=e.scrollTop,h=e.scrollLeft;x.offset={top:x.page.top-o.top+f-a.top,left:x.page.left-o.left+h-a.left}}}(),this.move(x),this.history.unshift(x),this.history.length>3&&this.history.pop(),e&&S(),!0}}},{key:"move",value:function(t){var e=this;if("undefined"!=typeof this.element.parentNode){var o={};for(var i in t){o[i]={};for(var n in t[i]){for(var r=!1,a=0;a<this.history.length;++a){var h=this.history[a];if("undefined"!=typeof h[i]&&!g(h[i][n],t[i][n])){r=!0;break}}r||(o[i][n]=!0)}}var l={top:"",left:"",right:"",bottom:""},d=function(t,o){var i="undefined"!=typeof e.options.optimizations,n=i?e.options.optimizations.gpu:null;if(n!==!1){var r=void 0,s=void 0;t.top?(l.top=0,r=o.top):(l.bottom=0,r=-o.bottom),t.left?(l.left=0,s=o.left):(l.right=0,s=-o.right),l[k]="translateX("+Math.round(s)+"px) translateY("+Math.round(r)+"px)","msTransform"!==k&&(l[k]+=" translateZ(0)")}else t.top?l.top=o.top+"px":l.bottom=o.bottom+"px",t.left?l.left=o.left+"px":l.right=o.right+"px"},u=!1;(o.page.top||o.page.bottom)&&(o.page.left||o.page.right)?(l.position="absolute",d(o.page,t.page)):(o.viewport.top||o.viewport.bottom)&&(o.viewport.left||o.viewport.right)?(l.position="fixed",d(o.viewport,t.viewport)):"undefined"!=typeof o.offset&&o.offset.top&&o.offset.left?!function(){l.position="absolute";var i=e.cache("target-offsetparent",function(){return s(e.target)});s(e.element)!==i&&T(function(){e.element.parentNode.removeChild(e.element),i.appendChild(e.element)}),d(o.offset,t.offset),u=!0}():(l.position="absolute",d({top:!0,left:!0},t.page)),u||"BODY"===this.element.parentNode.tagName||(this.element.parentNode.removeChild(this.element),document.body.appendChild(this.element));var p={},c=!1;for(var n in l){var m=l[n],v=this.element.style[n];""!==v&&""!==m&&["top","left","bottom","right"].indexOf(n)>=0&&(v=parseFloat(v),m=parseFloat(m)),v!==m&&(c=!0,p[n]=m)}c&&T(function(){f(e.element.style,p)})}}}]),t}();N.modules=[],C.position=_;var R=f(N,C),M=function(){function t(t,e){var o=[],i=!0,n=!1,r=void 0;try{for(var s,a=t[Symbol.iterator]();!(i=(s=a.next()).done)&&(o.push(s.value),!e||o.length!==e);i=!0);}catch(f){n=!0,r=f}finally{try{!i&&a["return"]&&a["return"]()}finally{if(n)throw r}}return o}return function(e,o){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,o);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),P=C.Utils,r=P.getBounds,f=P.extend,c=P.updateClasses,T=P.defer,U=["left","top","right","bottom"];C.modules.push({position:function(t){var e=this,o=t.top,i=t.left,n=t.targetAttachment;if(!this.options.constraints)return!0;var s=this.cache("element-bounds",function(){return r(e.element)}),a=s.height,h=s.width;if(0===h&&0===a&&"undefined"!=typeof this.lastSize){var l=this.lastSize;h=l.width,a=l.height}var d=this.cache("target-bounds",function(){return e.getTargetBounds()}),u=d.height,p=d.width,g=[this.getClass("pinned"),this.getClass("out-of-bounds")];this.options.constraints.forEach(function(t){var e=t.outOfBoundsClass,o=t.pinnedClass;e&&g.push(e),o&&g.push(o)}),g.forEach(function(t){["left","top","right","bottom"].forEach(function(e){g.push(t+"-"+e)})});var m=[],v=f({},n),y=f({},this.attachment);return this.options.constraints.forEach(function(t){var r=t.to,s=t.attachment,f=t.pin;"undefined"==typeof s&&(s="");var l=void 0,d=void 0;if(s.indexOf(" ")>=0){var c=s.split(" "),g=M(c,2);d=g[0],l=g[1]}else l=d=s;var w=b(e,r);("target"===d||"both"===d)&&(o<w[1]&&"top"===v.top&&(o+=u,v.top="bottom"),o+a>w[3]&&"bottom"===v.top&&(o-=u,v.top="top")),"together"===d&&(o<w[1]&&"top"===v.top&&("bottom"===y.top?(o+=u,v.top="bottom",o+=a,y.top="top"):"top"===y.top&&(o+=u,v.top="bottom",o-=a,y.top="bottom")),o+a>w[3]&&"bottom"===v.top&&("top"===y.top?(o-=u,v.top="top",o-=a,y.top="bottom"):"bottom"===y.top&&(o-=u,v.top="top",o+=a,y.top="top")),"middle"===v.top&&(o+a>w[3]&&"top"===y.top?(o-=a,y.top="bottom"):o<w[1]&&"bottom"===y.top&&(o+=a,y.top="top"))),("target"===l||"both"===l)&&(i<w[0]&&"left"===v.left&&(i+=p,v.left="right"),i+h>w[2]&&"right"===v.left&&(i-=p,v.left="left")),"together"===l&&(i<w[0]&&"left"===v.left?"right"===y.left?(i+=p,v.left="right",i+=h,y.left="left"):"left"===y.left&&(i+=p,v.left="right",i-=h,y.left="right"):i+h>w[2]&&"right"===v.left?"left"===y.left?(i-=p,v.left="left",i-=h,y.left="right"):"right"===y.left&&(i-=p,v.left="left",i+=h,y.left="left"):"center"===v.left&&(i+h>w[2]&&"left"===y.left?(i-=h,y.left="right"):i<w[0]&&"right"===y.left&&(i+=h,y.left="left"))),("element"===d||"both"===d)&&(o<w[1]&&"bottom"===y.top&&(o+=a,y.top="top"),o+a>w[3]&&"top"===y.top&&(o-=a,y.top="bottom")),("element"===l||"both"===l)&&(i<w[0]&&"right"===y.left&&(i+=h,y.left="left"),i+h>w[2]&&"left"===y.left&&(i-=h,y.left="right")),"string"==typeof f?f=f.split(",").map(function(t){return t.trim()}):f===!0&&(f=["top","left","right","bottom"]),f=f||[];var C=[],O=[];o<w[1]&&(f.indexOf("top")>=0?(o=w[1],C.push("top")):O.push("top")),o+a>w[3]&&(f.indexOf("bottom")>=0?(o=w[3]-a,C.push("bottom")):O.push("bottom")),i<w[0]&&(f.indexOf("left")>=0?(i=w[0],C.push("left")):O.push("left")),i+h>w[2]&&(f.indexOf("right")>=0?(i=w[2]-h,C.push("right")):O.push("right")),C.length&&!function(){var t=void 0;t="undefined"!=typeof e.options.pinnedClass?e.options.pinnedClass:e.getClass("pinned"),m.push(t),C.forEach(function(e){m.push(t+"-"+e)})}(),O.length&&!function(){var t=void 0;t="undefined"!=typeof e.options.outOfBoundsClass?e.options.outOfBoundsClass:e.getClass("out-of-bounds"),m.push(t),O.forEach(function(e){m.push(t+"-"+e)})}(),(C.indexOf("left")>=0||C.indexOf("right")>=0)&&(y.left=v.left=!1),(C.indexOf("top")>=0||C.indexOf("bottom")>=0)&&(y.top=v.top=!1),(v.top!==n.top||v.left!==n.left||y.top!==e.attachment.top||y.left!==e.attachment.left)&&e.updateAttachClasses(y,v)}),T(function(){e.options.addTargetClasses!==!1&&c(e.target,m,g),c(e.element,m,g)}),{top:o,left:i}}});var P=C.Utils,r=P.getBounds,c=P.updateClasses,T=P.defer;C.modules.push({position:function(t){var e=this,o=t.top,i=t.left,n=this.cache("element-bounds",function(){return r(e.element)}),s=n.height,a=n.width,f=this.getTargetBounds(),h=o+s,l=i+a,d=[];o<=f.bottom&&h>=f.top&&["left","right"].forEach(function(t){var e=f[t];(e===i||e===l)&&d.push(t)}),i<=f.right&&l>=f.left&&["top","bottom"].forEach(function(t){var e=f[t];(e===o||e===h)&&d.push(t)});var u=[],p=[],g=["left","top","right","bottom"];return u.push(this.getClass("abutted")),g.forEach(function(t){u.push(e.getClass("abutted")+"-"+t)}),d.length&&p.push(this.getClass("abutted")),d.forEach(function(t){p.push(e.getClass("abutted")+"-"+t)}),T(function(){e.options.addTargetClasses!==!1&&c(e.target,p,u),c(e.element,p,u)}),!0}});var M=function(){function t(t,e){var o=[],i=!0,n=!1,r=void 0;try{for(var s,a=t[Symbol.iterator]();!(i=(s=a.next()).done)&&(o.push(s.value),!e||o.length!==e);i=!0);}catch(f){n=!0,r=f}finally{try{!i&&a["return"]&&a["return"]()}finally{if(n)throw r}}return o}return function(e,o){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,o);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();return C.modules.push({position:function(t){var e=t.top,o=t.left;if(this.options.shift){var i=this.options.shift;"function"==typeof this.options.shift&&(i=this.options.shift.call(this,{top:e,left:o}));var n=void 0,r=void 0;if("string"==typeof i){i=i.split(" "),i[1]=i[1]||i[0];var s=M(i,2);n=s[0],r=s[1],n=parseFloat(n,10),r=parseFloat(r,10)}else n=i.top,r=i.left;return e+=n,o+=r,{top:e,left:o}}}}),R});
H5P.Tether = Tether;
window.Tether = oldTether;
;
var oldDrop = window.Drop;
var oldTether = window.Tether;
Tether = H5P.Tether;
!function(t,e){"function"==typeof define&&define.amd?define(["tether"],e):"object"==typeof exports?module.exports=e(require("tether")):t.Drop=e(t.Tether)}(this,function(t){"use strict";function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function o(t){var e=t.split(" "),n=a(e,2),o=n[0],i=n[1];if(["left","right"].indexOf(o)>=0){var s=[i,o];o=s[0],i=s[1]}return[o,i].join(" ")}function i(t,e){for(var n=void 0,o=[];-1!==(n=t.indexOf(e));)o.push(t.splice(n,1));return o}function s(){var a=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],u=function(){for(var t=arguments.length,e=Array(t),n=0;t>n;n++)e[n]=arguments[n];return new(r.apply(b,[null].concat(e)))};p(u,{createContext:s,drops:[],defaults:{}});var g={classPrefix:"drop",defaults:{position:"bottom left",openOn:"click",beforeClose:null,constrainToScrollParent:!0,constrainToWindow:!0,classes:"",remove:!1,tetherOptions:{}}};p(u,g,a),p(u.defaults,g.defaults,a.defaults),"undefined"==typeof x[u.classPrefix]&&(x[u.classPrefix]=[]),u.updateBodyClasses=function(){for(var t=!1,e=x[u.classPrefix],n=e.length,o=0;n>o;++o)if(e[o].isOpened()){t=!0;break}t?d(document.body,u.classPrefix+"-open"):c(document.body,u.classPrefix+"-open")};var b=function(s){function r(t){if(e(this,r),l(Object.getPrototypeOf(r.prototype),"constructor",this).call(this),this.options=p({},u.defaults,t),this.target=this.options.target,"undefined"==typeof this.target)throw new Error("Drop Error: You must provide a target.");var n="data-"+u.classPrefix,o=this.target.getAttribute(n);o&&(this.options.content=o);for(var i=["position","openOn"],s=0;s<i.length;++s){var a=this.target.getAttribute(n+"-"+i[s]);a&&(this.options[i[s]]=a)}this.options.classes&&this.options.addTargetClasses!==!1&&d(this.target,this.options.classes),u.drops.push(this),x[u.classPrefix].push(this),this._boundEvents=[],this.bindMethods(),this.setupElements(),this.setupEvents(),this.setupTether()}return n(r,s),h(r,[{key:"_on",value:function(t,e,n){this._boundEvents.push({element:t,event:e,handler:n}),t.addEventListener(e,n)}},{key:"bindMethods",value:function(){this.transitionEndHandler=this._transitionEndHandler.bind(this)}},{key:"setupElements",value:function(){var t=this;if(this.drop=document.createElement("div"),d(this.drop,u.classPrefix),this.options.classes&&d(this.drop,this.options.classes),this.content=document.createElement("div"),d(this.content,u.classPrefix+"-content"),"function"==typeof this.options.content){var e=function(){var e=t.options.content.call(t,t);if("string"==typeof e)t.content.innerHTML=e;else{if("object"!=typeof e)throw new Error("Drop Error: Content function should return a string or HTMLElement.");t.content.innerHTML="",t.content.appendChild(e)}};e(),this.on("open",e.bind(this))}else"object"==typeof this.options.content?this.content.appendChild(this.options.content):this.content.innerHTML=this.options.content;this.drop.appendChild(this.content)}},{key:"setupTether",value:function(){var e=this.options.position.split(" ");e[0]=E[e[0]],e=e.join(" ");var n=[];this.options.constrainToScrollParent?n.push({to:"scrollParent",pin:"top, bottom",attachment:"together none"}):n.push({to:"scrollParent"}),this.options.constrainToWindow!==!1?n.push({to:"window",attachment:"together"}):n.push({to:"window"});var i={element:this.drop,target:this.target,attachment:o(e),targetAttachment:o(this.options.position),classPrefix:u.classPrefix,offset:"0 0",targetOffset:"0 0",enabled:!1,constraints:n,addTargetClasses:this.options.addTargetClasses};this.options.tetherOptions!==!1&&(this.tether=new t(p({},i,this.options.tetherOptions)))}},{key:"setupEvents",value:function(){var t=this;if(this.options.openOn){if("always"===this.options.openOn)return void setTimeout(this.open.bind(this));var e=this.options.openOn.split(" ");if(e.indexOf("click")>=0)for(var n=function(e){t.toggle(e),e.preventDefault()},o=function(e){t.isOpened()&&(e.target===t.drop||t.drop.contains(e.target)||e.target===t.target||t.target.contains(e.target)||t.close(e))},i=0;i<y.length;++i){var s=y[i];this._on(this.target,s,n),this._on(document,s,o)}var r=!1,a=null,h=function(e){r=!0,t.open(e)},l=function(e){r=!1,"undefined"!=typeof a&&clearTimeout(a),a=setTimeout(function(){r||t.close(e),a=null},50)};e.indexOf("hover")>=0&&(this._on(this.target,"mouseover",h),this._on(this.drop,"mouseover",h),this._on(this.target,"mouseout",l),this._on(this.drop,"mouseout",l)),e.indexOf("focus")>=0&&(this._on(this.target,"focus",h),this._on(this.drop,"focus",h),this._on(this.target,"blur",l),this._on(this.drop,"blur",l))}}},{key:"isOpened",value:function(){return this.drop?f(this.drop,u.classPrefix+"-open"):void 0}},{key:"toggle",value:function(t){this.isOpened()?this.close(t):this.open(t)}},{key:"open",value:function(t){var e=this;this.isOpened()||(this.drop.parentNode||document.body.appendChild(this.drop),"undefined"!=typeof this.tether&&this.tether.enable(),d(this.drop,u.classPrefix+"-open"),d(this.drop,u.classPrefix+"-open-transitionend"),setTimeout(function(){e.drop&&d(e.drop,u.classPrefix+"-after-open")}),"undefined"!=typeof this.tether&&this.tether.position(),this.trigger("open"),u.updateBodyClasses())}},{key:"_transitionEndHandler",value:function(t){t.target===t.currentTarget&&(f(this.drop,u.classPrefix+"-open")||c(this.drop,u.classPrefix+"-open-transitionend"),this.drop.removeEventListener(m,this.transitionEndHandler))}},{key:"beforeCloseHandler",value:function(t){var e=!0;return this.isClosing||"function"!=typeof this.options.beforeClose||(this.isClosing=!0,e=this.options.beforeClose(t,this)!==!1),this.isClosing=!1,e}},{key:"close",value:function(t){this.isOpened()&&this.beforeCloseHandler(t)&&(c(this.drop,u.classPrefix+"-open"),c(this.drop,u.classPrefix+"-after-open"),this.drop.addEventListener(m,this.transitionEndHandler),this.trigger("close"),"undefined"!=typeof this.tether&&this.tether.disable(),u.updateBodyClasses(),this.options.remove&&this.remove(t))}},{key:"remove",value:function(t){this.close(t),this.drop.parentNode&&this.drop.parentNode.removeChild(this.drop)}},{key:"position",value:function(){this.isOpened()&&"undefined"!=typeof this.tether&&this.tether.position()}},{key:"destroy",value:function(){this.remove(),"undefined"!=typeof this.tether&&this.tether.destroy();for(var t=0;t<this._boundEvents.length;++t){var e=this._boundEvents[t],n=e.element,o=e.event,s=e.handler;n.removeEventListener(o,s)}this._boundEvents=[],this.tether=null,this.drop=null,this.content=null,this.target=null,i(x[u.classPrefix],this),i(u.drops,this)}}]),r}(v);return u}var r=Function.prototype.bind,a=function(){function t(t,e){var n=[],o=!0,i=!1,s=void 0;try{for(var r,a=t[Symbol.iterator]();!(o=(r=a.next()).done)&&(n.push(r.value),!e||n.length!==e);o=!0);}catch(h){i=!0,s=h}finally{try{!o&&a["return"]&&a["return"]()}finally{if(i)throw s}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),h=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),l=function(t,e,n){for(var o=!0;o;){var i=t,s=e,r=n;a=l=h=void 0,o=!1,null===i&&(i=Function.prototype);var a=Object.getOwnPropertyDescriptor(i,s);if(void 0!==a){if("value"in a)return a.value;var h=a.get;return void 0===h?void 0:h.call(r)}var l=Object.getPrototypeOf(i);if(null===l)return void 0;t=l,e=s,n=r,o=!0}},u=t.Utils,p=u.extend,d=u.addClass,c=u.removeClass,f=u.hasClass,v=u.Evented,y=["click"];"ontouchstart"in document.documentElement&&y.push("touchstart");var g={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"},m="";for(var b in g)if({}.hasOwnProperty.call(g,b)){var O=document.createElement("p");"undefined"!=typeof O.style[b]&&(m=g[b])}var E={left:"right",right:"left",top:"bottom",bottom:"top",middle:"middle",center:"center"},x={},P=s();return document.addEventListener("DOMContentLoaded",function(){P.updateBodyClasses()}),P});
H5P.Drop = Drop;
window.Drop = oldDrop;
window.Tether = oldTether;
;
var H5P = H5P || {};
/**
 * Transition contains helper function relevant for transitioning
 */
H5P.Transition = (function ($) {

  /**
   * @class
   * @namespace H5P
   */
  Transition = {};

  /**
   * @private
   */
  Transition.transitionEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'transition':       'transitionend',
    'MozTransition':    'transitionend',
    'OTransition':      'oTransitionEnd',
    'msTransition':     'MSTransitionEnd'
  };

  /**
   * @private
   */
  Transition.cache = [];

  /**
   * Get the vendor property name for an event
   *
   * @function H5P.Transition.getVendorPropertyName
   * @static
   * @private
   * @param  {string} prop Generic property name
   * @return {string}      Vendor specific property name
   */
  Transition.getVendorPropertyName = function (prop) {

    if (Transition.cache[prop] !== undefined) {
      return Transition.cache[prop];
    }

    var div = document.createElement('div');

    // Handle unprefixed versions (FF16+, for example)
    if (prop in div.style) {
      Transition.cache[prop] = prop;
    }
    else {
      var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
      var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

      if (prop in div.style) {
        Transition.cache[prop] = prop;
      }
      else {
        for (var i = 0; i < prefixes.length; ++i) {
          var vendorProp = prefixes[i] + prop_;
          if (vendorProp in div.style) {
            Transition.cache[prop] = vendorProp;
            break;
          }
        }
      }
    }

    return Transition.cache[prop];
  };

  /**
   * Get the name of the transition end event
   *
   * @static
   * @private
   * @return {string}  description
   */
  Transition.getTransitionEndEventName = function () {
    return Transition.transitionEndEventNames[Transition.getVendorPropertyName('transition')] || undefined;
  };

  /**
   * Helper function for listening on transition end events
   *
   * @function H5P.Transition.onTransitionEnd
   * @static
   * @param  {domElement} $element The element which is transitioned
   * @param  {function} callback The callback to be invoked when transition is finished
   * @param  {number} timeout  Timeout in milliseconds. Fallback if transition event is never fired
   */
  Transition.onTransitionEnd = function ($element, callback, timeout) {
    // Fallback on 1 second if transition event is not supported/triggered
    timeout = timeout || 1000;
    Transition.transitionEndEventName = Transition.transitionEndEventName || Transition.getTransitionEndEventName();
    var callbackCalled = false;

    var doCallback = function () {
      if (callbackCalled) {
        return;
      }
      $element.off(Transition.transitionEndEventName, callback);
      callbackCalled = true;
      clearTimeout(timer);
      callback();
    };

    var timer = setTimeout(function () {
      doCallback();
    }, timeout);

    $element.on(Transition.transitionEndEventName, function () {
      doCallback();
    });
  };

  /**
   * Wait for a transition - when finished, invokes next in line
   *
   * @private
   *
   * @param {Object[]}    transitions             Array of transitions
   * @param {H5P.jQuery}  transitions[].$element  Dom element transition is performed on
   * @param {number=}     transitions[].timeout   Timeout fallback if transition end never is triggered
   * @param {bool=}       transitions[].break     If true, sequence breaks after this transition
   * @param {number}      index                   The index for current transition
   */
  var runSequence = function (transitions, index) {
    if (index >= transitions.length) {
      return;
    }

    var transition = transitions[index];
    H5P.Transition.onTransitionEnd(transition.$element, function () {
      if (transition.end) {
        transition.end();
      }
      if (transition.break !== true) {
        runSequence(transitions, index+1);
      }
    }, transition.timeout || undefined);
  };

  /**
   * Run a sequence of transitions
   *
   * @function H5P.Transition.sequence
   * @static
   * @param {Object[]}    transitions             Array of transitions
   * @param {H5P.jQuery}  transitions[].$element  Dom element transition is performed on
   * @param {number=}     transitions[].timeout   Timeout fallback if transition end never is triggered
   * @param {bool=}       transitions[].break     If true, sequence breaks after this transition
   */
  Transition.sequence = function (transitions) {
    runSequence(transitions, 0);
  };

  return Transition;
})(H5P.jQuery);
;
var H5P = H5P || {};

/**
 * Class responsible for creating a help text dialog
 */
H5P.JoubelHelpTextDialog = (function ($) {

  var numInstances = 0;
  /**
   * Display a pop-up containing a message.
   *
   * @param {H5P.jQuery}  $container  The container which message dialog will be appended to
   * @param {string}      message     The message
   * @param {string}      closeButtonTitle The title for the close button
   * @return {H5P.jQuery}
   */
  function JoubelHelpTextDialog(header, message, closeButtonTitle) {
    H5P.EventDispatcher.call(this);

    var self = this;

    numInstances++;
    var headerId = 'joubel-help-text-header-' + numInstances;
    var helpTextId = 'joubel-help-text-body-' + numInstances;

    var $helpTextDialogBox = $('<div>', {
      'class': 'joubel-help-text-dialog-box',
      'role': 'dialog',
      'aria-labelledby': headerId,
      'aria-describedby': helpTextId
    });

    $('<div>', {
      'class': 'joubel-help-text-dialog-background'
    }).appendTo($helpTextDialogBox);

    var $helpTextDialogContainer = $('<div>', {
      'class': 'joubel-help-text-dialog-container'
    }).appendTo($helpTextDialogBox);

    $('<div>', {
      'class': 'joubel-help-text-header',
      'id': headerId,
      'role': 'header',
      'html': header
    }).appendTo($helpTextDialogContainer);

    $('<div>', {
      'class': 'joubel-help-text-body',
      'id': helpTextId,
      'html': message,
      'role': 'document',
      'tabindex': 0
    }).appendTo($helpTextDialogContainer);

    var handleClose = function () {
      $helpTextDialogBox.remove();
      self.trigger('closed');
    };

    var $closeButton = $('<div>', {
      'class': 'joubel-help-text-remove',
      'role': 'button',
      'title': closeButtonTitle,
      'tabindex': 1,
      'click': handleClose,
      'keydown': function (event) {
        // 32 - space, 13 - enter
        if ([32, 13].indexOf(event.which) !== -1) {
          event.preventDefault();
          handleClose();
        }
      }
    }).appendTo($helpTextDialogContainer);

    /**
     * Get the DOM element
     * @return {HTMLElement}
     */
    self.getElement = function () {
      return $helpTextDialogBox;
    };

    self.focus = function () {
      $closeButton.focus();
    };
  }

  JoubelHelpTextDialog.prototype = Object.create(H5P.EventDispatcher.prototype);
  JoubelHelpTextDialog.prototype.constructor = JoubelHelpTextDialog;

  return JoubelHelpTextDialog;
}(H5P.jQuery));
;
var H5P = H5P || {};

/**
 * Class responsible for creating auto-disappearing dialogs
 */
H5P.JoubelMessageDialog = (function ($) {

  /**
   * Display a pop-up containing a message.
   *
   * @param {H5P.jQuery} $container The container which message dialog will be appended to
   * @param {string} message The message
   * @return {H5P.jQuery}
   */
  function JoubelMessageDialog ($container, message) {
    var timeout;

    var removeDialog = function () {
      $warning.remove();
      clearTimeout(timeout);
      $container.off('click.messageDialog');
    };

    // Create warning popup:
    var $warning = $('<div/>', {
      'class': 'joubel-message-dialog',
      text: message
    }).appendTo($container);

    // Remove after 3 seconds or if user clicks anywhere in $container:
    timeout = setTimeout(removeDialog, 3000);
    $container.on('click.messageDialog', removeDialog);

    return $warning;
  }

  return JoubelMessageDialog;
})(H5P.jQuery);
;
var H5P = H5P || {};

/**
 * Class responsible for creating a circular progress bar
 */

H5P.JoubelProgressCircle = (function ($) {

  /**
   * Constructor for the Progress Circle
   *
   * @param {Number} number The amount of progress to display
   * @param {string} progressColor Color for the progress meter
   * @param {string} backgroundColor Color behind the progress meter
   */
  function ProgressCircle(number, progressColor, fillColor, backgroundColor) {
    progressColor = progressColor || '#1a73d9';
    fillColor = fillColor || '#f0f0f0';
    backgroundColor = backgroundColor || '#ffffff';
    var progressColorRGB = this.hexToRgb(progressColor);

    //Verify number
    try {
      number = Number(number);
      if (number === '') {
        throw 'is empty';
      }
      if (isNaN(number)) {
        throw 'is not a number';
      }
    } catch (e) {
      number = 'err';
    }

    //Draw circle
    if (number > 100) {
      number = 100;
    }

    // We can not use rgba, since they will stack on top of each other.
    // Instead we create the equivalent of the rgba color
    // and applies this to the activeborder and background color.
    var progressColorString = 'rgb(' + parseInt(progressColorRGB.r, 10) +
      ',' + parseInt(progressColorRGB.g, 10) +
      ',' + parseInt(progressColorRGB.b, 10) + ')';

    // Circle wrapper
    var $wrapper = $('<div/>', {
      'class': "joubel-progress-circle-wrapper"
    });

    //Active border indicates progress
    var $activeBorder = $('<div/>', {
      'class': "joubel-progress-circle-active-border"
    }).appendTo($wrapper);

    //Background circle
    var $backgroundCircle = $('<div/>', {
      'class': "joubel-progress-circle-circle"
    }).appendTo($activeBorder);

    //Progress text/number
    $('<span/>', {
      'text': number + '%',
      'class': "joubel-progress-circle-percentage"
    }).appendTo($backgroundCircle);

    var deg = number * 3.6;
    if (deg <= 180) {
      $activeBorder.css('background-image',
        'linear-gradient(' + (90 + deg) + 'deg, transparent 50%, ' + fillColor + ' 50%),' +
        'linear-gradient(90deg, ' + fillColor + ' 50%, transparent 50%)')
        .css('border', '2px solid' + backgroundColor)
        .css('background-color', progressColorString);
    } else {
      $activeBorder.css('background-image',
        'linear-gradient(' + (deg - 90) + 'deg, transparent 50%, ' + progressColorString + ' 50%),' +
        'linear-gradient(90deg, ' + fillColor + ' 50%, transparent 50%)')
        .css('border', '2px solid' + backgroundColor)
        .css('background-color', progressColorString);
    }

    this.$activeBorder = $activeBorder;
    this.$backgroundCircle = $backgroundCircle;
    this.$wrapper = $wrapper;

    this.initResizeFunctionality();

    return $wrapper;
  }

  /**
   * Initializes resize functionality for the progress circle
   */
  ProgressCircle.prototype.initResizeFunctionality = function () {
    var self = this;

    $(window).resize(function () {
      // Queue resize
      setTimeout(function () {
        self.resize();
      });
    });

    // First resize
    setTimeout(function () {
      self.resize();
    }, 0);
  };

  /**
   * Resize function makes progress circle grow or shrink relative to parent container
   */
  ProgressCircle.prototype.resize = function () {
    var $parent = this.$wrapper.parent();

    if ($parent !== undefined && $parent) {

      // Measurements
      var fontSize = parseInt($parent.css('font-size'), 10);

      // Static sizes
      var fontSizeMultiplum = 3.75;
      var progressCircleWidthPx = parseInt((fontSize / 4.5), 10) % 2 === 0 ? parseInt((fontSize / 4.5), 10) + 4 : parseInt((fontSize / 4.5), 10) + 5;
      var progressCircleOffset = progressCircleWidthPx / 2;

      var width = fontSize * fontSizeMultiplum;
      var height = fontSize * fontSizeMultiplum;
      this.$activeBorder.css({
        'width': width,
        'height': height
      });

      this.$backgroundCircle.css({
        'width': width - progressCircleWidthPx,
        'height': height - progressCircleWidthPx,
        'top': progressCircleOffset,
        'left': progressCircleOffset
      });
    }
  };

  /**
   * Hex to RGB conversion
   * @param hex
   * @returns {{r: Number, g: Number, b: Number}}
   */
  ProgressCircle.prototype.hexToRgb = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  return ProgressCircle;

}(H5P.jQuery));
;
var H5P = H5P || {};

H5P.SimpleRoundedButton = (function ($) {

  /**
   * Creates a new tip
   */
  function SimpleRoundedButton(text) {

    var $simpleRoundedButton = $('<div>', {
      'class': 'joubel-simple-rounded-button',
      'title': text,
      'role': 'button',
      'tabindex': '0'
    }).keydown(function (e) {
      // 32 - space, 13 - enter
      if ([32, 13].indexOf(e.which) !== -1) {
        $(this).click();
        e.preventDefault();
      }
    });

    $('<span>', {
      'class': 'joubel-simple-rounded-button-text',
      'html': text
    }).appendTo($simpleRoundedButton);

    return $simpleRoundedButton;
  }

  return SimpleRoundedButton;
}(H5P.jQuery));
;
var H5P = H5P || {};

/**
 * Class responsible for creating speech bubbles
 */
H5P.JoubelSpeechBubble = (function ($) {

  var $currentSpeechBubble;
  var $currentContainer;  
  var $tail;
  var $innerTail;
  var removeSpeechBubbleTimeout;
  var currentMaxWidth;

  var DEFAULT_MAX_WIDTH = 400;

  var iDevice = navigator.userAgent.match(/iPod|iPhone|iPad/g) ? true : false;

  /**
   * Creates a new speech bubble
   *
   * @param {H5P.jQuery} $container The speaking object
   * @param {string} text The text to display
   * @param {number} maxWidth The maximum width of the bubble
   * @return {H5P.JoubelSpeechBubble}
   */
  function JoubelSpeechBubble($container, text, maxWidth) {
    maxWidth = maxWidth || DEFAULT_MAX_WIDTH;
    currentMaxWidth = maxWidth;
    $currentContainer = $container;

    this.isCurrent = function ($tip) {
      return $tip.is($currentContainer);
    };

    this.remove = function () {
      remove();
    };

    var fadeOutSpeechBubble = function ($speechBubble) {
      if (!$speechBubble) {
        return;
      }

      // Stop removing bubble
      clearTimeout(removeSpeechBubbleTimeout);

      $speechBubble.removeClass('show');
      setTimeout(function () {
        if ($speechBubble) {
          $speechBubble.remove();
          $speechBubble = undefined;
        }
      }, 500);
    };

    if ($currentSpeechBubble !== undefined) {
      remove();
    }

    var $h5pContainer = getH5PContainer($container);

    // Make sure we fade out old speech bubble
    fadeOutSpeechBubble($currentSpeechBubble);

    // Create bubble
    $tail = $('<div class="joubel-speech-bubble-tail"></div>');
    $innerTail = $('<div class="joubel-speech-bubble-inner-tail"></div>');
    var $innerBubble = $(
      '<div class="joubel-speech-bubble-inner">' +
      '<div class="joubel-speech-bubble-text">' + text + '</div>' +
      '</div>'
    ).prepend($innerTail);

    $currentSpeechBubble = $(
      '<div class="joubel-speech-bubble" aria-live="assertive">'
    ).append([$tail, $innerBubble])
      .appendTo($h5pContainer);

    // Show speech bubble with transition
    setTimeout(function () {
      $currentSpeechBubble.addClass('show');
    }, 0);

    position($currentSpeechBubble, $currentContainer, maxWidth, $tail, $innerTail);

    // Handle click to close
    H5P.$body.on('mousedown.speechBubble', handleOutsideClick);

    // Handle window resizing
    H5P.$window.on('resize', '', handleResize);

    // Handle clicks when inside IV which blocks bubbling.
    $container.parents('.h5p-dialog')
      .on('mousedown.speechBubble', handleOutsideClick);

    if (iDevice) {
      H5P.$body.css('cursor', 'pointer');
    }

    return this;
  }

  // Remove speechbubble if it belongs to a dom element that is about to be hidden
  H5P.externalDispatcher.on('domHidden', function (event) {
    if ($currentSpeechBubble !== undefined && event.data.$dom.find($currentContainer).length !== 0) {
      remove();
    }
  });

  /**
   * Returns the closest h5p container for the given DOM element.
   * 
   * @param {object} $container jquery element
   * @return {object} the h5p container (jquery element)
   */
  function getH5PContainer($container) {
    var $h5pContainer = $container.closest('.h5p-frame');

    // Check closest h5p frame first, then check for container in case there is no frame.
    if (!$h5pContainer.length) {
      $h5pContainer = $container.closest('.h5p-container');
    }

    return $h5pContainer;
  }

  /**
   * Event handler that is called when the window is resized.
   */
  function handleResize() {
    position($currentSpeechBubble, $currentContainer, currentMaxWidth, $tail, $innerTail);
  }

  /**
   * Repositions the speech bubble according to the position of the container.
   * 
   * @param {object} $currentSpeechbubble the speech bubble that should be positioned   
   * @param {object} $container the container to which the speech bubble should point 
   * @param {number} maxWidth the maximum width of the speech bubble
   * @param {object} $tail the tail (the triangle that points to the referenced container)
   * @param {object} $innerTail the inner tail (the triangle that points to the referenced container)
   */
  function position($currentSpeechBubble, $container, maxWidth, $tail, $innerTail) {
    var $h5pContainer = getH5PContainer($container);

    // Calculate offset between the button and the h5p frame
    var offset = getOffsetBetween($h5pContainer, $container);

    var direction = (offset.bottom > offset.top ? 'bottom' : 'top');
    var tipWidth = offset.outerWidth * 0.9; // Var needs to be renamed to make sense
    var bubbleWidth = tipWidth > maxWidth ? maxWidth : tipWidth;

    var bubblePosition = getBubblePosition(bubbleWidth, offset);
    var tailPosition = getTailPosition(bubbleWidth, bubblePosition, offset, $container.width());
    // Need to set font-size, since element is appended to body.
    // Using same font-size as parent. In that way it will grow accordingly
    // when resizing
    var fontSize = 16;//parseFloat($parent.css('font-size'));

    // Set width and position of speech bubble
    $currentSpeechBubble.css(bubbleCSS(
      direction,
      bubbleWidth,
      bubblePosition,
      fontSize
    ));

    var preparedTailCSS = tailCSS(direction, tailPosition);
    $tail.css(preparedTailCSS);
    $innerTail.css(preparedTailCSS);
  }

  /**
   * Static function for removing the speechbubble
   */
  var remove = function () {
    H5P.$body.off('mousedown.speechBubble');
    H5P.$window.off('resize', '', handleResize);
    $currentContainer.parents('.h5p-dialog').off('mousedown.speechBubble');
    if (iDevice) {
      H5P.$body.css('cursor', '');
    }
    if ($currentSpeechBubble !== undefined) {
      // Apply transition, then remove speech bubble
      $currentSpeechBubble.removeClass('show');

      // Make sure we remove any old timeout before reassignment
      clearTimeout(removeSpeechBubbleTimeout);
      removeSpeechBubbleTimeout = setTimeout(function () {
        $currentSpeechBubble.remove();
        $currentSpeechBubble = undefined;
      }, 500);
    }
    // Don't return false here. If the user e.g. clicks a button when the bubble is visible,
    // we want the bubble to disapear AND the button to receive the event
  };

  /**
   * Remove the speech bubble and container reference
   */
  function handleOutsideClick(event) {
    if (event.target === $currentContainer[0]) {
      return; // Button clicks are not outside clicks
    }

    remove();
    // There is no current container when a container isn't clicked
    $currentContainer = undefined;
  }

  /**
   * Calculate position for speech bubble
   *
   * @param {number} bubbleWidth The width of the speech bubble
   * @param {object} offset
   * @return {object} Return position for the speech bubble
   */
  function getBubblePosition(bubbleWidth, offset) {
    var bubblePosition = {};

    var tailOffset = 9;
    var widthOffset = bubbleWidth / 2;

    // Calculate top position
    bubblePosition.top = offset.top + offset.innerHeight;

    // Calculate bottom position
    bubblePosition.bottom = offset.bottom + offset.innerHeight + tailOffset;

    // Calculate left position
    if (offset.left < widthOffset) {
      bubblePosition.left = 3;
    }
    else if ((offset.left + widthOffset) > offset.outerWidth) {
      bubblePosition.left = offset.outerWidth - bubbleWidth - 3;
    }
    else {
      bubblePosition.left = offset.left - widthOffset + (offset.innerWidth / 2);
    }

    return bubblePosition;
  }

  /**
   * Calculate position for speech bubble tail
   *
   * @param {number} bubbleWidth The width of the speech bubble
   * @param {object} bubblePosition Speech bubble position
   * @param {object} offset
   * @param {number} iconWidth The width of the tip icon
   * @return {object} Return position for the tail
   */
  function getTailPosition(bubbleWidth, bubblePosition, offset, iconWidth) {
    var tailPosition = {};
    // Magic numbers. Tuned by hand so that the tail fits visually within
    // the bounds of the speech bubble.
    var leftBoundary = 9;
    var rightBoundary = bubbleWidth - 20;

    tailPosition.left = offset.left - bubblePosition.left + (iconWidth / 2) - 6;
    if (tailPosition.left < leftBoundary) {
      tailPosition.left = leftBoundary;
    }
    if (tailPosition.left > rightBoundary) {
      tailPosition.left = rightBoundary;
    }

    tailPosition.top = -6;
    tailPosition.bottom = -6;

    return tailPosition;
  }

  /**
   * Return bubble CSS for the desired growth direction
   *
   * @param {string} direction The direction the speech bubble will grow
   * @param {number} width The width of the speech bubble
   * @param {object} position Speech bubble position
   * @param {number} fontSize The size of the bubbles font
   * @return {object} Return CSS
   */
  function bubbleCSS(direction, width, position, fontSize) {
    if (direction === 'top') {
      return {
        width: width + 'px',
        bottom: position.bottom + 'px',
        left: position.left + 'px',
        fontSize: fontSize + 'px',
        top: ''
      };
    }
    else {
      return {
        width: width + 'px',
        top: position.top + 'px',
        left: position.left + 'px',
        fontSize: fontSize + 'px',
        bottom: ''
      };
    }
  }

  /**
   * Return tail CSS for the desired growth direction
   *
   * @param {string} direction The direction the speech bubble will grow
   * @param {object} position Tail position
   * @return {object} Return CSS
   */
  function tailCSS(direction, position) {
    if (direction === 'top') {
      return {
        bottom: position.bottom + 'px',
        left: position.left + 'px',
        top: ''
      };
    }
    else {
      return {
        top: position.top + 'px',
        left: position.left + 'px',
        bottom: ''
      };
    }
  }

  /**
   * Calculates the offset between an element inside a container and the
   * container. Only works if all the edges of the inner element are inside the
   * outer element.
   * Width/height of the elements is included as a convenience.
   *
   * @param {H5P.jQuery} $outer
   * @param {H5P.jQuery} $inner
   * @return {object} Position offset
   */
  function getOffsetBetween($outer, $inner) {
    var outer = $outer[0].getBoundingClientRect();
    var inner = $inner[0].getBoundingClientRect();

    return {
      top: inner.top - outer.top,
      right: outer.right - inner.right,
      bottom: outer.bottom - inner.bottom,
      left: inner.left - outer.left,
      innerWidth: inner.width,
      innerHeight: inner.height,
      outerWidth: outer.width,
      outerHeight: outer.height
    };
  }

  return JoubelSpeechBubble;
})(H5P.jQuery);
;
var H5P = H5P || {};

H5P.JoubelThrobber = (function ($) {

  /**
   * Creates a new tip
   */
  function JoubelThrobber() {

    // h5p-throbber css is described in core
    var $throbber = $('<div/>', {
      'class': 'h5p-throbber'
    });

    return $throbber;
  }

  return JoubelThrobber;
}(H5P.jQuery));
;
H5P.JoubelTip = (function ($) {
  var $conv = $('<div/>');

  /**
   * Creates a new tip element.
   *
   * NOTE that this may look like a class but it doesn't behave like one.
   * It returns a jQuery object.
   *
   * @param {string} tipHtml The text to display in the popup
   * @param {Object} [behaviour] Options
   * @param {string} [behaviour.tipLabel] Set to use a custom label for the tip button (you want this for good A11Y)
   * @param {boolean} [behaviour.helpIcon] Set to 'true' to Add help-icon classname to Tip button (changes the icon)
   * @param {boolean} [behaviour.showSpeechBubble] Set to 'false' to disable functionality (you may this in the editor)
   * @param {boolean} [behaviour.tabcontrol] Set to 'true' if you plan on controlling the tabindex in the parent (tabindex="-1")
   * @return {H5P.jQuery|undefined} Tip button jQuery element or 'undefined' if invalid tip
   */
  function JoubelTip(tipHtml, behaviour) {

    // Keep track of the popup that appears when you click the Tip button
    var speechBubble;

    // Parse tip html to determine text
    var tipText = $conv.html(tipHtml).text().trim();
    if (tipText === '') {
      return; // The tip has no textual content, i.e. it's invalid.
    }

    // Set default behaviour
    behaviour = $.extend({
      tipLabel: tipText,
      helpIcon: false,
      showSpeechBubble: true,
      tabcontrol: false
    }, behaviour);

    // Create Tip button
    var $tipButton = $('<div/>', {
      class: 'joubel-tip-container' + (behaviour.showSpeechBubble ? '' : ' be-quiet'),
      title: behaviour.tipLabel,
      'aria-label': behaviour.tipLabel,
      'aria-expanded': false,
      role: 'button',
      tabindex: (behaviour.tabcontrol ? -1 : 0),
      click: function (event) {
        // Toggle show/hide popup
        toggleSpeechBubble();
        event.preventDefault();
      },
      keydown: function (event) {
        if (event.which === 32 || event.which === 13) { // Space & enter key
          // Toggle show/hide popup
          toggleSpeechBubble();
          event.stopPropagation();
          event.preventDefault();
        }
        else { // Any other key
          // Toggle hide popup
          toggleSpeechBubble(false);
        }
      },
      // Add markup to render icon
      html: '<span class="joubel-icon-tip-normal ' + (behaviour.helpIcon ? ' help-icon': '') + '">' +
              '<span class="h5p-icon-shadow"></span>' +
              '<span class="h5p-icon-speech-bubble"></span>' +
              '<span class="h5p-icon-info"></span>' +
            '</span>'
      // IMPORTANT: All of the markup elements must have 'pointer-events: none;'
    });

    const $tipAnnouncer = $('<div>', {
      'class': 'hidden-but-read',
      'aria-live': 'polite',
      appendTo: $tipButton,
    });

    /**
     * Tip button interaction handler.
     * Toggle show or hide the speech bubble popup when interacting with the
     * Tip button.
     *
     * @private
     * @param {boolean} [force] 'true' shows and 'false' hides.
     */
    var toggleSpeechBubble = function (force) {
      if (speechBubble !== undefined && speechBubble.isCurrent($tipButton)) {
        // Hide current popup
        speechBubble.remove();
        speechBubble = undefined;

        $tipButton.attr('aria-expanded', false);
        $tipAnnouncer.html('');
      }
      else if (force !== false && behaviour.showSpeechBubble) {
        // Create and show new popup
        speechBubble = H5P.JoubelSpeechBubble($tipButton, tipHtml);
        $tipButton.attr('aria-expanded', true);
        $tipAnnouncer.html(tipHtml);
      }
    };

    return $tipButton;
  }

  return JoubelTip;
})(H5P.jQuery);
;
var H5P = H5P || {};

H5P.JoubelSlider = (function ($) {

  /**
   * Creates a new Slider
   *
   * @param {object} [params] Additional parameters
   */
  function JoubelSlider(params) {
    H5P.EventDispatcher.call(this);

    this.$slider = $('<div>', $.extend({
      'class': 'h5p-joubel-ui-slider'
    }, params));

    this.$slides = [];
    this.currentIndex = 0;
    this.numSlides = 0;
  }
  JoubelSlider.prototype = Object.create(H5P.EventDispatcher.prototype);
  JoubelSlider.prototype.constructor = JoubelSlider;

  JoubelSlider.prototype.addSlide = function ($content) {
    $content.addClass('h5p-joubel-ui-slide').css({
      'left': (this.numSlides*100) + '%'
    });
    this.$slider.append($content);
    this.$slides.push($content);

    this.numSlides++;

    if(this.numSlides === 1) {
      $content.addClass('current');
    }
  };

  JoubelSlider.prototype.attach = function ($container) {
    $container.append(this.$slider);
  };

  JoubelSlider.prototype.move = function (index) {
    var self = this;

    if(index === 0) {
      self.trigger('first-slide');
    }
    if(index+1 === self.numSlides) {
      self.trigger('last-slide');
    }
    self.trigger('move');

    var $previousSlide = self.$slides[this.currentIndex];
    H5P.Transition.onTransitionEnd(this.$slider, function () {
      $previousSlide.removeClass('current');
      self.trigger('moved');
    });
    this.$slides[index].addClass('current');

    var translateX = 'translateX(' + (-index*100) + '%)';
    this.$slider.css({
      '-webkit-transform': translateX,
      '-moz-transform': translateX,
      '-ms-transform': translateX,
      'transform': translateX
    });

    this.currentIndex = index;
  };

  JoubelSlider.prototype.remove = function () {
    this.$slider.remove();
  };

  JoubelSlider.prototype.next = function () {
    if(this.currentIndex+1 >= this.numSlides) {
      return;
    }

    this.move(this.currentIndex+1);
  };

  JoubelSlider.prototype.previous = function () {
    this.move(this.currentIndex-1);
  };

  JoubelSlider.prototype.first = function () {
    this.move(0);
  };

  JoubelSlider.prototype.last = function () {
    this.move(this.numSlides-1);
  };

  return JoubelSlider;
})(H5P.jQuery);
;
var H5P = H5P || {};

/**
 * @module
 */
H5P.JoubelScoreBar = (function ($) {

  /* Need to use an id for the star SVG since that is the only way to reference
     SVG filters  */
  var idCounter = 0;

  /**
   * Creates a score bar
   * @class H5P.JoubelScoreBar
   * @param {number} maxScore  Maximum score
   * @param {string} [label] Makes it easier for readspeakers to identify the scorebar
   * @param {string} [helpText] Score explanation
   * @param {string} [scoreExplanationButtonLabel] Label for score explanation button
   */
  function JoubelScoreBar(maxScore, label, helpText, scoreExplanationButtonLabel) {
    var self = this;

    self.maxScore = maxScore;
    self.score = 0;
    idCounter++;

    /**
     * @const {string}
     */
    self.STAR_MARKUP = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63.77 53.87" aria-hidden="true" focusable="false">' +
        '<title>star</title>' +
        '<filter id="h5p-joubelui-score-bar-star-inner-shadow-' + idCounter + '" x0="-50%" y0="-50%" width="200%" height="200%">' +
          '<feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"></feGaussianBlur>' +
          '<feOffset dy="2" dx="4"></feOffset>' +
          '<feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite>' +
          '<feFlood flood-color="#ffe95c" flood-opacity="1"></feFlood>' +
          '<feComposite in2="shadowDiff" operator="in"></feComposite>' +
          '<feComposite in2="SourceGraphic" operator="over" result="firstfilter"></feComposite>' +
          '<feGaussianBlur in="firstfilter" stdDeviation="3" result="blur2"></feGaussianBlur>' +
          '<feOffset dy="-2" dx="-4"></feOffset>' +
          '<feComposite in2="firstfilter" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite>' +
          '<feFlood flood-color="#ffe95c" flood-opacity="1"></feFlood>' +
          '<feComposite in2="shadowDiff" operator="in"></feComposite>' +
          '<feComposite in2="firstfilter" operator="over"></feComposite>' +
        '</filter>' +
        '<path class="h5p-joubelui-score-bar-star-shadow" d="M35.08,43.41V9.16H20.91v0L9.51,10.85,9,10.93C2.8,12.18,0,17,0,21.25a11.22,11.22,0,0,0,3,7.48l8.73,8.53-1.07,6.16Z"/>' +
        '<g>' +
          '<path class="h5p-joubelui-score-bar-star-border" d="M61.36,22.8,49.72,34.11l2.78,16a2.6,2.6,0,0,1,.05.64c0,.85-.37,1.6-1.33,1.6A2.74,2.74,0,0,1,49.94,52L35.58,44.41,21.22,52a2.93,2.93,0,0,1-1.28.37c-.91,0-1.33-.75-1.33-1.6,0-.21.05-.43.05-.64l2.78-16L9.8,22.8A2.57,2.57,0,0,1,9,21.25c0-1,1-1.33,1.81-1.49l16.07-2.35L34.09,2.83c.27-.59.85-1.33,1.55-1.33s1.28.69,1.55,1.33l7.21,14.57,16.07,2.35c.75.11,1.81.53,1.81,1.49A3.07,3.07,0,0,1,61.36,22.8Z"/>' +
          '<path class="h5p-joubelui-score-bar-star-fill" d="M61.36,22.8,49.72,34.11l2.78,16a2.6,2.6,0,0,1,.05.64c0,.85-.37,1.6-1.33,1.6A2.74,2.74,0,0,1,49.94,52L35.58,44.41,21.22,52a2.93,2.93,0,0,1-1.28.37c-.91,0-1.33-.75-1.33-1.6,0-.21.05-.43.05-.64l2.78-16L9.8,22.8A2.57,2.57,0,0,1,9,21.25c0-1,1-1.33,1.81-1.49l16.07-2.35L34.09,2.83c.27-.59.85-1.33,1.55-1.33s1.28.69,1.55,1.33l7.21,14.57,16.07,2.35c.75.11,1.81.53,1.81,1.49A3.07,3.07,0,0,1,61.36,22.8Z"/>' +
          '<path filter="url(#h5p-joubelui-score-bar-star-inner-shadow-' + idCounter + ')" class="h5p-joubelui-score-bar-star-fill-full-score" d="M61.36,22.8,49.72,34.11l2.78,16a2.6,2.6,0,0,1,.05.64c0,.85-.37,1.6-1.33,1.6A2.74,2.74,0,0,1,49.94,52L35.58,44.41,21.22,52a2.93,2.93,0,0,1-1.28.37c-.91,0-1.33-.75-1.33-1.6,0-.21.05-.43.05-.64l2.78-16L9.8,22.8A2.57,2.57,0,0,1,9,21.25c0-1,1-1.33,1.81-1.49l16.07-2.35L34.09,2.83c.27-.59.85-1.33,1.55-1.33s1.28.69,1.55,1.33l7.21,14.57,16.07,2.35c.75.11,1.81.53,1.81,1.49A3.07,3.07,0,0,1,61.36,22.8Z"/>' +
        '</g>' +
      '</svg>';

    /**
     * @function appendTo
     * @memberOf H5P.JoubelScoreBar#
     * @param {H5P.jQuery}  $wrapper  Dom container
     */
    self.appendTo = function ($wrapper) {
      self.$scoreBar.appendTo($wrapper);
    };

    /**
     * Create the text representation of the scorebar .
     *
     * @private
     * @return {string}
     */
    var createLabel = function (score) {
      if (!label) {
        return '';
      }

      return label.replace(':num', score).replace(':total', self.maxScore);
    };

    /**
     * Creates the html for this widget
     *
     * @method createHtml
     * @private
     */
    var createHtml = function () {
      // Container div
      self.$scoreBar = $('<div>', {
        'class': 'h5p-joubelui-score-bar',
      });

      var $visuals = $('<div>', {
        'class': 'h5p-joubelui-score-bar-visuals',
        appendTo: self.$scoreBar
      });

      // The progress bar wrapper
      self.$progressWrapper = $('<div>', {
        'class': 'h5p-joubelui-score-bar-progress-wrapper',
        appendTo: $visuals
      });

      self.$progress = $('<div>', {
        'class': 'h5p-joubelui-score-bar-progress',
        'html': createLabel(self.score),
        appendTo: self.$progressWrapper
      });

      // The star
      $('<div>', {
        'class': 'h5p-joubelui-score-bar-star',
        html: self.STAR_MARKUP
      }).appendTo($visuals);

      // The score container
      var $numerics = $('<div>', {
        'class': 'h5p-joubelui-score-numeric',
        appendTo: self.$scoreBar,
        'aria-hidden': true
      });

      // The current score
      self.$scoreCounter = $('<span>', {
        'class': 'h5p-joubelui-score-number h5p-joubelui-score-number-counter',
        text: 0,
        appendTo: $numerics
      });

      // The separator
      $('<span>', {
        'class': 'h5p-joubelui-score-number-separator',
        text: '/',
        appendTo: $numerics
      });

      // Max score
      self.$maxScore = $('<span>', {
        'class': 'h5p-joubelui-score-number h5p-joubelui-score-max',
        text: self.maxScore,
        appendTo: $numerics
      });

      if (helpText) {
        H5P.JoubelUI.createTip(helpText, {
          tipLabel: scoreExplanationButtonLabel ? scoreExplanationButtonLabel : helpText,
          helpIcon: true
        }).appendTo(self.$scoreBar);
        self.$scoreBar.addClass('h5p-score-bar-has-help');
      }
    };

    /**
     * Set the current score
     * @method setScore
     * @memberOf H5P.JoubelScoreBar#
     * @param  {number} score
     */
    self.setScore = function (score) {
      // Do nothing if score hasn't changed
      if (score === self.score) {
        return;
      }
      self.score = score > self.maxScore ? self.maxScore : score;
      self.updateVisuals();
    };

    /**
     * Increment score
     * @method incrementScore
     * @memberOf H5P.JoubelScoreBar#
     * @param  {number=}        incrementBy Optional parameter, defaults to 1
     */
    self.incrementScore = function (incrementBy) {
      self.setScore(self.score + (incrementBy || 1));
    };

    /**
     * Set the max score
     * @method setMaxScore
     * @memberOf H5P.JoubelScoreBar#
     * @param  {number}    maxScore The max score
     */
    self.setMaxScore = function (maxScore) {
      self.maxScore = maxScore;
    };

    /**
     * Updates the progressbar visuals
     * @memberOf H5P.JoubelScoreBar#
     * @method updateVisuals
     */
    self.updateVisuals = function () {
      self.$progress.html(createLabel(self.score));
      self.$scoreCounter.text(self.score);
      self.$maxScore.text(self.maxScore);

      setTimeout(function () {
        // Start the progressbar animation
        self.$progress.css({
          width: ((self.score / self.maxScore) * 100) + '%'
        });

        H5P.Transition.onTransitionEnd(self.$progress, function () {
          // If fullscore fill the star and start the animation
          self.$scoreBar.toggleClass('h5p-joubelui-score-bar-full-score', self.score === self.maxScore);
          self.$scoreBar.toggleClass('h5p-joubelui-score-bar-animation-active', self.score === self.maxScore);

          // Only allow the star animation to run once
          self.$scoreBar.one("animationend", function() {
            self.$scoreBar.removeClass("h5p-joubelui-score-bar-animation-active");
          });
        }, 600);
      }, 300);
    };

    /**
     * Removes all classes
     * @method reset
     */
    self.reset = function () {
      self.$scoreBar.removeClass('h5p-joubelui-score-bar-full-score');
    };

    createHtml();
  }

  return JoubelScoreBar;
})(H5P.jQuery);
;
var H5P = H5P || {};

H5P.JoubelProgressbar = (function ($) {

  /**
   * Joubel progressbar class
   * @method JoubelProgressbar
   * @constructor
   * @param  {number}          steps Number of steps
   * @param {Object} [options] Additional options
   * @param {boolean} [options.disableAria] Disable readspeaker assistance
   * @param {string} [options.progressText] A progress text for describing
   *  current progress out of total progress for readspeakers.
   *  e.g. "Slide :num of :total"
   */
  function JoubelProgressbar(steps, options) {
    H5P.EventDispatcher.call(this);
    var self = this;
    this.options = $.extend({
      progressText: 'Slide :num of :total'
    }, options);
    this.currentStep = 0;
    this.steps = steps;

    this.$progressbar = $('<div>', {
      'class': 'h5p-joubelui-progressbar',
      on: {
        click: function () {
          self.toggleTooltip();
          return false;
        },
        mouseenter: function () {
          self.showTooltip();
        },
        mouseleave: function () {
          setTimeout(function () {
            self.hideTooltip();
          }, 1500);
        }
      }
    });
    this.$background = $('<div>', {
      'class': 'h5p-joubelui-progressbar-background'
    }).appendTo(this.$progressbar);

    $('body').click(function () {
      self.toggleTooltip(true);
    });
  }

  JoubelProgressbar.prototype = Object.create(H5P.EventDispatcher.prototype);
  JoubelProgressbar.prototype.constructor = JoubelProgressbar;

  /**
   * Display tooltip
   * @method showTooltip
   */
  JoubelProgressbar.prototype.showTooltip = function () {
    var self = this;

    if (this.currentStep === 0 || this.tooltip !== undefined) {
      return;
    }

    var parentWidth = self.$progressbar.offset().left + self.$progressbar.width();

    this.tooltip = new H5P.Drop({
      target: this.$background.get(0),
      content: this.currentStep + '/' + this.steps,
      classes: 'drop-theme-arrows-bounce h5p-joubelui-drop',
      position: 'top right',
      openOn: 'always',
      tetherOptions: {
        attachment: 'bottom center',
        targetAttachment: 'top right'
      }
    });
    this.tooltip.on('open', function () {
      var $drop = $(self.tooltip.drop);
      var left = $drop.position().left;
      var dropWidth = $drop.width();

      // Need to handle drops getting outside of the progressbar:
      if (left < 0) {
        $drop.css({marginLeft: (-left) + 'px'});
      }
      else if (left + dropWidth > parentWidth) {
        $drop.css({marginLeft: (parentWidth - (left + dropWidth)) + 'px'});
      }
    });
  };

  JoubelProgressbar.prototype.updateAria = function () {
    var self = this;
    if (this.options.disableAria) {
      return;
    }

    if (!this.$currentStatus) {
      this.$currentStatus = $('<div>', {
        'class': 'h5p-joubelui-progressbar-slide-status-text',
        'aria-live': 'assertive'
      }).appendTo(this.$progressbar);
    }
    var interpolatedProgressText = self.options.progressText
      .replace(':num', self.currentStep)
      .replace(':total', self.steps);
    this.$currentStatus.html(interpolatedProgressText);
  };

  /**
   * Hides tooltip
   * @method hideTooltip
   */
  JoubelProgressbar.prototype.hideTooltip = function () {
    if (this.tooltip !== undefined) {
      this.tooltip.remove();
      this.tooltip.destroy();
      this.tooltip = undefined;
    }
  };

  /**
   * Toggles tooltip-visibility
   * @method toggleTooltip
   * @param  {boolean} [closeOnly] Don't show, only close if open
   */
  JoubelProgressbar.prototype.toggleTooltip = function (closeOnly) {
    if (this.tooltip === undefined && !closeOnly) {
      this.showTooltip();
    }
    else if (this.tooltip !== undefined) {
      this.hideTooltip();
    }
  };

  /**
   * Appends to a container
   * @method appendTo
   * @param  {H5P.jquery} $container
   */
  JoubelProgressbar.prototype.appendTo = function ($container) {
    this.$progressbar.appendTo($container);
  };

  /**
   * Update progress
   * @method setProgress
   * @param  {number}    step
   */
  JoubelProgressbar.prototype.setProgress = function (step) {
    // Check for valid value:
    if (step > this.steps || step < 0) {
      return;
    }
    this.currentStep = step;
    this.$background.css({
      width: ((this.currentStep/this.steps)*100) + '%'
    });

    this.updateAria();
  };

  /**
   * Increment progress with 1
   * @method next
   */
  JoubelProgressbar.prototype.next = function () {
    this.setProgress(this.currentStep+1);
  };

  /**
   * Reset progressbar
   * @method reset
   */
  JoubelProgressbar.prototype.reset = function () {
    this.setProgress(0);
  };

  /**
   * Check if last step is reached
   * @method isLastStep
   * @return {Boolean}
   */
  JoubelProgressbar.prototype.isLastStep = function () {
    return this.steps === this.currentStep;
  };

  return JoubelProgressbar;
})(H5P.jQuery);
;
var H5P = H5P || {};

/**
 * H5P Joubel UI library.
 *
 * This is a utility library, which does not implement attach. I.e, it has to bee actively used by
 * other libraries
 * @module
 */
H5P.JoubelUI = (function ($) {

  /**
   * The internal object to return
   * @class H5P.JoubelUI
   * @static
   */
  function JoubelUI() {}

  /* Public static functions */

  /**
   * Create a tip icon
   * @method H5P.JoubelUI.createTip
   * @param  {string}  text   The textual tip
   * @param  {Object}  params Parameters
   * @return {H5P.JoubelTip}
   */
  JoubelUI.createTip = function (text, params) {
    return new H5P.JoubelTip(text, params);
  };

  /**
   * Create message dialog
   * @method H5P.JoubelUI.createMessageDialog
   * @param  {H5P.jQuery}               $container The dom container
   * @param  {string}                   message    The message
   * @return {H5P.JoubelMessageDialog}
   */
  JoubelUI.createMessageDialog = function ($container, message) {
    return new H5P.JoubelMessageDialog($container, message);
  };

  /**
   * Create help text dialog
   * @method H5P.JoubelUI.createHelpTextDialog
   * @param  {string}             header  The textual header
   * @param  {string}             message The textual message
   * @param  {string}             closeButtonTitle The title for the close button
   * @return {H5P.JoubelHelpTextDialog}
   */
  JoubelUI.createHelpTextDialog = function (header, message, closeButtonTitle) {
    return new H5P.JoubelHelpTextDialog(header, message, closeButtonTitle);
  };

  /**
   * Create progress circle
   * @method H5P.JoubelUI.createProgressCircle
   * @param  {number}             number          The progress (0 to 100)
   * @param  {string}             progressColor   The progress color in hex value
   * @param  {string}             fillColor       The fill color in hex value
   * @param  {string}             backgroundColor The background color in hex value
   * @return {H5P.JoubelProgressCircle}
   */
  JoubelUI.createProgressCircle = function (number, progressColor, fillColor, backgroundColor) {
    return new H5P.JoubelProgressCircle(number, progressColor, fillColor, backgroundColor);
  };

  /**
   * Create throbber for loading
   * @method H5P.JoubelUI.createThrobber
   * @return {H5P.JoubelThrobber}
   */
  JoubelUI.createThrobber = function () {
    return new H5P.JoubelThrobber();
  };

  /**
   * Create simple rounded button
   * @method H5P.JoubelUI.createSimpleRoundedButton
   * @param  {string}                  text The button label
   * @return {H5P.SimpleRoundedButton}
   */
  JoubelUI.createSimpleRoundedButton = function (text) {
    return new H5P.SimpleRoundedButton(text);
  };

  /**
   * Create Slider
   * @method H5P.JoubelUI.createSlider
   * @param  {Object} [params] Parameters
   * @return {H5P.JoubelSlider}
   */
  JoubelUI.createSlider = function (params) {
    return new H5P.JoubelSlider(params);
  };

  /**
   * Create Score Bar
   * @method H5P.JoubelUI.createScoreBar
   * @param  {number=}       maxScore The maximum score
   * @param {string} [label] Makes it easier for readspeakers to identify the scorebar
   * @return {H5P.JoubelScoreBar}
   */
  JoubelUI.createScoreBar = function (maxScore, label, helpText, scoreExplanationButtonLabel) {
    return new H5P.JoubelScoreBar(maxScore, label, helpText, scoreExplanationButtonLabel);
  };

  /**
   * Create Progressbar
   * @method H5P.JoubelUI.createProgressbar
   * @param  {number=}       numSteps The total numer of steps
   * @param {Object} [options] Additional options
   * @param {boolean} [options.disableAria] Disable readspeaker assistance
   * @param {string} [options.progressText] A progress text for describing
   *  current progress out of total progress for readspeakers.
   *  e.g. "Slide :num of :total"
   * @return {H5P.JoubelProgressbar}
   */
  JoubelUI.createProgressbar = function (numSteps, options) {
    return new H5P.JoubelProgressbar(numSteps, options);
  };

  /**
   * Create standard Joubel button
   *
   * @method H5P.JoubelUI.createButton
   * @param {object} params
   *  May hold any properties allowed by jQuery. If href is set, an A tag
   *  is used, if not a button tag is used.
   * @return {H5P.jQuery} The jquery element created
   */
  JoubelUI.createButton = function(params) {
    var type = 'button';
    if (params.href) {
      type = 'a';
    }
    else {
      params.type = 'button';
    }
    if (params.class) {
      params.class += ' h5p-joubelui-button';
    }
    else {
      params.class = 'h5p-joubelui-button';
    }
    return $('<' + type + '/>', params);
  };

  /**
   * Fix for iframe scoll bug in IOS. When focusing an element that doesn't have
   * focus support by default the iframe will scroll the parent frame so that
   * the focused element is out of view. This varies dependening on the elements
   * of the parent frame.
   */
  if (H5P.isFramed && !H5P.hasiOSiframeScrollFix &&
      /iPad|iPhone|iPod/.test(navigator.userAgent)) {
    H5P.hasiOSiframeScrollFix = true;

    // Keep track of original focus function
    var focus = HTMLElement.prototype.focus;

    // Override the original focus
    HTMLElement.prototype.focus = function () {
      // Only focus the element if it supports it natively
      if ( (this instanceof HTMLAnchorElement ||
            this instanceof HTMLInputElement ||
            this instanceof HTMLSelectElement ||
            this instanceof HTMLTextAreaElement ||
            this instanceof HTMLButtonElement ||
            this instanceof HTMLIFrameElement ||
            this instanceof HTMLAreaElement) && // HTMLAreaElement isn't supported by Safari yet.
          !this.getAttribute('role')) { // Focus breaks if a different role has been set
          // In theory this.isContentEditable should be able to recieve focus,
          // but it didn't work when tested.

        // Trigger the original focus with the proper context
        focus.call(this);
      }
    };
  }

  return JoubelUI;
})(H5P.jQuery);
;
(()=>{var e={596:e=>{e.exports=function(e,t){this.index=e,this.parent=t}},485:(e,t,i)=>{const n=i(596),s=H5P.EventDispatcher;function r(e,t){const i=this;s.call(i),i.children=[];var r=function(e){for(let t=e;t<i.children.length;t++)i.children[t].index=t};if(i.addChild=function(t,s){void 0===s&&(s=i.children.length);const o=new n(s,i);return s===i.children.length?i.children.push(o):(i.children.splice(s,0,o),r(s)),e.call(o,t),o},i.removeChild=function(e){i.children.splice(e,1),r(e)},i.moveChild=function(e,t){const n=i.children.splice(e,1)[0];i.children.splice(t,0,n),r(t<e?t:e)},t)for(let e=0;e<t.length;e++)i.addChild(t[e])}r.prototype=Object.create(s.prototype),r.prototype.constructor=r,e.exports=r}},t={};function i(n){var s=t[n];if(void 0!==s)return s.exports;var r=t[n]={exports:{}};return e[n](r,r.exports,i),r.exports}i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";var e=i(485),t=i.n(e),n=H5P.jQuery,s=H5P.EventDispatcher,r=H5P.JoubelUI,o=function(e){return e.concat.apply([],e)},a=function(e){return"function"==typeof e},l=null!==navigator.userAgent.match(/iPad/i),c=null!==navigator.userAgent.match(/iPad|iPod|iPhone/i),d=function(e,t){return-1!==e.indexOf(t)},h=function(e,t){return void 0!==e?e:t},p=13,u=27,m=32,f=function(e,t,i){e.click((function(e){t.call(i||this,e)})),e.keydown((function(e){d([p,m],e.which)&&(e.preventDefault(),t.call(i||this,e))}))},v=function(e){var t=e[0].getBoundingClientRect();return{width:t.width,height:t.height}},g=n("<div>");const y=function(){function e(e,t){this.$summarySlide=t,this.cp=e}return e.prototype.updateSummarySlide=function(e,t){var i=this,s=void 0===this.cp.editor&&void 0!==this.$summarySlide&&e>=this.cp.slides.length-1,o=!this.cp.showSummarySlide&&this.cp.hasAnswerElements;if(s){i.cp.presentation.keywordListEnabled&&i.cp.presentation.keywordListAlwaysShow&&i.cp.hideKeywords(),this.$summarySlide.children().remove();var a=i.cp.getSlideScores(t),l=i.outputScoreStats(a);if(n(l).appendTo(i.$summarySlide),!o){var c=i.totalScores(a);if(!isNaN(c.totalPercentage)){var d=r.createScoreBar(c.totalMaxScore,"","","");d.setScore(c.totalScore);var h=n(".h5p-summary-total-score",i.$summarySlide);d.appendTo(h),setTimeout((function(){h.append(n("<div/>",{"aria-live":"polite",class:"hidden-but-read",html:i.cp.l10n.summary+". "+i.cp.l10n.accessibilityTotalScore.replace("@score",c.totalScore).replace("@maxScore",c.totalMaxScore)}))}),100)}if(1==i.cp.enableTwitterShare){var p=n(".h5p-summary-twitter-message",i.$summarySlide);this.addTwitterScoreLinkTo(p,c)}if(1==i.cp.enableFacebookShare){var u=n(".h5p-summary-facebook-message",i.$summarySlide);this.addFacebookScoreLinkTo(u,c)}if(1==i.cp.enableGoogleShare){var m=n(".h5p-summary-google-message",i.$summarySlide);this.addGoogleScoreLinkTo(m)}i.$summarySlide.find(".h5p-td > .h5p-slide-link").each((function(){var e=n(this);e.click((function(t){i.cp.jumpToSlide(parseInt(e.data("slide"),10)-1),t.preventDefault()}))}))}var f=n(".h5p-summary-footer",i.$summarySlide);this.cp.showSummarySlideSolutionButton&&r.createButton({class:"h5p-show-solutions",html:i.cp.l10n.showSolutions,on:{click:function(){i.toggleSolutionMode(!0)}},appendTo:f}),this.cp.showSummarySlideRetryButton&&r.createButton({class:"h5p-cp-retry-button",html:i.cp.l10n.retry,on:{click:function(){i.cp.resetTask()}},appendTo:f}),i.cp.hasAnswerElements&&r.createButton({class:"h5p-eta-export",html:i.cp.l10n.exportAnswers,on:{click:function(){H5P.ExportableTextArea.Exporter.run(i.cp.slides,i.cp.elementInstances)}},appendTo:f})}},e.prototype.outputScoreStats=function(e){if(void 0===e)return this.$summarySlide.addClass("h5p-summary-only-export"),'<div class="h5p-summary-footer"></div>';var t,i=this,n=0,s=0,r="",o=0,a="";for(t=0;t<e.length;t+=1)a=this.getSlideDescription(e[t]),o=Math.round(e[t].score/e[t].maxScore*100),isNaN(o)&&(o=0),r+='<tr><td class="h5p-td h5p-summary-task-title"><a href="#" class="h5p-slide-link"  aria-label=" '+i.cp.l10n.slide+" "+e[t].slide+": "+a.replace(/(<([^>]+)>)/gi,"")+" "+o+'%" data-slide="'+e[t].slide+'">'+i.cp.l10n.slide+" "+e[t].slide+": "+a.replace(/(<([^>]+)>)/gi,"")+'</a></td><td class="h5p-td h5p-summary-score-bar"><p class="hidden-but-read">'+o+"%</p><p>"+e[t].score+"<span>/</span>"+e[t].maxScore+"</p></td></tr>",n+=e[t].score,s+=e[t].maxScore;i.cp.triggerXAPICompleted(n,s);var l=i.cp.enableTwitterShare||i.cp.enableFacebookShare||i.cp.enableGoogleShare?'<span class="h5p-show-results-text">'+i.cp.l10n.shareResult+"</span>":"",c=1==i.cp.enableTwitterShare?'<span class="h5p-summary-twitter-message" aria-label="'+i.cp.l10n.shareTwitter+'"></span>':"",d=1==i.cp.enableFacebookShare?'<span class="h5p-summary-facebook-message" aria-label="'+i.cp.l10n.shareFacebook+'"></span>':"",h=1==i.cp.enableGoogleShare?'<span class="h5p-summary-google-message" aria-label="'+i.cp.l10n.shareGoogle+'"></span>':"";return'<div class="h5p-summary-table-holder"><div class="h5p-summary-table-pages"><table class="h5p-score-table"><thead><tr><th class="h5p-summary-table-header slide">'+i.cp.l10n.slide+'</th><th class="h5p-summary-table-header score">'+i.cp.l10n.score+"<span>/</span>"+i.cp.l10n.total.toLowerCase()+"</th></tr></thead><tbody>"+r+'</tbody></table></div><div class="h5p-summary-total-table"><div class="h5p-summary-social">'+l+d+c+h+'</div><div class="h5p-summary-total-score"><p>'+i.cp.l10n.totalScore+'</p></div></div></div><div class="h5p-summary-footer"></div>'},e.prototype.getSlideDescription=function(e){var t,i,n=this,s=n.cp.slides[e.slide-1].elements;if(e.indexes.length>1)t=n.cp.l10n.summaryMultipleTaskText;else if(void 0!==s[e.indexes[0]]&&s[0])if(i=s[e.indexes[0]].action,"function"==typeof n.cp.elementInstances[e.slide-1][e.indexes[0]].getTitle)t=n.cp.elementInstances[e.slide-1][e.indexes[0]].getTitle();else if(void 0!==i.library&&i.library){var r=i.library.split(" ")[0].split(".")[1].split(/(?=[A-Z])/),o="";r.forEach((function(e,t){0!==t&&(e=e.toLowerCase()),o+=e,t<=r.length-1&&(o+=" ")})),t=o}return t},e.prototype.addTwitterScoreLinkTo=function(e,t){var i=this,n=i.cp.twitterShareStatement||"",s=i.cp.twitterShareHashtags||"",r=i.cp.twitterShareUrl||"";r=r.replace("@currentpageurl",window.location.href),n=n.replace("@score",t.totalScore).replace("@maxScore",t.totalMaxScore).replace("@percentage",t.totalPercentage+"%").replace("@currentpageurl",window.location.href),s=s.trim().replace(" ",""),n=encodeURIComponent(n),s=encodeURIComponent(s),r=encodeURIComponent(r);var o="https://twitter.com/intent/tweet?";o+=n.length>0?"text="+n+"&":"",o+=r.length>0?"url="+r+"&":"",o+=s.length>0?"hashtags="+s:"";var a=window.innerWidth/2,l=window.innerHeight/2;e.attr("tabindex","0").attr("role","button"),f(e,(function(){return window.open(o,i.cp.l10n.shareTwitter,"width=800,height=300,left="+a+",top="+l),!1}))},e.prototype.addFacebookScoreLinkTo=function(e,t){var i=this,n=i.cp.facebookShareUrl||"",s=i.cp.facebookShareQuote||"";n=n.replace("@currentpageurl",window.location.href),s=s.replace("@currentpageurl",window.location.href).replace("@percentage",t.totalPercentage+"%").replace("@score",t.totalScore).replace("@maxScore",t.totalMaxScore),n=encodeURIComponent(n),s=encodeURIComponent(s);var r="https://www.facebook.com/sharer/sharer.php?";r+=n.length>0?"u="+n+"&":"",r+=s.length>0?"quote="+s:"";var o=window.innerWidth/2,a=window.innerHeight/2;e.attr("tabindex","0").attr("role","button"),f(e,(function(){return window.open(r,i.cp.l10n.shareFacebook,"width=800,height=300,left="+o+",top="+a),!1}))},e.prototype.addGoogleScoreLinkTo=function(e){var t=this,i=t.cp.googleShareUrl||"";i=i.replace("@currentpageurl",window.location.href),i=encodeURIComponent(i);var n="https://plus.google.com/share?";n+=i.length>0?"url="+i:"";var s=window.innerWidth/2,r=window.innerHeight/2;e.attr("tabindex","0").attr("role","button"),f(e,(function(){return window.open(n,t.cp.l10n.shareGoogle,"width=401,height=437,left="+s+",top="+r),!1}))},e.prototype.totalScores=function(e){if(void 0===e)return{totalScore:0,totalMaxScore:0,totalPercentage:0};var t,i=0,n=0;for(t=0;t<e.length;t+=1)i+=e[t].score,n+=e[t].maxScore;var s=Math.round(i/n*100);return isNaN(s)&&(s=0),{totalScore:i,totalMaxScore:n,totalPercentage:s}},e.prototype.toggleSolutionMode=function(e){if(this.cp.isSolutionMode=e,e){var t=this.cp.showSolutions();this.cp.setProgressBarFeedback(t),this.cp.$footer.addClass("h5p-footer-solution-mode"),this.setFooterSolutionModeText(this.cp.l10n.solutionModeText)}else this.cp.$footer.removeClass("h5p-footer-solution-mode"),this.setFooterSolutionModeText(),this.cp.setProgressBarFeedback()},e.prototype.setFooterSolutionModeText=function(e){void 0!==e&&e?this.cp.$exitSolutionModeText.html(e):this.cp.$exitSolutionModeText&&this.cp.$exitSolutionModeText.html("")},e}();const b=function(e){var t=0;function i(){}return i.supported=function(){return"function"==typeof window.print},i.print=function(t,i,n){t.trigger("printing",{finished:!1,allSlides:n});var s=e(".h5p-slide.h5p-current"),r=s.height(),o=s.width()/670,a=e(".h5p-slide");a.css({height:r/o+"px",width:"670px",fontSize:Math.floor(100/o)+"%"});var l=i.height();i.css("height","auto"),a.toggleClass("doprint",!0===n),s.addClass("doprint"),setTimeout((function(){window.print(),a.css({height:"",width:"",fontSize:""}),i.css("height",l+"px"),t.trigger("printing",{finished:!0})}),500)},i.showDialog=function(i,n,s){var r=this,o=t++,a="h5p-cp-print-dialog-".concat(o,"-title"),l="h5p-cp-print-dialog-".concat(o,"-ingress"),c=e('<div class="h5p-popup-dialog h5p-print-dialog">\n                      <div role="dialog" aria-labelledby="'.concat(a,'" aria-describedby="').concat(l,'" tabindex="-1" class="h5p-inner">\n                        <h2 id="').concat(a,'">').concat(i.printTitle,'</h2>\n                        <div class="h5p-scroll-content"></div>\n                        <div class="h5p-close" role="button" tabindex="0" title="').concat(H5P.t("close"),'">\n                      </div>\n                    </div>')).insertAfter(n).click((function(){r.close()})).children(".h5p-inner").click((function(){return!1})).end();f(c.find(".h5p-close"),(function(){return r.close()}));var d=c.find(".h5p-scroll-content");return d.append(e("<div>",{class:"h5p-cp-print-ingress",id:l,html:i.printIngress})),H5P.JoubelUI.createButton({html:i.printAllSlides,class:"h5p-cp-print-all-slides",click:function(){r.close(),s(!0)}}).appendTo(d),H5P.JoubelUI.createButton({html:i.printCurrentSlide,class:"h5p-cp-print-current-slide",click:function(){r.close(),s(!1)}}).appendTo(d),this.open=function(){setTimeout((function(){c.addClass("h5p-open"),H5P.jQuery(r).trigger("dialog-opened",[c])}),1)},this.close=function(){c.removeClass("h5p-open"),setTimeout((function(){c.remove()}),200)},this.open(),c},i}(H5P.jQuery),S=function(e){const t=e.length;return function i(){const n=Array.prototype.slice.call(arguments,0);return n.length>=t?e.apply(null,n):function(){const e=Array.prototype.slice.call(arguments,0);return i.apply(null,n.concat(e))}}},w=S((function(e,t){t.forEach(e)})),x=(S((function(e,t){return t.map(e)})),S((function(e,t){return t.filter(e)}))),k=(S((function(e,t){return t.some(e)})),S((function(e,t){return-1!=t.indexOf(e)}))),T=S((function(e,t){return x((t=>!k(t,e)),t)})),E=S(((e,t)=>t.getAttribute(e))),C=S(((e,t,i)=>i.setAttribute(e,t))),P=S(((e,t)=>t.removeAttribute(e))),$=S(((e,t)=>t.hasAttribute(e))),I=(S(((e,t,i)=>i.getAttribute(e)===t)),S(((e,t)=>{const i=E(e,t);C(e,("true"!==i).toString(),t)})),S(((e,t)=>e.appendChild(t))),S(((e,t)=>t.querySelector(e))),S(((e,t)=>{return i=t.querySelectorAll(e),Array.prototype.slice.call(i);var i})),S(((e,t)=>e.removeChild(t))),S(((e,t)=>t.classList.contains(e))),S(((e,t)=>t.classList.add(e)))),A=S(((e,t)=>t.classList.remove(e))),B=I("hidden"),H=A("hidden"),M=(S(((e,t)=>(e?H:B)(t))),S(((e,t,i)=>{i.classList[t?"add":"remove"](e)})),P("tabindex")),L=(w(M),C("tabindex","0")),K=C("tabindex","-1"),F=$("tabindex");class W{constructor(e){Object.assign(this,{listeners:{},on:function(e,t,i){const n={listener:t,scope:i};return this.listeners[e]=this.listeners[e]||[],this.listeners[e].push(n),this},fire:function(e,t){return(this.listeners[e]||[]).every((function(e){return!1!==e.listener.call(e.scope||this,t)}))},propagate:function(e,t){let i=this;e.forEach((e=>t.on(e,(t=>i.fire(e,t)))))}}),this.plugins=e||[],this.elements=[],this.negativeTabIndexAllowed=!1,this.on("nextElement",this.nextElement,this),this.on("previousElement",this.previousElement,this),this.on("firstElement",this.firstElement,this),this.on("lastElement",this.lastElement,this),this.initPlugins()}addElement(e){this.elements.push(e),this.firesEvent("addElement",e),1===this.elements.length&&this.setTabbable(e)}insertElementAt(e,t){this.elements.splice(t,0,e),this.firesEvent("addElement",e),1===this.elements.length&&this.setTabbable(e)}removeElement(e){this.elements=T([e],this.elements),F(e)&&(this.setUntabbable(e),this.elements[0]&&this.setTabbable(this.elements[0])),this.firesEvent("removeElement",e)}count(){return this.elements.length}firesEvent(e,t){const i=this.elements.indexOf(t);return this.fire(e,{element:t,index:i,elements:this.elements,oldElement:this.tabbableElement})}nextElement({index:e}){const t=e===this.elements.length-1,i=this.elements[t?0:e+1];this.setTabbable(i),i.focus()}firstElement(){const e=this.elements[0];this.setTabbable(e),e.focus()}lastElement(){const e=this.elements[this.elements.length-1];this.setTabbable(e),e.focus()}setTabbableByIndex(e){const t=this.elements[e];t&&this.setTabbable(t)}setTabbable(e){w(this.setUntabbable.bind(this),this.elements),L(e),this.tabbableElement=e}setUntabbable(e){e!==document.activeElement&&(this.negativeTabIndexAllowed?K(e):M(e))}previousElement({index:e}){const t=0===e,i=this.elements[t?this.elements.length-1:e-1];this.setTabbable(i),i.focus()}useNegativeTabIndex(){this.negativeTabIndexAllowed=!0,this.elements.forEach((e=>{e.hasAttribute("tabindex")||K(e)}))}initPlugins(){this.plugins.forEach((function(e){void 0!==e.init&&e.init(this)}),this)}}class j{constructor(){this.selectability=!0}init(e){this.boundHandleKeyDown=this.handleKeyDown.bind(this),this.controls=e,this.controls.on("addElement",this.listenForKeyDown,this),this.controls.on("removeElement",this.removeKeyDownListener,this)}listenForKeyDown({element:e}){e.addEventListener("keydown",this.boundHandleKeyDown)}removeKeyDownListener({element:e}){e.removeEventListener("keydown",this.boundHandleKeyDown)}handleKeyDown(e){switch(e.which){case 27:this.close(e.target),e.preventDefault(),e.stopPropagation();break;case 35:this.lastElement(e.target),e.preventDefault(),e.stopPropagation();break;case 36:this.firstElement(e.target),e.preventDefault(),e.stopPropagation();break;case 13:case 32:this.select(e.target),e.preventDefault(),e.stopPropagation();break;case 37:case 38:this.hasChromevoxModifiers(e)||(this.previousElement(e.target),e.preventDefault(),e.stopPropagation());break;case 39:case 40:this.hasChromevoxModifiers(e)||(this.nextElement(e.target),e.preventDefault(),e.stopPropagation())}}hasChromevoxModifiers(e){return e.shiftKey||e.ctrlKey}previousElement(e){!1!==this.controls.firesEvent("beforePreviousElement",e)&&(this.controls.firesEvent("previousElement",e),this.controls.firesEvent("afterPreviousElement",e))}nextElement(e){!1!==this.controls.firesEvent("beforeNextElement",e)&&(this.controls.firesEvent("nextElement",e),this.controls.firesEvent("afterNextElement",e))}select(e){this.selectability&&!1!==this.controls.firesEvent("before-select",e)&&(this.controls.firesEvent("select",e),this.controls.firesEvent("after-select",e))}firstElement(e){!1!==this.controls.firesEvent("beforeFirstElement",e)&&(this.controls.firesEvent("firstElement",e),this.controls.firesEvent("afterFirstElement",e))}lastElement(e){!1!==this.controls.firesEvent("beforeLastElement",e)&&(this.controls.firesEvent("lastElement",e),this.controls.firesEvent("afterLastElement",e))}disableSelectability(){this.selectability=!1}enableSelectability(){this.selectability=!0}close(e){!1!==this.controls.firesEvent("before-close",e)&&(this.controls.firesEvent("close",e),this.controls.firesEvent("after-close",e))}}function D(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}var O="none",N="not-answered",z="answered",R="has-only-correct",Q="has-incorrect";const U=function(e){function t(e){var t;this.cp=e,this.answeredLabels=(D(t={},N,this.cp.l10n.containsNotCompleted),D(t,z,this.cp.l10n.containsCompleted),D(t,R,this.cp.l10n.containsOnlyCorrect),D(t,Q,this.cp.l10n.containsIncorrectAnswers),D(t,O,"@slideName"),t),this.initProgressbar(this.cp.slidesWithSolutions),this.initFooter(),this.initTaskAnsweredListener(),this.toggleNextAndPreviousButtonDisabled(this.cp.getCurrentSlideIndex())}return t.prototype.initTaskAnsweredListener=function(){var e=this;this.cp.elementInstances.forEach((function(t,i){t.filter((function(e){return a(e.on)})).forEach((function(t){t.on("xAPI",(function(t){var n=t.getVerb();if(d(["interacted","answered","attempted"],n)){var s=e.cp.slideHasAnsweredTask(i);e.setTaskAnswered(i,s)}else"completed"===n&&t.setVerb("answered");void 0===t.data.statement.context.extensions&&(t.data.statement.context.extensions={}),t.data.statement.context.extensions["http://id.tincanapi.com/extension/ending-point"]=i+1}))}))}))},t.prototype.initProgressbar=function(t){var i=this,n=this,s=n.cp.previousState&&n.cp.previousState.progress||0;this.progresbarKeyboardControls=new W([new j]),this.progresbarKeyboardControls.negativeTabIndexAllowed=!0,this.progresbarKeyboardControls.on("select",(function(t){n.displaySlide(e(t.element).data("slideNumber"))})),this.progresbarKeyboardControls.on("beforeNextElement",(function(e){return e.index!==e.elements.length-1})),this.progresbarKeyboardControls.on("beforePreviousElement",(function(e){return 0!==e.index})),void 0!==this.cp.progressbarParts&&this.cp.progressbarParts&&this.cp.progressbarParts.forEach((function(e){n.progresbarKeyboardControls.removeElement(e.children("a").get(0)),e.remove()})),n.cp.progressbarParts=[];for(var r=function(t){t.preventDefault();var i=e(this).data("slideNumber");n.progresbarKeyboardControls.setTabbableByIndex(i),n.displaySlide(i),n.cp.focus()},o=0;o<this.cp.slides.length;o+=1){var a=this.cp.slides[o],l=this.createSlideTitle(o),d=e("<li>",{class:"h5p-progressbar-part"}).appendTo(n.cp.$progressbar),h=e("<a>",{href:"#",html:'<span class="h5p-progressbar-part-title hidden-but-read">'+l+"</span>",tabindex:"-1"}).data("slideNumber",o).click(r).appendTo(d);if(this.progresbarKeyboardControls.addElement(h.get(0)),c||function(){var t=e("<div/>",{class:"h5p-progressbar-popup",html:l,"aria-hidden":"true"}).appendTo(d);d.mouseenter((function(){return i.ensurePopupVisible(t)}))}(),this.isSummarySlide(o)&&d.addClass("progressbar-part-summary-slide"),0===o&&d.addClass("h5p-progressbar-part-show"),o===s&&d.addClass("h5p-progressbar-part-selected"),n.cp.progressbarParts.push(d),this.updateSlideTitle(o),this.cp.slides.length<=60&&a.elements&&a.elements.length>0){var p=t[o]&&t[o].length>0,u=!!(n.cp.previousState&&n.cp.previousState.answered&&n.cp.previousState.answered[o]);p&&(e("<div>",{class:"h5p-progressbar-part-has-task"}).appendTo(h),this.setTaskAnswered(o,u))}}},t.prototype.ensurePopupVisible=function(e){var t=this.cp.$container.width(),i=e.outerWidth(),n=e.offset().left;n<0?(e.css("left",0),e.css("transform","translateX(0)")):n+i>t&&(e.css("left","auto"),e.css("right",0),e.css("transform","translateX(0)"))},t.prototype.displaySlide=function(e){var t=this.cp.getCurrentSlideIndex();this.updateSlideTitle(e,{isCurrent:!0}),this.updateSlideTitle(t,{isCurrent:!1}),this.cp.jumpToSlide(e),this.toggleNextAndPreviousButtonDisabled(e)},t.prototype.createSlideTitle=function(e){var t=this.cp.slides[e];return t.keywords&&t.keywords.length>0?t.keywords[0].main:this.isSummarySlide(e)?this.cp.l10n.summary:this.cp.l10n.slide+" "+(e+1)},t.prototype.isSummarySlide=function(e){return!(void 0!==this.cp.editor||e!==this.cp.slides.length-1||!this.cp.showSummarySlide)},t.prototype.initFooter=function(){var t=this,i=this,n=this.cp.$footer,s=e("<div/>",{class:"h5p-footer-left-adjusted"}).appendTo(n),r=e("<div/>",{class:"h5p-footer-center-adjusted"}).appendTo(n),o=e("<div/>",{role:"toolbar",class:"h5p-footer-right-adjusted"}).appendTo(n);this.cp.$keywordsButton=e("<div/>",{class:"h5p-footer-button h5p-footer-toggle-keywords","aria-expanded":"false","aria-label":this.cp.l10n.showKeywords,title:this.cp.l10n.showKeywords,role:"button",tabindex:"0",html:'<span class="h5p-icon-menu"></span><span class="current-slide-title"></span>'}).appendTo(s),f(this.cp.$keywordsButton,(function(e){i.cp.presentation.keywordListAlwaysShow||(i.cp.toggleKeywords(),e.stopPropagation())})),!this.cp.presentation.keywordListAlwaysShow&&this.cp.initKeywords||this.cp.$keywordsButton.hide(),this.cp.presentation.keywordListEnabled||this.cp.$keywordsWrapper.add(this.$keywordsButton).hide(),this.updateFooterKeyword(0),this.cp.$prevSlideButton=e("<div/>",{class:"h5p-footer-button h5p-footer-previous-slide","aria-label":this.cp.l10n.prevSlide,title:this.cp.l10n.prevSlide,role:"button",tabindex:"-1","aria-disabled":"true"}).appendTo(r),f(this.cp.$prevSlideButton,(function(){return t.cp.previousSlide()}));var a=e("<div/>",{class:"h5p-footer-slide-count"}).appendTo(r);this.cp.$footerCurrentSlide=e("<div/>",{html:"1",class:"h5p-footer-slide-count-current",title:this.cp.l10n.currentSlide,"aria-hidden":"true"}).appendTo(a),this.cp.$footerCounter=e("<div/>",{class:"hidden-but-read",html:this.cp.l10n.slideCount.replace("@index","1").replace("@total",this.cp.slides.length.toString())}).appendTo(r),e("<div/>",{html:"/",class:"h5p-footer-slide-count-delimiter","aria-hidden":"true"}).appendTo(a),this.cp.$footerMaxSlide=e("<div/>",{html:this.cp.slides.length,class:"h5p-footer-slide-count-max",title:this.cp.l10n.lastSlide,"aria-hidden":"true"}).appendTo(a),this.cp.$nextSlideButton=e("<div/>",{class:"h5p-footer-button h5p-footer-next-slide","aria-label":this.cp.l10n.nextSlide,title:this.cp.l10n.nextSlide,role:"button",tabindex:"0"}).appendTo(r),f(this.cp.$nextSlideButton,(function(){return t.cp.nextSlide()})),void 0===this.cp.editor&&(this.cp.$exitSolutionModeButton=e("<div/>",{role:"button",class:"h5p-footer-exit-solution-mode","aria-label":this.cp.l10n.solutionModeTitle,title:this.cp.l10n.solutionModeTitle,tabindex:"0"}).appendTo(o),f(this.cp.$exitSolutionModeButton,(function(){return i.cp.jumpToSlide(i.cp.slides.length-1)})),this.cp.enablePrintButton&&b.supported()&&(this.cp.$printButton=e("<div/>",{class:"h5p-footer-button h5p-footer-print","aria-label":this.cp.l10n.printTitle,title:this.cp.l10n.printTitle,role:"button",tabindex:"0"}).appendTo(o),f(this.cp.$printButton,(function(){return i.openPrintDialog()}))),H5P.fullscreenSupported&&(this.cp.$fullScreenButton=e("<div/>",{class:"h5p-footer-button h5p-footer-toggle-full-screen","aria-label":this.cp.l10n.fullscreen,title:this.cp.l10n.fullscreen,role:"button",tabindex:"0"}),f(this.cp.$fullScreenButton,(function(){return i.cp.toggleFullScreen()})),this.cp.$fullScreenButton.appendTo(o))),this.cp.$exitSolutionModeText=e("<div/>",{html:"",class:"h5p-footer-exit-solution-mode-text"}).appendTo(this.cp.$exitSolutionModeButton)},t.prototype.openPrintDialog=function(){var t=this,i=e(".h5p-wrapper");b.showDialog(this.cp.l10n,i,(function(e){b.print(t.cp,i,e)})).children('[role="dialog"]').focus()},t.prototype.updateProgressBar=function(e,t,i){var n,s=this;for(n=0;n<s.cp.progressbarParts.length;n+=1)e+1>n?s.cp.progressbarParts[n].addClass("h5p-progressbar-part-show"):s.cp.progressbarParts[n].removeClass("h5p-progressbar-part-show");s.progresbarKeyboardControls.setTabbableByIndex(e),s.cp.progressbarParts[e].addClass("h5p-progressbar-part-selected").siblings().removeClass("h5p-progressbar-part-selected"),void 0!==t?!i&&s.cp.editor:s.cp.progressbarParts.forEach((function(e,t){s.setTaskAnswered(t,!1)}))},t.prototype.setTaskAnswered=function(e,t){this.cp.progressbarParts[e].find(".h5p-progressbar-part-has-task").toggleClass("h5p-answered",t),this.updateSlideTitle(e,{state:t?z:N})},t.prototype.updateSlideTitle=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=t.state,n=t.isCurrent;this.setSlideTitle(e,{state:h(i,this.getAnsweredState(e)),isCurrent:h(n,this.cp.isCurrentSlide(e))})},t.prototype.setSlideTitle=function(e,t){var i=t.state,n=void 0===i?O:i,s=t.isCurrent,r=void 0!==s&&s,o=this.cp.slides.length,a=this.cp.progressbarParts[e].find(".h5p-progressbar-part-title"),l=this.cp.l10n.slideCount.replace("@index",e+1).replace("@total",o),c=this.answeredLabels[n].replace("@slideName",this.createSlideTitle(e)),d=r?this.cp.l10n.currentSlide:"";a.html("".concat(l,": ").concat(c,". ").concat(d))},t.prototype.getAnsweredState=function(e){var t=this.cp.progressbarParts[e],i=this.slideHasInteraction(e),n=this.cp.slideHasAnsweredTask(e);return i?t.find(".h5p-is-correct").length>0?R:t.find(".h5p-is-wrong").length>0?Q:n?z:N:O},t.prototype.slideHasInteraction=function(e){return this.cp.progressbarParts[e].find(".h5p-progressbar-part-has-task").length>0},t.prototype.updateFooter=function(e){this.cp.$footerCurrentSlide.html(e+1),this.cp.$footerMaxSlide.html(this.cp.slides.length),this.cp.$footerCounter.html(this.cp.l10n.slideCount.replace("@index",(e+1).toString()).replace("@total",this.cp.slides.length.toString())),this.cp.isSolutionMode&&e===this.cp.slides.length-1?this.cp.$footer.addClass("summary-slide"):this.cp.$footer.removeClass("summary-slide"),this.toggleNextAndPreviousButtonDisabled(e),this.updateFooterKeyword(e)},t.prototype.toggleNextAndPreviousButtonDisabled=function(e){var t=this.cp.slides.length-1;this.cp.$prevSlideButton.attr("aria-disabled",(0===e).toString()),this.cp.$nextSlideButton.attr("aria-disabled",(e===t).toString()),this.cp.$prevSlideButton.attr("tabindex",0===e?"-1":"0"),this.cp.$nextSlideButton.attr("tabindex",e===t?"-1":"0")},t.prototype.updateFooterKeyword=function(e){var t=this.cp.slides[e],i="";t&&t.keywords&&t.keywords[0]&&(i=t.keywords[0].main),!this.cp.isEditor()&&this.cp.showSummarySlide&&e>=this.cp.slides.length-1&&(i=this.cp.l10n.summary),this.cp.$keywordsButton.children(".current-slide-title").html(h(i,""))},t}(H5P.jQuery);var G=function(e){var t=e.presentation;t=n.extend(!0,{globalBackgroundSelector:{fillGlobalBackground:"",imageGlobalBackground:{}},slides:[{slideBackgroundSelector:{fillSlideBackground:"",imageSlideBackground:{}}}]},t);var i,s=function(t,i,n){var s=e.$slidesWrapper.children().filter(":not(.h5p-summary-slide)");void 0!==n&&(s=s.eq(n)),t&&""!==t?s.addClass("has-background").css("background-image","").css("background-color",t):i&&i.path&&s.addClass("has-background").css("background-color","").css("background-image","url("+H5P.getPath(i.path,e.contentId)+")")};i=t.globalBackgroundSelector,s(i.fillGlobalBackground,i.imageGlobalBackground),t.slides.forEach((function(e,t){var i=e.slideBackgroundSelector;i&&s(i.fillSlideBackground,i.imageSlideBackground,t)}))},q=function(e){return parseInt(e.dataset.index)},X=function(){function e(e){var t=this,i=e.l10n,n=e.currentIndex;this.l10n=i,this.state={currentIndex:h(n,0)},this.eventDispatcher=new s,this.controls=new W([new j]),this.controls.on("select",(function(e){t.onMenuItemSelect(q(e.element))})),this.controls.on("close",(function(){return t.eventDispatcher.trigger("close")})),this.menuElement=this.createMenuElement(),this.currentSlideMarkerElement=this.createCurrentSlideMarkerElement()}var t=e.prototype;return t.init=function(e){var t=this;return this.menuItemElements=e.map((function(e){return t.createMenuItemElement(e)})),this.menuItemElements.forEach((function(e){return t.menuElement.appendChild(e)})),this.menuItemElements.forEach((function(e){return t.controls.addElement(e)})),this.setCurrentSlideIndex(this.state.currentIndex),this.menuItemElements},t.on=function(e,t){this.eventDispatcher.on(e,t)},t.getElement=function(){return this.menuElement},t.removeAllMenuItemElements=function(){var e=this;this.menuItemElements.forEach((function(t){e.controls.removeElement(t),e.menuElement.removeChild(t)})),this.menuItemElements=[]},t.createMenuElement=function(){var e=this.menuElement=document.createElement("ol");return e.setAttribute("role","menu"),e.classList.add("list-unstyled"),e},t.createMenuItemElement=function(e){var t=this,i=document.createElement("li");return i.setAttribute("role","menuitem"),i.addEventListener("click",(function(e){t.onMenuItemSelect(q(e.currentTarget))})),this.applyConfigToMenuItemElement(i,e),i},t.applyConfigToMenuItemElement=function(e,t){e.innerHTML='<div class="h5p-keyword-subtitle">'.concat(t.subtitle,'</div><span class="h5p-keyword-title">').concat(t.title,"</span>"),e.dataset.index=t.index},t.onMenuItemSelect=function(e){this.setCurrentSlideIndex(e),this.eventDispatcher.trigger("select",{index:e})},t.setCurrentSlideIndex=function(e){var t=this.getElementByIndex(this.menuItemElements,e);t&&(this.state.currentIndex=e,this.updateCurrentlySelected(this.menuItemElements,this.state),this.controls.setTabbable(t))},t.updateCurrentlySelected=function(e,t){var i=this;e.forEach((function(e){var n=t.currentIndex===q(e);e.classList.toggle("h5p-current",n),n&&e.appendChild(i.currentSlideMarkerElement)}))},t.scrollToKeywords=function(e){var t=this.getFirstElementAfter(e);if(t){var i=n(this.menuElement),s=i.scrollTop()+n(t).position().top-8;l?i.scrollTop(s):i.stop().animate({scrollTop:s},250)}},t.getFirstElementAfter=function(e){return this.menuItemElements.filter((function(t){return q(t)>=e}))[0]},t.getElementByIndex=function(e,t){return e.filter((function(e){return q(e)===t}))[0]},t.createCurrentSlideMarkerElement=function(){var e=document.createElement("div");return e.classList.add("hidden-but-read"),e.innerHTML=this.l10n.currentSlide,e},e}(),V="specified",Y="next",J="previous",_=function(){function e(e,t){var i=this,r=e.title,o=e.goToSlide,a=void 0===o?1:o,l=e.invisible,c=e.goToSlideType,d=void 0===c?V:c,h=t.l10n,p=t.currentIndex;this.eventDispatcher=new s;var u="h5p-press-to-go",m=0;if(l)r=void 0,m=-1;else{if(!r)switch(d){case V:r=h.goToSlide.replace(":num",a.toString());break;case Y:r=h.goToSlide.replace(":num",h.nextSlide);break;case J:r=h.goToSlide.replace(":num",h.prevSlide)}u+=" h5p-visible"}var v=a-1;d===Y?v=p+1:d===J&&(v=p-1),this.$element=n("<a/>",{href:"#",class:u,tabindex:m,title:r}),f(this.$element,(function(e){i.eventDispatcher.trigger("navigate",v),e.preventDefault()}))}var t=e.prototype;return t.attach=function(e){e.html("").addClass("h5p-go-to-slide").append(this.$element)},t.on=function(e,t){this.eventDispatcher.on(e,t)},e}();const Z=function(e){var t=this;if(void 0===e.action)t.instance=new _(e,{l10n:t.parent.parent.l10n,currentIndex:t.parent.index}),t.parent.parent.isEditor()||t.instance.on("navigate",(function(e){var i=e.data;t.parent.parent.jumpToSlide(i)}));else{var i;(i=t.parent.parent.isEditor()?H5P.jQuery.extend(!0,{},e.action,t.parent.parent.elementsOverride):H5P.jQuery.extend(!0,e.action,t.parent.parent.elementsOverride)).params.autoplay?(i.params.autoplay=!1,i.params.cpAutoplay=!0):i.params.playback&&i.params.playback.autoplay?(i.params.playback.autoplay=!1,i.params.cpAutoplay=!0):i.params.media&&i.params.media.params&&i.params.media.params.playback&&i.params.media.params.playback.autoplay?(i.params.media.params.playback.autoplay=!1,i.params.cpAutoplay=!0):i.params.media&&i.params.media.params&&i.params.media.params.autoplay?(i.params.media.params.autoplay=!1,i.params.cpAutoplay=!0):i.params.override&&i.params.override.autoplay&&(i.params.override.autoplay=!1,i.params.cpAutoplay=!0);var n=t.parent.parent.elementInstances[t.parent.index]?t.parent.parent.elementInstances[t.parent.index].length:0;t.parent.parent.previousState&&t.parent.parent.previousState.answers&&t.parent.parent.previousState.answers[t.parent.index]&&t.parent.parent.previousState.answers[t.parent.index][n]&&(i.userDatas={state:t.parent.parent.previousState.answers[t.parent.index][n]}),i.params=i.params||{},t.instance=H5P.newRunnable(i,t.parent.parent.contentId,void 0,!0,{parent:t.parent.parent}),void 0!==t.instance.preventResize&&(t.instance.preventResize=!0)}void 0===t.parent.parent.elementInstances[t.parent.index]?t.parent.parent.elementInstances[t.parent.index]=[t.instance]:t.parent.parent.elementInstances[t.parent.index].push(t.instance),(void 0!==t.instance.showCPComments||t.instance.isTask||void 0===t.instance.isTask&&void 0!==t.instance.showSolutions)&&(t.instance.coursePresentationIndexOnSlide=t.parent.parent.elementInstances[t.parent.index].length-1,void 0===t.parent.parent.slidesWithSolutions[t.parent.index]&&(t.parent.parent.slidesWithSolutions[t.parent.index]=[]),t.parent.parent.slidesWithSolutions[t.parent.index].push(t.instance)),void 0!==t.instance.exportAnswers&&t.instance.exportAnswers&&(t.parent.parent.hasAnswerElements=!0),t.parent.parent.isTask||t.parent.parent.hideSummarySlide||(t.instance.isTask||void 0===t.instance.isTask&&void 0!==t.instance.showSolutions)&&(t.parent.parent.isTask=!0)};function ee(e){var i,n=this;t().call(n,Z,e.elements),n.getElement=function(){return i||(i=H5P.jQuery(ee.createHTML(e))),i},n.setCurrent=function(){this.parent.$current=i.addClass("h5p-current")},n.appendElements=function(){for(var t=0;t<n.children.length;t++)n.parent.attachElement(e.elements[t],n.children[t].instance,i,n.index);n.parent.elementsAttached[n.index]=!0,n.parent.trigger("domChanged",{$target:i,library:"CoursePresentation",key:"newSlide"},{bubbles:!0,external:!0})}}ee.createHTML=function(e){return'<div role="document" class="h5p-slide"'+(void 0!==e.background?' style="background:'+e.background+'"':"")+"></div>"};const te=ee;function ie(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var i=e&&("undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"]);if(null==i)return;var n,s,r=[],o=!0,a=!1;try{for(i=i.call(e);!(o=(n=i.next()).done)&&(r.push(n.value),!t||r.length!==t);o=!0);}catch(e){a=!0,s=e}finally{try{o||null==i.return||i.return()}finally{if(a)throw s}}return r}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return ne(e,t);var i=Object.prototype.toString.call(e).slice(8,-1);"Object"===i&&e.constructor&&(i=e.constructor.name);if("Map"===i||"Set"===i)return Array.from(e);if("Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i))return ne(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function ne(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,n=new Array(t);i<t;i++)n[i]=e[i];return n}function se(e){return(se="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var re=function(e,i,s){var r=this;this.presentation=e.presentation,this.slides=this.presentation.slides,this.contentId=i,this.elementInstances=[],this.elementsAttached=[],this.slidesWithSolutions=[],this.hasAnswerElements=!1,this.ignoreResize=!1,this.isTask=!1,s.cpEditor&&(this.editor=s.cpEditor),s&&(this.previousState=s.previousState),this.currentSlideIndex=this.previousState&&this.previousState.progress?this.previousState.progress:0,this.presentation.keywordListEnabled=void 0===e.presentation.keywordListEnabled||e.presentation.keywordListEnabled,this.l10n=n.extend({slide:"Slide",score:"Score",yourScore:"Your score",maxScore:"Max score",total:"Total",totalScore:"Total Score",showSolutions:"Show solutions",summary:"summary",retry:"Retry",exportAnswers:"Export text",close:"Close",hideKeywords:"Hide sidebar navigation menu",showKeywords:"Show sidebar navigation menu",fullscreen:"Fullscreen",exitFullscreen:"Exit fullscreen",prevSlide:"Previous slide",nextSlide:"Next slide",currentSlide:"Current slide",lastSlide:"Last slide",solutionModeTitle:"Exit solution mode",solutionModeText:"Solution Mode",summaryMultipleTaskText:"Multiple tasks",scoreMessage:"You achieved:",shareFacebook:"Share on Facebook",shareTwitter:"Share on Twitter",shareGoogle:"Share on Google+",goToSlide:"Go to slide :num",solutionsButtonTitle:"Show comments",printTitle:"Print",printIngress:"How would you like to print this presentation?",printAllSlides:"Print all slides",printCurrentSlide:"Print current slide",noTitle:"No title",accessibilitySlideNavigationExplanation:"Use left and right arrow to change slide in that direction whenever canvas is selected.",containsNotCompleted:"@slideName contains not completed interaction",containsCompleted:"@slideName contains completed interaction",slideCount:"Slide @index of @total",accessibilityCanvasLabel:"Presentation canvas. Use left and right arrow to move between slides.",containsOnlyCorrect:"@slideName only has correct answers",containsIncorrectAnswers:"@slideName has incorrect answers",shareResult:"Share Result",accessibilityTotalScore:"You got @score of @maxScore points in total",accessibilityEnteredFullscreen:"Entered fullscreen",accessibilityExitedFullscreen:"Exited fullscreen"},void 0!==e.l10n?e.l10n:{}),e.override&&(this.activeSurface=!!e.override.activeSurface,this.hideSummarySlide=!!e.override.hideSummarySlide,this.enablePrintButton=!!e.override.enablePrintButton,this.showSummarySlideSolutionButton=void 0===e.override.summarySlideSolutionButton||e.override.summarySlideSolutionButton,this.showSummarySlideRetryButton=void 0===e.override.summarySlideRetryButton||e.override.summarySlideRetryButton,e.override.social&&(this.enableTwitterShare=!!e.override.social.showTwitterShare,this.enableFacebookShare=!!e.override.social.showFacebookShare,this.enableGoogleShare=!!e.override.social.showGoogleShare,this.twitterShareStatement=e.override.social.twitterShare.statement,this.twitterShareHashtags=e.override.social.twitterShare.hashtags,this.twitterShareUrl=e.override.social.twitterShare.url,this.facebookShareUrl=e.override.social.facebookShare.url,this.facebookShareQuote=e.override.social.facebookShare.quote,this.googleShareUrl=e.override.social.googleShareUrl)),this.keywordMenu=new X({l10n:this.l10n,currentIndex:void 0!==this.previousState?this.previousState.progress:0}),this.setElementsOverride(e.override),t().call(this,te,e.presentation.slides),this.on("resize",this.resize,this),this.on("printing",(function(e){r.ignoreResize=!e.data.finished,e.data.finished?r.resize():e.data.allSlides&&r.attachAllElements()})),this.scores=this.previousState&&this.previousState.scores||{},this.trackScores()};(re.prototype=Object.create(t().prototype)).constructor=re,re.prototype.trackScores=function(){var e=this;this.slidesWithSolutions.forEach((function(t){t.forEach((function(t){t.on("xAPI",(function(i){var n=i.getScore();null!==n&&(e.scores[t.subContentId]=n)}))}))}))},re.prototype.getCurrentState=function(){var e=this,t=this.previousState?this.previousState:{};t.progress=this.getCurrentSlideIndex(),t.answers||(t.answers=[]),t.answered=this.elementInstances.map((function(t,i){return e.slideHasAnsweredTask(i)}));for(var i=0;i<this.elementInstances.length;i++)if(this.elementInstances[i])for(var n=0;n<this.elementInstances[i].length;n++){var s=this.elementInstances[i][n];(s.getCurrentState instanceof Function||"function"==typeof s.getCurrentState)&&(t.answers[i]||(t.answers[i]=[]),t.answers[i][n]=s.getCurrentState())}return t.scores=this.scores,t},re.prototype.slideHasAnsweredTask=function(e){return(this.slidesWithSolutions[e]||[]).filter((function(e){return a(e.getAnswerGiven)})).some((function(e){return e.getAnswerGiven()}))},re.prototype.attach=function(e){var t=this,i=this;void 0!==this.isRoot&&this.isRoot()&&this.setActivityStarted();var s='<div class="h5p-keymap-explanation hidden-but-read">'+this.l10n.accessibilitySlideNavigationExplanation+'</div><div class="h5p-fullscreen-announcer hidden-but-read" aria-live="polite"></div><div class="h5p-wrapper" tabindex="0" aria-label="'+this.l10n.accessibilityCanvasLabel+'">  <div class="h5p-current-slide-announcer hidden-but-read" aria-live="polite"></div>  <div tabindex="-1"></div>  <div class="h5p-box-wrapper">    <div class="h5p-presentation-wrapper">      <div class="h5p-keywords-wrapper"></div>     <div class="h5p-slides-wrapper"></div>    </div>  </div>  <nav class="h5p-cp-navigation">    <ol class="h5p-progressbar list-unstyled"></ol>  </nav>  <div class="h5p-footer"></div></div>';e.attr("role","application").addClass("h5p-course-presentation").html(s),this.$container=e,this.$slideAnnouncer=e.find(".h5p-current-slide-announcer"),this.$fullscreenAnnouncer=e.find(".h5p-fullscreen-announcer"),this.$slideTop=this.$slideAnnouncer.next(),this.$wrapper=e.children(".h5p-wrapper").focus((function(){i.initKeyEvents()})).blur((function(){void 0!==i.keydown&&(H5P.jQuery("body").unbind("keydown",i.keydown),delete i.keydown)})).click((function(e){var t=H5P.jQuery(e.target),n=i.belongsToTagName(e.target,["input","textarea","a","button"],e.currentTarget),s=-1!==e.target.tabIndex,r=t.closest(".h5p-popup-container"),o=0!==r.length;if(!n&&!s&&!i.editor)if(o){var a=t.closest("[tabindex]");1===a.closest(".h5p-popup-container").length?a.focus():r.find(".h5p-close-popup").focus()}else i.$wrapper.focus();i.presentation.keywordListEnabled&&!i.presentation.keywordListAlwaysShow&&i.presentation.keywordListAutoHide&&!t.is("textarea, .h5p-icon-pencil, span")&&i.hideKeywords()})),this.on("exitFullScreen",(function(){t.$footer.removeClass("footer-full-screen"),t.$fullScreenButton.attr("title",t.l10n.fullscreen),t.$fullscreenAnnouncer.html(t.l10n.accessibilityExitedFullscreen)})),this.on("enterFullScreen",(function(){t.$fullscreenAnnouncer.html(t.l10n.accessibilityEnteredFullscreen)}));var r=parseInt(this.$wrapper.css("width"));this.width=0!==r?r:640;var o=parseInt(this.$wrapper.css("height"));this.height=0!==o?o:400,this.ratio=16/9,this.fontSize=16,this.$boxWrapper=this.$wrapper.children(".h5p-box-wrapper");var a,l=this.$boxWrapper.children(".h5p-presentation-wrapper");if(this.$slidesWrapper=l.children(".h5p-slides-wrapper"),this.$keywordsWrapper=l.children(".h5p-keywords-wrapper"),this.$progressbar=this.$wrapper.find(".h5p-progressbar"),this.$footer=this.$wrapper.children(".h5p-footer"),this.initKeywords=void 0===this.presentation.keywordListEnabled||!0===this.presentation.keywordListEnabled||void 0!==this.editor,this.activeSurface&&void 0===this.editor&&(this.initKeywords=!1,this.$boxWrapper.css("height","100%")),this.isSolutionMode=!1,this.createSlides(),this.elementsAttached[this.currentSlideIndex]=!0,this.showSummarySlide=!1,this.hideSummarySlide?this.showSummarySlide=!this.hideSummarySlide:this.slidesWithSolutions.forEach((function(e){i.showSummarySlide=e.length})),void 0===this.editor&&(this.showSummarySlide||this.hasAnswerElements)){var c={elements:[],keywords:[]};this.slides.push(c),(a=H5P.jQuery(te.createHTML(c)).appendTo(this.$slidesWrapper)).addClass("h5p-summary-slide"),this.isCurrentSlide(this.slides.length-1)&&(this.$current=a)}var d=this.getKeywordMenuConfig();d.length>0||this.isEditor()?(this.keywordMenu.init(d),this.keywordMenu.on("select",(function(e){return t.keywordClick(e.data.index)})),this.keywordMenu.on("close",(function(){return t.hideKeywords()})),this.keywordMenu.on("select",(function(){t.$currentKeyword=t.$keywords.children(".h5p-current")})),this.$keywords=n(this.keywordMenu.getElement()).appendTo(this.$keywordsWrapper),this.$currentKeyword=this.$keywords.children(".h5p-current"),this.setKeywordsOpacity(void 0===this.presentation.keywordListOpacity?90:this.presentation.keywordListOpacity),this.presentation.keywordListAlwaysShow&&this.showKeywords()):(this.$keywordsWrapper.remove(),this.initKeywords=!1),void 0===this.editor&&this.activeSurface?(this.$progressbar.add(this.$footer).remove(),H5P.fullscreenSupported&&(this.$fullScreenButton=H5P.jQuery("<div/>",{class:"h5p-toggle-full-screen",title:this.l10n.fullscreen,role:"button",tabindex:0,appendTo:this.$wrapper}),f(this.$fullScreenButton,(function(){return i.toggleFullScreen()})))):(this.initTouchEvents(),this.navigationLine=new U(this),this.previousState&&this.previousState.progress||this.setSlideNumberAnnouncer(0,!1),this.summarySlideObject=new y(this,a)),new G(this),this.previousState&&this.previousState.progress&&this.jumpToSlide(this.previousState.progress)},re.prototype.belongsToTagName=function(e,t,i){if(!e)return!1;i=i||document.body,"string"==typeof t&&(t=[t]),t=t.map((function(e){return e.toLowerCase()}));var n=e.tagName.toLowerCase();return-1!==t.indexOf(n)||i!==e&&this.belongsToTagName(e.parentNode,t,i)},re.prototype.updateKeywordMenuFromSlides=function(){this.keywordMenu.removeAllMenuItemElements();var e=this.getKeywordMenuConfig();return n(this.keywordMenu.init(e))},re.prototype.getKeywordMenuConfig=function(){var e=this;return this.slides.map((function(t,i){return{title:e.createSlideTitle(t),subtitle:"".concat(e.l10n.slide," ").concat(i+1),index:i}})).filter((function(e){return null!==e.title}))},re.prototype.createSlideTitle=function(e){var t=this.isEditor()?this.l10n.noTitle:null;return this.hasKeywords(e)?e.keywords[0].main:t},re.prototype.isEditor=function(){return void 0!==this.editor},re.prototype.hasKeywords=function(e){return void 0!==e.keywords&&e.keywords.length>0},re.prototype.createSlides=function(){for(var e=this,t=0;t<e.children.length;t++){var i=t===e.currentSlideIndex;e.children[t].getElement().appendTo(e.$slidesWrapper),i&&e.children[t].setCurrent(),(e.isEditor()||0===t||1===t||i)&&e.children[t].appendElements()}},re.prototype.hasScoreData=function(e){return"undefined"!==se(e)&&"function"==typeof e.getScore&&"function"==typeof e.getMaxScore},re.prototype.getScore=function(){var e=this;return o(e.slidesWithSolutions).reduce((function(t,i){return t+(e.hasScoreData(i)?i.getScore():0)}),0)},re.prototype.getMaxScore=function(){var e=this;return o(e.slidesWithSolutions).reduce((function(t,i){return t+(e.hasScoreData(i)?i.getMaxScore():0)}),0)},re.prototype.setProgressBarFeedback=function(e){var t=this;void 0!==e&&e?e.forEach((function(e){var i=t.progressbarParts[e.slide-1].find(".h5p-progressbar-part-has-task");if(i.hasClass("h5p-answered")){var n=e.score>=e.maxScore;i.addClass(n?"h5p-is-correct":"h5p-is-wrong"),t.navigationLine.updateSlideTitle(e.slide-1)}})):this.progressbarParts.forEach((function(e){e.find(".h5p-progressbar-part-has-task").removeClass("h5p-is-correct").removeClass("h5p-is-wrong")}))},re.prototype.toggleKeywords=function(){this[this.$keywordsWrapper.hasClass("h5p-open")?"hideKeywords":"showKeywords"]()},re.prototype.hideKeywords=function(){this.$keywordsWrapper.hasClass("h5p-open")&&(void 0!==this.$keywordsButton&&(this.$keywordsButton.attr("title",this.l10n.showKeywords),this.$keywordsButton.attr("aria-label",this.l10n.showKeywords),this.$keywordsButton.attr("aria-expanded","false"),this.$keywordsButton.focus()),this.$keywordsWrapper.removeClass("h5p-open"))},re.prototype.showKeywords=function(){this.$keywordsWrapper.hasClass("h5p-open")||(void 0!==this.$keywordsButton&&(this.$keywordsButton.attr("title",this.l10n.hideKeywords),this.$keywordsButton.attr("aria-label",this.l10n.hideKeywords),this.$keywordsButton.attr("aria-expanded","true")),this.$keywordsWrapper.addClass("h5p-open"),this.presentation.keywordListAlwaysShow||this.$keywordsWrapper.find('li[tabindex="0"]').focus())},re.prototype.setKeywordsOpacity=function(e){var t=ie(this.$keywordsWrapper.css("background-color").split(/\(|\)|,/g),3),i=t[0],n=t[1],s=t[2];this.$keywordsWrapper.css("background-color","rgba(".concat(i,", ").concat(n,", ").concat(s,", ").concat(e/100,")"))},re.prototype.fitCT=function(){void 0===this.editor&&this.$current.find(".h5p-ct").each((function(){for(var e=100,t=H5P.jQuery(this),i=t.parent().height();t.outerHeight()>i&&(e--,t.css({fontSize:e+"%",lineHeight:e+65+"%"}),!(e<0)););}))},re.prototype.setRotation=function(e,t){var i=this;e.forEach((function(e,n){if(void 0!==e.angle&&!e.displayAsButton){var s=t[n];void 0===i.editor&&s.css({overflow:"hidden"});var r=s.find(".h5p-element-outer");r.get(0)&&""===r.get(0).style.transform&&(r.css({transform:"rotate(".concat(e.angle,"deg)")}),o=r,a=s,setTimeout((function(){var e=v(a),t=v(o);a.css({width:"".concat(t.width*parseFloat(a[0].style.width)/a[0].offsetWidth,"%"),height:"".concat(t.height*parseFloat(a[0].style.height)/a[0].offsetHeight,"%")});var i={width:e.width/t.width,height:e.height/t.height};o.css({transform:"".concat(o[0].style.transform," scale(").concat(i.width,", ").concat(i.height,")")});var n=o.find(".h5p-element-inner");n.css({transform:"".concat(n[0].style.transform," scale(").concat(1/i.width,", ").concat(1/i.height,")"),transformOrigin:"0 0",width:"".concat(100*i.width,"%"),height:"".concat(100*i.height,"%")})}),100))}var o,a}))},re.prototype.resize=function(){var e=this.$container.hasClass("h5p-fullscreen")||this.$container.hasClass("h5p-semi-fullscreen");if(!this.ignoreResize){this.$wrapper.css("width","auto");var t=this.$container.width(),i={};if(e){var n=this.$container.height();t/n>this.ratio&&(t=n*this.ratio,i.width=t+"px")}var s=t/this.width;i.height=t/this.ratio+"px",i.fontSize=this.fontSize*s+"px",void 0!==this.editor&&this.editor.setContainerEm(this.fontSize*s*.75),this.$wrapper.css(i),this.swipeThreshold=100*s;var r=this.elementInstances[this.$current.index()];if(void 0!==r)for(var o=this.slides[this.$current.index()].elements,a=0;a<r.length;a++){var l=r[a];void 0!==l.preventResize&&!1!==l.preventResize||void 0===l.$||o[a].displayAsButton||H5P.trigger(l,"resize")}this.fitCT(),o&&this.setRotation(o,this.slides[this.$current.index()].elementContainers)}},re.prototype.toggleFullScreen=function(){H5P.isFullscreen||this.$container.hasClass("h5p-fullscreen")||this.$container.hasClass("h5p-semi-fullscreen")?void 0!==H5P.exitFullScreen&&void 0!==H5P.fullScreenBrowserPrefix?H5P.exitFullScreen():void 0===H5P.fullScreenBrowserPrefix?H5P.jQuery(".h5p-disable-fullscreen").click():""===H5P.fullScreenBrowserPrefix?window.top.document.exitFullScreen():"ms"===H5P.fullScreenBrowserPrefix?window.top.document.msExitFullscreen():window.top.document[H5P.fullScreenBrowserPrefix+"CancelFullScreen"]():(this.$footer.addClass("footer-full-screen"),this.$fullScreenButton.attr("title",this.l10n.exitFullscreen),H5P.fullScreen(this.$container,this),void 0===H5P.fullScreenBrowserPrefix&&H5P.jQuery(".h5p-disable-fullscreen").hide())},re.prototype.focus=function(){this.$wrapper.focus()},re.prototype.keywordClick=function(e){this.shouldHideKeywordsAfterSelect()&&this.hideKeywords(),this.jumpToSlide(e,!0)},re.prototype.shouldHideKeywordsAfterSelect=function(){return this.presentation.keywordListEnabled&&!this.presentation.keywordListAlwaysShow&&this.presentation.keywordListAutoHide&&void 0===this.editor},re.prototype.setElementsOverride=function(e){this.elementsOverride={params:{}},e&&(this.elementsOverride.params.behaviour={},e.showSolutionButton&&(this.elementsOverride.params.behaviour.enableSolutionsButton="on"===e.showSolutionButton),e.retryButton&&(this.elementsOverride.params.behaviour.enableRetry="on"===e.retryButton))},re.prototype.attachElements=function(e,t){if(void 0===this.elementsAttached[t]){var i=this.slides[t],n=this.elementInstances[t];if(void 0!==i.elements)for(var s=0;s<i.elements.length;s++)this.attachElement(i.elements[s],n[s],e,t);this.trigger("domChanged",{$target:e,library:"CoursePresentation",key:"newSlide"},{bubbles:!0,external:!0}),this.elementsAttached[t]=!0}},re.prototype.registerElementContainer=function(e,t){this.slides[e].elementContainers=this.slides[e].elementContainers||[];var i=this.slides[e].elementContainers.length;this.slides[e].elements.length===i?this.slides[e].elementContainers[i-1]=t:this.slides[e].elementContainers.push(t)},re.prototype.attachElement=function(e,t,i,n){var s=this,r=void 0!==e.displayAsButton&&e.displayAsButton,o=void 0!==e.buttonSize?"h5p-element-button-"+e.buttonSize:"",a=e.buttonImage&&e.buttonImage.path?"h5p-element-button-custom":"",l="h5p-element"+(r?" h5p-element-button-wrapper":"")+(o.length?" "+o:"")+(a.length?" "+a:""),c=H5P.jQuery("<div>",{class:l}).css({left:e.x+"%",top:e.y+"%",width:e.width+"%",height:e.height+"%"}).appendTo(i),d=void 0===e.backgroundOpacity||0===e.backgroundOpacity;if(c.toggleClass("h5p-transparent",d),r){this.createInteractionButton(e,t).appendTo(c)}else{var h=e.action&&e.action.library?this.getLibraryTypePmz(e.action.library):"other",p=H5P.jQuery("<div>",{class:"h5p-element-outer ".concat(h,"-outer-element")}).css({background:"rgba(255,255,255,"+(void 0===e.backgroundOpacity?0:e.backgroundOpacity/100)+")"}).appendTo(c),u=H5P.jQuery("<div>",{class:"h5p-element-inner"}).appendTo(p);if(t.on("set-size",(function(e){for(var t in e.data)c.get(0).style[t]=e.data[t]})),t.attach(u),void 0!==e.action&&"H5P.InteractiveVideo"===e.action.library.substr(0,20)){var m=function(){t.$container.addClass("h5p-fullscreen"),t.controls.$fullscreen&&t.controls.$fullscreen.remove(),t.hasFullScreen=!0,t.controls.$play.hasClass("h5p-pause")?t.$controls.addClass("h5p-autohide"):t.enableAutoHide()};void 0!==t.controls?m():t.on("controls",m)}this.setOverflowTabIndex()}if(void 0!==this.editor?this.editor.processElement(e,c,n,t):(e.solution&&this.addElementSolutionButton(e,t,c),this.hasAnswerElements=this.hasAnswerElements||void 0!==t.exportAnswers),e.action&&e.action.library&&"H5P.Audio"===e.action.library.split(" ")[0]){var f=u.get(0).querySelector("button");if(f&&e.customImagePlay&&e.customImagePlay.path){f.classList.add("h5p-course-presentation-custom-audio-button");var v=document.createElement("img");v.classList.add("h5p-course-presentation-custom-audio-button-image"),v.classList.add("h5p-course-presentation-selection-not-allowed"),v.setAttribute("draggable",!1),H5P.setSource(v,e.customImagePlay,this.contentId),f.appendChild(v),t.audio.addEventListener("ended",(function(){H5P.setSource(v,e.customImagePlay,s.contentId)})),e.customImagePlayPaused&&e.customImagePlayPaused.path&&t.audio.addEventListener("pause",(function(){H5P.setSource(v,e.customImagePlayPaused,s.contentId)})),e.customImagePause&&e.customImagePause.path&&t.audio.addEventListener("play",(function(){H5P.setSource(v,e.customImagePause,s.contentId)}))}}return this.registerElementContainer(n,c),this.setRotation([e],[c]),c},re.prototype.disableTabIndexes=function(){var e=this.$container.find(".h5p-popup-container");this.$tabbables=this.$container.find("a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]").filter((function(){var t=n(this),i=n.contains(e.get(0),t.get(0));if(t.data("tabindex"))return!0;if(!i){var s=t.attr("tabindex");return t.data("tabindex",s),t.attr("tabindex","-1"),!0}return!1}))},re.prototype.restoreTabIndexes=function(){this.$tabbables&&this.$tabbables.each((function(){var e=n(this),t=e.data("tabindex");e.hasClass("ui-slider-handle")?(e.attr("tabindex",0),e.removeData("tabindex")):void 0!==t?(e.attr("tabindex",t),e.removeData("tabindex")):e.removeAttr("tabindex")}))},re.prototype.createInteractionButton=function(e,t){var i,s=this,r=e.action.params&&e.action.params.cpAutoplay,o=e.action.metadata?e.action.metadata.title:"";""===o&&(o=e.action.params&&e.action.params.contentName||e.action.library.split(" ")[0].split(".")[1]);var a,l=this.getLibraryTypePmz(e.action.library);if(null!=e&&null!==(i=e.buttonImage)&&void 0!==i&&i.path){a=n("<div>",{role:"button",tabindex:0,"aria-label":o,"aria-popup":!0,"aria-expanded":!1,class:"h5p-element-button h5p-element-button-custom"});var c=document.createElement("img");c.classList.add("h5p-element-button-custom-image"),c.classList.add("h5p-course-presentation-selection-not-allowed"),c.setAttribute("draggable",!1),H5P.setSource(c,e.buttonImage,this.contentId),a.append(c)}else a=n("<div>",{role:"button",tabindex:0,"aria-label":o,"aria-popup":!0,"aria-expanded":!1,class:"h5p-element-button h5p-element-button-".concat(e.buttonSize," ").concat(l,"-button")});var d=n('<div class="h5p-button-element"></div>');t.attach(d);var h="h5p-advancedtext"===l?{x:e.x,y:e.y}:null;return f(a,(function(){var e;a.attr("aria-expanded","true"),s.showInteractionPopup(t,a,d,l,r,(e=a,function(){return e.attr("aria-expanded","false")}),h),s.disableTabIndexes()})),void 0!==e.action&&"H5P.InteractiveVideo"===e.action.library.substr(0,20)&&t.on("controls",(function(){t.controls.$fullscreen&&t.controls.$fullscreen.remove()})),a},re.prototype.showInteractionPopup=function(e,t,i,n,s,r){var o=this,l=arguments.length>6&&void 0!==arguments[6]?arguments[6]:null,c=function(){e.trigger("resize")};if(!this.isEditor()){this.on("exitFullScreen",c),this.showPopup(i,t,l,(function(){o.pauseMedia(e),i.detach(),o.off("exitFullScreen",c),r()}),n),H5P.trigger(e,"resize"),"h5p-image"===n&&this.resizePopupImage(i);i.closest(".h5p-popup-container");setTimeout((function(){var e=i.find(":input").add(i.find("[tabindex]"));e.length?e[0].focus():(i.attr("tabindex",0),i.focus())}),200),a(e.setActivityStarted)&&a(e.getScore)&&e.setActivityStarted(),s&&a(e.play)&&e.play()}},re.prototype.getLibraryTypePmz=function(e){return(t=e.split(" ")[0],t.replace(/[\W]/g,"-")).toLowerCase();var t},re.prototype.resizePopupImage=function(e){var t=Number(e.css("fontSize").replace("px","")),i=e.find("img"),n=function(i,n){if(!(n/t<18.5)){var s=i/n;n=18.5*t,e.css({width:n*s,height:n})}};i.height()?n(i.width(),i.height()):i.one("load",(function(){n(this.width,this.height)}))},re.prototype.addElementSolutionButton=function(e,t,i){var s=this;t.showCPComments=function(){if(0===i.children(".h5p-element-solution").length&&(o=e.solution,g.html(o).text().trim()).length>0){var t=n("<div/>",{role:"button",tabindex:0,title:s.l10n.solutionsButtonTitle,"aria-popup":!0,"aria-expanded":!1,class:"h5p-element-solution"}).append('<span class="joubel-icon-comment-normal"><span class="h5p-icon-shadow"></span><span class="h5p-icon-speech-bubble"></span><span class="h5p-icon-question"></span></span>').appendTo(i),r={x:e.x,y:e.y};e.displayAsButton||(r.x+=e.width-4,r.y+=e.height-12),f(t,(function(){return s.showPopup(e.solution,t,r)}))}var o},void 0!==e.alwaysDisplayComments&&e.alwaysDisplayComments&&t.showCPComments()},re.prototype.showPopup=function(e,t){var i,s=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,o=arguments.length>3?arguments[3]:void 0,a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"h5p-popup-comment-field",l=this,c=function(e){i?i=!1:(void 0!==o&&setTimeout((function(){o(),l.restoreTabIndexes()}),100),e.preventDefault(),d.addClass("h5p-animate"),d.find(".h5p-popup-container").addClass("h5p-animate"),setTimeout((function(){d.remove()}),100),t.focus())},d=n('<div class="h5p-popup-overlay '+a+'"><div class="h5p-popup-container" role="dialog"><div class="h5p-cp-dialog-titlebar"><div class="h5p-dialog-title"></div><div role="button" tabindex="0" class="h5p-close-popup" title="'+this.l10n.close+'"></div></div><div class="h5p-popup-wrapper" role="document"></div></div></div>'),h=d.find(".h5p-popup-wrapper");e instanceof H5P.jQuery?h.append(e):h.html(e);var p=d.find(".h5p-popup-container"),m=function(e,t,i){if(i){t.css({visibility:"hidden"}),e.prependTo(s.$wrapper);var n=t.height(),r=t.width(),o=e.height(),a=r*(100/e.width()),l=n*(100/o);if(a>50&&l>50)e.detach();else{a>l&&l<45&&(a=Math.sqrt(a*l),t.css({width:a+"%"}));var c=100-a-7.5,d=i.x;i.x>c?d=c:i.x<7.5&&(d=7.5);var h=100-(l=t.height()*(100/o))-10,p=i.y;i.y>h?p=h:i.y<10&&(p=10),e.detach(),t.css({left:d+"%",top:p+"%"})}}};return m(d,p,r),d.addClass("h5p-animate"),p.css({visibility:""}).addClass("h5p-animate"),d.prependTo(this.$wrapper).focus().removeClass("h5p-animate").click(c).find(".h5p-popup-container").removeClass("h5p-animate").click((function(){i=!0})).keydown((function(e){e.which===u&&c(e)})).end(),f(d.find(".h5p-close-popup"),(function(e){return c(e)})),d},re.prototype.checkForSolutions=function(e){return void 0!==e.showSolutions||void 0!==e.showCPComments},re.prototype.initKeyEvents=function(){if(void 0===this.keydown&&!this.activeSurface){var e=this,t=!1;this.keydown=function(i){t||((37!==i.keyCode&&33!==i.keyCode||!e.previousSlide())&&(39!==i.keyCode&&34!==i.keyCode||!e.nextSlide())||(i.preventDefault(),t=!0),t&&setTimeout((function(){t=!1}),300))},H5P.jQuery("body").keydown(this.keydown)}},re.prototype.initTouchEvents=function(){var e,t,i,n,s,r,o=this,a=!1,l=!1,c=function(e){return{"-webkit-transform":e,"-moz-transform":e,"-ms-transform":e,transform:e}},d=c("");this.$slidesWrapper.bind("touchstart",(function(c){l=!1,i=e=c.originalEvent.touches[0].pageX,t=c.originalEvent.touches[0].pageY;var d=o.$slidesWrapper.width();n=0===o.currentSlideIndex?0:-d,s=o.currentSlideIndex+1>=o.slides.length?0:d,r=null,a=!0})).bind("touchmove",(function(d){var h=d.originalEvent.touches;a&&(o.$current.prev().addClass("h5p-touch-move"),o.$current.next().addClass("h5p-touch-move"),a=!1),i=h[0].pageX;var p=e-i;null===r&&(r=Math.abs(t-d.originalEvent.touches[0].pageY)>Math.abs(p)),1!==h.length||r||(d.preventDefault(),l||(p<0?o.$current.prev().css(c("translateX("+(n-p)+"px")):o.$current.next().css(c("translateX("+(s-p)+"px)")),o.$current.css(c("translateX("+-p+"px)"))))})).bind("touchend",(function(){if(!r){var t=e-i;if(t>o.swipeThreshold&&o.nextSlide()||t<-o.swipeThreshold&&o.previousSlide())return}o.$slidesWrapper.children().css(d).removeClass("h5p-touch-move")}))},re.prototype.updateTouchPopup=function(e,t,i,n){if(arguments.length<=0)void 0!==this.touchPopup&&this.touchPopup.remove();else{var s="",r=.15;if(void 0!==this.$keywords&&void 0!==this.$keywords.children(":eq("+t+")").find("span").html())s+=this.$keywords.children(":eq("+t+")").find("span").html();else{var o=t+1;s+=this.l10n.slide+" "+o}void 0===this.editor&&t>=this.slides.length-1&&(s=this.l10n.showSolutions),void 0===this.touchPopup?this.touchPopup=H5P.jQuery("<div/>",{class:"h5p-touch-popup"}).insertAfter(e):this.touchPopup.insertAfter(e),n-e.parent().height()*r<0?n=0:n-=e.parent().height()*r,this.touchPopup.css({"max-width":e.width()-i,left:i,top:n}),this.touchPopup.html(s)}},re.prototype.previousSlide=function(e){var t=this.$current.prev();return!!t.length&&this.jumpToSlide(t.index(),e,!1)},re.prototype.nextSlide=function(e){var t=this.$current.next();return!!t.length&&this.jumpToSlide(t.index(),e,!1)},re.prototype.isCurrentSlide=function(e){return this.currentSlideIndex===e},re.prototype.getCurrentSlideIndex=function(){return this.currentSlideIndex},re.prototype.attachAllElements=function(){for(var e=this.$slidesWrapper.children(),t=0;t<this.slides.length;t++)this.attachElements(e.eq(t),t);void 0!==this.summarySlideObject&&this.summarySlideObject.updateSummarySlide(this.slides.length-1,!0)},re.prototype.jumpToSlide=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=this;if(void 0===this.editor&&this.contentId){var s=this.createXAPIEventTemplate("progressed");s.data.statement.object.definition.extensions["http://id.tincanapi.com/extension/ending-point"]=e+1,this.trigger(s)}if(!this.$current.hasClass("h5p-animate")){var r=this.$current.addClass("h5p-animate"),o=n.$slidesWrapper.children(),a=o.filter(":lt("+e+")");this.$current=o.eq(e).addClass("h5p-animate");var l=this.currentSlideIndex;this.currentSlideIndex=e,this.attachElements(this.$current,e);var c=this.$current.next();c.length&&this.attachElements(c,e+1),this.setOverflowTabIndex();var d=this.elementInstances[l];if(void 0!==d)for(var h=0;h<d.length;h++)this.slides[l].elements[h].displayAsButton||n.pauseMedia(d[h]);return setTimeout((function(){r.removeClass("h5p-current"),o.css({"-webkit-transform":"","-moz-transform":"","-ms-transform":"",transform:""}).removeClass("h5p-touch-move").removeClass("h5p-previous"),a.addClass("h5p-previous"),n.$current.addClass("h5p-current"),n.trigger("changedSlide",n.$current.index())}),1),setTimeout((function(){if(n.$slidesWrapper.children().removeClass("h5p-animate"),void 0===n.editor){var e=n.elementInstances[n.currentSlideIndex],t=n.slides[n.currentSlideIndex].elements;if(void 0!==e)for(var i=0;i<e.length;i++)t[i]&&t[i].action&&t[i].action.params&&t[i].action.params.cpAutoplay&&!t[i].displayAsButton&&"function"==typeof e[i].play&&e[i].play(),t[i].displayAsButton||"function"!=typeof e[i].setActivityStarted||"function"!=typeof e[i].getScore||e[i].setActivityStarted()}}),250),void 0!==this.$keywords&&(this.keywordMenu.setCurrentSlideIndex(e),this.$currentKeyword=this.$keywords.find(".h5p-current"),t||this.keywordMenu.scrollToKeywords(e)),n.presentation.keywordListEnabled&&n.presentation.keywordListAlwaysShow&&n.showKeywords(),n.navigationLine&&(n.navigationLine.updateProgressBar(e,l,this.isSolutionMode),n.navigationLine.updateFooter(e),this.setSlideNumberAnnouncer(e,i)),n.summarySlideObject&&n.summarySlideObject.updateSummarySlide(e,!0),void 0!==this.editor&&void 0!==this.editor.dnb&&(this.editor.dnb.setContainer(this.$current),this.editor.dnb.blurAll()),this.trigger("resize"),this.fitCT(),!0}},re.prototype.setOverflowTabIndex=function(){void 0!==this.$current&&this.$current.find(".h5p-element-inner").each((function(){var e,t=n(this);this.classList.contains("h5p-table")&&(e=t.find(".h5p-table").outerHeight());var i=t.closest(".h5p-element-outer").innerHeight();void 0!==e&&null!==i&&e>i&&t.attr("tabindex",0)}))},re.prototype.setSlideNumberAnnouncer=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i="";if(!this.navigationLine)return i;var n=this.slides[e],s=n.keywords&&n.keywords.length>0;s&&!this.navigationLine.isSummarySlide(e)&&(i+=this.l10n.slide+" "+(e+1)+": "),i+=this.navigationLine.createSlideTitle(e),this.$slideAnnouncer.html(i),t&&this.$slideTop.focus()},re.prototype.resetTask=function(){this.summarySlideObject.toggleSolutionMode(!1);for(var e=0;e<this.slidesWithSolutions.length;e++)if(void 0!==this.slidesWithSolutions[e])for(var t=0;t<this.slidesWithSolutions[e].length;t++){var i=this.slidesWithSolutions[e][t];i.resetTask&&i.resetTask()}this.navigationLine.updateProgressBar(0),this.jumpToSlide(0,!1),this.$container.find(".h5p-popup-overlay").remove()},re.prototype.showSolutions=function(){for(var e=!1,t=[],i=!1,n=0;n<this.slidesWithSolutions.length;n++)if(void 0!==this.slidesWithSolutions[n]){this.elementsAttached[n]||this.attachElements(this.$slidesWrapper.children(":eq("+n+")"),n),e||(this.jumpToSlide(n,!1),e=!0);for(var s=0,r=0,o=[],a=0;a<this.slidesWithSolutions[n].length;a++){var l=this.slidesWithSolutions[n][a];void 0!==l.addSolutionButton&&l.addSolutionButton(),l.showSolutions&&l.showSolutions(),l.showCPComments&&l.showCPComments(),void 0!==l.getMaxScore&&(r+=l.getMaxScore(),s+=l.getScore(),i=!0,o.push(l.coursePresentationIndexOnSlide))}t.push({indexes:o,slide:n+1,score:s,maxScore:r})}if(i)return t},re.prototype.getSlideScores=function(e){for(var t=!0===e,i=[],n=!1,s=0;s<this.slidesWithSolutions.length;s++)if(void 0!==this.slidesWithSolutions[s]){this.elementsAttached[s]||this.attachElements(this.$slidesWrapper.children(":eq("+s+")"),s),t||(this.jumpToSlide(s,!1),t=!0);for(var r=0,o=0,a=[],l=0;l<this.slidesWithSolutions[s].length;l++){var c=this.slidesWithSolutions[s][l];void 0!==c.getMaxScore&&(o+=c.getMaxScore(),r+=this.scores[c.subContentId]||0,n=!0,a.push(c.coursePresentationIndexOnSlide))}i.push({indexes:a,slide:s+1,score:r,maxScore:o})}if(n)return i},re.prototype.getCopyrights=function(){var e,t=new H5P.ContentCopyrights;if(this.presentation&&this.presentation.globalBackgroundSelector&&this.presentation.globalBackgroundSelector.imageGlobalBackground){var i=this.presentation.globalBackgroundSelector.imageGlobalBackground,n=new H5P.MediaCopyright(i.copyright);n.setThumbnail(new H5P.Thumbnail(H5P.getPath(i.path,this.contentId),i.width,i.height)),t.addMedia(n)}for(var s=0;s<this.slides.length;s++){var r=new H5P.ContentCopyrights;if(r.setLabel(this.l10n.slide+" "+(s+1)),this.slides[s]&&this.slides[s].slideBackgroundSelector&&this.slides[s].slideBackgroundSelector.imageSlideBackground){var o=this.slides[s].slideBackgroundSelector.imageSlideBackground,a=new H5P.MediaCopyright(o.copyright);a.setThumbnail(new H5P.Thumbnail(H5P.getPath(o.path,this.contentId),o.width,o.height)),r.addMedia(a)}if(void 0!==this.elementInstances[s])for(var l=0;l<this.elementInstances[s].length;l++){var c=this.elementInstances[s][l];if(this.slides[s].elements[l].action){var d=this.slides[s].elements[l].action.params,h=this.slides[s].elements[l].action.metadata;e=void 0,void 0!==c.getCopyrights&&(e=c.getCopyrights()),void 0===e&&(e=new H5P.ContentCopyrights,H5P.findCopyrights(e,d,this.contentId,{metadata:h,machineName:c.libraryInfo.machineName}));var p=l+1;void 0!==d.contentName?p+=": "+d.contentName:void 0!==c.getTitle?p+=": "+c.getTitle():d.l10n&&d.l10n.name&&(p+=": "+d.l10n.name),e.setLabel(p),r.addContent(e)}}t.addContent(r)}return t},re.prototype.pauseMedia=function(e){try{void 0!==e.pause&&(e.pause instanceof Function||"function"==typeof e.pause)?e.pause():void 0!==e.video&&void 0!==e.video.pause&&(e.video.pause instanceof Function||"function"==typeof e.video.pause)?e.video.pause():void 0!==e.stop&&(e.stop instanceof Function||"function"==typeof e.stop)&&e.stop()}catch(e){H5P.error(e)}},re.prototype.getXAPIData=function(){var e=this.createXAPIEventTemplate("answered"),t=e.getVerifiedStatementValue(["object","definition"]);H5P.jQuery.extend(t,{interactionType:"compound",type:"http://adlnet.gov/expapi/activities/cmi.interaction"});var i=this.getScore(),n=this.getMaxScore();e.setScoredResult(i,n,this,!0,i===n);var s=o(this.slidesWithSolutions).map((function(e){if(e&&e.getXAPIData)return e.getXAPIData()})).filter((function(e){return!!e}));return{statement:e.data.statement,children:s}};const oe=re;H5P=H5P||{},H5P.CoursePresentationKID=oe})()})();;
