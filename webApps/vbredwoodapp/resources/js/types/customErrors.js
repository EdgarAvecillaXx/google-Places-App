define(["types/customErrors"], (CustomErrors) => {
  'use strict';

  /**
   * Clase base para todos los errores controlados de la aplicación.
   * @extends {Error}
   */
  class ApplicationError extends Error {
    constructor(message, options) {
      super(message, options);
      this.name = 'ApplicationError';
      this.summary = 'No se pudo completar la solicitud';
    }
  }

  /**
   * Representa un error que ocurre durante la carga del script de la API de Google Maps.
   * Se debe usar cuando el script falla al cargar, por ejemplo, debido a una clave de API
   * inválida o a problemas de red.
   * @extends {ApplicationError}
   */
  class GoogleMapsScriptError extends ApplicationError {

    constructor(message, options) {
      super(message,options);
      this.name = 'GoogleMapsScriptError';
      this.title = 'No se pudo cargar el mapa';
      this.type = 'error';
    }
  }

  /**
   * Representa un error relacionado con la API de Geolocalización del navegador.
   * Se debe usar cuando no se puede obtener la ubicación del usuario, ya sea por falta de
   * soporte del navegador, denegación de permisos o fallos en la API.
   * @extends {ApplicationError}
   */
  class GeolocationError extends ApplicationError {
    constructor(message, options) {
      super(message, options);
      this.name = 'GeolocationError';
      this.title = 'No se pudo obtener la geolocalización';
      this.type = 'warning';
    }
  }

  return {
    GeolocationError,
    GoogleMapsScriptError
  };
});