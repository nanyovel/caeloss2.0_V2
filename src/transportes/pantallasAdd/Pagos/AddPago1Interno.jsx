import { useEffect, useState } from "react";
import styled from "styled-components";
import CardPagoChofer from "../../components/CardPagoChofer";
import { BtnGeneralButton } from "../../../components/BtnGeneralButton";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  Enlace,
  FilasGroup,
  TablaGroup,
} from "../../../components/JSXElements/GrupoTabla";
import ModalGeneral from "../../../components/ModalGeneral";
import { formatoDOP } from "../../../libs/StringParsed";
import { Alerta } from "../../../components/Alerta";
import { BotonQuery } from "../../../components/BotonQuery";
import { pagoPadreSchema } from "../../schemas/pagoSchema";
import { concatenarIDPADRE, generarUUID } from "../../../libs/generarUUID";
import { collection, doc, Timestamp, writeBatch } from "firebase/firestore";
import db from "../../../firebase/firebaseConfig";
import { ES6AFormat } from "../../../libs/FechaFormat";
import { ModalLoading } from "../../../components/ModalLoading";
import { useDocById } from "../../../libs/useDocByCondition";
import { reqPagada } from "../../libs/reqPagada";
import { isAllPayExecuted } from "../../libs/isAllPayExecuted";
import {
  InputSimpleEditable,
  TextArea,
} from "../../../components/InputGeneral";

