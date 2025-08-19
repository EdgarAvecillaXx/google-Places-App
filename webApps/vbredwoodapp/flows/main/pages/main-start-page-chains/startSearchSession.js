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

  class startSearchSession extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables } = context;
      if (!$variables.searchSessionToken) {
        $variables.searchSessionToken = helpers.generateUUID();
      }
    }
  }

  return startSearchSession;
});
