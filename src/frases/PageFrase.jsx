import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ClearTheme, Theme } from "../config/theme";
import { FrasesDB } from "./FrasesDB";
import { BtnNormal } from "../components/BtnNormal";
export default function PageFrase({ centro, avanzarFrase }) {
  const coloresUtilizar = [
    Theme.primary.azulBrillante,
    ClearTheme.complementary.warningClear,
    ClearTheme.complementary.danger,
    "#64ff0a",
    ClearTheme.complementary.warningAmarillo,
    "white",
    "#000",
    "#5995df",
  ];

  let indexColor = 0;

  let indexMes = 0;
  let grupoMes = 2;

  const frasesParsed = FrasesDB.map((frase, index) => {
    indexColor = indexColor + 1;
    if (indexColor > coloresUtilizar.length - 1) {
      indexColor = 0;
    }

    if (indexMes >= 4) {
      indexMes = 1;
      grupoMes++;
    } else {
      indexMes++;
    }
    return {
      ...frase,
      fondo: coloresUtilizar[indexColor],
      grupoMes: grupoMes,
      numDentroMes: indexMes,
    };
  });
  const fraseFind = frasesParsed.find((frase, index) => {
    const fechaActual = new Date();
    const numMes = new Date().getMonth();
    const numDia = fechaActual.getDate() - 7;

    let isMesSelect = false;
    let isDayNumSelec = false;
    //    Mes
    if (numMes == frase.grupoMes) {
      isMesSelect = true;
    }

    //    Semana 1 del mes en curso
    if (numDia <= 6 && frase.numDentroMes == 1) {
      isDayNumSelec = true;
    }
    //    Semana 2 del mes en curso
    if (numDia >= 7 && numDia <= 13 && frase.numDentroMes == 2) {
      isDayNumSelec = true;
    }
    //    Semana 3 del mes en curso
    if (numDia >= 14 && numDia <= 20 && frase.numDentroMes == 3) {
      isDayNumSelec = true;
    }
    //    Semana 4 del mes en curso
    if (numDia >= 21 && frase.numDentroMes == 4) {
      isDayNumSelec = true;
    }
    // console.log(numDia);
    // console.log(numDia);
    // console.log(frase.numDentroMes);
    if (isMesSelect && isDayNumSelec) {
      return frase;
    }
  });

  //   const [fraseFind, setFraseFind] = useState();
  //   useEffect(() => {
  //     if (frasesParsed.length > 0) {
  //       setFraseFind(frasesParsed[avanzarFrase]);
  //     }
  //   }, [avanzarFrase]);
  //   console.log(frasesParsed);
  return (
    <Container className={centro ? "centro" : ""}>
      <CajaInterna className="sup">
        {/* <AvatarContainer
          className={centro ? "centro" : ""}
          $imageUrl={fraseFind?.fotoAutor}
        /> */}
        <CajaImg className={centro ? "centro" : ""}>
          <ImgAvatar
            className={centro ? "centro" : ""}
            src={fraseFind?.fotoAutor}
          />
        </CajaImg>
      </CajaInterna>
      <CajaInterna className={centro ? "centro inf" : "inf"}>
        <Frase>{fraseFind?.frase}</Frase>

        <Autor>{fraseFind?.autor}</Autor>
        <br />
        <br />
      </CajaInterna>
      <BarraColor
        $fondo={fraseFind?.fondo}
        className={centro ? "centro" : ""}
      />
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  height: 100%;
  /* background-color: blue; */
  /* border: 1px solid white; */
  /* position: relative; */
  /* overflow: hidden; */
`;
const CajaInterna = styled.div`
  /* justify-content: center; */
  padding-top: 8px;
  /* padding-left: 5px; */
  width: 100%;
  &.sup {
    height: 80px;
    /* border: 2px solid white; */
  }
  &.inf {
    color: transparent;
    height: 25%;
    height: 70px;
    transition: all ease 0.8s;
    /* overflow-y: auto; */

    min-width: 200px;
    &.centro {
      color: white;
    }
  }
`;

const AvatarContainer = styled.div`
  border: 2px solid ${ClearTheme.complementary.warningClear};
  width: 50px;
  height: 50px;
  background-image: ${(props) => `url(${props.$imageUrl})`};
  background-size: cover; /* Mantiene la proporción y cubre el área */
  background-position: center; /* Centra la imagen */
  border-radius: 50%;
  position: absolute;
  left: 0;
  transition: all ease 0.8s;
  /* Mejora la calidad de la imagen */
  image-rendering: crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  opacity: 0.6;

  &.centro {
    width: 75px;
    height: 75px;
    opacity: 1;
    left: 50%;
    transform: translate(-50%);
  }
`;
const CajaImg = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  &.centro {
  }
`;
const ImgAvatar = styled.img`
  border: 2px solid ${ClearTheme.complementary.warningClear};
  width: 50px;
  height: 50px;
  opacity: 0.6;
  /* position: absolute; */
  /* left: 0; */
  transition: all ease 0.8s;
  border-radius: 50%;
  object-fit: cover;
  image-rendering: auto;
  &.centro {
    width: 75px;
    height: 75px;
    opacity: 1;
    /* left: 50%; */
    /* transform: translate(-50%); */
  }
`;
const Frase = styled.p`
  color: inherit;
  font-size: 1rem;
  padding: 0 4px;
`;

const Autor = styled.p`
  width: 100%;
  text-align: end;
  font-style: italic;
  font-weight: 200;
  color: #b8b8b8;
  font-size: 0.9rem;
  padding-right: 8px;
`;
const BarraColor = styled.div`
  height: 10px;
  width: 100%;
  background-color: ${(props) => props.$fondo || "gray"};

  /* position: absolute; */
  transition: ease 0.4s all;
  bottom: 50%;
  opacity: 1;
  &.centro {
    opacity: 0;
    bottom: 0;
  }
`;
