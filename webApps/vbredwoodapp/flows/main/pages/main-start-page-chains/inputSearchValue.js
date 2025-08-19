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

  class inputSearchValue extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.rawValue 
     */
    async run(context, { rawValue }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;
      $variables.searchText = rawValue;
      await $functions.handleSearchInput($variables.searchText);
    }
  }

  return inputSearchValue;
});
