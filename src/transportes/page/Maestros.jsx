import { useEffect, useState } from "react";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import styled from "styled-components";
import imgSolicitud from "./../../../public/img/cheque-de-pago.png";
import imgProyecto from "./..//img/proyecto.png";
import imgConductor from "./..//img/conductor.png";
import imgCamion from "./..//img/camion.png";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { Alerta } from "../../components/Alerta";
import { BotonQuery } from "../../components/BotonQuery.jsx";
import { DetalleReq } from "../views/DetalleReq.jsx";
import { DetalleChofer } from "../views/DetalleChofer.jsx";

import DetalleProyecto from "../views/DetalleProyecto.jsx";
import { ClearTheme, Tema, Theme } from "../../config/theme.jsx";
import { InputSimpleEditable } from "../../components/InputGeneral.jsx";
import DetallePago from "../views/DetallePago.jsx";

export const Maestros = ({
  setOpcionUnicaSelect,
  userMaster,
  dbTransferRequest,
  dbUsuarios,

  setDBChoferes,
  dbChoferes,
  usuario,
  // choferes internos
  congloPagosInternos,
  setCongloPagosInternos,
  congloPagosExtInd,
  setCongloPagosExtInd,
  congloPagosExtEmp,
  setCongloPagosExtEmp,
}) => {
  useEffect(() => {
    document.title = "Caeloss - Transporte";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const navigate = useNavigate();

  // const [focusOn, setFocusOn]=useState('');
  const [valueFurgon, setValueFurgon] = useState("");
  const [valueArticulo, setValueArticulo] = useState("");
  const [valueOrdenCompra, setValueOrdenCompra] = useState("");
  const [valueBillOfLading, setValueBillOfLading] = useState("");

  const initialValueNumDocs = {
    solicitudes: "",
    proyectos: "",
    choferes: "",
  };
  const [numerosDocs, setNumerosDocs] = useState({ ...initialValueNumDocs });

  const handleInput = (e) => {
    const { value, name } = e.target;
    // return;
    setNumerosDocs({
      ...numerosDocs,
      [name]: value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.name == "formContenedor") {
      if (valueFurgon == "") {
      } else {
        let nuevoFurgon = valueFurgon.toUpperCase();
        nuevoFurgon = nuevoFurgon.replace(/ /g, "");
        nuevoFurgon = nuevoFurgon.replace(/-/g, "");
        navigate("contenedores/" + encodeURIComponent(nuevoFurgon));
      }
    } else if (e.target.name == "formArticulo") {
      if (valueArticulo == "") {
      } else {
        navigate("articulos/" + encodeURIComponent(valueArticulo));
      }
    } else if (e.target.name == "formOrdenCompra") {
      if (valueOrdenCompra == "") {
      } else {
        navigate("ordenescompra/" + encodeURIComponent(valueOrdenCompra));
      }
    } else if (e.target.name == "formBillOfLading") {
      if (valueBillOfLading == "") {
      } else {
        console.log(valueBillOfLading);
        navigate("billoflading/" + encodeURIComponent(valueBillOfLading));
      }
    }
  };

  useEffect(() => {
    setOpcionUnicaSelect(null);
  }, []);

  const navegarADoc = (key) => {
    console.log("nav");

    navigate([key] + "/" + encodeURIComponent(numerosDocs[key]));
  };

  const [datosParseados, setDatosParseados] = useState(false);
  useEffect(() => {
    if (userMaster) {
      setDatosParseados(true);
    }
  }, [userMaster]);

  return (
    datosParseados && (
      <Container>
        <Routes>
          <Route
            path="/"
            element={
              <ContainerMain>
                <BotonQuery numerosDocs={numerosDocs} />
                <CajaQueryGeneral
                  className={Theme.config.modoClear ? "clearModern" : ""}
                >
                  <Titulo
                    className={Theme.config.modoClear ? "clearModern" : ""}
                  >
                    Consultar Solicitudes
                  </Titulo>
                  <CajaDetalle
                    className={Theme.config.modoClear ? "clearModern" : ""}
                  >
                    <div>
                      <form
                        action=""
                        onSubmit={(e) => handleSubmit(e)}
                        name="formSolicitud"
                      >
                        <Texto>Ingrese numero Solicitud:</Texto>
                        <Input
                          type="text"
                          placeholder="Numero solicitud"
                          className={
                            Theme.config.modoClear ? "clearModern" : ""
                          }
                          name="solicitudes"
                          autoComplete="off"
                          value={numerosDocs.solicitudes}
                          onChange={(e) => handleInput(e)}
                        />
                        <BtnEjecutar onClick={() => navegarADoc("solicitudes")}>
                          Consultar
                        </BtnEjecutar>
                      </form>
                    </div>

                    <CajaImagen>
                      {/* <Enlaces
                      to={`/importaciones/maestros/solicitudes/`}
                      target="_blank"
                    > */}
                      <ImagenMostrar src={imgSolicitud} />
                      {/* </Enlaces> */}
                    </CajaImagen>
                  </CajaDetalle>
                </CajaQueryGeneral>

                <CajaQueryGeneral
                  className={Theme.config.modoClear ? "clearModern" : ""}
                >
                  <Titulo
                    className={Theme.config.modoClear ? "clearModern" : ""}
                  >
                    Consultar Proyecto
                  </Titulo>
                  <CajaDetalle
                    className={Theme.config.modoClear ? "clearModern" : ""}
                  >
                    <div>
                      <Texto>Ingrese numero del Proyecto:</Texto>
                      <form
                        action=""
                        onSubmit={(e) => handleSubmit(e)}
                        name="formProyecto"
                      >
                        <Input
                          className={
                            Theme.config.modoClear ? "clearModern" : ""
                          }
                          type="text"
                          name="proyectos"
                          placeholder="Numero proyecto"
                          autoComplete="off"
                          value={numerosDocs.proyectos}
                          onChange={(e) => handleInput(e)}
                        />
                        <BtnEjecutar onClick={() => navegarADoc("proyectos")}>
                          Consultar
                        </BtnEjecutar>
                      </form>
                    </div>
                    <CajaImagen>
                      {/* <Enlaces
                      to={`/importaciones/maestros/proyectos/`}
                      target="_blank"
                    > */}
                      <ImagenMostrar src={imgProyecto} />
                      {/* </Enlaces> */}
                    </CajaImagen>
                  </CajaDetalle>
                </CajaQueryGeneral>
                <CajaQueryGeneral
                  className={Theme.config.modoClear ? "clearModern" : ""}
                >
                  <Titulo
                    className={Theme.config.modoClear ? "clearModern" : ""}
                  >
                    Consultar Chofer
                  </Titulo>
                  <CajaDetalle
                    className={Theme.config.modoClear ? "clearModern" : ""}
                  >
                    <div>
                      <Texto>Ingrese codigo de Chofer:</Texto>
                      <form
                        action=""
                        onSubmit={(e) => handleSubmit(e)}
                        name="choferes"
                      >
                        <Input
                          className={
                            Theme.config.modoClear ? "clearModern" : ""
                          }
                          type="text"
                          name="choferes"
                          placeholder="Codigo chofer"
                          autoComplete="off"
                          value={numerosDocs.choferes}
                          onChange={(e) => handleInput(e)}
                        />
                        <BtnEjecutar onClick={() => navegarADoc("choferes")}>
                          Consultar
                        </BtnEjecutar>
                      </form>
                    </div>
                    <CajaImagen>
                      <ImagenMostrar src={imgConductor} className="noPng" />
                    </CajaImagen>
                  </CajaDetalle>
                </CajaQueryGeneral>

                <Alerta
                  estadoAlerta={dispatchAlerta}
                  tipo={tipoAlerta}
                  mensaje={mensajeAlerta}
                />
              </ContainerMain>
            }
          />
          <Route
            path="solicitudes"
            element={
              <DetalleReq
                userMaster={userMaster}
                datosParseados={datosParseados}
                // setOpcionUnicaSelect={setOpcionUnicaSelect}
                dbTransferRequest={dbTransferRequest}
                dbUsuarios={dbUsuarios}
                setDBChoferes={setDBChoferes}
                dbChoferes={dbChoferes}
                usuario={usuario}
                // Pagos
                congloPagosInternos={congloPagosInternos}
                setCongloPagosInternos={setCongloPagosInternos}
                congloPagosExtInd={congloPagosExtInd}
                setCongloPagosExtInd={setCongloPagosExtInd}
                congloPagosExtEmp={congloPagosExtEmp}
                setCongloPagosExtEmp={setCongloPagosExtEmp}
              />
            }
          />
          <Route
            path="solicitudes/:id"
            element={
              <DetalleReq
                userMaster={userMaster}
                datosParseados={datosParseados}
                setOpcionUnicaSelect={setOpcionUnicaSelect}
                dbTransferRequest={dbTransferRequest}
                dbUsuarios={dbUsuarios}
                setDBChoferes={setDBChoferes}
                dbChoferes={dbChoferes}
                usuario={usuario}
              />
            }
          />

          <Route
            path="choferes/"
            element={
              <DetalleChofer
                userMaster={userMaster}
                // setOpcionUnicaSelect={setOpcionUnicaSelect}
                // dbTransferRequest={dbTransferRequest}
                // dbUsuarios={dbUsuarios}
              />
            }
          />
          <Route
            path="choferes/:id"
            element={
              <DetalleChofer
                userMaster={userMaster}
                // setOpcionUnicaSelect={setOpcionUnicaSelect}
                // dbTransferRequest={dbTransferRequest}
                // dbUsuarios={dbUsuarios}
              />
            }
          />

          <Route
            path="proyectos/"
            element={
              <DetalleProyecto
                userMaster={userMaster}
                setOpcionUnicaSelect={setOpcionUnicaSelect}
                dbTransferRequest={dbTransferRequest}
                dbUsuarios={dbUsuarios}
                modoDisabled={true}
              />
            }
          />
          <Route
            path="proyectos/:id"
            element={
              <DetalleProyecto
                userMaster={userMaster}
                setOpcionUnicaSelect={setOpcionUnicaSelect}
                dbTransferRequest={dbTransferRequest}
                dbUsuarios={dbUsuarios}
                modoDisabled={true}
              />
            }
          />
          <Route
            path="pagos/:id"
            element={
              <DetallePago
                userMaster={userMaster}
                setOpcionUnicaSelect={setOpcionUnicaSelect}
                dbTransferRequest={dbTransferRequest}
                dbUsuarios={dbUsuarios}
                modoDisabled={true}
              />
            }
          />
        </Routes>
      </Container>
    )
  );
};
const Container = styled.div`
  display: block;
  width: 100%;
  /* border: 2px solid red; */
`;

const ContainerMain = styled.div`
  width: 100%;
  min-height: 200px;
  padding: 10px;
  padding-left: 15px;
  /* background-color: red; */
`;
const CajaQueryGeneral = styled.div`
  width: 100%;
  min-height: 100px;
  border: 1px solid black;
  margin-bottom: 20px;
  border-radius: 5px;
  padding: 5px;
  padding-left: 10px;
  background-color: ${Tema.secondary.azulOscuro2};

  &.ultima {
    margin-bottom: 100px;
  }
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulFrosting};
    backdrop-filter: blur(3px);
  }
`;
const Titulo = styled.h2`
  text-decoration: underline;
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: ${Tema.primary.azulBrillante};
  &.clearModern {
    color: white;
  }
`;

const CajaDetalle = styled.div`
  background-color: ${Tema.secondary.azulGraciel};
  border: 1px solid black;
  border-radius: 5px;
  padding: 10px;
  padding-left: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${Tema.secondary.azulOpaco};
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulFrosting};
    background-color: transparent;
    color: white;
  }
  @media screen and (max-width: 500px) {
    flex-direction: column-reverse;
  }
`;
const Input = styled(InputSimpleEditable)`
  border-radius: 5px;
  outline: none;
  border: none;
  padding: 5px;
  display: block;

  border: none;
  outline: none;
  padding: 10px;
`;

const Texto = styled.p`
  margin-bottom: 4px;
`;
const BtnEjecutar = styled(BtnGeneralButton)`
  font-size: 1rem;
  display: inline-block;
  height: 30px;
  text-decoration: underline;
`;

const CajaImagen = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  width: 40%;
  height: 140px;

  border-radius: 8px;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
`;
const ImagenMostrar = styled.img`
  width: 60%;
  transform: translate(0, -15%);
`;

const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
