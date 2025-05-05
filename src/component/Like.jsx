import React, {useContext, useEffect, useRef, useState} from 'react';
import {AiFillHeart as Heart} from 'react-icons/ai';
import { ExplauraContext } from '../App';
import { FirebaseContext } from './FirebaseContext';

export default function Like(){

    const { selectInfo } = useContext(ExplauraContext);
    const { UpdateLike } = useContext(FirebaseContext);

    const [like, setLike] = useState(0); // Default Like is 0 OR Item Like
    const AlreadyLike = useRef([]);

    useEffect(() =>{
        setLike(selectInfo?.Infos?.Like || 0); // On Change Select set New Like Value 
    }, [selectInfo])

    // Update Like
    const handleLike = (e) =>{
        if(AlreadyLike.current.includes(selectInfo?.Name)){
            console.log('Already Like !')
        }
        else{
            UpdateLike('database','explaura', selectInfo?.Name); // Push Like to DataBase
            setLike(like+1); // Increment New Like for Display        
            selectInfo && (selectInfo['Infos']['Like'] = (like+1)); // Store New Like Localy (Prevent new fetch from database)
            AlreadyLike.current.push(selectInfo?.Name)
        }
        
    }

    if(!selectInfo){
        return <></>
    }

    return(
        <div className='Infos-Like' onClick={handleLike}>
            <span className='Infos-Like-Value'>{like}</span>
            <Heart className='Heart'/>
        </div>
    )
}