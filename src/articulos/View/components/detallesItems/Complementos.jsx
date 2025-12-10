import React, { useState } from "react";
import styled from "styled-components";
import { Tema } from "../../config/theme";
import Item from "./Item";
import ImgParal from "./../../../public/img/articulos/mas items/crema/parales212Cal22.jpeg";
import ImgDurmiente from "./../../../public/img/articulos/mas items/crema/durmientes212cal22.jpeg";
import ImgEsq from "./../../../public/img/articulos/mas items/crema/esquinero.jpeg";
import ImgMadera from "./../../../public/img/articulos/mas items/crema/madera.jpeg";
import ImgClavo from "./../../../public/img/articulos/mas items/crema/clavosYeso.jpeg";
import ImgFulminante from "./../../../public/img/articulos/mas items/crema/fulminantesVerdes.jpeg";
import ImgTornilloEstru from "./../../../public/img/articulos/mas items/crema/tornilloAutobarrenaEstructura.jpeg";
import ImgTornilloPlancha from "./../../../public/img/articulos/mas items/crema/tornilloAutobarrenaPlancha.jpeg";
import ImgCinta300 from "./../../../public/img/articulos/mas items/crema/cinta300.jpeg";
import ImgKeraflor from "./../../../public/img/articulos/mas items/crema/keraflor.png";
import SliderInstItem from "./SliderInstItem";

export default function Complementos() {
  const [hasSlider, setHasSlider] = useState(false);
  const articulos = [
    {
      img: ImgKeraflor,
      codigo: "04024",
      descripcion: "Masilla Keraflor gris (50lb)",
    },
    {
      img: ImgParal,
      codigo: "04049",
      descripcion: `Parales 2"1/2"10'cal 22`,
    },
    {
      img: ImgDurmiente,
      codigo: "04050",
      descripcion: `Durmientes 2"1/2"10'cal 22`,
    },
    {
      img: ImgEsq,
      codigo: "04010",
      descripcion: `Esquineros metalicos 10'`,
    },
    {
      img: ImgMadera,
      codigo: "04070",
      descripcion: `Madera tratada 1"x2"x7"`,
    },
    {
      img: ImgClavo,
      codigo: "04043",
      descripcion: "Clavos de yeso 1 1/4",
    },

    {
      img: ImgFulminante,
      codigo: "02066",
      descripcion: "Fulminantes verde cal 22",
    },
    {
      img: ImgTornilloEstru,
      codigo: "08019",
      descripcion: "Tornillo autobarrena 7/16 de estructura",
    },
    {
      img: ImgTornilloPlancha,
      codigo: "08008",
      descripcion: 'Tornillo autobarrena 1 1/4" de plancha',
    },
    {
      img: ImgCinta300,
      codigo: "04029",
      descripcion: `Cinta de Fibra  2" x 300'`,
    },
  ];

  return (
    <Container>
      {articulos.map((producto, index) => {
        return (
          <CajaItem key={index} onClick={() => setHasSlider(true)}>
            <Item key={index} producto={producto} />
          </CajaItem>
        );
      })}
      <SliderInstItem hasSlider={hasSlider} setHasSlider={setHasSlider} />
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  min-height: 100px;
  display: flex;
  border: 1px solid ${Tema.primary.azulBrillante};
  gap: 5px;
  overflow-x: scroll;
  overflow-y: hidden;
  padding: 4px;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;
const CajaItem = styled.div`
  min-width: calc(100% / 3 - 30px);
  margin-bottom: 5px;
  height: 200px;
`;
