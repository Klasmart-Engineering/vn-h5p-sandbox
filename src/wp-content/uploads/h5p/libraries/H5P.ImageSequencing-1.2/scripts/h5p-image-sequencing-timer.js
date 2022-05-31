(function (ImageSequencing, Timer) {

  /**
   * ImageSequencing.Timer - Adapter between image sequencing and H5P.Timer
   *
   * @class H5P.ImageSequencing.Timer
   * @extends H5P.Timer
   * @param {H5P.jQuery} $element
   * @param {number} previousTimeMs Previous time in ms.
   */
  ImageSequencing.Timer = function ($element, previousTimeMs, callbacks) {
    /** @alias H5P.ImageSequencing.Timer# */
    const that = this;

    // Initialize event inheritance
    Timer.call(that, 1000);

    /** @private {string} */
    const naturalState = '0:00';

    callbacks = callbacks || {};

    /**
     * update - Set up callback for time updates.
     * Formats time stamp for humans.
     *
     * @private
     */
    const update = function () {
      const time = that.getTime();

      const minutes = Timer.extractTimeElement(time, 'minutes');
      let seconds = Timer.extractTimeElement(time, 'seconds') % 60;
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      $element.text(minutes + ':' + seconds);

      if (callbacks.store) {
        callbacks.store();
      }
    };

    // Setup default behavior
    that.notify('every_tenth_second', update);

    that.on('reset', function () {
      $element.text(naturalState);
      that.notify('every_tenth_second', update);
    });

    // Restore previous time
    if (previousTimeMs) {
      this.setClockTime(previousTimeMs);
      update();
    }
  };

  // Inheritance
  ImageSequencing.Timer.prototype = Object.create(Timer.prototype);
  ImageSequencing.Timer.prototype.constructor = ImageSequencing.Timer;

}) (H5P.ImageSequencing, H5P.Timer);
