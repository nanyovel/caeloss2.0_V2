// Este componente lo utilizo para mostrar elemento a usuarios con el priviligio determinado

import { useState } from "react";
import { useAuth } from "./AuthContext";

export const ElementoPrivilegiado = ({
  children,
  userMaster,
  privilegioReq,
  listaPrivilegio,
}) => {
  const userAuth = useAuth().usuario;

  const [usuario, setUsuario] = useState(userAuth);
  if (usuario && userMaster) {
    const hasPrivilegio = userMaster.permisos.includes(privilegioReq);
    const listaRecorrer = listaPrivilegio || [];
    const someLista = listaRecorrer.some((pri) =>
      userMaster.permisos.includes(pri)
    );
    // privilegioEstados.some
    return hasPrivilegio || someLista ? children : null;
  }
};
// let accesEstados = privilegioEstados.some(pri => userMaster.permisos.includes(pri));
// FORMA ANTERIOR
// SE DEJO DE UTILIZAR EL 7/1/2024
// export const ElementoPrivilegiado = ({
//   children,
//   userMaster,
//   privilegioReq,
// }) => {

//   if (userMaster) {

// const tienePrivilegio = userMaster?.privilegios?.some(
//   (privilegio) =>
//     privilegio.code === privilegioReq && privilegio.valor === true
// );
// return tienePrivilegio ? children : null;

//   }
// };
