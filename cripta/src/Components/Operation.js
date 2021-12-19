import React from 'react'
import { BsBackspace } from 'react-icons/bs';

export default function Operation({ type, handleChange }) {
    let symbol = {
        'multiplicacion': '*',
        'division': '/',
        'suma': '+',
        'resta': '-',
        'igual': '=',
        'par_open': '(',
        'par_close': ')',
        'clear': 'CL',
        'back': 'bck',
    }
    const renderOperation = () => {
        switch (type) {
            case 'multiplicacion':
                return <p className="operation">×</p>
            case 'division':
                return <p className="operation">÷</p>
            case 'suma':
                return <p className="operation">+</p>
            case 'resta':
                return <p className="operation">-</p>
            case 'par_open':
                return <p className="operation">(</p>
            case 'par_close':
                return <p className="operation">)</p>
            case 'igual':
                return <p className="operation">=</p>
            case 'clear':
                return <p className="operation">CL</p>
            case 'back':
                return <BsBackspace className='operation'/>
            default:
                return <p className="operation">?</p>

        }
    }

    return (
        <div className="cardOperation"  onClick={() => handleChange(symbol[type])}>
            {renderOperation()}
        </div>
    )
}
