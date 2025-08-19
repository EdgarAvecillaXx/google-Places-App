define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
  'utils/helpers'
], (
  ActionChain,
  Actions,
  ActionUtils,
  helpers
) => {
  'use strict';

  class loadGoogleMap extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      try {
        await $functions.loadMapAndInit($application.constants.MAPS_API_KEY,$variables.mapCenter);
      } catch (error) {
        helpers.notificationHandler(context, error);
      }
    }
  }

  return loadGoogleMap;
});
