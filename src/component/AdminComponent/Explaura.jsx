import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../FirebaseContext';
import ListExplaura from './ListExplaura';

export default function Explaura({loading}){

    const { addData, uploadFile } = useContext(FirebaseContext);
    const [name, setName] = useState('Nom du lieu')
    const Init = {         
        [name] : {
            "Type" : "Type du lieu",
            "Coord" : {
                "lat" : "Latitude",
                "lng" : "Longitude"
            },        
            "Parking" : {
                "lat" : "Latitude",
                "lng" : "Longitude"
            },        
            "Description" : "Description de votre lieu",
            "Infos" : {            
                "Titre 1" : "Info 1",
                "Titre 2" : "Info 2",
                "Titre 3" : "Info 3"
            },    
            "Note" : 10,
            "Review" : "Votre Review Personnelle",
            "Photos" : [
                "1.jpg",
                "2.jpg"
            ],
            "Gpx" : "NomDuGpx"
    
        }   
    }
    
    // Push to Firestore
    const PushData = (e) =>{
        console.log(e)
        e.preventDefault();
        const Form = new FormData(e.target);
        const ToPush = { [Form.get('Name')] : {
            "Type" : Form.get('Type').toLocaleLowerCase(),
            "Coord" : {
                "lat" :  parseFloat(Form.get('CoordLat')),
                "lng" :  parseFloat(Form.get('CoordLng')),
            },        
            "Parking" : {
                "lat" : parseFloat(Form.get('ParkingLat')),
                "lng" : parseFloat(Form.get('ParkingLng')),
            },        
            "Description" :Form.get('Description'),
            "Infos" : {            
                [Form.get('InfosKeyZero')] : Form.get('InfosValueZero'),
                [Form.get('InfosKeyOne')] : Form.get('InfosValueOne'),
                [Form.get('InfosKeyTwo')] : Form.get('InfosValueTwo')
            },    
            "Note" : parseInt(Form.get('Note')),
            "Review" : Form.get('Review'),
            "Photos" : Form.get('Photos').split(','),
            "Gpx" : Form.get('Gpx')
          } 
        }
        addData(ToPush, "database", "explaura")
    }

    // Upload GPX
    const handleUpload = (e) =>{
        e.preventDefault();
        const Field = e.currentTarget.getAttribute('for');
        const Path = e.currentTarget.id;
        const file = document.getElementById(Field).files[0];
        uploadFile(file, Path);
        console.log(Path)
        // uploadFile(file);
    }


    return(
        <div>                
            <h2>Ajouter un nouveau lieu</h2>
            <div className='FormDataContainer'>
                <form onSubmit={PushData} className="FormData">
                <input type='text' placeholder={[Object.keys(Init)]} onChange={(e) => setName(e.currentTarget.value)} name="Name"/>
                <input type='text' placeholder={Init[Object.keys(Init)].Type} name="Type"/>
                <textarea placeholder={Init[Object.keys(Init)].Description} name="Description"/>
                <input type='number' placeholder={Init[Object.keys(Init)].Note} name="Note"/>
                <textarea placeholder={Init[Object.keys(Init)].Review} name="Review"/>
                <input type='text' placeholder={Init[Object.keys(Init)].Gpx} name="Gpx"/>
                <h4>Photos</h4>
                <input type='text' placeholder={Init[Object.keys(Init)].Photos} name="Photos"/>
                    <input type="file" name="FilePhoto" id="FilePhoto"/>
                    <button onClick={handleUpload} id={`Images/${Object.keys(Init)}`} htmlFor="FilePhoto">Upload</button>
                <h4>Coordonées d'interet</h4>
                <div className='FormDataGroup'>
                    <input step="any" type='number'  placeholder={Init[Object.keys(Init)].Coord.lat} name="CoordLat"/>
                    <input step="any" type='number'  placeholder={Init[Object.keys(Init)].Coord.lng} name="CoordLng"/>
                </div>
                <h4>Coordonnées Parking</h4>
                <div className='FormDataGroup'>
                    <input step="any" type='number'placeholder={Init[Object.keys(Init)].Parking.lat} name="ParkingLat"/>
                    <input step="any" type='number'placeholder={Init[Object.keys(Init)].Parking.lng} name="ParkingLng"/>
                </div>
                <h4>Infos</h4>
                <div className='FormDataGroup'>
                    <input type='text' placeholder={Object.keys(Init[Object.keys(Init)].Infos)[0]} name="InfosKeyZero"/>
                    <input type='text' placeholder={Object.values(Init[Object.keys(Init)].Infos)[0]} name="InfosValueZero"/>
                </div>
                <div className='FormDataGroup'>
                    <input type='text' placeholder={Object.keys(Init[Object.keys(Init)].Infos)[1]} name="InfosKeyOne"/>
                    <input type='text' placeholder={Object.values(Init[Object.keys(Init)].Infos)[1]} name="InfosValueOne"/>
                </div>
                <div className='FormDataGroup'>
                    <input type='text' placeholder={Object.keys(Init[Object.keys(Init)].Infos)[2]} name="InfosKeyTwo"/>
                    <input type='text' placeholder={Object.values(Init[Object.keys(Init)].Infos)[2]} name="InfosValueTwo"/>
                </div>
                <input type="file" name="File" id="File"/>
                <button onClick={handleUpload} id="Gpx" htmlFor="File">Upload</button>
                <button>Push</button>
                </form>
            </div>            
            <hr></hr>  
            <h2>Modifier un lieu</h2>
            <ListExplaura PushData={PushData} />      
        </div>
    )
}