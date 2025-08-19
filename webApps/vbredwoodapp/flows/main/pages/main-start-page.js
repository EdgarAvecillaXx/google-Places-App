/* Copyright (c) 2024, Oracle and/or its affiliates */
define([
  'utils/maps-helpers',
  'utils/helpers',
  'types/customErrors'
  ], function (mapUtils, helpers,CustomErrors) {
    'use strict';

    class PageModule {
      constructor(context) {
        this.mapLoaderPromise = null; // Para asegurar que el script se carga solo una vez.
        this.eventHelper = context?.getEventHelper(); // Almacenar el manejador de eventos.

        // Creamos una instancia del manejador de debounce para la búsqueda.
        this.debouncedSearchHandler = helpers?.createConditionalDebouncer(
          (inputValue) => { this.eventHelper.fireCustomEvent('debouncedSearch', { value: inputValue }); },
          (inputValue) => !!inputValue && inputValue.length > 5,
          2000
        );
      }

      /**
       * Carga el script de Google Maps (si no se ha cargado) y luego inicializa el mapa
       * con la ubicación del usuario o una ubicación predeterminada.
       * @param {string} apiKey - Tu clave de API de Google Maps.
       * @param {{lat:number, lng:number}} mapCenter - coordenadas centrales del mapa.
       * @returns {Promise<google.maps.Map>} Una promesa que se resuelve con la instancia del mapa.
       */
      loadMapAndInit(apiKey, mapCenter) {
        // Si la carga ya está en progreso o completada, retorna la promesa existente.
        if (this.mapLoaderPromise) {
          return this.mapLoaderPromise;
        }

        // Creamos e iniciamos la promesa de carga completa y la guardamos.
        this.mapLoaderPromise = (async () => {
          try {
            await mapUtils.loadGoogleMapsScript(apiKey);
            const position = await mapUtils.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            });
            const {latitude, longitude} = position.coords; 
            if(typeof latitude !== "number" || typeof longitude !== "number"){
              throw new CustomErrors.GeolocationError(
                'Se obtuvo una repsuesta de ubicación inválida desde el navegador.',
                {devMessage: `Received invalid coordinates: lat=${latitude}, lng=${longitude}`}
              );
            }
            mapCenter.lat = latitude;
            mapCenter.lng = longitude;
            const map = mapUtils.initMap(mapCenter);
            map.addListener('idle', () => {
              const newCenter = map.getCenter();
              mapCenter.lat = newCenter.lat();
              mapCenter.lng = newCenter.lng();
            });

            return map;

          } catch (error) {
            if (typeof google != "undefined") {
              mapUtils.initMap(mapCenter);
            }
            throw error;
          }
        })();

        return this.mapLoaderPromise;
      }

      /**
       * Llama a la instancia creada del manejador de Debounce para la búsqueda
       * y controlar las llamadas de autocompletado.
       * @param {string} inputValue - Texto de búsqueda proporcionado por el usuario.
       */
      handleSearchInput(inputValue) {
        this.debouncedSearchHandler(inputValue);
      }
    }

    return PageModule;
  });