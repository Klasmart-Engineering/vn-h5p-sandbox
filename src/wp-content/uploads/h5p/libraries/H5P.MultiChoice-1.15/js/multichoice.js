// Events provided:
// - h5pQuestionAnswered: Triggered when a question has been answered.

var H5P = H5P || {};

/**
 * @typedef {Object} Options
 *   Options for multiple choice
 *
 * @property {Object} behaviour
 * @property {boolean} behaviour.confirmCheckDialog
 * @property {boolean} behaviour.confirmRetryDialog
 *
 * @property {Object} UI
 * @property {string} UI.tipsLabel
 *
 * @property {Object} [confirmRetry]
 * @property {string} [confirmRetry.header]
 * @property {string} [confirmRetry.body]
 * @property {string} [confirmRetry.cancelLabel]
 * @property {string} [confirmRetry.confirmLabel]
 *
 * @property {Object} [confirmCheck]
 * @property {string} [confirmCheck.header]
 * @property {string} [confirmCheck.body]
 * @property {string} [confirmCheck.cancelLabel]
 * @property {string} [confirmCheck.confirmLabel]
 */

/**
 * Module for creating a multiple choice question
 *
 * @param {Options} options
 * @param {number} contentId
 * @param {Object} contentData
 * @returns {H5P.MultiChoice}
 * @constructor
 */
