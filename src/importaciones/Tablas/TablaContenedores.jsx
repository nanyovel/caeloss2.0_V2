import React, { useEffect, useState } from "react";

import styled from "styled-components";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  Enlace,
  FilasGroup,
  ParrafoAction,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla";

import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
} from "../../components/InputGeneral";
import { Tema } from "../../config/theme";
import { diccStatusFurgon } from "../../libs/statusDocImport";
import { fechaConfirmada } from "../components/libs";

export default function TablaContenedores({
  handleTablaContenedores,
  arrayFurgones,
  arrayFurgonesEditable,
  billOfLading,
  isEditando,
  nClases,
  setNClases,
  tablaPartidasRef,
  MODO,
}) {
  return (
    <CajaTablaGroup ref={tablaPartidasRef}>
      <TablaGroup>
        <thead>
          <FilasGroup className="cabeza">
            <CeldaHeadGroup>N°</CeldaHeadGroup>
            <CeldaHeadGroup className="noFurgon">
              {billOfLading.tipo != 1 ? "Contenedor*" : "Numero"}
            </CeldaHeadGroup>
            {billOfLading.tipo != 1 && (
              <CeldaHeadGroup className="tamannio">Tamaño </CeldaHeadGroup>
            )}
            <CeldaHeadGroup className="destino">Destino</CeldaHeadGroup>
            <CeldaHeadGroup className="status">Status</CeldaHeadGroup>
            {!isEditando && (
              <CeldaHeadGroup className="disponibleEnSAP">
                En SAP
              </CeldaHeadGroup>
            )}
            {(MODO != "fleteSuelto" || !isEditando) && (
              <CeldaHeadGroup className="materiales">Materiales</CeldaHeadGroup>
            )}
            {isEditando && (
              <CeldaHeadGroup className="eliminarFilas">
                Eliminar
              </CeldaHeadGroup>
            )}
          </FilasGroup>
        </thead>
        <tbody>
          {isEditando == false
            ? arrayFurgones?.map((furgon, index) => {
                return (
                  <FilasGroup key={index} className={"body " + nClases[index]}>
                    <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                    <CeldasBodyGroup data-id={index}>
                      {billOfLading.estadoDoc !== 2 ? (
                        <Enlace
                          to={`/importaciones/maestros/contenedores/${encodeURIComponent(furgon.numeroDoc)}`}
                          target="_blank"
                        >
                          {furgon.numeroDoc}
                        </Enlace>
                      ) : (
                        furgon.numeroDoc
                      )}
                    </CeldasBodyGroup>
                    {billOfLading.tipo != 1 && (
                      <CeldasBodyGroup>{furgon.tamannio}</CeldasBodyGroup>
                    )}
                    <CeldasBodyGroup>{furgon.destino}</CeldasBodyGroup>
                    <CeldasBodyGroup className="status">
                      {diccStatusFurgon[furgon.status]}
                    </CeldasBodyGroup>
                    <CeldasBodyGroup
                      title={fechaConfirmada(
                        furgon.fechas?.llegada05Concluido.confirmada,
                        true
                      )}
                    >
                      {furgon.fechas?.llegada05Concluido.fecha.slice(0, 10)}
                      {fechaConfirmada(
                        furgon.fechas?.llegada05Concluido.confirmada
                      )}

                      {furgon.llegadaSapDetalles &&
                        furgon.llegadaSapDetalles.fecha.slice(0, 10)}
                    </CeldasBodyGroup>

                    <CeldasBodyGroup>
                      <ParrafoAction
                        data-index={index}
                        data-id={furgon.id}
                        data-numerodoc={furgon.numeroDoc}
                        data-destino="mostrarItem"
                        onClick={(e) => handleTablaContenedores(e)}
                        // onClick={(e) => mostrarItem(e)}
                      >
                        👁️
                      </ParrafoAction>
                    </CeldasBodyGroup>
                  </FilasGroup>
                );
              })
            : arrayFurgonesEditable.map((furgon, index) => {
                let llegadaSap = { annio: false };
                if (arrayFurgonesEditable[index].llegadaSap) {
                  // eslint-disable-next-line no-unused-vars
                  llegadaSap = {
                    annio: arrayFurgonesEditable[index].llegadaSap.slice(6, 10),
                    mes: arrayFurgonesEditable[index].llegadaSap.slice(3, 5),
                    dia: arrayFurgonesEditable[index].llegadaSap.slice(0, 2),
                  };
                }
                return (
                  <FilasGroup key={index} className={"body " + nClases[index]}>
                    <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                    <CeldasBodyGroup>
                      <InputCelda
                        data-id={furgon.id}
                        data-destino="handleInputTabla"
                        disabled={MODO === "fleteSuelto" ? true : false}
                        className={`
                          celda 
                                ${nClases[index]}
                                ${MODO === "fleteSuelto" ? "disabled" : ""}

                                `}
                        name="numeroDoc"
                        value={arrayFurgonesEditable[index].numeroDoc}
                        onChange={(e) => handleTablaContenedores(e)}
                        // onChange={(e) => handleInputTabla(e)}
                        autoCapitalize=""
                      />
                    </CeldasBodyGroup>

                    {MODO != "fleteSuelto" && (
                      <CeldasBodyGroup>
                        <MenuDesplegable2
                          data-id={furgon.id}
                          data-destino="handleInputTabla"
                          name="tamannio"
                          className={`celda
                                ${nClases[index]}
                                `}
                          value={arrayFurgonesEditable[index].tamannio}
                          onChange={(e) => handleTablaContenedores(e)}
                          // onChange={(e) => handleInputTabla(e)}
                        >
                          <Opciones className="celda disabled" value="">
                            Selecione
                          </Opciones>
                          <Opciones className="celda " value="40'">
                            40&apos;
                          </Opciones>
                          <Opciones className="celda " value="20'">
                            20&apos;
                          </Opciones>
                          <Opciones className="celda " value="45'">
                            45&apos;
                          </Opciones>
                          <Opciones className="celda " value="Otros">
                            Otros
                          </Opciones>
                        </MenuDesplegable2>
                      </CeldasBodyGroup>
                    )}
                    <CeldasBodyGroup>
                      <InputCelda
                        data-id={furgon.id}
                        data-index={index}
                        data-destino="handleInputTabla"
                        className={`celda
                                ${nClases[index]}
                                `}
                        name="destino"
                        value={arrayFurgonesEditable[index].destino}
                        onChange={(e) => handleTablaContenedores(e)}
                        // onChange={(e) => handleInputTabla(e)}
                      />
                    </CeldasBodyGroup>
                    <CeldasBodyGroup>
                      <MenuDesplegable2
                        data-index={index}
                        className={`celda
                                ${nClases[index]}
                                `}
                        data-id={furgon.id}
                        name="status"
                        data-destino="handleInputTabla"
                        onChange={(e) => {
                          handleTablaContenedores(e);
                          //   handleInputTabla(e);
                        }}
                        value={arrayFurgonesEditable[index].status}
                      >
                        <Opciones
                          disabled
                          value="99999"
                          className="celda disabled"
                        >
                          Seleccione
                        </Opciones>
                        <Opciones className="celda disabled" disabled value="0">
                          Proveedor
                        </Opciones>
                        <Opciones className="celda" value="1">
                          Transito Maritimo
                        </Opciones>
                        <Opciones className="celda" value="2">
                          En Puerto
                        </Opciones>
                        <Opciones className="celda" value="3">
                          Recepcion Almacen
                        </Opciones>
                        <Opciones className="celda" value="4">
                          Dpto Importaciones
                        </Opciones>
                        <Opciones className="celda" value="5">
                          Concluido en SAP
                        </Opciones>
                      </MenuDesplegable2>
                    </CeldasBodyGroup>

                    {MODO != "fleteSuelto" && (
                      <CeldasBodyGroup>
                        <ParrafoAction
                          data-index={index}
                          data-id={furgon.id}
                          data-destino="mostrarMaterialesParaEditar"
                          nombre="agregarMateriales"
                          onClick={(e) => handleTablaContenedores(e)}
                          // onClick={(e) => mostrarMaterialesParaEditar(e)}
                        >
                          Ⓜ️
                        </ParrafoAction>
                      </CeldasBodyGroup>
                    )}

                    <CeldasBodyGroup>
                      <ParrafoAction
                        data-destino="eliminarFila"
                        data-index={index}
                        data-id={furgon.id}
                        nombre="eliminarFila"
                        onClick={(e) => handleTablaContenedores(e)}
                        // onClick={(e) => eliminarFila(e)}
                      >
                        ❌
                      </ParrafoAction>
                    </CeldasBodyGroup>
                  </FilasGroup>
                );
              })}
        </tbody>
      </TablaGroup>
    </CajaTablaGroup>
  );
}
const MenuDesplegable2 = styled(MenuDesplegable)`
  outline: none;
  border: none;
  height: 25px;
  width: 100%;
  &.cabecera {
    height: 20px;
    border: 1px solid ${Tema.secondary.azulProfundo};
    width: 150px;
  }
  &.filaSelected {
    background-color: inherit;
  }

  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.fijado {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }

  &.disabled {
    background-color: inherit;
    color: inherit;
  }
`;

const InputCelda = styled(InputSimpleEditable)`
  &.disable {
    background-color: transparent;
    color: black;
  }

  &.n {
    width: 40px;
    padding: 0;
    text-align: center;
  }
  &.codigo {
    width: 100%;
    padding: 0;
    text-align: center;
  }

  &.descripcion {
    /* width: 300px; */
    padding-left: 5px;
  }
  &.qty {
    width: 100%;
  }
  &.qtyDisponible {
    width: 100%;
  }
  /* background-color: grey; */

  &.comentarios {
    width: 100%;
  }
`;
