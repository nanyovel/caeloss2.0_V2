import React from "react";
import { Route, Routes } from "react-router-dom";

import { RutaPrivilegiada } from "./../context/RutaPrivilegiada";
import { Home } from "./../page/Home.jsx";
import { RutaProtegida } from "./../context/RutaProtegida";
import { ResetPass } from "./../auth/ResetPass";
import { Dashboard } from "./../dashboard/Dashboard";

import { Transportes } from "./../transportes/Transportes";
import { Register } from "./../auth/Register.jsx";
import { Login } from "./../auth/Login";
import { LogOut } from "./../auth/LogOut";
import { Page404 } from "./../page/Page404";
import { Fletes } from "./../fletes/Fletes";
import { SetupFletes } from "./../fletes/page/Setup";
import { ListaPage } from "./../materiales/page/ListaPage";
import ImportacionesApp from "../importaciones/ImportacionesApp.jsx";
import { NoCorreos } from "../nocorreos/NoCorreos.jsx";
import PageCalificar from "../transportes/page/PageCalificar.jsx";
import Registrador from "../registradorPerdidaVentas/Perdida.jsx";
import Articulos from "../articulos/Articulos.jsx";
import { Mantenimiento } from "../mantenimiento/Mantenimiento.jsx";
import { PantallaEditable } from "./PantallaEditable.jsx";
import { Omar } from "../omar/Omar.jsx";
import { DetalleUnPerfil } from "../auth/DetalleUnPerfil.jsx";
import { MiPerfil } from "../page/MiPerfil.jsx";
import { Documentacion } from "../page/Home/documentacion/Documentacion.jsx";
import { Tutoriales } from "../page/Home/tutoriales/Tutoriales.jsx";
import DatosCuriosos from "../page/Home/DatoCurioso/DatosCuriosos.jsx";

