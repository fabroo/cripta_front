import React from 'react'
import { BsFillCupFill } from 'react-icons/bs';
import { GiBroadsword, GiWoodStick } from 'react-icons/gi';
import { AiFillGold } from 'react-icons/ai';



export default function Palo({type, customStyle}) {
    
    const renderType = () =>{
        switch(type){
            case 'basto':
                return <BsFillCupFill size={24}/>
            case 'espada':
                return <GiBroadsword size={24}/>
            case 'oro':
                return <AiFillGold size={24}/>
            case 'copa':
                return <GiWoodStick size={24}/>
            default:
                return <BsFillCupFill size={24}/>
        }
    }

    return (
        <div className={customStyle}>
            {renderType()}
        </div>
    )
}
