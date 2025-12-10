import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Tema } from "../../config/theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsLeftRight, faX } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { BotonQuery } from "../../components/BotonQuery";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";

export default function SliderInstItem({ hasSlider, setHasSlider }) {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollMax = 1650;
      const scrollMin = 800;
      console.log(scrollTop);
      return;
      if (scrollTop > scrollMax || scrollTop < scrollMin) {
        setHasSlider(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [izquierda, setIzquierda] = useState(true);
  const cerrarSlider = () => {
    setHasSlider(false);
    setIzquierda(true);
  };
  return (
    <Container
      className={`
      ${hasSlider ? " mostrar " : ""}
      ${izquierda ? " izquierda " : " derecha "}
      `}
    >
      <CajaTitulo>
        <Xcerrar className="iconMover" onClick={() => setIzquierda(!izquierda)}>
          <Icono icon={faArrowsLeftRight} />
        </Xcerrar>
        <Titulo>Masilla Keraflor</Titulo>
        <Xcerrar onClick={() => cerrarSlider()}>
          <Icono icon={faX} />
        </Xcerrar>
      </CajaTitulo>

      <CajaContenido>
        <WrapParrafo>
          <Subtitulo>Funcion:</Subtitulo>
          <Parrafo>
            Es utilizada para fraguar el Durock, primero en las juntas y luego
            en toda la plancha, basicamente empañeta la planta.
          </Parrafo>
        </WrapParrafo>
        <WrapParrafo>
          <Subtitulo>Cuando utilizar:</Subtitulo>
          <Parrafo>
            Es imprecindible empañetar la plancha para una correcta instalacion.
          </Parrafo>
        </WrapParrafo>
        <WrapParrafo>
          <Subtitulo>Alternativas:</Subtitulo>
          <CajaTabla>
            <Tabla>
              <thead>
                <Filas className="cabeza">
                  <CeldaHead>N°</CeldaHead>
                  <CeldaHead>Codigo*</CeldaHead>
                  <CeldaHead>Descripcion</CeldaHead>
                </Filas>
              </thead>
              <tbody>
                <Filas className="body">
                  <CeldasBody>{1}</CeldasBody>
                  <CeldasBody>
                    <Enlaces
                      //   to={`/transportes/maestros/proyectos${encodeURIComponent(proy.numeroDoc)}`}
                      target="_blank"
                    >
                      04079
                    </Enlaces>
                  </CeldasBody>
                  <CeldasBody>Masilla Base coat Mapei</CeldasBody>
                </Filas>
                <Filas className="body">
                  <CeldasBody>{2}</CeldasBody>
                  <CeldasBody>
                    <Enlaces
                      //   to={`/transportes/maestros/proyectos${encodeURIComponent(proy.numeroDoc)}`}
                      target="_blank"
                    >
                      04421
                    </Enlaces>
                  </CeldasBody>
                  <CeldasBody>Pañete fino MDN 50 Lb</CeldasBody>
                </Filas>
              </tbody>
            </Tabla>
          </CajaTabla>
        </WrapParrafo>
        <WrapParrafo>
          <Subtitulo>Observaciones:</Subtitulo>
          <Lista>
            <Elemento>Es el producto mas recomendado para Durock</Elemento>
            <Elemento>
              Es el unico mortero capaz de recistir exterior en clima extremo.
            </Elemento>
          </Lista>
        </WrapParrafo>
        <WrapParrafo>
          <BtnSimple>Ver articulo</BtnSimple>
        </WrapParrafo>
      </CajaContenido>
    </Container>
  );
}

const Container = styled.div`
  width: 400px;
  height: 80vh;
  position: fixed;

  top: 70px;
  left: -400px;
  transition: ease all 0.2s;

  z-index: 200;
  border: 1px solid white;
  background-color: #14192bd5;
  backdrop-filter: blur(10px);
  border-radius: 5px;
  overflow: hidden;
  &.mostrar {
    &.izquierda {
      left: 330px;
    }
    &.derecha {
      left: auto;
      right: 330px;
    }
  }
`;
const CajaTitulo = styled.div`
  position: relative;
`;
const Titulo = styled.h2`
  width: 100%;
  text-align: center;
  padding: 15px;
  color: ${Tema.primary.azulBrillante};
  border-bottom: 2px solid ${Tema.primary.grisNatural};
`;
const Xcerrar = styled.p`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  font-size: 1.4rem;
  border: 1px solid ${Tema.primary.azulBrillante};
  padding: 5px;
  height: 100%;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${Tema.primary.azulBrillante};
  transition: ease 0.2s all;
  &:hover {
    cursor: pointer;
    color: white;
    border-color: white;
  }

  &.iconMover {
    right: auto;
    left: 0;
  }
`;
const Icono = styled(FontAwesomeIcon)``;
const CajaContenido = styled.div`
  padding: 0 15px;
  padding-top: 6px;
`;
const WrapParrafo = styled.div`
  margin-bottom: 15px;
`;
const Subtitulo = styled.div`
  color: ${Tema.complementary.warning};
  font-size: 1.4rem;
  text-decoration: underline;
  margin-bottom: 5px;
`;
const Parrafo = styled.p`
  /* color: ${Tema.secondary.azulBrillanteTG}; */
  color: ${Tema.neutral.blancoHueso};
`;

const CajaTabla = styled.div`
  padding: 0 10px;
  overflow-x: scroll;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  /* margin-bottom: 25px; */
`;

const Filas = styled.tr`
  color: ${Tema.neutral.blancoHueso};
  /* color: ${Tema.secondary.azulBrillanteTG}; */
  &.body {
    font-weight: normal;
    border-bottom: 1px solid red;
    background-color: ${Tema.secondary.azulSuave};
  }

  &.cabeza {
    background-color: ${Tema.secondary.azulProfundo};
  }
  &:hover {
    background-color: ${Tema.secondary.azulProfundo};
  }
  &.modalH {
    background-color: ${Tema.secondary.azulGraciel};
  }
`;

const CeldaHead = styled.th`
  padding: 3px 7px;
  text-align: center;
  border: 1px solid ${Tema.secondary.azulOpaco};

  font-size: 0.9rem;
`;
const CeldasBody = styled.td`
  font-size: 0.9rem;
  border: 1px solid ${Tema.secondary.azulOpaco};
  height: 25px;
  padding-left: 5px;
  padding-right: 5px;

  &.clicKeable {
    cursor: pointer;
    &:hover {
    }
  }

  text-align: center;
`;
const Enlaces = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const Lista = styled.ul`
  /* background-color: ${Tema.secondary.azulSuave}; */
  color: ${Tema.neutral.blancoHueso};
  /* color: ${Tema.secondary.azulBrillanteTG}; */
  padding-left: 15px;
`;
const Elemento = styled.li``;
const BtnSimple = styled(BtnGeneralButton)``;
