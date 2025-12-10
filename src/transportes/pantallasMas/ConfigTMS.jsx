import React, { useState } from "react";
import MenuPestannias from "../../components/MenuPestannias";
import styled from "styled-components";
import { localidadesAlmacen } from "../../components/corporativo/Corporativo";

import { Tema } from "../../config/theme";

export default function ConfigTMS() {
  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Vista",
      code: "vista",
      select: true,
    },
    {
      nombre: "Notificaciones",
      code: "notificaciones",
      select: false,
    },
  ]);

  const handlePestannias = (e) => {
    let index = Number(e.target.dataset.id);
    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };

  const almacenesParsed = localidadesAlmacen.map((loca) => {
    return {
      ...loca,
      valor: false,
    };
  });
  const handleInputTabla = (e) => {};
  return (
    <Container>
      <MenuPestannias
        arrayOpciones={arrayOpciones}
        handlePestannias={handlePestannias}
      />
      <WrapContenido>
        {arrayOpciones.find((opcion) => opcion.select).code == "vista" && (
          <>
            <Titulo>
              Ver solicitudes activas relacionadas con los almacenes:
            </Titulo>
            <CajaAlmacenes>
              {localidadesAlmacen.map((loca, index) => {
                return (
                  <WrapAlmacen key={index}>
                    <InputEditable
                      className="checkBox"
                      type="checkbox"
                      checked={loca.valor}
                      onChange={(e) => handleInputTabla(e)}
                      data-index={index}
                    />
                    <NombreAlmacen>{loca.descripcion}</NombreAlmacen>
                  </WrapAlmacen>
                );
              })}
            </CajaAlmacenes>
          </>
        )}
        {arrayOpciones.find((opcion) => opcion.select).code ==
          "notificaciones" && (
          <>
            <Titulo>
              Recibir notificaciones por cambio de estado de solicitud de:
            </Titulo>
            <CajaAlmacenes>
              <WrapAlmacen>
                <InputEditable
                  className="checkBox"
                  type="checkbox"
                  // checked={loca.valor}
                  onChange={(e) => handleInputTabla(e)}
                  // data-index={index}
                />
                <NombreAlmacen>Mi departamento</NombreAlmacen>
              </WrapAlmacen>
              <WrapAlmacen>
                <InputEditable
                  className="checkBox"
                  type="checkbox"
                  // checked={loca.valor}
                  onChange={(e) => handleInputTabla(e)}
                  // data-index={index}
                />
                <NombreAlmacen>Mi localidad</NombreAlmacen>
              </WrapAlmacen>
            </CajaAlmacenes>
            <br />
            <Titulo>Cuando:</Titulo>
            <CajaAlmacenes>
              <WrapAlmacen>
                <InputEditable
                  className="checkBox"
                  type="checkbox"
                  // checked={loca.valor}
                  onChange={(e) => handleInputTabla(e)}
                  // data-index={index}
                />
                <NombreAlmacen>Se crea una solicitud</NombreAlmacen>
              </WrapAlmacen>
              <WrapAlmacen>
                <InputEditable
                  className="checkBox"
                  type="checkbox"
                  // checked={loca.valor}
                  onChange={(e) => handleInputTabla(e)}
                  // data-index={index}
                />
                <NombreAlmacen>Se planifica una solicitud</NombreAlmacen>
              </WrapAlmacen>
              <WrapAlmacen>
                <InputEditable
                  className="checkBox"
                  type="checkbox"
                  // checked={loca.valor}
                  onChange={(e) => handleInputTabla(e)}
                  // data-index={index}
                />
                <NombreAlmacen>Se ejecuta una solicitud</NombreAlmacen>
              </WrapAlmacen>
              <WrapAlmacen>
                <InputEditable
                  className="checkBox"
                  type="checkbox"
                  // checked={loca.valor}
                  onChange={(e) => handleInputTabla(e)}
                  // data-index={index}
                />
                <NombreAlmacen>Se concluye una solicitud</NombreAlmacen>
              </WrapAlmacen>
            </CajaAlmacenes>
          </>
        )}
      </WrapContenido>{" "}
    </Container>
  );
}
const Container = styled.div``;
const WrapContenido = styled.div`
  padding: 15px;
`;
const Titulo = styled.h2`
  color: white;
  font-weight: 400;
`;
const CajaAlmacenes = styled.div`
  display: flex;
  flex-direction: column;
`;
const WrapAlmacen = styled.div`
  display: flex;
  color: white;
  /* border: 1px solid red; */
  /* max-width: 200px; */
`;
const InputEditable = styled.input`
  margin: 0;

  height: 20px;
  outline: none;
  border: none;
  background-color: transparent;
  color: white;
  padding: 4px;
  font-size: 1rem;
  padding: 4px;
  border-radius: 0;
  font-weight: normal;
  /* width: 200px; */
  border-left: 1px solid ${Tema.secondary.azulOpaco};
  &.file {
    /* border: 1px solid red; */
    height: auto;
  }
  &.checkBox {
    width: 30px;
    cursor: pointer;
  }
`;
const NombreAlmacen = styled.p`
  font-size: 1.2rem;
`;
