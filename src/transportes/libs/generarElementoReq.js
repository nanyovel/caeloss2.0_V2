// Esta funcion busca generar un array de todos los elementos origen de una solicitud de una manera estadar con buenas practicas
//
//

import { generarUUID } from "../../libs/generarUUID";
import { elementoMontoSchema } from "../schemas/montosSchema";
import { elementoPagoSchema } from "../schemas/pagoSchema";

// DICCIONARIO OFICIAL DE LOS ELEMENTOS ORIGDEN DE UNA SOLICITUD
export const dicionarioElementosOrigenReq = [
  // Elemento Origen 01
  {
    descripcionViajesExternos: "Camion principal",
    descripcionResumidaExterno: "Camion",
    descripcionViajesInternos: "Chofer camion principal",
    descripcionResumidaInterno: "Chofer",
    codigoElementoOrigen: "ElOG1",
    // isOnlyInterno: false,
  },
  // Elemento Origen 02
  {
    descripcionViajesExternos: "",
    descripcionResumidaExterno: "",
    descripcionViajesInternos: "Ayudante camion principal",
    descripcionResumidaInterno: "Ayudante",
    codigoElementoOrigen: "ElOG2",
    // isOnlyInterno: true,
  },
  // Elemento Origen 03
  {
    descripcionViajesExternos: "Ayudante adicional camion principal",
    descripcionResumidaExterno: "Ayudante Adicional",
    descripcionViajesInternos: "Ayudante adicional camion principal",
    descripcionResumidaInterno: "Ayudante Adicional",
    codigoElementoOrigen: "ElOG3",
    // isOnlyInterno: false,
  },
  // Elemento Origen 04
  {
    descripcionViajesExternos: "Camion adicional",
    descripcionResumidaExterno: "Camion",
    descripcionViajesInternos: "Chofer camion adicional",
    descripcionResumidaInterno: "Chofer",
    codigoElementoOrigen: "ElOG4",
    // isOnlyInterno: false,
  },
  // Elemento Origen 05
  {
    descripcionViajesExternos: "",
    descripcionResumidaExterno: "Ayudante",
    descripcionViajesInternos: "Ayudante camion adicional",
    descripcionResumidaInterno: "Ayudante",
    codigoElementoOrigen: "ElOG5",
    // isOnlyInterno: true,
  },
  // Elemento Origen 06
  {
    descripcionViajesExternos: "Ayudante adicional camion adicional",
    descripcionResumidaExterno: "Ayudante Adicional",
    descripcionViajesInternos: "Ayudante adicional camion adicional",
    descripcionResumidaInterno: "Ayudante Adicional",
    codigoElementoOrigen: "ElOG6",
    // isOnlyInterno: false,
  },
];

