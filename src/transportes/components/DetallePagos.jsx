import React, { useEffect } from "react";
import styled from "styled-components";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  Enlace,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla";
import { fechaHora } from "../../libs/StringParsed";
import { BotonQuery } from "../../components/BotonQuery";

export default function DetallePagos({ requestMaster }) {
  // const datosParsed=requestMaster.contabilidad
  // Alimentar datos elemtos de pagos
  const [listaPagos, setListaPagos] = React.useState([]);
  useEffect(() => {
    class DatosPago {
      constructor(tipo, nombre, apellido, monto, numPagoPadre) {
        (this.tipo = tipo),
          (this.nombre = nombre),
          (this.apellido = apellido),
          (this.monto = monto),
          (this.numPagoPadre = numPagoPadre);
      }
    }
    const listaPagosParsed = [];

    // Camion principal - ElOG1
    const choferPrincipal = new DatosPago(
      "Camion principal",
      requestMaster.datosEntrega.chofer.nombre,
      requestMaster.datosEntrega.chofer.apellido,
      requestMaster.datosFlete.detallesPago.choferInterno.monto ||
        requestMaster.datosFlete.detallesPago.camionExterno.monto,
      requestMaster.datosFlete.detallesPago.choferInterno.numPagoPadre ||
        requestMaster.datosFlete.detallesPago.camionExterno.numPagoPadre
    );

    listaPagosParsed.push(choferPrincipal);
    //
    // Ayudante principal - ElOG2
    const ayudantePrincipal = new DatosPago(
      "Ayudante camion principal",
      requestMaster.datosEntrega.ayudante.nombre,
      requestMaster.datosEntrega.ayudante.apellido,
      requestMaster.datosFlete.detallesPago.ayudanteInterno.monto,
      requestMaster.datosFlete.detallesPago.ayudanteInterno.numPagoPadre
    );
    if (requestMaster.datosEntrega.ayudante.id) {
      listaPagosParsed.push(ayudantePrincipal);
    }
    //
    // Ayudantes adicionales camion principal - ElOG3
    requestMaster.datosFlete.ayudantesAdicionales.forEach((ayudAdd) => {
      const ayudanteAdicional = new DatosPago(
        "Ayudante adicional camion principal",
        ayudAdd.datosAyudante.nombre,
        ayudAdd.datosAyudante.apellido,
        ayudAdd.detallesPago.monto,
        ayudAdd.detallesPago.numPagoPadre
      );
      listaPagosParsed.push(ayudanteAdicional);
    });
    //
    // Camiones adicionales camion principal - ElOG4
    requestMaster.datosFlete.vehiculosAdicionales.forEach((vehAdd) => {
      const ayudanteAdicional = new DatosPago(
        "Camion adicional",
        vehAdd.datosEntrega.chofer.nombre,
        vehAdd.datosEntrega.chofer.apellido,
        vehAdd.detallesPago.choferInterno.monto ||
          vehAdd.detallesPago.camionExterno.monto,
        vehAdd.detallesPago.choferInterno.numPagoPadre ||
          vehAdd.detallesPago.camionExterno.numPagoPadre
      );
      listaPagosParsed.push(ayudanteAdicional);
    });
    //
    // Ayudante camion adicional - ElOG5
    requestMaster.datosFlete.vehiculosAdicionales.forEach((vehAdd) => {
      const ayudanteAdicional = new DatosPago(
        "Ayudante camion adicional",
        vehAdd.datosEntrega.ayudante.nombre,
        vehAdd.datosEntrega.ayudante.apellido,
        vehAdd.detallesPago.ayudanteInterno.monto,
        vehAdd.detallesPago.ayudanteInterno.numPagoPadre
      );
      if (vehAdd.datosEntrega.ayudante.id) {
        listaPagosParsed.push(ayudanteAdicional);
      }
    });
    //
    // Ayudantes adicionales camion adicional - ElOG6
    requestMaster.datosFlete.vehiculosAdicionales.forEach((vehAdd) => {
      vehAdd.ayudantesAdicionales.forEach((ayudAdd) => {
        const ayudanteAdicional = new DatosPago(
          "Ayudante adicional camion adicional",
          ayudAdd.datosAyudante.nombre,
          ayudAdd.datosAyudante.apellido,
          ayudAdd.detallesPago.monto,
          ayudAdd.detallesPago.numPagoPadre
        );
        listaPagosParsed.push(ayudanteAdicional);
      });
    });
    setListaPagos(listaPagosParsed);
  }, [requestMaster]);
  return (
    <Container>
      <WrapSection>
        <Titulo>Aprobaciones de pagos</Titulo>
        <CajaTabla>
          <Tabla>
            <thead>
              <Fila className="cabeza">
                <CeldaHead>N°</CeldaHead>
                <CeldaHead>Tipo</CeldaHead>
                <CeldaHead>Status</CeldaHead>
                <CeldaHead>Fecha</CeldaHead>
                <CeldaHead>Usuaio</CeldaHead>
              </Fila>
            </thead>
            <tbody>
              <Fila className="body">
                <CeldaBody>1</CeldaBody>
                <CeldaBody>Aprobacion Logistica</CeldaBody>
                <CeldaBody>
                  {requestMaster.contabilidad.log.logistica1.status == 0
                    ? "Sin procesar"
                    : requestMaster.contabilidad.log.logistica1.status == 1
                      ? "Aprobado ✅"
                      : requestMaster.contabilidad.log.logistica1.status == 2
                        ? "Rechazado ❌"
                        : ""}
                </CeldaBody>
                <CeldaBody>
                  {fechaHora(requestMaster.contabilidad.log.logistica1.fecha)}
                </CeldaBody>
                <CeldaBody>
                  {requestMaster.contabilidad.log.logistica1.usuario.userName}
                </CeldaBody>
              </Fila>

              <Fila className="body impar">
                <CeldaBody>2</CeldaBody>
                <CeldaBody>Aprobacion Solicitante</CeldaBody>
                <CeldaBody>
                  {requestMaster.contabilidad.log.solicitante2.status == 0
                    ? "Sin procesar"
                    : requestMaster.contabilidad.log.solicitante2.status == 1
                      ? "Aprobado ✅"
                      : requestMaster.contabilidad.log.solicitante2.status == 2
                        ? "Rechazado ❌"
                        : ""}
                </CeldaBody>
                <CeldaBody>
                  {fechaHora(requestMaster.contabilidad.log.solicitante2.fecha)}
                </CeldaBody>
                <CeldaBody>
                  {requestMaster.contabilidad.log.solicitante2.usuario.userName}
                </CeldaBody>
              </Fila>
              <Fila className="body">
                <CeldaBody>3</CeldaBody>
                <CeldaBody>Aprobacion Finanzas</CeldaBody>
                <CeldaBody>
                  {requestMaster.contabilidad.log.finanzas3.status == 0
                    ? "Sin procesar"
                    : requestMaster.contabilidad.log.finanzas3.status == 1
                      ? "Aprobado ✅"
                      : requestMaster.contabilidad.log.finanzas3.status == 2
                        ? "Rechazado ❌"
                        : ""}
                </CeldaBody>
                <CeldaBody>
                  {fechaHora(requestMaster.contabilidad.log.finanzas3.fecha)}
                </CeldaBody>
                <CeldaBody>
                  {requestMaster.contabilidad.log.finanzas3.usuario.userName}
                </CeldaBody>
              </Fila>
            </tbody>
          </Tabla>
        </CajaTabla>
      </WrapSection>
      <WrapSection>
        <Titulo>Elementos de pagos</Titulo>
        <BotonQuery listaPagos={listaPagos} />
        <CajaTablaDosColumnas>
          <CajaTabla>
            <Tabla>
              <thead>
                <Fila className="cabeza">
                  <CeldaHead>N°</CeldaHead>
                  <CeldaHead>Tipo</CeldaHead>
                  <CeldaHead>Nombre</CeldaHead>
                  <CeldaHead>Monto</CeldaHead>
                  <CeldaHead>N° pago*</CeldaHead>
                </Fila>
              </thead>
              <tbody>
                {listaPagos.map((el, index) => {
                  return (
                    <Fila
                      key={index}
                      className={index % 2 === 0 ? "body" : "body impar"}
                    >
                      <CeldaBody>{index + 1}</CeldaBody>
                      <CeldaBody className="startText">{el.tipo}</CeldaBody>
                      <CeldaBody>
                        {el.nombre} {el.apellido}
                      </CeldaBody>
                      <CeldaBody>{el.monto}</CeldaBody>
                      <CeldaBody>
                        {el.numPagoPadre ? (
                          <Enlace
                            to={`/transportes/maestros/pagos/${el.numPagoPadre}`}
                            target="_blank"
                          >
                            {el.numPagoPadre}
                          </Enlace>
                        ) : (
                          "Sin ejecutar"
                        )}
                      </CeldaBody>
                    </Fila>
                  );
                })}
                {/* Chofer principal */}
              </tbody>
            </Tabla>
          </CajaTabla>
        </CajaTablaDosColumnas>
      </WrapSection>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  min-height: 100px;
`;
const WrapSection = styled.div``;
const Titulo = styled.h2`
  width: 100%;
  text-align: center;
  color: white;
  margin-top: 15px;
`;
const CajaTabla = styled(CajaTablaGroup)`
  border: none;
`;
const Tabla = styled(TablaGroup)``;
const Fila = styled(FilasGroup)``;
const CeldaHead = styled(CeldaHeadGroup)``;
const CeldaBody = styled(CeldasBodyGroup)``;
const CajaTablaDosColumnas = styled.div``;
