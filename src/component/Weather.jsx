import React from 'react';
import { useExplauraStore } from '../store';

export default function Weather(){

    const {SELECTED_INFO, WEATHER} = useExplauraStore()
     // Weather Data
     const SmallWeatherData = (SELECTED_INFO && WEATHER) && WEATHER.map((item) => {
        const WeatherLat = parseFloat(item.Coord.Lat);
        const WeatherLng = parseFloat(item.Coord.Lng);
        const SelectInfoLat = parseFloat(SELECTED_INFO.COORD[0].toFixed(1));
        const SelectInfoLng = parseFloat(SELECTED_INFO.COORD[1].toFixed(1));
        
        const ToReturn = (WeatherLat === SelectInfoLat && SelectInfoLng === WeatherLng ) && 
            (<div className='Info-weather-small' key="Item">
                <div key="Item" className='Info-Weather-Numbers-small'>
                    <span className='Info-Weather-Temp-small'>{parseInt(item.Temp)}°C</span>
                    <img alt="Weather Icon" src={`Theme/Weather/Google/${item.Icone}.png`} />
                </div>
            </div>)
        return ToReturn;
    })


    return(
        <>
            {SmallWeatherData}
        </>
    )
}