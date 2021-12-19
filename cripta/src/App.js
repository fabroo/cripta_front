import React, { useState } from 'react';
import Card from './Components/Card'
import Tablero from './Components/Tablero'
import Operation from './Components/Operation'
import Info from './Components/Info'


function App() {
  function checkIfDuplicateExists(arr) {
    return new Set(arr).size !== arr.length
  }

  const randomCards = (n) => {
    let types = ["basto", "espada", "copa", "oro"];
    let cards = [];

    for (let i = 0; i < n; i++) {
      cards.push({ valor: Math.ceil(Math.random() * 11), palo: types[Math.floor(Math.random() * 4)] })
    }

    let codes = cards.map(carta => carta.valor + carta.palo);

    if (checkIfDuplicateExists(codes)) {
      return randomCards(n)
    }
    return cards;
  }

  const [cards, setCards] = useState(randomCards(5));


  const [pressed, setPressed] = useState([false, false, false, false]);
  const [calculation, setCalculation] = useState("");
  const [lastType, setLastType] = useState("");

  const pressCard = (idx) => {
    if (!pressed[idx] && lastType != "num") {
      let temp = pressed;
      temp[idx] = true;
      setPressed(temp);
      setLastType("num");
      setCalculation(calculation + cards[idx].valor + " ");
    }
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
          setCards(randomCards(5));
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
        {cards.map((card, idx) => {
          if (idx < 4) {
            return (
              <div className={`card ${!pressed[idx] ? 'cardPressable' : 'cardNotPressable'}`} onClick={() => pressCard(idx)} key={card.valor + " " + card.palo} >
                <Card valor={card.valor} palo={card.palo} />
              </div>
            )
          }
        })}

      </Tablero>
      <div className="bottomContainer">
        <p className="calculation">{calculation ? calculation : `Target: ${cards[cards.length - 1].valor}`}</p>
      </div>
    </>
  );
}

export default App;
