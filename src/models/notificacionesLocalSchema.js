import { personSchema } from "./mixSchema";

export const diccionarioTipo = [
  {
    code: "likePerfil",
    texto: "Tu perfil ",
  },
  {
    code: "likeReview",
    texto: "Tu reseña ",
  },
  {
    code: "likeCurious",
    texto: "Tu dato curioso ",
  },
  {
    code: "commentCurious",
    texto: "Tu dato curioso ",
  },
];
const textoEnd = "ha recibido un me gusta.";
export const notificacionesLocalSchema = {
  createBy: "",
  createdAt: "",
  // 0-Sin visualizar
  // 1-Visualizada
  estadoDoc: "",
  //likePerfil01-Cuando el usuario recibe un like a su perfil
  //likeReview-Cuando el usuario recibe un like a una reseña
  //likeCurious-Like a dato curioso
  tipoDoc: "",
  enlace: "",
  texto: "",
  textEnd: " ",
  usuarioCreador: personSchema,
  usuarioDestino: personSchema,
};
