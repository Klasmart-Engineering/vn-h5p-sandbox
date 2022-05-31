var H5P = H5P || {};

/**
 * Defines the H5P.ArithmeticQuiz class
 */
H5P.ArithmeticQuiz = (function ($) {

  /**
   * Creates a new ArithmeticQuiz instance
   *
   * @class
   * @augments H5P.EventDispatcher
   * @namespace H5P
   * @param {Object} options
   * @param {number} id
   * @param {object} extras Extra parameters like metadata/previousState.
   */
  function ArithmeticQuiz(options, id, extras) {
    // Add viewport meta to iframe
    $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">');

    this.contentId = id;

    var self = this;
    // Extend defaults with provided options
    self.options = $.extend(true, {}, {
      intro: '',
      quizType: 'arithmetic',
      arithmeticType: 'addition',
      equationType: undefined,
      useFractions: undefined,
      maxQuestions: undefined,
      UI: {
        score: 'Score @score',
        scoreInPercent: '(@percent% correct)',
        time: 'Time: @time',
        resultPageHeader: 'Finished!',
        retryButton: 'Retry',
        startButton: 'Start',
        go: 'GO!',
        correctText: 'Correct',
        incorrectText: 'Incorrect. Correct answer was :num',
        durationLabel: 'Duration in hours, minutes and seconds.',
        humanizedQuestion: 'What does :arithmetic equal?',
        humanizedEquation: 'For the equation :equation, what does :item equal?',
        humanizedVariable: 'What does :item equal?',
        plusOperator: 'plus',
        minusOperator: 'minus',
        multiplicationOperator: 'times',
        divisionOperator: 'divided by',
        equalitySign: 'equal',
        slideOfTotal: 'Slide :num of :total'
      }
    }, options);
    self.currentWidth = 0;

    self.options.subContentIds = (typeof options.subContentIds === 'string') ?
      options.subContentIds.split(';') :
      null;

    self.options.callbacks = { trigger: self.trigger };

    self.previousState = extras && extras.previousState && extras.previousState.gamePage ?
      extras.previousState :
      { gamePage: {} };

    self.gamePage = new H5P.ArithmeticQuiz.GamePage(
      self.options.quizType,
      self.options,
      id,
      { previousState: self.previousState.gamePage || {} }
    );

    // Emit xAPI progressed
    self.gamePage.on('progressed', function (e) {
      var xAPIEvent = self.createXAPIEventTemplate('progressed');
      xAPIEvent.data.statement.object.definition.extensions['http://id.tincanapi.com/extension/ending-point'] = e.data;
      self.trigger(xAPIEvent);
    });

    // Kidsloop Live session storage will listen
    self.gamePage.on('kllStoreSessionState', function () {
      self.trigger('kllStoreSessionState', undefined, { bubbles: true, external: true });
    });

    // Emit "fake subcontent's" xAPI answered statement
    self.gamePage.on('answered', function (e) {
      var instance = e.data;

      var xAPIEvent = self.createXAPIEventTemplate('answered');
      xAPIEvent.setContext({
        parent: self,
        libraryInfo: {
          versionedNameNoSpaces: 'H5P.ArithmeticQuizPage-' + self.libraryInfo.majorVersion + '.' + self.libraryInfo.minorVersion
        },
      });

      xAPIEvent.setObject(instance);
      for (var prop in instance.xAPIDefinition) {
        xAPIEvent.data.statement.object.definition[prop] = instance.xAPIDefinition[prop];
      }

      xAPIEvent.setScoredResult(
        instance.getScore(),
        instance.getMaxScore(),
        instance,
        true,
        instance.getScore() === instance.getMaxScore()
      );
      for (var prop in instance.xAPIResult) {
        xAPIEvent.data.statement.result[prop] = instance.xAPIResult[prop];
      }

      self.trigger(xAPIEvent);
    });

    self.gamePage.on('last-slide', function (e) {
      self.triggerXAPIScored(e.data.score, e.data.numQuestions, 'answered');
    });

    self.gamePage.on('started-quiz', function () {
      self.setActivityStarted();
    });

    self.gamePage.on('alternative-chosen', function () {
      self.triggerXAPI('interacted');
    });

    self.introPage = new H5P.ArithmeticQuiz.IntroPage(self.options.intro, self.options.UI);
    self.introPage.on('start-game', function() {
      self.introPage.remove();
      self.gamePage.startCountdown();
    });

    self.on('resize', function () {
      // Set size based on gamePage
      var height = self.gamePage.getMaxHeight() + 'px';
      this.$container.css({height: height});
      // Need to set height in pixels because of FF-bug
      $('.h5p-baq-countdown').css({height: height});
      $('.h5p-baq-result-page').css({height: height});
    });

    /**
     * Attach function called by H5P framework to insert H5P content into page
     *
     * @param {H5P.jQuery} $container
     */
    self.attach = function ($container) {
      if (self.isRoot()) {
        self.setActivityStarted();
      }

      if (this.$container === undefined) {
        this.$container = $container;
        this.addFont();
        this.$container.addClass('h5p-baq');
        this.introPage.appendTo($container);

        // Set gamePage xAPI parameters and append it.
        self.gamePage.contentId = id;
        self.gamePage.libraryInfo = self.libraryInfo;
        self.gamePage.appendTo(self.$container);

        self.trigger('resize');

        setTimeout(function () {
          H5P.ArithmeticQuiz.SoundEffects.setup(self.getLibraryFilePath(''));
        }, 1);

        // Recreate previous game state or result page
        if (self.previousState.gamePage.slide > 0 && self.previousState.gamePage.slide <= self.options.maxQuestions) {
          self.introPage.trigger('start-game');
        }
        else if (self.previousState.gamePage.slide > self.options.maxQuestions) {
          self.gamePage.countdownWidget.$countdownWidget.attr('aria-hidden', true);
          self.gamePage.countdownWidget.trigger('ignition');
          self.gamePage.handleLastSlide();
          self.introPage.remove();
        };
      }
    };

    /**
     * Adds fonts from google
     */
    self.addFont = function () {
      window.WebFontConfig = {
        google: { families: [ 'Lato::latin' ] }
      };

      var wf = document.createElement('script');
      wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      wf.type = 'text/javascript';
      wf.async = 'true';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
    };
  }

  /**
   * Replaces placeholders in translatables texts
   *
   * @static
   * @param  {String} text description
   * @param  {Object} vars description
   * @return {String}      description
   */
  ArithmeticQuiz.tReplace = function (text, vars) {
    for (var placeholder in vars) {
      text = text.replace('@'+placeholder, vars[placeholder]);
    }
    return text;
  };

  return ArithmeticQuiz;
})(H5P.jQuery);

/**
 * Answer call to retrieve the current state.
 * @return {object} Current state.
 */
H5P.ArithmeticQuiz.prototype.getCurrentState = function () {
  return { gamePage: this.gamePage.getCurrentState() };
};

/**
 * Enum defining the different arithmetic types
 * @readonly
 * @enum {string}
 */
H5P.ArithmeticQuiz.ArithmeticType = {
  ADDITION: 'addition',
  SUBTRACTION: 'subtraction',
  MULTIPLICATION: 'multiplication',
  DIVISION: 'division'
};

/**
 * Enum defining the different equation types
 * @readonly
 * @enum {string}
 */
H5P.ArithmeticQuiz.EquationType = {
  BASIC: 'basic',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

/**
 * Enum defining the different quiz types
 * @readonly
 * @enum {string}
 */
H5P.ArithmeticQuiz.QuizType = {
  ARITHMETIC: 'arithmetic',
  LINEAREQUATION: 'linearEquation'
};
