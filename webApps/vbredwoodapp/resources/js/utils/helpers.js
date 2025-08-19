define(['vb/action/actions'], function (Actions) {
  'use strict';

  /**
   * Transforma un arreglo de sugerencias de la API de Google Places a un formato
   * de objeto 'Place' más simple y manejable para la aplicación.
   *
   * @param {GoogleSuggestion[]} [suggestions] - El arreglo de sugerencias obtenido de la API. Si no es un arreglo, se retornará uno vacío.
   * @returns {Place[]} Un nuevo arreglo de objetos con el formato 'Place'.
   */
  function transformAutocomplete(suggestions) {
    if (!Array.isArray(suggestions)) {
      return [];
    }
    return suggestions.map(suggestion => ({
      id: suggestion?.placePrediction?.placeId,
      displayName: { text: suggestion?.placePrediction?.text?.text },
      formattedAddress: suggestion?.placePrediction?.text?.text
    }));
  }

  /**
   * Crea un manejador de eventos "debounced" que solo activa un temporizador si se cumple una condición.
   * @param {Function} callback - La función que se ejecutará al final del tempor ...
   * @param {Function} conditionFunc - Una función que recibe el valor y devuelve true si la condición se cumple.
   * @param {number} [delay=1000] - El tiempo de espera en milisegundos. El valor por defecto es 1000.
   * @returns {Function} Un manejador de eventos listo para usar que acepta un único valor como argumento.
   */
  function createConditionalDebouncer(callback, conditionFunc, delay = 1000) {
    let timerId;

    return function (value) {
      clearTimeout(timerId);
      if (conditionFunc(value)) {
        timerId = setTimeout(() => { callback(value); }, delay);
      }
    };
  }

  /**
   * Generador de UUID v4 utilizando la API nativa y criptográficamente segura del navegador.
   * @returns {string} Un UUID v4.
   */
  function generateUUID() {
    return crypto.randomUUID();
  }

  /**
   * Controlador de notificaciones para generar valores default y garantizar un estandar en el tipo de errores.
   * @param {Object} context - Contexto heredado del Action chain.
   * @param {Error} error - Error recuperado de la función.
   */
  function fireNotification(context, error) {
    Actions.fireNotificationEvent(context, {
      summary: error,
      message: error?.message ?? "Contactar al adminsitrador.",
      type: error?.type ?? "error",
    });
  }

  return {
    createConditionalDebouncer,
    transformAutocomplete,
    generateUUID,
    fireNotification
  };

});