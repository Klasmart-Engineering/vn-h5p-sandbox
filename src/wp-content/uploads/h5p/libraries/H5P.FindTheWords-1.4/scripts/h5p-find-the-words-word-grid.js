(function (FindTheWords, EventDispatcher, $) {

  /**
   * WordGrid - Handles the word grid part of the game.
   * @class H5P.FindTheWords.WordGrid
   * @extends H5P.EventDispatcher
   * @param {Object} params Description.
   */
  FindTheWords.WordGrid = function (params) {
    /** @alias H5P.FindTheWords.WordGrid# */
    // extending the default parameter set for the grid
    this.options = params;

    EventDispatcher.call(this);

    this.createWordGrid(params.previousGrid);
  };

  FindTheWords.WordGrid.prototype = Object.create(EventDispatcher.prototype);
  FindTheWords.WordGrid.prototype.constructor = FindTheWords.WordGrid;

  // get i th element position based on the current position for different orientations
  const orientations = {
    horizontal: function (x, y, i) {
      return {
        x: x + i,
        y: y
      };
    },
    horizontalBack: function (x, y, i) {
      return {
        x: x - i,
        y: y
      };
    },
    vertical: function (x, y, i) {
      return {
        x: x,
        y: y + i
      };
    },
    verticalUp: function (x, y, i) {
      return {
        x: x,
        y: y - i
      };
    },
    diagonal: function (x, y, i) {
      return {
        x: x + i,
        y: y + i
      };
    },
    diagonalBack: function (x, y, i) {
      return {
        x: x - i,
        y: y + i
      };
    },
    diagonalUp: function (x, y, i) {
      return {
        x: x + i,
        y: y - i
      };
    },
    diagonalUpBack: function (x, y, i) {
      return {
        x: x - i,
        y: y - i
      };
    }
  };

  /*
   * Determines if an orientation is possible given the starting square (x,y),
   * the height (h) and width (w) of the puzzle, and the length of the word (l).
   * Returns true if the word will fit starting at the square provided using
   * the specified orientation.
   */
  const checkOrientations = {
    horizontal: function (x, y, h, w, l) {
      return w >= x + l;
    },
    horizontalBack: function (x, y, h, w, l) {
      return x + 1 >= l;
    },
    vertical: function (x, y, h, w, l) {
      return h >= y + l;
    },
    verticalUp: function (x, y, h, w, l) {
      return y + 1 >= l;
    },
    diagonal: function (x, y, h, w, l) {
      return (w >= x + l) && (h >= y + l);
    },
    diagonalBack: function (x, y, h, w, l) {
      return (x + 1 >= l) && (h >= y + l);
    },
    diagonalUp: function (x, y, h, w, l) {
      return (w >= x + l) && (y + 1 >= l);
    },
    diagonalUpBack: function (x, y, h, w, l) {
      return (x + 1 >= l) && (y + 1 >= l);
    }
  };

  /*
   *  Determines the next possible valid square given the square (x,y) was ]
   *  invalid and a word lenght of (l).  This greatly reduces the number of
   *  squares that must be checked. Returning {x: x+1, y: y} will always work
   *  but will not be optimal.
   */
  const skipOrientations = {
    horizontal: function (x, y) {
      return {
        x: 0,
        y: y + 1
      };
    },
    horizontalBack: function (x, y, l) {
      return {
        x: l - 1,
        y: y
      };
    },
    vertical: function (x, y) {
      return {
        x: 0,
        y: y + 100
      };
    },
    verticalUp: function (x, y, l) {
      return {
        x: 0,
        y: l - 1
      };
    },
    diagonal: function (x, y) {
      return {
        x: 0,
        y: y + 1
      };
    },
    diagonalBack: function (x, y, l) {
      return {
        x: l - 1,
        y: x >= l - 1 ? y + 1 : y
      };
    },
    diagonalUp: function (x, y, l) {
      return {
        x: 0,
        y: y < l - 1 ? l - 1 : y + 1
      };
    },
    diagonalUpBack: function (x, y, l) {
      return {
        x: l - 1,
        y: x >= l - 1 ? y + 1 : y
      };
    }
  };

  /**
   * calcOverlap - returns the overlap if the word can be fitted with the grid parameters provided.
   * @param {string} word Word to be fitted.
   * @param {Object[]} wordGrid Grid to which word needs to be fitted.
   * @param {number} x Starting x cordinate.
   * @param {nuber} y Starting y cordinate.
   * @param {function} fnGetSquare Function to get the next grid pos as per the specified direction.
   * @return {number} Overlap value if it can be fitted , -1 otherwise.
   */
  const calcOverlap = function (word, wordGrid, x, y, fnGetSquare) {
    let overlap = 0;

    // traverse the squares to determine if the word fits
    for (let index = 0 ; index < word.length; index++) {
      const next = fnGetSquare(x, y, index);
      const square = wordGrid[next.y][next.x];
      if (square === word[index]) {
        overlap++;
      }
      else if (square !== '') {
        return -1;
      }
    }

    return overlap;
  };

  /**
   * findBestLocations - Find the best possible location for a word in the grid.
   * @param {Object[]} wordGrid
   * @param {Object} options
   * @param {string} word
   */
  const findBestLocations = function (wordGrid, options, word) {
    const locations = [];
    const height = options.height;
    const width = options.width;
    const wordLength = word.length;
    let maxOverlap = 0;

    options.orientations.forEach(function (orientation) {

      const check = checkOrientations[orientation];
      const next = orientations[orientation];
      const skipTo = skipOrientations[orientation];

      let x = 0;
      let y = 0;

      while (y < height) {
        if (check(x, y, height, width, wordLength)) {
          const overlap = calcOverlap(word, wordGrid, x, y, next);
          if (overlap >= maxOverlap || (!options.preferOverlap && overlap > -1 )) {
            maxOverlap = overlap;
            locations.push({
              x: x,
              y: y,
              orientation: orientation,
              overlap: overlap
            });
          }
          x++;
          if ( x >= width) {
            x = 0;
            y++;
          }
        }
        else {
          const nextPossible = skipTo(x, y, wordLength);
          x = nextPossible.x;
          y = nextPossible.y;
        }
      }
    });
    return locations;
  };

  /**
   * placeWordInGrid - find the best location and place the word.
   * @param {Object[]} wordGrid
   * @param {Object} options
   * @param {string} word
   */
  const placeWordInGrid = function (wordGrid, options, word) {
    const locations = findBestLocations(wordGrid, options, word);
    if (locations.length === 0) {
      return false;
    }

    const selectedLoc = locations[Math.floor(Math.random() * locations.length)];
    for (let index = 0; index < word.length; index++) {
      const next = orientations[selectedLoc.orientation](selectedLoc.x, selectedLoc.y, index);
      wordGrid[next.y][next.x] = word[index];
    }
    return true;
  };

  /**
   * fillGrid - Create an empty grid and fill it with words.
   * @param {Object[]} words Description.
   * @param {Object} options Description.
   * @return {Object[]|null} Grid array if all words can be fitted, else null.
   */
  const fillGrid = function (words, options) {
    const wordGrid = [];
    for (let i = 0; i < options.height; i++) {
      wordGrid[i] = [];
      for (let j = 0; j < options.width; j++) {
        wordGrid[i][j] = '';
      }
    }

    for (const i in words) {
      if (!placeWordInGrid(wordGrid, options, words[i])) {
        return null;
      }
    }
    return wordGrid;
  };

  /**
   * fillBlanks - fill the unoccupied spaces with blanks.
   * @param {Object[]} wordGrid
   * @param {string} fillPool
   * @return {Object[]} Resulting word grid.
   */
  const fillBlanks = function (wordGrid, fillPool) {
    for (let i = 0; i < wordGrid.length; i++) {
      for (let j = 0;j < wordGrid[0].length; j++) {
        if (!wordGrid[i][j]) {
          const randomLetter = Math.floor(Math.random() * fillPool.length);
          wordGrid[i][j] = fillPool[randomLetter];
        }
      }
    }
    return wordGrid;
  };

  /**
   * calculateCordinates - function to calculate the cordinates & grid postions at which the event occured.
   * @param {number} x X-cordinate of the event.
   * @param {number} y Y-cordinate of the event.
   * @param {number} elementSize Current element size.
   * @return {Object[]} [normalized x, normalized y, row ,col].
   */
  const calculateCordinates = function (x, y, elementSize) {
    const row1 = Math.floor(x / elementSize);
    const col1 = Math.floor(y / elementSize);
    const x_click = row1 * elementSize + (elementSize / 2);
    const y_click = col1 * elementSize + (elementSize / 2);
    return [x_click, y_click, row1, col1];
  };

  /*
   * function to  process the line drawn to find if it is a valid marking
   * in terms of possible grid directions
   * returns directional value if it is a valid marking
   * else return false
   */

  /**
   * getValidDirection - process the line drawn to find if it is a valid marking.
   * @param {number} x1 Starting x cordinate.
   * @param {number} y1 Starting y cordinate.
   * @param {number} x2 Ending x cordinate.
   * @param {number} y2 Ending y cordinate.
   * @return {Object[]|boolean} Direction array if a valid marking, false otherwise.
   */
  const getValidDirection = function (x1, y1, x2, y2) {
    const dirx = (x2 > x1) ? 1 : ((x2 < x1) ? -1 : 0);
    const diry = (y2 > y1) ? 1 : ((y2 < y1) ? -1 : 0);
    let y = y1;
    let x = x1;

    if (dirx !== 0) {
      while (x !== x2) {
        x = x + dirx;
        y = y + diry;
      }
    }
    else {
      while (y !== y2) {
        y = y + diry;
      }
    }

    if (y2 === y) {
      return [dirx, diry];
    }
    else {
      return false;
    }
  };

  // All event handlers are registered here

  /**
   * mouseDownEventHandler.
   * @param {Object} e Event Object.
   * @param {HTMLelement} canvas Html5 canvas element.
   * @param {number} elementSize Element size.
   * @return {Object[]}
   */
  const mouseDownEventHandler = function (e, canvas, elementSize) {
    const x = e.pageX - $(canvas).offset().left;
    const y = e.pageY - $(canvas).offset().top;

    return calculateCordinates(x, y, elementSize);
  };


  /*
   * event handler for handling mousemove events
   * @private
   */

  /**
   * mouseMoveEventHandler.
   * @param {Object} e Event Object.
   * @param {HTMLelement} drawingContainer SVG Element.
   * @param {Object[]} srcPos Position from which the movement started.
   * @param {number} eSize  Current element size.
   */
  const mouseMoveEventHandler = function (e, drawingContainer, srcPos, eSize) {
    const desX = e.pageX - $(drawingContainer).offset().left;
    const desY = e.pageY - $(drawingContainer).offset().top;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.classList.add('dom-drawing-marker');
    line.setAttribute('stroke-width', Math.floor(eSize / 2));
    line.setAttribute('x1', srcPos[0] - (eSize / 16));
    line.setAttribute('y1', srcPos[1] + (eSize / 16));
    line.setAttribute('x2', desX - (eSize / 16));
    line.setAttribute('y2', desY + (eSize / 16));

    drawingContainer.innerHTML = '';
    drawingContainer.appendChild(line);
  };

  /*
   * event handler for handling mouseup events
   * @private
   */

  /**
   * mouseUpEventHandler.
   * @param {Object} e Event Object.
   * @param {HTMLelement} canvas Html5 Canvas Element.
   * @param {number} elementSize Current element size.
   * @param {Object[]} clickStart Starting Event location.
   * @return {Object} return staring,ending and direction of the current marking.
   */
  const mouseUpEventHandler = function (e, canvas, elementSize, clickStart) {
    let wordObject = {};

    const x = e.pageX - $(canvas).offset().left - (elementSize / 16);
    const y = e.pageY - $(canvas).offset().top + (elementSize / 16);

    const clickEnd = calculateCordinates(x, y, elementSize);

    if ((Math.abs(clickEnd[0] - x) < 20) && (Math.abs(clickEnd[1] - y) < 15)) {
      // Drag ended within permissible range
      wordObject = {
        'start': clickStart,
        'end': clickEnd,
        'dir': getValidDirection(clickStart[2], clickStart[3], clickEnd[2], clickEnd[3])
      };
    }

    return wordObject;
  };

  /**
   * touchHandler - Mapping touchevents to corresponding mouse events.
   * @param {Object} event Description.
   */
  const touchHandler = function (event) {
    const touches = event.changedTouches;
    const  first = touches[0];
    const simulatedEvent = document.createEvent('MouseEvent');

    let type = '';
    switch (event.type) {
      case 'touchstart':
        type = 'mousedown';
        break;
      case 'touchmove':
        type = 'mousemove';
        break;
      case 'touchend':
        type = 'mouseup';
        break;
      default:
        return;
    }

    // Created and fire a simulated mouse event
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
      first.screenX, first.screenY,
      first.clientX, first.clientY, false,
      false, false, false, 0 /*left*/, null);
    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
  };

  /**
   * Create word grid.
   * @param {string[][]} previousGrid Previous grid to use.
   */
  FindTheWords.WordGrid.prototype.createWordGrid = function (previousGrid) {
    let wordGrid = null ;

    if (!previousGrid) {
      let attempts = 0;

      // sorting the words by length speedup the word fitting algorithm
      const wordList = this.options.vocabulary.slice(0).sort(function (a, b) {
        return (a.length < b.length);
      });

      while (!wordGrid) {
        while (!wordGrid && attempts++ < this.options.maxAttempts) {
          wordGrid = fillGrid(wordList, this.options);
        }

        // if grid cannot be formed in the current dimensions
        if (!wordGrid) {
          this.options.height++;
          this.options.width++;
          attempts = 0;
        }
      }

      // fill in empty spaces with random letters
      if (this.options.fillBlanks) {
        wordGrid = fillBlanks(wordGrid, this.options.fillPool);
      }
      this.wordGrid = wordGrid;
    }
    else {
      this.wordGrid = previousGrid;
    }

    // set the output puzzle

    // Grid with characters
    this.canvas = document.createElement('div');
    this.canvas.classList.add('dom-canvas-grid');

    for (let row = 0; row < this.wordGrid.length; row++) {
      for (let col = 0; col < this.wordGrid[0].length; col++) {
        const cell = document.createElement('div');

        cell.classList.add('dom-canvas-grid-cell');
        cell.innerHTML = this.wordGrid[row][col].toUpperCase();
        this.canvas.appendChild(cell);
      }
    }

    // Container where marker is drawn on
    this.drawingContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.drawingContainer.classList.add('dom-canvas-drawing-container');

    // Container where results are put
    this.outputContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.outputContainer.classList.add('dom-canvas-output-container');
  };

  /**
   * Get word grid.
   * @return {string[][]} Word grid.
   */
  FindTheWords.WordGrid.prototype.getWordGrid = function () {
    return this.wordGrid;
  };

  /**
   * markWord - mark the word on the output canvas (permanent).
   * The computation of the SVG path feels a little wacky, but it uses what
   * it previously got from the original canvas implementation. Could probably
   * be refactored to be made simpler.
   * @param {Object} wordParams
   */
  FindTheWords.WordGrid.prototype.markWord = function (wordParams) {
    const dirKey = wordParams['directionKey'];
    const clickStart = wordParams['start'];
    const clickEnd = wordParams['end'];
    const offsetTop = (this.$container.offset().top > this.elementSize * 0.75 / this.options.charSpacingFactor) ? Math.floor(this.elementSize * 0.75) * (-1) : this.$container.offset().top;
    const topRadius = Math.floor(this.elementSize / 8 * this.options.charSpacingFactor);
    const bottomRadius = Math.abs(Math.floor(offsetTop / 8));
    const lineWidth = Math.floor(this.elementSize / 4 / this.options.charSpacingFactor);

    let startingAngle;

    // find the arc starting angle depending on the direction
    switch (dirKey) {
      case 'horizontal': {
        startingAngle = (Math.PI / 2);
        break;
      }
      case 'horizontalBack': {
        startingAngle = -(Math.PI / 2);
        break;
      }
      case 'diagonal': {
        startingAngle = 3 * (Math.PI / 4);
        break;
      }
      case 'diagonalBack': {
        startingAngle = 5 * (Math.PI / 4);
        break;
      }
      case 'diagonalUp': {
        startingAngle = (Math.PI / 4);
        break;
      }
      case 'diagonalUpBack': {
        startingAngle = -(Math.PI / 4);
        break;
      }
      case 'vertical': {
        startingAngle = (Math.PI);
        break;
      }
      case 'verticalUp': {
        startingAngle = 0;
        break;
      }
    }

    // Create marker as SVG
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    marker.classList.add(`${this.options.gridActive ? 'marker-answer' : 'marker-solution'}`);
    marker.setAttribute('d', this.computeSVGPath(
      { x: clickStart[0] - topRadius, y: clickStart[1] + bottomRadius },
      { x: clickEnd[0] - topRadius, y: clickEnd[1] + bottomRadius },
      lineWidth,
      startingAngle
    ));
    this.outputContainer.appendChild(marker);
  };

  /**
   * Compute SVG path for marker.
   * @param {object} start Start coordinates.
   * @param {object} end End coordinates.
   * @param {number} radius Radius of marker.
   * @param {angle} angle Angle (in radians) of marker.
   */
  FindTheWords.WordGrid.prototype.computeSVGPath = function (start, end, radius, angle) {
    // Points for path
    const p1 = this.computeCoordinateCenterOffset(start.x, start.y, radius, angle + Math.PI);
    const p2 = this.computeCoordinateCenterOffset(start.x, start.y, radius, angle);
    const p3 = this.computeCoordinateCenterOffset(end.x, end.y, radius, angle + 2 * Math.PI);
    const p4 = this.computeCoordinateCenterOffset(end.x, end.y, radius, angle + Math.PI);

    return `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 0 0 ${p2.x} ${p2.y} L  ${p3.x} ${p3.y} A ${radius} ${radius} 0 0 0 ${p4.x} ${p4.y} Z`;
  };

  /**
   * Compute offset for center coordinat to place circle's arc.
   * @param {number} centerX x coordinate of center.
   * @param {number} centerY y coordinate of center.
   * @param {number} radius Radius of circle.
   * @param {number} angleInRadians Angle for offset.
   * @return {object} Coordinates on circle's arc.
   */
  FindTheWords.WordGrid.prototype.computeCoordinateCenterOffset = function (centerX, centerY, radius, angleInRadians) {
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  /**
   * mark - mark the words if they are not found.
   * @param {Object[]} wordList
   */
  FindTheWords.WordGrid.prototype.mark = function (wordList) {
    const words = wordList;
    const that = this;
    const options = {
      height: this.wordGrid.length,
      width: this.wordGrid[0].length,
      orientations: this.options.orientations,
      preferOverlap: this.options.preferOverlap
    };
    const found = [];
    const notFound = [];

    words.forEach(function (word) {
      const locations = findBestLocations(that.wordGrid, options, word);
      if (locations.length > 0 && locations[0].overlap === word.length) {
        locations[0].word = word;
        found.push(locations[0]);
      }
      else {
        notFound.push(word);
      }
    });

    this.markSolution(found);
  };

  /**
   * markSolution.
   * @param {Object[]} solutions
   */
  FindTheWords.WordGrid.prototype.markSolution = function (solutions) {
    const that = this;

    solutions.forEach(function (solution) {
      const next = orientations[solution.orientation];
      const word = solution.word;
      const startX = solution.x;
      const startY = solution.y;
      const endPos = next(startX, startY, word.length - 1);
      const clickStartX = startX * that.elementSize + (that.elementSize / 2);
      const clickStartY = startY * that.elementSize + (that.elementSize / 2);
      const clickEndX = endPos.x * that.elementSize + (that.elementSize / 2);
      const clickEndY = endPos.y * that.elementSize + (that.elementSize / 2);
      const wordParams = {
        'start': [clickStartX, clickStartY, startX, startY],
        'end': [clickEndX, clickEndY, endPos.x, endPos.y],
        'directionKey': solution.orientation
      };
      that.markWord(wordParams);
    });
  };

  /**
   * disableGrid.
   */
  FindTheWords.WordGrid.prototype.disableGrid = function () {
    this.options.gridActive = false;
  };

  /**
   * enableGrid.
   */
  FindTheWords.WordGrid.prototype.enableGrid = function () {
    this.options.gridActive = true;
  };

  /**
   * appendTo - Placing the container for drawing the grid.
   * @param {H5P.jQuery} $container
   * @param {number} elementSize
   */
  FindTheWords.WordGrid.prototype.appendTo = function ($container, elementSize) {
    this.$container = $container;
    this.canvasWidth = elementSize * this.wordGrid[0].length * this.options.charSpacingFactor;
    this.canvasHeight = elementSize * this.wordGrid.length * this.options.charSpacingFactor;
    this.elementSize = elementSize * this.options.charSpacingFactor;
    $container.css('height', this.canvasHeight);
    $container.css('width', this.canvasWidth);
  };

  /**
   * drawGrid - draw the letter on the canvas element provided.
   * @param {number} margin Description.
   */
  FindTheWords.WordGrid.prototype.drawGrid = function () {
    const that = this;

    /*
     * Recompute the cell style to match original implementation
     * It's unnecessary to recreate the $container contents here all the
     * time, but that's part of the original implementation. Not changing
     * this now.
     */
    this.canvas.style.width = `${that.canvasWidth}px`;
    this.canvas.style.height = `${that.canvasHeight}px`;
    this.canvas.style.fontSize = `${that.elementSize / 3 / that.options.charSpacingFactor}px`;
    this.canvas.style.lineHeight = `${that.elementSize / 3 / that.options.charSpacingFactor}px`;

    for (let i = 0; i < this.wordGrid.length * this.wordGrid[0].length; i++) {
      const cell = this.canvas.childNodes[i];
      cell.style.width = `${that.canvasWidth / this.wordGrid[0].length}px`;
      cell.style.height = `${that.canvasHeight / this.wordGrid.length}px`;
      cell.style.paddingLeft = `${that.elementSize / 4}px`;
      cell.style.paddingTop = `${that.elementSize / 3}px`;
    }

    // Found words
    this.outputContainer.style.width = this.canvas.style.width;
    this.outputContainer.style.height = this.canvas.style.height;
    this.outputContainer.innerHTML = '';

    // Drawing marker
    this.drawingContainer.style.width = this.canvas.style.width;
    this.drawingContainer.style.height = this.canvas.style.height;

    that.$container.append(this.canvas);
    that.$container.append(this.outputContainer);
    that.$container.append(this.drawingContainer);

    let clickStart = [];
    let isDragged = false;
    let clickMode = false;

    this.$container[0].addEventListener('keydown', function () {
      //TODO: need to implement for a11y
    }, false);

    this.drawingContainer.addEventListener('touchstart', function (event) {
      touchHandler(event);
    }, false);

    this.drawingContainer.addEventListener('touchmove', function (event) {
      touchHandler(event);
    }, false);

    this.drawingContainer.addEventListener('touchend', function (event) {
      touchHandler(event);
    }, false);

    $(this.drawingContainer).on('mousedown', function (event) {
      if (that.options.gridActive) {
        if (!clickMode) {
          that.enableDrawing = true;
          clickStart = mouseDownEventHandler(event, this, that.elementSize);
          that.trigger('drawStart');
        }
      }
    });

    $(this.drawingContainer).on('mouseup', function (event) {
      if (that.enableDrawing) {
        if (isDragged || clickMode) {
          if (clickMode) {
            clickMode = false;
          }
          let markedWord = '';
          const wordObject = mouseUpEventHandler(event, this, that.elementSize, clickStart);

          const dict = {
            'horizontal' : [1, 0],
            'horizontalBack' : [-1, 0],
            'diagonal' : [1, 1],
            'diagonalBack' : [-1, 1],
            'diagonalUp' : [1, -1],
            'diagonalUpBack' : [-1, -1],
            'vertical' : [0, 1],
            'verticalUp' : [0, -1]
          };

          if (!$.isEmptyObject(wordObject) && wordObject['dir'] !== false) {
            const dir = wordObject['dir'];
            let x1 = wordObject['start'][2];
            let y1 = wordObject['start'][3];
            let x2 = wordObject['end'][2];
            const y2 = wordObject['end'][3];

            do {
              markedWord += that.wordGrid[y1][x1];
              x1 = x1 + dir[0];
              y1 = y1 + dir[1];
            } while (!((y1 === y2) && (x1 === x2)));

            markedWord += that.wordGrid[y2][x2];
            for (const key in dict) {
              if (dict[key][0] === dir[0] && dict[key][1] === dir[1]) {
                wordObject['directionKey'] = key;
                break;
              }
            }
          }

          that.enableDrawing = false;
          isDragged = false;
          that.trigger('drawEnd', {'markedWord': markedWord, 'wordObject': wordObject});
        }
        else if (!clickMode) {
          clickMode = true;
        }

        // Clear drawing container
        that.drawingContainer.innerHTML = '';
      }
    });

    $(this.drawingContainer).on('mousemove', function (event) {
      if (that.enableDrawing ) {
        isDragged = true;
        mouseMoveEventHandler(event, that.drawingContainer, clickStart, that.elementSize / that.options.charSpacingFactor);
      }
    });
  };

  return FindTheWords.WordGrid;

}) (H5P.FindTheWords, H5P.EventDispatcher, H5P.jQuery);
