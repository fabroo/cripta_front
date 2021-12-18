import React from 'react'
import '../App.css';

export default function Tablero({ children, operation, result }) {
    return (
        <div className="container">
            <div className="mainBoard">
                <div className="tablero">
                    {children}
                </div>
                <div id="resultCard" className="card resultCard">
                    {result}

                </div>
            </div>
            {operation}
        </div>
    )
}
