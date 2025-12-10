// comentado el 14/12/2025
import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { ClearTheme, Tema, Theme } from "../../config/theme.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

export const InputsOutputsMachihembrado = ({
  sumarRestarHab,
  handleInputs,
  entradaMaster,
  tablaMat,
  tablaResult,
  arrayOpcionesUnidadMedida,
  copiarPortaPapeles,
  changeDirection,
  primerInputRef,
  width,
  limpiarInputs,
}) => {
  const cocinar = (index) => {
    let grosorLine = 6;
    if (entradaMaster[index][2].dirrCorrecta == 1) {
      if (entradaMaster[index][2].dirrCorta == true) {
        return (
          <ImagenDireccion data-id={index}>
            <line
              data-id={index}
              x1="30%"
              y1="60%"
              x2="45%"
              y2="100%"
              stroke="#00ff22"
              strokeWidth={grosorLine}
              data-no-direccion={index}
              data-name="direccion"
            />
            <line
              data-id={index}
              x1="45%"
              y1="100%"
              x2="80%"
              y2="0%"
              stroke="#00ff22"
              strokeWidth={grosorLine}
              data-no-direccion={index}
              data-name="direccion"
            />
          </ImagenDireccion>
        );
      } else if (entradaMaster[index][2].dirrCorta == false) {
        return (
          <ImagenDireccion data-id={index}>
            <line
              data-id={index}
              x1="35%"
              y1="10%"
              x2="65%"
              y2="90%"
              stroke="#ff0019"
              strokeWidth="3"
              data-no-direccion={index}
              data-name="direccion"
            />
            <line
              data-id={index}
              x1="65%"
              y1="10%"
              x2="35%"
              y2="90%"
              stroke="#ff0019"
              strokeWidth="3"
              data-no-direccion={index}
              data-name="direccion"
            />
          </ImagenDireccion>
        );
      }
    } else if (entradaMaster[index][2].dirrCorrecta == 2) {
      if (entradaMaster[index][2].dirrCorta == false) {
        return (
          <ImagenDireccion data-id={index}>
            <line
              data-id={index}
              x1="30%"
              y1="60%"
              x2="45%"
              y2="100%"
              stroke="#00ff22"
              strokeWidth={grosorLine}
              data-no-direccion={index}
              data-name="direccion"
            />
            <line
              data-id={index}
              x1="45%"
              y1="100%"
              x2="70%"
              y2="0%"
              stroke="#00ff22"
              strokeWidth={grosorLine}
              data-no-direccion={index}
              data-name="direccion"
            />
          </ImagenDireccion>
        );
      } else if (entradaMaster[index][2].dirrCorta == true) {
        return (
          <ImagenDireccion data-id={index}>
            <line
              data-id={index}
              x1="35%"
              y1="10%"
              x2="65%"
              y2="90%"
              stroke="#ff0019"
              strokeWidth="3"
              data-no-direccion={index}
              data-name="direccion"
            />
            <line
              data-id={index}
              x1="65%"
              y1="10%"
              x2="35%"
              y2="90%"
              stroke="#ff0019"
              strokeWidth="3"
              data-no-direccion={index}
              data-name="direccion"
            />
          </ImagenDireccion>
        );
      }
    }
  };

  return (
    <>
      <SeccionInputs>
        <CajaInputsForm
          className={`
          ${width < 550 ? " mobil " : ""}
          ${Theme.config.modoClear ? " clearModern " : ""}
          `}
        >
          <CajaTablaEntrada>
            <CajaControles>
              <BtnSimple onClick={(e) => sumarRestarHab(e)} name="sumar">
                +
              </BtnSimple>
              <BtnSimple onClick={(e) => sumarRestarHab(e)} name="restar">
                -
              </BtnSimple>
              {width > 550 && (
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
            <Tabla>
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

                        // console.log(perimetro)

                        return (
                          <CeldasBody
                            key={i}
                            className={
                              input.nombre == "dircc." ? "direccion" : ""
                            }
                          >
                            {input.nombre != "dircc." ? (
                              <InputCelda
                                type={width < 550 ? "number" : "text"}
                                ref={
                                  index == 0 && i == 0 ? primerInputRef : null
                                }
                                name={input.nombre}
                                value={
                                  input.inactivo == false
                                    ? input.valor
                                    : input.nombre == "area" && area > 0
                                      ? area.toFixed(1) +
                                        (arrayOpcionesUnidadMedida[0].select ==
                                        true
                                          ? " M²"
                                          : arrayOpcionesUnidadMedida[1]
                                                .select == true
                                            ? " P²"
                                            : arrayOpcionesUnidadMedida[2]
                                                  .select == true
                                              ? " In²"
                                              : "")
                                      : input.nombre == "perimetro" &&
                                          perimetro > 0
                                        ? perimetro.toFixed(1) +
                                          (arrayOpcionesUnidadMedida[0]
                                            .select == true
                                            ? " ML"
                                            : arrayOpcionesUnidadMedida[1]
                                                  .select == true
                                              ? " PL"
                                              : arrayOpcionesUnidadMedida[2]
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
                            ) : (
                              <CajaRayas
                                data-id={index}
                                name={"romo"}
                                onClick={(e) => changeDirection(e)}
                                className={
                                  input.dirrCorta == false ? "vertical" : ""
                                }
                              >
                                {input.dirrCorta ? (
                                  <>
                                    <CajaVertical
                                      className="primera"
                                      data-id={index}
                                    />
                                    {/* <CajaVertical
                                                          data-id={index}
                                                          /> */}
                                    {/* <CajaVertical
                                                          data-id={index}
                                                          /> */}
                                    {/* <CajaVertical
                                                          data-id={index}
                                                          /> */}
                                    <CajaVertical data-id={index} />
                                    <CajaVertical data-id={index} />
                                    <CajaVertical data-id={index} />
                                    <CajaVertical
                                      className="ultima"
                                      data-id={index}
                                    />
                                    {cocinar(index)}
                                  </>
                                ) : (
                                  <>
                                    <CajaHorizontal
                                      data-id={index}
                                      className="primera"
                                    />
                                    <CajaHorizontal data-id={index} />
                                    <CajaHorizontal
                                      data-id={index}
                                      className="ultima"
                                    />
                                    {cocinar(index)}
                                  </>
                                )}
                              </CajaRayas>
                            )}
                          </CeldasBody>
                        );
                      })}
                    </Filas>
                  );
                })}
              </tbody>
            </Tabla>
          </CajaTablaEntrada>
        </CajaInputsForm>
      </SeccionInputs>
      <SeccionSalida>
        <CajaTablaSalida>
          <CajaTablaResult>
            <Tabla>
              <tbody>
                <Filas
                  className={`
                                   tablaSalidaHead
                                   ${Theme.config.modoClear ? "clearModern" : ""}
                                   `}
                >
                  <CeldaHead>N°</CeldaHead>
                  <CeldaHead>Codigo</CeldaHead>
                  <CeldaHead>Descripción</CeldaHead>
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
                      {/* <CeldasBody>{mat.desactivado!=true?(mat.qtyTotal>0?mat.qtyTotal:''):'-'}</CeldasBody> */}
                      <CeldasBody>
                        {mat.qtyTotal > 0
                          ? mat.qtyTotal
                          : mat.qtyTotal == "-"
                            ? "-"
                            : ""}
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
                            className={
                              celda.desactivado != true ? "" : "desactivado"
                            }
                          >
                            {celda.qty > 0
                              ? celda.qty % 1 !== 0
                                ? celda.qty.toFixed(2)
                                : celda.qty
                              : ""}
                            {celda.unidadMedida ? celda.unidadMedida : ""}
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

