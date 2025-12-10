import { useState, useEffect } from "react";
import styled from "styled-components";
import { ControlesTablas } from "../components/ControlesTablas.jsx";
import { CardReq } from "../components/CardReq.jsx";
import { BotonQuery } from "../../components/BotonQuery.jsx";

import {
  collection,
  query,
  where,
  onSnapshot,
  or,
  getDocs,
} from "firebase/firestore";
import db from "../../firebase/firebaseConfig.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { ES6AFormat } from "../../libs/FechaFormat.jsx";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  Enlace,
  FilasGroup,
  ParrafoAction,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla.jsx";
import {
  obtenerDocPorId2,
  useDocByCondition,
} from "../../libs/useDocByCondition.js";
import { formatoDOP } from "../../libs/StringParsed.jsx";
import { Alerta } from "../../components/Alerta.jsx";
import { ModalLoading } from "../../components/ModalLoading.jsx";
import ModalGeneral from "../../components/ModalGeneral.jsx";
import { BtnGeneralButton } from "../../components/BtnGeneralButton.jsx";
import { useNavigate } from "react-router-dom";

export default function Pagos({ userMaster }) {
  const datosMolde = {
    choferTraer: 0,
  };
  // // ******************** RECURSOS GENERALES ******************** //
  const navigate = useNavigate();
  if (!userMaster.permisos.includes("readPayDriverTMS")) {
    navigate("/transportes/");
  }
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [datosParseados, setDatosParseados] = useState(false);

  const userAuth = useAuth().usuario;

  const [usuario, setUsuario] = useState(userAuth);
  const fetchGetDocs = async (collectionName, setState) => {
    if (usuario) {
      console.log("DB 😐😐😐😐😐" + collectionName);

      const fechaHoyFinal = new Date();
      fechaHoyFinal.setHours(23, 59, 59, 999);
      const ayerInicial = new Date();
      ayerInicial.setDate(fechaHoyFinal.getDate() - 14);
      ayerInicial.setHours(0, 0, 0, 0);
      const q = query(
        collection(db, collectionName),
        where("createdAdStamp", ">=", ayerInicial),
        where("createdAdStamp", "<=", fechaHoyFinal)
      );

      try {
        const consultaDB = await getDocs(q);

        const coleccion = consultaDB.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setState(coleccion);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const [listaPagos, setListaPagos] = useState([]);
  useEffect(() => {
    fetchGetDocs("pagosChoferes", setListaPagos);
  }, []);

  const [controles, setControles] = useState({
    search: {
      nombre: "Buscar",
      name: "valueSearch",
      active: true,
    },
  });

  //
  //
  //
  useDocByCondition;
  const initialDatosModal = {
    nombreChofer: "",
    listaPagos: [],
  };
  const [datosModal, setDatosModal] = useState({ ...initialDatosModal });
  const [hasModal, setHasModal] = useState(false);
  const [pagoSelect, setPagoSelect] = useState({});
  const verElementos = async (pago) => {
    console.log(pago);
    setPagoSelect(pago);
    const doChofer = await obtenerDocPorId2("choferes", pago.beneficiario.id);
    setDatosModal((prevState) => ({
      ...prevState,
      listaPagos: pago.elementos,
      choferSelect: doChofer,
    }));
    console.log(doChofer);
    setHasModal(true);
  };

  const [isLoading, setIsLoading] = useState(false);
  return (
    <ContainerMaster>
      <BotonQuery />
      <ContainerControles>
        <ControlesTablas
          titulo={"Ultimos pagos realizados"}
          controles={controles}
          tipo={"pagosMain"}
        />
      </ContainerControles>
      <CajaTabla>
        <Tabla>
          <thead>
            <Filas className="cabeza">
              <CeldasHead>N°</CeldasHead>
              <CeldasHead>Numero</CeldasHead>
              <CeldasHead>Beneficiario</CeldasHead>
              <CeldasHead>Fecha</CeldasHead>
              <CeldasHead>Monto total</CeldasHead>
              <CeldasHead>Elementos</CeldasHead>
            </Filas>
          </thead>
          <tbody>
            {listaPagos.map((pay, index) => {
              return (
                <Filas key={index} className="body impar">
                  <CeldasBody>{index + 1}</CeldasBody>
                  <CeldasBody>
                    {" "}
                    <Enlace
                      target="_blank"
                      to={"/transportes/maestros/pagos/" + pay.numeroDoc}
                    >
                      {pay.numeroDoc}
                    </Enlace>
                  </CeldasBody>
                  <CeldasBody>
                    {pay.beneficiario.nombre + " " + pay.beneficiario.apellido}
                  </CeldasBody>
                  <CeldasBody>{pay.createdAd.slice(0, 10)}</CeldasBody>
                  <CeldasBody>
                    {formatoDOP(
                      pay.elementos.reduce(
                        (acumulador, item) => acumulador + item.costoInterno,
                        0
                      )
                    )}
                  </CeldasBody>

                  <CeldasBody>
                    <ParrafoAction onClick={() => verElementos(pay)}>
                      👁️
                    </ParrafoAction>
                  </CeldasBody>
                </Filas>
              );
            })}
          </tbody>
        </Tabla>
      </CajaTabla>

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {hasModal && (
        <ModalGeneral
          setHasModal={setHasModal}
          titulo={
            "Desglose del pago N° " +
            pagoSelect.numeroDoc +
            " de " +
            datosModal.choferSelect.nombre +
            " "
          }
          childrenFooter={
            <CajaFinalModal>
              <CajaTotalModal>
                <TotalModal>
                  Sumatoria total: {"\n"}
                  {datosMolde.choferTraer === 0
                    ? formatoDOP(
                        datosModal.listaPagos.reduce(
                          (acumulador, item) => acumulador + item.costoInterno,
                          0
                        )
                      )
                    : formatoDOP(
                        datosModal.listaPagos.reduce(
                          (acumulador, item) => acumulador + item.monto,
                          0
                        )
                      )}
                </TotalModal>
              </CajaTotalModal>
            </CajaFinalModal>
          }
        >
          <WrapPagosAprobados>
            <BotonQuery listaPados={datosModal} />
            <CajaTablaGroup2>
              <TablaGroup>
                <thead>
                  <FilasGroup className="cabeza">
                    <CeldaHeadGroup>N°</CeldaHeadGroup>
                    <CeldaHeadGroup>Solicitud</CeldaHeadGroup>
                    <CeldaHeadGroup>Cliente</CeldaHeadGroup>
                    <CeldaHeadGroup>Monto</CeldaHeadGroup>
                    <CeldaHeadGroup>Fecha</CeldaHeadGroup>
                    <CeldaHeadGroup>Solicitante</CeldaHeadGroup>
                  </FilasGroup>
                </thead>
                <tbody>
                  {datosModal.listaPagos.map((pago, index) => {
                    return (
                      <FilasGroup className="body" key={index}>
                        <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                        <CeldasBodyGroup>
                          <Enlace
                            target="_blank"
                            to={
                              "/transportes/maestros/solicitudes/" +
                              pago.datosSolicitud.numeroReq
                            }
                          >
                            {pago.datosSolicitud.numeroReq}
                          </Enlace>
                        </CeldasBodyGroup>
                        <CeldasBodyGroup className="startText">
                          {pago.datosSolicitud.cliente}
                        </CeldasBodyGroup>
                        <CeldasBodyGroup>
                          {datosMolde.choferTraer === 0
                            ? pago.costoInterno
                            : pago.monto}
                        </CeldasBodyGroup>
                        <CeldasBodyGroup>
                          {pago.datosSolicitud.fechaSolicitud.slice(0, 10)}
                        </CeldasBodyGroup>

                        <CeldasBodyGroup>
                          {pago.datosSolicitud.nombreSolicitante}
                        </CeldasBodyGroup>
                      </FilasGroup>
                    );
                  })}
                </tbody>
              </TablaGroup>
            </CajaTablaGroup2>
          </WrapPagosAprobados>
        </ModalGeneral>
      )}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      {isLoading ? <ModalLoading completa={true} /> : ""}
    </ContainerMaster>
  );
}
const ContainerMaster = styled.div`
  position: relative;
`;
const ContainerControles = styled.div`
  margin-bottom: 5px;
`;
const ContainerCard = styled.div`
  padding: 0 10px;
`;
const CajaTabla = styled(CajaTablaGroup)``;
const Tabla = styled(TablaGroup)``;
const Filas = styled(FilasGroup)``;
const CeldasHead = styled(CeldaHeadGroup)``;
const CeldasBody = styled(CeldasBodyGroup)``;
const CajaFinalModal = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;
const CajaTotalModal = styled.div`
  height: 100%;
  text-align: center;
  align-content: center;
`;
const TotalModal = styled.h2`
  height: auto;

  color: white;
  font-weight: 400;
  border: 1px solid white;
  padding: 8px;
`;
const CajaTablaGroup2 = styled(CajaTablaGroup)`
  border: none;
`;
const BtnSimple = styled(BtnGeneralButton)``;
const WrapPagosAprobados = styled.div`
  width: 100%;
`;
