import React, { useContext } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer} from 'react-leaflet';

import {FaHeartbeat as Heart} from "react-icons/fa";
import {FaHiking as Hiking} from "react-icons/fa";
import {AiFillClockCircle as Clock} from "react-icons/ai";
import {IoIosSpeedometer as Speed} from "react-icons/io";
import {TbWaveSine as Rythme} from "react-icons/tb";
import {TbChartLine as Elevation} from "react-icons/tb";

import useEmblaCarousel from 'embla-carousel-react';

import Gpx from './Gpx';
import { ExplauraContext } from '../App';
import Weather from './Weather';
import Like from './Like';
import { useExplauraStore, useMapStore } from '../store';

function Info(){
    const {SELECTED_INFO, RATE_EMOJI, getFilePreview} = useExplauraStore()
    const {MAP_SETTINGS} = useMapStore()
    const {selectInfo, customLayer, setSelectIndex, setGpxData, gpxData, AllIcons, prevGpx, setPrevGpx, setMove, move, Init, setSelectInfo} = useContext(ExplauraContext);
    const [emblaRef] = useEmblaCarousel();
    useEmblaCarousel.globalOptions = { loop: true, speed: 100, dragFree: false }

    // Check if GPX is Selected and Generate Array [Altitude, Distance]
    const Data = (gpxData) && gpxData.ElevationArray.map((item, index) => {
        const Data = {
                Distance : parseFloat(gpxData.ElevationLabel[index]),
                Altitude : parseInt(item)
            }        
        return Data
    })
    const ShowChart = (Data) ? "ShowChart" : "HideChart";
    
    // HoverChart to get Lat and Lng for Move Marker every 10ms
    var NoSpam;
    const HoverChart = (e) =>{
        clearTimeout(NoSpam);
        NoSpam = setTimeout(()=>{
            (e.activeTooltipIndex) && setMove(gpxData.GpxData.LatLngSvg[e.activeTooltipIndex]);
        },10);
        
    }

    // Generate Stat (x3) DIV
    const InfoStat = (SELECTED_INFO) && SELECTED_INFO.INFOS.map((stat, index)=>{
        return(
            <div key={index} className='Info-stat'>
                <h3>{stat.split('-')[0]}</h3>
                <span>{stat.split('-')[1]}</span>
            </div>
        )
    });

    // Slidehow V2
    const EmblaSlideshow = (SELECTED_INFO) ? SELECTED_INFO.PHOTOS.map((IdImage, index)=>{
        return(
            <div key={index} className='Slideshow-img embla__slide'>
                <img alt={SELECTED_INFO.NAME} src={`images/${SELECTED_INFO.NAME}/${IdImage}`} />
            </div>
        )
    }) : <div className='Slideshow-img embla__slide' style={{backgroundImage : `url(${`Images/Explaura/1.jpg`})`}}> </div>;


    // Avis / Note
    const Rating = (SELECTED_INFO) && RATE_EMOJI.map((item, index) => {
        const Focus = (SELECTED_INFO.RATE === index) ? "FocusEmoji" : ""
        return <span className={`Info-Emoji ${Focus}`} key={index}>{item}</span>
    })

    // Custom ToolTip Data
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className="custom-tooltip">
              <p className="label">{`Distance : ${label}km`}</p>
              <p className="intro">{`Altitude : ${payload[0].value}m`}</p>
            </div>
          );
        }
    }

    
    // Gpx data Binding
    const BindGpxData = (gpxData) && ['Heart','Distance','TotalTime','MinutePerKm','GainElevation','MovingSpeedUpdated'].map((item, index)=>{
        const Assoc = ['BPM','KM','DURÉE','MIN/KM','METRES','KM/H']
        const Icons = [<Heart className='fa-beat'/>,<Hiking className='fa-bounce'/>, <Clock className='fa-spin'/>,<Rythme className='fa-beat'/>, <Elevation className='fa-bounce'/>, <Speed className='fa-shake'/>]
        return(
            <div key={index} className='data-gpx'>
                <span className='Icons'>{Icons[index]}</span>
                <h4>{gpxData.GpxData[item]}</h4>
                <span className='name'>{Assoc[index]}</span>
            </div>
        )
    })

    // Block Parent Scroll
    const BlockScroll = (e) =>{ document.querySelector('.App ').classList.add('BlockScroll') }
    const AllowScroll = (e) =>{ document.querySelector('.App ').classList.remove('BlockScroll') }

      return(
        <div className="Info-scroller">
            <Like />
            <Weather />
            <div className='Slideshow-container' key={SELECTED_INFO?.$id} ref={emblaRef}>
                    <div className={`Slideshow-element embla__container`}>
                        {EmblaSlideshow}
                    </div>
               <img alt="Smoke" className='Slideshow-smoke' src={`image/theme/smoke.png`}></img>
            </div>
            <div className='Info-container'>
                <div className='Info-Header'>                
                    <div className='Info-type'>
                        <img alt={SELECTED_INFO?.TYPE} src={getFilePreview("type-"+SELECTED_INFO?.TYPE)}></img>
                    </div>

                    <div className='Info-data'>
                        <h1>{SELECTED_INFO?.NAME || Init.Name}</h1>
                        <p>{SELECTED_INFO?.DESCRIPTION || Init.Description}</p>
                        <div className='Info-stats'>
                            {InfoStat}
                        </div>
                    </div>
                </div>
                 {/* Map */}
                <div className='Info-map' id='Info-map'>
                    <MapContainer center={{lat:45.592104,lng:2.844146}} zoom={13} scrollWheelZoom={true}>
                        <TileLayer maxNativeZoom={MAP_SETTINGS.MAXZOOM} key={MAP_SETTINGS.URL} url={MAP_SETTINGS.URL}/>
                        { 
                            customLayer && 
                            <TileLayer zIndex={100} opacity={0.5} key={customLayer._url} url={customLayer._url} maxNativeZoom={customLayer.options.maxNativeZoom}/>
                        }      
                            <Gpx 
                                selectInfo={selectInfo} 
                                setGpxData={setGpxData}
                                setPrevGpx={setPrevGpx}
                                prevGpx={prevGpx}
                                AllIcons={AllIcons}
                                move={move}
                                setSelectInfo={setSelectInfo}
                                setSelectIndex={setSelectIndex}
                            />                                        
                    </MapContainer>

                </div>
                 {/* Data GPX */}
                <div className='Info-gpx'>
                    {BindGpxData}
                </div>

                {/* {WeatherData} */}

                <div className='Info-button'></div>

                <div onTouchStart={BlockScroll} onTouchEnd={AllowScroll} className={`Info-chart ${ShowChart}`}>
                    {Data && <ResponsiveContainer>
                    <AreaChart onMouseMove={HoverChart} data={Data} margin={{top: 10,right: 30,left: 0,bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis scale="auto" dataKey="Distance" type="number" axisLine={false} unit="km" tickLine={false}  domain={['dataMin', 'dataMax']}/>
                        <YAxis dataKey="Altitude" type="number" axisLine={false} unit="m"  tickLine={false} domain={['dataMin', 'dataMax']}/>
                        <Tooltip content={<CustomTooltip />} formatter={(value, name, props) => [value+"m", name]}/>
                        <Area type="monotone" dataKey="Altitude" stroke="#2b2b2b" fill="#2b2b2b"/>
                    </AreaChart>
                    </ResponsiveContainer>
                    }
                </div>                    

                {/* Note & Review  */}
                {SELECTED_INFO && <div className='Info-note'>
                    <div className='Info-Review'>
                        <div className='Info-Review-User'>
                            <img alt="User" src={`image/theme/type/user.png`}/> 
                        </div>
                        <div className='Info-Review-Text'>
                            {SELECTED_INFO?.REVIEW || Init.Review}
                        </div>                        
                    </div>                    
                    <div className='Info-Smiley'>{Rating}</div>
                </div> 
                }    
            { SELECTED_INFO && 
                <a className='Info-DepartLink' rel="noreferrer" href={`https://www.google.com/maps/place/${SELECTED_INFO.PARKING[0]}+${SELECTED_INFO.PARKING[1]}`} target="_blank">Aller au point de départ</a>
            }
            </div>
         </div> 
    )
}

export default React.memo(Info);