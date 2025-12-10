import { useLocation, useNavigate } from "react-router-dom";
import "./app.css";
import { MenuLateral } from "./components/MenuLateral";
import ContenedorPrincipal from "./components/ContenedorPrincipal";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./context/AuthContext";

import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import db from "./firebase/firebaseConfig";
import { MasterRoutes } from "./routes/MasterRoutes";
import styled from "styled-components";
import { BotonQuery } from "./components/BotonQuery";
import {
  useDocByArrayCondition,
  useDocByCondition,
} from "./libs/useDocByCondition";

const App = () => {
  function useAppVersionCheck() {
    useEffect(() => {
      const currentVersion = "2.0.1"; // Esta versión debe coincidir con version.json

      const checkVersion = async () => {
        try {
          const res = await fetch("/version.json?_=" + new Date().getTime()); // Evita caché
          const data = await res.json();

          if (data.version !== currentVersion) {
            console.log("Nueva versión detectada. Recargando...");
            window.location.reload(true); // Recarga forzada
          }
        } catch (err) {
          console.error("Error al verificar versión", err);
        }
      };

      const interval = setInterval(checkVersion, 1000); // Verifica cada 10 segundos

      return () => clearInterval(interval);
    }, []);
  }
  useAppVersionCheck();
  // ******************** RECURSOS GENERALES ******************** //
  const userAuth = useAuth().usuario;
  // como
  const [usuario, setUsuario] = useState(userAuth);
  const [userMaster, setUserMaster] = useState();

  useEffect(() => {
    setUsuario(userAuth);
  }, [userAuth]);

  let location = useLocation();
  let lugar = location.pathname;

  // // ******************** OBTENIENDO LAS BASES DE DATOS ******************** //
  const [dbBillOfLading, setDBBillOfLading] = useState([]);
  const [dbOrdenes, setDBOrdenes] = useState([]);
  const [dbUsuario, setDBUsuario] = useState([]);
  const [dbResennias, setDBResennias] = useState([]);
  const [dbTutoriales, setDBTutoriales] = useState([]);

  // Nuevas coleccion de base de datos
  const [dbGlobalFurgones, setDBGlobalFurgones] = useState([]);
  const [dbGlobalOrdenes, setDBGlobalOrdenes] = useState([]);
  const [dbGlobalBL, setDBGlobalBL] = useState([]);
  // Unidades vehiculares
  // ****** SISTEMA DE GESTION DE TRANSPORTE TMS ******
  const [dbValoresUV, setDBValoresUV] = useState([]);

  const [dbTransferRequest, setDBTransferRequest] = useState([]);
  // *****Reportes pagos****
  const [congloPagosInternos, setCongloPagosInternos] = useState([]);
  const [congloPagosExtInd, setCongloPagosExtInd] = useState([]);
  const [congloPagosExtEmp, setCongloPagosExtEmp] = useState([]);

  const [dbChoferes, setDBChoferes] = useState([]);
  const [dbUsuarios, setDBUsuarios] = useState([]);
  const [dbVehiculos, setDBVehiculos] = useState([]);

  // ****** SISTEMA DE GESTION DE MANTENIMIENTO SGM ******
  const [equiposDB, setEquiposDB] = useState([]);

  // ************************** DAME SOLO UN DOC POR ID**************************
  const useDocById = (collectionName, setState, idUsuario) => {
    useEffect(() => {
      if (usuario) {
        const unsub = onSnapshot(doc(db, collectionName, idUsuario), (doc) => {
          setState({ ...doc.data(), id: doc.id });
        });
        // Devolver una función de limpieza para detener la escucha cuando el componente se desmonte
        return () => unsub();
      }
    }, [collectionName, setState, idUsuario]);
  };
  // useDocByCondition("ordenesCompra", setDBOrdenes);

  // useDocByCondition("resennias", setDBResennias, "estadoDoc", "==", 0);
  // useDocByCondition("billOfLading", setDBBillOfLading, "estadoDoc", "==", 0);
  // useDocByCondition("tutoriales", setDBTutoriales);
  let idUsuario = usuario?.uid ? usuario.uid : "00";
  const [userAux, setUserAux] = useState(null);
  useDocById("usuarios", setUserAux, idUsuario);

  const [notificacionesDB, setNotificacionesDB] = useState([]);
  const condiciones = [
    {
      campo: "estadoDoc",
      condicion: "==",
      valor: 0,
    },
    {
      campo: "usuarioDestino.id",
      condicion: "==",
      valor: idUsuario,
    },
  ];
  useDocByArrayCondition(
    "notificacionesLocal",
    setNotificacionesDB,
    condiciones
  );
  useEffect(() => {
    if (userAux) {
      // const notifiCaciones
      const userParsed = {
        ...userAux,
        notificaciones: notificacionesDB,
      };
      setUserMaster(userParsed);
    }
  }, [userAux, notificacionesDB]);

  // Hacer que los usuarios completen sus datos
  const [datosIncompletos, setDatosIncompletos] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (usuario?.emailVerified && userMaster) {
      if (
        userMaster.nombre == "" ||
        userMaster.apellido == "" ||
        userMaster.dpto == "" ||
        userMaster.posicion == "" ||
        userMaster.sucursal == ""
      ) {
        setDatosIncompletos(true);
        if (location.pathname == "/perfil") {
          setHasModal(false);
        } else {
          setHasModal(true);
        }
        // console.log(navigate());
      }
    }
  }, [usuario, userMaster]);

  const [hasModal, setHasModal] = useState(false);

  const goPerfil = () => {
    navigate("/perfil");
    setHasModal(false);
  };

  return (
    <ContenedorPrincipal>
      {usuario && <MenuLateral userMaster={userMaster} />}

      <MasterRoutes
        usuario={usuario}
        dbTutoriales={dbTutoriales}
        setDBTutoriales={setDBTutoriales}
        dbUsuario={dbUsuario}
        userMaster={userMaster}
        dbResennias={dbResennias}
        dbBillOfLading={dbBillOfLading}
        setDBBillOfLading={setDBBillOfLading}
        dbOrdenes={dbOrdenes}
        setDBOrdenes={setDBOrdenes}
        // Nuevas colecciones Sistema gestion de Importaciones
        setDBGlobalFurgones={setDBGlobalFurgones}
        dbGlobalFurgones={dbGlobalFurgones}
        setDBGlobalOrdenes={setDBGlobalOrdenes}
        dbGlobalOrdenes={dbGlobalOrdenes}
        dbGlobalBL={dbGlobalBL}
        setDBGlobalBL={setDBGlobalBL}
        //
        setDBUsuario={setDBUsuario}
        setUserMaster={setUserMaster}
        setDBResennias={setDBResennias}
        setDBValoresUV={setDBValoresUV}
        dbValoresUV={dbValoresUV}
        setDBTransferRequest={setDBTransferRequest}
        dbUsuarios={dbUsuarios}
        dbVehiculos={dbVehiculos}
        setDBUsuarios={setDBUsuarios}
        setDBVehiculos={setDBVehiculos}
        dbTransferRequest={dbTransferRequest}
        setDBChoferes={setDBChoferes}
        dbChoferes={dbChoferes}
        // CHoferes interno
        congloPagosInternos={congloPagosInternos}
        setCongloPagosInternos={setCongloPagosInternos}
        // CHoferes ext independiente
        congloPagosExtInd={congloPagosExtInd}
        setCongloPagosExtInd={setCongloPagosExtInd}
        // CHoferes ext empresa
        congloPagosExtEmp={congloPagosExtEmp}
        setCongloPagosExtEmp={setCongloPagosExtEmp}
        //
        // SISTEMA DE GESTION DE MANTENIMIENTO
        equiposDB={equiposDB}
        setEquiposDB={setEquiposDB}
      />

      {lugar == "/" ? "" : ""}
    </ContenedorPrincipal>
  );
};
export default App;
const CajaBtnModal = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
