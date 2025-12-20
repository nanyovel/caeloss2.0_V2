import React, { useEffect, useState } from "react";
import styled from "styled-components";

// import { generatorIconFlagURL } from "../../../components/ListaPaises";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleDown,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import { faLink } from "@fortawesome/free-solid-svg-icons";
// import ImgCertified from "./../../public/img/calidad.png";
import ImgCertified from "./../../../../../public/img/calidad.png";
import {
  Detalle0Contenedor,
  Detalle1Foto,
  Detalle1Wrap,
  Detalle2Titulo,
  Detalle3OutPut,
  Detalle3OutPutElementosLista,
  Detalle3OutPutLista,
} from "../../../../components/JSXElements/GrupoDetalle";

export default function Cabecera({ conjuntoMaster }) {
  console.log(conjuntoMaster);
  return (
    <Container>
      <Detalle0Contenedor className="scroll">
        <Detalle1Wrap>
          <Detalle2Titulo className="corto30-70">Titulo</Detalle2Titulo>
          <Detalle3OutPut className="ancho70-30" title={conjuntoMaster.titulo}>
            {conjuntoMaster.titulo}
          </Detalle3OutPut>
        </Detalle1Wrap>
        <Detalle1Wrap>
          <Detalle2Titulo>Sub titulo</Detalle2Titulo>
          <Detalle3OutPut title={conjuntoMaster.subTitulo}>
            {conjuntoMaster.subTitulo}
          </Detalle3OutPut>
        </Detalle1Wrap>
        <Detalle1Wrap>
          <Detalle2Titulo>N° Proyecto</Detalle2Titulo>
          <Detalle3OutPut title={conjuntoMaster.noProyecto}>
            {conjuntoMaster.noProyecto}
          </Detalle3OutPut>
        </Detalle1Wrap>
        <Detalle1Wrap className="vertical">
          <Detalle2Titulo className="vertical">Descripcion</Detalle2Titulo>
          <Detalle3OutPut className="vertical">
            {conjuntoMaster.descripcion}
          </Detalle3OutPut>
        </Detalle1Wrap>
        <Detalle1Wrap className="vertical">
          <Detalle2Titulo className="vertical">Observaciones</Detalle2Titulo>
          <Detalle3OutPutLista>
            {conjuntoMaster?.observaciones.map((obs, index) => {
              return (
                <Detalle3OutPutElementosLista key={index}>
                  {obs}
                </Detalle3OutPutElementosLista>
              );
            })}
          </Detalle3OutPutLista>
        </Detalle1Wrap>
      </Detalle0Contenedor>
      <Detalle0Contenedor className="img">
        <Detalle1Foto
          src={conjuntoMaster.imagenes.find((img) => img.url).url}
        />
      </Detalle0Contenedor>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
`;
