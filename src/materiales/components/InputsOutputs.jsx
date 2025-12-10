import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom } from "@fortawesome/free-solid-svg-icons";
import { ClearTheme, Tema, Theme } from "../../config/theme";
import { useEffect, useState } from "react";
import { BotonQuery } from "../../components/BotonQuery";

export const InputsOutputs = ({
  sumarRestarHab,
  handleInputs,
  entradaMaster,
  tablaMat,
  tablaResult,
  arrayOpcionesUnidadMedida,
  copiarPortaPapeles,
  primerInputRef,
  inputAreaRef,
  width,
  sinAreaCuadrada,
  limpiarInputs,
}) => {
  const [areaTotal, setAreaTotal] = useState(0);
  const [perimetroTotal, setPerimetroTotal] = useState(0);
  useEffect(() => {
    if (
      arrayOpcionesUnidadMedida[0].select == true ||
      arrayOpcionesUnidadMedida[1].select == true ||
      arrayOpcionesUnidadMedida[4].select == true
    ) {
      let area = 0;
      let parimetro = 0;
      entradaMaster.forEach((entrada) => {
        let ancho = 0;
        let largo = 0;
        entrada.forEach((entrada2) => {
          if (entrada2.nombre == "ancho") {
            ancho = Number(entrada2.valor);
          } else if (entrada2.nombre == "largo") {
            largo = Number(entrada2.valor);
          }
        });
        const areaCuadrada = ancho * largo;
        const perimetroLineal = (ancho + largo) * 2;
        area = area + areaCuadrada;
        parimetro = parimetro + perimetroLineal;
      });
      // const area2Total=entradaMaster.map((area,index)=>{
      //   return Number(area.
      // })
      setPerimetroTotal(parimetro);
      setAreaTotal(area);
    } else if (
      arrayOpcionesUnidadMedida[2].select == true ||
      arrayOpcionesUnidadMedida[3].select == true
    ) {
      console.log("a");
      let area = 0;
      let perimetro = 0;
      entradaMaster.forEach((entrada) => {
        entrada.forEach((entrada2) => {
          if (entrada2.nombre == "area") {
            area = area + Number(entrada2.valor);
          } else if (entrada2.nombre == "perimetro") {
            perimetro = perimetro + Number(entrada2.valor);
          }
        });
      });
      // const area2Total=entradaMaster.map((area,index)=>{
      //   return Number(area.
      // })
      setPerimetroTotal(perimetro);
      setAreaTotal(area);
    }
  }, [entradaMaster]);
  return (
    <>
      <BotonQuery
        arrayOpcionesUnidadMedida={arrayOpcionesUnidadMedida}
        entradaMaster={entradaMaster}
      />
      <SeccionInputs>
        <CajaInputsForm className={Theme.config.modoClear ? "clearModern" : ""}>
          <CajaTablaEntrada>
            <CajaControles>
              <BtnSimple onClick={(e) => sumarRestarHab(e)} name="sumar">
                +
              </BtnSimple>
              <BtnSimple onClick={(e) => sumarRestarHab(e)} name="restar">
                -
              </BtnSimple>
              {width > 600 && (
                <BtnSimple onClick={() => copiarPortaPapeles()}>
                  <Icono icon={faCopy} />
                  Copiar
                </BtnSimple>
              )}
              {limpiarInputs && (
                <BtnSimple onClick={() => limpiarInputs()}>
                  <Icono icon={faBroom} />
                  Limpiar
                </BtnSimple>
              )}
            </CajaControles>

            <Tabla className="tablaEntrada">
              <thead>
                <Filas
                  className={`
                  tablaEntradaHead
                  ${Theme.config.modoClear ? "clearModern" : ""}
                  `}
                >
                  <CeldaHead>N°</CeldaHead>
                  {entradaMaster[0]?.map((input, index) => {
                    return (
                      <CeldaHead key={index} name={input.nombre}>
                        {`${input.nombre.charAt(0).toUpperCase() + input.nombre.slice(1)} ${input.nombre == "area" ? "²" : ""}`}
                      </CeldaHead>
                    );
                  })}
                </Filas>
              </thead>
              <tbody>
                {entradaMaster.map((hab, index) => {
                  return (
                    <Filas
                      key={index}
                      className={`
                        tablaEntradaBody
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        `}
                    >
                      <CeldasBody> {"D" + (index + 1)}</CeldasBody>
                      {hab.map((input, i) => {
                        let ancho = Number(hab[0].valor);
                        let largo = Number(hab[1].valor);
                        let area = 0;
                        let perimetro = 0;

                        if (ancho > 0 && largo > 0) {
                          area = ancho * largo;
                          perimetro = (ancho + largo) * 2;
                        }
                        return (
                          <CeldasBody key={i}>
                            <InputCelda
                              type={
                                arrayOpcionesUnidadMedida[0].select ||
                                arrayOpcionesUnidadMedida[1].select
                                  ? width < 550 &&
                                    input.nombre !== "area" &&
                                    input.nombre !== "perimetro"
                                    ? "number"
                                    : "text"
                                  : arrayOpcionesUnidadMedida[2].select ||
                                      arrayOpcionesUnidadMedida[3].select
                                    ? width < 550 &&
                                      input.nombre !== "ancho" &&
                                      input.nombre !== "largo"
                                      ? "number"
                                      : "text"
                                    : ""
                              }
                              ref={
                                index == 0
                                  ? input.nombre == "ancho"
                                    ? primerInputRef
                                    : input.nombre == "area"
                                      ? inputAreaRef
                                      : null
                                  : null
                              }
                              name={input.nombre}
                              value={
                                input.inactivo == false
                                  ? input.valor
                                  : input.nombre == "area" && area > 0
                                    ? area.toFixed(2) +
                                      (arrayOpcionesUnidadMedida[0].select ==
                                      true
                                        ? " M²"
                                        : arrayOpcionesUnidadMedida[1].select ==
                                            true
                                          ? " P²"
                                          : sinAreaCuadrada
                                            ? arrayOpcionesUnidadMedida[2]
                                                .select == true
                                              ? " In²"
                                              : ""
                                            : arrayOpcionesUnidadMedida[4]
                                                  .select == true
                                              ? " In²"
                                              : "")
                                    : input.nombre == "perimetro" &&
                                        perimetro > 0
                                      ? perimetro.toFixed(2) +
                                        (arrayOpcionesUnidadMedida[0].select ==
                                        true
                                          ? " ML"
                                          : arrayOpcionesUnidadMedida[1]
                                                .select == true
                                            ? " PL"
                                            : sinAreaCuadrada
                                              ? arrayOpcionesUnidadMedida[2]
                                                  .select == true
                                                ? " InL"
                                                : ""
                                              : arrayOpcionesUnidadMedida[4]
                                                    .select == true
                                                ? " InL"
                                                : "")
                                      : ""
                              }
                              data-id={index}
                              data-numerador={input.numerador}
                              onChange={(e) => handleInputs(e)}
                              autoComplete="off"
                              disabled={input.inactivo}
                              className={`
                                            ${Theme.config.modoClear ? "clearModern" : ""} 
                                            ${input.inactivo ? "inactivo" : ""} 
                                            ${
                                              input.nombre == "perimetro" &&
                                              hab[i - 1].valor > 0 &&
                                              hab[i].valor == ""
                                                ? "vacio"
                                                : ""
                                            }
                                            
                                          `}
                            />
                          </CeldasBody>
                        );
                      })}
                    </Filas>
                  );
                })}
                <Filas className="total">
                  <CeldasBody colSpan="3">Total:</CeldasBody>
                  <CeldasBody>
                    {areaTotal?.toFixed(2) +
                      (arrayOpcionesUnidadMedida[0].select == true
                        ? " M²"
                        : arrayOpcionesUnidadMedida[1].select == true
                          ? " P²"
                          : arrayOpcionesUnidadMedida[2].select == true
                            ? " M²"
                            : arrayOpcionesUnidadMedida[3].select == true
                              ? " P²"
                              : arrayOpcionesUnidadMedida[4].select == true
                                ? " In²"
                                : "")}
                  </CeldasBody>
                  <CeldasBody>
                    {perimetroTotal.toFixed(2) +
                      (arrayOpcionesUnidadMedida[0].select == true
                        ? " ML"
                        : arrayOpcionesUnidadMedida[1].select == true
                          ? " PL"
                          : arrayOpcionesUnidadMedida[2].select == true
                            ? " ML"
                            : arrayOpcionesUnidadMedida[3].select == true
                              ? " PL"
                              : arrayOpcionesUnidadMedida[4].select == true
                                ? " InL"
                                : "")}
                  </CeldasBody>
                </Filas>
              </tbody>
            </Tabla>
          </CajaTablaEntrada>
        </CajaInputsForm>
      </SeccionInputs>
      <SeccionSalida>
        <CajaTablaSalida className={width < 550 ? "mobil" : ""}>
          <CajaTablaResult>
            <Tabla className="tablaMat">
              <tbody>
                <Filas
                  className={`
                        tablaSalidaHead
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        `}
                >
                  <CeldaHead>N°</CeldaHead>
                  <CeldaHead>Codigo</CeldaHead>
                  <CeldaHead>Descripcion</CeldaHead>
                  <CeldaHead>Total</CeldaHead>
                </Filas>
              </tbody>
              <tbody>
                {tablaMat.map((mat, index) => {
                  return (
                    <Filas
                      key={index}
                      className={`
                        tablaSalidaBody
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        ${mat.desactivado != true ? "" : "desactivadoSalida"}
                        `}
                    >
                      <CeldasBody>{index + 1}</CeldasBody>
                      <CeldasBody>
                        {mat.desactivado != true ? mat.codigo : "-"}
                      </CeldasBody>
                      <CeldasBody
                        title={mat.descripcion}
                        className={`descripcion `}
                      >
                        {mat.descripcion}
                      </CeldasBody>
                      <CeldasBody>
                        {mat.desactivado != true
                          ? mat.qtyTotal > 0
                            ? mat.qtyTotal
                            : ""
                          : "-"}
                      </CeldasBody>
                    </Filas>
                  );
                })}
              </tbody>
            </Tabla>
          </CajaTablaResult>
          <CajaTablaResult
            className={`tablaResult ${width < 550 ? " mobil" : ""}`}
          >
            <Tabla>
              <thead>
                <Filas
                  className={`
                  tablaSalidaHead
                  ${Theme.config.modoClear ? "clearModern" : ""}
                  `}
                >
                  {tablaResult[0]?.map((mat, index) => {
                    return (
                      <CeldaHead key={index}>{"D" + (index + 1)}</CeldaHead>
                    );
                  })}
                </Filas>
              </thead>
              <tbody>
                {tablaResult.map((fila, index) => {
                  return (
                    <Filas
                      key={index}
                      className={`
                        tablaSalidaHead
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        `}
                    >
                      {fila.map((celda, i) => {
                        return (
                          <CeldasBody
                            key={i}
                            className={`
                              ${celda.desactivado != true ? "" : "desactivado"}
                              ${celda.global != true ? "" : "desactivado"}
                              `}
                          >
                            {celda.global == true
                              ? "-"
                              : celda.desactivado != true
                                ? celda.qty > 0
                                  ? celda.qty
                                  : ""
                                : "-"}
                          </CeldasBody>
                        );
                      })}
                    </Filas>
                  );
                })}
              </tbody>
            </Tabla>
          </CajaTablaResult>
        </CajaTablaSalida>
      </SeccionSalida>
    </>
  );
};
const SeccionInputs = styled.section`
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
`;
const CajaInputsForm = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  background-color: ${Tema.secondary.azulProfundo};
  border: 1px solid ${Tema.primary.azulBrillante};
  border-radius: 10px;
  @media screen and (max-width: 700px) {
    width: 90%;
  }
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerde};
  }