H5P.MultiChoice = function (options, contentId, contentData) {
  if (!(this instanceof H5P.MultiChoice))
    return new H5P.MultiChoice(options, contentId, contentData);
  var self = this;
  this.contentId = contentId;
  this.contentData = contentData;
  H5P.Question.call(self, 'multichoice');
  var $ = H5P.jQuery;

  // Make Audio and Video extend H5P.ContentType
  if (H5P.Audio) {
    H5P.Audio.prototype = H5P.jQuery.extend({}, H5P.ContentType().prototype, H5P.Audio.prototype);
  }
  if (H5P.Video) {
    H5P.Video.prototype = H5P.jQuery.extend({}, H5P.ContentType().prototype, H5P.Video.prototype);
  }

  var defaults = {
    answerType: "text",
    image: null,
    question: "No question text provided",
    answers: [
      {
        tipsAndFeedback: {
          tip: '',
          chosenFeedback: '',
          notChosenFeedback: ''
        },
        text: "Answer 1",
        displayText: true,
        correct: true
      }
    ],
    overallFeedback: [],
    weight: 1,
    userAnswers: [],
    UI: {
      checkAnswerButton: 'Check',
      showSolutionButton: 'Show solution',
      tryAgainButton: 'Try again',
      scoreBarLabel: 'You got :num out of :total points',
      tipAvailable: "Tip available",
      feedbackAvailable: "Feedback available",
      readFeedback: 'Read feedback',
      shouldCheck: "Should have been checked",
      shouldNotCheck: "Should not have been checked",
      noInput: 'Input is required before viewing the solution',
      audioNotSupported: 'Your browser does not support this audio',
      a11yCheck: 'Check the answers. The responses will be marked as correct, incorrect, or unanswered.',
      a11yShowSolution: 'Show the solution. The task will be marked with its correct solution.',
      a11yRetry: 'Retry the task. Reset all responses and start the task over again.',
    },
    behaviour: {
      enableRetry: true,
      enableSolutionsButton: true,
      enableCheckButton: true,
      type: 'auto',
      columns: 'auto',
      singlePoint: true,
      randomAnswers: false,
      showSolutionsRequiresInput: true,
      autoCheck: false,
      passPercentage: 100,
      showScorePoints: true
    }
  };
  var params = $.extend(true, defaults, options);

  // TODO: This should go into upgrade.js
  params.answers.forEach(function (answer) {
    if (typeof answer.displayText === 'undefined') {
      answer.displayText = true;
    }
  });

  // Keep track of number of correct choices
  var numCorrect = 0;

  var instances = [];
  var instancesToLoad = params.answers.length;
  var highestAlternative = null;
  var highestAlternativeStyle = null;
  var alternatives = null;

  // Loop through choices
  for (var i = 0; i < params.answers.length; i++) {
    var answer = params.answers[i];

    // Make sure tips and feedback exists
    answer.tipsAndFeedback = answer.tipsAndFeedback || {};

    if (params.answers[i].correct) {
      // Update number of correct choices
      numCorrect++;
    }
  }

  // Determine if no choices is the correct
  var blankIsCorrect = (numCorrect === 0);

  // Determine task type
  if (params.behaviour.type === 'auto') {
    // Use single choice if only one choice is correct
    params.behaviour.singleAnswer = (numCorrect === 1);
  }
  else {
    params.behaviour.singleAnswer = (params.behaviour.type === 'single');
  }

  var getCheckboxOrRadioIcon = function (radio, selected) {
    var icon;
    if (radio) {
      icon = selected ? '&#xe603;' : '&#xe600;';
    }
    else {
      icon = selected ? '&#xe601;' : '&#xe602;';
    }
    return icon;
  };

  // Initialize buttons and elements.
  var $myDom;
  var $feedbackDialog;

  /**
   * Remove all feedback dialogs
   */
  var removeFeedbackDialog = function () {
    // Remove the open feedback dialogs.
    $myDom.unbind('click', removeFeedbackDialog);
    $myDom.find('.h5p-feedback-button, .h5p-feedback-dialog').remove();
    $myDom.find('.h5p-has-feedback').removeClass('h5p-has-feedback');
    if ($feedbackDialog) {
      $feedbackDialog.remove();
    }
  };

  var score = 0;
  var solutionsVisible = false;

  /**
   * Add feedback to element
   * @param {jQuery} $element Element that feedback will be added to
   * @param {string} feedback Feedback string
   */
  var addFeedback = function ($element, feedback) {
    $feedbackDialog = $('' +
    '<div class="h5p-feedback-dialog">' +
      '<div class="h5p-feedback-inner">' +
        '<div class="h5p-feedback-text" aria-hidden="true">' + feedback + '</div>' +
      '</div>' +
    '</div>');

    //make sure feedback is only added once
    if (!$element.find($('.h5p-feedback-dialog')).length) {
      $feedbackDialog.appendTo($element.addClass('h5p-has-feedback'));
    }
  };

  /**
   * Register the different parts of the task with the H5P.Question structure.
   */
  self.registerDomElements = function () {
    var media = params.media;
    if (media && media.type && media.type.library) {
      media = media.type;
      var type = media.library.split(' ')[0];
      if (type === 'H5P.Image') {
        if (media.params.file) {
          // Register task image
          self.setImage(media.params.file.path, {
            disableImageZooming: params.media.disableImageZooming || false,
            alt: media.params.alt,
            title: media.params.title
          });
        }
      }
      else if (type === 'H5P.Video') {
        if (media.params.sources) {
          // Register task video
          self.setVideo(media);
        }
      }
    }

    // Determine if we're using checkboxes or radio buttons
    for (var i = 0; i < params.answers.length; i++) {
      params.answers[i].checkboxOrRadioIcon = getCheckboxOrRadioIcon(params.behaviour.singleAnswer, params.userAnswers.indexOf(i) > -1);
    }

    // Register Introduction
    self.setIntroduction('<div id="' + params.label + '">' + params.question + '</div>');

    // Register task content area
    $myDom = $(createDOM(params));

    // KidsLoop customization to prevent dragging the image on desktop
    $myDom.get(0).addEventListener('dragstart', function (event) {
      event.preventDefault();
    });

    self.setContent($myDom, {
      'class': params.behaviour.singleAnswer ? 'h5p-radio' : 'h5p-check'
    });

    // Resize height for image
    const needsHeightScaling = ['image', 'imageaudio', 'video'].indexOf(params.answerType) !== -1;
    const numberOfColumns = computeNumberColumns(params.answerType, params.behaviour.columns);
    if (needsHeightScaling && numberOfColumns > 1) {
      self.on('resize', function () {
        setAlternativeHeight();
      });
    }

    // Create tips:
    var $answers = $('.h5p-answer', $myDom).each(function (i) {

      var tip = params.answers[i].tipsAndFeedback.tip;
      if (tip === undefined) {
        return; // No tip
      }

      tip = tip.trim();
      var tipContent = tip
        .replace(/&nbsp;/g, '')
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '')
        .trim();
      if (!tipContent.length) {
        return; // Empty tip
      }
      else {
        $(this).addClass('h5p-has-tip');
      }

      // Add tip
      var $wrap = $('<div/>', {
        'class': 'h5p-multichoice-tipwrap',
        'aria-label': params.UI.tipAvailable + '.'
      });

      var $multichoiceTip = $('<div>', {
        'role': 'button',
        'tabindex': 0,
        'title': params.UI.tipsLabel,
        'aria-label': params.UI.tipsLabel,
        'aria-expanded': false,
        'class': 'multichoice-tip',
        appendTo: $wrap
      });

      var tipIconHtml = '<span class="joubel-icon-tip-normal">' +
                          '<span class="h5p-icon-shadow"></span>' +
                          '<span class="h5p-icon-speech-bubble"></span>' +
                          '<span class="h5p-icon-info"></span>' +
                        '</span>';

      $multichoiceTip.append(tipIconHtml);

      $multichoiceTip.click(function () {
        var $tipContainer = $multichoiceTip.parents('.h5p-answer');
        var openFeedback = !$tipContainer.children('.h5p-feedback-dialog').is($feedbackDialog);
        removeFeedbackDialog();

        // Do not open feedback if it was open
        if (openFeedback) {
          $multichoiceTip.attr('aria-expanded', true);

          // Add tip dialog
          addFeedback($tipContainer, tip);
          $feedbackDialog.addClass('h5p-has-tip');

          // Tip for readspeaker
          self.read(tip);
        }
        else {
          $multichoiceTip.attr('aria-expanded', false);
        }

        self.trigger('resize');

        // Remove tip dialog on dom click
        setTimeout(function () {
          $myDom.click(removeFeedbackDialog);
        }, 100);

        // Do not propagate
        return false;
      }).keydown(function (e) {
        if (e.which === 32) {
          $(this).click();
          return false;
        }
      });

      $('.h5p-alternative-container', this).append($wrap);
    });

    // Set event listeners.
    var toggleCheck = function ($ans) {
      if ($ans.attr('aria-disabled') === 'true') {
        return;
      }
      self.answered = true;
      var num = parseInt($ans.data('id'));
      if (params.behaviour.singleAnswer) {
        // Store answer
        params.userAnswers[0] = num;

        // Calculate score
        score = (params.answers[num].correct ? 1 : 0);

        // De-select previous answer
        $answers.not($ans).removeClass('h5p-selected').attr('tabindex', '-1').attr('aria-checked', 'false');

        // Select new answer
        $ans.addClass('h5p-selected').attr('tabindex', '0').attr('aria-checked', 'true');
      }
      else {
        if ($ans.attr('aria-checked') === 'true') {

          // Do not allow un-checking when retry disabled and auto check
          if (params.behaviour.autoCheck && !params.behaviour.enableRetry) {
            return;
          }

          // Remove check
          $ans.removeClass('h5p-selected').attr('aria-checked', 'false');
        }
        else {
          $ans.addClass('h5p-selected').attr('aria-checked', 'true');
        }

        // Calculate score
        calcScore();
      }

      self.triggerXAPI('interacted');
      hideSolution($ans);

      if (params.userAnswers.length) {
        self.showButton('check-answer');
        self.hideButton('try-again');
        self.hideButton('show-solution');

        if (params.behaviour.autoCheck) {
          if (params.behaviour.singleAnswer) {
            // Only a single answer allowed
            checkAnswer();
          }
          else {
            // Show feedback for selected alternatives
            self.showCheckSolution(true);

            // Always finish task if it was completed successfully
            if (score === self.getMaxScore()) {
              checkAnswer();
            }
          }
        }
      }
    };

    $answers.click(function (event) {
      if (event.target.classList.contains('h5p-audio-minimal-button')) {
        return; // Clicking audio button
      }

      toggleCheck($(this));
    }).keydown(function (e) {
      if (event.target.classList.contains('h5p-audio-minimal-button')) {
        return; // Activating audio button
      }

      if (e.keyCode === 32) { // Space bar
        // Select current item
        toggleCheck($(this));
        return false;
      }

      if (params.behaviour.singleAnswer) {
        switch (e.keyCode) {
          case 38:   // Up
          case 37: { // Left
            // Try to select previous item
            var $prev = $(this).prev();
            if ($prev.length) {
              toggleCheck($prev.focus());
            }
            return false;
          }
          case 40:   // Down
          case 39: { // Right
            // Try to select next item
            var $next = $(this).next();
            if ($next.length) {
              toggleCheck($next.focus());
            }
            return false;
          }
        }
      }
    });

    if (params.behaviour.singleAnswer) {
      // Special focus handler for radio buttons
      $answers.focus(function () {
        if ($(this).attr('aria-disabled') !== 'true') {
          $answers.not(this).attr('tabindex', '-1');
        }
      }).blur(function () {
        if (!$answers.filter('.h5p-selected').length) {
          $answers.first().add($answers.last()).attr('tabindex', '0');
        }
      });
    }

    // Adds check and retry button
    addButtons();
    if (!params.behaviour.singleAnswer) {

      calcScore();
    }
    else {
      if (params.userAnswers.length && params.answers[params.userAnswers[0]].correct) {
        score = 1;
      }
      else {
        score = 0;
      }
    }

    // Has answered through auto-check in a previous session
    if (hasCheckedAnswer && params.behaviour.autoCheck) {

      // Check answers if answer has been given or max score reached
      if (params.behaviour.singleAnswer || score === self.getMaxScore()) {
        checkAnswer();
      }
      else {
        // Show feedback for checked checkboxes
        self.showCheckSolution(true);
      }
    }

    this.setViewState(this.previousState.viewState || 'task');
    if (this.viewState === 'results') {
      this.handleCheckAnswer({ skipXAPI: true });
    }
    else if (this.viewState === 'solutions') {
      this.handleCheckAnswer({ skipXAPI: true });
      this.handleShowSolution();
    }
  };

  this.showAllSolutions = function () {
    if (solutionsVisible) {
      return;
    }
    solutionsVisible = true;

    $myDom.find('.h5p-answer').each(function (i, e) {
      var $e = $(e);
      var a = params.answers[i];
      if (a.correct) {
        $e.addClass('h5p-should').append($('<span/>', {
          'class': 'h5p-solution-icon',
          html: params.UI.shouldCheck + '.'
        }));
      }
      else {
        $e.addClass('h5p-should-not').append($('<span/>', {
          'class': 'h5p-solution-icon',
          html: params.UI.shouldNotCheck + '.'
        }));
      }
    }).find('.h5p-question-plus-one, .h5p-question-minus-one').remove();

    // Make sure input is disabled in solution mode
    disableInput();

    // Move focus back to the first correct alternative so that the user becomes
    // aware that the solution is being shown.
    $myDom.find('.h5p-answer.h5p-should').first().focus();

    //Hide buttons and retry depending on settings.
    self.hideButton('check-answer');
    self.hideButton('show-solution');
    if (params.behaviour.enableRetry) {
      self.showButton('try-again');
    }
    self.trigger('resize');
  };

  /**
   * Used in contracts.
   * Shows the solution for the task and hides all buttons.
   */
  this.showSolutions = function () {
    removeFeedbackDialog();
    self.showCheckSolution();
    self.showAllSolutions();
    disableInput();
    self.hideButton('try-again');
  };

  /**
   * Hide solution for the given answer(s)
   *
   * @private
   * @param {H5P.jQuery} $answer
   */
  var hideSolution = function ($answer) {
    $answer
      .removeClass('h5p-correct')
      .removeClass('h5p-wrong')
      .removeClass('h5p-should')
      .removeClass('h5p-should-not')
      .removeClass('h5p-has-feedback')
      .find('.h5p-question-plus-one, .h5p-question-minus-one, .h5p-answer-icon, .h5p-solution-icon, .h5p-feedback-dialog').remove();
  };

  /**
   *
   */
  this.hideSolutions = function () {
    solutionsVisible = false;

    hideSolution($('.h5p-answer', $myDom));

    this.removeFeedback(); // Reset feedback

    self.trigger('resize');
  };

  /**
   * Resets the whole task.
   * Used in contracts with integrated content.
   * @private
   */
  this.resetTask = function () {
    this.setViewState('task');

    self.answered = false;
    instances = [];
    instancesToLoad = params.answers.length;
    highestAlternative = null;
    highestAlternativeStyle = null;
    alternatives = null;
    self.hideSolutions();
    params.userAnswers = [];
    removeSelections();
    self.showButton('check-answer');
    self.hideButton('try-again');
    self.hideButton('show-solution');
    enableInput();
    $myDom.find('.h5p-feedback-available').remove();
  };

  var calculateMaxScore = function () {
    if (blankIsCorrect) {
      return params.weight;
    }
    var maxScore = 0;
    for (var i = 0; i < params.answers.length; i++) {
      var choice = params.answers[i];
      if (choice.correct) {
        maxScore += (choice.weight !== undefined ? choice.weight : 1);
      }
    }
    return maxScore;
  };

  this.getMaxScore = function () {
    return (!params.behaviour.singleAnswer && !params.behaviour.singlePoint ? calculateMaxScore() : params.weight);
  };

  /**
   * Check answer.
   * @param {object} [options = {}] Parameters.
   * @param {boolean} [options.skipXAPI = false] If true, don't trigger xAPI.
   */
  var checkAnswer = function (options) {
    options = options || {};

    // Unbind removal of feedback dialogs on click
    $myDom.unbind('click', removeFeedbackDialog);

    // Remove all tip dialogs
    removeFeedbackDialog();

    if (params.behaviour.enableSolutionsButton) {
      self.showButton('show-solution');
    }
    if (params.behaviour.enableRetry) {
      self.showButton('try-again');
    }
    self.hideButton('check-answer');

    self.showCheckSolution();
    disableInput();

    if (!options.skipXAPI) {
      var xAPIEvent = self.createXAPIEventTemplate('answered');
      addQuestionToXAPI(xAPIEvent);
      addResponseToXAPI(xAPIEvent);
      self.trigger(xAPIEvent);
    }
  };

  /**
   * Determine if any of the radios or checkboxes have been checked.
   *
   * @return {boolean}
   */
  var isAnswerSelected = function () {
    return !!$('.h5p-answer[aria-checked="true"]', $myDom).length;
  };

  /**
   * Adds the ui buttons.
   * @private
   */
  var addButtons = function () {
    var $content = $('[data-content-id="' + self.contentId + '"].h5p-content');
    var $containerParents = $content.parents('.h5p-container');

    // select find container to attach dialogs to
    var $container;
    if($containerParents.length !== 0) {
      // use parent highest up if any
      $container = $containerParents.last();
    }
    else if($content.length !== 0){
      $container = $content;
    }
    else  {
      $container = $(document.body);
    }

    // Show solution button
    self.addButton('show-solution', params.UI.showSolutionButton, function () {
      self.handleShowSolution();
    }, false, {
      'aria-label': params.UI.a11yShowSolution,
    });

    // Check solution button
    if (params.behaviour.enableCheckButton && (!params.behaviour.autoCheck || !params.behaviour.singleAnswer)) {
      self.addButton('check-answer', params.UI.checkAnswerButton,
        function () {
          self.handleCheckAnswer();
        },
        true,
        {
          'aria-label': params.UI.a11yCheck,
        },
        {
          confirmationDialog: {
            enable: params.behaviour.confirmCheckDialog,
            l10n: params.confirmCheck,
            instance: self,
            $parentElement: $container
          }
        }
      );
    }

    // Try Again button
    self.addButton('try-again', params.UI.tryAgainButton, function () {
      self.resetTask();

      if (params.behaviour.randomAnswers) {
        // reshuffle answers
       var oldIdMap = idMap;
       idMap = getShuffleMap();
       var answersDisplayed = $myDom.find('.h5p-answer');
       // remember tips
       var tip = [];
       for (i = 0; i < answersDisplayed.length; i++) {
         tip[i] = $(answersDisplayed[i]).find('.h5p-multichoice-tipwrap');
       }
       // Those two loops cannot be merged or you'll screw up your tips
       for (i = 0; i < answersDisplayed.length; i++) {
         // move tips and answers on display
         const inner = $(answersDisplayed[i]).find('.h5p-alternative-inner').get(0);
         inner.innerHTML = '';

         appendAlternatives(inner, params.answerType, params.answers[i]);

         $(tip[i]).detach().appendTo($(answersDisplayed[idMap.indexOf(oldIdMap[i])]).find('.h5p-alternative-container'));
       }
     }
    }, false, {
      'aria-label': params.UI.a11yRetry,
    }, {
      confirmationDialog: {
        enable: params.behaviour.confirmRetryDialog,
        l10n: params.confirmRetry,
        instance: self,
        $parentElement: $container
      }
    });
  };

  /**
   * @private
   */
  var insertFeedback = function ($e, feedback) {
    // Add visuals
    addFeedback($e, feedback);

    // Add button for readspeakers
    var $wrap = $('<div/>', {
      'class': 'h5p-hidden-read h5p-feedback-available',
      'aria-label': params.UI.feedbackAvailable + '.'
    });
    $('<div/>', {
      'role': 'button',
      'tabindex': 0,
      'aria-label': params.UI.readFeedback + '.',
      appendTo: $wrap,
      on: {
        keydown: function (e) {
          if (e.which === 32) { // Space
            self.read(feedback);
            return false;
          }
        }
      }
    });
    $wrap.appendTo($e);
  };

  /**
   * Determine which feedback text to display
   *
   * @param {number} score
   * @param {number} max
   * @return {string}
   */
  var getFeedbackText = function (score, max) {
    var ratio = (score / max);

    var feedback = H5P.Question.determineOverallFeedback(params.overallFeedback, ratio);

    return feedback.replace('@score', score).replace('@total', max);
  };

  /**
   * Shows feedback on the selected fields.
   * @public
   * @param {boolean} [skipFeedback] Skip showing feedback if true
   */
  this.showCheckSolution = function (skipFeedback) {
    var scorePoints;
    if (!(params.behaviour.singleAnswer || params.behaviour.singlePoint || !params.behaviour.showScorePoints)) {
      scorePoints = new H5P.Question.ScorePoints();
    }

    $myDom.find('.h5p-answer').each(function (i, e) {
      var $e = $(e);
      var a = params.answers[i];
      var chosen = ($e.attr('aria-checked') === 'true');
      if (chosen) {
        if (a.correct) {
          // May already have been applied by instant feedback
          if (!$e.hasClass('h5p-correct')) {
            $e.addClass('h5p-correct').append($('<span/>', {
              'class': 'h5p-answer-icon',
              html: params.UI.correctAnswer + '.'
            }));
          }
        }
        else {
          if (!$e.hasClass('h5p-wrong')) {
            $e.addClass('h5p-wrong').append($('<span/>', {
              'class': 'h5p-answer-icon',
              html: params.UI.wrongAnswer + '.'
            }));
          }
        }

        if (scorePoints) {
          var alternativeContainer = $e[0].querySelector('.h5p-alternative-container');

          if (!params.behaviour.autoCheck || alternativeContainer.querySelector('.h5p-question-plus-one, .h5p-question-minus-one') === null) {
            alternativeContainer.appendChild(scorePoints.getElement(a.correct));
          }
        }
      }

      if (!skipFeedback) {
        if (chosen && a.tipsAndFeedback.chosenFeedback !== undefined && a.tipsAndFeedback.chosenFeedback !== '') {
          insertFeedback($e, a.tipsAndFeedback.chosenFeedback);
        }
        else if (!chosen && a.tipsAndFeedback.notChosenFeedback !== undefined && a.tipsAndFeedback.notChosenFeedback !== '') {
          insertFeedback($e, a.tipsAndFeedback.notChosenFeedback);
        }
      }
    });

    // Determine feedback
    var max = self.getMaxScore();

    // Disable task if maxscore is achieved
    var fullScore = (score === max);

    if (fullScore) {
      self.hideButton('check-answer');
      self.hideButton('try-again');
      self.hideButton('show-solution');
    }

    // Show feedback
    if (!skipFeedback) {
      this.setFeedback(getFeedbackText(score, max), score, max, params.UI.scoreBarLabel);
    }

    self.trigger('resize');
  };

  /**
   * Disables choosing new input.
   */
  var disableInput = function () {
    $('.h5p-answer', $myDom).attr({
      'aria-disabled': 'true',
      'tabindex': '-1'
    });
  };

  /**
   * Enables new input.
   */
  var enableInput = function () {
    $('.h5p-answer', $myDom).attr('aria-disabled', 'false');
  };

  var calcScore = function () {
    score = 0;
    params.userAnswers = [];
    $('.h5p-answer', $myDom).each(function (idx, el) {
      var $el = $(el);
      if ($el.attr('aria-checked') === 'true') {
        var choice = params.answers[idx];
        var weight = (choice.weight !== undefined ? choice.weight : 1);
        if (choice.correct) {
          score += weight;
        }
        else {
          score -= weight;
        }
        var num = parseInt($(el).data('id'));
        params.userAnswers.push(num);
      }
    });
    if (score < 0) {
      score = 0;
    }
    if (!params.userAnswers.length && blankIsCorrect) {
      score = params.weight;
    }
    if (params.behaviour.singlePoint) {
      score = (100 * score / calculateMaxScore()) >= params.behaviour.passPercentage ? params.weight : 0;
    }
  };

  /**
   * Removes selections from task.
   */
  var removeSelections = function () {
    var $answers = $('.h5p-answer', $myDom)
      .removeClass('h5p-selected')
      .attr('aria-checked', 'false');

    if (!params.behaviour.singleAnswer) {
      $answers.attr('tabindex', '0');
    }
    else {
      $answers.first().attr('tabindex', '0');
    }

    // Set focus to first option
    $answers.first().focus();

    calcScore();
  };

  /**
   * Get xAPI data.
   * Contract used by report rendering engine.
   *
   * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-6}
   */
  this.getXAPIData = function(){
    var xAPIEvent = this.createXAPIEventTemplate('answered');
    addQuestionToXAPI(xAPIEvent);
    addResponseToXAPI(xAPIEvent);
    return {
      statement: xAPIEvent.data.statement
    };
  };

  /**
   * Add the question itself to the definition part of an xAPIEvent
   */
  var addQuestionToXAPI = function (xAPIEvent) {
    var definition = xAPIEvent.getVerifiedStatementValue(['object', 'definition']);
    definition.description = {
      // Remove tags, must wrap in div tag because jQuery 1.9 will crash if the string isn't wrapped in a tag.
      'en-US': $('<div>' + params.question + '</div>').text()
    };
    definition.type = 'http://adlnet.gov/expapi/activities/cmi.interaction';
    definition.interactionType = 'choice';
    definition.correctResponsesPattern = [];
    definition.choices = [];
    for (var i = 0; i < params.answers.length; i++) {
      definition.choices[i] = {
        'id': params.answers[i].originalOrder + '',
        'description': {
          // Remove tags, must wrap in div tag because jQuery 1.9 will crash if the string isn't wrapped in a tag.
          'en-US': $('<div>' + params.answers[i].text + '</div>').text()
        }
      };
      if (params.answers[i].correct) {
        if (!params.singleAnswer) {
          if (definition.correctResponsesPattern.length) {
            definition.correctResponsesPattern[0] += '[,]';
            // This looks insane, but it's how you separate multiple answers
            // that must all be chosen to achieve perfect score...
          }
          else {
            definition.correctResponsesPattern.push('');
          }
          definition.correctResponsesPattern[0] += params.answers[i].originalOrder;
        }
        else {
          definition.correctResponsesPattern.push('' + params.answers[i].originalOrder);
        }
      }
    }
  };

  /**
   * Add the response part to an xAPI event
   *
   * @param {H5P.XAPIEvent} xAPIEvent
   *  The xAPI event we will add a response to
   */
  var addResponseToXAPI = function (xAPIEvent) {
    var maxScore = self.getMaxScore();
    var success = (100 * score / maxScore) >= params.behaviour.passPercentage;

    xAPIEvent.setScoredResult(score, maxScore, self, true, success);
    if (params.userAnswers === undefined) {
      calcScore();
    }

    // Add the response
    var response = '';
    for (var i = 0; i < params.userAnswers.length; i++) {
      if (response !== '') {
        response += '[,]';
      }
      response += idMap === undefined ? params.userAnswers[i] : idMap[params.userAnswers[i]];
    }
    xAPIEvent.data.statement.result.response = response;
  };

  /**
   * Create DOM
   * @param {object} params Parameters.
   * @param {string} params.answerType Answer type.
   * @param {string} params.role List role.
   * @param {string} params.label ARIA label.
   * @param {object[]} params.answers Answers.
   * @param {string} params.answers.role Item role.
   * @param {number} params.answers.tabindex Item's tabIndex.
   * @param {boolean} params.answers.checked True, if checked.
   * @param {string} params.answers.text Alternative text.
   */
  var createDOM = function(params) {
    const list = document.createElement('ul');
    list.classList.add('h5p-answers');
    list.classList.add('h5p-answer-type-' + params.answerType);
    list.setAttribute('role', params.role);
    list.setAttribute('aria-labelledby', params.label);

    const columns = computeNumberColumns(params.answerType, params.behaviour.columns);
    if (columns === 2) {
      list.classList.add('h5p-multi-columns-two');
    }

    for (let i = 0; i < params.answers.length; i++) {
      const listItem = document.createElement('li');
      listItem.classList.add('h5p-answer');
      listItem.setAttribute('role', params.answers[i].role);
      listItem.setAttribute('tabindex', params.answers[i].tabindex);
      listItem.setAttribute('aria-checked', params.answers[i].checked);
      listItem.setAttribute('data-id', i);
      list.appendChild(listItem);

      const container = document.createElement('div');
      container.classList.add('h5p-alternative-container');
      container.classList.add('h5p-multichoice-type-' + params.answerType);
      listItem.appendChild(container);

      const inner = document.createElement('span');
      inner.classList.add('h5p-alternative-inner');

      appendAlternatives(inner, params.answerType, params.answers[i]);

      container.appendChild(inner);

      const clearFix = document.createElement('div');
      clearFix.classList.add('h5p-clearfix');
      listItem.appendChild(clearFix);
    }

    return list;
  }

  /**
   * Append alternatives.
   *
   * @private
   * @param {HTMLElement} inner Element to attach to.
   * @param {string} answerType Answer type (text|audio|...).
   * @param {object} answer Parameters of current answer.
   */
  var appendAlternatives = function(inner, answerType, answer) {
    // Alternatives with more than just text
    if (answerType === 'image') {
      appendAlternativeImage(inner, answer.image);
    }
    else if (answerType === 'audio') {
      appendAlternativeAudio(inner, answer.audio);
    }
    else if (answerType === 'video') {
      appendAlternativeVideo(inner, answer.video);
    }
    else if (answerType === 'imageaudio') {
      appendAlternativeImage(inner, answer.image);
      if (answer.audio) {
        appendAlternativeAudio(inner, answer.audio);
      }
    }

    // Text alternative or text as amendment
    if (answerType === 'text' || answer.displayText) {
      appendAlternativeText(inner, answer.text);
    }
  }

  /**
   * Append text alternative.
   *
   * @private
   * @param {HTMLElement} inner Element to attach to.
   * @param {string} text HTML as <div> or <p>.
   */
  var appendAlternativeText = function(inner, text) {
    text = text || '';
    text = text.trim();

    let type;
    if (text.substr(0, 3) === '<p>') {
      type = 'p';
      text = text.substr(3, text.length - 7);
    }
    else if (text.substr(0, 5) === '<div>') {
      type = 'div';
      text = text.substr(5, text.length - 11);
    }
    else {
      type = 'div';
    }

    const innerElement = document.createElement(type);
    innerElement.classList.add('h5p-alternative-inner-text');
    innerElement.innerHTML = text;
    inner.appendChild(innerElement);
  }

  /**
   * Append image alternative.
   *
   * @private
   * @param {HTMLElement} inner Element to attach to.
   * @param {object} image Image parameters.
   */
  var appendAlternativeImage = function(inner, image) {
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('h5p-alternative-inner-image');
    inner.appendChild(imageWrapper);

    const instance = H5P.newRunnable(
      image,
      self.contentId,
      H5P.jQuery(imageWrapper),
      false
    );

    if (!instance.source) {
      instancesToLoad--;
    }

    instance.on('loaded', function () {
      instancesToLoad--;
      self.trigger('resize');
    });

    instance.$img.css('display', 'inline');
  }

  /**
   * Append audio alternative.
   *
   * @private
   * @param {HTMLElement} inner Element to attach to.
   * @param {object} audio Audio parameters.
   */
  var appendAlternativeAudio = function(inner, audio) {
    const audioWrapper = document.createElement('div');
    audioWrapper.classList.add('h5p-alternative-inner-audio');
    inner.appendChild(audioWrapper);

    const audioDefaults = {
      files: audio,
      playerMode: 'full',
      fitToWrapper: true,
      controls: true,
      audioNotSupported: params.UI.audioNotSupported
    }

    const instance = new H5P.Audio(audioDefaults, self.contentId, {});
    instance.attach(H5P.jQuery(audioWrapper));

    if (instance.audio) {
      instances.push(instance);

      instance.audio.style.display = 'inline';
      instance.audio.addEventListener('play', function() {
        muteInstances(instance);
      });
    }
  }

  /**
   * Append video alternative.
   *
   * @private
   * @param {HTMLElement} inner Element to attach to.
   * @param {object} video Video parameters.
   */
  var appendAlternativeVideo = function(inner, video) {
    const videoWrapper = document.createElement('div');
    videoWrapper.classList.add('h5p-alternative-inner-video');
    inner.appendChild(videoWrapper);

    const needsFit = (video && video.length > 0 && typeof video[0].mime === 'string' && video[0].mime.indexOf('YouTube') !== -1);

    const videoDefaults = {
      sources: video,
      visuals: {
        fit: false, // Prevent video from growing endlessly since height is unlimited
        controls: true
      }
    };

    const instance = new H5P.Video(videoDefaults, self.contentId, {});
    instance.attach(H5P.jQuery(videoWrapper));

    instances.push(instance);

    // Bubble resize events
    bubbleUp(instance, 'resize', self);

    // Resize children to fit inside parent
    bubbleDown(self, 'resize', instance);

    const videoElement = videoWrapper.querySelector('video');
    if (videoElement) {
      videoElement.style.display = 'inline';
    }

    instance.on('stateChange', function(state) {
      if (state.data === H5P.Video.PLAYING) {
        muteInstances(instance);
      }
    });

    // May be needed for resizing height
    if (!instance.video) {
      instancesToLoad--;
    }

    instance.on('loaded', function () {
      instancesToLoad--;
      self.trigger('resize');
    });
  }

  /**
   * Mute media instances.
   *
   * @private
   * @param {object} exception Instance of H5P content.
   */
  var muteInstances = function (exception) {
    instances
      .filter(function (instance) {
        return instance !== exception;
      })
      .forEach(function (instance) {
        if (typeof instance.pause === 'function') {
          instance.pause();
        }
      });
  }

  /**
   * Compute number of columns for display.
   *
   * @private
   * @param {string} answerType Answer type.
   * @param {string} columns Mode for choosing columns ('auto' || '1' || '2').
   * @return {number} Number of columns to use.
   */
  var computeNumberColumns = function(answerType, columns) {
    columns = parseInt(columns);
    if (!Number.isNaN(columns)) {
      return columns; // Numerical value set by author
    }

    if (answerType === 'image' || answerType === 'video' || answerType === 'imageaudio') {
      return 2;
    }

    return 1; // default
  }

  /**
   * Makes it easy to bubble events from child to parent
   *
   * @private
   * @param {Object} origin Origin of the Event
   * @param {string} eventName Name of the Event
   * @param {Object} target Target to trigger event on
   */
  var bubbleUp = function(origin, eventName, target) {
    origin.on(eventName, function (event) {
      // Prevent target from sending event back down
      target.bubblingUpwards = true;

      // Trigger event
      target.trigger(eventName, event);

      // Reset
      target.bubblingUpwards = false;
    });
  }

  /**
   * Makes it easy to bubble events from parent to children
   *
   * @private
   * @param {Object} origin Origin of the Event
   * @param {string} eventName Name of the Event
   * @param {object} target Targets to trigger event on
   */
  function bubbleDown(origin, eventName, target) {
    origin.on(eventName, function (event) {
      if (origin.bubblingUpwards) {
        return; // Prevent send event back down.
      }

      target.trigger(eventName, event);
    });
  }

  /**
   * Wait for DOM element to be attached to DOM.
   * @param {string} selector CSS selector for DOM element.
   * @param {function} success Function to call once element is attached.
   * @param {function} [error] Function to call if element wasn't found (in time).
   * @param {number} [tries=50] Number of maximum tries, negative for infinite.
   * @param {number} [interval=100] Time interval in ms to check for element.
   */
  var waitForDOM = function (selector, success, error, tries, interval) {
    error = error || function () {};
    tries = tries || 50;
    interval = interval || 100;

    if (tries === 0 || !selector || typeof success !== 'function' || typeof error !== 'function') {
      error();
      return;
    }

    // Try to keep sensible
    interval = Math.max(interval, 50);

    const content = document.querySelector(selector);
    if (!content) {
      setTimeout(function () {
        waitForDOM(selector, success, error, (tries < 0) ? -1 : tries - 1, interval);
      }, interval);
      return;
    }

    success();
  }

  /**
   * Set alternatives height depending on largest image. Required for multi column mode.
   */
  var setAlternativeHeight = function() {
    if (instancesToLoad > 0) {
      return;
    }

    if (!alternatives) {
      alternatives = document.querySelectorAll('.h5p-alternative-container.h5p-multichoice-type-image');

      // Workaround for Safari on LiveView
      if (alternatives.length) {
        alternatives.forEach(function (alternative) {
          const img = alternative.querySelector('img');
          if (img) {
            img.style.height = 'auto';
          }
        });
      }

      if (alternatives.length === 0) {
        alternatives = document.querySelectorAll('.h5p-alternative-container.h5p-multichoice-type-imageaudio');
      }
      if (alternatives.length === 0) {
        alternatives = document.querySelectorAll('.h5p-alternative-container.h5p-multichoice-type-video');
      }

      // Reset the height of all containers from potential previous attempt
      for (let i = 0; i < alternatives.length; i++) {
        alternatives[i].style.height = '';
      }
    }

    // Determine highest alternative's height if necessary
    // TODO: Would be smarter to do that per row
    if (!highestAlternative) {
      for (let i = 0; i < alternatives.length; i++) {
        highestAlternative = (!highestAlternative || highestAlternative.offsetHeight < alternatives[i].offsetHeight) ? alternatives[i] : highestAlternative;
      }
    }
    highestAlternativeStyle = highestAlternativeStyle || window.getComputedStyle(highestAlternative);

    // Set other alternatives height according to highest one
    for (let i = 0; i < alternatives.length; i++) {
      if (alternatives[i] !== highestAlternative) {
        alternatives[i].style.height = highestAlternativeStyle.getPropertyValue('height')
      }
    }
  }

  /**
   * Create a map pointing from original answers to shuffled answers
   *
   * @return {number[]} map pointing from original answers to shuffled answers
   */
  var getShuffleMap = function() {
    params.answers = H5P.shuffleArray(params.answers);

    // Create a map from the new id to the old one
    var idMap = [];
    for (i = 0; i < params.answers.length; i++) {
      idMap[i] = params.answers[i].originalOrder;
    }
    return idMap;
  };

  // Initialization code
  // Randomize order, if requested
  var idMap;
  // Store original order in answers
  for (i = 0; i < params.answers.length; i++) {
    params.answers[i].originalOrder = i;
  }
  if (params.behaviour.randomAnswers) {
    idMap = getShuffleMap();
  }

  // Start with an empty set of user answers.
  params.userAnswers = [];

  this.previousState = (contentData && contentData.previousState) ?
    contentData.previousState :
    {};

  // Restore answers
  if (this.previousState.answers) {
    if (!idMap) {
      params.userAnswers = this.previousState.answers;
    }
    else {
      // The answers have been shuffled, and we must use the id mapping.
      for (i = 0; i < this.previousState.answers.length; i++) {
        for (var k = 0; k < idMap.length; k++) {
          if (idMap[k] === this.previousState.answers[i]) {
            params.userAnswers.push(k);
          }
        }
      }
    }
  }

  var hasCheckedAnswer = false;

  // Loop through choices
  for (var j = 0; j < params.answers.length; j++) {
    var ans = params.answers[j];

    if (!params.behaviour.singleAnswer) {
      // Set role
      ans.role = 'checkbox';
      ans.tabindex = '0';
      if (params.userAnswers.indexOf(j) !== -1) {
        ans.checked = 'true';
        hasCheckedAnswer = true;
      }
    }
    else {
      // Set role
      ans.role = 'radio';

      // Determine tabindex, checked and extra classes
      if (params.userAnswers.length === 0) {
        // No correct answers
        if (i === 0 || i === params.answers.length) {
          ans.tabindex = '0';
        }
      }
      else if (params.userAnswers.indexOf(j) !== -1) {
        // This is the correct choice
        ans.tabindex = '0';
        ans.checked = 'true';
        hasCheckedAnswer = true;
      }
    }

    // Set default
    if (ans.tabindex === undefined) {
      ans.tabindex = '-1';
    }
    if (ans.checked === undefined) {
      ans.checked = 'false';
    }
  }

  H5P.MultiChoice.counter = (H5P.MultiChoice.counter === undefined ? 0 : H5P.MultiChoice.counter + 1);
  params.role = (params.behaviour.singleAnswer ? 'radiogroup' : 'group');
  params.label = 'h5p-mcq' + H5P.MultiChoice.counter;

  /**
   * Pack the current state of the interactivity into a object that can be
   * serialized.
   *
   * @public
   */
  this.getCurrentState = function () {
    var state = {};
    if (!idMap) {
      state.answers = params.userAnswers;
    }
    else {
      // The answers have been shuffled and must be mapped back to their
      // original ID.
      state.answers = [];
      for (var i = 0; i < params.userAnswers.length; i++) {
        state.answers.push(idMap[params.userAnswers[i]]);
      }
    }

    state.viewState = this.viewState;

    return state;
  };

  /**
   * Check if user has given an answer.
   *
   * @param {boolean} [ignoreCheck] Ignore returning true from pressing "check-answer" button.
   * @return {boolean} True if answer is given
   */
  this.getAnswerGiven = function (ignoreCheck) {
    var answered = ignoreCheck ? false : this.answered;
    return answered || params.userAnswers.length > 0 || blankIsCorrect;
  };

  this.getScore = function () {
    return score;
  };

  this.getTitle = function () {
    return H5P.createTitle((this.contentData && this.contentData.metadata && this.contentData.metadata.title) ? this.contentData.metadata.title : 'Multiple Choice');
  };

  /**
   * Handle the evaluation.
   * @param {object} [options] Parameters.
   * @param {boolean} [options.skipXAPI = false] If true, don't trigger xAPI.
   */
  this.handleCheckAnswer = function (options) {
    this.setViewState('results');

    this.answered = true;
    muteInstances();
    checkAnswer(options);
  };

  /**
   * Handle show solutions.
   */
  this.handleShowSolution = function () {
    this.setViewState('solutions');

    if (params.behaviour.showSolutionsRequiresInput && !isAnswerSelected()) {
      // Require answer before solution can be viewed
      this.updateFeedbackContent(params.UI.noInput);
      this.read(params.UI.noInput);
    }
    else {
      calcScore();
      this.showAllSolutions();
    }
  };

  /**
   * Set view state.
   * @param {string} state View state.
   */
  this.setViewState = function (state) {
    if (H5P.MultiChoice.VIEW_STATES.indexOf(state) === -1) {
      return;
    }

    // Kidsloop Live session storage will listen
    this.trigger('kllStoreSessionState', undefined, { bubbles: true, external: true });

    this.viewState = state;
  };
};

H5P.MultiChoice.prototype = Object.create(H5P.Question.prototype);
H5P.MultiChoice.prototype.constructor = H5P.MultiChoice;

/** @constant {string[]} view state names*/
H5P.MultiChoice.VIEW_STATES = ['task', 'results', 'solutions'];
