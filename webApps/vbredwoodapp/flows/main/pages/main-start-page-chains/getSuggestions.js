define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class getSuggestions extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.value 
     */
    async run(context, { value }) {
      const { $page, $flow, $application, $constants, $variables, $event } = context;

      const response = await Actions.callRest(context, {
        endpoint: 'googleplaces/postPlacesAutocomplete',
        body: {
          sessionToken: $variables.searchSessionToken,
          locationBias: {
            circle: {
              center: {
                latitude: $variables.mapCenter.lat,
                longitude: $variables.mapCenter.lng,
              },
              radius: 50000,
            },
          },
        },
      });
    }
  }

  return getSuggestions;
});
