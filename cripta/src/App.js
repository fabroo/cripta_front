import React, { useState } from 'react';
import Card from './Components/Card'
import Tablero from './Components/Tablero'
import Operation from './Components/Operation'
import Info from './Components/Info'

function App() {
  const [cards, setCards] = useState([
    { valor: 1, palo: "espada" },
    { valor: 4, palo: "espada" },
    { valor: 6, palo: "basto" },
    { valor: 12, palo: "oro" },
    { valor: 8, palo: "copa" },
  ]);

  const [pressed, setPressed] = useState([false, false, false, false]);
  const [calculation, setCalculation] = useState("");
  const [lastType, setLastType] = useState("");

  const pressCard = (idx) => {
    if (!pressed[idx] && lastType != "num") {
      let temp = pressed;
      temp[idx] = true;
      setPressed(temp);
      setLastType("num");
      setCalculation(calculation + cards[idx + 1].valor + " ");
    }
    console.log("STATE", pressed)
  }
  const updateCalculation = (val) => {
    if (val == "(" && lastType != "num") {
      setCalculation(calculation + val + " ");
      setLastType("op")
    }
    else if (val == ")") {
      setCalculation(calculation + val + " ");
      setLastType("num")
    }
    else if (lastType == "num") {
      setCalculation(calculation + val + " ");
      setLastType("op");
    }
  }

  const calculateCripta = () => {
    if (pressed.includes(false)) {
      alert("No se puede calcular hasta que todas las cartas esten presionadas")
    }
    else {
      try {
        let result = eval(calculation);

        if (result == cards[cards.length - 1].valor) {
          setCalculation("Correcto!");
        }
        else {
          setCalculation(result + " :(");
        }
        setTimeout(() => {
          setCalculation("");
          setPressed([false, false, false, false]);
          setLastType("result");
        }, 2000);

      } catch (error) {
        alert("Error en la operacion")
        setCalculation("");
        setPressed([false, false, false, false]);
        setLastType("result");
      }

    }
  }

  return (
    <>
      <Info />
      <Tablero
        operation={<>
          <div className="operationBoard">
            <Operation handleChange={(val) => updateCalculation(val)} type="suma" />
            <Operation handleChange={(val) => updateCalculation(val)} type="resta" />
            <Operation handleChange={(val) => updateCalculation(val)} type="multiplicacion" />
            <Operation handleChange={(val) => updateCalculation(val)} type="division" />
            <Operation handleChange={(val) => updateCalculation(val)} type="par_open" />
            <Operation handleChange={(val) => updateCalculation(val)} type="par_close" />
            <Operation handleChange={() => calculateCripta()} type="igual" />
            <Operation handleChange={() => {
              setCalculation("");
              setPressed([false, false, false, false]);
              setLastType("result");
            }} type="clear" />
          </div>
        </>}

        result={
          <Card valor={cards[cards.length - 1].valor} palo={cards[cards.length - 1].palo} />
        }
      >
        {cards.slice(1, cards.length).map((card, idx) => {
          return <>
            <div className={`card ${!pressed[idx] ? 'cardPressable' : 'cardNotPressable'}`} onClick={() => pressCard(idx)} key={card.valor + " " + card.palo} >
              <Card valor={card.valor} palo={card.palo} />
            </div>
          </>
        })}

      </Tablero>
      {/* <div className='operationBoard'>
      

    </div> */}

      <div className="bottomContainer">
        <p className="calculation">{calculation ? calculation : `Target: ${cards[cards.length - 1].valor}`}</p>
      </div>
    </>
  );
}

export default App;
