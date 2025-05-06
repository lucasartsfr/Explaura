import './App.css';
import React, {useEffect, createContext}  from 'react';
import Map from './component/Map.jsx'
import Card from './component/Card.jsx'
import Info from './component/Info.jsx';
import Settings from './component/Settings.jsx';
import {useExplauraStore, useMapStore} from './store.jsx';

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
    fetchFiles();

    // Detect Mobile
    function isMobile(){ (window.innerWidth < 800) ? setMOBILE(true) : setMOBILE(false); }; 
    window.addEventListener('resize', isMobile);
    isMobile()  
    return () => window.removeEventListener('resize', isMobile);

}, [fetchSPOTs]);


  // All States


  // Show or Hide
  const Show = (SELECTED_INFO) ? "ShowInfo" : "HideInfo";





  // Check if user is on Mobile
  const isMobile = (MOBILE) ? "isMobile" : "NotMobile";

  return (
    <div className={`App Horizontal ${isMobile}`}>
      <div id='MapContainer'>
        {/* <Settings  /> */}
        <Map />
        <Card />      
      </div>
      <div id='InfoContainer' className={Show}>
        <Info />
      </div>      
    </div>
  );
}

export default App;
