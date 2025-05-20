import React, {useEffect}  from 'react';
import {useMap, useMapEvents, Marker} from 'react-leaflet';
import * as L from "leaflet";
import 'leaflet-gpx'; // Doit venir *après* leaflet
import { useExplauraStore, useGpxStore, useMapStore } from '../store';

function Gpx(props) {
    const map = useMap();

    const {GPX, MOVE, PREVIOUS_GPX, setPREVIOUS_GPX, getGPXContent, setGPX_DATA, GPX_DATA, resetGPX, PARSE_GPX_DATA} = useGpxStore()
    const {setSELECTED_INDEX, SELECTED_INFO, setSELECTED_INFO} = useExplauraStore();
    const {MOBILE, LIST_ICON} = useMapStore()

    // Update Path Animation on ZoomEnd
    useMapEvents({
        zoomend: (e) => {
            var Id = e.target._leaflet_id;
            setTimeout(()=>{
                let LengthPath = document.querySelector('.PathDesktop-'+Id)?.getTotalLength();     
                document.documentElement.style.setProperty(`--DesktopPathLength${Id}`, (LengthPath + (LengthPath*0.5) ));  
            },500)
        },
        popupclose: (e) =>{ 
            setSELECTED_INFO(null)
            setGPX_DATA(null)
            setSELECTED_INDEX(null)
            resetGPX(null)
        }
    });


    useEffect(()=>{         
        const Id = map._leaflet_id; // Get ID of THIS map

        SELECTED_INFO && getGPXContent(SELECTED_INFO?.$id); // Get the GPX
        ( PREVIOUS_GPX[Id] && map.hasLayer(PREVIOUS_GPX[Id])) &&  PREVIOUS_GPX[Id].removeFrom(map); // If Layer Exist REMOVE from the map

        const DrawGpx = (GPX) && new L.GPX(GPX, { 
            async: true,
            polyline_options: { 
                color: "#000000", 
                weight: 4, 
                opacity: 1.0, 
                lineCap: 'round',
                smoothFactor : 3,
                className:`PathDesktop PathDesktop-${Id}`
            },
            markers: { 
                startIcon: LIST_ICON.START.options.iconUrl, 
                endIcon: LIST_ICON.END.options.iconUrl, 
            },
            marker_options: { 
                shadowUrl: null, 
                iconSize: [50,50] 
            }
        }).on('loaded', function(e) {
            const Padding = (MOBILE) ? 0 : 400
            map.fitBounds(e.target.getBounds(), {paddingTopLeft: [Padding, 0]}); // Zoom to GPX  Desktop    
            setGPX_DATA(PARSE_GPX_DATA(e)) // Save GPX Data to State
        }).addTo(map);

        (SELECTED_INFO) && map.setView(SELECTED_INFO.COORD); // Zoom to map if no GPX    
        setPREVIOUS_GPX(Id, DrawGpx)
        
    }, [SELECTED_INFO, GPX])

    const ToReturn = (SELECTED_INFO && GPX) && (
        <>
            <Marker draggable={false} icon={LIST_ICON.MOVE} position={MOVE} />
            <Marker icon={LIST_ICON.PARKING} position={SELECTED_INFO.PARKING} />
            <Marker icon={LIST_ICON.INTEREST} position={SELECTED_INFO.COORD} />
        </>
    )

  return ( ToReturn );
}

export default React.memo(Gpx);
