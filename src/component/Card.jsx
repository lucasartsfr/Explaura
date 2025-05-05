import React, { useContext } from 'react';
import { ExplauraContext } from '../App';

function Card(props){
    const {xplaura, user, filtre, setSelectIndex} = useContext(ExplauraContext);
    // console.log(`Position User :${user.lat} ${user.lng}`)

    // Distance from user to Point
    function distance(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lon2 - lon1) * p))/2;      
        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }

    // When Card is Clicked
    const ClickCard = (e) =>{
        const Id = parseInt(e.currentTarget.getAttribute('data-id'))
        setSelectIndex(Id)
    }

    // Création des cartes
    const CardItem = Object.keys(xplaura).map((item, index)=>{
        const Coord = xplaura[item].Coord;
        const Type = xplaura[item].Type;
        const UserPos = (user.lat) ? Math.round(distance(user.lat,user.lng,Coord.lat, Coord.lng))+"km" : "?km";
        const Image = `images/img/${item}/1.jpg`;
        // Cartes       
        const NewCard = (filtre === Type || filtre === null) && (
            <div key={index} id={index} className={`CardBox`} data-id={index} data-lat={Coord.lat} data-lng={Coord.lng} onClick={ClickCard}>
                <div className="Card" style={{backgroundImage : `url(${Image})`}}>
                </div>
                <div className="CardInfo">
                    <h2>{item}</h2>
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