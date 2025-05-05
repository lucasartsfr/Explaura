import React, {useEffect, useRef}  from 'react';
import {Popup, Marker, useMap} from 'react-leaflet';
import * as L from "leaflet";
import { useExplauraStore } from '../store';

function Markers(props) {

  const{FILTRES} = useExplauraStore();

  const markerRef = useRef([]); // Create A Ref for Marker
  const map = useMap();
  const IconSize = 50; // Global Icon size
  const {xplaura, mobile, selectIndex, setSelectIndex, setSelectInfo} = props;

  // Icon Settings (Default Parameters)
  const IconSettings = {
    iconSize: [IconSize, IconSize],
    iconAnchor: [IconSize/2, IconSize],    
    shadowUrl : `Markers/marker-shadow.png`,
    shadowAnchor: [IconSize/2, IconSize], 
    shadowSize:   [IconSize, IconSize],
    popupAnchor: [0, -IconSize],
  }

  // Icon on Focus
  const MarkerIconFocus = L.icon({...IconSettings, className: "Focus-Marker", iconUrl: `Markers/interest.png`});

  
  // Update Focus Marker on Select Change
  useEffect(() => {  
    // Fix Null == 0
    if(selectIndex || selectIndex === 0){
        const ThisMarker = markerRef.current[selectIndex];     
        ThisMarker?.openPopup().setIcon(MarkerIconFocus); // If markerRef Exist, set Focus Icon 
        // If mobile is false, FitBound for desktop
        (!mobile) ? 
        map.fitBounds([ThisMarker?.getLatLng(), ThisMarker?.getLatLng()], {maxZoom : 14, paddingTopLeft: [400, 0], animate: true, duration: 0.5 }) : 
        map.setView(ThisMarker?.getLatLng(), map.getZoom(), {animate: true, duration: 0.5 }); // Animate Map Move (Also can use flyTo)  
    }
  },[selectIndex]); // eslint-disable-line react-hooks/exhaustive-deps


  // Action on Marker Click
  const ClickMarker = (e) => {
    const SelectedIndex = parseInt(e.target.options["index"]); // Get index of marker = 2 or 3 or 5
    setSelectIndex(SelectedIndex) // Set select item index as STATE
  }


  // Click Button More Info 
  const ClickButton = (e) => {
    const SelectedInfos = xplaura[Object.keys(xplaura)[selectIndex]];
    setSelectInfo({"Infos" : SelectedInfos, "Name" : Object.keys(xplaura)[selectIndex]}); // Save infos of this marker
    setTimeout(()=>{ document.getElementById('InfoContainer').scrollIntoView(); },10) // Delay First click on A not Working
  }

  // Create All Markers
  const MarkerPosition = Object.keys(xplaura).map((item, index)=>{
    const Coord = xplaura[item].Coord // Get Each Item Coords
    const Type = xplaura[item].Type;
    const FormatId = item.replaceAll(' ', '').replaceAll("'",""); // "Puy de Dome = PuydeDome" or Puy de L'angle = PuydeLangle
    const DynamicIcon = L.icon({...IconSettings, iconUrl: `Markers/Types/${Type}.png`,});
    const ToReturn = (FILTRES === Type ||FILTRES === null) && 
    <Marker 
      icon={DynamicIcon} // Icon Style (Dynamic for Type)
      eventHandlers={{click: ClickMarker}} // Event for Markers       
      data-id={item} // data-id="Puy de Dome"
      index={index} // index="2"
      id={`ID-${FormatId}`} // id="ID-Puydedome"
      key={item} // Key For Loop React
      position={Coord} // posioptn="lat:x,lng:y"
      ref={thisMarker => markerRef.current[index] = thisMarker} // Ref for Each Markers
    >
      <Popup autoPan={false} id={`popup-${item}`}>
        {item}
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