// 🟢Generar elemento Origen
const generarElementoOrigen = (req, tipo) => {
  class PlantillaElOrigen {
    constructor(
      idElementoOrigen,
      nombrePersona,
      apellidoPersona,
      idPersona,
      codeVehiculo,
      descripcion,
      costo,
      precio,
      costoInterno,
      obs,
      tipoChofer,
      detallesPago
    ) {
      (this.idElementoOrigen = idElementoOrigen),
        (this.nombrePersona = nombrePersona),
        (this.apellidoPersona = apellidoPersona),
        (this.idPersona = idPersona),
        (this.codeVehiculo = codeVehiculo),
        (this.descripcion = descripcion),
        (this.costo = costo),
        (this.precio = precio),
        (this.costoInterno = costoInterno),
        (this.obs = obs),
        (this.tipoChofer = tipoChofer),
        (this.detallesPago = detallesPago);
    }
  }
  const listaElemetosOrigen = [];
  //
  // 🟢1-Camion principal
  const camionPrincipalBase = dicionarioElementosOrigenReq.find(
    (el) => el.codigoElementoOrigen == "ElOG1"
  );
  const camionPrincipal = new PlantillaElOrigen(
    req.datosFlete.idCamionComoElemento,
    tipo == "monto" ? "" : req.datosEntrega.chofer.nombre,
    tipo == "monto" ? "" : req.datosEntrega.chofer.apellido,
    tipo == "monto" ? "" : req.datosEntrega.chofer.id,

    req.datosFlete.vehiculoSeleccionado.code,
    req.datosFlete.vehiculoSeleccionado.descripcion,
    req.datosFlete.costo,
    req.datosFlete.precio,
    req.datosFlete.vehiculoSeleccionado.viajesInterno.montoChofer,
    "",
    tipo == "monto" ? "" : req.datosEntrega.chofer.tipo,

    // Para el pago
    req.datosFlete.detallesPago
  );

  const camionPrincipal2 = {
    ...camionPrincipalBase,
    ...camionPrincipal,
  };
  listaElemetosOrigen.push({ ...camionPrincipal2 });

  // 🟢****** 2-Ayudante camion principal ******
  // Si tiene ayudante del camion principal, agrega ese elemento
  if (tipo != "monto") {
    if (req?.datosEntrega?.ayudante?.id != "") {
      const ayudantePrincipalBase = dicionarioElementosOrigenReq.find(
        (el) => el.codigoElementoOrigen == "ElOG2"
      );
      const ayudantePrincipal = new PlantillaElOrigen(
        req.datosFlete.idCamionComoElemento,
        req.datosEntrega.ayudante.nombre,
        req.datosEntrega.ayudante.apellido,
        req.datosEntrega.ayudante.id,

        req.datosFlete.vehiculoSeleccionado.code,
        req.datosFlete.vehiculoSeleccionado.descripcion,
        req.datosFlete.costo,
        req.datosFlete.precio,
        req.datosFlete.vehiculoSeleccionado.viajesInterno.montoAyudante,
        "",
        req.datosEntrega.ayudante.tipo,
        req.datosFlete.detallesPago
      );
      const ayudantePrincipal2 = {
        ...ayudantePrincipalBase,
        ...ayudantePrincipal,
      };
      listaElemetosOrigen.push({ ...ayudantePrincipal2 });
    }
  }

  // 🟢******3-Ayundates adicionales camion principal ******
  // Si el camion principal tiene ayudantes adicionales agregale cada elemento
  if (req?.datosFlete?.ayudantesAdicionales?.length > 0) {
    //
    const ayudanteAddMainBase = dicionarioElementosOrigenReq.find(
      (el) => el.codigoElementoOrigen == "ElOG3"
    );
    req?.datosFlete?.ayudantesAdicionales?.forEach((ayuAdd) => {
      // Si el ayudante esta rechazado entonces no me interesa
      if (ayuAdd.status != 2) {
        const ayudAddMain = new PlantillaElOrigen(
          ayuAdd.idAyudanteAddComoElemento,
          ayuAdd.datosAyudante.nombre,
          ayuAdd.datosAyudante.apellido,
          ayuAdd.datosAyudante.id,
          req?.datosFlete.vehiculoSeleccionado.code,
          ayuAdd.datosAyudante.nombre + " " + ayuAdd.datosAyudante.apellido,
          ayuAdd.costo,

          0,
          ayuAdd.costo,
          ayuAdd.obs,
          ayuAdd.datosAyudante.tipo,
          ayuAdd.detallesPago
        );

        const ayudAddMain2 = {
          ...ayudanteAddMainBase,
          ...ayudAddMain,
        };
        listaElemetosOrigen.push({
          ...ayudAddMain2,
        });
      }
    });
  }
  //
  //
  //
  // 🟢******4-Camion adicional ******
  // Si la solicitud posee camion adicional
  if (req?.datosFlete?.vehiculosAdicionales?.length > 0) {
    const camionAddBase = dicionarioElementosOrigenReq.find(
      (el) => el.codigoElementoOrigen == "ElOG4"
    );
    req?.datosFlete?.vehiculosAdicionales?.forEach((vehiAdd) => {
      const camionAdd = new PlantillaElOrigen(
        vehiAdd.idCamionComoElemento,
        tipo == "monto" ? "" : vehiAdd.datosEntrega.chofer.nombre,
        tipo == "monto" ? "" : vehiAdd.datosEntrega.chofer.apellido,
        tipo == "monto" ? "" : vehiAdd.datosEntrega.chofer.id,
        vehiAdd.code,
        vehiAdd.descripcion,
        vehiAdd.resultado.costo,
        vehiAdd.resultado.precio,
        vehiAdd.viajesInterno.montoChofer,
        "",
        vehiAdd.datosEntrega.chofer.tipo,
        vehiAdd.detallesPago
      );

      const camionAdd2 = {
        ...camionAddBase,
        ...camionAdd,
      };

      listaElemetosOrigen.push({
        ...camionAdd2,
      });

      // 🟢******5-Ayudante principal camion adiciona ******
      //  Si el camion es interno y ademas posee ayudante, entonces agregalo
      if (vehiAdd.datosEntrega.ayudante.id) {
        const ayudMainCamionAddBase = dicionarioElementosOrigenReq.find(
          (el) => el.codigoElementoOrigen == "ElOG5"
        );
        const ayudantePrincipalCamionAdd = new PlantillaElOrigen(
          vehiAdd.idCamionComoElemento,
          tipo == "monto" ? "" : vehiAdd.datosEntrega.ayudante.nombre,
          tipo == "monto" ? "" : vehiAdd.datosEntrega.ayudante.apellido,
          tipo == "monto" ? "" : vehiAdd.datosEntrega.ayudante.id,
          vehiAdd.code,
          vehiAdd.descripcion,
          vehiAdd.resultado.costo,
          vehiAdd.resultado.precio,
          vehiAdd.viajesInterno.montoAyudante,
          "",
          vehiAdd.datosEntrega.ayudante.tipo,
          vehiAdd.detallesPago
        );

        listaElemetosOrigen.push({
          ...ayudMainCamionAddBase,
          ...ayudantePrincipalCamionAdd,
        });
      }
      //
      //
      //
      //
      // 🟢******6-Ayudante adicional camion adicional ******
      //  Si el camion posee ayudantes adicionales
      if (vehiAdd.ayudantesAdicionales?.length > 0) {
        const ayudAddCamionAddBase = dicionarioElementosOrigenReq.find(
          (el) => el.codigoElementoOrigen == "ElOG6"
        );
        vehiAdd.ayudantesAdicionales.forEach((ayuAdd) => {
          // Si el ayudante esta rechazado entonces no me interesa
          if (ayuAdd.status != 2) {
            const ayudAddCamionAdd = new PlantillaElOrigen(
              ayuAdd.idAyudanteAddComoElemento,
              ayuAdd.datosAyudante.nombre,
              ayuAdd.datosAyudante.apellido,
              ayuAdd.datosAyudante.id,

              vehiAdd.code,
              ayuAdd.datosAyudante.nombre + " " + ayuAdd.datosAyudante.apellido,
              ayuAdd.costo,
              0,
              ayuAdd.costo,
              ayuAdd.obs,
              ayuAdd.datosAyudante.tipo,
              ayuAdd.detallesPago
            );

            listaElemetosOrigen.push({
              ...ayudAddCamionAddBase,
              ...ayudAddCamionAdd,
            });
          }
        });
      }
    });
  }

  return [...listaElemetosOrigen];
};

