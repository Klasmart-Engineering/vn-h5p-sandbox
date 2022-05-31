/*global H5P*/
H5P.ImageMultipleHotspotQuestion = (function ($, Question) {

  /**
   * Initialize module.
   *
   * @class H5P.ImageMultipleHotspotQuestion
   * @extends H5P.Question
   * @param {Object} params Behavior settings
   * @param {number} id Content identification
   * @param {Object} contentData Task specific content data
   */
  function ImageMultipleHotspotQuestion(params, id, contentData) {
    const self = this;

    const defaults = {
      imageMultipleHotspotQuestion: {
        backgroundImageSettings: {
          backgroundImage: {
            path: ''
          }
        },
        hotspotSettings: {
          hotspot: []
        }
      },
      behaviour: {
        enableRetry: true,
        enableSolutionsButton: false
      },
      l10n: {
        play: 'Play',
        pause: 'Pause',
        audioNotSupported: 'Your browser does not support this audio'
      }
    };

    /**
     * Keep track of selected hotspots
     */
    this.selectedHotspots = [];

    // Inheritance
    Question.call(self, 'image-multiple-hotspot-question');

    /**
     * Keeps track of content id.
     * @type {number}
     */
    this.contentId = id;

    /**
     * Keeps track of current score.
     * @type {number}
     */
    this.score = 0;

    /**
     * Keeps track of max score.
     * @type {number}
     */
    this.maxScore = 1;

    /**
     * State for not accepting clicks
     * @type {boolean}
     */
    this.disabled = false;

    /**
     * State for answer given.
     * @type {boolean}
     */
    this.answerGiven = false;

    /**
     * Keeps track of parameters
     */
    this.params = $.extend(true, {}, defaults, params);

    // Store audios
    this.audios = new Array(this.params.imageMultipleHotspotQuestion.hotspotSettings.hotspot.length);

    /**
     * Easier access to image settings.
     */
    this.imageSettings = this.params.imageMultipleHotspotQuestion.backgroundImageSettings.backgroundImage;

    /**
     * Easier access to hotspot settings.
     */
    this.hotspotSettings = this.params.imageMultipleHotspotQuestion.hotspotSettings;

    /**
     * Hotspot feedback object. Contains hotspot feedback specific parameters.
     * @type {Object}
     */
    this.hotspotFeedback = {
      hotspotChosen: false
    };

    /**
     * Keeps track of all the selected correct hotspots in an array.
     * @type {Array}
     */
    this.correctHotspotFeedback = [];

    /**
     * Keeps track of all correct hotspots in an array.
     * @type {Array}
     */
    this.$hotspots = [];

    /**
     * Keep track of selected hotspots
     */
    this.selectedHotspots = [];

    /**
     * Hotspots reference
     */
    this.allHotspots = this.hotspotSettings.hotspot;

    /**
     * Keeps track of the content data. Specifically the previous state.
     * @type {Object}
     */
    this.contentData = contentData;
    if (contentData !== undefined && contentData.previousState !== undefined) {
      this.previousState = contentData.previousState;
    }

    // Register resize listener with h5p
    this.on('resize', this.resize);
  }


  // Inheritance
  ImageMultipleHotspotQuestion.prototype = Object.create(Question.prototype);
  ImageMultipleHotspotQuestion.prototype.constructor = ImageMultipleHotspotQuestion;

  /**
   * Registers this question types DOM elements before they are attached.
   * Called from H5P.Question.
   */
  ImageMultipleHotspotQuestion.prototype.registerDomElements = function () {
    // Register task introduction text
    if (this.hotspotSettings.taskDescription) {
      this.setIntroduction(this.createIntroduction({
        hotspotSettings: this.hotspotSettings,
        l10n: this.params.l10n
      }));
    }

    // Register task content area
    this.setContent(this.createContent());

    // Register retry button
    this.createRetryButton();
  };

  ImageMultipleHotspotQuestion.prototype.createIntroduction = function (params) {
    const $introductionWrapper = $('<div class="h5p-image-hotspot-question-intro-wrapper">');

    const hasAudio = (params.hotspotSettings.taskDescriptionAudio && params.hotspotSettings.taskDescriptionAudio.length > 0);

    if (hasAudio) {
      const $audioButtonContainer = $('<div/>', {
        'class': 'h5p-image-hotspot-question-audio-wrapper'
      });

      const audioInstance = new H5P.Audio(
        {
          files: params.hotspotSettings.taskDescriptionAudio,
          audioNotSupported: params.l10n.audioNotSupported
        },
        this.contentId
      );
      audioInstance.attach($audioButtonContainer);
      $audioButtonContainer.appendTo($introductionWrapper);
    }

    const $taskDescription = $('<div class="h5p-image-hotspot-question-intro">' + params.hotspotSettings.taskDescription + '</div>').appendTo($introductionWrapper);
    if (hasAudio) {
      $taskDescription.addClass('hasAudio');
    }

    return $introductionWrapper;
  };

  /**
   * Create wrapper and main content for question.
   * @returns {H5P.jQuery} Wrapper
   */
  ImageMultipleHotspotQuestion.prototype.createContent = function () {
    const self = this;

    this.$wrapper = $('<div>', {
      'class': 'image-multiple-hotspot-question ' + this.contentId
    });

    this.$imageWrapper = $('<div>', {
      'class': 'image-wrapper'
    }).appendTo(this.$wrapper);

    // Image loader screen
    const $loader = $('<div>', {
      'class': 'image-loader'
    }).appendTo(this.$imageWrapper)
      .addClass('loading');

    this.$img = $('<img>', {
      'class': 'hotspot-image',
      'src': (this.imageSettings.path !== '') ? H5P.getPath(this.imageSettings.path, this.contentId) : ''
    });

    // Resize image once loaded
    this.$img.on('load', function () {
      $loader.replaceWith(self.$img);
      self.trigger('resize');
    });

    this.attachHotspots();
    this.initImageClickListener();

    /** Check if user has set number of correct hotspots needed, if number of hotspots
    * needed is greater than number of hotspots in image, default to hotspots length.
    */
    if (this.hotspotSettings.numberHotspots && this.hotspotSettings.numberHotspots <= this.$hotspots.length) {
      this.maxScore = this.hotspotSettings.numberHotspots;
    }
    else {
      this.maxScore = this.$hotspots.length;
    }
    return this.$wrapper;
  };

  /**
   * Initiate image click listener to capture clicks outside of defined hotspots.
   */
  ImageMultipleHotspotQuestion.prototype.initImageClickListener = function () {
    const self = this;

    this.$imageWrapper.click(function (mouseEvent) {
      if (self.disabled) {
        return false;
      }

      if ($(mouseEvent.target).is('.correct, .already-selected, .incorrect')) {
        $('.image-hotspot').each(function () {
          // check if clicked point (taken from event) is inside element
          const mouseX = mouseEvent.pageX;
          const mouseY = mouseEvent.pageY;
          const offset = $(this).offset();
          const width = $(this).width();
          const height = $(this).height();

          if (mouseX > offset.left && mouseX < offset.left + width && mouseY > offset.top && mouseY < offset.top + height) {
            const e = new $.Event('click');
            e.pageX = mouseX;
            e.pageY = mouseY;
            $(this).trigger(e); // force click event
          }
        });
      }
      else {
        self.stopAudios();
        // Create new hotspot feedback
        self.createHotspotFeedback($(this), mouseEvent);
      }
    });
  };

  /**
   * Attaches all hotspots.
   */
  ImageMultipleHotspotQuestion.prototype.attachHotspots = function () {
    const self = this;
    this.hotspotSettings.hotspot.forEach(function (hotspot, index) {
      self.attachHotspot(hotspot, index);
    });
  };

  /**
   * Attach single hotspot.
   * @param {Object} hotspot Hotspot parameters
   */
  ImageMultipleHotspotQuestion.prototype.attachHotspot = function (hotspot, index) {
    this.audios[index] = ImageMultipleHotspotQuestion.createAudio(hotspot.userSettings.audio, this.contentId);

    const self = this;

    hotspot.computedSettings.angle = hotspot.computedSettings.angle || 0;
    hotspot.computedSettings.scaleX = hotspot.computedSettings.scaleX || 1;
    hotspot.computedSettings.scaleY = hotspot.computedSettings.scaleY || 1;

    const $hotspotWrapper = $('<div>', {
      'class': 'image-hotspot-wrapper'
    }).css({
      left: hotspot.computedSettings.x + '%',
      top: hotspot.computedSettings.y + '%',
      width: hotspot.computedSettings.width + '%',
      height: hotspot.computedSettings.height + '%'
    }).appendTo(this.$imageWrapper);
    if (this.audios[index]) {
      $hotspotWrapper.append(this.audios[index].player);
    }

    var $hotspot = $('<div>', {
      'class': 'image-hotspot ' + hotspot.computedSettings.figure
    }).css({
      transform: 'rotate(' + hotspot.computedSettings.angle + 'deg) scale(' + hotspot.computedSettings.scaleX + ', ' + hotspot.computedSettings.scaleY + ')'
    }).click(function (mouseEvent) {
      self.stopAudios();

      if (self.getScore() >= self.getMaxScore()) {
        return; // done
      }

      if (self.selectedHotspots.indexOf(index) === -1) {
        self.playAudio(index);
        self.selectedHotspots.push(index); // add chosen hotspot to selectedHotspots list
      }
      else if (!hotspot.userSettings.correct) {
        self.playAudio(index); // Wrong audios played again.
      }

      if (self.disabled) {
        return false;
      }

      // Create new hotspot feedback
      self.createHotspotFeedback($(this), mouseEvent, hotspot);

      // Do not propagate
      return false;

    }).appendTo($hotspotWrapper);

    if (hotspot.userSettings.correct) {
      this.$hotspots.push($hotspot);
    }
  };

  /**
   * Create a feedback element for a click.
   * @param {H5P.jQuery} $clickedElement The element that was clicked, a hotspot or the image wrapper.
   * @param {Object} mouseEvent Mouse event containing mouse offsets within clicked element.
   * @param {Object} hotspot Hotspot parameters.
   */
  ImageMultipleHotspotQuestion.prototype.createHotspotFeedback = function ($clickedElement, mouseEvent, hotspot) {
    this.answerGiven = true;

    let feedbackText;

    if (this.hotspotFeedback.$element && this.hotspotFeedback.incorrect) {
      this.hotspotFeedback.$element.remove();
    }

    this.hotspotFeedback = {
      hotspotChosen: false
    };

    // Do not create new hotspot if reached max score
    if (this.score === this.maxScore) {
      return;
    }

    this.hotspotFeedback.$element = $('<div>', {
      'class': 'hotspot-feedback'
    }).appendTo(this.$imageWrapper);

    this.hotspotFeedback.hotspotChosen = true;

    const backgroundClientRect = this.$imageWrapper.get(0).getBoundingClientRect();
    const feedbackPosX = mouseEvent.clientX - backgroundClientRect.left;
    const feedbackPosY = mouseEvent.clientY - backgroundClientRect.top;

    // Keep position and pixel offsets for resizing
    this.hotspotFeedback.percentagePosX = feedbackPosX / (this.$imageWrapper.width() / 100);
    this.hotspotFeedback.percentagePosY = feedbackPosY / (this.$imageWrapper.height() / 100);
    this.hotspotFeedback.pixelOffsetX = (this.hotspotFeedback.$element.width() / 2);
    this.hotspotFeedback.pixelOffsetY = (this.hotspotFeedback.$element.height() / 2);

    // Position feedback
    this.resizeHotspotFeedback();

    // Style correct answers
    if (hotspot && hotspot.userSettings.correct && !hotspot.userSettings.selected) {
      hotspot.userSettings.selected = true;
      this.hotspotFeedback.$element.addClass('correct');
      this.score = this.score + 1;
      this.correctHotspotFeedback.push(this.hotspotFeedback);
      if (hotspot && hotspot.userSettings.feedbackText) {
        if (this.params.imageMultipleHotspotQuestion.hotspotSettings.hotspotName) {
          feedbackText = (this.params.imageMultipleHotspotQuestion.hotspotSettings.hotspotName ? hotspot.userSettings.feedbackText + ' ' + this.score + ' of ' + this.maxScore + ' ' + this.params.imageMultipleHotspotQuestion.hotspotSettings.hotspotName + '.' : hotspot.userSettings.feedbackText + ' ' + this.score + ' of ' + this.maxScore + '.');
        }
      }
      this.hotspotFeedback.incorrect = false;
    }
    else if (hotspot && hotspot.userSettings.selected) {
      this.hotspotFeedback.$element.addClass('already-selected');
      feedbackText = this.params.imageMultipleHotspotQuestion.hotspotSettings.alreadySelectedFeedback;
      this.hotspotFeedback.incorrect = true;
    }
    else if (hotspot) {
      this.hotspotFeedback.$element.addClass('incorrect');
      feedbackText = hotspot.userSettings.feedbackText;
      this.hotspotFeedback.incorrect = true;
    }
    else {
      feedbackText = this.params.imageMultipleHotspotQuestion.hotspotSettings.noneSelectedFeedback;
      this.hotspotFeedback.incorrect = true;
    }

    if (!feedbackText) {
      feedbackText = '&nbsp;';
    }

    this.setFeedback(feedbackText, this.score, this.maxScore);

    // Finally add fade in animation to hotspot feedback
    this.hotspotFeedback.$element.addClass('fade-in');

    // Trigger xAPI completed event
    this.trigger(this.getXAPIAnswerEvent());
  };

  /**
   * Show correct hotspots.
   */
  ImageMultipleHotspotQuestion.prototype.showCorrectHotspots = function () {
    const self = this;

    // Remove old feedback
    this.$wrapper.find('.hotspot-feedback').remove();

    this.hotspotSettings.hotspot.forEach(function (hotspot) {
      if (!hotspot.userSettings.correct) {
        return; // Skip, wrong hotspot
      }

      // Compute and set position of feedback circle
      const $element = $('<div>', {
        'class': 'hotspot-feedback'
      }).appendTo(self.$imageWrapper);

      const centerX = (hotspot.computedSettings.x + hotspot.computedSettings.width / 2) + '%';
      const centerY = (hotspot.computedSettings.y + hotspot.computedSettings.height / 2) + '%';

      $element
        .css({
          left: 'calc(' + centerX + ' - ' + $element.width() / 2 + 'px' + ')',
          top: 'calc(' + centerY + ' - ' + $element.height() / 2 + 'px' + ')'
        })
        .addClass('correct')
        .addClass('fade-in');
    });
  };

  /**
   * Create retry button and add it to button bar.
   */
  ImageMultipleHotspotQuestion.prototype.createRetryButton = function () {
    const self = this;

    this.addButton('retry-button', 'Retry', function () {
      self.resetTask();
    }, false);
  };

  /**
   * Return the clicked hotspots
   * @return {array} An array containin the indexes of the clicked hotspots
   */
  ImageMultipleHotspotQuestion.prototype.getCurrentState = function () {
    return this.selectedHotspots;
  };

  /**
   * Checks if an answer for this question has been given.
   * Used in contracts.
   * @returns {boolean}
   */
  ImageMultipleHotspotQuestion.prototype.getAnswerGiven = function () {
    return this.answerGiven;
  };

  /**
   * Gets the current user score for this question.
   * Used in contracts
   * @returns {number}
   */
  ImageMultipleHotspotQuestion.prototype.getScore = function () {
    return this.score;
  };

  /**
   * Gets the max score for this question.
   * Used in contracts.
   * @returns {number}
   */
  ImageMultipleHotspotQuestion.prototype.getMaxScore = function () {
    return this.maxScore;
  };

  /**
   * Display the first found solution for this question.
   * Used in contracts
   */
  ImageMultipleHotspotQuestion.prototype.showSolutions = function () {
    this.showCorrectHotspots();
    this.setFeedback('', this.getScore(), this.getMaxScore());
    this.disabled = true;
  };

  /**
   * Resets the question.
   * Used in contracts.
   */
  ImageMultipleHotspotQuestion.prototype.resetTask = function () {
    // Remove hotspot feedback
    if (this.hotspotFeedback.$element) {
      this.hotspotFeedback.$element.remove();
    }

    // Reset selected hotspots
    this.selectedHotspots = [];

    // Remove any correct hotspots from array
    this.correctHotspotFeedback = [];

    // Remove hotspots from DOM
    this.$imageWrapper.find('.hotspot-feedback').remove();

    // Erase tracks of previous tries
    this.hotspotSettings.hotspot.forEach(function (hotspot) {
      hotspot.userSettings.selected = false;
    });

    this.score = 0;
    this.hotspotFeedback.hotspotChosen = false;

    // Hide retry button
    this.hideButton('retry-button');

    // Clear feedback
    this.removeFeedback();

    this.disabled = false;

    this.answerGiven = false;
  };

  /**
   * Resize image and wrapper
   */
  ImageMultipleHotspotQuestion.prototype.resize = function () {
    this.resizeHotspotFeedback();
    this.resizeCorrectHotspotFeedback();
  };

  /**
   * Re-position correct hotspot feedback.
   */
  ImageMultipleHotspotQuestion.prototype.resizeCorrectHotspotFeedback = function () {
    // Check that hotspot is chosen
    if (this.correctHotspotFeedback.length === 0) {
      return;
    }

    for ( let i = 0; i < this.correctHotspotFeedback.length; i++) {
      // Calculate positions
      const posX = (this.correctHotspotFeedback[i].percentagePosX * (this.$imageWrapper.width() / 100)) - this.correctHotspotFeedback[i].pixelOffsetX;
      const posY = (this.correctHotspotFeedback[i].percentagePosY * (this.$imageWrapper.height() / 100)) - this.correctHotspotFeedback[i].pixelOffsetY;

      // Apply new positions
      this.correctHotspotFeedback[i].$element.css({
        left: posX,
        top: posY
      });
    }
  };

  /**
   * Re-position hotspot feedback.
   */
  ImageMultipleHotspotQuestion.prototype.resizeHotspotFeedback = function () {
    // Check that hotspot is chosen
    if (!this.hotspotFeedback.hotspotChosen) {
      return;
    }

    // Calculate positions
    const posX = (this.hotspotFeedback.percentagePosX * (this.$imageWrapper.width() / 100)) - this.hotspotFeedback.pixelOffsetX;
    const posY = (this.hotspotFeedback.percentagePosY * (this.$imageWrapper.height() / 100)) - this.hotspotFeedback.pixelOffsetY;

    // Apply new positions
    this.hotspotFeedback.$element.css({
      left: posX,
      top: posY
    });
  };

  /**
   * Get xAPI data.
   * @return {object} XAPI statement.
   * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-6}
   */
  ImageMultipleHotspotQuestion.prototype.getXAPIData = function () {
    return ({statement: this.getXAPIAnswerEvent().data.statement});
  };

  /**
   * Build xAPI answer event.
   * @return {H5P.XAPIEvent} XAPI answer event.
   */
  ImageMultipleHotspotQuestion.prototype.getXAPIAnswerEvent = function () {
    const xAPIEvent = this.createImageMultipleHotspotQuestionXAPIEvent('answered');

    xAPIEvent.setScoredResult(this.getScore(), this.getMaxScore(), this,
      true, this.getScore() === this.getMaxScore());

    return xAPIEvent;
  };

  /**
   * Create an xAPI event for ImageMultipleHotspotQuestion.
   * @param {string} verb Short id of the verb we want to trigger.
   * @return {H5P.XAPIEvent} Event template.
   */
  ImageMultipleHotspotQuestion.prototype.createImageMultipleHotspotQuestionXAPIEvent = function (verb) {
    const xAPIEvent = this.createXAPIEventTemplate(verb);

    $.extend(true, xAPIEvent.getVerifiedStatementValue(['object', 'definition']), this.getxAPIDefinition());

    return xAPIEvent;
  };

  /**
   * Get the xAPI definition for the xAPI object.
   * @return {object} XAPI definition.
   */
  ImageMultipleHotspotQuestion.prototype.getxAPIDefinition = function () {
    return {
      name: {'en-US': this.getTitle()},
      description: {'en-US': this.getDescription()},
      type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
      interactionType: 'choice'
    };
  };

  /**
   * Get tasks title.
   * @return {string} Title.
   */
  ImageMultipleHotspotQuestion.prototype.getTitle = function () {
    let raw;
    if (this.contentData && this.contentData.metadata) {
      raw = this.contentData.metadata.title;
    }
    raw = raw || ImageMultipleHotspotQuestion.DEFAULT_DESCRIPTION;

    return H5P.createTitle(raw);
  };

  /**
   * Get tasks description.
   * @return {string} Description.
   */
  ImageMultipleHotspotQuestion.prototype.getDescription = function () {
    return this.params.imageMultipleHotspotQuestion.hotspotSettings.taskDescription || ImageMultipleHotspotQuestion.DEFAULT_DESCRIPTION;
  };

  /**
  * Create audio elements from audio object.
  * @param {object} audio Audio object.
  * @param {number} id ContentId.
  * @return {object[]} Audio elements.
  */
  ImageMultipleHotspotQuestion.createAudio = function (audio, id) {
    if (!audio || audio.length < 1 || !audio[0].path) {
      return null;
    }

    const player = document.createElement('audio');
    player.classList.add('h5p-invisible-audio');
    player.src = H5P.getPath(audio[0].path, id);

    return {
      player: player,
      promise: null
    };
  };

  /**
  * Start audio.
  * @param {number} id Index.
  */
  ImageMultipleHotspotQuestion.prototype.playAudio = function (id) {
    if (id < 0 || id >= this.audios.length) {
      return;
    }

    const audio = this.audios[id];

    if (!audio) {
      return;
    }

    // People might click quickly ...
    if (!audio.promise) {
      audio.promise = audio.player.play();
      audio.promise
        .then(() => {
          audio.promise = null;
        })
        .catch(() => {
          // Browser policy prevents playing
          audio.promise = null;
        });
    }
  };

  /**
  * Stop audios
  */
  ImageMultipleHotspotQuestion.prototype.stopAudios = function () {
    /*
    * People may click quickly, and audios that should
    * be stopped may not have loaded yet.
    */

    this.audios.forEach(function (audio) {
      if (!audio) {
        return;
      }

      if (audio.promise) {
        audio.promise.then(() => {
          audio.player.pause();
          audio.player.load(); // Reset
          audio.promise = null;
        });
      }
      else {
        audio.player.pause();
        audio.player.load(); // Reset
      }
    });
  };

  ImageMultipleHotspotQuestion.DEFAULT_DESCRIPTION = 'Image Multiple Hotspot Question';

  return ImageMultipleHotspotQuestion;
}(H5P.jQuery, H5P.Question));
