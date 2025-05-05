import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../FirebaseContext';

export default function ListExplaura({PushData}){

    const { getData, uploadFile } = useContext(FirebaseContext);    
    const [data, setData] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        const result = await getData('database', 'explaura');
        //const Url = await getFilesDownloadURLs('Gpx');
        setData(result);
      };
      fetchData();
    }, [getData]);

    // Upload GPX and Photo
    const handleUpload = (e) =>{
        e.preventDefault();
        const Field = e.currentTarget.getAttribute('for');
        const Path = e.currentTarget.id;
        const file = document.getElementById(Field).files[0];
        uploadFile(file, Path);
        console.log(Path)
    }

    const List = data && Object.keys(data).map((item) => {
        return (
        <form key={item} className="FormData" onSubmit={PushData}>
            <input type='text' defaultValue={item} name="Name"/>
            <input type='number' defaultValue={data[item]?.Like} name="Like"/>
            <input type='text' defaultValue={data[item].Type} name="Type"/>
            <textarea defaultValue={data[item].Description} name="Description"/>
            <input type='number' size="1" defaultValue={data[item].Note} name="Note"/>
            <textarea defaultValue={data[item].Review} name="Review"/>
            <input type='text' defaultValue={data[item].Gpx} name="Gpx" placeholder='Gpx'/>
                <input type="file" name="FileGpx" id="FileGpx" placeholder='Gpx'/>
                <button onClick={handleUpload} id="Gpx" htmlFor="FileGpx">Upload Gpx</button>
            <h4>Photos</h4>
            <input type='text' defaultValue={data[item].Photos} name="Photos"/>
                <input type="file" name="FilePhoto" id="FilePhoto"/>
                <button onClick={handleUpload} id={`Images/${item}`} htmlFor="FilePhoto">Upload Photo</button>
            <h4>Coordonées Interet</h4>
            <input type='number' defaultValue={data[item].Coord.lat} name="CoordLat"/>
            <input type='number' defaultValue={data[item].Coord.lng} name="CoordLng"/>
            <h4>Coordonées Parking</h4>
            <input type='number' defaultValue={data[item].Parking.lat} name="ParkingLat"/>
            <input type='number' defaultValue={data[item].Parking.lng} name="ParkingLng"/>
            <h4>Infos</h4>
            <div className='FormDataGroup'>
                <input type='text' defaultValue={Object.keys(data[item].Infos)[0]} name="InfosKeyZero"/>
                <input type='text' defaultValue={Object.values(data[item].Infos)[0]} name="InfosValueZero"/>
            </div>
            <div className='FormDataGroup'>
                <input type='text' defaultValue={Object.keys(data[item].Infos)[1]} name="InfosKeyOne"/>
                <input type='text' defaultValue={Object.values(data[item].Infos)[1]} name="InfosValueOne"/>
            </div>
            <div className='FormDataGroup'>
                <input type='text' defaultValue={Object.keys(data[item].Infos)[2]} name="InfosKeyTwo"/>
                <input type='text' defaultValue={Object.values(data[item].Infos)[2]} name="InfosValueTwo"/>
            </div>
            <button>Push</button>
        </form>
        );
    })

    if (!data) {
        return <div>Loading...</div>;
    }

    return(
        <div className='FormDataContainer'>
            {/* {List} */}
            { List }
        </div>
    )
}