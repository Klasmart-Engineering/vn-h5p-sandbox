(function (ImageSequencing) {

  /**
   * ImageSequencing.Counter - Keeps track of the number of times the game is submitted.
   *
   * @class H5P.ImageSequencing.Counter
   * @param {H5P.jQuery} $container
   * @param {number} previousValue Previous state value.
   */
  ImageSequencing.Counter = function ($container, previousValue) {

    /** @alias H5P.ImageSequencing.Counter# */
    const that = this;
    let current = typeof previousValue === 'number' ? previousValue : 0;

    /**
     * update - update the counter
     * @private
     */
    const update = function () {
      $container.text(current);
    };

    /**
     * Increment the counter.
     */
    that.increment = function () {
      current++;
      update();
    };

    /**
     * Revert counter back to its natural state
     */
    that.reset = function () {
      current = 0;
      update();
    };

    /**
     * Get current value.
     * @return {number} Current counter value.
     */
    that.getValue = function () {
      return current;
    };

    update();
  };

}) (H5P.ImageSequencing);
