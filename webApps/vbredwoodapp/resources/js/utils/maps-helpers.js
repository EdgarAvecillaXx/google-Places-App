define(["types/customErrors"], (CustomErrors) => {
  'use strict';

  const GOOGLE_MAPS_API_BASE_URL = 'https://maps.googleapis.com/maps/api/js';

  /**
   * Inicializa la instancia del mapa de Google en el contenedor del DOM.
   * @private
   */
  function initMap(mapCenter) {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer && !window.google) {
      throw new CustomErrors.GoogleMapsScriptError(
        "Hubo un problema al mostrar el mapa. Por favor, intenta recargar la página.",
        { devMessage: "initMap failed: The container '#mapContainer' was not found or 'window.google' was not available." });
    }

    return new window.google.maps.Map(mapContainer, {
      center: mapCenter,
      zoom: 12,
    });
  }

  /**
   * Carga el script de la API de Google Maps envolviendo la lógica en una promesa.
   * @private
   */
  function loadGoogleMapsScript(apiKey) {
    if (!apiKey) {
      return Promise.reject(new CustomErrors.GoogleMapsScriptError(
        'No pudimos conectar con el servicio de mapas debido a un problema de configuración. Por favor, intenta de nuevo más tarde.',
        { devMessage: 'Config Error: API Key was not provided.' }));
    }



    return new Promise((resolve, reject) => {
      let timeoutId = null;

      timeoutId = setTimeout(() => {
        reject(new CustomErrors.GoogleMapsScriptError(
          'La carga del mapa está tardando demasiado. Por favor, revisa tu conexión a internet.',
          { devMessage: 'Google Maps script load timed out after 15 seconds.' }
        ));
      }, 15000);

      const scriptUrl = `${GOOGLE_MAPS_API_BASE_URL}?key=${apiKey}&libraries=places`;
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        clearTimeout(timeoutId);
        resolve();
      };

      script.onerror = () => {
        clearTimeout(timeoutId);
        reject(new CustomErrors.GoogleMapsScriptError(
          'No pudimos conectar con los servicios de mapas. Por favor, revisa tu conexión a internet e inténtalo de nuevo.',
          { devMessage: 'script.onerror triggered. Could be a network issue, CORS, or an invalid API key.' }));
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * Obtiene la posición del usuario envolviendo la API de Geolocalización en una promesa.
   * @private
   */
  function getCurrentPosition(options) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new CustomErrors.GeolocationError(
          'Tu navegador actual no es compatible con esta función. Te recomendamos usar una versión actualizada.',
          { devMessage: 'navigator.geolocation is not supported by this browser.' }));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, (error) => {
        reject(new CustomErrors.GeolocationError(
          'Para continuar, asegúrate de haber concedido los permisos de ubicación en tu navegador e inténtalo de nuevo.',
          {
            devMessage: 'Geolocation API failed with code ${error.code}: ${error.message}',
            code: error.code
          }
        ));
      }, options);
    });
  }



  return {
    loadGoogleMapsScript,
    getCurrentPosition,
    initMap
  };

});
