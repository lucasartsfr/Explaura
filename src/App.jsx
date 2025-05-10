import './App.css';
import React, {useEffect, createContext}  from 'react';
import Map from './component/Map.jsx'
import Card from './component/Card.jsx'
import Info from './component/Info.jsx';
import Settings from './component/Settings.jsx';
import {useExplauraStore, useMapStore} from './store.jsx';
import Info2 from './component/Info/Info2.jsx';

export const ExplauraContext = createContext(null);


function App() {

  const {fetchSPOTs, fetchFiles, SELECTED_INFO } = useExplauraStore();
  const {setMOBILE, MOBILE} = useMapStore();

  useEffect(() => {
    
    // Load Leaflet GPX
    var script = document.createElement('script')
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/2.1.2/gpx.min.js" // Public URL is DOMAIN NAME
    document.body.appendChild(script);    

    fetchSPOTs();

    // Detect Mobile
    function isMobile(){ (window.innerWidth < 800) ? setMOBILE(true) : setMOBILE(false); }; 
    window.addEventListener('resize', isMobile);
    isMobile()  
    return () => window.removeEventListener('resize', isMobile);

}, [fetchSPOTs]);


  // Show or Hide
  const Show = (SELECTED_INFO) ? "ShowInfo" : "HideInfo";
  const isMobile = (MOBILE) ? "isMobile" : "NotMobile";

  return (
    <div className={`App Horizontal ${isMobile}`}>
      <div id='MapContainer'>
        <Settings  />
        <Map />
        <Card />      
      </div>
      <div id='InfoContainer' className={Show}>
        <Info2 />
      </div>      
    </div>
  );
}

export default App;
