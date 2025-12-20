import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsLeftRight, faX } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

import { Tema } from "../../../../config/theme";
import { BtnGeneralButton } from "../../../../components/BtnGeneralButton";
import { BotonQuery } from "../../../../components/BotonQuery";

export default function SliderInstItem({
  hasSlider,
  setHasSlider,
  productSelect,
}) {
  console.log(productSelect);
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
  const navigate = useNavigate();
  const verItem = () => {
    window.open(
      "/articulos/maestros/productos/" + productSelect.head.codigo,
      "_blank"
    );
  };
  return (
    <Container
      className={`
      ${hasSlider ? " mostrar " : ""}
      ${izquierda ? " izquierda " : " derecha "}
      `}
    >
      <CajaTitulo>
        <Titulo>{productSelect.head.descripcion}</Titulo>
        <Xcerrar className="iconMover" onClick={() => setIzquierda(!izquierda)}>
          <Icono icon={faArrowsLeftRight} />
        </Xcerrar>
        <Xcerrar onClick={() => cerrarSlider()}>
          <Icono icon={faX} />
        </Xcerrar>
      </CajaTitulo>

      <CajaContenido>
        <WrapParrafo>
          <Subtitulo>Funcion:</Subtitulo>
          <Parrafo>{productSelect.datosAux.funcion}</Parrafo>
        </WrapParrafo>
        <WrapParrafo>
          <Subtitulo>Cuando utilizar:</Subtitulo>
          <Parrafo>{productSelect.datosAux.cuandoUtilizar}</Parrafo>
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
                {productSelect.datosAux.altenativas.map((alt, index) => {
                  return (
                    <Filas className="body">
                      <CeldasBody>{index + 1}</CeldasBody>
                      <CeldasBody>
                        <Enlaces
                          to={`/articulos/maestros/productos/${encodeURIComponent(alt.codigo)}`}
                          target="_blank"
                        >
                          {alt.codigo}
                        </Enlaces>
                      </CeldasBody>
                      <CeldasBody>{alt.descripcion}</CeldasBody>
                    </Filas>
                  );
                })}
              </tbody>
            </Tabla>
          </CajaTabla>
        </WrapParrafo>
        <WrapParrafo>
          <Subtitulo>Observaciones:</Subtitulo>
          <Lista>
            {productSelect.datosAux.observaciones.map((obs, index) => {
              return <Elemento>{obs}</Elemento>;
            })}
          </Lista>
        </WrapParrafo>
        <WrapParrafo>
          <BtnSimple onClick={() => verItem()}>Ver articulo</BtnSimple>
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
  display: flex;
`;
const Titulo = styled.h2`
  width: 100%;
  text-align: center;
  padding: 15px;
  color: ${Tema.primary.azulBrillante};
  border-bottom: 2px solid ${Tema.primary.grisNatural};
  font-size: 20px;
  font-weight: 400;
`;
const Xcerrar = styled.p`
  /* position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%); */
  font-size: 1rem;
  border: 1px solid ${Tema.primary.azulBrillante};
  padding: 7px;
  /* height: 100%; */
  width: 25px;
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
