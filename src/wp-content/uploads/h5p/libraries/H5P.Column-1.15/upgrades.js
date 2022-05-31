var H5PUpgrades = H5PUpgrades || {};

H5PUpgrades['H5P.Column'] = (function () {
  return {
    1: {

      /**
       * Asynchronous content upgrade hook.
       * Upgrades content parameters to support Column 1.10.
       *
       * - Converts H5P.AppearIn to H5P.AdvancedText
       *
       * @param {Object} parameters
       * @param {function} finished
       */
      10: function (parameters, finished) {

        if (parameters && parameters.content) {

          // Go through content
          for (var i = 0; i < parameters.content.length; i++) {
            if (parameters.content[i] && parameters.content[i].content) {

              const content = parameters.content[i].content;
              if (content.library && content.library.split(' ')[0] === 'H5P.AppearIn') {

                content.library = 'H5P.AdvancedText 1.1';

                content.params = content.params || {};
                let roomName = '';
                if (content.params.appearRoom) {
                  roomName = content.params.appearRoom;
                }

                content.params.text = '<p>AppearIn support for embedded rooms has been deprecated and is no longer maintained. Access your room in a new tab with the following <a target="_blank" href="https://appear.in/' + roomName + '">link.</a></p>';
              }
            }
          }
        }

        // Done
        finished(null, parameters);
      },

      /**
       * Asynchronous content upgrade hook.
       * Transforms CoursePresentation to CoursePresentationKID
       *
       * @param {Object} parameters
       * @param {function} finished
       */
      14: function (parameters, finished, extras) {
        if (parameters && parameters.content) {
          parameters.content.forEach(function (content) {
            if (!content.content) {
              return;
            }

            /*
             * Version of H5P.CoursePresentation should be 1.22, but the
             * KID fork should be able to handle others (earliers) as well.
             * Important: There are no hard dependencies defined, so it must be
             * ensured that H5P.CoursePresentationKID 1.24 is installed
             */
            if (content.content.library && content.content.library.split(' ')[0] === 'H5P.CoursePresentation') {
              content.content.library = 'H5P.CoursePresentationKID 1.24'
            }
          });
        }

        // Done
        finished(null, parameters, extras);
      }

    }
  };
})();
