import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ClearTheme, Tema } from "../../config/theme.jsx";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  Enlace,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla.jsx";
import { BotonQuery } from "../../components/BotonQuery.jsx";
import { puntoFinal, soloNumeros } from "../../libs/StringParsed.jsx";
import { furgonSchema } from "../schema/furgonSchema.js";
import IconoCelda from "../../components/JSXElements/IconoCelda.jsx";

export const RecuadroUnificador = ({
  tablaFurgonRef,
  ventanaOrdenVisible,
  setVentanaOrdenVisible,
  ventanaJuntaMateriales,
  setVentanaJuntaMateriales,
  modo,
  setCambiosSinGuardar,
  cancelarAgregarMat,
  setNClasesPadre,
  furgonIndicado,
  setFurgonIndicado,
  ordenIndicada,
  setOrdenIndicada,
  furgonesMasterEditable,
  setFurgonesMasterEditable,
  setFurgonFijado,
  setDispatchAlerta,
  setMensajeAlerta,
  setTipoAlerta,
  indexFurgonEnBL,

  //Refactorizado
  materialesUnificados,
  setMaterialesUnificados,
  blMaster,
}) => {
  let tipoBL = 0;
  if (blMaster?.tipo) {
    tipoBL = blMaster.tipo;
  }
  // ********************** LISTA MATERIALES **********************

  // ventanaJuntaMateriales sirve para saber cuando la ventada unificadora de materiales esta visible
  // Ejemplos:
  // 0---No visible
  // 1-Visible en modo agregar y sale de color azul
  // 2-Visible en modo modificar un furgon y sale de color naranja
  //

  // ********************* RECURSOS GENERALES ********************//
  // SHORT HANDS COMENTADOS, REQUIERE VERIFICACION
  // useEffect(() => {
  //   document.addEventListener("keyup", shortHands);
  //   return () => {
  //     document.removeEventListener("keyup", shortHands, false);
  //   };
  // }, []);

  const btnAgregar = useRef(null);
  // const shortHands = (e) => {
  //   switch (e.key) {
  //     case "+":
  //       if (ventanaJuntaMateriales == 1) {
  //         btnAgregar.current.click();
  //       }
  //       break;
  //   }
  // };

  // const copiarEnter = (e) => {
  //   if (e.key == "Enter") {
  //     if (ventanaJuntaMateriales == 1) {
  //       agregarABL("addBL");
  //     } else if (ventanaJuntaMateriales == 2) {
  //       agregarABL("guardarCambios");
  //     }
  //   }
  // };

  const calcularCantidadDisponible = (
    qtyOrden,
    qtyTotalDespachosDBFromOrden,
    qtyTotalDespachosThisBL
  ) => {
    const qtyTotalOrdenCompra = qtyOrden;
    const qtyEntregadaDB = qtyTotalDespachosDBFromOrden;
    const qtyEntregadaThiBL = qtyTotalDespachosThisBL;

    return qtyTotalOrdenCompra - qtyEntregadaDB - qtyEntregadaThiBL;
  };

  // ******************** MANEJANDO LOS INPUTS ******************** //
  const handleInputs = (e) => {
    const { value, name } = e.target;
    const evento = e.type;
    const indexDataset = Number(e.target.dataset.id);
    setCambiosSinGuardar(true);

    // Si la cantidad colocada supera la cantidad disponible
    let qtySobrePasaAux = false;

    const thisItem = materialesUnificados[indexDataset];
    const qtyDisponible = calcularCantidadDisponible(
      thisItem.valoresAux?.cantidadTotalOrdenCompra,
      thisItem.valoresAux?.qtyTotalDespachosDBFromOrden,
      thisItem.valoresAux?.qtyTotalDespachosThisBL
    );

    if (soloNumeros(value)) {
      if (value > qtyDisponible) {
        qtySobrePasaAux = true;
        setMensajeAlerta("La cantidad indicada supera la cantidad disponible.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      }
    }

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
    setMaterialesUnificados(
      materialesUnificados.map((item, i) => {
        if (i === indexDataset) {
          return {
            ...item,
            // qty: valorValido ? Number(valorParsed) : item.qty,
            valoresAux: {
              ...item.valoresAux,
              qtySobrePasaAux: qtySobrePasaAux,
            },
            qty: valorValido ? valorParsed : "",
          };
        }
        return item;
      })
    );
  };

  // ****************Agregar materiales hasta bl**************
  const agregarABL = (accion) => {
    // return;
    let proceder = true;
    materialesUnificados.forEach((item, index) => {
      const qtyDisponible = calcularCantidadDisponible(
        item.valoresAux.cantidadTotalOrdenCompra,
        item.valoresAux?.qtyTotalDespachosDBFromOrden,
        item.valoresAux?.qtyTotalDespachosThisBL
      );

      // Si existen item con cantidad mayor a cantidad disponible
      if (item.qty > qtyDisponible) {
        setMensajeAlerta("Existen items con cantidad mayor a disponible.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        proceder = false;
        return "";
      }
      // Si en alguno escribieron algo que no sea un numero
      // Esto nunca deberia ejecutarse, colocado por precaucion
      let expRegSoloNum = /^[\d.]{0,1000}$/;
      if (expRegSoloNum.test(item.qty) === false) {
        setMensajeAlerta("Existen items con valores incorrectos.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        proceder = false;
        return "";
      }
      // Si algun item lo dejaron en blanco o tiene valor 0
      if (item.qty == "" || item.qty == 0 || item.qty == "0") {
        setMensajeAlerta(
          "Existen items sin cantidades, eliminelo o indique su cantidad."
        );
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        proceder = false;
        return "";
      }
    });

    if (proceder == false) {
      return;
    }

    // Si no hay item
    if (materialesUnificados.length == 0) {
      setMensajeAlerta("Por favor copie los items deseados.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);

      return "";
    }
    // Si la ventana de materiales de orden esta visible
    // Si el recuadro de orden de compra esta abierto,
    // Este bloqueo es necesario pues de otro modo el usuario podria agregar cantidades de mas al bl desde la orden de compra generando negativos

    let cerrarVentanaOrdenValidacion = false;
    if (modo == "addBL") {
      if (ventanaOrdenVisible == true) {
        cerrarVentanaOrdenValidacion = true;
      }
    } else if (modo == "detalleBL") {
      if (ventanaOrdenVisible == true) {
        // Este segundo if es necesario, pues en editar BL, debe haber un input de buscar orden por defecto aunque no halla orden halada
        if (ordenIndicada != null) {
          cerrarVentanaOrdenValidacion = true;
        }
      }
    }
    if (cerrarVentanaOrdenValidacion) {
      setMensajeAlerta(
        "Presione soltar o copie los materiales de la orden halada."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);

      return "";
    }

    // 🟢🟢🟢🟢Si todo esta correcto🟢🟢🟢🟢
    // 🟢🟢🟢🟢Si todo esta correcto🟢🟢🟢🟢
    // 🟢🟢🟢🟢Si todo esta correcto🟢🟢🟢🟢
    let cambiosRealizados = false;
    // Este if agrega un nuevo furgon
    const materialesCargarParsed = materialesUnificados.map((item) => {
      return {
        ...item,
      };
    });
    if (accion == "addBL") {
      const furgonIndicadoParsed = {
        ...furgonIndicado,
        materiales: materialesUnificados,
      };
      setFurgonesMasterEditable([
        ...furgonesMasterEditable,
        furgonIndicadoParsed,
      ]);
      cambiosRealizados = true;
    }
    // Este if reemplaza los materiales  del furgon en edicion
    else if (accion == "guardarCambios" || accion == "detalleBL") {
      console.log("000000000000");
      const itemsValorAuxParsed = materialesCargarParsed.map((item) => {
        return {
          ...item,
          // valoresAux: null,
        };
      });
      console.log(indexFurgonEnBL);
      setFurgonesMasterEditable(
        furgonesMasterEditable.map((furgon, i) =>
          i === indexFurgonEnBL
            ? { ...furgon, materiales: itemsValorAuxParsed }
            : furgon
        )
      );
      cambiosRealizados = true;
    }

    // REINICIANDO TODO
    setMaterialesUnificados([]);
    if (modo == "addBL") {
      setFurgonFijado(false);
    } else if (modo == "detalleBL") {
      setNClasesPadre([]);
    }
    if (cambiosRealizados) {
      setVentanaOrdenVisible(false);
      setCambiosSinGuardar(false);
      setVentanaJuntaMateriales(0);
      setFurgonIndicado(furgonSchema);
      setOrdenIndicada(null);
    }
  };

  // ****************Eliminar fila**************
  const eliminarFila = (e) => {
    let index = Number(e.target.dataset.index);
    setCambiosSinGuardar(true);

    const materialesFiltrados = materialesUnificados.filter(
      (item, indexCopia) => {
        return indexCopia != index;
      }
    );
    setMaterialesUnificados(materialesFiltrados);
  };

  // ****************Cancelar tabla********************
  const cancelarTabla = () => {
    setCambiosSinGuardar(false);
    setVentanaJuntaMateriales(0);
    setFurgonIndicado(furgonSchema);
    setMaterialesUnificados([]);
    setFurgonFijado(false);
  };

  return (
    <>
      <BotonQuery
        furgonIndicado={furgonIndicado}
        materialesUnificados={materialesUnificados}
      />
      {modo == "addBL" && (
        <CajaBotones
          className={ventanaJuntaMateriales == 2 ? "isEditFurgon" : ""}
        >
          {ventanaJuntaMateriales == 1 && (
            <BtnNormal
              type="button"
              ref={btnAgregar}
              onClick={() => agregarABL("addBL")}
            >
              <Icono icon={faPlus} />
              Agregar a BL
            </BtnNormal>
          )}

          {ventanaJuntaMateriales != 3 && (
            <BtnNormal
              type="button"
              className="cancelar"
              onClick={() => cancelarTabla()}
            >
              <Icono icon={faTrashCan} />
              Cancelar
            </BtnNormal>
          )}

          {ventanaJuntaMateriales == 2 ? (
            <BtnNormal
              type="button"
              onClick={() => agregarABL("guardarCambios")}
              className="guardar"
            >
              <Icono icon={faFloppyDisk} />
              Guardar
            </BtnNormal>
          ) : (
            ""
          )}
        </CajaBotones>
      )}

      {modo == "detalleBL" && tipoBL === 0 ? (
        <CajaBotones>
          <BtnNormal
            type="button"
            ref={btnAgregar}
            onClick={() => agregarABL("guardarCambios")}
          >
            <Icono icon={faPlus} />
            Guardar materiales
          </BtnNormal>
          <BtnNormal
            type="button"
            className="cancelar"
            ref={btnAgregar}
            onClick={() => cancelarAgregarMat()}
          >
            <Icono icon={faXmark} />
            Cancelar
          </BtnNormal>
        </CajaBotones>
      ) : (
        ""
      )}
      <CajaTablaGroup>
        <TablaGroup
          ref={tablaFurgonRef}
          className={ventanaJuntaMateriales == 2 ? "isEditFurgon" : ""}
        >
          <thead>
            <FilasGroup className="cabeza">
              <CeldaHeadGroup>N°</CeldaHeadGroup>
              <CeldaHeadGroup>Codigo</CeldaHeadGroup>
              <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
              <CeldaHeadGroup>Copiando</CeldaHeadGroup>
              <CeldaHeadGroup>Disponible</CeldaHeadGroup>
              <CeldaHeadGroup>Total orden</CeldaHeadGroup>
              <CeldaHeadGroup>O/C*</CeldaHeadGroup>
              <CeldaHeadGroup>Eliminar</CeldaHeadGroup>
            </FilasGroup>
          </thead>
          <tbody>
            {materialesUnificados.map((item, index) => {
              return (
                <FilasGroup key={index} className="body">
                  <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                  <CeldasBodyGroup>{item.codigo}</CeldasBodyGroup>
                  <CeldasBodyGroup className="descripcion startText">
                    {item.descripcion}
                  </CeldasBodyGroup>
                  <CeldasBodyGroup>
                    <InputCelda
                      className={
                        item.valoresAux?.qtySobrePasaAux ? "sobrePasa" : ""
                      }
                      type="text"
                      name="qtyCopiar"
                      value={item.qty}
                      data-id={index}
                      onChange={(e) => handleInputs(e)}
                      // onKeyUp={(e) => copiarEnter(e)}
                      autoComplete="off"
                      onFocus={(e) => handleInputs(e)}
                      onBlur={(e) => handleInputs(e)}
                    />
                  </CeldasBodyGroup>
                  <CeldasBodyGroup>
                    {calcularCantidadDisponible(
                      item.valoresAux?.cantidadTotalOrdenCompra,
                      item.valoresAux?.qtyTotalDespachosDBFromOrden,
                      item.valoresAux?.qtyTotalDespachosThisBL
                    )}
                  </CeldasBodyGroup>
                  <CeldasBodyGroup>
                    {item.valoresAux?.cantidadTotalOrdenCompra}
                  </CeldasBodyGroup>
                  <CeldasBodyGroup>
                    <Enlace
                      target="_blank"
                      to={
                        "/importaciones/maestros/ordenesCompra/" +
                        item.ordenCompra
                      }
                    >
                      {item.ordenCompra}
                    </Enlace>
                  </CeldasBodyGroup>
                  <CeldasBodyGroup className="eliminar">
                    <IconoCelda
                      index={index}
                      nombre="eliminarFila"
                      ejecucion={(e) => eliminarFila(e)}
                    >
                      ❌
                    </IconoCelda>
                  </CeldasBodyGroup>
                </FilasGroup>
              );
              // }
            })}
          </tbody>
        </TablaGroup>
      </CajaTablaGroup>
    </>
  );
};

// ---------
const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 30px;
  background-color: ${Tema.secondary.azulProfundo};
  color: white;
  &.isEditFurgon {
    background-color: #b9a603;
    color: #333232;
  }
`;
const Filas = styled.tr``;

const CeldaHead = styled.th`
  border-bottom: 1px solid #605e5e;
  padding: 3px 8px;
  text-align: center;
  background-color: #2b7d9e5d;
  border-right: 1px solid #5e5e60;
  font-size: 0.9rem;

  &:first-child {
    width: 40px;
  }
  &:nth-child(2) {
    width: 10px;
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
  font-size: 0.9rem;
  border: 1px solid black;
  height: 25px;
  text-align: center;
  &.eliminar {
    cursor: pointer;
  }
  &.descripcion {
    text-align: start;
    padding-left: 10px;
  }
`;
const InputCelda = styled.input`
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  width: 60px;
  text-align: center;
  margin: 0;
  height: 25px;
  outline: none;
  border: none;
  background-color: ${Tema.secondary.azulGraciel};
  color: ${Tema.primary.azulBrillante};

  background-color: ${ClearTheme.secondary.azulVerde};
  color: white;
  padding: 4px;
  border-radius: 5px;
  border: 1px solid ${Tema.secondary.azulOpaco};
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.sobrePasa {
    border: 1px solid red;
  }
`;

const CajaBotones = styled.div`
  padding-left: 15px;
  display: flex;
`;
const BtnNormal = styled(BtnGeneralButton)`
  width: auto;
  &.cancelar {
    background-color: red;
    width: auto;
    padding: 5px;
    &:hover {
      background-color: white;
      color: red;
    }
  }

  &.guardar {
    background-color: #b9a603;
    width: auto;
    padding: 5px;
    &:hover {
      background-color: white;
      color: red;
    }
  }
`;

const Icono = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;
// 751
const PLetra = styled.p`
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: normal;
  color: ${Tema.secondary.azulOpaco};
  margin: 0;
  padding: 0;
`;
