H5P.MemoryGame = (function (EventDispatcher, $) {

  // We don't want to go smaller than 100px per card(including the required margin)
  var CARD_MIN_SIZE = 100; // PX
  var CARD_STD_SIZE = 116; // PX
  var STD_FONT_SIZE = 16; // PX
  var LIST_PADDING = 1; // EMs
  var numInstances = 0;

  /**
   * Memory Game Constructor
   *
   * @class H5P.MemoryGame
   * @extends H5P.EventDispatcher
   * @param {Object} parameters
   * @param {Number} id
   */
  function MemoryGame(parameters, id, extras) {
    /** @alias H5P.MemoryGame# */
    var self = this;

    // Initialize event inheritance
    EventDispatcher.call(self);

    self.timer = null;
    self.counter = null;

    self.previousState = (extras && extras.previousState) ?
      extras.previousState :
      {};

    var flipped, popup, $bottom, $taskComplete, $feedback, $wrapper, audioCard;
    this.cards = [];
    var flipBacks = []; // Que of cards to be flipped back
    var numFlipped = 0;
    var removed = 0;
    numInstances++;

    // Add defaults
    parameters = $.extend(true, {
      behaviour: {
        ratio: {},
        keepLayout: false
      },
      l10n: {
        cardTurns: 'Card turns',
        timeSpent: 'Time spent',
        feedback: 'Good work!',
        tryAgain: 'Reset',
        closeLabel: 'Close',
        label: 'Memory Game. Find the matching cards.',
        done: 'All of the cards have been found.',
        cardPrefix: 'Card %num: ',
        cardUnturned: 'Unturned.',
        cardMatched: 'Match found.'
      }
    }, parameters);

    this.parameters = parameters;

    /**
     * Check if these two cards belongs together.
     *
     * @private
     * @param {H5P.MemoryGame.Card} card
     * @param {H5P.MemoryGame.Card} mate
     * @param {H5P.MemoryGame.Card} correct
     */
    var check = function (card, mate, correct) {
      if (mate !== correct) {
        // Incorrect, must be scheduled for flipping back
        flipBacks.push(card);
        flipBacks.push(mate);

        // Wait for next click to flip them back…
        if (numFlipped > 2) {
          // or do it straight away
          processFlipBacks();
        }
        return;
      }

      // Update counters
      numFlipped -= 2;
      removed += 2;

      var isFinished = (removed === self.cards.length);

      // Remove them from the game.
      card.remove(!isFinished);
      mate.remove();

      var desc = card.getDescription();
      if (desc !== undefined) {
        // Pause timer and show desciption.
        self.timer.pause();
        var imgs = [card.getImage()];
        if (card.hasTwoImages) {
          imgs.push(mate.getImage());
        }
        popup.show(desc, imgs, cardStyles ? cardStyles.back : undefined, function (refocus) {
          if (isFinished) {
            // Game done
            card.makeUntabbable();
            finished();
          }
          else {
            // Popup is closed, continue.
            self.timer.play();

            if (refocus) {
              card.setFocus();
            }
          }
        });
      }
      else if (isFinished) {
        // Game done
        card.makeUntabbable();
        finished();
      }
    };

    /**
     * Game has finished!
     * @private
     */
    var finished = function (params) {
      params = params || {};

      self.timer.stop();
      $taskComplete.show();
      $feedback.addClass('h5p-show'); // Announce
      $bottom.focus();

      if (!params.skipXAPI) {
        // Create and trigger xAPI event 'completed'
        var completedEvent = self.createXAPIEventTemplate('completed');
        completedEvent.setScoredResult(1, 1, self, true, true);
        completedEvent.data.statement.result.duration = 'PT' + (Math.round(self.timer.getTime() / 10) / 100) + 'S';
        self.trigger(completedEvent);
      }

      if (parameters.behaviour && parameters.behaviour.allowRetry) {
        // Create retry button
        var retryButton = createButton('reset', parameters.l10n.tryAgain || 'Reset', function () {
          // Trigger handler (action)

          retryButton.classList.add('h5p-memory-transout');
          setTimeout(function () {
            // Remove button on nextTick to get transition effect
            $wrapper[0].removeChild(retryButton);
          }, 300);

          resetGame();
        });
        retryButton.classList.add('h5p-memory-transin');
        setTimeout(function () {
          // Remove class on nextTick to get transition effectupd
          retryButton.classList.remove('h5p-memory-transin');
        }, 0);

        // Same size as cards
        retryButton.style.fontSize = (parseFloat($wrapper.children('ul')[0].style.fontSize) * 0.75) + 'px';

        $wrapper[0].appendChild(retryButton); // Add to DOM
      }
    };

    /**
     * Shuffle the cards and restart the game!
     * @private
     */
    var resetGame = function () {
      self.previousState = {};

      // Reset cards
      removed = 0;

      // Remove feedback
      $feedback[0].classList.remove('h5p-show');
      $taskComplete.hide();

      // Reset timer and counter
      self.timer.reset();
      self.counter.reset();

      // Randomize cards
      H5P.shuffleArray(this.cards);

      setTimeout(function () {
        // Re-append to DOM after flipping back
        for (var i = 0; i < self.cards.length; i++) {
          self.cards[i].reAppend();
        }
        for (var j = 0; j < self.cards.length; j++) {
          self.cards[j].reset();
        }

        // Scale new layout
        $wrapper.children('ul').children('.h5p-row-break').removeClass('h5p-row-break');
        self.trigger('resize');
        self.cards[0].setFocus();
      }, 600);

      self.trigger('kllStoreSessionState', undefined, { bubbles: true, external: true });
    };

    /**
     * Game has finished!
     * @private
     */
    var createButton = function (name, label, action) {
      var buttonElement = document.createElement('div');
      buttonElement.classList.add('h5p-memory-' + name);
      buttonElement.innerHTML = label;
      buttonElement.setAttribute('role', 'button');
      buttonElement.tabIndex = 0;
      buttonElement.addEventListener('click', function () {
        action.apply(buttonElement);
      }, false);
      buttonElement.addEventListener('keypress', function (event) {
        if (event.which === 13 || event.which === 32) { // Enter or Space key
          event.preventDefault();
          action.apply(buttonElement);
        }
      }, false);
      return buttonElement;
    };

    /**
     * Adds card to card list and set up a flip listener.
     *
     * @private
     * @param {H5P.MemoryGame.Card} card
     * @param {H5P.MemoryGame.Card} mate
     */
    var addCard = function (card, mate) {
      card.on('flip', function () {
        if (audioCard) {
          audioCard.stopAudio();
        }

        // Always return focus to the card last flipped
        for (var i = 0; i < self.cards.length; i++) {
          self.cards[i].makeUntabbable();
        }
        card.makeTabbable();

        popup.close();
        self.triggerXAPI('interacted');
        // Keep track of time spent
        self.timer.play();

        // Keep track of the number of flipped cards
        numFlipped++;

        // Announce the card unless it's the last one and it's correct
        var isMatched = (flipped === mate);
        var isLast = ((removed + 2) === self.cards.length);
        card.updateLabel(isMatched, !(isMatched && isLast));

        if (flipped !== undefined) {
          var matie = flipped;
          // Reset the flipped card.
          flipped = undefined;

          setTimeout(function () {
            check(card, matie, mate);
          }, 800);
        }
        else {
          if (flipBacks.length > 1) {
            // Turn back any flipped cards
            processFlipBacks();
          }

          // Keep track of the flipped card.
          flipped = card;
        }

        // Count number of cards turned
        self.counter.increment();

        self.trigger('kllStoreSessionState', undefined, { bubbles: true, external: true });
      });
      card.on('audioplay', function () {
        if (audioCard) {
          audioCard.stopAudio();
        }
        audioCard = card;
      });
      card.on('audiostop', function () {
        audioCard = undefined;
      });

      /**
       * Create event handler for moving focus to the next or the previous
       * card on the table.
       *
       * @private
       * @param {number} direction +1/-1
       * @return {function}
       */
      var createCardChangeFocusHandler = function (direction) {
        return function () {
          // Locate next card
          for (var i = 0; i < self.cards.length; i++) {
            if (self.cards[i] === card) {
              // Found current card

              var nextCard, fails = 0;
              do {
                fails++;
                nextCard = self.cards[i + (direction * fails)];
                if (!nextCard) {
                  return; // No more cards
                }
              }
              while (nextCard.isRemoved());

              card.makeUntabbable();
              nextCard.setFocus();

              return;
            }
          }
        };
      };

      // Register handlers for moving focus to next and previous card
      card.on('next', createCardChangeFocusHandler(1));
      card.on('prev', createCardChangeFocusHandler(-1));

      /**
       * Create event handler for moving focus to the first or the last card
       * on the table.
       *
       * @private
       * @param {number} direction +1/-1
       * @return {function}
       */
      var createEndCardFocusHandler = function (direction) {
        return function () {
          var focusSet = false;
          for (var i = 0; i < self.cards.length; i++) {
            var j = (direction === -1 ? self.cards.length - (i + 1) : i);
            if (!focusSet && !self.cards[j].isRemoved()) {
              self.cards[j].setFocus();
              focusSet = true;
            }
            else if (self.cards[j] === card) {
              card.makeUntabbable();
            }
          }
        };
      };

      // Register handlers for moving focus to first and last card
      card.on('first', createEndCardFocusHandler(1));
      card.on('last', createEndCardFocusHandler(-1));

      self.cards.push(card);
    };

    /**
     * Will flip back two and two cards
     */
    var processFlipBacks = function () {
      flipBacks[0].flipBack();
      flipBacks[1].flipBack();
      flipBacks.splice(0, 2);
      numFlipped -= 2;

      self.trigger('kllStoreSessionState', undefined, { bubbles: true, external: true });
    };

    /**
     * @private
     */
    var getCardsToUse = function () {
      var numCardsToUse = (parameters.behaviour && parameters.behaviour.numCardsToUse ? parseInt(parameters.behaviour.numCardsToUse) : 0);
      if (numCardsToUse <= 2 || numCardsToUse >= parameters.cards.length) {
        // Use all cards
        return parameters.cards;
      }

      // Pick random cards from pool
      var cardsToUse = [];
      var pickedCardsMap = {};

      var numPicket = 0;
      while (numPicket < numCardsToUse) {
        var pickIndex = Math.floor(Math.random() * parameters.cards.length);
        if (pickedCardsMap[pickIndex]) {
          continue; // Already picked, try again!
        }

        cardsToUse.push(parameters.cards[pickIndex]);
        pickedCardsMap[pickIndex] = true;
        numPicket++;
      }

      return cardsToUse;
    };

    var cardStyles, invertShades;
    if (parameters.lookNFeel) {
      // If the contrast between the chosen color and white is too low we invert the shades to create good contrast
      invertShades = (parameters.lookNFeel.themeColor &&
                      getContrast(parameters.lookNFeel.themeColor) < 1.7 ? -1 : 1);
      var backImage = (parameters.lookNFeel.cardBack ? H5P.getPath(parameters.lookNFeel.cardBack.path, id) : null);
      cardStyles = MemoryGame.Card.determineStyles(parameters.lookNFeel.themeColor, invertShades, backImage);
    }

    // Initialize cards.
    var cardsToUse = getCardsToUse();
    let cardId = 0;

    for (var i = 0; i < cardsToUse.length; i++) {
      var cardParams = cardsToUse[i];
      if (MemoryGame.Card.isValid(cardParams)) {
        // Create first card
        var cardTwo, cardOne = new MemoryGame.Card(cardId, cardParams.image, id, cardParams.imageAlt, parameters.l10n, cardParams.description, cardStyles, cardParams.audio);

        if (MemoryGame.Card.hasTwoImages(cardParams)) {
          // Use matching image for card two
          cardTwo = new MemoryGame.Card(cardId + 1, cardParams.match, id, cardParams.matchAlt, parameters.l10n, cardParams.description, cardStyles, cardParams.matchAudio);
          cardOne.hasTwoImages = cardTwo.hasTwoImages = true;
        }
        else {
          // Add two cards with the same image
          cardTwo = new MemoryGame.Card(cardId + 1, cardParams.image, id, cardParams.imageAlt, parameters.l10n, cardParams.description, cardStyles, cardParams.audio);
        }

        // Add cards to card list for shuffeling
        addCard(cardOne, cardTwo);
        addCard(cardTwo, cardOne);

        cardId = cardId + 2;
      }
    }

    if (!self.previousState.cards) {
      H5P.shuffleArray(self.cards);
    }
    else {
      const reOrderedCards = [];

      self.previousState.cards.forEach(function (card) {
        reOrderedCards.push(self.cards[card.id]);
      });

      self.cards = reOrderedCards;
    }

    /**
     * Attach this game's html to the given container.
     *
     * @param {H5P.jQuery} $container
     */
    self.attach = function ($container) {
      const that = this;

      this.$container = $container;

      this.triggerXAPI('attempted');
      // TODO: Only create on first attach!
      $wrapper = $container.addClass('h5p-memory-game').html('');
      if (invertShades === -1) {
        $container.addClass('h5p-invert-shades');
      }

      // Add cards to list
      var $list = $('<ul/>', {
        role: 'application',
        'class': 'h5p-memory-game-cards-list',
        'aria-labelledby': 'h5p-intro-' + numInstances
      });
      for (var i = 0; i < that.cards.length; i++) {
        that.cards[i].appendTo($list);
      }

      if ($list.children().length) {
        // Determine enforced number of columns
        const ratio = parameters.behaviour.ratio;
        if (ratio.rows || ratio.columns) {
          if (ratio.rows && !ratio.columns) {
            this.forceCols = Math.ceil($list.children().length / Math.min(ratio.rows, $list.children().length));
          }
          else if (!ratio.rows && ratio.columns) {
            this.forceCols = Math.min(ratio.columns, $list.children().length);
          }
          else if ($list.children().length / ratio.rows === ratio.columns) {
            this.forceCols = ratio.columns;
          }
        }

        that.cards[0].makeTabbable();

        $('<div/>', {
          id: 'h5p-intro-' + numInstances,
          'class': 'h5p-memory-hidden-read',
          html: parameters.l10n.label,
          appendTo: $container
        });
        $list.appendTo($container);

        $bottom = $('<div/>', {
          'class': 'h5p-programatically-focusable',
          tabindex: '-1',
          appendTo: $container
        });
        $taskComplete = $('<div/>', {
          'class': 'h5p-memory-complete h5p-memory-hidden-read',
          html: parameters.l10n.done,
          appendTo: $bottom
        });

        $feedback = $('<div class="h5p-feedback">' + parameters.l10n.feedback + '</div>').appendTo($bottom);

        // Add status bar
        var $status = $('<dl class="h5p-status">' +
                        '<dt>' + parameters.l10n.timeSpent + ':</dt>' +
                        '<dd class="h5p-time-spent"><time role="timer" datetime="PT0M0S">0:00</time><span class="h5p-memory-hidden-read">.</span></dd>' +
                        '<dt>' + parameters.l10n.cardTurns + ':</dt>' +
                        '<dd class="h5p-card-turns">0<span class="h5p-memory-hidden-read">.</span></dd>' +
                        '</dl>').appendTo($bottom);

        self.timer = new MemoryGame.Timer(
          $status.find('time')[0],
          self.previousState.time,
          {
            store: function () {
              self.trigger('kllStoreSessionState', undefined, { bubbles: true, external: true });
            }
          }
        );
        self.counter = new MemoryGame.Counter(
          $status.find('.h5p-card-turns'),
          self.previousState.count
        );
        popup = new MemoryGame.Popup($container, parameters.l10n);
        this.popup = popup;

        $container.click(function () {
          popup.close();
        });
      }
      else {
        $('<div/>')
          .text('No card was added to the memory game!')
          .appendTo($list);

        $list.appendTo($container);
      }

      this.trigger('resize');
      setTimeout(function () {
        that.trigger('resize');
        if (self.previousState.cards) {
          for (let i = 0; i < self.cards.length; i++) {
            const cardData = self.previousState.cards.find(function (previousCard) {
              return previousCard.id === i;
            });

            const card = self.cards.find(function (currentCard) {
              return currentCard.getId() === i;
            });

            if (cardData.isFlipped) {
              card.flip({ skipPropagation: true });
              numFlipped++;
            }
            if (cardData.isRemoved) {
              card.remove();
              card.makeUntabbable();
              removed++;
            }
          }

          // Determine if we have a single flipped card
          for (let i = 0; i < self.cards.length; i = i + 2) {
            const cardOne = self.cards.find(function (currentCard) {
              return currentCard.getId() === i;
            });
            const cardTwo = self.cards.find(function (currentCard) {
              return currentCard.getId() === i + 1;
            });

            if (cardOne.isFlipped() === cardTwo.isFlipped()) {
              continue;
            }
            else {
              flipped = cardOne.isFlipped() ? cardOne : cardTwo;
              flipped.makeTabbable();
              break;
            }
          }

          if (numFlipped === self.cards.length) {
            finished({ skipXAPI: true });
          }
          else {
            self.timer.play();
          }
        }
      }, 0);
    };

    self.on('resize', this.scaleGameSize);

    /*
     * Workaround (hopefully temporary) for KidsLoopLive that for whatever
     * reason does not use h5p-resizer.js.
     */
    window.addEventListener('resize', function () {
      self.scaleGameSize();
    });
  }

  // Extends the event dispatcher
  MemoryGame.prototype = Object.create(EventDispatcher.prototype);
  MemoryGame.prototype.constructor = MemoryGame;

  /**
   * Get current state.
   * @return {object} current state.
   */
  MemoryGame.prototype.getCurrentState = function () {
    return {
      cards: this.cards.map(function (card) {
        return {
          id: card.getId(),
          isFlipped: card.isFlipped(),
          isRemoved: card.isRemoved()
        };
      }),
      time: this.timer.getTime(),
      count: this.counter.getValue()
    };
  };

  MemoryGame.prototype.scaleGameSize = function () {
    let cardConfigurations = [];

    const $list = this.$container.children('ul');
    $list.css('max-width', '');
    const $elements = $list.children();

    // Make sure we can meet the wishes
    if (this.parameters.behaviour.ratio.columns && this.parameters.behaviour.ratio.rows &&
      this.parameters.behaviour.ratio.columns * this.parameters.behaviour.ratio.rows !== $elements.length
    ) {
      delete this.parameters.behaviour.ratio.columns;
      delete this.parameters.behaviour.ratio.rows;
    }

    /*
     * Determine all possible card configurations, will be only 1 if either
     * a square shape is aspired or number of columns/rows is specified
     */
    if (this.parameters.behaviour.useGrid) {
      cardConfigurations = [{
        cols: Math.ceil(Math.sqrt($elements.length)),
        rows: Math.ceil($elements.length / Math.ceil(Math.sqrt($elements.length)))
      }];
    }
    else if (this.parameters.behaviour.ratio.columns) {
      cardConfigurations = [{
        cols: this.parameters.behaviour.ratio.columns,
        rows: Math.ceil($elements.length / this.parameters.behaviour.ratio.columns)
      }];
    }
    else if (this.parameters.behaviour.ratio.rows) {
      cardConfigurations = [{
        rows: this.parameters.behaviour.ratio.rows,
        cols: Math.ceil($elements.length / this.parameters.behaviour.ratio.rows)
      }];
    }
    else {
      for (let index = 1; index < $elements.length + 1; index++) {
        cardConfigurations.push({
          cols: index,
          rows: Math.ceil($elements.length / index)
        });
      }
    }

    // Determine largest possible card size
    const displayLimits = (this.isRoot()) ? this.computeDisplayLimitsKLL() : null;

    if (displayLimits) {
      cardConfigurations = cardConfigurations
        .map(function (config) {
          const displayRatio = displayLimits.width / displayLimits.height;

          const cardSize = ((config.cols / config.rows / 1.16 > displayRatio)) ?
            displayLimits.width / config.cols :
            displayLimits.height / config.rows / 1.16;

          return {
            cols: config.cols,
            rows: config.rows,
            cardSize: Math.max(1, cardSize - 2) // Some buffer for weird mobile behavior
          };
        })
        .sort(function (a, b) {
          return b.cardSize - a.cardSize;
        })
        .shift();
    }
    else {
      cardConfigurations[0].cardSize = 100;
    }

    $elements.css('width', cardConfigurations.cardSize + 'px').each(function (i, e) {
      $(e).removeClass('h5p-row-break');
      if (i === cardConfigurations.cols) {
        $(e).addClass('h5p-row-break');
      }
    });

    // We use font size to evenly scale all parts of the cards.
    $list.css('font-size', cardConfigurations.cardSize / 7.5 + 'px');
    $list.css('max-width', (cardConfigurations.cardSize + 2) * cardConfigurations.cols + 'px');
    this.popup.setSize(cardConfigurations.cardSize / 7.5);
  };

  /**
   * Compute display limits.
   * @return {object|null} Height and width in px or null if cannot be determined.
   */
  MemoryGame.prototype.computeDisplayLimits = function () {
    let topWindow = this.getTopWindow();

    // iOS doesn't change screen dimensions on rotation
    let screenSize = (this.isIOS() && this.getOrientation() === 'landscape') ?
      { height: screen.width, width: screen.height } :
      { height: screen.height, width: screen.width };

    topWindow = topWindow || {
      innerHeight: screenSize.height,
      innerWidth: screenSize.width
    };

    // Smallest value of viewport and container wins
    return {
      height: Math.min(topWindow.innerHeight, screenSize.height),
      width: Math.min(topWindow.innerWidth, this.$container.get(0).offsetWidth)
    };
  };

  /**
   * Compute display limits for KidsLoop Live.
   * @return {object|null} Height and width in px or null if cannot be determined.
   */
  MemoryGame.prototype.computeDisplayLimitsKLL = function () {
    const displayLimits = this.computeDisplayLimits();

    // This only works because KLL enforces height on H5P's iframe
    displayLimits.height = Math.min(displayLimits.height, document.body.offsetHeight);
    return displayLimits;
  };

  /**
   * Detect whether user is running iOS.
   * @return {boolean} True, if user is running iOS.
   */
  MemoryGame.prototype.isIOS = function () {
    return (
      ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    );
  };

  /**
   * Get device orientation.
   * @return {string} 'portrait' or 'landscape'.
   */
  MemoryGame.prototype.getOrientation = function () {
    if (screen.orientation && screen.orientation.type) {
      if (screen.orientation.type.includes('portrait')) {
        return 'portrait';
      }
      else if (screen.orientation.type.includes('landscape')) {
        return 'landscape';
      }
    }

    // Unreliable, as not clear what device's natural orientation is
    if (typeof window.orientation === 'number') {
      if (window.orientation === 0 || window.orientation === 180) {
        return 'portrait';
      }
      else if (window.orientation === 90 || window.orientation === -90 || window.orientation === 270) {
        return 'landscape';
      }
    }

    return 'landscape'; // Assume default
  };

  /**
	 * Get top DOM Window object.
	 * @param {Window} [startWindow=window] Window to start looking from.
	 * @return {Window|null} Top window.
	 */
  MemoryGame.prototype.getTopWindow = function (startWindow) {
    let sameOrigin;
    startWindow = startWindow || window;

    // H5P iframe may be on different domain than iframe content
    try {
      sameOrigin = startWindow.parent.location.host === window.location.host;
    }
    catch (error) {
      sameOrigin = null;
    }

    if (!sameOrigin) {
      return null;
    }

    if (startWindow.parent === startWindow || ! startWindow.parent) {
      return startWindow;
    }

    return this.getTopWindow(startWindow.parent);
  };

  /**
   * Determine color contrast level compared to white(#fff)
   *
   * @private
   * @param {string} color hex code
   * @return {number} From 1 to Infinity.
   */
  var getContrast = function (color) {
    return 255 / ((parseInt(color.substr(1, 2), 16) * 299 +
                   parseInt(color.substr(3, 2), 16) * 587 +
                   parseInt(color.substr(5, 2), 16) * 144) / 1000);
  };

  return MemoryGame;
})(H5P.EventDispatcher, H5P.jQuery);
