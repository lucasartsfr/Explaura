import React from 'react';
import { useExplauraStore, useMapStore } from '../store';

function Card(){

    const {SPOT, FILTRES, setSELECTED_INDEX} = useExplauraStore()
    const {USER_POSITION, DISTANCE_CALC} = useMapStore()

 
    // When Card is Clicked
    const ClickCard = (e) =>{
        const Id = parseInt(e.currentTarget.getAttribute('data-id'))
        setSELECTED_INDEX(Id)
    }

    // Création des cartes
    const CardItem = Object.keys(SPOT).map((item, index)=>{
        const Coord = SPOT[item].COORD;
        const Type = SPOT[item].TYPE;
        const UserPos = (USER_POSITION.lat) ? Math.round(DISTANCE_CALC(USER_POSITION.lat,USER_POSITION.lng,Coord[0], Coord[1]))+"km" : "?km";
        const Image = SPOT[item].PHOTOS[0];
        // Cartes       
        const NewCard = (FILTRES === Type || FILTRES === null) && (
            <div key={index} id={index} className={`CardBox`} data-id={index} data-lat={Coord[0]} data-lng={Coord[1]} onClick={ClickCard}>
                <div className="Card" style={{backgroundImage : `url(${Image})`}}>
                </div>
                <div className="CardInfo">
                    <h2>{SPOT[item].NAME}</h2>
                    <h3 className={`${Type}`}>{Type}</h3>
                </div>
                <span className='DistanceCard'>{UserPos}</span>
            </div>
        )
        //return NewCard + Distance
        return { card: NewCard, distance: parseInt(UserPos, 10) };
    })
    // Filtre des cartes en fonction de la distance
    const SortedCardItem =  CardItem.sort((a, b) => a.distance - b.distance).map((item) => item.card);


    return(
        <div className="CardContainer">
            {SortedCardItem}
        </div>
    )
}

export default React.memo(Card);