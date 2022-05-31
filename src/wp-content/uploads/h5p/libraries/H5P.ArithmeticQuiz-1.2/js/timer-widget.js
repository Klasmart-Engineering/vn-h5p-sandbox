H5P.ArithmeticQuiz.TimerWidget = (function ($) {

  /**
   * Creates a TimerWidget instance
   *
   * @class
   * @namespace H5P.ArithmeticQuiz
   *
   * @param  {type} t Translation object
   */
  function TimerWidget(t) {
    H5P.EventDispatcher.call(this);

    var self = this;

    this.totalTime = 0;
    this.isRunning = false;
    this.timer;
    this.startTime = 0;
    this.incrementingAria = true;

    this.$timer = $('<time>', {
      'aria-label': t.durationLabel,
      'class': 'timer',
      role: 'timer',
      'aria-hidden': true,
      text: H5P.ArithmeticQuiz.tReplace(t.time, {time: '00:00'})
    });

    /**
     * Create an aria timer that will not update when it has been focus by a readspeaker
     *
     * Technical note: This is needed because when a readspeaker is on top of an element and that element changes
     * the focus will be moved back to the previous element. When this happens every second like
     * here it makes it impossible to move forward in the task whenever the timer is updated.
     * Therefore we do not update the readable element when it is focused.
     */
    this.$ariaTimer = $('<time>', {
      'aria-label': t.durationLabel,
      'class': 'timer aria-timer',
      role: 'timer',
      tabindex: '-1',
      text: H5P.ArithmeticQuiz.tReplace(t.time, {time: '0'})
    });

    this.$ariaTimer.on('focus', function () {
      self.incrementingAria = false;
    });

    this.$ariaTimer.on('blur', function () {
      self.incrementingAria = true;
    });

    /**
     * Humanize time
     *
     * @private
     * @param  {number} seconds Number of seconds to humanize
     * @param  {string} [separator] Separator used between the different time units
     * @return {string} The humanized time
     */
    this.humanizeTime = function (seconds, separator) {
      separator = separator || ':';
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);

      minutes = minutes % 60;
      seconds = Math.floor(seconds % 60);

      var time = '';

      if (hours !== 0) {
        time += hours + separator;

        if (minutes < 10) {
          time += '0';
        }
      }

      if (minutes < 10) {
        time += '0';
      }

      time += minutes + separator;

      if (seconds < 10) {
        time += '0';
      }

      time += seconds;

      return time;
    };

    /**
     * Update UI
     *
     * @private
     */
    this.update = function () {
      var self = this;
      var seconds = this.getTime() / 1000;

      this.$timer.text(H5P.ArithmeticQuiz.tReplace(t.time, {time: this.humanizeTime(seconds)}));

      if (this.incrementingAria) {
        this.$ariaTimer.text(H5P.ArithmeticQuiz.tReplace(t.time, {time: this.humanizeTime(seconds, ', ')}));
      }

      // Kidsloop Live session storage will listen
      this.trigger('kllStoreSessionState', undefined, { bubbles: true, external: true });

      this.timer = setTimeout(function(){
        self.update();
      }, 1000);
    };

    /**
     * Append me to something
     *
     * @param  {H5P.jQuery} $container
     */
    this.appendTo = function ($container) {
      this.$timer.appendTo($container);
      this.$ariaTimer.appendTo($container);
    };

    /**
     * Set time.
     * @param {number} timeMs Time to set in ms.
     */
    this.setTime = function (timeMs) {
      this.totalTime = timeMs;
    };

    /**
     * Start the timer.
     */
    this.start = function () {
      this.isRunning = true;
      clearTimeout(this.timer);
      this.startTime = new Date().getTime();
      this.update();
    };

    /**
     * Pause the timer
     *
     * @return {string} The humanized time
     */
    this.pause = function () {
      this.isRunning = false;
      this.totalTime += new Date().getTime() - this.startTime;
      clearTimeout(this.timer);

      return this.humanizeTime(this.getTime() / 1000);
    };

    /**
     * Reset timer
     */
    this.reset = function () {
      clearTimeout(this.timer);
      this.isRunning = false;
      this.totalTime = 0;
      this.startTime = 0;
    };

    /**
     * Restart timer
     */
    this.restart = function () {
      this.reset();
      this.start();
    };

    /**
     * Calculate running time
     *
     * @return {number} Running time in seconds
     */
    this.getTime = function () {
      return this.totalTime + (this.isRunning ? new Date().getTime() - this.startTime : 0);
    };
  }
  TimerWidget.prototype = Object.create(H5P.EventDispatcher.prototype);
  TimerWidget.prototype.constructor = TimerWidget;


  return TimerWidget;

})(H5P.jQuery);
