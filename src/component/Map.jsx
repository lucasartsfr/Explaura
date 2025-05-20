import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import Gpx from './Gpx';

import Position from './Position';
import React, { useContext } from 'react';
import * as L from "leaflet";
import { useMapStore } from '../store';
import Markers from './Markers/Markers';

function Map() {
  // use Context Provider 
  const {BOUNDS, MOBILE, MAP_SETTINGS, CUSTOM_LAYER, CUSTOM_OVERLAY} = useMapStore()


  return (
        <MapContainer 
          preferCanvas={true} 
          renderer={L.canvas()} 
          minZoom={MAP_SETTINGS.MINZOOM} 
          maxZoom={MAP_SETTINGS.MAXZOOM} 
          maxBounds={BOUNDS} 
          maxBoundsViscosity={MAP_SETTINGS.VISCOSITY} 
          center={MAP_SETTINGS.CENTER} 
          zoom={MAP_SETTINGS.ZOOM} 
          scrollWheelZoom={true}
        >
          
          <TileLayer 
            maxNativeZoom={MAP_SETTINGS.MAXZOOM} 
            key={CUSTOM_LAYER?._url} 
            url={CUSTOM_LAYER?._url}
          />
          {
            CUSTOM_OVERLAY && 
            <TileLayer 
              opacity={0.5} 
              zIndex={100} 
              key={CUSTOM_OVERLAY?._url} 
              url={CUSTOM_OVERLAY?._url} 
              maxNativeZoom={CUSTOM_OVERLAY?.options?.maxNativeZoom}
            />
          }      
          <Markers/>
                  
            {
              !MOBILE && <Gpx />
            }
            <Position />
          
        </MapContainer>
  );
}

export default Map;
