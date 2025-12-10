// Utilizo este componente para mostrar en pantalla elemento solo a personas que hallan iniciado sesion, este componente es de poco uso, dado a que
// basicamente si el usuario no ha iniciado sesion sera enviado a la pagina /acceder,

import { useAuth } from "./AuthContext";

// export const Autenticado = ({ children }) => {
export const ElementoProtegido = ({ children }) => {
  const { usuario } = useAuth();
  if (usuario) {
    return usuario.emailVerified == true ? children : null;
  } else {
    return null;
  }
};
