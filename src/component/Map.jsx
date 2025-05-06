import { MapContainer, TileLayer } from 'react-leaflet';
import Gpx from './Gpx';
import Markers from './Markers';
import Position from './Position';
import React, { useContext } from 'react';
import * as L from "leaflet";
import { useMapStore } from '../store';

function Map() {
  // use Context Provider 
  const {BOUNDS, MOBILE, MAP_SETTINGS, CUSTOM_LAYER} = useMapStore()

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
            key={MAP_SETTINGS.URL} 
            url={MAP_SETTINGS.URL}
          />
          {
            CUSTOM_LAYER && 
            <TileLayer opacity={0.5} zIndex={100} key={CUSTOM_LAYER._url} url={CUSTOM_LAYER._url} maxNativeZoom={CUSTOM_LAYER.options.maxNativeZoom}/>
          }      
          <Markers/>
                  
            <Gpx />
            {/* <Position /> */}
          
        </MapContainer>
  );
}

export default Map;