`;

const CajaTablaEntrada = styled.div``;
const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  max-width: 95%;
  margin-bottom: 40px;

  border-radius: 0 5px 5px 0;
  &.tablaResult,
  &.tablaMat {
    background-color: #0b1825;

    border-radius: 5px 0 0 5px;
    /* margin-bottom: 200px; */
  }
  &.mobil {
    overflow-x: scroll;
  }

  &.tablaEntrada {
  }

  overflow: hidden;
`;
const CajaTablaResult = styled.div`
  /* overflow-x: hidden; */

  &.tablaResult {
    overflow-x: scroll;
    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }
    &::-webkit-scrollbar {
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #19b4ef;
      border-radius: 7px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #19b4ef;
      border-radius: 7px;
    }
    /* width: 100px; */
  }
  &.mobil {
    overflow-x: scroll;
    /* width: 100px; */
  }
`;

const Filas = styled.tr`
  color: ${Tema.neutral.blancoHueso};

  &.tablaEntradaHead {
    background-color: ${Theme.secondary.azulGraciel};
    &.clearModern {
      background-color: ${ClearTheme.secondary.azulSuave};
      color: #ffffff;
    }
  }
  &.tablaEntradaBody {
    background-color: ${Theme.secondary.azulGraciel};
    &.clearModern {
      background-color: ${ClearTheme.secondary.azulVerde};
      color: #1f1919;
    }
  }
  &.tablaSalidaHead {
    background-color: ${Theme.secondary.azulGraciel};
    color: white;
    /* color: #585858; */
    &.clearModern {
      background-color: ${ClearTheme.secondary.azulSuave};
      color: #ffffff;
    }
  }

  &.tablaSalidaBody {
    background-color: ${Theme.secondary.azulGraciel};
    /* color: #585858; */
    &.clearModern {
      background-color: ${ClearTheme.secondary.azulSuave};
      color: #ffffff;
    }
    &.desactivadoSalida {
      background-color: ${Tema.primary.grisNatural};
      color: black;
    }
  }

  &.desactivadoSalida {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
  &.total {
    color: white;
  }
`;
const CeldaHead = styled.th`
  border-bottom: 1px solid #605e5e;
  padding: 3px 7px;
  text-align: center;
  border: 1px solid #000;
  font-weight: 100;

  font-size: 0.9rem;
  &.descripcion {
    text-align: start;
    width: 10px;
    max-width: 15px;
  }
  &.qty {
    width: 25px;
    max-width: 35px;
  }
  @media screen and (max-width: 300px) {
    /* max-width: ; */
    font-size: 0.7rem;
  }
`;
const CeldasBody = styled.td`
  font-size: 0.9rem;
  border: 1px solid black;
  height: 25px;

  text-align: center;
  &.descripcion {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }

  @media screen and (max-width: 400px) {
    &.descripcion {
      max-width: 40px;
      font-size: 0.7rem;
    }
  }

  &.desactivado {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
`;

const InputCelda = styled.input`
  border: none;
  outline: none;
  height: 25px;
  padding: 5px;
  color: ${Theme.primary.azulBrillante};
  background-color: inherit;

  &.filaSelected {
    background-color: inherit;
  }
  border: none;
  width: 100%;
  display: flex;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.inactivo {
    background-color: ${Tema.primary.grisNatural};
    color: ${Tema.primary.azulBrillante};
  }
  &.vacio {
    background-color: ${Tema.complementary.warning};
  }
  &.clearModern {
    color: white;
    &:focus {
      border: 1px solid white;
    }
  }
`;

const CajaControles = styled.div`
  display: flex;
  justify-content: center;
`;
const BtnSimple = styled(BtnGeneralButton)`
  width: 20%;
  min-width: 15%;
  font-size: 0.8rem;
  &:focus {
    background-color: ${Tema.secondary.azulOpaco};
  }
`;

const SeccionSalida = styled.section``;
const CajaTablaSalida = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  &.mobil {
    /* justify-content: start; */
  }
`;
const Icono = styled(FontAwesomeIcon)`
  margin-right: 4px;
  color: inherit;
  cursor: pointer;
`;
