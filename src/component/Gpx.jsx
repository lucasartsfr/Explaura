import React, {useEffect}  from 'react';
import {useMap, useMapEvents, Marker} from 'react-leaflet';
import * as L from "leaflet";
import { useGpxStore, useMapStore } from '../store';

function Gpx(props) {
    const TheMap = useMap();
    const {selectInfo, setGpxData, AllIcons, setSelectInfo, setSelectIndex} = props; 

    const {MOVE, PREVIOUS_GPX, setPREVIOUS_GPX} = useGpxStore()
    const {MOBILE} = useMapStore()
    // Function Parse Data
    const ParseGpxData = (e, GpxDataBind) => {
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
        LatLngSvg : e.target._LatLngSvg
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
            setSelectInfo(null)
            setGpxData(null)
            setSelectIndex()
        }
    });

    const MobileDefined = (MOBILE === undefined) ? null : MOBILE;
    // Add Layer

    useEffect(()=>{ 
        const Id = TheMap._leaflet_id; // Get ID of THIS map
        const ThisLayer = PREVIOUS_GPX[Id]; // Get the PREVGPX based on ID THIS map
        // console.log("Map Id :"+TheMap._leaflet_id);
        (ThisLayer && TheMap.hasLayer(ThisLayer)) && ThisLayer.removeFrom(TheMap); // If Layer Exist REMOVE from the map
        
        const GpxNameFormat = selectInfo?.Infos.Gpx; // Check if SelectInfo Exist and if has GPX
        const DrawGpx = (GpxNameFormat && !MobileDefined) && new L.GPX(`gpx/${GpxNameFormat}.gpx`, { 
            async: true,
            polyline_options: { color: "#f4ff00" , weight: 3, opacity: 1.0, className:`PathDesktop PathDesktop-${Id}`},
            marker_options: { startIconUrl: AllIcons.StartIcon.options.iconUrl, endIconUrl: AllIcons.EndIcon.options.iconUrl, shadowUrl: null, iconSize: [50,50] }
        }).on('loaded', function(e) {
            // console.log(mobile);
            (MOBILE === undefined || MOBILE) ? 
            TheMap.fitBounds(e.target.getBounds(), {paddingTopLeft: [0, 0]}) : // Zoom to GPX  Mobile   
            TheMap.fitBounds(e.target.getBounds(), {paddingTopLeft: [400, 0]}); // Zoom to GPX  Desktop    
            setGpxData(ParseGpxData(e)) // Save GPX Data to State
        }).addTo(TheMap);

        (GpxNameFormat === "") && TheMap.setView(selectInfo?.Infos.Coord); // Zoom to map if no GPX 

        //setPrevGpx(prevState => ({...prevState, [Id] : DrawGpx})); // Save Prev State       
        setPREVIOUS_GPX(Id, DrawGpx)
    }, [selectInfo]) // eslint-disable-line react-hooks/exhaustive-deps

    const ToReturn = (selectInfo && !MobileDefined) && (
        <>
            <Marker draggable={true} icon={AllIcons.MoveIcon} position={MOVE} />
            <Marker icon={AllIcons.ParkingIcon} position={selectInfo.Infos.Parking} />
            <Marker icon={AllIcons.InterestIcon} position={selectInfo.Infos.Coord} />
        </>
    )

  return ( ToReturn );
}

export default React.memo(Gpx);
