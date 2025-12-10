import React, { useEffect, useState } from "react";
import { MainFlete } from "../../../fletes/page/MainFlete";
import styled from "styled-components";
import { BtnGeneralButton } from "../../../components/BtnGeneralButton";
import { collection, doc, Timestamp, writeBatch } from "firebase/firestore";
import db from "../../../firebase/firebaseConfig";
import { BotonQuery } from "../../../components/BotonQuery";
import { Alerta } from "../../../components/Alerta";
import { ModalLoading } from "../../../components/ModalLoading";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useLocation } from "react-router-dom";
import { ClearTheme, Theme } from "../../../config/theme";
import MoldeDatosReq from "../../components/reqComponents/MoldeDatosReq";
import { FuncionEnviarCorreo } from "../../../libs/FuncionEnviarCorreo";
import { reqSchema } from "../../schemas/reqSchema";
import { PlantillaCorreoReqState } from "../../libs/PlantillaCorreoReqState";
import { AsuntosSegunEstadoReq } from "../../libs/DiccionarioNumberString";
import MontosReqNuevo from "../../components/reqComponents/MontosReqNuevo";
import { obtenerDocPorId2, useDocById } from "../../../libs/useDocByCondition";

export default function Crear01Entrega({
  userMaster,
  tipoSolicitud,

  plantilla,
  parsForQueryDB,
  destinatarios,
  setDestinatarios,
}) {
  const [contadorNumeroDoc, setContadorNumeroDoc] = useState({});
  useDocById("counters", setContadorNumeroDoc, "numberReq");

  // ********** RECURSOS GENERALES **********
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [datosSolicitante, setDatosSolicitante] = useState({});
  const [modo, setModo] = useState(null);

  const [resetValue, setResetValue] = useState(false);

  const location = useLocation();
  const [direccionURL, setDireccionURL] = useState(location.pathname);

  // ********** ESTADOS DE LOS DATOS PRINCIPALES**********
  const [datosFlete, setDatosFlete] = useState(null);
  const [datosReq, setDatosReq] = useState({ ...reqSchema.datosReq });
  const [opcionAlmacen, setOpcionAlmacen] = useState([]);
  //
  const [datosMontos, setDatosMontos] = useState([]);

  // Parsear datos Initial
  useEffect(() => {
    if (userMaster) {
      setDatosSolicitante({
        ...reqSchema.datosSolicitante,
        nombre: userMaster.nombre,
        genero: userMaster.genero,
        apellido: userMaster.apellido,
        dpto: userMaster.dpto,
        idSolicitante: userMaster.id,
        urlFotoPerfil: userMaster.urlFotoPerfil,
        userName: userMaster.userName,
      });
    }
    if (direccionURL == "/transportes/add") {
      setModo("creacion");
    }
  }, [datosFlete, userMaster, direccionURL]);
  //

  // ************************** ALIMENTAR ESTADOS DE DB**************************
  const [faltanObligatorios, setFaltanObligatorios] = useState(false);
  const enviarReq = async () => {
    // **** Flete ****
    // Si es por destino
    console.log(datosFlete);
    if (datosFlete.modalidad[0].select == true) {
      if (datosFlete.provinciaSeleccionada == null) {
        setMensajeAlerta("Debe seleccionar destino.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
    }
    // Si es por kilometros
    if (datosFlete.modalidad[1].select == true) {
      if (
        !datosFlete.distancia ||
        datosFlete.distancia == 0 ||
        datosFlete.distancia == ""
      ) {
        setMensajeAlerta("Indicar cantidad de kilometros.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        return "";
      }
    }
    // Si no coloco vehiculo
    if (datosFlete.vehiculoSeleccionado == null) {
      setMensajeAlerta("Seleccionar vehiculo.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }
    //
    //
    // ********** Solicitud **********
    // A los documentos agregale el valor de la bodega segun el punto de partida seleccionado
    // Pero si el punto de partida es santo domingo, entonces coloca los almacenese segun la opcion seleccionada por el usuario
    let datosReqAux = { ...datosReq };
    const puntoPartidaSelect = datosFlete.puntoPartida.find(
      (punto) => punto.select == true
    );

    if (puntoPartidaSelect.codigoInterno == "principal01") {
      const documentosAux = datosReqAux.documentos.map((doc, index) => {
        const bodegaSelect = opcionAlmacen[index].find(
          (opcion) => opcion.select
        );

        return {
          ...doc,
          bodega: bodegaSelect ? bodegaSelect.codigoInterno : doc.bodega,
        };
      });
      //
      //
      //
      //
      datosReqAux = { ...datosReqAux, documentos: documentosAux };
    } else {
      const documentosAux = datosReqAux.documentos.map((doc) => {
        return {
          ...doc,
          bodega: puntoPartidaSelect.codigoInterno,
        };
      });
      datosReqAux = { ...datosReqAux, documentos: documentosAux };
    }
    console.log(datosReqAux);
    //
    //
    //
    //
    //
    //

    // Si tiene campo generales vacio
    if (datosReqAux.socioNegocio == "") {
      setFaltanObligatorios(true);
      setMensajeAlerta("Colocar cliente.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    }
    if (datosReqAux.detalles == "") {
      setFaltanObligatorios(true);
      setMensajeAlerta("El campo detalles es obligatorio.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    //
    //

    // Validacion Documentos
    const algunDato = datosReqAux.documentos.filter(
      (doc) => doc.numeroDoc != ""
    );
    console.log(algunDato);
    // Si punto de partida es santo domingo, entonces la validacion de documentos es diferente

    // Si punto de partida es santo domingo, entonces la validacion de documentos es diferente
    if (algunDato.length > 0) {
      const faltaTipo = algunDato.some((doc) => doc.tipoDoc == "");
      const faltaBodega = algunDato.some((doc) => doc.bodega == "");
      // Si algun numero de documento no esta lleno completamente
      if (faltaTipo || faltaBodega) {
        setFaltanObligatorios(true);
        if (puntoPartidaSelect.codigoInterno == "principal01") {
          setMensajeAlerta("Completar tipo de documento y almacen.");
        } else {
          setMensajeAlerta("Completar tipo de documento.");
        }
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
    }

    // Si no coloco numero de documento
    if (algunDato.length == 0) {
      setFaltanObligatorios(true);
      setMensajeAlerta("Ingresar al menos un numero de documento.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    // Validar personas de contacto
    const contactosValidos = datosReqAux.personasContacto.some(
      (person) => person.nombre && person.telefono && person.rol
    );
    if (!contactosValidos) {
      setFaltanObligatorios(true);
      setMensajeAlerta("Ingresar al menos una persona de contacto.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    // Si el usuario coloca al menos una persona de contacto, pero coloca otra con campos incorrectos
    if (contactosValidos) {
      const soloConDatos = datosReqAux.personasContacto.filter((person) => {
        if (person.nombre != "" || person.telefono != "" || person.rol != "") {
          return person;
        }
      });
      const algunoVacio = soloConDatos.some(
        (vacio) => vacio.nombre == "" || vacio.telefono == "" || vacio.rol == ""
      );
      if (algunoVacio) {
        setFaltanObligatorios(true);
        setMensajeAlerta("Completar correctamente persona de contacto.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
    }
    // Agregar la operación de actualización del contador

    // const nuevoNumero = contadorNumeroDoc.lastNumberReq + 1;
    const contadorReq = await obtenerDocPorId2("counters", "numberReq");
    const nuevoNumero = contadorReq.lastNumberReq + 1;

    // ***************** GENERAR PALABRAS CLAVES ******************
    const parsearPalabrasClave = (palabrasClave) => {
      const palabrasClaveParsed = palabrasClave
        .map((word) => {
          // Primero:
          // ----Convierte a string, quitale espacios al final y al inicio, conviertelo a minusculca
          const str = String(word).trim().toLocaleLowerCase();
          // Si tienen varias palabras, es decir separadas por espacios, entonces retorna un array con cada una de estas palabras
          if (str.includes(" ")) {
            return str.split(" ");
          } else {
            return str;
          }
          // Si llego a retornar array entonces aplana todo
        })
        .flat();
      return palabrasClaveParsed;
    };
    const quitarVacios = (palabrasClave) => {
      const sinVacios = palabrasClave.filter((palabra) => {
        if (palabra != "") {
          return palabra;
        }
      });
      return sinVacios;
    };

    // ************* GENERALES *************
    let palabrasClaveGeneral = [];

    const numDocsParsed = datosReqAux.documentos.map((doc) => {
      return doc.numeroDoc;
    });
    const personasParsed2 = datosReqAux.personasContacto
      .map((persona) => {
        return [persona.nombre, persona.rol, persona.telefono];
      })
      .flat();

    palabrasClaveGeneral = palabrasClaveGeneral
      .concat(datosReqAux.socioNegocio)
      .concat(datosReqAux.numeroProyecto)
      .concat(datosReqAux.detalles)
      .concat(numDocsParsed)
      .concat(personasParsed2)
      .concat(nuevoNumero)

      .concat(datosFlete.vehiculoSeleccionado.descripcion)
      .concat(datosSolicitante.nombre)
      .concat(datosSolicitante.apellido)
      // ESTE SE AGREGA PARA QUE SI EL USUARIO NO COLOCA NADA, TRAER TODO
      .concat("TODOSLOSELEMENTOS");

    if (datosFlete.modalidad[0].select) {
      palabrasClaveGeneral = palabrasClaveGeneral
        .concat(datosFlete.provinciaSeleccionada.label)
        .concat(
          datosFlete.provinciaSeleccionada.municipioSeleccionado?.label || ""
        );
    }
    console.log("a");
    // Todo string
    // Quitar espacios al inicio y final
    // Todo minuscula
    // Si tenemos subarray, aplanlo
    const nuevaParsedGeneral = parsearPalabrasClave(palabrasClaveGeneral);
    //
    // Elimina los elementos vacios
    const palabrasFiltradasGeneral = quitarVacios(nuevaParsedGeneral);

    // *************** PALABRAS CLAVE ESPECIFICAS ***************
    // Socio de negocio
    let paralabrasClaveSocioNegocio = [];
    paralabrasClaveSocioNegocio = paralabrasClaveSocioNegocio
      .concat(datosReqAux.socioNegocio) // ESTE SE AGREGA PARA QUE SI EL USUARIO NO COLOCA NADA, TRAER TODO
      .concat("TODOSLOSELEMENTOS");
    // Todo string
    // Quitar espacios al inicio y final
    // Todo minuscula
    // Si tenemos subarray, aplanlo
    const nuevaParsedSocioNegocio = parsearPalabrasClave(
      paralabrasClaveSocioNegocio
    );
    // Elimina los elementos vacios
    const palabrasFiltradasSocioNegocio = quitarVacios(nuevaParsedSocioNegocio);

    // FIN DE PALABRAS CLAVES
    //
    const hasMontoInitial = datosMontos.some(
      (monto) => monto.justificacion == "initialFormula"
    );

    if (hasMontoInitial == false) {
      return;
    }
    //

    datosReqAux = {
      ...datosReqAux,
      destinatariosNotificacion: destinatarios,
    };
    setIsLoading(true);
    const batch = writeBatch(db);

    try {
      const contadorNumeroDocId = "numberReq";
      const contadorUpdate = doc(db, "counters", contadorNumeroDocId);
      batch.update(contadorUpdate, {
        lastNumberReq: nuevoNumero,
      });

      // Agregar nuevo documento a transferRequest en el mismo lote
      const collectionTransferRequestsRef = collection(db, "transferRequest");
      const nuevoDocumentoRef = doc(collectionTransferRequestsRef);
      const fechaReq = format(new Date(), `dd/MM/yyyy hh:mm:ss:SSS aa`, {
        locale: es,
      });
      const reqEnviarFinal = {
        ...reqSchema,
        estadoDoc: datosMontos.length > 1 ? -1 : 0,
        // estadoDoc: 0,
        numeroDoc: nuevoNumero,
        fechaReq: fechaReq,
        fechaReqCorta: fechaReq.slice(0, 10),
        fechaStamp: Timestamp.fromDate(new Date()),
        tipo: tipoSolicitud,

        datosFlete: {
          ...datosFlete,
          vehiculosAdicionalesTiene: datosFlete.vehiculosAdicionales.length > 0,
          destinos: [],
          puntoPartida: [],
          unidadVehicular: [],
        },
        datosReq: datosReqAux,
        datosSolicitante: datosSolicitante,
        datosMontos: datosMontos,
        palabrasClave: {
          ...reqSchema.palabrasClave,
          general: palabrasFiltradasGeneral,
          especificas: {
            ...reqSchema.palabrasClave.especificas,
            socioNegocio: palabrasFiltradasSocioNegocio,
          },
        },
      };
      console.log(destinatarios);
      const reqEnviarParsed = {
        ...reqEnviarFinal,
        forQueryDB: parsForQueryDB(reqEnviarFinal),
      };
      console.log(reqEnviarParsed);

      batch.set(nuevoDocumentoRef, reqEnviarParsed);
      // setIsLoading(false);
      // return;
      // 🟢🟢🟢***************CONFIRMACION***************🟢🟢🟢
      if (nuevoNumero > 100000) {
        await batch.commit();
        const destinos = [
          ...destinatarios.map((d) => d.correo).filter((correo) => correo),
          // userMaster.correo,
        ];
        if (destinos.length > 0) {
          FuncionEnviarCorreo({
            para: destinos,
            asunto: AsuntosSegunEstadoReq[0],
            mensaje: PlantillaCorreoReqState(reqEnviarFinal),
          });
        }

        setIsLoading(false);
        // return;
        setDatosMontos([]);
        setDatosReq({ ...reqSchema.datosReq });
        setDatosFlete({ ...reqSchema.datosFlete });
        setResetValue(!resetValue);
        setFaltanObligatorios(false);

        setMensajeAlerta("Solicitud de transporte enviada.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      } else {
        setMensajeAlerta("Error con la propiedad numeroDoc...");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <BotonQuery
        datosMontos={datosMontos}
        datosReq={datosReq}
        datosFlete={datosFlete}
      />
      {/* <BtnNormal2 onClick={() => mostrarReview()}>Mostrar </BtnNormal2> */}
      <TituloModulo className={Theme.config.modoClear ? "clearModern" : ""}>
        Datos Flete:
      </TituloModulo>
      <WrapModule>
        <MainFlete
          datosFlete={datosFlete}
          setDatosFlete={setDatosFlete}
          tipoSolicitud={tipoSolicitud}
          setDatosMontos={setDatosMontos}
          resetValue={resetValue}
          userMaster={userMaster}
          plantilla={plantilla}
        />
      </WrapModule>
      {datosFlete && (
        <>
          <TituloModulo className={Theme.config.modoClear ? "clearModern" : ""}>
            Montos:
          </TituloModulo>
          <WrapModule>
            <MontosReqNuevo
              setDatosMontos={setDatosMontos}
              datosMontos={datosMontos}
              userMaster={userMaster}
              datosFlete={datosFlete}
              modo={modo}
            />
          </WrapModule>
        </>
      )}
      {datosFlete && (
        <>
          <TituloModulo className={Theme.config.modoClear ? "clearModern" : ""}>
            Datos solicitud:
          </TituloModulo>
          <WrapModule>
            <MoldeDatosReq
              datosReq={datosReq}
              setDatosReq={setDatosReq}
              userMaster={userMaster}
              tipo={tipoSolicitud}
              faltanObligatorios={faltanObligatorios}
              //
              plantilla={plantilla}
              datosFlete={datosFlete}
              opcionAlmacen={opcionAlmacen}
              setOpcionAlmacen={setOpcionAlmacen}
              destinatarios={destinatarios}
              setDestinatarios={setDestinatarios}
            />
          </WrapModule>
        </>
      )}

      <WrapModule>
        <BtnNormal onClick={() => enviarReq()}>Enviar</BtnNormal>
      </WrapModule>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      {isLoading ? <ModalLoading completa={true} /> : ""}
    </Container>
  );
}
const WrapModule = styled.div`
  width: 100%;
  margin-bottom: 50px;
  text-align: center;
`;
const Titulo = styled.h2`
  font-size: 1%.4;
  text-decoration: underline;
  color: white;
`;
const TituloModulo = styled(Titulo)`
  margin-bottom: 15px;
  padding-left: 25px;
  @media screen and (max-width: 400px) {
    font-size: 1.1rem;
  }
  color: ${ClearTheme.complementary.warning};
  font-weight: 400;
`;
const BtnNormal = styled(BtnGeneralButton)`
  padding: 15px;
`;
const BtnNormal2 = styled(BtnGeneralButton)``;

const Container = styled.div`
  width: 100%;
  /* border: 1px solid red; */
`;
