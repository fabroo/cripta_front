import React, {useState,useEffect} from "react";
import Card from "./Components/Card";
import Tablero from "./Components/Tablero";
import Operation from "./Components/Operation";
import Info from "./Components/Info";
import axios from "axios";
import ReactCardFlip from "react-card-flip";
import Palo from "./Components/Palo";
import {BsKeyboard} from "react-icons/bs";
import {BiJoystickButton} from "react-icons/bi";
import {AiOutlineSend} from "react-icons/ai";
import {randomCards, checkIfDuplicateExists,cardsWithOne,} from "./Utils/functions";

function App() {
  const URL = "https://cripta.herokuapp.com";

  const [cards, setCards] = useState(randomCards(5));
  const [pressed, setPressed] = useState([false, false, false, false]);
  const [calculation, setCalculation] = useState("");
  const [lastType, setLastType] = useState("");
  const [counter, setCounter] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [steps, setSteps] = useState([]);
  const [duplicateIdxs, setDuplicateIdxs] = useState([]);
  const [processed, setProcessed] = useState("");
  const [specialCard, setSpecialCard] = useState(false);
  const [keyboardActive, setKeyboardActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const operators = /[*+/()-]/g;

  useEffect(() => {
      window.addEventListener("resize", () => {
          if (window.innerWidth <= 800) {
              setKeyboardActive(false);
          }
      });
      let flipCards = setTimeout(() => {
          setStartTime(Date.now());
          setIsFlipped(true);
      }, 500);
      return () => {
          clearTimeout(flipCards);
      };
  }, []);

  const handleChange = (e) => {
      let numbers = cards.map((card) => card.valor).slice(0, 4);
      let input = e.target.value;
      let lastNumber = "";

      for (let char = input.length - 1; char >= 0; char--) {
          if (!input[char].match(operators)) {
              lastNumber += input[char];
          } else {
              break;
          }
      }
      lastNumber = lastNumber.split("").reverse().join("");

      if (lastNumber == 1 && !specialCard && cardsWithOne(cards)) {
          setSpecialCard(true);
          setProcessed(input);
          return;
      } else if (lastNumber == 1 && specialCard) {
          setSpecialCard(false);
          setProcessed(input);
          return;
      }

      let countInput = input
          .split(operators)
          .map((item) => parseInt(item) == parseInt(lastNumber))
          .filter(Boolean).length;
      let numbersToStrings = numbers.map((number) => number.toString());
      let countNumbers = 0;

      for (let nS = 0; nS < numbersToStrings.length; nS++) {
          countNumbers = numbersToStrings[nS].includes(lastNumber) ?
              (countNumbers += 1) :
              countNumbers;
      }

      lastNumber = parseInt(lastNumber);
      if (
          specialCard &&
          (lastNumber == 1 || lastNumber == 2 || lastNumber == 0)
      ) {
          setSpecialCard(false);
          setProcessed(input);
      } else if (
          input[input.length - 1]?.match(operators) ||
          (numbers.includes(parseInt(lastNumber)) && countInput <= countNumbers) ||
          !input[input.length - 1]
      ) {
          setProcessed(input);
      }
  };

  const removeLast = () => {
      if (steps.length == 0) {
          alert("Ni empezaste chanta");
      } else {
          let last_type;

          if (steps[steps.length - 2]) {
              last_type = steps[steps.length - 2].type;
          } else {
              last_type = null;
          }

          let last_step = steps.pop();

          setLastType(last_type);

          if (last_step.type == "num") {
              for (let i = 0; i < 4; i++) {
                  if (cards[i].valor == last_step.valor && pressed[i] == true) {
                      if (!duplicateIdxs.includes(i)) {
                          let temp = pressed;
                          temp[i] = false;
                          setPressed(temp);
                          setDuplicateIdxs([...duplicateIdxs, i]);
                          break;
                      }
                  }
              }
          }
          if (String(last_step.valor).length == 2) {
              setCalculation(calculation.substring(0, calculation.length - 3));
          } else {
              setCalculation(calculation.substring(0, calculation.length - 2));
          }
      }
  };

  const resetState = () => {
      setCalculation("");
      setPressed([false, false, false, false]);
      setLastType("result");
      setProcessed("");
      setDuplicateIdxs([]);
      setCounter(0);
      setIsFlipped(false);
  };

  const shuffle = () => {
      let randomIdx = Math.floor(Math.random() * 3);
      let newCard = randomCards(1)[0];
      let temp = cards;
      temp[randomIdx] = newCard;
      if (checkIfDuplicateExists(temp.map((carta) => carta.valor + carta.palo))) {
          shuffle();
      } else {
          setCards(temp);
          resetState();

          setTimeout(() => {
              setIsFlipped(true);
              setStartTime(Date.now());
          }, 500);
      }
  };

  const pressCard = (idx) => {
      if (!pressed[idx] && lastType != "num" && !keyboardActive) {
          let temp = pressed;
          temp[idx] = true;
          setPressed(temp);
          setLastType("num");
          setSteps([...steps, {
              type: "num",
              valor: cards[idx].valor
          }]);
          setCalculation(calculation + cards[idx].valor + " ");
      }
  };

  const updateCalculation = (val) => {
      if (val == "(" && lastType != "num") {
          setSteps([...steps, {
              type: "op",
              valor: "("
          }]);
          setCalculation(calculation + val + " ");
          setLastType("op");
      } else if (val == ")") {
          setSteps([...steps, {
              type: "op",
              valor: ")"
          }]);
          setCalculation(calculation + val + " ");
          setLastType("num");
      } else if (lastType == "num") {
          setSteps([...steps, {
              type: "op",
              valor: val
          }]);
          setCalculation(calculation + val + " ");
          setLastType("op");
      }
  };

  const calculateCripta = async (from) => {
      if (
          (from != "keyboard" && pressed.includes(false)) ||
          (from == "keyboard" && processed.length == 0)
      ) {
          alert("Completá la partida campeón");
      } else {
          try {
              let result = eval(from == "keyboard" ? processed : calculation);

              if (result == cards[cards.length - 1].valor) {
                  var n = Math.round((Date.now() - startTime) / 1000);
                  setCalculation("Correcto! Terminaste en " + n + "s");
                  setCounter(counter + 1);

                  let combination = from == "keyboard" ? processed : calculation;

                  if (from == "keyboard") {
                      if (
                          combination
                          .split(/[+*/()-]/g)
                          .map((item) => item.length > 0)
                          .filter(Boolean).length != 4
                      ) {
                          throw "Error en la combinacion";
                      }
                  }

                  let res = await axios.post(`${URL}/newCombination`, {
                      cards: [
                          cards[0].valor,
                          cards[1].valor,
                          cards[2].valor,
                          cards[3].valor,
                      ],
                      target: cards[4].valor,
                      combination,
                  });

                  if (!res.data.error) {
                      alert("Combinacion guardada!");
                  } else {
                      alert("Error al guardar la combinacion");
                  }

                  setTimeout(() => {
                      resetState();

                      setTimeout(() => {
                          setCards(randomCards(5));
                          setStartTime(Date.now());
                          setIsFlipped(true);
                      }, 500);
                  }, 2000);
              } else {
                  setCalculation(result + " :(");
                  setTimeout(() => {
                      resetState();
                  }, 2000);
              }
          } catch (error) {
              alert(
                  "Fijate que hayas usado los operadores correctamente o que la combinacion sea correcta"
              );
              resetState();
          }
      }
  };
  return (
    <>
      <div className="topContainer">
        <div className="infoBtn" onClick={() => alert("reglas cripta smh")}>
          <Info />
        </div>
        <div
          className="toggleBtn"
          onClick={() => setKeyboardActive(!keyboardActive)}
        >
          {!keyboardActive ? (
            <BsKeyboard className="infoIcon" color="#7D84B2" size={32} />
          ) : (
            <BiJoystickButton className="infoIcon" color="#7D84B2" size={32} />
          )}
        </div>
      </div>

      <Tablero
        operation={
          <>
            {keyboardActive ? (
              <div className="keyboardBoard">
                <input
                  className="keyboard"
                  value={processed}
                  onChange={(e) => handleChange(e)}
                  type="text"
                  placeholder="a * (b / c)"
                />
                <div
                  onClick={() => calculateCripta("keyboard")}
                  className="submit"
                >
                  <AiOutlineSend size={24} />
                </div>
              </div>
            ) : (
              <div className="operationBoard">
                <div className="firstRow">
                  <Operation
                    handleChange={(val) => updateCalculation(val)}
                    type="suma"
                  />
                  <Operation
                    handleChange={(val) => updateCalculation(val)}
                    type="resta"
                  />
                  <Operation
                    handleChange={(val) => updateCalculation(val)}
                    type="multiplicacion"
                  />
                  <Operation
                    handleChange={(val) => updateCalculation(val)}
                    type="division"
                  />
                  <Operation
                    handleChange={(val) => updateCalculation(val)}
                    type="par_open"
                  />
                  <Operation
                    handleChange={(val) => updateCalculation(val)}
                    type="par_close"
                  />
                </div>
                <div className="secondRow">
                  <Operation
                    handleChange={() => calculateCripta()}
                    type="igual"
                  />
                  <Operation handleChange={() => removeLast()} type="back" />
                  <Operation handleChange={() => shuffle()} type="shuffle" />
                  <Operation
                    handleChange={() => {
                      setCalculation("");
                      setPressed([false, false, false, false]);
                      setLastType("result");
                    }}
                    type="clear"
                  />
                </div>
              </div>
            )}
          </>
        }
        result={
          <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
            <div className="card resultCardUnFlipped">
              <Palo
                className="typeUnFlipped"
                type={cards[cards.length - 1].palo}
              />
            </div>

            <div className="card resultCardFlipped">
              <Card
                valor={cards[cards.length - 1].valor}
                palo={cards[cards.length - 1].palo}
              />
            </div>
          </ReactCardFlip>
        }
      >
        {cards.map((card, idx) => {
          if (idx < 4) {
            return (
              <ReactCardFlip
                key={card.valor + " " + card.palo}
                isFlipped={isFlipped}
                flipDirection="horizontal"
              >
                <div className="card cardUnFlipped">
                  <Palo className="typeUnFlipped" type={card.palo} />
                </div>
                <div
                  className={`card ${
                    !pressed[idx] ? "cardPressable" : "cardNotPressable"
                  }`}
                  onClick={() => pressCard(idx)}
                >
                  <div className="cardFlipped">
                    <Card valor={card.valor} palo={card.palo} />
                  </div>
                </div>
              </ReactCardFlip>
            );
          }
        })}
      </Tablero>

      <div className="bottomContainer">
        <p id="calculation" className="calculation">
          {calculation
            ? calculation
            : `Target: ${cards[cards.length - 1].valor}`}
        </p>
      </div>
    </>
  );
}

export default App;
