import { useState } from "react";
import styled from "styled-components";
import Crear01Entrega from "./TiposReqAdd/Crear01Entrega";
import Crear02Traslado from "./TiposReqAdd/Crear02Traslado";
import Crear03RetiroObra from "./TiposReqAdd/Crear03RetiroObra";
import Crear04RetiroProveedor from "./TiposReqAdd/Crear04RetiroProveedor";
import { useAuth } from "../../context/AuthContext";
import {
  fetchDocsByConditionGetDocs,
  useDocById,
} from "../../libs/useDocByCondition";
import MenuPestannias from "../../components/MenuPestannias";
import { Link } from "react-router-dom";
import { Alerta } from "../../components/Alerta";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { ClearTheme, Tema } from "../../config/theme";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { reqSchema } from "../schemas/reqSchema";
import { Departamentos } from "../../components/corporativo/Corporativo";

export default function AddReq({ userMaster }) {
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const tiposSolicitudes = [
    0, //"entrega",
    1, //"traslado",
    2, //"retiroObra",
    3, //"retiroProveedor",
  ];
  const [tipoSolicitud, setTipoSolicitud] = useState(tiposSolicitudes[0]);

  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Entrega",
      select: true,
    },
    {
      nombre: "Traslado",
      select: false,
    },
    {
      nombre: "Retiro obra",
      select: false,
    },
    {
      nombre: "Retiro Proveedor",
      select: false,
    },
    {
      nombre: "Plantillas",
      select: false,
    },
  ]);

  const handlePestannias = (e) => {
    let index = Number(e.target.dataset.id);
    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
    setTipoSolicitud(tiposSolicitudes[index]);
  };
  // ************** COPIAR PLANTILLA **************
  const [listaReqFind, setListaRequestFind] = useState({});
  const [plantilla, setPlantilla] = useState(null);
  const userAuth = useAuth().usuario;

  const [usuario, setUsuario] = useState(userAuth);
  const ejecutarPlantilla = async (e) => {
    const collectionName = "transferRequest";
    const numeroDataset = Number(e.target.dataset.numero);

    // TRAEME LA PLANTILLA DE LA BASE DE DATOS
    // EL ESTADO DE REQUESTMASTE PONLO CON DATOS DE LA PLANTILLA
    // CAMBIA A LA PESTAÑA CORRESPONDIENTE
    console.log("DB 😐😐😐😐😐" + collectionName);
    if (usuario) {
      try {
        const solicitudBuscar = await fetchDocsByConditionGetDocs(
          collectionName,
          setListaRequestFind,
          "numeroDoc",
          "==",
          numeroDataset
        );
        const reqFind = solicitudBuscar[0];
        setPlantilla(reqFind);
        const tipoReq = reqFind.tipo;

        setArrayOpciones((prevOpciones) =>
          prevOpciones.map((opcion, i) => ({
            ...opcion,
            select: i === tipoReq,
          }))
        );
        setTipoSolicitud(tiposSolicitudes[tipoReq]);
      } catch (error) {
        console.log(error);
        setMensajeAlerta("Error 1 con la base de datos.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
    }
  };
  const eliminarPlantilla = async (e) => {
    const collectionName = "transferRequest";
    const numeroDataset = Number(e.target.dataset.numero);

    // TRAEME LA PLANTILLA DE LA BASE DE DATOS
    // EL ESTADO DE REQUESTMASTE PONLO CON DATOS DE LA PLANTILLA
    // CAMBIA A LA PESTAÑA CORRESPONDIENTE
    console.log("DB 😐😐😐😐😐" + collectionName);
    if (usuario) {
      try {
        const plantillasReq = userMaster.plantillas.solicitudTransporte.filter(
          (req) => {
            if (req.numero != numeroDataset) {
              return req;
            }
          }
        );
        const usuarioAfectar = doc(db, "usuarios", userMaster.id);
        await updateDoc(usuarioAfectar, {
          "plantillas.solicitudTransporte": plantillasReq,
        });
      } catch (error) {
        console.log(error);
        setMensajeAlerta("Error 1 con la base de datos.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
    }
  };

  // ************** Extraer codigo almacenes **************
  const parsForQueryDB = (request) => {
    //🟢 ***************** ALMACENES *****************
    const codigosArray = [];

    // Agregale los almacenes de los documentos si no es retiro obra
    if (tipoSolicitud != 2) {
      // const
      codigosArray.push(
        ...request.datosReq.documentos.map((doc) => doc.bodega)
      );
    }

    // Si es traslado, agregale codigo de suc origen y suc destino
    if (tipoSolicitud == 1) {
      codigosArray.push(request.datosFlete.sucDestino.codigoInterno);
    }
    codigosArray.push(
      request.datosFlete?.puntoPartidaSeleccionado?.codigoInterno
    );

    // Agregale el almacen del usuario
    codigosArray.push(userMaster.localidad.codigoInterno);

    //🟢 ***************** DEPARTAMENTO *****************
    const dptosUsers = [];
    // Agrega el departamento del usuario
    // console.log(codigodptoUser)
    const codigodptoUser2 = Departamentos.find(
      (dpto) => dpto.nombre == userMaster.dpto
    );
    console.log(userMaster);
    console.log(codigodptoUser2);
    const codigodptoUser = Departamentos.find(
      (dpto) => dpto.nombre == userMaster.dpto
    ).codigoInterno;
    console.log(codigodptoUser);
    dptosUsers.push(codigodptoUser);

    //🟢 ***************** USUARIOS *****************
    let usuarios = [];

    // Agrega los usuarios de notificaciones
    const usuarioDestino = request.datosReq.destinatariosNotificacion.map(
      (user) => user.correo
    );
    usuarios.push(...usuarioDestino);
    usuarios.push(userMaster.correo);

    return {
      ...reqSchema.forQueryDB,
      // Quitar duplicados y vacios
      almacenes: [...new Set(codigosArray)].filter(Boolean),
      departamentos: [...new Set(dptosUsers)].filter(Boolean),
      usuarios: [...new Set(usuarios)].filter(Boolean),
    };
  };

  // DATOS MOLDE DATOS

  const [destinatarios, setDestinatarios] = useState([]);
  return (
    <>
      {/* <EnviarEmailJSX /> */}
      {/* <BotonQuery userMaster={userMaster} /> */}
      <ContainerTipo>
        {/* <OpcionUnica
          titulo="Tipo:"
          name="grupoB"
          arrayOpciones={arrayOpciones}
          handleOpciones={handleOpciones}
        /> */}
        <MenuPestannias
          handlePestannias={handlePestannias}
          arrayOpciones={arrayOpciones}
        />
      </ContainerTipo>
      {arrayOpciones[0].select ? (
        <Crear01Entrega
          userMaster={userMaster}
          tipoSolicitud={tipoSolicitud}
          plantilla={plantilla}
          parsForQueryDB={parsForQueryDB}
          destinatarios={destinatarios}
          setDestinatarios={setDestinatarios}
        />
      ) : arrayOpciones[1].select ? (
        <Crear02Traslado
          userMaster={userMaster}
          tipoSolicitud={tipoSolicitud}
          plantilla={plantilla}
          parsForQueryDB={parsForQueryDB}
          destinatarios={destinatarios}
          setDestinatarios={setDestinatarios}
        />
      ) : arrayOpciones[2].select ? (
        <Crear03RetiroObra
          userMaster={userMaster}
          tipoSolicitud={tipoSolicitud}
          plantilla={plantilla}
          parsForQueryDB={parsForQueryDB}
          destinatarios={destinatarios}
          setDestinatarios={setDestinatarios}
        />
      ) : arrayOpciones[3].select ? (
        <Crear04RetiroProveedor
          userMaster={userMaster}
          tipoSolicitud={tipoSolicitud}
          plantilla={plantilla}
          parsForQueryDB={parsForQueryDB}
          destinatarios={destinatarios}
          setDestinatarios={setDestinatarios}
        />
      ) : arrayOpciones[4].select ? (
        <CajaPlantillas>
          {userMaster?.plantillas?.solicitudTransporte?.length > 0 ? (
            <CajaTabla>
              <Tabla>
                <thead>
                  <Filas className="cabeza">
                    <CeldaHead>N°</CeldaHead>
                    <CeldaHead>Numero</CeldaHead>
                    <CeldaHead>Tipo</CeldaHead>
                    <CeldaHead>Cliente</CeldaHead>
                    <CeldaHead>Fecha add</CeldaHead>
                    <CeldaHead>Utilizar</CeldaHead>
                    <CeldaHead>Eliminar</CeldaHead>
                  </Filas>
                </thead>
                <tbody>
                  {userMaster?.plantillas?.solicitudTransporte?.map(
                    (request, index) => {
                      return (
                        <Filas
                          key={index}
                          className={`
                        body
                        ${index % 2 ? "inpar" : "par"}
                        `}
                        >
                          <CeldasBody className={index % 2 ? "inpar" : "par"}>
                            {index + 1}
                          </CeldasBody>
                          <CeldasBody className={index % 2 ? "inpar" : "par"}>
                            <Enlaces
                              target="_blank"
                              to={`/transportes/maestros/solicitudes/${request.numero}`}
                            >
                              {request.numero}
                            </Enlaces>
                          </CeldasBody>

                          <CeldasBody className={index % 2 ? "inpar" : "par"}>
                            {" "}
                            {request.tipo == 0
                              ? "Entrega"
                              : request.tipo == 1
                                ? "Traslado"
                                : request.tipo == 2
                                  ? "Retiro obra"
                                  : request.tipo == 3
                                    ? "Retiro Proveedor"
                                    : ""}
                          </CeldasBody>
                          <CeldasBody className={index % 2 ? "inpar" : "par"}>
                            {request.cliente}
                          </CeldasBody>
                          <CeldasBody className={index % 2 ? "inpar" : "par"}>
                            {request.fechaAdd.slice(0, 10)}
                          </CeldasBody>

                          <CeldasBody
                            data-id={request.id}
                            data-numero={request.numero}
                            onClick={(e) => ejecutarPlantilla(e)}
                            className={`accion
                              ${index % 2 ? "inpar" : "par"}
                              `}
                            name="accion"
                          >
                            📄
                          </CeldasBody>
                          <CeldasBody
                            data-id={request.id}
                            data-numero={request.numero}
                            onClick={(e) => eliminarPlantilla(e)}
                            className={`accion2
                              
                              ${index % 2 ? "inpar" : "par"}
                              `}
                            name="eliminar"
                          >
                            ❌
                          </CeldasBody>
                        </Filas>
                      );
                    }
                  )}
                </tbody>
              </Tabla>
            </CajaTabla>
          ) : (
            <ParrafoSimple>No tiene plantillas guardadas.</ParrafoSimple>
          )}
        </CajaPlantillas>
      ) : (
        ""
      )}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
}
const CajaBtnEnviarCorreo = styled.div`
  width: 100%;
  height: 100px;
  background-color: ${ClearTheme.secondary.azulSuave};
  display: flex;
  justify-content: center;
  align-items: center;
`;
const BotonEnviarCorreo = styled(BtnGeneralButton)``;
const ContainerTipo = styled.div`
  margin-bottom: 15px;
  /* border: 1px solid red; */
`;
const CajaPlantillas = styled.div`
  width: 100%;
  min-height: 200px;
`;

const CajaTabla = styled.div`
  overflow-x: scroll;
  width: 100%;
  padding: 0 20px;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
`;

const Filas = styled.tr`
  &.body {
    font-weight: normal;
    /* border-bottom: 1px solid #49444457; */
    border: none;
    background-color: ${ClearTheme.secondary.azulSuave};
    color: #00496b;
    background-color: white;
  }

  &.cabeza {
    background-color: ${ClearTheme.secondary.azulSuaveOsc};
    color: white;
  }
  color: ${Tema.neutral.blancoHueso};
  &.inpar {
    background-color: #e1eef4;
    font-weight: bold;
  }
  &:hover {
    background-color: #bdbdbd;
    background-color: ${ClearTheme.neutral.blancoAzul};
    /* background-color: #183f6e; */
    /* background-color: ${ClearTheme.secondary.azulSuave2}; */
  }
`;

const CeldaHead2 = styled.th`
  border-bottom: 1px solid red;
  padding: 3px 7px;
  text-align: center;
  border: 1px solid ${Tema.neutral.blancoHueso};

  font-size: 1rem;
`;
const CeldasBody2 = styled.td`
  font-size: 1rem;
  border: 1px solid black;
  height: 35px;

  text-align: center;
  &.proveedor {
    text-align: start;
    padding-left: 5px;
  }
  &.accion {
    cursor: pointer;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  &.accion2 {
    cursor: pointer;
    /* display: flex; */
    justify-content: space-evenly;
    align-items: center;
  }
`;

const CeldaHead = styled.th`
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  border-left: #0070a8;
  height: 25px;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0.05, #006699),
    color-stop(1, #00557f)
  );
`;
const CeldasBody = styled.td`
  font-size: 15px;
  font-weight: 400;
  /* border: 1px solid black; */
  height: 25px;
  text-align: center;
  &.par {
    border-left: 1px solid #e1eef4;
  }
  &.accion {
    cursor: pointer;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  &.accion2 {
    cursor: pointer;
    /* display: flex; */
    justify-content: space-evenly;
    align-items: center;
  }
`;

const Enlaces = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const ParrafoSimple = styled.h3`
  color: white;
  font-weight: 400;
  text-align: center;
`;