// 🟢Con esta funcion generamos los elementos montos
export const generarElementoMonto = (datosFlete) => {
  const requestAux = { datosFlete: datosFlete };
  const elementosOringen = generarElementoOrigen(requestAux, "monto");
  const elementosMonto = elementosOringen.map((el) => {
    // Eliminamos las propiedades que no queremos
    const {
      nombrePersona,
      apellidoPersona,
      costoInterno,
      descripcionViajesInternos,
      idPersona,
      idBeneficiario,
      detallesPago,

      ...nuevoObjeto
    } = el;
    return {
      ...elementoMontoSchema,
      ...nuevoObjeto,
      id: generarUUID(),
    };
  });

  const elementosSinAyudantes = elementosMonto.filter(
    (el) =>
      el.codigoElementoOrigen != "ElOG2" || el.codigoElementoOrigen != "ElOG5"
  );
  //
  return [...elementosSinAyudantes];
};

// 🟢Con esta funcion generamos los elementos pagos
export const generarElementoPago = (req) => {
  const elementosOringen = generarElementoOrigen(req, "pago");
  const elementosPagos = elementosOringen.map((el, index) => {
    // Eliminamos las propiedades que no queremos

    const {
      idPersona,
      nombrePersona,
      apellidoPersona,
      costo,
      precio,
      descripcionResumidaExterno,
      descripcionResumidaInterno,
      codeVehiculo,

      ...nuevoObjeto
    } = el;
    return {
      ...elementoPagoSchema,
      ...nuevoObjeto,
      monto: el.costo,
      solicitudAux: req,
      datosSolicitud: {
        cliente: req.datosReq.socioNegocio,
        fechaSolicitud: req.fechaReq,
        idReq: req.id,
        numeroReq: req.numeroDoc,
        idSolicitante: req.datosSolicitante.idSolicitante,
        nombreSolicitante:
          req.datosSolicitante.nombre + " " + req.datosSolicitante.apellido,
        dptoSolicitante: req.datosSolicitante.dpto,
        puntoPartida: req.datosFlete.puntoPartidaSeleccionado.code,
        destino: req.datosFlete.destino,
      },
      beneficiario: {
        nombre: el.nombrePersona,
        apellido: el.apellidoPersona,
        id: el.idPersona,
      },
    };
  });

  return [...elementosPagos];
};

export const extraerCostosAPS = (request) => {
  const elementosOringen = generarElementoOrigen(request);

  const tablaParsed = elementosOringen.map((el) => {
    return {
      ...el,
      nombreCompleto: el.nombrePersona + " " + el.apellidoPersona,
    };
  });
  const costosTablaAxuVehAdd = [];
  const costosTablaAxuVehAddSort = costosTablaAxuVehAdd.sort(
    (a, b) => a.ordenCSS - b.ordenCSS
  );

  return [...tablaParsed];
};
