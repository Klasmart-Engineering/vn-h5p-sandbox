(function (MemoryGame, Timer) {

  /**
   * Adapter between memory game and H5P.Timer
   *
   * @class H5P.MemoryGame.Timer
   * @extends H5P.Timer
   * @param {Element} element,
   * @param {number} previousTimeMs Previous time in MS.
   * @param {object} callbacks Callbacks.
   */
  MemoryGame.Timer = function (element, previousTimeMs, callbacks) {
    /** @alias H5P.MemoryGame.Timer# */
    var self = this;

    callbacks = callbacks || {};

    // Initialize event inheritance
    Timer.call(self, 1000);

    /** @private {string} */
    var naturalState = element.innerText;

    /**
     * Set up callback for time updates.
     * Formats time stamp for humans.
     *
     * @private
     */
    var update = function () {
      var time = self.getTime();

      var minutes = Timer.extractTimeElement(time, 'minutes');
      var seconds = Timer.extractTimeElement(time, 'seconds') % 60;

      // Update duration attribute
      element.setAttribute('datetime', 'PT' + minutes + 'M' + seconds + 'S');

      // Add leading zero
      if (seconds < 10) {
        seconds = '0' + seconds;
      }

      element.innerText = minutes + ':' + seconds;

      if (typeof callbacks.store === 'function') {
        callbacks.store();
      }
    };

    // Setup default behavior
    self.notify('every_tenth_second', update);
    self.on('reset', function () {
      element.innerText = naturalState;
      self.notify('every_tenth_second', update);
    });

    // Restore previous time
    if (previousTimeMs) {
      this.setClockTime(previousTimeMs);
      update();
    }
  };

  // Inheritance
  MemoryGame.Timer.prototype = Object.create(Timer.prototype);
  MemoryGame.Timer.prototype.constructor = MemoryGame.Timer;

})(H5P.MemoryGame, H5P.Timer);
