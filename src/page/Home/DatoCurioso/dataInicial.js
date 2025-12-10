import { doc, updateDoc } from "firebase/firestore";
import { ES6AFormat } from "../../../libs/FechaFormat";
import { curiosoSchema } from "../../../models/curiosoSchema";
import db from "../../../firebase/firebaseConfig";
import { personSchema } from "../../../models/mixSchema";

const plantilla = {
  ...curiosoSchema,
  modulo: "TMS",
  createdBy: "jperez",
  createdAt: ES6AFormat(new Date()),
  dpto: "Ventas",
};
export const arrayDatoCurioso = [
  {
    ...plantilla,
    titulo: "Esto es una prueba...",
    texto: "Esto es un dato curioso de prueba",
    num: 7,
    usuario: {
      ...personSchema,
      urlFotoPerfil:
        "https://firebasestorage.googleapis.com/v0/b/caelossoficial.appspot.com/o/avatars%2FfotoPerfiljperez?alt=media&token=0664c291-2d36-4b7d-ba53-bc180043c1e9",
      userName: "jperez",
      nombre: "Jose",
      apellido: "Perez ",
      genero: "masculino",
      id: "nQseHZLObmU6bQEdZD0atgSGbae2",
    },
  },
  {
    ...plantilla,
    titulo: "El usuario que más solicitud envió",
    texto:
      "El usuario que más envió solicitudes fue Alexander Escolástico, con un total de 152 solicitudes, siendo el 10% del total.",
    num: 1,
    usuario: {
      ...personSchema,
      urlFotoPerfil:
        "https://firebasestorage.googleapis.com/v0/b/caelossoficial.appspot.com/o/avatars%2FfotoPerfilaescolastico?alt=media&token=01c0365a-ea03-47db-a14a-5eae8d1f262c",
      userName: "aescolastico",
      nombre: "Alexander",
      apellido: "Escolastico ",
      genero: "masculino",
      id: "qRnD27hJqyY2st2OXW0MtSoQUzm2",
    },
  },
  {
    ...plantilla,
    titulo: "El vendedor que más kilometro envió",
    texto:
      "El usuario que más kilómetros envió fue Maribel Merán con un total de 2,298 km; le sigue Jennifer Sánchez con 1,831 km.",
    num: 2,
    usuario: {
      ...personSchema,
      urlFotoPerfil:
        "https://firebasestorage.googleapis.com/v0/b/caelossoficial.appspot.com/o/avatars%2FfotoPerfilmmeran?alt=media&token=4ba4c9b4-b04c-4d45-9368-b807665cc0f7",
      userName: "mmeran",
      nombre: "Maribel",
      apellido: "Meran",
      genero: "femenino",
      id: "IAYL39iVBVXHDpFnB8XgP18qj7A3",
    },
  },
  {
    ...plantilla,
    titulo: "El vendedor que más facturó",
    texto:
      "La persona que más facturó en dinero fue el usuario Jhoel Taveras con un total de RD$ 291,261.00; luego le sigue Alexander con RD$ 281,692.",
    num: 3,
    usuario: {
      ...personSchema,
      urlFotoPerfil: "",
      userName: "jtaveras",
      nombre: "Jhoel",
      apellido: "Taveras",
      genero: "masculino",
      id: "4mY2nQdy4bc7jmyTZYEFJJM9YRW2",
    },
  },
  {
    ...plantilla,
    titulo: "La primera solicitud",
    texto:
      "La primera solicitud de transporte del TMS la realizó Lucidalia el 17 de marzo a las 11:37, y es la número 100001 a nombre de CONDOMINIO TORRE REGATTA RESIDENCES.",
    num: 4,
    usuario: {
      ...personSchema,
      urlFotoPerfil: "",
      userName: "lgalva",
      nombre: "LUCIDALIA",
      apellido: "GALVA ",
      genero: "femenino",
      id: "8l20ZJfQtkTkXbC4Gv1wbFQNHji1",
    },
  },
  {
    ...plantilla,
    titulo: "Transporte gratis",
    texto:
      "El usuario que más transporte gratis envió fue Alexander Escolástico.",
    num: 5,
    usuario: {
      ...personSchema,
      urlFotoPerfil:
        "https://firebasestorage.googleapis.com/v0/b/caelossoficial.appspot.com/o/avatars%2FfotoPerfilaescolastico?alt=media&token=01c0365a-ea03-47db-a14a-5eae8d1f262c",
      userName: "aescolastico",
      nombre: "Alexander",
      apellido: "Escolastico ",
      genero: "masculino",
      id: "qRnD27hJqyY2st2OXW0MtSoQUzm2",
    },
  },
  {
    ...plantilla,
    titulo: "El cliente que más solicitudes de transporte recibió",
    texto:
      "EEl cliente al que más transporte se le envió fue CONSTRUCTORA RODRÍGUEZ AQUINO SRL de Alexander.",
    num: 6,
    usuario: {
      ...personSchema,
      urlFotoPerfil:
        "https://firebasestorage.googleapis.com/v0/b/caelossoficial.appspot.com/o/avatars%2FfotoPerfilaescolastico?alt=media&token=01c0365a-ea03-47db-a14a-5eae8d1f262c",
      userName: "aescolastico",
      nombre: "Alexander",
      apellido: "Escolastico ",
      genero: "masculino",
      id: "qRnD27hJqyY2st2OXW0MtSoQUzm2",
    },
  },
];

export const cargarDataCuriosa = async () => {
  const docActualizar = doc(db, "miscelaneo", "datosCuriosos");

  try {
    await updateDoc(docActualizar, {
      array: arrayDatoCurioso,
    });
    console.log("actualizado!!!✅");
  } catch (error) {
    console.log(error);
  }
};
