import React, {useState}  from 'react';
import {BsFillGearFill as Gear} from "react-icons/bs";
import {GiDeliveryDrone as Drone} from "react-icons/gi";
import {GiStreetLight as Light} from "react-icons/gi";
import {GrFormClose as Close} from "react-icons/gr";
import { useExplauraStore, useMapStore } from '../store';


function Settings(props){

    const {SPOT, FILTRES, setFILTRES, getFilePreview} = useExplauraStore()
    const {MAP_OVERLAY,MAP_SETTINGS, setCUSTOM_LAYER, setCUSTOM_OVERLAY, CUSTOM_OVERLAY, MAP_LAYER } = useMapStore()

    const [show, setShow] = useState(false)
    const Icons = {DRONE: <Drone/>, LIGHT : <Light/>}

    // Function to Generate ScreenShot
    function ScreenShotRpl(S, L){
        return S.replace('{g}', MAP_SETTINGS.SCREENSHOT[L].g).replace('{s}',MAP_SETTINGS.SCREENSHOT[L].s).replace('{x}', MAP_SETTINGS.SCREENSHOT[L].x).replace('{y}', MAP_SETTINGS.SCREENSHOT[L].y).replace('{z}', MAP_SETTINGS.SCREENSHOT[L].z)
    }

    // Set The New Map Layer for All Maps
    const UpdateLayer = (e) =>{
        const Select = e.target.id.split("-")[1];
        setCUSTOM_LAYER(MAP_LAYER[Select])
    }

    // Generate Miniatures for Settings
    const Thumb = Object.keys(MAP_LAYER).map((MapLayer)=>{
        return (<div onClick={UpdateLayer} id={`Layer-${MapLayer}`} className='Settings-Thumb' key={MapLayer} style={{backgroundImage : `url("${ScreenShotRpl(MAP_LAYER[MapLayer]._url, "MAPS")}")`}}></div>);
    })    

    // Update Mode (Drone, Light Polution...)
    const UpdateMode = (e) =>{
        const Select = e.currentTarget.id.split('-')[1];
        (CUSTOM_OVERLAY?.options?.Name === MAP_OVERLAY[Select]?.options.Name) ? setCUSTOM_OVERLAY(null) : setCUSTOM_OVERLAY(MAP_OVERLAY[Select]);                 
    }

    // Mode Buttons (Create Button and Click Event)
    const Buttons = Object.keys(MAP_OVERLAY).map((Layer)=>{
        const Active = (CUSTOM_OVERLAY?.options.Name === Layer) ? "Active" : ""
        return(
            <div id={`Layers-${Layer}`} onClick={UpdateMode} key={Layer} className={`Mode-Button ${Active}`}>
                {Icons[Layer]}
            </div>
        )
    })

    // Filtres Fonction
    const FiltersEnable = (e) =>{
        const Select = e.currentTarget.id.split('-')[1];
        (FILTRES === Select) ? setFILTRES(null) : setFILTRES(Select)
    }

    // Create unique Filters
    let UniqueType = {};
    Object.keys(SPOT).map((item, index)=>{         
        const Type = SPOT[item].TYPE;
        const Active = (FILTRES === Type) ? "Active" : "";
        const Image = getFilePreview('marker-'+Type);
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