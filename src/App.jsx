import './App.css';
import React, {useEffect, useState, createContext, useContext}  from 'react';
import Map from './component/Map.jsx'
import Card from './component/Card.jsx'
import Info from './component/Info.jsx';
import * as L from "leaflet";
import Settings from './component/Settings.jsx';
import { FirebaseContext } from './component/FirebaseContext.jsx';
import {useExplauraStore, useMapStore} from './store.jsx';

export const ExplauraContext = createContext(null);


function App() {

  const { SPOT, MEDIA, fetchSPOTs, fetchFiles } = useExplauraStore();

  useEffect(() => {
    fetchSPOTs();
    fetchFiles();
}, [fetchSPOTs]);



  // Init for State
  const Init = {
    "Name" : "Explaura",
    "Type" : "user",
    "Coord" : {
        "lat" : 45.77246462548193,
        "lng" : 2.9625362995532574
    },        
    "Parking" : {
        "lat" :45.76422760935789, 
        "lng" : 2.956646164618501
    },        
    "Description" : ("Explaura a été Développé avec ♥ par un passionné de Randonnée et de Photographie. Cliquez sur un point d'intérêt pour en apprendre plus sur un lieu ou une randonnée ! Les filtres vous permettent de voir la pollution lumineuse, mais aussi les lieux ou le vol en drone est autorisé."),
    "Infos" : {            
        "Difficulté" : "Moyen",
        "Virages" : "15",
        "Fréquentation" : "Forte"
    },    
    "Note" : 6,
    "Review" : "Passionné de randonnée et de photographie, je donne mon avis sur les meilleures randonnées d'Auvergne Rhones Alpes !",
    "Photos" : [
        "1.jpg"
    ],
    "Gpx" : "PuyDeDome"
  } 

  //Context Firebase
  const { getData } = useContext(FirebaseContext);
  // All States
  const [xplaura, setXplaura] = useState({}) // Explaura JSON Data
  const [weatherData, setWeatherData] = useState(null);
  const [selectIndex, setSelectIndex] = useState(null); // Select Index for item = 1, 3, 9
  const [selectInfo, setSelectInfo] = useState(null); // Selected Item Informations base on Index 
  const [gpxData, setGpxData] = useState(); // Save GPX Data To a State
  const [prevGpx, setPrevGpx] = useState({}); // Save Previous GPX 2:null,25:null
  const [move, setMove] = useState({lat:0,lng:0}) // Save Move Icon Position
  const [mobile, setMobile] = useState(true) // Check if user is mobile device or not
  const [mapLayer, setMapLayer] = useState({Url : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", Options : { maxNativeZoom : 18}}); // Default Map Layer
  const [customLayer, setCustomLayer] = useState(null); // Drone or Light Polution Layer
  const [filtre, setFiltre] = useState(null); // Show only Volcan, Montagne...
  const [user, setUser] = useState({}); // User position
  // Icons Settings
  const IconSettings = {
    iconSize: [50, 50],
    iconAnchor: [50/2, 50],    
    shadowUrl : "image/markers/marker-shadow.png",
    shadowAnchor: [50/2, 50], 
    shadowSize:   [50, 50],
    popupAnchor: [0, -50],
  }  
  // Default Icon
  const AllIcons = {
    ParkingIcon : L.icon({...IconSettings,iconUrl: "image/markers/marker-parking.png" }),
    InterestIcon: L.icon({...IconSettings,iconUrl: "image/markers/marker-interest.png" }),
    StartIcon : L.icon({...IconSettings, iconUrl: "image/markers/marker-start.png" }),
    EndIcon : L.icon({...IconSettings, iconUrl: "image/markers/marker-stop.png" }),
    MoveIcon : L.icon({...IconSettings, className:"MoveIcon", shadowUrl:null ,iconUrl: "image/markers/marker-move.png" })
  }
  // Layers  
  const CommonLayer = {
    minZoom : 6,
    maxZoom: 18,   
    tileSize: 256,
    zoomOffset: 0, //-1
    opacity: 0.5,
  }
  const AllLayer = {
    Drone : L.tileLayer.wms("https://www.drone-spot.tech/cache/{z}/{x}/{y}.png", {...CommonLayer, Name: "Drone", maxNativeZoom : 15}),
    // L.tileLayer.wms("https://explaura.app/assets/maps/drone/{z}/{x}/{y}.png", {...CommonLayer, Name: "Drone", maxNativeZoom : 10}),
    Light : L.tileLayer.wms("https://darksitefinder.com/maps/tiles/tile_{z}_{x}_{y}.png", {...CommonLayer, Name: "Light", maxNativeZoom : 6}),
    //L.tileLayer.wms("https://explaura.app/assets/maps/light/{z}/{x}_{y}.png", {...CommonLayer, Name: "Light", maxNativeZoom : 6}),
  }
  // All Map Layers & Common Settings
  const Common = {
    attribution: 'Xplaura Project',
    minZoom : 6,
    maxZoom: 18,      
    maxNativeZoom : 16,              
    format: 'jpg',
    time: '',
    noWrap : true,
    tilematrixset: 'GoogleMapsCompatible_Level',
    tileSize: 256,
    zoomOffset: 0,      
    accessToken: 'pk.eyJ1Ijoic3dlZWZ0aCIsImEiOiJja3ptZ2IzN2g0M2hrMnVvMWttdWt6cnptIn0.ExNhsIX2PX-DXGjmQVVgsw',
    keepBuffer: 10,
  }
  const AllMap = {
    Terrain : L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", Common), //https://explaura.app/assets/maps/terrain/{z}/{x}/{y}.png
    Grey : L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {...Common, maxNativeZoom : 20}),
    Satelite : L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {...Common, maxNativeZoom : 20}),
    GoogleTerrain : L.tileLayer("https://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", {...Common, maxNativeZoom : 20}),
    Trails : L.tileLayer("https://topo.wanderreitkarte.de/topo/{z}/{x}/{y}.png", {...Common, maxNativeZoom : 20}),
  }
    
  // Show or Hide
  const Show = (selectInfo) ? "ShowInfo" : "HideInfo";


  useEffect(() => {
    // Load Leaflet GPX
    // var script = document.createElement('script')
    // script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/2.1.2/gpx.min.js" // Public URL is DOMAIN NAME
    // document.body.appendChild(script);    

    // Get Data From Firebase
    const fetchData = async () => {
      const result = await getData('database', 'explaura');
      setXplaura(result);
    };
    fetchData();

    // Get Weather
    fetch('https://api.lucasarts.fr/weather/explaura').then(response => response.json()).then(data => setWeatherData(data))
    .catch(error => console.error(error));

    // Detect Mobile
    function isMobile(){ (window.innerWidth < 800) ? setMobile(true) : setMobile(false); };    
    // Resize Path On Window Resize
    window.addEventListener('resize', isMobile);
    isMobile()

    return () => window.removeEventListener('resize', isMobile);
    
  }, [getData])



  // Check if user is on Mobile
  const isMobile = (mobile) ? "isMobile" : "NotMobile";
console.log(MEDIA)
  return (
    <ExplauraContext.Provider value={{ 
      xplaura, Init, AllIcons, AllLayer, AllMap,
      weatherData, setWeatherData,
      gpxData, setGpxData, 
      selectInfo, setSelectInfo, 
      selectIndex, setSelectIndex, 
      mapLayer, setMapLayer,
      filtre, setFiltre, 
      mobile, 
      user, setUser,
      prevGpx, setPrevGpx,  
      customLayer, setCustomLayer,  
      move, setMove}}
      >
   
    <div className={`App Horizontal ${isMobile}`}>
      <div id='MapContainer'>
        {/* <Settings  /> */}
        <Map />
        {/* <Card />       */}
      </div>
      <div id='InfoContainer' className={Show}>
        <Info />
      </div>      
    </div>
    </ExplauraContext.Provider>
  );
}

export default App;
