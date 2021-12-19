import React, { useState, useEffect } from 'react';
import Card from './Components/Card'
import Tablero from './Components/Tablero'
import Operation from './Components/Operation'
import Info from './Components/Info'
import axios from 'axios';
import ReactCardFlip from 'react-card-flip';
import Palo from './Components/Palo'

function App() {

  const checkIfDuplicateExists = (arr) => {
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

  const URL = 'https://cripta.herokuapp.com';

  const [cards, setCards] = useState(randomCards(5));
  const [pressed, setPressed] = useState([false, false, false, false]);
  const [calculation, setCalculation] = useState("");
  const [lastType, setLastType] = useState("");
  const [counter, setCounter] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [steps, setSteps] = useState([]);
  const [duplicateIdxs, setDuplicateIdxs] = useState([]);

  useEffect(() => {
    let flipCards = setTimeout(() => setIsFlipped(true), 500);
    return () => {
      clearTimeout(flipCards);
    }
  }, [])

  const removeLast = () => {
    console.log("removed")
    console.log("STEPS", steps)
    if (steps.length == 0) {
      alert("Ni empezaste chanta")
    }
    else {
      let last_step = steps.pop()
      setLastType(last_step.type)
      if (last_step.type == "num") {
        for (let i = 0; i < cards.length - 1; i++) {
          if (cards[i].valor == last_step.valor) {
            if (!duplicateIdxs.includes(i)) {
              let temp = pressed;
              temp[i] = false;
              setPressed(temp);
              setDuplicateIdxs([...duplicateIdxs, i])
              break;
            }

          }
        }
      }
      if (String(last_step.valor).length == 2) {
        setCalculation(calculation.substring(0, calculation.length - 3))
      }
      else {
        setCalculation(calculation.substring(0, calculation.length - 2))
      }
    }
  }


  const pressCard = (idx) => {
    if (!pressed[idx] && lastType != "num") {
      let temp = pressed;
      temp[idx] = true;
      setPressed(temp);
      setLastType("num");
      setSteps([...steps, { type: "num", valor: cards[idx].valor }]);
      setCalculation(calculation + cards[idx].valor + " ");
    }
  }
  const updateCalculation = (val) => {
    if (val == "(" && lastType != "num") {
      setSteps([...steps, { type: "op", valor: "(" }]);
      setCalculation(calculation + val + " ");
      setLastType("op")
    }
    else if (val == ")") {
      setSteps([...steps, { type: "op", valor: ")" }]);
      setCalculation(calculation + val + " ");
      setLastType("num")
    }
    else if (lastType == "num") {
      setSteps([...steps, { type: "op", valor: val }]);
      setCalculation(calculation + val + " ");
      setLastType("op");
    }
  }

  const calculateCripta = async () => {
    if (pressed.includes(false)) {
      alert("No se puede calcular hasta que todas las cartas esten presionadas")
    }
    else {
      try {
        let result = eval(calculation);

        if (result == cards[cards.length - 1].valor) {
          setCalculation("Correcto!");
          setCounter(counter + 1);
          let res = await axios.post(`${URL}/newCombination`, {
            cards: [cards[0].valor, cards[1].valor, cards[2].valor, cards[3].valor],
            target: cards[4].valor,
            combination: calculation
          })

          if (!res.data.error) {
            alert("Combinacion guardada!");
          }
          else {
            alert("Error al guardar la combinacion");
          }

          setTimeout(() => {
            setCalculation("");
            setPressed([false, false, false, false]);
            setLastType("result");
            setIsFlipped(false);
            setTimeout(() => {
              setCards(randomCards(5));
              setIsFlipped(true);
            }, 500)
          }, 2000);
        }
        else {
          setCalculation(result + " :(");
          setTimeout(() => {
            setCalculation("");
            setPressed([false, false, false, false]);
            setLastType("result");
          }, 2000);
        }

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
            <Operation handleChange={() => removeLast()} type="back" />
            {/* <Operation handleChange={() => {
              setCalculation("");
              setPressed([false, false, false, false]);
              setLastType("result");
            }} type="clear" /> */}
          </div>
        </>}

        result={
          <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
            <div className="card resultCardUnFlipped" >
              <Palo className="typeUnFlipped" type={cards[cards.length - 1].palo} />
            </div>

            <div className="card resultCardFlipped">
              <Card valor={cards[cards.length - 1].valor} palo={cards[cards.length - 1].palo} />
            </div>
          </ReactCardFlip>
        }
      >
        {cards.map((card, idx) => {
          if (idx < 4) {
            return (
              <ReactCardFlip key={card.valor + " " + card.palo} isFlipped={isFlipped} flipDirection="horizontal">
                <div className="card cardUnFlipped" >
                  <Palo className="typeUnFlipped" type={card.palo} />
                </div>
                <div className={`card ${!pressed[idx] ? 'cardPressable' : 'cardNotPressable'}`} onClick={() => pressCard(idx)} >
                  <div className="cardFlipped">
                    <Card valor={card.valor} palo={card.palo} />
                  </div>
                </div>
              </ReactCardFlip>
            )
          }
        })}

      </Tablero>

      <div className="bottomContainer">
        <p className="calculation">{calculation ? calculation : `Target: ${cards[cards.length - 1].valor}`}</p>
      </div>
      {/* 
      <div className="counter">
        {counter > 0 ? `Completaste ${counter} seguidas` : ""}
      </div> */}
    </>
  );
}

export default App;
