import React from 'react'
import { BsFillCupFill } from 'react-icons/bs';
import { GiBroadsword, GiWoodStick } from 'react-icons/gi';
import { AiFillGold } from 'react-icons/ai';



export default function Palo({type, customStyle, size}) {
    
    const renderType = () =>{
        switch(type){
            case 'basto':
                return <BsFillCupFill size={size || 24}/>
            case 'espada':
                return <GiBroadsword size={size || 24}/>
            case 'oro':
                return <AiFillGold size={size || 24}/>
            case 'copa':
                return <GiWoodStick size={size || 24}/>
            default:
                return <BsFillCupFill size={size || 24}/>
        }
    }

    return (
        <div className={customStyle}>
            {renderType()}
        </div>
    )
}
