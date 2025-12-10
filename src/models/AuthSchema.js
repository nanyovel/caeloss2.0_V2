export const UserSchema = {
  nombre: "",
  apellido: "",
  permisos: [],
  posicion: "",
  correo: "",
  id: "",
  dpto: "",
  fechaRegistro: "",
  licencia: "",
  sucursal: "",
  flota: "",
  extension: "",

  localidad: {
    nombreSucursal: "",
    codigoInterno: "",
    masDatosSuc: {},
  },

  urlFotoPerfil: "",
  userName: "",
  // masculino o femenino
  genero: "",
  plantillas: {
    solicitudTransporte: [
      //   {
      //     id: "",
      //     tipo: "",
      //     numero: "",
      //     cliente: "",
      //     fechaAdd: "",
      //   },
    ],
  },
  config: {
    almacenesViewRequest: [],
  },
};
