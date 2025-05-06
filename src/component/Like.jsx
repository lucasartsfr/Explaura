import React, {useEffect, useRef, useState} from 'react';
import {AiFillHeart as Heart} from 'react-icons/ai';
import { useExplauraStore } from '../store';

export default function Like(){

    const {SELECTED_INFO} = useExplauraStore()

    const [like, setLike] = useState(0); // Default Like is 0 OR Item Like
    const AlreadyLike = useRef([]);

    useEffect(() =>{
        setLike(SELECTED_INFO?.LIKE|| 0); // On Change Select set New Like Value 
    }, [SELECTED_INFO])

    // Update Like
    const handleLike = (e) =>{
        if(AlreadyLike.current.includes(SELECTED_INFO?.NAME)){
            console.log('Already Like !')
        }
        else{
            UpdateLike('database','explaura', SELECTED_INFO?.NAME); // Push Like to DataBase
            setLike(like+1); // Increment New Like for Display        
            SELECTED_INFO && (SELECTED_INFO['Infos']['Like'] = (like+1)); // Store New Like Localy (Prevent new fetch from database)
            AlreadyLike.current.push(selectInfo?.Name)
        }
        
    }

    if(!SELECTED_INFO){
        return <></>
    }

    return(
        <div className='Infos-Like' onClick={handleLike}>
            <span className='Infos-Like-Value'>{like}</span>
            <Heart className='Heart'/>
        </div>
    )
}