import { personSchema } from "./mixSchema";

export const curiosoSchema = {
  // La propiedad num es para que cada uno tenga un numero que empieza en 1 y el cual correspondera a 9 dias para cada dato curioso, la idea es programar esto que aparezcan de manera automatica
  num: "", //
  modulo: "",
  createdAt: "",
  titulo: "", //
  texto: "", //

  usuario: {
    //
    ...personSchema,
  },
  likes: [
    // likeSchema
  ],
  comentarios: [
    //   comentarioShema
  ],
};
