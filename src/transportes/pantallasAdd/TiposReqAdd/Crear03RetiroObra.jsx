import React, { useEffect, useState } from "react";
import { MainFlete } from "../../../fletes/page/MainFlete";
import styled from "styled-components";

import { BtnGeneralButton } from "../../../components/BtnGeneralButton";
import { collection, doc, writeBatch, Timestamp } from "firebase/firestore";
import db from "../../../firebase/firebaseConfig";
import { BotonQuery } from "../../../components/BotonQuery";
import { Alerta } from "../../../components/Alerta";
import { ModalLoading } from "../../../components/ModalLoading";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { ClearTheme, Tema } from "../../../config/theme";

import MoldeDatosReq from "../../components/reqComponents/MoldeDatosReq";
import { FuncionEnviarCorreo } from "../../../libs/FuncionEnviarCorreo";
import { PlantillaCorreoReqState } from "../../libs/PlantillaCorreoReqState";
import { AsuntosSegunEstadoReq } from "../../libs/DiccionarioNumberString";
import { reqSchema } from "../../schemas/reqSchema";
import MontosReqNuevo from "../../components/reqComponents/MontosReqNuevo";
import { useDocById } from "../../../libs/useDocByCondition";

export default function Crear03RetiroObra({
  userMaster,
  tipoSolicitud,

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
  const [resetValue, setResetValue] = useState(false);

  // ********** ESTADOS DE LOS DATOS PRINCIPALES**********
  const [requestEditable, setRequestEditable] = useState({ ...reqSchema });
  const [datosFlete, setDatosFlete] = useState({ ...reqSchema.datosFlete });
  const [datosReq, setDatosReq] = useState({ ...reqSchema.datosReq });

  const [datosMontos, setDatosMontos] = useState([]);

  // Parsear datos Initial
  useEffect(() => {
    if (userMaster) {
      setDatosSolicitante({
        ...reqSchema.datosSolicitante,
        nombre: userMaster.nombre,
        apellido: userMaster.apellido,
        genero: userMaster.genero,
        dpto: userMaster.dpto,
        idSolicitante: userMaster.id,
        urlFotoPerfil: userMaster.urlFotoPerfil,
        userName: userMaster.userName,
      });
    }
  }, [datosFlete, userMaster]);
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
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
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
    // ***** Solicitud *****

    // Si tiene campo generales vacio
    if (
      datosReq.socioNegocio == "" ||
      datosReq.detalles == "" ||
      datosReq.numeroProyecto == ""
    ) {
      setFaltanObligatorios(true);
      setMensajeAlerta(
        "Faltan datos obligatorios; cliente, detalles y proyecto."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 4000);
      return;
    }
    // Si no coloco materiales a retirar
    if (datosReq.materialesDev.length == 0) {
      setFaltanObligatorios(true);
      setMensajeAlerta("Debe agregar materiales a retirar.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    }
    // Si no coloco materiales persona de contacto

    // Validar personas de contacto
    const contactosValidos = datosReq.personasContacto.some(
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
      const soloConDatos = datosReq.personasContacto.filter((person) => {
        if (person.nombre != "" || person.telefono != "" || person.rol != "") {
          return person;
        }
      });
      const algunoVacio = soloConDatos.some(
        (vacio) => vacio.nombre == "" || vacio.telefono == "" || vacio.rol == ""
      );
      if (algunoVacio) {
        setFaltanObligatorios(true);
        setMensajeAlerta("Persona de contacto incompleta.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
    }
    // Agregar la operación de actualización del contador
    const contadorNumeroDocId = "numberReq";
    const contadorUpdate = doc(db, "counters", contadorNumeroDocId);
    const nuevoNumero = contadorNumeroDoc.lastNumberReq + 1;
    //
    // ******** GENERAR PALABRAS CLAVES *********
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

    const numDocsParsed = datosReq.documentos.map((doc) => {
      return doc.numeroDoc;
    });
    const personasParsed2 = datosReq.personasContacto
      .map((persona) => {
        return [persona.nombre, persona.rol, persona.telefono];
      })
      .flat();

    palabrasClaveGeneral = palabrasClaveGeneral
      .concat(datosReq.socioNegocio)
      .concat(datosReq.numeroProyecto)
      .concat(datosReq.detalles)
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
      .concat(datosReq.socioNegocio) // ESTE SE AGREGA PARA QUE SI EL USUARIO NO COLOCA NADA, TRAER TODO
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

    setIsLoading(true);
    const batch = writeBatch(db);
    try {
      batch.update(contadorUpdate, {
        lastNumberReq: nuevoNumero,
      });

      // Agregar nuevo documento a transferRequest en el mismo lote
      const collectionTransferRequestsRef = collection(db, "transferRequest");
      const nuevoDocumentoRef = doc(collectionTransferRequestsRef);
      const fechaReq = format(new Date(), `dd/MM/yyyy hh:mm:ss:SSS aa`, {
        locale: es,
      });
      console.log(datosFlete);
      const reqEnviarFinal = {
        ...requestEditable,
        estadoDoc: datosMontos.length > 1 ? -1 : 0,
        numeroDoc: nuevoNumero,
        fechaReq: fechaReq,
        fechaStamp: Timestamp.fromDate(new Date()),
        fechaReqCorta: fechaReq.slice(0, 10),
        tipo: tipoSolicitud,

        datosFlete: {
          ...datosFlete,
          vehiculosAdicionalesTiene: datosFlete.vehiculosAdicionales.length > 0,
          destinos: [],
          puntoPartida: [],
          unidadVehicular: [],
        },
        datosReq: datosReq,
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
        // forQueryDB: {
        //   ...reqSchema.forQueryDB,
        //   almacenes: codeAlmacen(
        //     2,
        //     datosReq.documentos,
        //     undefined,
        //     datosFlete.puntoPartidaSeleccionado
        //   ),
        // },
      };
      const reqEnviarParsed = {
        ...reqEnviarFinal,
        forQueryDB: parsForQueryDB(reqEnviarFinal),
      };
      batch.set(nuevoDocumentoRef, reqEnviarParsed);
      // batch.set(nuevoDocumentoRef, { ...reqEnviarFinal });

      // Subcoleccion, esto sera de acceso publico; por ahora solo para las review de cliente
      const subcoleccionRef = doc(
        collection(db, "reviewClientes"),
        nuevoDocumentoRef.id
      );

      batch.set(subcoleccionRef, {
        nombre: "",
        numero: "",
        puntuacion: 0,
        comentarios: "",
        fecha: "",
        id: nuevoDocumentoRef.id,
        numeroSolicitud: nuevoNumero,
        cliente: datosReq.socioNegocio,
      });

      if (nuevoNumero > 100000) {
        await batch.commit();
        const destinos = [
          ...destinatarios.map((d) => d.correo).filter((correo) => correo),
          // userMaster.correo,
        ];
        if (destinos.length > 0) {
          FuncionEnviarCorreo({
            para: destinos,
            asunto: AsuntosSegunEstadoReq[reqEnviarFinal.estadoDoc],
            mensaje: PlantillaCorreoReqState(reqEnviarFinal),
          });
        }

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

      //   setIsLoading(false);
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
      <TituloModulo>Datos Flete:</TituloModulo>
      <WrapModule>
        <MainFlete
          datosFlete={datosFlete}
          setDatosFlete={setDatosFlete}
          tipoSolicitud={tipoSolicitud}
          //
          setDatosMontos={setDatosMontos}
          resetValue={resetValue}
          //
          userMaster={userMaster}
        />
        ;
      </WrapModule>
      {datosFlete && (
        <>
          <TituloModulo>Montos:</TituloModulo>
          <WrapModule>
            <MontosReqNuevo
              setDatosMontos={setDatosMontos}
              datosMontos={datosMontos}
              userMaster={userMaster}
              datosFlete={datosFlete}
              modo="creacion"
            />
          </WrapModule>
        </>
      )}
      <TituloModulo>Datos solicitud:</TituloModulo>
      <WrapModule>
        <MoldeDatosReq
          faltanObligatorios={faltanObligatorios}
          datosReq={datosReq}
          setDatosReq={setDatosReq}
          userMaster={userMaster}
          tipo={tipoSolicitud}
          datosFlete={datosFlete}
          destinatarios={destinatarios}
          setDestinatarios={setDestinatarios}
        />
      </WrapModule>

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
  /* border: 1px solid red; */
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
  color: ${Tema.primary.azulBrillante};
  @media screen and (max-width: 400px) {
    font-size: 1.1rem;
  }
  color: ${ClearTheme.complementary.warning};
  font-weight: 400;
`;
const BtnNormal = styled(BtnGeneralButton)`
  padding: 15px;
`;

const Container = styled.div`
  width: 100%;
`;
