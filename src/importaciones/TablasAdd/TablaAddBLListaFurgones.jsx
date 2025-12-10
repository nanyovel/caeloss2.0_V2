import styled from "styled-components";

import { ClearTheme, Tema } from "../../config/theme.jsx";
import { ordenCompraSchema } from "../schema/ordenCompraSchema.js";
import { furgonSchema } from "../schema/furgonSchema.js";

export const TablaAddBLListaFurgones = ({
  tablaFurgonRef,
  ventanaJuntaMateriales,
  setVentanaJuntaMateriales,
  setIndexFurgonEnBL,
  setVentanaOrdenVisible,
  cambiosSinGuardar,
  setOrdenIndicada,
  furgonesMasterEditable,
  setFurgonesMasterEditable,
  setFurgonFijado,
  setMensajeAlerta,
  setTipoAlerta,
  setDispatchAlerta,
  materialesUnificados,
  setMaterialesUnificados,
}) => {
  // Info relevante:
  // No deben haber contenedores con mismo numero que otro, esto traeria un monton de problemas, que afectaria incluso los despachos de la colecion de la orden, dado que se calculo filtrando los furgones que numero se diferente al res !=, esto para no calaculos los despachos de X furgon, si tenemos el mismo numero de furgon dos veces entonces en los despachos no se tomaran sus materiales, pero ademas afecta otras mas cosas aparte de los despachos de las ordenes

  const numerosDeFurgones = new Set();

  const handleInput = (e) => {
    const index = Number(e.target.dataset.id);
    const { name, value } = e.target;

    // blEditable.furgones.forEach((furgon) => {
    //   numerosDeFurgones.add(furgon.numeroDoc.toString());
    // });
    furgonesMasterEditable.forEach((furgon) => {
      numerosDeFurgones.add(furgon.numeroDoc.toString());
    });

    let hayDuplicados = false;
    if (name == "numeroDoc") {
      if (numerosDeFurgones.has(value.toUpperCase())) {
        hayDuplicados = true;
        setMensajeAlerta("Este numero de contenedor ya existe en este BL.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        return "";
      }
    }

    // if (hayDuplicados == false) {
    //   setBLEditable((prevBL) => {
    //     const transformedValue =
    //       name === "numeroDoc" ? value.toUpperCase() : value;
    //     const newFurgones = [...prevBL.furgones];
    //     const updatedFurgon = {
    //       ...newFurgones[index],
    //       [name]: transformedValue,
    //     };
    //     newFurgones[index] = updatedFurgon;
    //     return { ...prevBL, furgones: newFurgones };
    //   });
    // }

    const transformedValue = name === "numeroDoc" ? value.toUpperCase() : value;
    if (hayDuplicados == false) {
      setFurgonesMasterEditable((prevFurgones) =>
        prevFurgones.map((furgon, indexFurgon) => {
          if (indexFurgon === index) {
            return {
              ...furgon,
              [name]: transformedValue,
            };
          }
          return furgon;
        })
      );
    }
  };

  const showFurgon = (e) => {
    const index = Number(e.target.dataset.id);
    let validacion = {
      edicionInactiva: true,
    };

    // Si se realizaron cambios en la ventana juntadora de materiales
    if (cambiosSinGuardar == true) {
      setMensajeAlerta("Guarda o cancela el contenedor en edicion.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 5000);
      validacion.edicionInactiva = false;
      return;
    }
    // Si todo esta correcto
    if (validacion.edicionInactiva == true) {
      setIndexFurgonEnBL(index);
      // setCopiarAFurgonMaster([]);
      setFurgonFijado(true);

      const thisFurgon = furgonesMasterEditable[index];

      // RESTAR LA CANTIDAD DE ESTE ITEM A LA CANTIDAD DESPACHADA THIS BL
      const materialesFurgon = thisFurgon.materiales.map((item) => {
        // Se necesita calcular la cantidad colocada en BL de cada articulo
        let qtyCargadaBL = 0;

        furgonesMasterEditable.forEach((furgon) => {
          furgon.materiales.forEach((product) => {
            if (
              product.ordenCompra == item.ordenCompra &&
              product.codigo == item.codigo
            ) {
              qtyCargadaBL += product.qty;
            }
          });
        });

        return {
          ...item,
          valoresAux: {
            ...item.valoresAux,
            qtyTotalDespachosThisBL: qtyCargadaBL - item.qty,
          },
        };
      });
      //
      // setFurgonIndicado({
      //   ...furgonesMasterEditable[index],
      //   materiales: materialesFurgon,
      // });
      setMaterialesUnificados(materialesFurgon);

      setTimeout(() => {
        setVentanaJuntaMateriales(2);
      }, 100);
      setTimeout(() => {
        tablaFurgonRef.current.scrollIntoView({ behavior: "smooth" });
      }, 120);

      setVentanaOrdenVisible(false);
      setOrdenIndicada(null);
    }
  };

  const eliminarFila = (e) => {
    let index = Number(e.target.dataset.id);
    let validacion = {
      sinEdicion: true,
    };
    // Si la ventana juntadora de materiales esta visible
    if (ventanaJuntaMateriales > 0) {
      setMensajeAlerta("Primero guarde o cancele el recuadro unificador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      validacion.sinEdicion = false;
      return;
    }

    setFurgonesMasterEditable((prevFurgones) =>
      prevFurgones.filter((furgon, indexCopia) => indexCopia != index)
    );

    setFurgonFijado(false);
  };

  const clonar = (e) => {
    const index = Number(e.target.dataset.id);
    let validacion = {
      clonar: true,
    };

    // QUEDE EN ESTE BLQOUE DE CODIGO, PROBANDO QUE AL CLONAR UN FURGON, NO SE PUEDE CLONAR SI ALGUN MATERIAL NO TIENE CANTIDAD SUFICIENTE PARA AGREGAR OTRO FURGON
    // DEBE MARCAR UN ALERTA Y NO CLONAR EL FURGON
    furgonesMasterEditable[index].materiales.forEach((item) => {
      const qtyOrden = item.valoresAux.cantidadTotalOrdenCompra;
      const qtyDespachosDB = item.valoresAux.qtyTotalDespachosDBFromOrden;
      let qtyDespachosThisBL = 0;
      let qtyDisponible = 0;

      // Dame las cantidades despachadas de este articulo en los furgones de este BL en curso
      furgonesMasterEditable.forEach((furgon) => {
        furgon.materiales.forEach((product) => {
          if (
            product.ordenCompra == item.ordenCompra &&
            product.codigo == item.codigo
          ) {
            qtyDespachosThisBL += product.qty;
          }
        });
      });

      qtyDisponible = qtyOrden - qtyDespachosDB - qtyDespachosThisBL;

      // Si algun item no tiene cantidad suficiente para agregar otro furgon

      if (item.qty > qtyDisponible) {
        setMensajeAlerta(
          `Codigo ${item.codigo} sin disponibilidad suficiente.`
        );
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        validacion.clonar = false;
        return "";
      }
    });

    // Si la ventana compiladora de materiales esta activa
    if (ventanaJuntaMateriales > 0) {
      setMensajeAlerta(
        `Por favor guarde o cancele el recuadro unificador de materiales.`
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      validacion.clonar = false;
      return "";
    }

    // Si todo esta correcto
    if (validacion.clonar == true) {
      const clon = {
        ...furgonesMasterEditable[index],
        numeroDoc: (furgonesMasterEditable.length + 1).toString(),
      };
      setFurgonesMasterEditable([...furgonesMasterEditable, clon]);
    }
  };

  return (
    <>
      <CajaTabla>
        <Tabla>
          <EncabezadoTabla>
            <Filas className="cabeza">
              <CeldasHead>N°</CeldasHead>
              <CeldasHead>Numero</CeldasHead>
              <CeldasHead>Tamaño </CeldasHead>
              <CeldasHead>Acciones</CeldasHead>
            </Filas>
          </EncabezadoTabla>
          <Cuerpo>
            {furgonesMasterEditable?.map((furgon, index) => {
              return (
                <Filas key={index} className="body">
                  <CeldasBody> {index + 1}</CeldasBody>
                  <CeldasBody>
                    {
                      <InputEditable
                        type="text"
                        name="numeroDoc"
                        value={furgonesMasterEditable[index].numeroDoc}
                        data-id={index}
                        onChange={(e) => handleInput(e)}
                        autoComplete="off"
                      />
                    }
                  </CeldasBody>
                  <CeldasBody>
                    <MenuDesplegable
                      value={furgonesMasterEditable[index].tamannio}
                      name="tamannio"
                      data-id={index}
                      onChange={(e) => handleInput(e)}
                    >
                      <Opciones value="20'">20&apos;</Opciones>
                      <Opciones value="40'">40&apos;</Opciones>
                      <Opciones value="45'">45&apos;</Opciones>
                      <Opciones value="Otros">Otros</Opciones>
                    </MenuDesplegable>
                  </CeldasBody>
                  <CeldasBody>
                    <Ejecutar data-id={index} onClick={(e) => eliminarFila(e)}>
                      ❌
                    </Ejecutar>

                    <Ejecutar
                      data-id={index}
                      onClick={(e) => {
                        showFurgon(e);
                      }}
                    >
                      Ⓜ️
                    </Ejecutar>
                    <Ejecutar
                      data-id={index}
                      onClick={(e) => {
                        clonar(e);
                      }}
                    >
                      👥
                    </Ejecutar>
                  </CeldasBody>
                </Filas>
              );
            })}
          </Cuerpo>
        </Tabla>
      </CajaTabla>
    </>
  );
};

const CajaTabla = styled.div`
  overflow-x: scroll;
  width: 100%;
  height: 100%;
  border: 1px solid white;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 7px;
    width: 7px;
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
  border: 1px solid ${Tema.secondary.azulOpaco};
  color: ${Tema.secondary.azulOpaco};
  width: 100%;
  margin: auto;
  border-collapse: collapse;
`;

const Filas = styled.tr`
  width: 300px;
  &.cabeza {
    background-color: ${ClearTheme.secondary.azulSuaveOsc};
    color: white;
  }
  &.body {
    font-weight: normal;
    border: none;
    background-color: ${ClearTheme.secondary.azulSuave};
    color: #00496b;
    background-color: white;
  }
`;

const CeldasBody = styled.td`
  width: 800px;
  font-size: 0.9rem;
  border: 1px solid black;
  height: 25px;

  /* color: white; */
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
  &.eliminar {
    cursor: pointer;
  }
`;

const Input = styled.input`
  height: 35px;
  outline: none;
  border-radius: 5px;
  border: 1px solid ${Tema.secondary.azulOpaco};
  background-color: ${Tema.secondary.azulGraciel};
  color: ${Tema.primary.azulBrillante};
  padding: 10px;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.fijado {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
`;

const InputEditable = styled(Input)`
  height: 24px;
  width: 120px;
  font-size: 0.8rem;
  padding: 8px;
  background-color: ${ClearTheme.secondary.azulVerde};
  color: #ffffff;
`;

const MenuDesplegable = styled.select`
  height: 24px;
  outline: none;
  border-radius: 5px;
  border: 1px solid ${Tema.secondary.azulOpaco};

  background-color: ${ClearTheme.secondary.azulVerde};
  color: #ffffff;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.fijado {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
`;

const Opciones = styled.option`
  height: 100px;
  padding: 100px;
  /* font-size: 1rem; */
  background-color: ${ClearTheme.secondary.azulVerdeOsc};
  color: white;

  &:hover {
    cursor: pointer;
  }
`;
const Ejecutar = styled.span`
  cursor: pointer;
  border: 1px solid ${Tema.secondary.azulGraciel};
  padding: 4px;
  border-radius: 3px;
  margin-right: 2px;
  font-size: 0.7rem;
  &:hover {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
`;
const Cuerpo = styled.tbody``;

// 343

const EncabezadoTabla = styled.thead`
  /* border: 1px solid white; */
  background-color: ${Tema.secondary.azulGraciel};
  width: 300px;
`;

const CeldasHead = styled.th`
  width: 300px;
  border: 1px solid ${Tema.secondary.azulOpaco};
`;
