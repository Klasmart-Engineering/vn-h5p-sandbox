/*global H5P*/

/**
 * Create Drag N Bar Element. Connects a DragNBar element to a context menu
 */
H5P.DragNBarElement = (function ($, ContextMenu, EventDispatcher) {

  /**
   * Constructor DragNBarElement
   *
   * @class
   * @param {H5P.DragNBar} dragNBar Parent dragNBar toolbar
   * @param {object} [clipboardData]
   * @param {Object} [options] Button object that the element is created from
   * @param {Boolean} [options.disableContextMenu] Decides if element should have editor functionality
   * @param {Function} [options.createElement] Function for creating element from button
   * @param {Function} [options.disableCopy] Copy button disabled or enabled?
   * @param {boolean} [options.hasCoordinates] Decides if element will display coordinates
   * @param {H5P.jQuery} [options.element] Element
   */
  function DragNBarElement(dragNBar, clipboardData, options) {
    var self = this;
    EventDispatcher.call(this);

    this.dnb = dragNBar;
    this.options = options || {};
    if (!this.options.disableContextMenu) {
      this.contextMenu = new ContextMenu(this.dnb.$dialogContainer, this, this.options.hasCoordinates, this.options.disableResize, this.options.disableCopy, this.options.directionLock, this.options.disableRotate);
    }
    this.focused = false;

    if (this.options.createElement) {
      this.$element = this.options.createElement().appendTo(dragNBar.$container);
      this.focus();
    }
    else {
      this.$element = this.options.element;
    }

    // Initialize
    this.setSize();

    // Let dnb know element has been pressed
    if (this.$element) {
      if (this.dnb.isEditor) {
        this.$element.mousedown(function () {
          self.dnb.pressed = true;
        });
      }

      // Run custom focus function on element focus
      this.$element.focus(function () {
        self.focus();
      });
    }

    /**
     * Store element paramets in the local storage.
     */
    self.toClipboard = function (width, height) {
      if (clipboardData && localStorage) {
        clipboardData.width = width;
        clipboardData.height = height;
        H5P.setClipboard(clipboardData);
      }
    };
  }

  // Inheritance
  DragNBarElement.prototype = Object.create(EventDispatcher.prototype);
  DragNBarElement.prototype.constructor = DragNBarElement;

  /**
   * Add button to context menu.
   *
   * @param {string} name
   * @param {string} label
   */
  DragNBarElement.prototype.addButton = function (name, label) {
    this.contextMenu.addToMenu({name:name, label:label});
  };

  /**
   * Get element
   * @returns {H5P.jQuery}
   */
  DragNBarElement.prototype.getElement = function () {
    return this.$element;
  };

  /**
   * Set element
   * @param {H5P.jQuery} $element
   */
  DragNBarElement.prototype.setElement = function ($element) {
    var self = this;
    this.$element = $element;

    // Register custom focus function on new element focus
    this.$element.focus(function () {
      self.focus();
    });
  };

  /**
   * Show context menu
   */
  DragNBarElement.prototype.showContextMenu = function () {
    if (this.contextMenu) {
      this.contextMenu.attach();
    }
  };

  /**
   * Hide context menu
   */
  DragNBarElement.prototype.hideContextMenu = function () {
    if (this.contextMenu) {
      this.contextMenu.detach();
    }
  };

  /**
   * Update coordinates in context menu to current location
   *
   * @param {Number} left Left position of context menu
   * @param {Number} top Top position of context menu
   * @param {Number} x X coordinate of context menu
   * @param {Number} y Y coordinate of context menu
   */
  DragNBarElement.prototype.updateCoordinates = function (left, top, x, y) {
    if (this.contextMenu) {
      this.contextMenu.updateCoordinates(left, top, x, y);
      this.resizeContextMenu(x);
    }
  };

  /**
   * Update rotation in context menu to current rotation.
   *
   * @param {number} angle Angle.
   * @param {boolean} nofit If true, only update context menu, but don't fit.
   */
  DragNBarElement.prototype.updateRotation = function (angle, nofit) {
    if (typeof angle === 'number' && !nofit) {
      this.$element.css({
        'transform': ''
      });

      // Update element rotation
      const $outer = this.$element.children().first();

      /*
       * Only rotating instance outer, not the overlay element with sizing
       */
      let transformValues = this.dnb.getCSSTransformValues($outer);
      $outer.css('transform', `rotate(${angle}deg) scale(${transformValues.scale.x}, ${transformValues.scale.y})`);

      // Make $element fit its child that can be larger/smaller due to rotation
      this.dnb.fitToChild(this.$element, false);

      this.dnb.updateCoordinates();
      this.dnb.updateDimensions();
    }

    if (this.contextMenu) {
      this.contextMenu.updateRotation(angle);
    }
  };

  /**
   * Float context menu left if width exceeds parent container.
   *
   * @param {Number} [left] Left position of context menu.
   */
  DragNBarElement.prototype.resizeContextMenu = function (left) {
    if (this.options.disableContextMenu) {
      return;
    }

    // Need to take into account the left padding of the contextmenu's parent
    var paddingLeft = Number(this.contextMenu.$parent.css('padding-left').replace('px', ''));
    left = (left || this.$element.position().left) + paddingLeft;
    var containerWidth = this.dnb.$container.width();
    var $cm = this.contextMenu.$contextMenu;

    // Measure full outer width
    $cm.css({
      position: 'absolute',
      left: 0
    });
    var contextMenuWidth = $cm.outerWidth(true);

    // Reset to default
    $cm.css({
      position: '',
      left: left
    });

    var isTooWide = left + contextMenuWidth >= containerWidth;

    if (isTooWide) {
      var newLeft = left - contextMenuWidth;
      this.contextMenu.$contextMenu.css('left', newLeft + 'px');
      this.contextMenu.$contextMenu.addClass('left-aligned');
    }
    else {
      this.contextMenu.$contextMenu.removeClass('left-aligned');
    }
  };

  /**
   * Blur element and hide context menu.
   */
  DragNBarElement.prototype.blur = function () {
    if (this.$element) {
      this.$element.removeClass('focused');
      this.focused = false;

      if (!this.options.disableContextMenu) {
        // Hide transform panel
        this.contextMenu.trigger('contextMenuTransform', {showTransformPanel: false});
      }
    }
    this.hideContextMenu();
  };

  /**
   * Focus element
   */
  DragNBarElement.prototype.focus = function () {
    this.$element.addClass('focused');
    this.focused = true;
    if (this.contextMenu) {
      this.resizeContextMenu(this.$element.position().left);
    }
  };

  /**
   * Remove element and hide context menu
   */
  DragNBarElement.prototype.removeElement = function () {
    this.$element.detach();
    this.hideContextMenu();
  };

  /**
   * Set size. Used to circumvent numerical unprecision in browser.
   * @param {object} size Size.
   * @param {number} size.height Height.
   * @param {number} size.width Width.
   */
  DragNBarElement.prototype.setSize = function (size) {
    if (!this.size || !size) {
      // Prevent width/height = 0 if initializing when element not visible
      if ($(document).find(this.$element).length > 0) {
        size = this.dnb.getHullSize(this.$element);
      }
    }

    if (size) {
      this.size = size;
    }
  }

  /**
   * Get size. Used to circumvent numerical unprecision in browser.
   * @return {object} Size. Height and width.
   */
  DragNBarElement.prototype.getSize = function () {
    if (!this.size) {
      this.setSize();
    }

    return this.size;
  }

  return DragNBarElement;

})(H5P.jQuery, H5P.DragNBarContextMenu, H5P.EventDispatcher);
