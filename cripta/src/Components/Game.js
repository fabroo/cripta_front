import React, { Component } from "react";
import Card from "./Card";
import Tablero from "./Tablero";
import Operation from "./Operation";
import Info from "./Info";
import axios from "axios";
import ReactCardFlip from "react-card-flip";
import Palo from "./Palo";
import { BsKeyboard } from "react-icons/bs";
import { GiPodium } from "react-icons/gi";
import { BiJoystickButton, BiLogIn, BiLogOut } from "react-icons/bi";
import { AiOutlineSend } from "react-icons/ai";
import { MdOutlineQueryStats } from "react-icons/md";
import jwt from "jwt-decode";
import ReactTooltip from "react-tooltip";

import {
  randomCards,
  checkIfDuplicateExists,
  cardsWithOne,
} from "../Utils/functions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class AppClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      pressed: [false, false, false, false],
      calculation: "",
      lastType: "",
      counter: 0,
      isFlipped: false,
      steps: [],
      duplicateIdxs: [],
      processed: "",
      specialCard: false,
      keyboardActive: false,
      startTime: null,
      operators: /[*+/()-]/g,
      URL: "https://cripta.herokuapp.com",
      keybinds: {
        r: this.shuffle,
        c: this.resetState,
        k: this.handleKeyboard,
        backspace: this.removeLast,
        enter: this.calculateCripta,
      },
      user: {},
      token: null,
    };
  }
  notify = (msg) =>
    toast(msg, {
      autoClose: 3000,
      pauseOnHover: false,
    });

  componentDidMount() {
    let token = localStorage.getItem("token");
    if (token) {
      let data = jwt(token);
      let { user } = data;
      this.notify("Hola de vuelta, " + user.username + "!");
      this.setState({
        token: token,
        user,
      });
    }
    this.setState({
      cards: randomCards(5),
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth <= 800) {
        this.setState({
          keyboardActive: false,
        });
      }
    });

    window.addEventListener("keydown", this.handleKeybind, false);

    this.timer = setTimeout(() => {
      var d = Date.now();
      this.setState({
        startTime: d,
        isFlipped: true,
      });
    }, 500);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    // LE AGREGUE SEGUNDO PARAMETRO PQ TIRABA ERROR
    window.removeEventListener("keydown", this.handleKeybind, false);
  }

  handleKeybind = (e) => {
    var k = e.key.toLowerCase();
    if (k in this.state.keybinds) {
      var f = this.state.keybinds[k];

      if (f == this.removeLast || f == this.resetState) {
        if (!this.state.keyboardActive) f();
      } else if (f == this.calculateCripta) f("keyboard");
      else f();
    }
  };

  handleKeyboard = () => {
    this.setState((prevState) => ({
      keyboardActive: !prevState.keyboardActive,
    }));
    document.getElementById("kb").focus();
  };

  handleChange = (e) => {
    let numbers = this.state.cards.map((card) => card.valor).slice(0, 4);
    let input = e.target.value;
    let lastNumber = "";

    for (let char = input.length - 1; char >= 0; char--) {
      if (!input[char].match(this.state.operators)) {
        lastNumber += input[char];
      } else {
        break;
      }
    }
    lastNumber = lastNumber.split("").reverse().join("");

    if (
      lastNumber == 1 &&
      !this.state.specialCard &&
      cardsWithOne(this.state.cards)
    ) {
      this.setState({
        specialCard: true,
        processed: input,
      });
      return;
    } else if (lastNumber == 1 && this.state.specialCard) {
      this.setState({
        specialCard: false,
        processed: input,
      });
      return;
    }

    let countInput = input
      .split(this.state.operators)
      .map((item) => parseInt(item) == parseInt(lastNumber))
      .filter(Boolean).length;
    let numbersToStrings = numbers.map((number) => number.toString());
    let countNumbers = 0;

    for (let nS = 0; nS < numbersToStrings.length; nS++) {
      countNumbers = numbersToStrings[nS].includes(lastNumber)
        ? (countNumbers += 1)
        : countNumbers;
    }

    lastNumber = parseInt(lastNumber);
    if (
      this.state.specialCard &&
      (lastNumber == 1 || lastNumber == 2 || lastNumber == 0)
    ) {
      this.setState({
        specialCard: false,
        processed: input,
      });
    } else if (
      input[input.length - 1]?.match(this.state.operators) ||
      (numbers.includes(parseInt(lastNumber)) && countInput <= countNumbers) ||
      !input[input.length - 1]
    ) {
      this.setState({
        processed: input,
      });
    }
  };

  removeLast = () => {
    if (this.state.steps.length == 0) {
      // this.notify("Ni empezaste chanta");
      this.notify("Ni empezaste chanta");
    } else {
      let last_type;

      if (this.state.steps[this.state.steps.length - 2]) {
        last_type = this.state.steps[this.state.steps.length - 2].type;
      } else {
        last_type = null;
      }

      let last_step = this.state.steps.pop();

      this.setState({
        lastType: last_type,
      });

      if (last_step.type == "num") {
        for (let i = 0; i < 4; i++) {
          if (
            this.state.cards[i].valor == last_step.valor &&
            this.state.pressed[i] == true
          ) {
            if (!this.state.duplicateIdxs.includes(i)) {
              let temp = this.state.pressed;
              temp[i] = false;
              this.setState({
                pressed: temp,
                duplicateIdxs: [...this.state.duplicateIdxs, i],
              });
              break;
            }
          }
        }
      }
      if (String(last_step.valor).length == 2) {
        //   setCalculation(calculation.substring(0, calculation.length - 3));
        this.setState({
          calculation: this.state.calculation.slice(0, -2),
        });
      } else {
        //   setCalculation(calculation.substring(0, calculation.length - 2));
        this.setState({
          calculation: this.state.calculation.slice(0, -1),
        });
      }
    }
  };

  resetState = () => {
    this.setState({
      pressed: [false, false, false, false],
      lastType: "result",
      processed: "",
      duplicateIdxs: [],
      counter: 0,
      calculation: "",
    });
  };

  shuffle = () => {
    // PORQUE NO DEJA PONER * 4
    let randomIdx = Math.floor(Math.random() * 3);
    let newCard = randomCards(1)[0];
    let temp = this.state.cards;
    temp[randomIdx] = newCard;
    if (checkIfDuplicateExists(temp.map((carta) => carta.valor + carta.palo))) {
      this.shuffle();
    } else {
      this.setState({
        cards: temp,
        isFlipped: false,
      });
      this.resetState();

      setTimeout(() => {
        var d = Date.now();
        this.setState({
          isFlipped: true,
          startTime: d,
        });
      }, 600);
    }
  };
  pressCard = (idx) => {
    if (
      !this.state.pressed[idx] &&
      this.state.lastType != "num" &&
      !this.state.keyboardActive
    ) {
      let temp = this.state.pressed;
      temp[idx] = true;
      this.setState({
        pressed: temp,
        lastType: "num",
        steps: [
          ...this.state.steps,
          {
            type: "num",
            valor: this.state.cards[idx].valor,
          },
        ],
        calculation: this.state.calculation + this.state.cards[idx].valor,
      });
    }
  };

  updateCalculation = (val) => {
    if (val == "(" && this.state.lastType != "num") {
      this.setState({
        steps: [
          ...this.state.steps,
          {
            type: "par",
            valor: "(",
          },
        ],
        calculation: this.state.calculation + val + " ",
        lastType: "par",
      });
    } else if (val == ")") {
      this.setState({
        steps: [
          ...this.state.steps,
          {
            type: "par",
            valor: ")",
          },
        ],
        calculation: this.state.calculation + val + " ",
        lastType: "par",
      });
    } else if (this.state.lastType == "num" || this.state.lastType == "par") {
      this.setState({
        steps: [
          ...this.state.steps,
          {
            type: "op",
            valor: val,
          },
        ],
        calculation: this.state.calculation + val + " ",
        lastType: "op",
      });
    }
  };

  calculateCripta = async (from) => {
    if (
      (from != "keyboard" && this.state.pressed.includes(false)) ||
      (from == "keyboard" && this.state.processed.length == 0)
    ) {
      this.notify("Complet?? la partida campe??n");
    } else {
      try {
        let result = eval(
          from == "keyboard" ? this.state.processed : this.state.calculation
        );

        if (result == this.state.cards[this.state.cards.length - 1].valor) {
          let n = Math.round((Date.now() - this.state.startTime) / 1000);
          this.setState({
            calculation: "Correcto! Terminaste en " + n + " s",
            counter: this.state.counter + 1,
          });

          let combination =
            from == "keyboard" ? this.state.processed : this.state.calculation;

          if (from == "keyboard") {
            if (
              combination
                .split(this.state.operators)
                .map((item) => item.length > 0)
                .filter(Boolean).length != 4
            ) {
              throw "Error en la combinacion";
            }
          }

          let res = await axios.post(
            `${this.state.URL}/newCombination`,
            {
              cards: [
                this.state.cards[0].valor,
                this.state.cards[1].valor,
                this.state.cards[2].valor,
                this.state.cards[3].valor,
              ],
              target: this.state.cards[4].valor,
              combination,
              time: this.state.token ? n : null,
            },
            this.state.token
              ? { headers: { authorization: `Basic ${this.state.token}` } }
              : {}
          );

          if (!res.data.error) {
            this.notify("Combinacion guardada!");
          } else {
            this.notify("Error al guardar la combinacion");
          }

          setTimeout(() => {
            this.resetState();
            this.setState({ isFlipped: false });
            setTimeout(() => {
              var d = Date.now();
              this.setState({
                cards: randomCards(5),
                startTime: d,
                isFlipped: true,
              });
            }, 1000);
          }, 2000);
        } else {
          this.setState({
            calculation: result + ":(",
          });
          setTimeout(() => {
            this.resetState();
          }, 2000);
        }
      } catch (error) {
        console.log(error);
        this.notify(
          "Fijate que hayas usado los operadores correctamente o que la combinacion sea correcta"
        );
        this.resetState();
      }
    }
  };
  render() {
    return (
      <>
        <div className="topContainer">
          <div data-tip="Info" className="infoBtn" onClick={() => alert("reglas cripta smh")}>
            <Info />
          </div>
          <div
          data-tip= {this.state.keyboardActive ? "Controles" : "Teclado"}
            className="toggleBtn"
            onClick={() => {
              this.setState({
                keyboardActive: !this.state.keyboardActive,
                pressed: [false, false, false, false],
                calculation: "",
              });
            }}
          >
            {!this.state.keyboardActive ? (
              <BsKeyboard className="infoIcon" color="#7D84B2" size={32} />
            ) : (
              <BiJoystickButton
                className="infoIcon"
                color="#7D84B2"
                size={32}
              />
            )}
          </div>
          <div
            data-tip="Estadisticas"
            className="toggleBtn"
            onClick={() => {
              window.location.href = "/stats";
            }}
          >
            <MdOutlineQueryStats
              className="infoIcon"
              color="#7D84B2"
              size={32}
            />
          </div>
          <div
            data-tip="Podio"
            className="toggleBtn"
            onClick={() => {
              window.location.href = "/podio";
            }}
          >
            <GiPodium
              className="infoIcon"
              color="#7D84B2"
              size={32}
            />
          </div>
          <div
            data-tip={this.state.token ? "Logout" : "Login"}
            className="toggleBtn"
            onClick={() => {
              if (this.state.token) {
                this.setState({
                  token: null,
                  user: {},
                });
                localStorage.removeItem("token");
                window.location.href = "/login";
              } else {
                window.location.href = "/login";
              }
            }}
          >
            {!this.state.token ? (
              <BiLogIn className="infoIcon" color="#7D84B2" size={32} />
            ) : (
              <BiLogOut className="infoIcon" color="#7D84B2" size={32} />
            )}
          </div>
        </div>

        {this.state.cards.length && (
          <Tablero
            operation={
              <>
                {this.state.keyboardActive ? (
                  <div className="keyboardBoard">
                    <input
                      className="keyboard"
                      id="kb"
                      value={this.state.processed}
                      onChange={(e) => this.handleChange(e)}
                      type="text"
                      placeholder="a * (b / c)"
                    />
                    <Operation
                      handleChange={() => this.shuffle()}
                      type="shuffle"
                      className="round"
                    />

                    <div
                      onClick={() => this.calculateCripta("keyboard")}
                      className="submit"
                    >
                      <AiOutlineSend size={24} />
                    </div>
                  </div>
                ) : (
                  <div className="operationBoard">
                    <div className="firstRow">
                      <Operation
                        handleChange={(val) => this.updateCalculation(val)}
                        type="suma"
                      />
                      <Operation
                        handleChange={(val) => this.updateCalculation(val)}
                        type="resta"
                      />
                      <Operation
                        handleChange={(val) => this.updateCalculation(val)}
                        type="multiplicacion"
                      />
                      <Operation
                        handleChange={(val) => this.updateCalculation(val)}
                        type="division"
                      />
                      <Operation
                        handleChange={(val) => this.updateCalculation(val)}
                        type="par_open"
                      />
                      <Operation
                        handleChange={(val) => this.updateCalculation(val)}
                        type="par_close"
                      />
                    </div>
                    <div className="secondRow">
                      <Operation
                        handleChange={() => this.calculateCripta()}
                        type="igual"
                      />
                      <Operation
                        handleChange={() => this.removeLast()}
                        type="back"
                      />
                      <Operation
                        handleChange={() => this.shuffle()}
                        type="shuffle"
                      />
                      <Operation
                        handleChange={() => {
                          this.resetState();
                        }}
                        type="clear"
                      />
                    </div>
                  </div>
                )}
              </>
            }
            result={
              <ReactCardFlip
                isFlipped={this.state.isFlipped}
                flipDirection="horizontal"
              >
                <div className="card resultCardUnFlipped">
                  <Palo
                    className="typeUnFlipped"
                    type={this.state.cards[this.state.cards.length - 1].palo}
                  />
                </div>

                <div className="card resultCardFlipped">
                  <Card
                    valor={this.state.cards[this.state.cards.length - 1].valor}
                    palo={this.state.cards[this.state.cards.length - 1].palo}
                  />
                </div>
              </ReactCardFlip>
            }
          >
            {this.state.cards.map((card, idx) => {
              if (idx < 4) {
                return (
                  <ReactCardFlip
                    key={card.valor + " " + card.palo}
                    isFlipped={this.state.isFlipped}
                    flipDirection="horizontal"
                  >
                    <div className="card cardUnFlipped">
                      <Palo className="typeUnFlipped" type={card.palo} />
                    </div>
                    <div
                      className={`card ${
                        !this.state.pressed[idx]
                          ? "cardPressable"
                          : "cardNotPressable"
                      }`}
                      onClick={() => this.pressCard(idx)}
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
        )}

        {this.state.cards.length && (
          <div className="bottomContainer">
            <p id="calculation" className="calculation">
              {this.state.calculation
                ? this.state.calculation
                : `Target: ${
                    this.state.cards[this.state.cards.length - 1].valor
                  }`}
            </p>
          </div>
        )}
        <ToastContainer />
        <ReactTooltip place="left" type="dark" effect="solid" />
      </>
    );
  }
}
