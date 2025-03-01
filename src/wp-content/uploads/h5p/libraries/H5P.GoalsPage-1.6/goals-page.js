var H5P = H5P || {};

/**
 * Goals Page module
 * @external {jQuery} $ H5P.jQuery
 */
H5P.GoalsPage = (function ($, EventDispatcher) {
  // CSS Classes:
  var MAIN_CONTAINER = 'h5p-goals-page';

  var goalCounter = 0;

  /**
   * Helper for resizing height of text area while typing (to avoid scrollbars)
   *
   * @param  {H5P.jQuery} $textarea
   */
  var autoResizeTextarea = function ($textarea) {
    var setHeight = function () {
      $textarea.css('height', Math.max($textarea[0].scrollHeight, 50) + 'px');
    };

    $textarea.on('input', function () {
      this.style.height = 'auto';
      setHeight();
    });

    setHeight();
  };

  /**
   * Initialize module.
   * @param {Object} params Behavior settings
   * @param {Number} id Content identification
   * @returns {Object} GoalsPage GoalsPage instance
   */
  function GoalsPage(params, id, extras) {
    EventDispatcher.call(this);
    this.id = id;
    this.extras = extras;

    // Set default behavior.
    this.params = $.extend({
      title: this.getTitle(),
      description: '',
      defineGoalText: 'Create a new goal',
      definedGoalLabel: 'User defined goal',
      defineGoalPlaceholder: 'Write here...',
      goalsAddedText: 'Number of goals added:',
      removeGoalText: 'Remove',
      helpTextLabel: 'Read more',
      helpText: 'Help text',
      goalDeletionConfirmation: {
        header: 'Confirm deletion',
        message: 'Are you sure you want to delete this goal?',
        cancelLabel: 'Cancel',
        confirmLabel: 'Confirm'
      }
    }, params);
  }

  GoalsPage.prototype = Object.create(EventDispatcher.prototype);
  GoalsPage.prototype.constructor = GoalsPage;

  /**
   * Attach function called by H5P framework to insert H5P content into page.
   *
   * @param {jQuery} $container The container which will be appended to.
   */
  GoalsPage.prototype.attach = function ($container) {
    var self = this;
    this.$inner = $('<div>', {
      'class': MAIN_CONTAINER
    }).appendTo($container);

    self.goalList = [];
    self.goalId = 0;

    var goalsTemplate =
      '<div class="page-header" role="heading" tabindex="-1">' +
      ' <div class="page-title">{{{title}}}</div>' +
      ' <button class="page-help-text">{{{helpTextLabel}}}</button>' +
      '</div>' +
      '<div class="goals-description">{{{description}}}</div>' +
      '<div class="goals-view"></div>' +
      '<div class="goals-counter"></div>' +
      '<div class="goals-define">' +
      '<div role="button" tabindex="0" class="joubel-simple-rounded-button goals-create" title="{{{defineGoalText}}}">' +
      ' <span class="joubel-simple-rounded-button-text">{{{defineGoalText}}}</span>' +
      '</div>' +
      '</div>';

    /*global Mustache */
    self.$inner.append(Mustache.render(goalsTemplate, self.params));
    self.$goalsView = $('.goals-view', self.$inner);
    self.$pageTitle = $('.page-header', self.$inner);
    self.$helpButton = $('.page-help-text', this.$inner);
    self.$createGoalButton = $('.goals-create', this.$inner);

    self.initHelpTextButton();
    self.initCreateGoalButton();
  };

  /**
   * Create button for creating goals
   */
  GoalsPage.prototype.initCreateGoalButton = function () {
    var self = this;

    // Create new goal on click
    H5P.DocumentationTool.handleButtonClick(self.$createGoalButton, function () {
      self.addGoal().find('.created-goal').focus();
      self.trigger('resize');
    });
  };

  /**
   * Adds a new goal to the page
   * @param {Object} competenceAim Optional competence aim which the goal will constructed from
   * @return {jQuery} $newGoal New goal element
   */
  GoalsPage.prototype.addGoal = function (competenceAim) {
    var self = this;
    goalCounter++;

    var goalText = self.params.defineGoalPlaceholder;
    var goalTypeDescription = self.params.definedGoalLabel;

    // Use predefined goal
    if (competenceAim !== undefined) {
      goalText = competenceAim.value;
      goalTypeDescription = competenceAim.description;
    }

    var newGoal = new H5P.GoalsPage.GoalInstance(goalText, self.goalId, goalTypeDescription);
    self.goalList.push(newGoal);
    self.goalId += 1;

    // Create goal element and append it to view
    var $newGoal = this.createNewGoal(newGoal).appendTo(self.$goalsView);

    self.updateGoalsCounter();

    return $newGoal;
  };

  /**
   * Remove chosen goal from the page
   * @param {jQuery} $goalContainer
   */
  GoalsPage.prototype.removeGoal = function ($goalContainer) {
    var goalInstance = this.getGoalInstanceFromUniqueId($goalContainer.data('uniqueId'));

    if (this.goalList.indexOf(goalInstance) > -1) {
      this.goalList.splice(this.goalList.indexOf(goalInstance), 1);
    }
    $goalContainer.remove();
    this.updateGoalsCounter();
    this.trigger('resize');
  };

  /**
   * Updates goal counter on page with amount of chosen goals.
   */
  GoalsPage.prototype.updateGoalsCounter = function () {
    var self = this;
    var $goalCounterContainer = $('.goals-counter', self.$inner);
    $goalCounterContainer.children().remove();
    if (self.goalList.length) {
      $('<span>', {
        'class': 'goals-counter-text',
        'html': self.params.goalsAddedText + ' ' + self.goalList.length,
        'aria-live': 'polite'
      }).appendTo($goalCounterContainer);
    }
  };

  /**
   * Returns the goal instance matching provided id
   * @param {Number} goalInstanceUniqueId Id matching unique id of target goal
   * @returns {H5P.GoalsPage.GoalInstance|Number} Returns matching goal instance or -1 if not found
   */
  GoalsPage.prototype.getGoalInstanceFromUniqueId = function (goalInstanceUniqueId) {
    var foundInstance = -1;
    this.goalList.forEach(function (goalInstance) {
      if (goalInstance.getUniqueId() === goalInstanceUniqueId) {
        foundInstance = goalInstance;
      }
    });

    return foundInstance;
  };

  /**
   * Create help text functionality for reading more about the task
   */
  GoalsPage.prototype.initHelpTextButton = function () {
    var self = this;

    if (this.params.helpText !== undefined && this.params.helpText.length) {
      // Init help button
      self.$helpButton.on('click', function () {
        self.trigger('open-help-dialog', {
          'aria-label': self.params.title,
          title: self.params.title,
          helpText: self.params.helpText
        });
      });
    }
    else {
      self.$helpButton.remove();
    }
  };

  /**
   * Create a new goal container
   * @param {H5P.GoalsPage.GoalInstance} goalInstance Goal instance object to create the goal from
   * @returns {jQuery} New goal element
   */
  GoalsPage.prototype.createNewGoal = function (goalInstance) {
    var self = this;

    // Goal container
    var $goalContainer = $('<div/>', {
      'class': 'created-goal-container',
    }).data('uniqueId', goalInstance.getUniqueId());

    var initialText = goalInstance.goalText();

    var id = 'created-goal-' + goalCounter + '-' + goalInstance.getUniqueId();

    // Input paragraph area
    var $goalInputArea = $('<textarea>', {
      'class': 'created-goal',
      'spellcheck': 'false',
      'placeholder': initialText,
      'title': goalInstance.getGoalTypeDescription(),
      'id': id
    }).appendTo($goalContainer);

    // Need to tell world I might need to resize
    $goalInputArea.on('blur keyup paste input', function () {
      self.trigger('resize');
    });

    // Save the value
    $goalInputArea.on('blur', function () {
      goalInstance.goalText($goalInputArea.val());
      var xAPIEvent = self.createXAPIEventTemplate('interacted');
      self.addQuestionToxAPI(xAPIEvent);
      self.addResponseToxAPI(xAPIEvent);
      self.trigger(xAPIEvent);
    });

    autoResizeTextarea($goalInputArea);

    // Add remove button
    this.createRemoveGoalButton(this.params.removeGoalText, id, $goalContainer).appendTo($goalContainer);

    return $goalContainer;
  };

  /**
   * Creates a button for removing the given container
   * @param {String} text String to display on the button
   * @param {jQuery} $removeContainer Container that will be removed upon click
   * @returns {jQuery} $removeGoalButton The button
   */
  GoalsPage.prototype.createRemoveGoalButton = function (text, textAreaId, $removeContainer) {
    var self = this;
    var $removeGoalButton = $('<button>', {
      'class': 'h5p-created-goal-remove h5p-goals-button',
      'title': text,
      'aria-describedby': textAreaId,
      click: function () {
        var confirmationDialog = new H5P.ConfirmationDialog({
          headerText: self.params.goalDeletionConfirmation.header,
          dialogText: self.params.goalDeletionConfirmation.message,
          cancelText: self.params.goalDeletionConfirmation.cancelLabel,
          confirmText: self.params.goalDeletionConfirmation.confirmLabel
        });

        confirmationDialog.on('confirmed', function () {
          self.removeGoal($removeContainer);
          // Set focus to add new goal button
          self.$createGoalButton.focus();
        });

        confirmationDialog.appendTo(self.$inner.closest('.h5p-documentation-tool').get(0));
        confirmationDialog.show();
      }
    });

    return $removeGoalButton;
  };

  /**
   * Get page title
   * @returns {String} Page title
   */
  GoalsPage.prototype.getTitle = function () {
    return H5P.createTitle((this.extras && this.extras.metadata && this.extras.metadata.title) ? this.extras.metadata.title : 'Goals');
  };

  /**
   * Get goal list
   * @returns {Array} Goal list
   */
  GoalsPage.prototype.getGoals = function () {
    return this.goalList;
  };

  /**
   * Sets focus on page
   */
  GoalsPage.prototype.focus = function () {
    this.$pageTitle.focus();
  };

  /**
   * Get xAPI data.
   * Contract used by report rendering engine.
   *
   * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-6}
   */
  GoalsPage.prototype.getXAPIData = function () {
    var XAPIEvent = this.createXAPIEventTemplate('answered');
    this.addQuestionToxAPI(XAPIEvent);
    this.addResponseToxAPI(XAPIEvent);
    return {
      statement: XAPIEvent.data.statement
    };
  };

  /**
    * Trigger xAPI answered event
    */
  GoalsPage.prototype.triggerAnswered = function () {
    var xAPIEvent = this.createXAPIEventTemplate('answered');
    this.addQuestionToXAPI(xAPIEvent);
    this.addResponseToXAPI(xAPIEvent);
    this.trigger(xAPIEvent);
  };

  /**
   * Add the question itself to the definition part of an xAPIEvent
   */
  GoalsPage.prototype.addQuestionToxAPI = function (xAPIEvent) {
    var definition = xAPIEvent.getVerifiedStatementValue(['object', 'definition']);
    $.extend(definition, this.getxAPIDefinition());
  };

  /**
   * Generate xAPI object definition used in xAPI statements.
   * @return {Object}
   */
  GoalsPage.prototype.getxAPIDefinition = function () {
    var definition = {};
    var self = this;
    definition.description = {
      'en-US': self.params.definedGoalLabel
    };
    definition.type = 'http://adlnet.gov/expapi/activities/cmi.interaction';
    definition.interactionType = 'fill-in';
    definition.correctResponsesPattern = '';
    definition.extensions = {
      'https://h5p.org/x-api/h5p-local-content-id': self.id,
      'https://h5p.org/x-api/h5p-machine-name': 'H5P.GoalsPage'
    };

    return definition;
  };

  /**
   * Add the response part to an xAPI event
   *
   * @param {H5P.XAPIEvent} xAPIEvent
   *  The xAPI event we will add a response to
   */
  GoalsPage.prototype.addResponseToxAPI = function (xAPIEvent) {
    xAPIEvent.data.statement.result = {};
    xAPIEvent.data.statement.result.response = this.getXAPIResponse();
  };

  /**
   * Generate xAPI user response, used in xAPI statements.
   * @return {string} User answers separated by the "[,]" pattern
   */
  GoalsPage.prototype.getXAPIResponse = function () {
    return this.getGoals().map(function (goal) {
      return goal.text;
    }).join('[,]');
  };

  return GoalsPage;
}(H5P.jQuery, H5P.EventDispatcher));
