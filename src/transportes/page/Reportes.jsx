import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import ExportarExcel from "../../libs/ExportExcel";
import { OpcionUnica } from "../../components/OpcionUnica";
import ReportReq from "../pantallasReportes/ReportReq";
import { ClearTheme, Tema, Theme } from "../../config/theme";
import MenuPestannias from "../../components/MenuPestannias";
import CajaControles from "../pantallasReportes/CajaControles";
import ReportProy from "../pantallasReportes/ReportProy";

import { InputSimpleEditable } from "../../components/InputGeneral";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { BotonQuery } from "../../components/BotonQuery";
import { Alerta } from "../../components/Alerta";
import ReportVenta from "../pantallasReportes/ReportVenta";
import { CalificacionReview } from "../libs/DiccionarioNumberString";
import { obtenerDocPorId2 } from "../../libs/useDocByCondition";
import ColumnasReqExcel from "../libs/ColumnasReqExcel";

export default function Reportes({ setOpcionUnicaSelect, userMaster }) {
  // *************** RECURSOS GENERALES ***************
  const userAuth = useAuth().usuario;
  const [usuario, setUsuario] = useState(userAuth);
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  // *************** OPCIONES UNICAS ***************
  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Proyectos",
      code: "proyectos",
      opcion: 0,
      select: true,
    },
    {
      nombre: "Ventas",
      code: "ventas",
      opcion: 1,
      select: false,
    },
    // {
    //   nombre: "Pagos",
    //   code: "pagos",
    //   opcion: 2,
    //   select: false,
    // },
    {
      nombre: "General",
      code: "general",
      opcion: 3,
      select: false,
    },
  ]);
  const handleOpciones = (e) => {
    let index = Number(e.target.dataset.id);
    console.log(index);

    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };

  useEffect(() => {
    setOpcionUnicaSelect(
      <OpcionUnica
        titulo="Departamentos"
        name="pantallas"
        arrayOpciones={arrayOpciones}
        handleOpciones={handleOpciones}
      />
    );

    document.title = "Caeloss - Transporte";
    return () => {
      document.title = "Caeloss";
    };
  }, [arrayOpciones]);

  // *************** MENU PESTAÑAS RANGO FECHA ***************
  const [arrayOpcionesPesta, setArrayOpcionesPesta] = useState([
    {
      nombre: "Ult. 15 dias",
      qtyDias: 15,
      select: true,
    },
    {
      nombre: "Ult. 30 dias",
      qtyDias: 30,
      select: false,
    },
    {
      nombre: "Rango fecha",
      qtyDias: null,
      select: false,
    },
  ]);
  const [fechaInicial, setFechaInicial] = useState();
  const ahora = new Date();
  const [fechaFinal, setFechaFin] = useState(
    new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate(),
      23,
      59,
      59,
      999
    )
  );

  const handlePestannias = (e) => {
    let index = Number(e.target.dataset.id);
    setFechaInicial("");
    setFechaFin("");
    setArrayOpcionesPesta((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };
  useEffect(() => {
    if (arrayOpcionesPesta[0].select || arrayOpcionesPesta[1].select) {
      const fechaInicio = new Date();

      fechaInicio.setDate(
        fechaInicio.getDate() -
          arrayOpcionesPesta.find((rango) => rango.select).qtyDias +
          1
      ); // Restamos los días
      fechaInicio.setHours(0, 0, 0, 0); // Ajustamos a las 00:00
      setFechaInicial(fechaInicio);
      const ahora = new Date();
      const finDelDia = new Date(
        ahora.getFullYear(),
        ahora.getMonth(),
        ahora.getDate(),
        23,
        59,
        0,
        0
      );
      setFechaFin(finDelDia);
    } else if (arrayOpcionesPesta[2].select) {
      setFechaInicial("");
      setFechaFin("");
    }
  }, [arrayOpcionesPesta]);

  // ****************** CONTROLES **********************
  // ********** RECURSOS INPUTS **********
  const [arrayOpcionesMisReq, setArrayOpcionesMisReq] = useState([
    {
      nombre: "Mis solicitudes",
      opcion: 0,
      select: true,
    },
    {
      nombre: "Todas",
      opcion: 1,
      select: false,
    },
  ]);
  const handleOpcionesMisReq = (e) => {
    let index = Number(e.target.dataset.id);
    setArrayOpcionesMisReq((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };

  const initialValue = {
    numProy: "",
    search: "",
    status: "",
  };
  const [valueInput, setValueInput] = useState({ ...initialValue });

  const handleInputsControls = (e) => {
    const { name, value } = e.target;
    if (name == "numProy") {
      setValueInput((prevState) => ({
        ...prevState,
        numProy: value.toUpperCase(),
      }));
      return;
    }
    setValueInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [proyFixed, setProyFixed] = useState(false);

  // ****************** DOCUMENTOS SIN ESCUCHADOR **********************

  const [fechaDesdeInput, setFechaDesdeInput] = useState("");
  const [fechaHastaInput, setFechaHastaInput] = useState("");

  const handleFechas = (e) => {
    const { name, value } = e.target;
    const annio = value.slice(0, 4);
    const mes = value.slice(5, 7);
    const dia = value.slice(8, 10);

    if (name == "desde") {
      const fechaParsedES6 = new Date(
        Number(annio),
        Number(mes) - 1,
        Number(dia)
      );
      setFechaDesdeInput(value);
      // setFechaInicialES6(fechaParsedES6);
      setFechaInicial(fechaParsedES6);
    } else if (name == "hasta") {
      const fechaParsedES6 = new Date(
        Number(annio),
        Number(mes) - 1,
        Number(dia),
        23,
        59,
        59,
        999
      );

      setFechaHastaInput(value);
      // setFechaFinalES6(fechaParsedES6);
      setFechaFin(fechaParsedES6);
    }
  };

  // ****************** ARRAY BASE DE DATOS **********************
  const [dbProyetos, setDBProyectos] = useState([]);
  const [dbVentas, setDBVentas] = useState([]);

  const fetchGetDocs = async (
    collectionName,
    excel,
    fechaInicial,
    fechaFinal
  ) => {
    const opcionSeleccionada = arrayOpciones.find((opcion) => opcion.select);
    if (opcionSeleccionada.code == "proyectos" && !proyFixed) {
      setMensajeAlerta("Debe fijar un numero de proyecto.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }

    // Esta validacion se supone nunca debe ejecutarse
    if (opcionSeleccionada.code == "proyectos" && valueInput.numProy == "") {
      setMensajeAlerta("Coloque y fije numero de proyecto.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }

    if (fechaInicial == "" || fechaFinal == "") {
      console.log(7);
      setMensajeAlerta("Selecciona rango de fecha.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    if (!usuario) {
      return [];
    }

    // Si selecciono proyectos o ventas
    // if (arrayOpciones[0].select || arrayOpciones[1].select) {
    // Si selecciono ultimos 15 dias o ultimos 30dias
    // if (arrayOpcionesPesta[0].select || arrayOpcionesPesta[1].select) {

    console.log(fechaInicial);
    console.log(fechaFinal);
    const pantallaSelect = arrayOpciones.find((opcion) => opcion.select);
    console.log(pantallaSelect);
    try {
      let q;
      if (query) {
        q = query(
          collection(db, collectionName),

          // Puede seleccionar proyecto especifico o todos
          ...(valueInput.numProy != "Todos" &&
          pantallaSelect.code == "proyectos"
            ? [where("datosReq.numeroProyecto", "==", valueInput.numProy)]
            : []),
          where("fechaStamp", ">=", fechaInicial),
          where("fechaStamp", "<=", fechaFinal),
          ...(pantallaSelect.code != "general"
            ? [where("datosSolicitante.dpto", "==", pantallaSelect.nombre)]
            : []),
          // where(
          //   "datosSolicitante.dpto",
          //   "==",
          //   pantallaSelect.nombre
          // ),
          // Puede seleccionar mis solicitudes o todas
          ...(arrayOpcionesMisReq[0].select && pantallaSelect.code != "general"
            ? [where("datosSolicitante.userName", "==", userMaster.userName)]
            : [])
        );
      }
      console.log(userMaster);
      const consultaDB = await getDocs(q);

      const coleccion = consultaDB.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(coleccion);
      if (opcionSeleccionada.code == "proyectos") {
        setDBProyectos(coleccion);
      } else if (opcionSeleccionada.code == "ventas") {
        setDBVentas(coleccion);
      }

      if (excel) {
        const coleccionParsed = await Promise.all(
          coleccion.map(async (req) => {
            const reviewCliente = await obtenerDocPorId2(
              "reviewClientes",
              req.id
            );
            let reviewClienteParsed = {};
            if (reviewCliente) {
              reviewClienteParsed = {
                ...reviewCliente,
                puntuacion: CalificacionReview[reviewCliente.puntuacion],
              };
            }

            const calificacionesParsed = {
              ...req.calificaciones,
              resenniaVentas: {
                ...req.calificaciones.resenniaVentas,
                puntuacion:
                  CalificacionReview[
                    req.calificaciones.resenniaVentas.puntuacion
                  ],
              },
              resenniaCliente: reviewClienteParsed,
            };

            return {
              ...req,
              calificaciones: calificacionesParsed,
            };
          })
        );
        console.log(coleccionParsed);
        const coleccionParseada = coleccionParsed.map((req) => {
          return {
            ...req,
            datosEntrega: {
              ...req.datosEntrega,
              chofer: {
                ...req.datosEntrega.chofer,
                nombreCompleto:
                  req.datosEntrega.chofer.nombre +
                  " " +
                  req.datosEntrega.chofer.apellido,
              },
            },
          };
        });
        //
        console.log(coleccionParseada);
        ExportarExcel(coleccionParseada, ColumnasReqExcel);
      }
      return coleccion;
    } catch (error) {
      console.error("Error 1 con la base de datos:", error);
      setMensajeAlerta("Error 1 con la base de datos");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return [];
    }
  };

  const columnasPagos = [
    { header: "Numero", key: "numeroDoc", width: 10, ruta: "numeroDoc" },
    {
      header: "Usuario",
      key: "userName",
      width: 10,
      ruta: "datosSolicitante.userName",
    },
    { header: "Estado", key: "estadoDoc", width: 10, ruta: "estadoDoc" },
    { header: "Tipo", key: "tipo", width: 10, ruta: "tipo" },
    {
      header: "Cliente",
      key: "cliente",
      width: 20,
      ruta: "datosReq.socioNegocio",
    },
    { header: "Fecha", key: "fechaReq", width: 20, ruta: "fechaReq" },
    {
      header: "Dpto.",
      key: "dpto",
      width: 20,
      ruta: "datosSolicitante.dpto",
    },
    {
      header: "Costo",
      key: "costo",
      width: 20,
      ruta: "datosFlete.costo",
    },
    {
      header: "Precio",
      key: "precio",
      width: 20,
      ruta: "datosFlete.precio",
    },

    {
      header: "Nombre provincia destino",
      key: "nombreProvinciaDestino",
      width: 20,
      ruta: "datosFlete.provinciaSeleccionada.municipioSeleccionado.label",
    },
    {
      header: "Distancia",
      key: "distancia",
      width: 20,
      ruta: "datosFlete.distancia",
    },
    {
      header: "Punto de partida",
      key: "puntoPartida",
      width: 20,
      ruta: "datosFlete.puntoPartidaSeleccionado.nombreMunicipioOrigen",
    },
    {
      header: "Distancia manual",
      key: "distanciaManual",
      width: 20,
      ruta: "datosFlete.distanciaManualInputs",
    },
    //datos req

    {
      header: "Proyecto",
      key: "numeroProyecto",
      width: 20,
      ruta: "datosReq.numeroProyecto",
    },

    //calificaciones
    {
      header: "Calificacion solicitante",
      key: "calificacionSolicitante",
      width: 20,
      ruta: "calificaciones.resenniaVentas.puntuacion",
    },
    {
      header: "Reseña solicitante",
      key: "resenniaSolicitante",
      width: 20,
      ruta: "calificaciones.resenniaVentas.comentarios",
    },
    {
      header: "Calificacion Cliente",
      key: "calificacionCliente",
      width: 20,
      ruta: "calificaciones.resenniaClientes.puntuacion",
    },
    {
      header: "Reseña solicitante",
      key: "resenniaSolicitante",
      width: 20,
      ruta: "calificaciones.resenniaClientes.comentarios",
    },
    {
      header: "Tel cliente calificador",
      key: "telClienteCalificado",
      width: 20,
      ruta: "calificaciones.resenniaClientes.numero",
    },
    // contabilidad
    {
      header: "Pago aprobado por logistica",
      key: "pagoAprobadologistica",
      width: 20,
      ruta: "contabilidad.log.logistica1.usuario.userName",
    },
    {
      header: "Pago aprobado por solicitante",
      key: "pagoAprobadoContabilidad",
      width: 20,
      ruta: "contabilidad.log.solicitante2.usuario.userName",
    },
    {
      header: "Pago aprobado por contabilidad",
      key: "pagoAprobadoContabilidad",
      width: 20,
      ruta: "contabilidad.log.finanzas3.usuario.userName",
    },
    {
      header: "Monto Pago chofer",
      key: "montoPagoChofer",
      width: 20,
      ruta: "contabilidad.montoPagarChofer",
    },
    {
      header: "Monto Pago ayudante",
      key: "montoPagoAyudante",
      width: 20,
      ruta: "contabilidad.montoPagarAyudante",
    },
    {
      header: "Status pago",
      key: "statusPago",
      width: 20,
      ruta: "contabilidad.statusPagoChofer",
    },
  ];

  const traerDatosXDptop = (conExcel) => {
    fetchGetDocs("transferRequest", conExcel, fechaInicial, fechaFinal);
  };
  return (
    <>
      {
        // arrayOpciones[2].select
        arrayOpciones.find((opcion) => opcion.select).code !== "general" &&
          arrayOpciones.find((opcion) => opcion.select).code !== "pagos" && (
            <>
              <BotonQuery fechaInicial={fechaInicial} fechaFinal={fechaFinal} />
              <ContainerTipo>
                <MenuPestannias
                  handlePestannias={handlePestannias}
                  arrayOpciones={arrayOpcionesPesta}
                />
              </ContainerTipo>
              {arrayOpcionesPesta[2].select && (
                <ContainerMain>
                  <CajaDatePicker>
                    <CajitaDate>
                      <DatePicker
                        type="date"
                        name="desde"
                        value={fechaDesdeInput}
                        onChange={(e) => handleFechas(e)}
                      />
                      {/* <Guion>Desde</Guion> */}
                    </CajitaDate>
                    <Guion>-</Guion>
                    <CajitaDate>
                      <DatePicker
                        type="date"
                        name="hasta"
                        value={fechaHastaInput}
                        onChange={(e) => handleFechas(e)}
                      />
                      {/* <Guion>Hasta</Guion> */}
                    </CajitaDate>
                  </CajaDatePicker>
                </ContainerMain>
              )}

              <CajaControles
                fetchGetDocs={fetchGetDocs}
                traerDatosXDptop={traerDatosXDptop}
                handleInputs={handleInputsControls}
                arrayOpcionesMisReq={arrayOpcionesMisReq}
                handleOpcionesMisReq={handleOpcionesMisReq}
                setArrayOpcionesMisReq={setArrayOpcionesMisReq}
                valueInput={valueInput}
                proyFixed={proyFixed}
                setProyFixed={setProyFixed}
                setValueInput={setValueInput}
                arrayOpciones={arrayOpciones}
              />
            </>
          )
      }

      <ContainerMain className={Theme.config.modoClear ? "clearModern" : ""}>
        {arrayOpciones.find((opcion) => opcion.select).code == "proyectos" && (
          <CajaTipo>
            <ReportProy userMaster={userMaster} datos={dbProyetos} />
          </CajaTipo>
        )}
        {arrayOpciones.find((opcion) => opcion.select).code == "ventas" && (
          <CajaTipo>
            <ReportVenta userMaster={userMaster} datos={dbVentas} />
          </CajaTipo>
        )}

        {arrayOpciones.find((opcion) => opcion.select).code == "general" && (
          <CajaTipo>
            <Titulo>Reporte de solicitudes</Titulo>
            <ReportReq
              userMaster={userMaster}
              columnas={ColumnasReqExcel}
              fetchGetDocs={fetchGetDocs}
            />
          </CajaTipo>
        )}

        {/* {arrayOpciones.find((opcion) => opcion.select).code == "pagos" && (
          <CajaTipo>
            <Titulo>Reporte de pagos</Titulo>
            <ReportReq
              userMaster={userMaster}
              columnas={columnasPagos}
              fetchGetDocs={fetchGetDocs}
            />
          </CajaTipo>
        )} */}
      </ContainerMain>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
}
const ContainerMain = styled.div`
  width: 100%;
  /* border: 1px solid red */
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: ${Tema.primary.azulBrillante};
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulFrosting};
    backdrop-filter: blur(3px);
    color: white;
  }
`;
const CajaTipo = styled.div`
  width: 100%;
`;
const Titulo = styled.h2`
  text-decoration: underline;
  margin-left: 20px;
  font-weight: 400;
`;
const ContainerTipo = styled.div`
  margin-bottom: 15px;
`;

const BtnSimple = styled(BtnGeneralButton)``;

const TextoH3 = styled.h3`
  color: ${Tema.primary.azulBrillante};
  text-decoration: underline;
  font-weight: lighter;
  margin-bottom: 15px;
  color: white;
`;
const CajaDatePicker = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
const Guion = styled.h3`
  color: ${Tema.primary.azulBrillante};
  font-weight: 1rem;
  font-weight: lighter;
  color: white;
`;

const CajitaDate = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const DatePicker = styled(InputSimpleEditable)`
  margin: 0 15px;
  font-size: 1rem;
  height: 30px;
  outline: none;
  padding: 10px;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.fijado {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
  &:hover {
    cursor: pointer;
  }
`;
