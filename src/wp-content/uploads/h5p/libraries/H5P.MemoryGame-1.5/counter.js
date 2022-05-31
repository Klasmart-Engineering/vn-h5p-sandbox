(function (MemoryGame) {

  /**
   * Keeps track of the number of cards that has been turned
   *
   * @class H5P.MemoryGame.Counter
   * @param {H5P.jQuery} $container
   * @param {number} previousValue Previous value.
   */
  MemoryGame.Counter = function ($container, previousValue) {
    /** @alias H5P.MemoryGame.Counter# */
    var self = this;

    var current = previousValue || 0;

    /**
     * @private
     */
    var update = function () {
      $container[0].innerText = current;
    };

    /**
     * Increment the counter.
     */
    self.increment = function () {
      current++;
      update();
    };

    /**
     * Get current value.
     * @return {number} Current value.
     */
    self.getValue = function () {
      return current;
    };

    /**
     * Revert counter back to its natural state
     */
    self.reset = function () {
      current = 0;
      update();
    };

    update();
  };

})(H5P.MemoryGame);
