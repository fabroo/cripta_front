import React from 'react'
import Palo from './Palo'

export default function Card({ valor, palo }) {
    return (
        <>
            <Palo type={palo} customStyle="paloTop" />
            <p className="valor"> {valor} </p>
            <Palo type={palo} customStyle="paloBottom" />
        </>
    )
}
