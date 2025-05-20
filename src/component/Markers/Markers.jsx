import React, { useEffect, useRef } from 'react';
import { Popup, Marker, useMap, useMapEvents } from 'react-leaflet';
import * as L from "leaflet";
import { useExplauraStore, useMapStore } from '../../store';
import "./Markers.css"

function Markers() {
  const { FILTRES, SPOT, setSELECTED_INDEX, SELECTED_INDEX, setSELECTED_INFO, getFilePreview } = useExplauraStore();
  const { ICON_DEFAULT, MOBILE, LIST_ICON } = useMapStore();

  const markerRef = useRef([]);
  const map = useMap();

  const createCustomIcon = (Type, index) => {
    return L.divIcon({
      html: `<div data-id="${index}" class="Marker-v3-dot" style="background-color : var(--${Type.toLowerCase()});"></div>`,
      className: 'Marker-v3',
      iconSize: ICON_DEFAULT.iconSize,
      iconAnchor: ICON_DEFAULT.iconAnchor,
      popupAnchor: ICON_DEFAULT.popupAnchor,
    });
  };

  // Marker Action
  const ClickMarker = (e, index) => {    
    setSELECTED_INDEX(index); //const markerIndex = parseInt(e.target.options["index"]);
  };

  // See more
  const ClickButton = (e, index) => {
    setSELECTED_INFO( SPOT[Object.keys(SPOT)[index]]);
    setTimeout(() => { document.getElementById('InfoContainer').scrollIntoView(); }, 10);
  };

  // Map Click
  const handlePopupClose = (e, index) => {
    const marker = markerRef.current[index];
    if (marker) {
      const Type = SPOT[Object.keys(SPOT)[index]].TYPE;
      marker.setIcon(createCustomIcon(Type, index));
    }
  };

  useMapEvents({
      click: (e) =>{ 
        setSELECTED_INDEX(null)
      }
  });

  useEffect(() => {
    if (SELECTED_INDEX !== null && SELECTED_INDEX !== undefined) {
      const marker = markerRef.current[SELECTED_INDEX];
      if (marker) {
        marker.openPopup().setIcon(LIST_ICON?.INTEREST_DIV);
        (!MOBILE) ? map.fitBounds([marker.getLatLng(), marker.getLatLng()], { maxZoom: 14, paddingTopLeft: [400, 0], animate: true, duration: 0.5 }) : map.setView(marker.getLatLng(), map.getZoom(), { animate: true, duration: 0.5 });
      }
    }
  }, [SELECTED_INDEX]);

  const MarkerPosition = Object.keys(SPOT).map((item, index) => {
    const Coord = SPOT[item].COORD;
    const Type = SPOT[item].TYPE;
    const CustomIcon = createCustomIcon(Type, index);
    const ToReturn = (FILTRES === Type || FILTRES === null) &&
      <Marker
        position={Coord}
        icon={CustomIcon}
        eventHandlers={{
          click: (e) => ClickMarker(e, index),
          popupclose: (e) => handlePopupClose(e, index),
        }}
        data-id={item}
        index={index}
        id={`ID-${item}`}
        key={item}
        ref={thisMarker => markerRef.current[index] = thisMarker}
      >
        <Popup autoPan={false} id={`popup-${item}`}>
          {SPOT[item].NAME}
          <button onClick={(e) => ClickButton(e, index)} className='ButtonPopup'>Voir la Fiche</button>
        </Popup>
      </Marker>;

    return ToReturn;
  });

  return <>{MarkerPosition}</>;
}

export default React.memo(Markers);