export const MasterRoutes = ({
  usuario,
  setDBTutoriales,
  dbUsuario,
  dbTutoriales,
  userMaster,
  dbResennias,
  dbBillOfLading,
  setDBBillOfLading,
  dbOrdenes,
  setDBOrdenes,
  // Nuevas colecciones SGI

  setDBGlobalFurgones,
  dbGlobalFurgones,
  setDBGlobalOrdenes,
  dbGlobalOrdenes,
  dbGlobalBL,
  setDBGlobalBL,
  //
  dbOmarMiguel,
  setDBOmarMiguel,
  setDBUsuario,
  setUserMaster,
  setDBResennias,
  setDBValoresUV,
  dbValoresUV,
  setDBTransferRequest,
  dbUsuarios,
  dbVehiculos,
  setDBUsuarios,
  setDBVehiculos,
  dbTransferRequest,
  setDBChoferes,
  dbChoferes,
  // choferes internos
  congloPagosInternos,
  setCongloPagosInternos,
  congloPagosExtInd,
  setCongloPagosExtInd,
  congloPagosExtEmp,
  setCongloPagosExtEmp,
  //
  // Sistema de gestion de mantenimiento
  equiposDB,
  setEquiposDB,
}) => {
  let lugar = location.pathname;

  return (
    <Routes>
      <Route
        path="/omar/"
        element={
          <RutaProtegida>
            <Omar
              dbBillOfLading={dbBillOfLading}
              dbOrdenes={dbOrdenes}
              setDBBillOfLading={setDBBillOfLading}
              setDBOrdenes={setDBOrdenes}
              dbUsuario={dbUsuario}
              userMaster={userMaster}
              // Nuevas colecciones
              setDBGlobalFurgones={setDBGlobalFurgones}
              dbGlobalFurgones={dbGlobalFurgones}
              setDBGlobalOrdenes={setDBGlobalOrdenes}
              dbGlobalOrdenes={dbGlobalOrdenes}
              dbGlobalBL={dbGlobalBL}
              setDBGlobalBL={setDBGlobalBL}
            />
          </RutaProtegida>
        }
      />
      <Route path="/editable" element={<PantallaEditable />} />
      {/* <Route path="/openHouse" element={<PantallaEditable2 />} /> */}
      <Route
        path="/"
        element={
          <RutaProtegida>
            <Home
              usuario={usuario}
              setDBUsuario={setDBUsuario}
              setDBTutoriales={setDBTutoriales}
              dbUsuario={dbUsuario}
              dbTutoriales={dbTutoriales}
              userMaster={userMaster}
              dbResennias={dbResennias}
              setDBResennias={setDBResennias}
            />
          </RutaProtegida>
        }
      />
      {lugar !== "/version1" ? <Route path="*" element={<Page404 />} /> : ""}

      <Route
        path="/perfiles/:id"
        element={
          <RutaProtegida>
            <DetalleUnPerfil
              dbUsuario={dbUsuario}
              setDBUsuario={setDBUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }
      />

      <Route
        path="/calculadora"
        element={
          <RutaProtegida>
            <ListaPage />
          </RutaProtegida>
        }
      />

      <Route
        path="/calculadora/:id"
        element={
          <RutaProtegida>
            <ListaPage userMaster={userMaster} />
          </RutaProtegida>
        }
      />

      <Route
        path="/fletes"
        element={
          <RutaProtegida>
            <Fletes
              dbUsuario={dbUsuario}
              userMaster={userMaster}
              setDBValoresUV={setDBValoresUV}
              dbValoresUV={dbValoresUV}
            />
          </RutaProtegida>
        }
      />

      <Route
        path="/fletes/setup/"
        element={
          <RutaProtegida>
            <RutaPrivilegiada
              userMaster={userMaster}
              privilegioReq={"viewConfigFlete"}
            >
              <SetupFletes
                dbBillOfLading={dbBillOfLading}
                setDBBillOfLading={setDBBillOfLading}
                dbOrdenes={dbOrdenes}
                setDBOrdenes={setDBOrdenes}
                dbUsuario={dbUsuario}
                userMaster={userMaster}
                setDBValoresUV={setDBValoresUV}
                dbValoresUV={dbValoresUV}
              />
            </RutaPrivilegiada>
          </RutaProtegida>
        }
      />

      <Route
        path="/importaciones/*"
        element={
          <RutaProtegida>
            <ImportacionesApp
              dbBillOfLading={dbBillOfLading}
              dbOrdenes={dbOrdenes}
              setDBBillOfLading={setDBBillOfLading}
              setDBOrdenes={setDBOrdenes}
              dbUsuario={dbUsuario}
              userMaster={userMaster}
              // Nuevas colecciones
              setDBGlobalFurgones={setDBGlobalFurgones}
              dbGlobalFurgones={dbGlobalFurgones}
              setDBGlobalOrdenes={setDBGlobalOrdenes}
              dbGlobalOrdenes={dbGlobalOrdenes}
              dbGlobalBL={dbGlobalBL}
              setDBGlobalBL={setDBGlobalBL}
            />
          </RutaProtegida>
        }
      />
      <Route
        path="/transportes/*"
        element={
          <RutaProtegida>
            <Transportes
              userMaster={userMaster}
              usuario={usuario}
              setDBTransferRequest={setDBTransferRequest}
              dbUsuarios={dbUsuarios}
              dbVehiculos={dbVehiculos}
              setDBUsuarios={setDBUsuarios}
              setDBVehiculos={setDBVehiculos}
              dbTransferRequest={dbTransferRequest}
              setDBChoferes={setDBChoferes}
              dbChoferes={dbChoferes}
              // Choferes internos
              congloPagosInternos={congloPagosInternos}
              setCongloPagosInternos={setCongloPagosInternos}
              // Choferes ext inde
              congloPagosExtInd={congloPagosExtInd}
              setCongloPagosExtInd={setCongloPagosExtInd}
              // CHoferes ext empresa
              congloPagosExtEmp={congloPagosExtEmp}
              setCongloPagosExtEmp={setCongloPagosExtEmp}
            />
          </RutaProtegida>
        }
      />

      <Route
        path="/tutoriales"
        element={
          <RutaProtegida>
            <Tutoriales
              setDBTutoriales={setDBTutoriales}
              dbTutoriales={dbTutoriales}
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }
      />
      <Route
        path="/curioso"
        element={
          <RutaProtegida>
            <DatosCuriosos
              setDBTutoriales={setDBTutoriales}
              dbTutoriales={dbTutoriales}
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }
      />

      <Route
        path="/tutoriales/:id"
        element={
          <RutaProtegida>
            <Tutoriales
              setDBTutoriales={setDBTutoriales}
              dbTutoriales={dbTutoriales}
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }
      />
      <Route
        path="/perdida/"
        element={
          <RutaProtegida>
            <Registrador
              setDBTutoriales={setDBTutoriales}
              dbTutoriales={dbTutoriales}
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }
      />
      <Route
        path="/documentacion"
        element={
          <RutaProtegida>
            <Documentacion />
          </RutaProtegida>
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <RutaProtegida>
            <RutaPrivilegiada
              userMaster={userMaster}
              privilegioReq="singleDashboard"
            >
              <Dashboard userMaster={userMaster} />
            </RutaPrivilegiada>
          </RutaProtegida>
        }
      />
      <Route
        path="/articulos/*"
        element={
          <RutaProtegida>
            <Articulos userMaster={userMaster} />
          </RutaProtegida>
        }
      />
      <Route
        path="/mantenimiento/*"
        element={
          <RutaProtegida>
            <Mantenimiento
              userMaster={userMaster}
              equiposDB={equiposDB}
              setEquiposDB={setEquiposDB}
            />
          </RutaProtegida>
        }
      />
      <Route path="/transportes/resennias/:id" element={<PageCalificar />} />
      <Route path="/nocorreos" element={<NoCorreos />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/acceder" element={<Login />} />
      <Route path="/logout" element={<LogOut />} />
      <Route path="/recuperar" element={<ResetPass />} />
      <Route
        path="/perfil"
        element={
          <RutaProtegida>
            <MiPerfil
              dbUsuario={dbUsuario}
              userMaster={userMaster}
              setUserMaster={setUserMaster}
            />
          </RutaProtegida>
        }
      />
    </Routes>
  );
};
// 480
