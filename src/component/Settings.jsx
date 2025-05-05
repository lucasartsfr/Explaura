import React, {useState, useContext}  from 'react';
import {BsFillGearFill as Gear} from "react-icons/bs";

import {GiDeliveryDrone as Drone} from "react-icons/gi";
import {GiStreetLight as Light} from "react-icons/gi";
import {GrFormClose as Close} from "react-icons/gr";
import { ExplauraContext } from '../App';


function Settings(props){

    const [show, setShow] = useState(false)
    const {AllMap, setMapLayer, AllLayer, setCustomLayer, customLayer, xplaura, filtre, setFiltre} = useContext(ExplauraContext);
    const Icons = {Drone: <Drone/>, Light : <Light/>}
    // Position for ScreenShot
    const ScreenShot = {Maps:{s:"a",g:"mt0",x:4163,y:2921,z:13}, Weather:{s:"a",g:"mt0",x:32,y:22,z:6}}

    // Function to Generate ScreenShot
    function ScreenShotRpl(S, L){
        return S.replace('{g}', ScreenShot[L].g).replace('{s}',ScreenShot[L].s).replace('{x}', ScreenShot[L].x).replace('{y}', ScreenShot[L].y).replace('{z}', ScreenShot[L].z)
    }

    // Set The New Map Layer for All Maps
    const UpdateLayer = (e) =>{
        const Select = e.target.id.split("-")[1];
        setMapLayer({Url : AllMap[Select]._url, Options : AllMap[Select].options})
    }

    // Generate Miniatures for Settings
    const Thumb = Object.keys(AllMap).map((MapLayer)=>{
        const Div = (
        <div onClick={UpdateLayer} id={`Layer-${MapLayer}`} className='Settings-Thumb' key={MapLayer} style={{backgroundImage : `url("${ScreenShotRpl(AllMap[MapLayer]._url, "Maps")}")`}}></div>);
        return Div;
    })    

    // Update Mode (Drone, Light Polution...)
    const UpdateMode = (e) =>{
        const Select = e.currentTarget.id.split('-')[1];
        (customLayer?.options.Name === AllLayer[Select]?.options.Name) ? setCustomLayer(null) : setCustomLayer(AllLayer[Select]);      
    }

    // Mode Buttons (Create Button and Click Event)
    const Buttons = Object.keys(AllLayer).map((Layer)=>{
        const Active = (customLayer?.options.Name === Layer) ? "Active" : ""
        return(
            <div id={`Layers-${Layer}`} onClick={UpdateMode} key={Layer} className={`Mode-Button ${Active}`}>
                {Icons[Layer]}
            </div>
        )
    })

    // Filtres Fonction
    const FiltersEnable = (e) =>{
        const Select = e.currentTarget.id.split('-')[1];
        (filtre === Select) ? setFiltre(null) : setFiltre(Select)
    }

    // Create unique Filters
    let UniqueType = {};
    Object.keys(xplaura).map((item, index)=>{         
        const Type = xplaura[item].Type;
        const Active = (filtre === Type) ? "Active" : "";
        const Image = `Markers/Types/${Type}.png`//require("../images/markers/type/"+Type+".png"); // Allow to use Require Image
        const Item = <div onClick={FiltersEnable} key={index} id={`Filter-${Type}`} className={`Settings-Filtre-Icon ${Active}`} style={{backgroundImage : `url("${Image}")`}}></div>
        !UniqueType[Type] && (UniqueType[Type]=Item);
        return Item;
    })

    // Show/Hide Menu
    const ShowMenu = () =>{ setShow(!show) };
    const IconsShow = (show) ? <Close/> : <Gear/>;

    return(
        <>
        <div onClick={ShowMenu} className='Settings-Button'>
            {IconsShow}
        </div>
        <div className={`Settings-Menu ${show}`}>
            <div className='Settings-Filtres'>
                <h2>Filtres</h2>
                <div className='Settings-Filtres-Container'>
                    {Object.values(UniqueType)}
                </div>
            </div>
            <div className='Settings-Filtres'>
                <h2>Modes</h2>
                <div className='Settings-Mode-Container'>
                    {Buttons}
                </div>
            </div>
            <div className='Settings-Filtres'>
                <h2>Cartes</h2>
                <div className='Settings-Thumb-Container'>
                    {Thumb}
                </div>
            </div>
        </div>
        </>
    )
}

export default React.memo(Settings);