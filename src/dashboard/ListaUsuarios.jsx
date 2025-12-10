// Mostrar usuarios desde el dashboard, con acceso a editar privilegios y demas
import { BotonQuery } from "../components/BotonQuery";
import { Header } from "../components/Header";
import { DetalleUsuarios } from "./DetalleUsuarios";

export const ListaUsuarios = ({ useDocByCondition, userMaster }) => {
  return (
    <>
      {/* <Header titulo="Usuarios" /> */}
      <DetalleUsuarios
        useDocByCondition={useDocByCondition}
        userMaster={userMaster}
      />
    </>
  );
};
