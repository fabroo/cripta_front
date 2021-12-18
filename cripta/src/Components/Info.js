import React from 'react'
import { BsInfoCircleFill } from 'react-icons/bs';

export default function Info() {
    return (
        <div className="infoBtn" onClick= {() => alert("reglas cripta smh")}>
            <BsInfoCircleFill className='infoIcon' color='#7D84B2' size={40}/>           
        </div>
    )
}
