import React, {useEffect, useRef}  from 'react';
import {Popup, Marker, useMap} from 'react-leaflet';
import * as L from "leaflet";
import { useExplauraStore, useMapStore } from '../store';

function Markers() {

  const {FILTRES, SPOT, setSELECTED_INDEX, SELECTED_INDEX,setSELECTED_INFO, getFilePreview} = useExplauraStore();
  const {ICON_SETTINGS, MOBILE, LIST_ICON, ICON_DEFAULT} = useMapStore()

  const markerRef = useRef([]); // Create A Ref for Marker
  const map = useMap();
  

  // Update Focus Marker on Select Change
  useEffect(() => {  
    // Fix Null == 0
    if(SELECTED_INDEX || SELECTED_INDEX === 0){
        const ThisMarker = markerRef.current[SELECTED_INDEX];     
        ThisMarker?.openPopup().setIcon(LIST_ICON?.INTEREST); // If markerRef Exist, set Focus Icon 
        // If mobile is false, FitBound for desktop
        (!MOBILE) ? 
        map.fitBounds([ThisMarker?.getLatLng(), ThisMarker?.getLatLng()], {maxZoom : 14, paddingTopLeft: [400, 0], animate: true, duration: 0.5 }) : 
        map.setView(ThisMarker?.getLatLng(), map.getZoom(), {animate: true, duration: 0.5 }); // Animate Map Move (Also can use flyTo)  
    }
  },[SELECTED_INDEX]); // eslint-disable-line react-hooks/exhaustive-deps


  // Action on Marker Click
  const ClickMarker = (e) => {
    setSELECTED_INDEX(parseInt(e.target.options["index"]))
  }


  // Click Button More Info 
  const ClickButton = (e) => {
    const SelectedInfos = SPOT[Object.keys(SPOT)[SELECTED_INDEX]];
    setSELECTED_INFO(SelectedInfos)
    setTimeout(()=>{ document.getElementById('InfoContainer').scrollIntoView(); }, 10) // Delay First click on A not Working
  }


  const MarkerPosition = Object.keys(SPOT).map((item, index)=>{
    const Coord = SPOT[item].COORD;
    const Type = SPOT[item].TYPE;
    const DynamicIcon = L.icon({...ICON_DEFAULT, iconUrl: getFilePreview('marker-'+Type)});
    const ToReturn = (FILTRES === Type || FILTRES === null) && 
    <Marker 
      position={Coord} // posioptn="lat:x,lng:y"
      icon={DynamicIcon} // Icon Style (Dynamic for Type)
      eventHandlers={{click: ClickMarker}} // Event for Markers       
      data-id={item} // data-id="Puy de Dome"
      index={index} // index="2"
      id={`ID-${item}`} // id="ID-Puydedome"
      key={item} // Key For Loop React
      ref={thisMarker => markerRef.current[index] = thisMarker} // Ref for Each Markers
    >
      <Popup autoPan={false} id={`popup-${item}`}>
        {SPOT[item].NAME}
        <button onClick={ClickButton} className='ButtonPopup'>Voir la Fiche</button>
      </Popup>          
    </Marker>

    return ToReturn;
  })

  return (
        <>
          {MarkerPosition}
        </>
  );
}

export default React.memo(Markers);
