import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { MainFlete } from "../../../fletes/page/MainFlete";
import { BtnGeneralButton } from "../../../components/BtnGeneralButton";
import { ModalLoading } from "../../../components/ModalLoading";
import { collection, doc, Timestamp, writeBatch } from "firebase/firestore";
import db from "../../../firebase/firebaseConfig";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Alerta } from "../../../components/Alerta";
import { OpcionUnica } from "../../../components/OpcionUnica";
import { ClearTheme, Tema } from "../../../config/theme";

import MoldeDatosReq from "../../components/reqComponents/MoldeDatosReq";
import { FuncionEnviarCorreo } from "../../../libs/FuncionEnviarCorreo";
import { PlantillaCorreoReqState } from "../../libs/PlantillaCorreoReqState";
import { AsuntosSegunEstadoReq } from "../../libs/DiccionarioNumberString";
import { reqSchema } from "../../schemas/reqSchema";
import MontosReqNuevo from "../../components/reqComponents/MontosReqNuevo";
import { useDocById } from "../../../libs/useDocByCondition";
export default function Crear02Traslado({
  userMaster,
  tipoSolicitud,

  parsForQueryDB,
  destinatarios,
  setDestinatarios,
}) {
  const [contadorNumeroDoc, setContadorNumeroDoc] = useState({});
  useDocById("counters", setContadorNumeroDoc, "numberReq");
  // ********** Recursos Gnerales **********
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [datosSolicitante, setDatosSolicitante] = useState({});
  // const [modo, setModo] = useState(null);

  const [resetValue, setResetValue] = useState(false);

  // ********** ESTADOS DE LOS DATOS PRINCIPALES**********
  const [datosFlete, setDatosFlete] = useState({ ...reqSchema.datosFlete });
  const [datosReq, setDatosReq] = useState({ ...reqSchema.datosReq });
  //
  const [opcionAlmacen, setOpcionAlmacen] = useState([]);
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
  }, [datosFlete]);

  // **************** Manejar arrayOpciones tipo de traslado ****************
  const initialTipoSolicitud = [
    { nombre: "Abastecimiento", opcion: 0, select: true },
    { nombre: "Traslado entre sucursales", opcion: 1, select: false },
  ];
  const [tipoTraslado, setTipoTraslado] = useState([...initialTipoSolicitud]);
  const handleOpciones = (e) => {
    let index = Number(e.target.dataset.id);
    const { name, value } = e.target;

    if (name == "tipoTraslado") {
      setTipoTraslado(
        tipoTraslado.map((opcion, i) => {
          return {
            ...opcion,
            select: i === index,
          };
        })
      );

      setDatosReq({
        ...datosReq,
        detalles: "",
        socioNegocio: "",
        numeroProyecto: "",
      });
    }
  };

  // ************************** ALIMENTAR ESTADOS DE DB**************************
  const [faltanObligatorios, setFaltanObligatorios] = useState(false);
  const enviarReq = async () => {
    // **** Flete ****
    console.log(datosFlete);
    // Si no coloco sucursal destino
    if (datosFlete.provinciaSeleccionada == null) {
      setMensajeAlerta("Selecciona sucursal destino.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }
    // Si no coloco vehiculo
    if (datosFlete.vehiculoSeleccionado == null) {
      setMensajeAlerta("Selecciona vehiculo.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }
    // ********** Solicitud **********
    let datosReqAux = { ...datosReq };
    const puntoPartidaSelect = datosFlete.puntoPartida.find(
      (punto) => punto.select == true
    );
    const documentosAux = datosReqAux.documentos.map((doc) => {
      return {
        ...doc,
        bodega: puntoPartidaSelect.codigoInterno,
      };
    });
    datosReqAux = { ...datosReqAux, documentos: documentosAux };
    console.log(datosReqAux);
    //
    // Si no coloco detalles de solicitud
    if (datosReqAux.detalles == "") {
      setFaltanObligatorios(true);
      setMensajeAlerta("El campo detalles es obligatorio.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    // Si esta en modo traslado entre sucursales y no coloca cliente
    if (tipoTraslado[1].select == true && datosReqAux.socioNegocio == "") {
      setFaltanObligatorios(true);
      setMensajeAlerta("Colocar cliente.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }
    // Validacion Documentos
    const algunDato = datosReqAux.documentos.filter(
      (doc) => doc.tipoDoc != "" || doc.numeroDoc != ""
    );

    if (algunDato.length > 0) {
      const incompleto = algunDato.some(
        (doc) => doc.tipoDoc == "" || doc.numeroDoc == ""
      );
      // Si algun numero de documento no esta lleno completamente
      if (incompleto) {
        setFaltanObligatorios(true);
        setMensajeAlerta("Colocar correctamente tipo y numero de documento.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
    }
    // Si no coloco numero de documento
    else {
      setFaltanObligatorios(true);
      setMensajeAlerta("Ingresar al menos un numero de documento.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    // console.log(tipoTraslado);
    // return "";
    // Agregar la operación de actualización del contador
    const contadorNumeroDocId = "numberReq";
    const contadorUpdate = doc(db, "counters", contadorNumeroDocId);
    const nuevoNumero = contadorNumeroDoc.lastNumberReq + 1;
    //
    //
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

    palabrasClaveGeneral = palabrasClaveGeneral
      .concat(datosReq.socioNegocio)
      .concat(datosReq.numeroProyecto)
      .concat(datosReq.detalles)
      .concat(numDocsParsed)
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

    //
    //
    //
    // FIN DE PALABRAS CLAVES
    datosReqAux = {
      ...datosReqAux,
      destinatariosNotificacion: destinatarios,
    };
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
      const reqEnviarFinal = {
        ...reqSchema,
        estadoDoc: datosMontos.length > 1 ? -1 : 0,
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
          // Si el solicitante agrego un precio, entonces toma ese precio y colocalo como oficial
        },
        datosReq: { ...datosReq, tipoTraslado: tipoTraslado },
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
        //     1,
        //     datosReqAux.documentos,
        //     datosFlete.sucDestino
        //   ),
        // },
      };
      const reqEnviarParsed = {
        ...reqEnviarFinal,
        forQueryDB: parsForQueryDB(reqEnviarFinal),
      };
      batch.set(nuevoDocumentoRef, reqEnviarParsed);
      // batch.set(nuevoDocumentoRef, { ...reqEnviarFinal });

      // Las solicitudes de traslado no deben tener calificador para clientes
      // // Subcoleccion, esto sera de acceso publico; por ahora solo para las review de cliente
      // const subcoleccionRef = doc(
      //   collection(db, "reviewClientes"),
      //   nuevoDocumentoRef.id
      // );

      // batch.set(subcoleccionRef, {
      //   nombre: "",
      //   numero: "",
      //   puntuacion: 0,
      //   comentarios: "",
      //   fecha: "",
      //   id: nuevoDocumentoRef.id,
      //   numeroSolicitud: nuevoNumero,
      //   cliente: datosReq.socioNegocio,
      // });

      if (nuevoNumero > 100000) {
        await batch.commit();
        console.log(datosReq);
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
        setDatosMontos([]);

        setDatosReq({ ...reqSchema.datosReq });
        setDatosFlete({ ...reqSchema.datosFlete });
        setResetValue(!resetValue);
        setTipoTraslado([...initialTipoSolicitud]);
        setFaltanObligatorios(false);
        setIsLoading(false);
        setMensajeAlerta("Solicitud de traslado enviada.");
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
      <TituloModulo>Datos Flete:</TituloModulo>
      <WrapModule>
        <MainFlete
          tipoSolicitud={tipoSolicitud}
          resetValue={resetValue}
          setDatosFlete={setDatosFlete}
          datosFlete={datosFlete}
          datosMontos={datosMontos}
          setDatosMontos={setDatosMontos}
          userMaster={userMaster}
        />
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
              modo={"creacion"}
            />
          </WrapModule>
        </>
      )}
      <TituloModulo>Datos Solicitud:</TituloModulo>
      <CajaBtn>
        <OpcionUnica
          titulo="Tipo de traslado"
          name="tipoTraslado"
          arrayOpciones={tipoTraslado}
          handleOpciones={handleOpciones}
          flete={true}
          masPeque={true}
        />
      </CajaBtn>
      <WrapModule>
        <MoldeDatosReq
          datosReq={datosReq}
          setDatosReq={setDatosReq}
          userMaster={userMaster}
          tipo={tipoSolicitud}
          faltanObligatorios={faltanObligatorios}
          tipoTraslado={tipoTraslado}
          datosFlete={datosFlete}
          destinatarios={destinatarios}
          setDestinatarios={setDestinatarios}
          opcionAlmacen={opcionAlmacen}
          setOpcionAlmacen={setOpcionAlmacen}
          //
        />
      </WrapModule>

      <WrapModule>
        <BtnNormal onClick={() => enviarReq()}>Enviar</BtnNormal>
      </WrapModule>

      {isLoading ? <ModalLoading completa={true} /> : ""}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </Container>
  );
}
const Container = styled.div``;
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
const CajaBtn = styled.div`
  padding-left: 25px;
`;
