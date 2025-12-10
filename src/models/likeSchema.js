import { personSchema } from "./mixSchema";

export const likeSchema = {
  createdAt: "",
  createdBy: "",
  //likePerfil-Like a su perfil
  //likeReview-Like a una reseña
  //likeCurious-Like a dato curioso
  tipoDoc: "",
  idRef: "",

  usuarioCreador: personSchema,
};

export const likePerfilSchema = {
  ...likeSchema,
  usuarioDestino: personSchema,
};
