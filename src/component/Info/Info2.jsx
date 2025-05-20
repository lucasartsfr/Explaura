import { useExplauraStore, useGpxStore, useMapStore } from "../../store";
import "./Info.css"
import {FaHeartbeat as Heart} from "react-icons/fa";
import {FaHiking as Hiking} from "react-icons/fa";
import {AiFillClockCircle as Clock} from "react-icons/ai";
import {IoIosSpeedometer as Speed} from "react-icons/io";
import {TbWaveSine as Rythme} from "react-icons/tb";
import {TbChartLine as Elevation} from "react-icons/tb";
import { FaStar, FaRegStar, FaStarHalf } from "react-icons/fa";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useQuery } from '@tanstack/react-query';
import Coord from "../Coord/Coord";
import { MapContainer, TileLayer } from "react-leaflet";
import Gpx from "../Gpx";
import Chart from "../Chart/Chart";

export default function Info2() {
    const {SELECTED_INFO, SELECTED_INFO_DEFAULT, RATE_EMOJI, getFilePreview} = useExplauraStore()
    const {MAP_SETTINGS, CUSTOM_LAYER, MOBILE} = useMapStore()
    const {GPX_DATA, setMOVE} = useGpxStore();

    const scrollerRef = useRef(null);
    const blurDivRef = useRef(null);

    // Star Generator
    const RateGenerator = Array.from({ length: 5 }, (_, i) => {
        const rate = SELECTED_INFO?.RATE / 2;
        if (i < Math.floor(rate)) {
            return <FaStar className="Rate-Star Rate-on" key={i} />;
        } else if (i === Math.floor(rate) && !Number.isInteger(rate)) {
            return <FaStarHalf className="Rate-Star Rate-on" key={i} />;
        } else {
            return <FaStar className=" Rate-Star Rate-off" key={i} />;
        }
    });

    //Info Generator
    const InfoGenerator = SELECTED_INFO?.INFOS.map((info, index) => {
        return (
            <div className="Info-Item" key={index}>
                <h3 className="Info-Item-Title">{info.split('-')[0]}</h3>
                <span className="Info-Item-Text">{info.split('-')[1]}</span>
            </div>
        )
    })

     // Utiliser useQueries pour faire plusieurs requêtes simultanément
    const { data, isLoading, error } = useQuery({
        queryKey: ['weather', SELECTED_INFO],
        queryFn: async () => {
            if (!SELECTED_INFO) {
                throw new Error('SELECTED_INFO is not defined');
            }

            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${SELECTED_INFO.COORD[0]}&longitude=${SELECTED_INFO.COORD[1]}&current=temperature_2m,is_day,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,visibility,cloud_cover,wind_speed_10m,weather_code&daily=sunrise,sunset&timezone=auto`
            );

            if (!response.ok) {
                throw new Error(`Erreur pour ${SELECTED_INFO.NAME}: ${response.statusText}`);
            }

            const data = await response.json();
            return { data };
        },
        staleTime: 1000 * 60 * 30, // 30 minutes
        enabled: !!SELECTED_INFO, // La requête ne sera exécutée que si SELECTED_INFO est défini
    });
  
    // Gpx data Binding
        const BindGpxData = (GPX_DATA) && ['Heart','Distance','TotalTime','MinutePerKm','GainElevation','MovingSpeedUpdated'].map((item, index)=>{
            const Assoc = ['BPM','KM','DURÉE','MIN/KM','METRES','KM/H']
            const Icons = [<Heart className='fa-beat'/>,<Hiking className='fa-bounce'/>, <Clock className='fa-spin'/>,<Rythme className='fa-beat'/>, <Elevation className='fa-bounce'/>, <Speed className='fa-shake'/>]
            return(
                <div key={index} className='data-gpx'>
                    <span className='Icons'>{Icons[index]}</span>
                    <h4>{GPX_DATA?.GpxData[item]}</h4>
                    <span className='name'>{Assoc[index]}</span>
                </div>
            )
        })
    

    useEffect(() => {
        if (!scrollerRef.current || !blurDivRef.current) return;

        const scroller = scrollerRef.current;
        const blurDiv = blurDivRef.current;
        
        // S'assurer que le blur commence à 0
        gsap.set(blurDiv, {
            backdropFilter: "blur(0px)"
        });
        
        // Créer un observateur de défilement manuel car ScrollTrigger 
        // peut avoir du mal avec les conteneurs de défilement personnalisés
        const updateBlur = () => {
            // Hauteur maximale défilable
            const maxScroll = scroller.scrollHeight - scroller.clientHeight;
            // Position actuelle du défilement
            const currentScroll = scroller.scrollTop;
            // Progression du défilement (0 à 1)
            const progress = maxScroll > 0 ? currentScroll / maxScroll : 0;
            // Appliquer le flou en fonction de la progression (0 à 20px)
            const blurValue = progress * 20;
            
            // Utiliser GSAP pour une transition plus fluide
            gsap.to(blurDiv, {
                backdropFilter: `blur(${blurValue}px)`,
                duration: 0.1, // Transition rapide mais fluide
                overwrite: true
            });
        };
        
        // Mettre à jour initialement et à chaque défilement
        updateBlur();
        scroller.addEventListener("scroll", updateBlur);
        
        // Nettoyage
        return () => {
            scroller.removeEventListener("scroll", updateBlur);
        };
    }, [SELECTED_INFO]); // Réinitialiser quand SELECTED_INFO change


    return (
        <div className="Info-scroller Info-Background" ref={scrollerRef}  style={{backgroundImage: `url(${SELECTED_INFO?.PHOTOS[0]})`}}>
            <div className="Info-blur" ref={blurDivRef}></div>
        

            
           <div className="Info-Scroll">
                <div className="Info-Headers">      
                    <div className="Info-Temp">{parseInt(data?.data?.current?.temperature_2m)}°C</div>      
                    <Coord />
                </div>
        
          
            <div className="Info-Body">
                    <h1 className="Info-Name">{SELECTED_INFO?.NAME}</h1>

                    <div className="Info-Rate">
                        {RateGenerator}
                    </div>
            </div>
            <div className="Info-Footer">
                    <div className="Info-Info">
                        {InfoGenerator}
                    </div>

                    <p className="Info-Description">{SELECTED_INFO?.DESCRIPTION}</p>

                    <div className="Info-Gpx">
                        {BindGpxData}
                    </div>

                    <div className='Info-map' id='Info-map'>
                        {
                            MOBILE && 
                            <MapContainer center={{lat:45.592104,lng:2.844146}} zoom={13} scrollWheelZoom={true}>
                            <TileLayer maxNativeZoom={MAP_SETTINGS.MAXZOOM} key={MAP_SETTINGS.URL} url={MAP_SETTINGS.URL}/>
                            { 
                                CUSTOM_LAYER && 
                                <TileLayer 
                                    zIndex={100}
                                    opacity={0.5} 
                                    key={CUSTOM_LAYER._url+1} 
                                    url={CUSTOM_LAYER._url} 
                                    maxNativeZoom={MAP_SETTINGS.MAXZOOM}
                                />
                            }
                            <Gpx />                                        
                        </MapContainer>
                        }         
                    </div>

                    <Chart />
                    <a className='Info-DepartLink' rel="noreferrer" href={`https://www.google.com/maps/place/${SELECTED_INFO?.PARKING[0]}+${SELECTED_INFO?.PARKING[1]}`} target="_blank">Aller au départ</a>
            </div>
           </div>
        </div> 
    )
}