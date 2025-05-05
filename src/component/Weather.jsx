import React, { useContext } from 'react';
import { ExplauraContext } from '../App';

export default function Weather(){

    const {selectInfo, weatherData} = useContext(ExplauraContext);

     // Weather Data
     const SmallWeatherData = (selectInfo && weatherData) && weatherData.map((item) => {
        const WeatherLat = parseFloat(item.Coord.Lat);
        const WeatherLng = parseFloat(item.Coord.Lng);
        const SelectInfoLat = parseFloat(selectInfo.Infos.Coord.lat.toFixed(1));
        const SelectInfoLng = parseFloat(selectInfo.Infos.Coord.lng.toFixed(1));
        
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