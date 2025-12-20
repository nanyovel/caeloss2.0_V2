import { useState, useEffect } from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCodePullRequest, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Tema } from "../../config/theme";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla";
import { InputSimpleEditable } from "../../components/InputGeneral";
import { BotonQuery } from "../../components/BotonQuery";
import { puntoFinal, soloNumeros } from "../../libs/StringParsed";

import { valoresFurgonDeOrdens } from "../libs/ValoresItemFurgon.js";

export const TablaAddBLOrden = ({
  tablaOrdenRef,
  primerInputTablaOrdenRef,
  setVentanaOrdenVisible,
  MODO,
  setCambiosSinGuardar,

  ventanaJuntaMateriales,
  mostrarOrden,
  refBtnBuscar,

  ordenIndicada,
  setOrdenIndicada,
  furgonesMasterEditable,
  furgonesMaster,
  setTipoAlerta,
  setMensajeAlerta,
  setDispatchAlerta,
  valueInputOrdenCompra,
  handleInputsOrdenCompra,
  //
  materialesUnificados,
  setMaterialesUnificados,
  opcionTipoBL,
}) => {
  // ******************** RECURSOS GENERALES ******************** //

  const reiniciarCosas = (funcion) => {
    if (funcion == "copiarMateriales") {
      if (MODO == "addBL") {
        setVentanaOrdenVisible(false);
        setOrdenIndicada(null);
      } else if (MODO == "detalleBL") {
        setOrdenIndicada(null);
      }
    } else if (funcion == "cancelarTabla") {
      if (MODO == "addBL") {
        setOrdenIndicada(null);

        setVentanaOrdenVisible(false);
      } else if (MODO == "detalleBL") {
        setOrdenIndicada(null);
      }
    }
  };

  // ******************** MANEJANDO LOS INPUTS ******************** //

  //  Inputs cabecera  -DETALLE BL-
  const handleInputCabecera = (e) => {
    if (e.target.name == "buscarDocInput") {
      setOrdenIndicada((prevState) => ({
        ...prevState,
        numeroDoc: e.target.value,
      }));
    }
  };

  const cancelarTabla = () => {
    reiniciarCosas("cancelarTabla");
  };
  const handleInputs = (e) => {
    const { value, name } = e.target;
    const indexDataset = e.target.dataset.index;
    const evento = e.type;
    //
    let itemAgregado = false;
    let qtySobrePasaAux = false;
    const materialOrden = ordenIndicada.materiales[indexDataset];

    // SI el codigo ya ha sido agregado a ese furgon
    materialesUnificados.forEach((item) => {
      if (
        item.codigo == materialOrden.codigo &&
        item.ordenCompra == ordenIndicada.numeroDoc
      ) {
        if (value > 0) {
          itemAgregado = true;
          setMensajeAlerta("El articulo ya ha sido agregado.");
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
        } else {
          itemAgregado = false;
        }
      }
    });

    const qtyTotal = materialOrden.qty;
    const qtyEntregadaDB = materialOrden.valoresAux?.cantidadTotalDespachosDB;

    const qtyEntregadaThiBL =
      materialOrden.valoresAux?.cantidadTotalDespachosThisBL;

    const qtyDisponible = qtyTotal - qtyEntregadaDB - qtyEntregadaThiBL;

    if (soloNumeros(value)) {
      if (value > qtyDisponible) {
        qtySobrePasaAux = true;
        setMensajeAlerta("La cantidad indicada supera la cantidad disponible.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      }
    }

    // Si la cantidad escrita es mayor a la cantidad disponible
    let valorParsed = "";
    let valorValido = false;
    if (soloNumeros(value)) {
      valorValido = true;
      valorParsed = Number(value);
    } else if (puntoFinal(value)) {
      valorValido = true;
      valorParsed = value;
    }

    if (evento == "blur") {
      const ultCaracter = value.charAt(value.length - 1);
      if (ultCaracter == ".") {
        valorParsed = Number(valorParsed);
      }
    }
    setOrdenIndicada((prevState) => ({
      ...prevState,
      materiales: prevState.materiales.map((mate, index) => {
        if (index == indexDataset) {
          return {
            ...mate,
            valoresAux: {
              ...mate.valoresAux,
              itemAgregado: itemAgregado,
              qtySobrePasaAux: qtySobrePasaAux,
              qtyInputCopiarAFurgon: valorValido
                ? valorParsed
                : mate.valoresAux.qtyInputCopiarAFurgon,
            },
          };
        } else {
          return { ...mate };
        }
      }),
    }));
  };

  const copiarMat = () => {
    // verificar si algun item ya ha sido agregado pero trata de añadir
    // si aun no se fija contenedor
    // si aun no escribe cantidad a copiar
    // 🔵🔵🔵🔵 PARSEAR ORDEN / VALIDACION; ITEM AGREGADO O SOBREPASA  🔵🔵🔵🔵
    // 🔵🔵🔵🔵 PARSEAR ORDEN / VALIDACION; ITEM AGREGADO O SOBREPASA  🔵🔵🔵🔵
    // 🔵🔵🔵🔵 PARSEAR ORDEN / VALIDACION; ITEM AGREGADO O SOBREPASA  🔵🔵🔵🔵
    // 🔵🔵🔵🔵 PARSEAR ORDEN / VALIDACION; ITEM AGREGADO O SOBREPASA  🔵🔵🔵🔵
    if (!ordenIndicada) {
      setMensajeAlerta("Primero hale una orden.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    const materialesParsed = ordenIndicada.materiales.map((producto, index) => {
      let qtySobrePasaAux = false;
      let itemAgregado = false;
      // verificar si algun item sobre pasa su cantidad disponible
      let qtyTotal = producto.qty;
      // Esto es por si el valor de la orden de compra es un string, lo cual es una posibilidad
      if (soloNumeros(producto.qty) == false) {
        qtyTotal = 0;
      }

      const qtyEntregadaDB = producto.valoresAux?.cantidadTotalDespachosDB;
      const qtyEntregadaThiBL =
        producto.valoresAux?.cantidadTotalDespachosThisBL;

      const qtyDisponible = qtyTotal - qtyEntregadaDB - qtyEntregadaThiBL;

      // Si la colocada de este item supera la cantidad disponible
      if (soloNumeros(producto.valoresAux.qtyInputCopiarAFurgon)) {
        if (producto.valoresAux.qtyInputCopiarAFurgon > qtyDisponible) {
          qtySobrePasaAux = true;
        }
      }

      // SI el codigo ya ha sido agregado a ese furgon
      materialesUnificados.forEach((item) => {
        if (
          item.codigo == producto.codigo &&
          item.ordenCompra == ordenIndicada.numeroDoc
        ) {
          itemAgregado = true;
        }
      });

      return {
        ...producto,
        valoresAux: {
          ...producto.valoresAux,
          itemAgregado: itemAgregado,
          qtySobrePasaAux: qtySobrePasaAux,
        },
      };
    });

    setOrdenIndicada((prevState) => ({
      ...prevState,
      materiales: materialesParsed,
    }));

    const hasSobrePasado = materialesParsed.some(
      (item) => item.valoresAux.qtySobrePasaAux
    );

    const hasAgregados = materialesParsed.some(
      (item) =>
        item.valoresAux.itemAgregado &&
        item.valoresAux.qtyInputCopiarAFurgon > 0
    );
    if (hasSobrePasado) {
      setMensajeAlerta(
        "Existen items con cantidad mayor a cantidad disponible."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
    if (hasAgregados) {
      setMensajeAlerta("Existen articulos que ya han sido agregados.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }

    // console.log();
    if (MODO == "addBL") {
      const opcionFind = opcionTipoBL.find((opcion) => opcion.select);
      if (ventanaJuntaMateriales == 0 && opcionFind.code == "normal") {
        setMensajeAlerta("Primero fije un contenedor.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
    }

    if (!hasSobrePasado && !hasAgregados) {
      // Si aun no se establece un furgon

      const todosVacios = ordenIndicada.materiales.every(
        (objeto) =>
          objeto.valoresAux.qtyInputCopiarAFurgon == "" ||
          objeto.valoresAux.qtyInputCopiarAFurgon == 0
      );
      if (todosVacios) {
        setMensajeAlerta("Indica los materiales a copiar.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        return "";
      }

      setCambiosSinGuardar(true);

      // 🔵🔵🔵🔵 ALIMENTAR EL ESTADO DE FURGON INDICADO  🔵🔵🔵🔵
      // 🔵🔵🔵🔵 ALIMENTAR EL ESTADO DE FURGON INDICADO  🔵🔵🔵🔵
      // 🔵🔵🔵🔵 ALIMENTAR EL ESTADO DE FURGON INDICADO  🔵🔵🔵🔵
      //
      console.log(materialesParsed);
      // 1-*****Copiar solo los materiales indicados por el usuario***
      const itemsCopiarAFurgon = materialesParsed.filter(
        (item) => item.valoresAux.qtyInputCopiarAFurgon > 0
      );

      // 2--*****Ahora parseamos estos items-*****
      const itemsParsed = itemsCopiarAFurgon.map((item) => {
        return {
          ...valoresFurgonDeOrdens(
            item,
            ordenIndicada,
            furgonesMasterEditable,
            MODO,
            furgonesMaster
          ),
        };
      });

      setMaterialesUnificados([...materialesUnificados, ...itemsParsed]);

      reiniciarCosas("copiarMateriales");
    }
  };

  return (
    <>
      <CajaBotones>
        <BtnNormal type="button" onClick={() => copiarMat()}>
          <Icono icon={faCopy} />
          Copiar
        </BtnNormal>

        <BtnNormal
          type="button"
          className="cancelar"
          onClick={() => cancelarTabla()}
        >
          <Icono icon={faXmark} />
          Soltar
        </BtnNormal>

        {MODO == "detalleBL" ? (
          <>
            <ContenedorBuscar>
              <Texto>Orden Compra: {""}</Texto>
              <InputBuscar
                type="text"
                name="ordenCompra"
                value={valueInputOrdenCompra}
                onChange={(e) => handleInputsOrdenCompra(e)}
                disabled={ordenIndicada}
                className={ordenIndicada ? "disable" : ""}
                autoComplete="off"
              />
              <BtnNormal
                type="submit"
                className={`buscar ${ordenIndicada ? "disabled" : ""}`}
                onClick={(e) => mostrarOrden(e)}
                disabled={ordenIndicada}
                ref={refBtnBuscar}
              >
                <Icono icon={faCodePullRequest} className="fa-thin" />
                Halar
              </BtnNormal>
            </ContenedorBuscar>
          </>
        ) : (
          ""
        )}
      </CajaBotones>

      <CajaTablaGroup>
        <TablaGroup ref={tablaOrdenRef}>
          <thead>
            <FilasGroup className="cabeza">
              <CeldaHeadGroup>N°</CeldaHeadGroup>
              <CeldaHeadGroup>Codigo</CeldaHeadGroup>
              <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
              <CeldaHeadGroup>Qty</CeldaHeadGroup>
              <CeldaHeadGroup>Disponible</CeldaHeadGroup>
              <CeldaHeadGroup>Qty copiar</CeldaHeadGroup>
            </FilasGroup>
          </thead>
          <tbody>
            {ordenIndicada != null &&
              ordenIndicada.materiales.map((item, index) => {
                return (
                  <FilasGroup key={index} className="body">
                    <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                    <CeldasBodyGroup>{item.codigo}</CeldasBodyGroup>
                    <CeldasBodyGroup className="descripcion">
                      {item.descripcion}
                    </CeldasBodyGroup>
                    <CeldasBodyGroup>{item.qty}</CeldasBodyGroup>
                    <CeldasBodyGroup>
                      {
                        item.qty -
                          item.valoresAux?.cantidadTotalDespachosDB -
                          item.valoresAux?.cantidadTotalDespachosThisBL
                        // item.despachos.reduce((acc, item) => acc + item.qty, 0) -

                        // (item.valoresAux?.despachosThisBL?.reduce(
                        //   (acc, item) => acc + item.qty,
                        //   0
                        // ) || 0)
                      }
                    </CeldasBodyGroup>

                    <CeldasBodyGroup>
                      <InputCelda
                        className={
                          item?.valoresAux?.itemAgregado ||
                          item?.valoresAux?.qtySobrePasaAux
                            ? "sobrePasa"
                            : ""
                        }
                        type="text"
                        value={item.valoresAux.qtyInputCopiarAFurgon}
                        data-index={index}
                        onChange={(e) => handleInputs(e)}
                        autoComplete="off"
                        onFocus={(e) => handleInputs(e)}
                        onBlur={(e) => handleInputs(e)}
                        ref={index == 0 ? primerInputTablaOrdenRef : null}
                      />
                    </CeldasBodyGroup>
                  </FilasGroup>
                );
              })}
          </tbody>
        </TablaGroup>
      </CajaTablaGroup>
    </>
  );
};

const CajaTabla = styled.div`
  overflow-x: scroll;
  width: 100%;
  padding: 0 20px;

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  /* margin-bottom: 100px; */
`;
const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border: 1px solid white;
  border-radius: 5px;
  width: 95%;
  margin: auto;
  margin-bottom: 100px;
  border: 1px solid ${Tema.secondary.azulOpaco};
`;
const Filas = styled.tr`
  background-color: ${Tema.secondary.azulProfundo};
`;

const CeldaHead = styled.th`
  border-bottom: 1px solid #605e5e;
  padding: 3px 8px;
  text-align: center;
  background-color: #2b7d9e5d;
  color: white;
  font-size: 0.9rem;
  border: 1px solid ${Tema.secondary.azulOpaco};
  &.qty {
    width: 300px;
  }

  &:first-child {
    width: 40px;
  }
  &:nth-child(2) {
    width: 50px;
  }
  &:nth-child(3) {
    width: 250px;
  }
  &:nth-child(4) {
    width: 60px;
  }
  &:nth-child(5) {
    width: 100px;
  }
`;
const CeldasBody = styled.td`
  background-color: #2f85d0;
  color: #252020;
  font-size: 0.9rem;
  height: 25px;
  text-align: center;
  &.romo {
    cursor: pointer;
    &:hover {
    }
  }
  &.descripcion {
    text-align: start;
    padding-left: 10px;
  }
`;
const InputCelda = styled(InputSimpleEditable)`
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  text-align: center;
  height: 25px;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.sobrePasa {
    border: 1px solid red;
    color: red;
  }
`;

const CajaBotones = styled.div`
  /* background-color: ${Tema.secondary.azulProfundo};
   */
  border-bottom: 1px solid black;
  padding-left: 15px;
`;
const BtnNormal = styled(BtnGeneralButton)`
  &.cancelar {
    background-color: red;
    width: auto;
    padding: 5px;
    &:hover {
      background-color: white;
      color: red;
    }
  }
  &.buscar {
    margin: 0;
  }
  &.disabled {
    background-color: ${Tema.primary.grisNatural};
    color: black;
    cursor: auto;
    &:hover {
      color: black;
    }
  }
`;

const Icono = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;

const ContenedorBuscar = styled.div`
  background-color: ${Tema.secondary.azulGraciel};
  display: inline-block;
  padding: 5px;
  border-radius: 5px;
  color: ${Tema.primary.azulBrillante};
  &.editando {
    background-color: #5e5d60;
    color: black;
  }
`;

const Texto = styled.h2`
  color: inherit;
  font-size: 1rem;
  display: inline-block;
  margin-right: 4px;
`;

const InputBuscar = styled.input`
  border: none;
  outline: none;
  height: 25px;
  border-radius: 4px;
  padding: 5px;
  background-color: ${Tema.secondary.azulGraciel};
  border: 1px solid ${Tema.secondary.azulOpaco};
  color: ${Tema.primary.azulBrillante};
  margin-right: 5px;
  &.disable {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
`;
// 581
