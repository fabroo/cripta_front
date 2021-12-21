import React from 'react'

export default function Tablero({ children, operation, result }) {
    return (
        <div className="container">
            <div className="mainBoard">
                <div className="tablero">
                    {children}
                </div>
                <div id="resultCard" className="resultCard">
                    {result}
                </div>
            </div>
            {operation}
        </div>
    )
}
