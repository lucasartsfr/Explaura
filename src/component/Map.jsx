import { MapContainer, TileLayer } from 'react-leaflet';
import Gpx from './Gpx';
import Markers from './Markers';
import Position from './Position';
import React, { useContext } from 'react';
import * as L from "leaflet";
import { ExplauraContext } from '../App';
import { useMapStore } from '../store';

function Map() {
  // use Context Provider 
  const  {AllIcons, customLayer, xplaura, selectIndex, setSelectIndex, setSelectInfo, selectInfo, setGpxData, prevGpx, setPrevGpx} = useContext(ExplauraContext);

  const {BOUNDS, MOBILE, MAP_SETTINGS} = useMapStore()

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
          {/* {
            customLayer && 
            <TileLayer opacity={0.5} zIndex={100} key={customLayer._url} url={customLayer._url} maxNativeZoom={customLayer.options.maxNativeZoom}/>
          }       */}
          <Markers 
            setSelectInfo={setSelectInfo}
          />
                  
            {/* <Gpx 
              selectInfo={selectInfo} 
              setGpxData={setGpxData} 
              prevGpx={prevGpx}
              setPrevGpx={setPrevGpx}
              setSelectInfo={setSelectInfo}
              AllIcons={AllIcons}
              setSelectIndex={setSelectIndex}
              mobile={MOBILE}
            /> */}

            {/* <Position /> */}
          
        </MapContainer>
  );
}

export default Map;
