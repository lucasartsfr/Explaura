import React, {useEffect}  from 'react';
import {useMap, useMapEvents, Marker} from 'react-leaflet';
import * as L from "leaflet";
import 'leaflet-gpx'; // Doit venir *après* leaflet
import { useExplauraStore, useGpxStore, useMapStore } from '../store';

function Gpx(props) {
    const map = useMap();

    const {GPX, MOVE, PREVIOUS_GPX, setPREVIOUS_GPX, getGPXContent, setGPX_DATA, GPX_DATA, resetGPX} = useGpxStore()
    const {SELECTED_INDEX, setSELECTED_INDEX, SELECTED_INFO, setSELECTED_INFO, getFilePreview} = useExplauraStore();
    const {MOBILE, LIST_ICON} = useMapStore()
    // Function Parse Data
    const ParseGpxData = (e) => {
       

        let coordinates = [];
  
        // Vérifier que les layers existent
        if (e.target.getLayers && e.target.getLayers().length > 0 && e.target.getLayers()[0]._layers) {
          // Parcourir tous les layers pour trouver les coordonnées
          const layers = e.target.getLayers()[0]._layers;
          
          // Itérer sur les layers
          Object.values(layers).forEach(layer => {
            // Si la couche a des coordonnées (comme une polyline)
            if (layer.getLatLngs) {
              const points = layer.getLatLngs();
              coordinates = coordinates.concat(points);
            }
          });
        }


    // Mobile GPX Temp
    let GpxData = {
        TotalTime : (e.target.get_duration_string_iso(e.target.get_moving_time())),
        MinElevation : e.target.get_elevation_min(),
        MaxElevation : e.target.get_elevation_max(),
        Denivele : (e.target.get_elevation_max() - e.target.get_elevation_min()),
        GainElevation : (e.target.get_elevation_gain()).toFixed(0),
        LossElevation : e.target.get_elevation_loss(),
        ElevationData : e.target.get_elevation_data(),
        Distance : ((e.target.get_distance()/1000).toFixed(2)),
        SpeedAverage : (e.target.get_total_speed().toFixed(2)),
        SpeedData : e.target.get_speed_data(),
        SpeedMax : e.target.get_speed_max(),
        MovingSpeed : e.target.get_moving_speed(),
        MovingTime : (e.target.get_moving_time()/1),
        MovingPace : (e.target.get_duration_string_iso(e.target.get_moving_pace())),
        Start : e.target.get_start_time(),
        End : e.target.get_end_time(),
        MinutePerKm : (e.target.get_duration_string_iso( (e.target.get_moving_time() / (e.target.get_distance()/1000).toFixed()) ).split(".")[0]),
        Heart : e.target.get_average_hr(),
        Cadence : e.target.get_average_cadence(),
        CadenceData : e.target.get_cadence_data(),
        LatLngSvg : coordinates
    }        

    // Elevation
    let ElevationArray = [];
    let ElevationLabel = [];
    for(let i = 0; i < GpxData.ElevationData.length; i++){
            ElevationArray.push(GpxData.ElevationData[i][1].toFixed(2)); 
            ElevationLabel.push(GpxData.ElevationData[i][0].toFixed(2)+" km"); 
    }

    // Vitesse moyenne corrigée en mouvement (Supprime les petits mouvements)
    let UpdSpd = 0;
    let CountUpdSpd = 0;
    let Precision = 1;
    let MinSpeed = 3;
    for(let i = 0; i < GpxData.SpeedData.length; i++){
        if(i > 0 && GpxData.SpeedData[i][1] < MinSpeed && (GpxData.SpeedData[i][0].toFixed(Precision)) === (GpxData.SpeedData[(i-1)][0].toFixed(Precision))){}        
        else{
            UpdSpd = UpdSpd + parseFloat(GpxData.SpeedData[i][1])
            CountUpdSpd++;
        }
    }
    GpxData.MovingSpeedUpdated = parseFloat((UpdSpd/CountUpdSpd).toFixed(2)) 

    return {ElevationArray, ElevationLabel, GpxData}
    }
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

    const MobileDefined = (MOBILE === undefined) ? null : MOBILE;
    // Add Layer

    useEffect(()=>{ 
        SELECTED_INFO && getGPXContent(SELECTED_INFO?.$id); // Get the GPX
        const Id = map._leaflet_id; // Get ID of THIS map
        ( PREVIOUS_GPX[Id] && map.hasLayer( PREVIOUS_GPX[Id])) &&  PREVIOUS_GPX[Id].removeFrom(map); // If Layer Exist REMOVE from the map
        const DrawGpx = (GPX) && new L.GPX(GPX, { 
            async: true,
            polyline_options: { 
                color: "#f4ff00", 
                weight: 3, 
                opacity: 1.0, 
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
            (MOBILE === undefined || MOBILE) ? 
            map.fitBounds(e.target.getBounds(), {paddingTopLeft: [0, 0]}) : // Zoom to GPX  Mobile   
            map.fitBounds(e.target.getBounds(), {paddingTopLeft: [400, 0]}); // Zoom to GPX  Desktop    
            setGPX_DATA(ParseGpxData(e)) // Save GPX Data to State
        }).addTo(map);
        (SELECTED_INFO?.$id === "") && map.setView(SELECTED_INFO.COORD); // Zoom to map if no GPX 
   
        setPREVIOUS_GPX(Id, DrawGpx)
    }, [SELECTED_INFO, GPX])

    const ToReturn = (SELECTED_INFO) && (
        <>
            <Marker draggable={true} icon={LIST_ICON.MOVE} position={MOVE} />
            <Marker icon={LIST_ICON.PARKING} position={SELECTED_INFO.PARKING} />
            <Marker icon={LIST_ICON.INTEREST} position={SELECTED_INFO.COORD} />
        </>
    )

  return ( ToReturn );
}

export default React.memo(Gpx);
