import React from 'react'

import { BsBackspace } from 'react-icons/bs';
import { MdOutlineChangeCircle } from 'react-icons/md';
import { AiOutlineClear } from 'react-icons/ai';
import { HiOutlineMinus } from 'react-icons/hi';
import { AiOutlinePlus } from 'react-icons/ai';
import { TiTimes } from 'react-icons/ti';
import { RiDivideLine } from 'react-icons/ri';


export default function Operation({ type, handleChange, className }) {
    let symbol = {
        'multiplicacion': '*',
        'division': '/',
        'suma': '+',
        'resta': '-',
        'igual': '=',
        'par_open': '(',
        'par_close': ')',
        'clear': 'cl',
        'back': 'bck',
        'shuffle': 'sf',
    }
    const renderOperation = () => {
        switch (type) {
            case 'multiplicacion':
                return <TiTimes className='operation' />
            case 'division':
                return <RiDivideLine className='operation' />
            case 'suma':
                return <AiOutlinePlus className='operation' />
            case 'resta':
                return <HiOutlineMinus className='operation' />
            case 'par_open':
                return <p className="operation">(</p>
            case 'par_close':
                return <p className="operation">)</p>
            case 'igual':
                return <p className="operation">=</p>
            case 'back':
                return <BsBackspace className='operation' />
            case 'clear':
                return <AiOutlineClear className='operation' />
            case 'shuffle':
                return <MdOutlineChangeCircle className='operation' />
            default:
                return <p className="operation">?</p>

        }
    }

    return (
        <div className={`cardOperation ${className}`} onClick={() => handleChange(symbol[type])}>
            {renderOperation()}
        </div>
    )
}
