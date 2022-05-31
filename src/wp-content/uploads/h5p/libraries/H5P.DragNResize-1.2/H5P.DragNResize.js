/*global H5P*/
H5P.DragNResize = (function ($, EventDispatcher) {

  /**
   * Constructor!
   *
   * @class H5P.DragNResize
   * @param {H5P.jQuery} $container
   */
  function C($container) {
    var self = this;
    this.$container = $container;
    self.disabledModifiers = false;

    this.minSize = H5P.DragNResize.MIN_SIZE;

    EventDispatcher.call(this);

    // Override settings for snapping to grid, and locking aspect ratio.
    H5P.$body.keydown(function (event) {
      if (self.disabledModifiers) {
        return;
      }

      if (event.keyCode === 17) {
        // Ctrl
        self.revertSnap = true;
      }
      else if (event.keyCode === 16) {
        // Shift
        self.revertLock = true;
      }
    }).keyup(function (event) {
      if (self.disabledModifiers) {
        return;
      }

      if (event.keyCode === 17) {
        // Ctrl
        self.revertSnap = false;
      }
      else if (event.keyCode === 16) {
        // Shift
        self.revertLock = false;
      }
    });
  }

  // Inheritance
  C.prototype = Object.create(EventDispatcher.prototype);
  C.prototype.constructor = C;

  /**
   * Gives the given element a resize handle.
   *
   * @param {H5P.jQuery} $element
   * @param {Object} [options]
   * @param {boolean} [options.lock]
   * @param {boolean} [options.cornerLock]
   * @param {string} [options.directionLock]
   * @param {number} [options.minSize]
   * @param {boolean} [options.canRotate=false] If true, element can rotate.
   */
  C.prototype.add = function ($element, options) {
    var that = this;

    options.disableRotate = (typeof options.disableRotate === 'undefined') ? true : options.disableRotate;

    // Array with position of handles
    var cornerPositions = ['nw', 'ne', 'sw', 'se'];
    var horizontalEdgePositions = ['w', 'e'];
    var verticalEdgePositions = ['n', 's'];

    var addResizeHandle = function (position, corner) {
      $('<div>', {
        'class': 'h5p-dragnresize-handle ' + position
      }).mousedown(function (event) {
        that.disableRotate = options.disableRotate;
        that.lock = (options && (options.lock || corner && options.cornerLock));
        if (options.cornerLock) {
          that.isImage = true;
        }
        that.$element = $element;
        that.press(event.clientX, event.clientY, position, options.minSize);
      }).data('position', position)
        .appendTo($element);
    };

    if (!options.directionLock) {
      cornerPositions.forEach(function (pos) {
        addResizeHandle(pos, true);
      });
    }

    // Add edge handles
    if (!options || !options.lock) {
      if (options.directionLock != "vertical") {
        horizontalEdgePositions.forEach(function (pos) {
          addResizeHandle(pos);
        });
      }
      if (options.directionLock != "horizontal") {
        verticalEdgePositions.forEach(function (pos) {
          addResizeHandle(pos);
        });
      }
    }

    if (options.minSize) {
      this.minSize = options.minSize;
    }
    else {
      this.minSize = H5P.DragNResize.MIN_SIZE;
    }
  };

  /**
   * Get paddings for the element
   */
  C.prototype.getElementPaddings = function () {
    return {
      horizontal: Number(this.$element.css('padding-left').replace("px", "")) + Number(this.$element.css('padding-right').replace("px", "")),
      vertical: Number(this.$element.css('padding-top').replace("px", "")) + Number(this.$element.css('padding-bottom').replace("px", ""))
    };
  };

  /**
   * Get borders for the element
   * @returns {{horizontal: number, vertical: number}}
   */
  C.prototype.getElementBorders = function () {
    return {
      horizontal: Number(this.$element.css('border-left-width').replace('px', '')) + Number(this.$element.css('border-right-width').replace('px', '')),
      vertical: Number(this.$element.css('border-top-width').replace('px', '')) + Number(this.$element.css('border-bottom-width').replace('px', ''))
    };
  };

  C.prototype.setContainerEm = function (containerEm) {
    this.containerEm = containerEm;
  };

  /**
   * Start resizing
   *
   * @param {number} x
   * @param {number} y
   * @param {String} [direction] Direction of resize
   * @param {number} minSize
   */
  C.prototype.press = function (x, y, direction, minSize) {
    this.active = true;
    var eventData = {
      instance: this,
      direction: direction
    };

    this.minSize = (minSize ? minSize : H5P.DragNResize.MIN_SIZE);

    this.toggleToMode = (this.getMode() === 'resize') ? 'rotate' : 'resize';

    H5P.$window
      .bind('mouseup', eventData, C.release)
      .mousemove(eventData, C.move);

    H5P.$body
      .css({
        '-moz-user-select': 'none',
        '-webkit-user-select': 'none',
        'user-select': 'none',
        '-ms-user-select': 'none'
      })
      .attr('unselectable', 'on')[0]
      .onselectstart = H5P.$body[0].ondragstart = function () {
        return false;
      };

    this.startX = x;
    this.startY = y;
    this.padding = this.getElementPaddings();
    this.borders = this.getElementBorders();
    this.startWidth = this.$element.outerWidth();
    this.startHeight = this.$element.outerHeight();
    this.ratio = (this.startWidth / this.startHeight);
    var position = this.$element.position();
    this.left = position.left;
    this.top = position.top;
    this.containerWidth = this.$container.width();
    this.containerHeight = this.$container.height();
    this.startCenter = {
      x: this.$element.offset().left + this.startWidth / 2,
      y: this.$element.offset().top + this.startHeight / 2
    }
    const elementRotation = this.getCSSTransformValues(this.$element.children().first()).rotation;
    const clickRotation = Math.atan((this.startCenter.y - y) / (this.startCenter.x - x));
    this.startRotation = clickRotation - elementRotation; // offset compansation previous rotation
    this.deltaStartX = this.startCenter.x - this.startX; // determine starting left or right

    // Set default values
    this.newLeft = this.left;
    this.newTop = this.top;
    this.newWidth = this.startWidth;
    this.newHeight = this.startHeight;

    this.trigger('startResizing', eventData);

    // Show transform panel
    this.trigger('showTransformPanel');
  };

  /**
   * Resize events
   *
   * @param {Event} event
   */
  C.move = function (event) {
    var direction = (event.data.direction ? event.data.direction : 'se');
    var that = event.data.instance;
    var moveW = (direction === 'nw' || direction === 'sw' || direction === 'w');
    var moveN = (direction === 'nw' || direction === 'ne' || direction === 'n');
    var moveDiagonally = (direction === 'nw' || direction === 'ne' || direction === 'sw' || direction === 'se');
    var movesHorizontal = (direction === 'w' || direction === 'e');
    var movesVertical = (direction === 'n' || direction === 's');
    var deltaX = that.startX - event.clientX;
    var deltaY = that.startY - event.clientY;

    that.toggleToMode = that.getMode();

    if (that.getMode() === 'resize') {
      // When element rotated, only allow resizing with fixed aspect ratio
      // const angle = that.getCSSTransformValues(that.$element.children().first()).angle;
      const $outer = that.$element.children().first();
      const transformValues = that.getCSSTransformValues($outer);
      if (transformValues.angle !== 0) {
        moveDiagonally = true;
        movesHorizontal = false;
        movesVertical = false;
      }

      that.minLeft = that.left + that.startWidth - that.minSize;
      that.minTop = that.top + that.startHeight - that.minSize;

      // Moving west
      if (moveW) {
        that.newLeft = that.left - deltaX;
        that.newWidth = that.startWidth + deltaX;

        // Check edge cases
        if (that.newLeft < 0) {
          that.newLeft = 0;
          that.newWidth = that.left + that.startWidth;
        }
        else if (that.newLeft > that.minLeft) {
          that.newLeft = that.minLeft;
          that.newWidth = that.left - that.minLeft + that.startWidth;
        }

        // Snap west side
        if (that.snap && !that.revertSnap) {
          that.newLeft = Math.round(that.newLeft / that.snap) * that.snap;

          // Make sure element does not snap east
          if (that.newLeft > that.minLeft) {
            that.newLeft = Math.floor(that.minLeft / that.snap) * that.snap;
          }

          that.newWidth = (that.left - that.newLeft) + that.startWidth;
        }
      }
      else if (!movesVertical) {
        that.newWidth = that.startWidth - deltaX;

        // Snap width
        if (that.snap && !that.revertSnap) {
          that.newWidth = Math.round(that.newWidth / that.snap) * that.snap;
        }

        if (that.left + that.newWidth > that.containerWidth) {
          that.newWidth = that.containerWidth - that.left;
        }
      }

      // Moving north
      if (moveN) {
        that.newTop = that.top - deltaY;
        that.newHeight = that.startHeight + deltaY;

        // Check edge cases
        if (that.newTop < 0) {
          that.newTop = 0;
          that.newHeight = that.top + that.startHeight;
        }
        else if (that.newTop > that.minTop) {
          that.newTop = that.minTop;
          that.newHeight = that.top - that.minTop + that.startHeight;
        }

        // Snap north
        if (that.snap && !that.revertSnap) {
          that.newTop = Math.round(that.newTop / that.snap) * that.snap;

          // Make sure element does not snap south
          if (that.newTop > that.minTop) {
            that.newTop = Math.floor(that.minTop / that.snap) * that.snap;
          }

          that.newHeight = (that.top - that.newTop) + that.startHeight;
        }
      }
      else if (!movesHorizontal) {
        that.newHeight = that.startHeight - deltaY;

        // Snap height
        if (that.snap && !that.revertSnap) {
          that.newHeight = Math.round(that.newHeight / that.snap) * that.snap;
        }

        if (that.top + that.newHeight > that.containerHeight) {
          that.newHeight = that.containerHeight - that.top;
        }
      }

      // Set min size
      if (that.newWidth <= that.minSize) {
        that.newWidth = that.minSize;
      }

      if (that.newHeight <= that.minSize) {
        that.newHeight = that.minSize;
      }

      // Apply ratio lock for elements except images, they have a their own specific for corner cases
      var lock = (that.revertLock ? !that.lock : that.lock);
      if (lock && (moveDiagonally || !that.isImage)) {
        that.lockDimensions(moveW, moveN, movesVertical, movesHorizontal);
      }

      // Apply ratio lock for all rotated elements
      if (transformValues.angle !== 0) {
        that.lockDimensions(
          moveW,
          moveN,
          movesVertical || ['n', 's'].indexOf(direction) !== -1,
          movesHorizontal || ['w', 'e'].indexOf(direction) !== -1
        );
      }

      // Reduce size by padding and borders
      that.finalWidth = that.newWidth;
      that.finalHeight = that.newHeight;

      if (that.$element.css('boxSizing') !== 'border-box') {
        that.finalWidth -= (that.padding.horizontal + that.borders.horizontal);
        that.finalHeight -= (that.padding.vertical + that.borders.vertical);
      }

      that.$element.css({
        width: (that.finalWidth / that.containerEm) + 'em',
        height: (that.finalHeight / that.containerEm) + 'em',
        left: ((that.newLeft / that.containerWidth) * 100) + '%',
        top: ((that.newTop / that.containerHeight) * 100) + '%'
      });

      that.trigger('moveResizing');
    }
    else {
      // Rotate using center of element and position for angle
      let deltaX = that.startCenter.x - event.clientX;
      let deltaY = that.startCenter.y - event.clientY;

      let rotation = Math.atan(deltaY / deltaX);

      // Stabilize movement when inside element bounds by using element size as minimum delta
      const deltaXMin = that.$element.width() / 2 * Math.abs(Math.cos(rotation));
      const deltaYMin = that.$element.height() / 2 * Math.abs(Math.sin(rotation));
      if (Math.abs(deltaX) < deltaXMin) {
        deltaX = Math.sign(deltaX) * deltaXMin;
      }
      if (Math.abs(deltaY) < deltaYMin) {
        deltaY = Math.sign(deltaY) * deltaYMin;
      }

      // Stabilize movement by virtually moving mouse pointer further away from center
      deltaX += deltaX * Math.abs(Math.cos(rotation));
      deltaY += deltaY * Math.abs(Math.sin(rotation));
      const currentRotation = Math.atan(deltaY / deltaX);

      let angle = Math.round((currentRotation - that.startRotation) * 180 / Math.PI);

      if ((deltaX < 0 && that.deltaStartX >= 0) || (deltaX >= 0 && that.deltaStartX < 0)) {
        angle += 180;
      }

      // Only use degrees of 0-359
      angle = angle % 360;
      if (angle < 0) {
        angle += 360;
      }

      that.$element.css('transform', `rotate(${angle}deg)`);

      that.trigger('moveRotating', {
        angle: angle
      });
    }
  };

  /**
   * Changes element values depending on moving direction of the element
   * @param isMovingWest
   * @param isMovingNorth
   * @param movesVertical
   * @param movesHorizontal
   */
  C.prototype.lockDimensions = function (isMovingWest, isMovingNorth, movesVertical, movesHorizontal) {
    var self = this;

    // Cap movement at top
    var lockTop = function (isMovingNorth) {
      if (!isMovingNorth) {
        return;
      }

      self.newTop = self.top - (self.newHeight - self.startHeight);

      // Edge case
      if (self.newTop <= 0) {
        self.newTop = 0;
      }
    };

    // Expand to longest edge
    if (movesVertical) {
      this.newWidth = this.newHeight * this.ratio;

      // Make sure locked ratio does not cause size to go below min size
      if (this.newWidth < this.minSize) {
        this.newWidth = this.minSize;
        this.newHeight = this.minSize / this.ratio;
      }
    }
    else if (movesHorizontal) {
      this.newHeight = this.newWidth / this.ratio;

      // Make sure locked ratio does not cause size to go below min size
      if (this.newHeight < this.minSize) {
        this.newHeight = this.minSize;
        this.newWidth = this.minSize * this.ratio;
      }
    }
    else if (this.newWidth / this.startWidth > this.newHeight / this.startHeight) {
      // Expand to width
      this.newHeight = this.newWidth / this.ratio;
    }
    else {
      // Expand to height
      this.newWidth = this.newHeight * this.ratio;
    }

    // Change top to match new height
    if (isMovingNorth) {
      lockTop(isMovingNorth);

      if (self.newTop <= 0) {
        self.newHeight = self.top + self.startHeight;
        self.newWidth = self.newHeight * self.ratio;
      }
    }
    else {
      // Too high
      if (this.top + this.newHeight > this.containerHeight) {
        this.newHeight = this.containerHeight - this.top;
        this.newWidth = this.newHeight * this.ratio;
      }
    }

    // Change left to match new width
    if (isMovingWest) {
      this.newLeft = this.left - (this.newWidth - this.startWidth);
      // Edge case
      if (this.newLeft <= 0) {
        this.newLeft = 0;
        this.newWidth = this.left + this.startWidth;
        this.newHeight = this.newWidth / this.ratio;
      }
    }
    else {
      // Too wide
      if (this.left + this.newWidth > this.containerWidth) {
        this.newWidth = this.containerWidth - this.left;
        this.newHeight = this.newWidth / this.ratio;
      }
    }

    // Need to re-lock top in case height changed
    lockTop(isMovingNorth);
  };

  /**
   * Stop resizing
   *
   * @param {Event} event
   */
  C.release = function (event) {
    var that = event.data.instance;
    that.active = false;

    const justToggled = that.toggleMode(that.toggleToMode);

    H5P.$window
      .unbind('mouseup', C.release)
      .unbind('mousemove', C.move);

    H5P.$body
      .css({
        '-moz-user-select': '',
        '-webkit-user-select': '',
        'user-select': '',
        '-ms-user-select': ''
      })
      .removeAttr('unselectable')[0]
      .onselectstart = H5P.$body[0].ondragstart = null;

    if (!justToggled && that.newWidth !== that.startWidth ||
        that.newHeight !== that.startHeight) {
      // Stopped resizing send width and height in Ems
      that.trigger('stoppedResizing', {
        left: that.newLeft,
        top: that.newTop,
        width: that.finalWidth / that.containerEm,
        height: that.finalHeight / that.containerEm,
        useBrowserSize: true,
        canRotate: !that.disableRotate
      });
    }

    if (!justToggled && that.getMode() === 'rotate') {
      const $outer = that.$element.children().first();
      let angle = that.getCSSTransformValues(that.$element).angle + that.getCSSTransformValues($outer).angle;

      // Only use degrees of 0-359
      angle = angle % 360;
      if (angle < 0) {
        angle += 360;
      }

      that.trigger('stoppedRotating', {
        angle: angle
      });
    }

    // Refocus element after resizing it. Apply timeout since focus is lost at the end of mouse event.
    setTimeout(function () {
      that.$element.focus();
    }, 0);

    // trigger to hide the transform panel unless it was activated
    // through the context menu
    that.trigger('hideTransformPanel');
  };

  /**
   * Toggle mode.
   * @param {string} toggleToMode Mode to toggle to.
   * @param {boolean} True, if toggled, else false
   */
  C.prototype.toggleMode = function(toggleToMode) {
    const mode = this.getMode();
    if (this.disableRotate || mode === toggleToMode) {
      return false;
    }

    if (toggleToMode === 'rotate') {
      this.$element.addClass('h5p-dnr-rotate');
    }
    else {
      this.$element.removeClass('h5p-dnr-rotate');
    }

    return true;
  }

  /**
   * Get current mode.
   * @return {string} 'resize' or 'rotate'.
   */
  C.prototype.getMode = function() {
    return this.$element.hasClass('h5p-dnr-rotate') ? 'rotate' : 'resize';
  }

  /**
   * Get maxtrix components of CSS transform property.
   * @param {H5P.jQuery} $element DOM element.
   * @return {object} Components: angle, rotation, scale, skew, translation.
   */
  C.prototype.getCSSTransformValues = function ($element) {
    const matrix = $element.css('transform')

    let matrixValues

    if (matrix && matrix.indexOf('matrix(') !== -1) {
      matrixValues = matrix.split('(')[1].split(')')[0].split(',');
    }
    else {
      matrixValues = [1, 0, 0, 1, 0, 0];
    }

    var a = matrixValues[0];
    var b = matrixValues[1];
    var c = matrixValues[2];
    var d = matrixValues[3];
    var e = matrixValues[4];
    var f = matrixValues[5];

    var delta = a * d - b * c;

    let result = {
      translation: {
        x: parseFloat(e),
        y: parseFloat(f)
      },
      rotation: 0,
      scale: {
        x: 0,
        y: 0
      },
      skew: {
        x: 0,
        y: 0
      }
    };

    // Apply the QR-like decomposition.
    if (a != 0 || b != 0) {
      const r = Math.sqrt(a * a + b * b);
      result.rotation = b > 0 ? Math.acos(a / r) : - Math.acos(a / r);
      result.scale = {
        x: r,
        y: delta / r
      };
      result.skew = {
        x: Math.atan((a * c + b * d) / (r * r)),
        y: 0
      };
    }
    else if (c != 0 || d != 0) {
      const s = Math.sqrt(c * c + d * d);
      result.rotation =
        Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
      result.scale = {
        x: delta / s,
        y: s
      };
      result.skew = {
        x: 0,
        y: Math.atan((a * c + b * d) / (s * s))
      };
    }

    result.angle = Math.round(result.rotation * (180 / Math.PI));

    // Only use degrees of 0-359
    result.angle = result.angle % 360;
    if (result.angle < 0) {
      result.angle += 360;
    }

    return result;
  }

  /**
   * Toggle modifiers when we are not interacting with drag objects.
   * @param {boolean} [enable]
   */
  C.prototype.toggleModifiers = function (enable) {
    this.disabledModifiers = enable === undefined ? !this.disabledModifiers : !enable;
  };

  C.MIN_SIZE = 24;

  return C;
})(H5P.jQuery, H5P.EventDispatcher);