const CajaTablaResult = styled.div`
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
    margin-right: 20px;
  }
`;

const SeccionInputs = styled.section`
  margin-bottom: 20px;
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
  padding: 5px;
  &.mobil {
    width: 90%;
  }

  @media screen and (max-width: 800px) {
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
  margin-bottom: 10px;
`;

const Filas2 = styled.tr`
  &.body {
    font-weight: lighter;
    border-bottom: 1px solid #49444457;
    border: none;
    background-color: ${Tema.secondary.azulSuave};
  }
  &.descripcion {
    text-align: start;
    width: 10px;
    max-width: 15px;
  }
  &.desactivado {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
  color: ${Tema.neutral.blancoHueso};
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
`;
const CeldaHead2 = styled.th`
  border-bottom: 1px solid #605e5e;
  padding: 3px 7px;
  text-align: center;
  border: 1px solid #000;
  background-color: ${Tema.secondary.azulProfundo};
  color: ${Tema.neutral.blancoHueso};
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

  @media screen and (max-width: 400px) {
    max-width: 25px;
    font-size: 0.6rem;
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
const CeldasBody2 = styled.td`
  font-size: 0.9rem;
  border: 1px solid black;
  height: 25px;
  color: ${Tema.neutral.blancoHueso};
  &.clicKeable {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  text-align: center;
  &.descripcion {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
    @media screen and (max-width: 550px) {
      max-width: 110px;
    }
  }

  &.desactivado {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
  &.direccion {
    background-color: white;
    border: none;
    border-bottom: 1px solid black;
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

const ImagenDireccion = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
  top: 0;
`;

const CajaRayas = styled.div`
  display: block;
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
  &.vertical {
    flex-direction: column;
    &:first-child {
      /* background-color: yellow; */
    }
    &:nth-last-child(1) {
      /* background-color: red; */
      border-bottom: none;
    }
  }
`;
const CajaVertical = styled.div`
  height: 100%;
  width: 20.2%;
  border-right: 2px solid black;
  background-color: #909090;
  cursor: pointer;
  &.ultima {
    /* background-color: red; */
    border-right: none;
  }
`;
const CajaHorizontal = styled.div`
  height: 34%;
  width: 100%;
  border-bottom: 2px solid black;
  cursor: pointer;
  background-color: #909090;
  &.ultima {
    /* background-color: red; */
    border-bottom: none;
  }
`;

const InputCelda2 = styled.input`
  border: none;
  outline: none;
  height: 25px;
  padding: 5px;
  background-color: ${Tema.secondary.azulGraciel};
  &.filaSelected {
    background-color: inherit;
  }
  border: none;
  color: ${Tema.primary.azulBrillante};
  width: 100%;
  display: flex;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.inactivo {
    background-color: ${Tema.primary.grisNatural};
  }
  &.vacio {
    background-color: ${Tema.complementary.danger};
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
`;
const Icono = styled(FontAwesomeIcon)`
  margin-right: 4px;
  color: inherit;
  cursor: pointer;
`;
