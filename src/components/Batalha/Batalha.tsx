import { useState } from "react";
import Barra from "../Barra/Barra";
import Botoes from "../Botoes/Botoes";
import Quadro from "../Quadro/Quadro";
import "./Batalha.css";
import dados from "../../assets/dados.json";

export default function Batalha() {
  const [pvJ1, setPvJ1] = useState(100);
  const [pvJ2, setPvJ2] = useState(100);
  const [turno, setTurno] = useState(0);
  const [mensagem, setMensagem] = useState("Comeca o Jogo");

  const [itensJ1, setItensJ1] = useState(structuredClone(dados.itensJ1));
  const [itensJ2, setItensJ2] = useState(structuredClone(dados.itensJ2));
  const [ataquesJ1, setAtaqueJ1] = useState(structuredClone(dados.ataquesJ1));
  const [ataquesJ2, setAtaqueJ2] = useState(structuredClone(dados.ataquesJ2));

  function resetarBatalha() {
    setPvJ1(100);
    setPvJ2(100);
    setTurno(0);
    setMensagem("Comeca o Jogo");
    setItensJ1(structuredClone(dados.itensJ1));
    setItensJ2(structuredClone(dados.itensJ2));
    setAtaqueJ1(structuredClone(dados.ataquesJ1));
    setAtaqueJ2(structuredClone(dados.ataquesJ2));
  }

  function acertou(precisao: number) {
    return Math.random() * 100 <= precisao;
  }

  function Turno(atacante: "J1" | "J2") {
    if (atacante === "J1") return turno % 2 === 0;
    else if (atacante === "J2") return turno % 2 !== 0;

    return false;
  }

  function verificaGanhador() {
    if (pvJ1 === 0 || pvJ2 === 0) return true;
    else return false;
  }

  function modificaPV(
    atacante: "J1" | "J2",
    index: number,
    acao: "ataca" | "cura"
  ) {
    const ataqueJ1 = structuredClone(ataquesJ1);
    const ataqueJ2 = structuredClone(ataquesJ2);
    const itemJ1 = structuredClone(itensJ1);
    const itemJ2 = structuredClone(itensJ2);

    if (acao === "ataca") {
      if (atacante === "J1") {
        if (acertou(ataqueJ1[index].precisao)) {
          setPvJ2((prevPv) => Math.max(prevPv - ataqueJ1[index].dano, 0));
          ataqueJ1[index].pp -= 1;
          setAtaqueJ1(ataqueJ1);
          setMensagem(`${ataqueJ1[index].nome} acertou`);
        } else {
          ataqueJ1[index].pp -= 1;
          setAtaqueJ1(ataqueJ1);
          setMensagem(`${ataqueJ1[index].nome} errou`);
        }
      } else if (atacante === "J2") {
        if (acertou(ataqueJ2[index].precisao)) {
          setPvJ1((prevPv) => Math.max(prevPv - ataqueJ2[index].dano, 0));
          ataqueJ2[index].pp -= 1;
          setAtaqueJ2(ataqueJ2);
          setMensagem(`${ataqueJ2[index].nome} acertou`);
        } else {
          ataqueJ2[index].pp -= 1;
          setAtaqueJ2(ataqueJ2);
          setMensagem(`${ataqueJ2[index].nome} errou`);
        }
      }
    } else if (acao === "cura") {
      if (atacante === "J1") {
        setPvJ1((prevPv) => Math.min(prevPv + itemJ1[index].cura, 100));
        for (let i = 0; i < ataqueJ1.length; i++) {
          ataqueJ1[i].pp = Math.min(
            ataqueJ1[i].pp + itemJ1[index].recuperaPP,
            ataqueJ1[i].ppMax
          );
        }
        itemJ1[index].uso -= 1;
        setItensJ1(itemJ1);
        setAtaqueJ1(ataqueJ1);
      } else if (atacante === "J2") {
        setPvJ2((prevPv) => Math.min(prevPv + itemJ1[index].cura, 100));
        for (let i = 0; i < ataqueJ2.length; i++) {
          ataqueJ2[i].pp = Math.min(
            ataqueJ2[i].pp + itemJ2[index].recuperaPP,
            ataqueJ2[i].ppMax
          );
        }
        itemJ2[index].uso -= 1;
        setItensJ2(itemJ2);
        setAtaqueJ2(ataqueJ2);
      }
    }
  }

  function atacar(atacante: "J1" | "J2", index: number) {
    modificaPV(atacante, index, "ataca");
    setTurno((prevTurno) => prevTurno + 1);
  }

  function usarItem(atacante: "J1" | "J2", index: number) {
    modificaPV(atacante, index, "cura");
    setTurno((prevTurno) => prevTurno + 1);
  }

  return (
    <>
      <Quadro
        pvJ1={pvJ1}
        pvJ2={pvJ2}
        turno={turno}
        descricao={mensagem}
        ganhador={() => verificaGanhador()}
        resetar={() => resetarBatalha()}
      />
      <div className="containerJogador1">
        <img src="../src/assets/pikachu-seeklogo.svg" width={300} />
        <Barra
          pv={pvJ1}
          turno={Turno("J1")}
          ganhador={() => verificaGanhador()}
        >
          <Botoes
            ataques={ataquesJ1}
            atacar={(index) => atacar("J1", index)}
            itens={itensJ1}
            usarItem={(index) => usarItem("J1", index)}
            turno={Turno("J1")}
            ganhador={() => verificaGanhador()}
          />
        </Barra>
      </div>
      <div className="containerJogador2">
        <img src="../src/assets/charizard-seeklogo.png" width={300} />
        <Barra
          pv={pvJ2}
          turno={Turno("J2")}
          ganhador={() => verificaGanhador()}
        >
          <Botoes
            ataques={ataquesJ2}
            atacar={(index) => atacar("J2", index)}
            itens={itensJ2}
            usarItem={(index) => usarItem("J2", index)}
            turno={Turno("J2")}
            ganhador={() => verificaGanhador()}
          />
        </Barra>
      </div>
    </>
  );
}