export default function AddPago1Interno({
  listaReqParsed,
  listaChoferesParsed,
  datosMolde,
  userMaster,
}) {
  // *************** CONFIG GENERAL *******************

  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [choferesLocal, setChoferesLocal] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const choferesAux = listaChoferesParsed;
    // const choferesAux = listaChoferesParsed.filter(
    //   (chofer) => chofer.tipo == datosMolde.choferTraer
    // );
    console.log(choferesAux);

    setChoferesLocal(choferesAux);
  }, [listaReqParsed, listaChoferesParsed]);
  //
  const initialDatosModal = {
    nombreChofer: "",
    listaPagos: [],
  };
  const [datosModal, setDatosModal] = useState({ ...initialDatosModal });
  const [hasModal, setHasModal] = useState(false);

  const verPagos = (chofer) => {
    if (chofer.pagosAux.length > 0) {
      setHasModal(true);

      setDatosModal((prevState) => ({
        ...prevState,
        listaPagos: chofer.pagosAux,
        choferSelect: chofer,
      }));
    } else {
      setMensajeAlerta("Chofer sin pagos aprobados.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
  };

  // Dime el ultimo numero del contador
  const [contadorNumeroDoc, setContadorNumeroDoc] = useState({});
  useDocById("counters", setContadorNumeroDoc, "numberPagosChofer");

  const contadorUpdate = doc(db, "counters", "numberPagosChofer");
  const nuevoNumero = contadorNumeroDoc.lastNumber + 1;

  const crearPagos = async (listaPagos) => {
    const hasPermission = userMaster.permisos.includes("createPayDriverTMS");
    if (!hasPermission) {
      setMensajeAlerta("No tienes permisosssss para crear pagos.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    const pagosChoferesCollection = collection(db, "pagosChoferes");
    const nuevaRef = doc(pagosChoferesCollection);

    const idPagoPadre = nuevaRef.id;

    const listaPagosConIds = listaPagos.map((pago) => {
      return {
        ...pago,
        id: concatenarIDPADRE(nuevaRef.id),
        idPagoPadre: idPagoPadre,
      };
    });
    const batch = writeBatch(db);

    try {
      const { listaPagosParsed, warning, idsElementosActualizados } = reqPagada(
        {
          listaPagos: listaPagosConIds,
          userMaster: userMaster,
          numPagoPadre: nuevoNumero,
        }
      );
      // console.log(listaPagosParsed);
      if (warning) {
        console.warn("****CAELOSS**** : error en componente reqPagada.js");
        setMensajeAlerta(" Error de incoherencia.");

        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }

      console.log("llego");
      // return;
      batch.update(contadorUpdate, {
        lastNumber: nuevoNumero,
      });
      const nuevoPago = {
        ...pagoPadreSchema,
        elementos: listaPagosParsed,
        beneficiario: {
          nombre: datosModal.choferSelect.nombre,
          apellido: datosModal.choferSelect.apellido,
          id: datosModal.choferSelect.id,
          tipo: datosModal.choferSelect.tipo,
          numeroDoc: datosModal.choferSelect.numeroDoc,
          urlFotoPerfil: datosModal.choferSelect.urlFotoPerfil,
        },
        createdAd: ES6AFormat(new Date()),
        createdAdStamp: Timestamp.fromDate(new Date()),
        createdBy: userMaster.userName,
        idsReqsUtilizadas: listaPagos.map((pay) => pay.datosSolicitud.idReq),
        numeroDoc: nuevoNumero,
        comentarios: inputComentario,
      };

      batch.set(nuevaRef, { ...nuevoPago });

      // 2-Actualizar las solicitudes utilizadas
      listaPagosParsed.forEach((pay) => {
        const reqThisPago = pay.solicitudAux;
        // ******** DETEN EL PROCESO SI:********
        // No proceder:
        let detenerProceso = false;
        // 1-Ayudante adicional sin aprobar
        reqThisPago.datosFlete.ayudantesAdicionales.forEach((ayudAdd) => {
          if (ayudAdd.status !== 1) {
            console.warn("**CAELOSS:** Ayudante adicional sin aprobar.");
            detenerProceso = true;
          }
        });
        reqThisPago.datosFlete.vehiculosAdicionales.forEach((vehiAdd) => {
          vehiAdd.ayudantesAdicionales.forEach((ayudAdd) => {
            if (ayudAdd.status !== 1) {
              console.warn("**CAELOSS:** Ayudante adicional sin aprobar.");
              detenerProceso = true;
            }
          });
        });

        // Estado de la solicitud diferente a concluida
        if (reqThisPago.estadoDoc !== 3) {
          detenerProceso = true;
          console.warn(
            "**CAELOSS:** Estado de la solicitud diferente a concluida."
          );
        }
        // Falta aprobaciones de pagos
        if (
          reqThisPago.contabilidad.log.logistica1.status != 1 ||
          reqThisPago.contabilidad.log.solicitante2.status != 1 ||
          reqThisPago.contabilidad.log.finanzas3.status != 1
        ) {
          detenerProceso = true;
          console.warn("**CAELOSS:** Faltan aprobaciones APS.");
        }

        if (detenerProceso) {
          setMensajeAlerta("Error interno al crear el pago AddPago1.");
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
          return;
        }

        // console.log(reqThisPago);
        const reqActualizar = doc(db, "transferRequest", reqThisPago.id);
        // Esto lo hago desde un array aparte (idsElementosActualizados) para mayor seguridad aunque sea algo redundante, pero me da confianza de que solo se actualizada una solicitud que realmente se le halla aplicado el pago
        const pagoColocado = idsElementosActualizados.find(
          (id) => id.id === pay.id
        );
        if (pagoColocado) {
          // Si es chofer principal
          if (pagoColocado.codigoElementoOrigen === "ElOG1") {
            // Confirmar que es el mismo id de la orden
            if (
              pagoColocado.idElementoOrigen ===
              reqThisPago.datosFlete.idCamionComoElemento
            ) {
              // Confirmar que es la orden correcta esto se que es redundante
              if (pagoColocado.idReq === reqThisPago.id) {
                // Si es chofer interno
                if (reqThisPago.datosEntrega.chofer.tipo === 0) {
                  batch.update(reqActualizar, {
                    "datosFlete.detallesPago.choferInterno":
                      reqThisPago.datosFlete.detallesPago.choferInterno,
                  });
                }
                // Si es chofer externo
                else if (
                  reqThisPago.datosEntrega.chofer.tipo === 1 ||
                  reqThisPago.datosEntrega.chofer.tipo === 2
                ) {
                  batch.update(reqActualizar, {
                    "datosFlete.detallesPago.camionExterno":
                      reqThisPago.datosFlete.detallesPago.camionExterno,
                  });
                }
              }
            }
          }
          // Si es ayudante chofer principal
          if (pagoColocado.codigoElementoOrigen === "ElOG2") {
            batch.update(reqActualizar, {
              "datosFlete.detallesPago.ayudanteInterno":
                reqThisPago.datosFlete.detallesPago.ayudanteInterno,
            });
          }

          // Si es ayudante adicional chofer principal
          if (pagoColocado.codigoElementoOrigen === "ElOG3") {
            batch.update(reqActualizar, {
              "datosFlete.ayudantesAdicionales":
                reqThisPago.datosFlete.ayudantesAdicionales,
            });
          }
          if (
            // Si es chofer adicional
            pagoColocado.codigoElementoOrigen === "ElOG4" ||
            // Si es ayudante de algun chofer adicional
            pagoColocado.codigoElementoOrigen === "ElOG5" ||
            // Si es ayudante adicional de chofer adicional
            pagoColocado.codigoElementoOrigen === "ElOG6"
          ) {
            batch.update(reqActualizar, {
              "datosFlete.vehiculosAdicionales":
                reqThisPago.datosFlete.vehiculosAdicionales,
            });
          }
          const reqAllPay = isAllPayExecuted(reqThisPago);
          console.log(reqAllPay);
          if (reqAllPay) {
            batch.update(reqActualizar, {
              "contabilidad.allPaymentsMade": reqAllPay,
            });
          }

          // Verifica si la solicitud tiene todos los pagos realizados
        }
      });

      // return;
      console.log(listaPagosParsed);
      batch.commit();
      setInputComentario("");
      setMensajeAlerta("Pago creado correctamente.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      setIsLoading(false);
      setHasModal(false);
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      setIsLoading(false);
    }
  };

  const [inputComentario, setInputComentario] = useState("");
  return (
    <Container>
      {choferesLocal
        .filter((chofer) => chofer.tipo == datosMolde.choferTraer)
        .map((chofer, index) => {
          return (
            <CardPagoChofer
              key={index}
              chofer={chofer}
              verPagos={verPagos}
              datosMolde={datosMolde}
            />
          );
        })}

      {hasModal && (
        <ModalGeneral
          setHasModal={setHasModal}
          titulo={
            "Lista de montos aprobados de " +
            datosModal.choferSelect.nombre +
            " " +
            datosModal.choferSelect.apellido
          }
          childrenFooter={
            <ContenedorFinalModal>
              <CajaComentarioParo>
                <ParrafoComentario>Comentarios:</ParrafoComentario>
                <InputTextArea
                  value={inputComentario}
                  onChange={(e) => setInputComentario(e.target.value)}
                />
              </CajaComentarioParo>
              <CajaFinalModal>
                <CajaTotalModal>
                  <TotalModal>
                    Sumatoria total: {"\n"}
                    {datosMolde.choferTraer === 0
                      ? formatoDOP(
                          datosModal.listaPagos.reduce(
                            (acumulador, item) =>
                              acumulador + item.costoInterno,
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
                {userMaster.permisos.includes("createPayDriverTMS") ? (
                  <BtnSimple onClick={() => crearPagos(datosModal.listaPagos)}>
                    Crear pago
                  </BtnSimple>
                ) : (
                  <BtnSimple
                    onClick={() =>
                      setMensajeAlerta(
                        "No tienes permisos para crear pagos."
                      ) ||
                      setTipoAlerta("warning") ||
                      setDispatchAlerta(true) ||
                      setTimeout(() => setDispatchAlerta(false), 3000)
                    }
                  >
                    Crear pago
                  </BtnSimple>
                )}
              </CajaFinalModal>
            </ContenedorFinalModal>
          }
        >
          <WrapPagosAprobados>
            <BotonQuery datosModal={datosModal} />
            <CajaTablaGroup2>
              <TablaGroup>
                <thead>
                  <FilasGroup className="cabeza">
                    <CeldaHeadGroup>N°</CeldaHeadGroup>
                    <CeldaHeadGroup>Solicitud</CeldaHeadGroup>
                    <CeldaHeadGroup>Cliente</CeldaHeadGroup>
                    <CeldaHeadGroup>Rol</CeldaHeadGroup>
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
                        <CeldasBodyGroup className="startText">
                          {pago.descripcionViajesInternos}
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
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  min-height: 200px;
`;

const WrapPagosAprobados = styled.div`
  width: 100%;
`;
const BtnSimple = styled(BtnGeneralButton)``;
const CajaFinalModal = styled.div`
  width: 60%;
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
const PCelda = styled.p`
  border: 1px solid red;
`;
const ContenedorFinalModal = styled.div`
  width: 100%;
  /* flex-direction: column; */
  display: flex;
  align-items: center;
`;
const CajaComentarioParo = styled.div`
  width: 40%;
  min-height: 50px;
`;
const ParrafoComentario = styled.p`
  color: white;
  font-weight: 400;
`;
const InputTextArea = styled(TextArea)`
  height: 40px;
  min-height: 10px;
  max-height: 60px;
`;
