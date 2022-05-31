H5P.SingleChoiceSet = H5P.SingleChoiceSet || {};

H5P.SingleChoiceSet.SoundEffects = (function () {
  var isDefined = false;
  const audioObjects = {};

  var SoundEffects = {
    types: [
      'positive-short',
      'negative-short'
    ]
  };

  /**
   * Setup defined sounds.
   *
   * @param {string} libraryPath Library path.
   * @param {jQuery} $dom DOM to attach audio element to.
   * @return {boolean} True if setup was successfull, otherwise false.
   */
  SoundEffects.setup = function (libraryPath, $dom) {
    if (isDefined) {
      return false;
    }

    for (let i = 0; i < SoundEffects.types.length; i++) {
      const type = SoundEffects.types[i];
      audioObjects[type] = SoundEffects.createAudio(libraryPath, type);
      $dom.append(audioObjects[type].player);
    }
    isDefined = true;

    return true;
  };

  /**
   * Create audio object.
   * @param {string} libraryPath Library path.
   * @param {number} id H5P content type id.
   * @return {object} Audio object.
   */
  SoundEffects.createAudio = function (libraryPath, type) {
    const path = libraryPath + 'sounds/' + type + '.mp3';

    const player = document.createElement('audio');
    player.classList.add('h5p-invisible-audio');
    player.src = path;

    return {
      player: player,
      promise: null
    };
  };

  /**
   * Play a sound
   *
   * @param  {string} type  Name of the sound as defined in [SoundEffects.types]{@link H5P.SoundEffects.SoundEffects#types}
   * @param  {number} delay Delay in milliseconds
   */
  SoundEffects.play = function (type, delay) {
    if (typeof type !== 'string') {
      return;
    }

    const audio = audioObjects[type];

    if (!audio) {
      return;
    }

    // People might click quickly ...
    if (!audio.promise) {
      setTimeout(function () {
        audio.promise = audio.player.play();
        audio.promise
          .then(() => {
            audio.promise = null;
          })
          .catch(() => {
            // Browser policy prevents playing
            audio.promise = null;
          });
      }, delay || 0);
    }
  };

  return SoundEffects;
})();
