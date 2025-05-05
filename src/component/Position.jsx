import {useMap} from 'react-leaflet';
import React from 'react';
import {useEffect} from 'react';
import { useMapStore } from '../store';

function Position(){
    
    const map = useMap();
    // Get User location on Load
    useEffect(() => { 
        map.locate().on('locationfound', function (e) { 
            useMapStore.setState({ USER_POSITION: {lat : e.latitude, lng : e.longitude} });
        })          
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    return null
}

export default React.memo(Position);