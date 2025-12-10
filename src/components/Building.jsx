import { useState, useEffect } from "react";
import styled from "styled-components";
import ImagenBuildWeb from "./../../public/img/buildWeb.svg";
import { ClearTheme, Tema, Theme } from "../config/theme";
import { CalcDay } from "../libs/CalcDay";
import Footer from "./Footer";

export const Building = ({
  isBuilding,
  setIsBuilding,
  fechaInicial,
  fechaFinal,
  funcionesFuturas,
  titulo,
  fechaEstimada,
  imgBuild,
}) => {
  const [hijosBarra, setHijosBarra] = useState([]);
  const [porcentaje, setPorcentaje] = useState("");

  useEffect(() => {
    let newHijo = [];
    if (fechaFinal && fechaInicial) {
      setPorcentaje(CalcDay(fechaInicial, fechaFinal));
    } else {
      setPorcentaje(0);
    }
    for (let i = 0; i < porcentaje; i++) {
      newHijo.push("");
    }
    setHijosBarra(newHijo);
  }, [porcentaje, fechaFinal, fechaInicial]);

  useEffect(() => {
    document.title = "Caeloss - Transporte";
    return () => {
      document.title = "Caeloss";
    };
  }, []);
  const [clickImg, setClickImg] = useState(false);
  const [clickBarra, setClickBarra] = useState(false);
  const desbloquear = (e) => {
    const name = e.target.name;
    const nameDatased = e.target.dataset.name;
    if (name == "imagen") {
      setClickImg(true);
    }
    if (nameDatased == "barra") {
      setClickBarra(true);
    }
  };
  useEffect(() => {
    if (clickBarra == true && clickImg == true) {
      setIsBuilding(false);
    }
  }, [clickBarra, clickImg]);
  return (
    <>
      {isBuilding && (
        <CajaBuild>
          <Texto>En construccion...</Texto>
          <SubTexto>Fecha estimada: {fechaEstimada}</SubTexto>

          <BarraProgres data-name="barra" onClick={(e) => desbloquear(e)}>
            <NumberPor>{porcentaje + "%"}</NumberPor>
            {hijosBarra?.map((hijo, index) => {
              return (
                <HijosBarra
                  data-name="barra"
                  onClick={(e) => desbloquear(e)}
                  key={index}
                >
                  {}
                </HijosBarra>
              );
            })}
          </BarraProgres>
          <CajaVentajas>
            <TituloLista>{titulo}</TituloLista>
            <ListaDesordenada>
              {funcionesFuturas?.map((funcion, index) => {
                return <ElementoLista key={index}>{funcion}</ElementoLista>;
              })}
            </ListaDesordenada>
          </CajaVentajas>

          <CajaImg>
            <Img
              name="imagen"
              onClick={(e) => desbloquear(e)}
              src={imgBuild ? imgBuild : ImagenBuildWeb}
            />
          </CajaImg>
          <Footer />
        </CajaBuild>
      )}
    </>
  );
};

const CajaBuild = styled.div`
  width: 100%;
  /* height:90vh; */
  padding: 0.1px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Texto = styled.h2`
  color: white;
  font-size: 2rem;
`;
const SubTexto = styled.h3`
  color: ${Tema.neutral.blancoHueso};
  color: #ffffff;
`;
const NumberPor = styled.h2`
  color: white;
  font-size: 2.5rem;
  position: absolute;
  right: 45%;
`;
const CajaImg = styled.div`
  width: 90%;
  height: 500px;
  margin-bottom: 100px;
  display: flex;
  justify-content: center;
  border: 4px solid ${Tema.complementary.warning};
  border-radius: 15px 0 15px 0;
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(5px);
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  /* -webkit-box-shadow: 1px 1px 2px 0px rgba(255, 184, 5, 0.75); */
  /* -moz-box-shadow: 1px 1px 2px 0px rgba(255, 184, 5, 0.75); */
`;
const Img = styled.img`
  width: 100%;
  object-fit: contain;
`;
const BarraProgres = styled.div`
  display: flex;
  background-color: ${Tema.secondary.azulProfundo};
  border: 1px solid ${Tema.primary.azulBrillante};
  width: 100%;
  height: 50px;
  justify-content: start;
  /* background-color: #707070; */
`;
const HijosBarra = styled.div`
  background-color: ${Tema.primary.azulBrillante};
  width: 1%;
`;

const CajaVentajas = styled.div`
  /* border: 1px solid red; */
  padding: 30px;
`;
const TituloLista = styled.h2`
  color: ${Tema.primary.azulBrillante};
  margin-bottom: 10px;
  color: white;
  text-decoration: underline;
`;
const ListaDesordenada = styled.ul`
  color: ${Tema.secondary.azulOpaco};
  color: white;
  padding-left: 15px;
`;

const ElementoLista = styled.li``;
