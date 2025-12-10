import { furgonSchema } from "./furgonSchema";

// ------Esta opcion esta en evaluacion

const partidaFleteSueltoSchema = {
  ...furgonSchema,
  tamannio: "",
};
export { partidaFleteSueltoSchema };

export const blSchema = {
  // Tipo BL:
  // 0-normal
  // 1-carga suelta
  tipo: 0,
  //
  // Estados
  // 0-Abierto
  // ------Al menos un furgon/partida de carga suelta no esta concluido, es decir status algun furgon no esta en status 5 concluido en SAP
  // 1-Cerrado
  // ------Todos sus furgones/partidas de carga suelta estan concluido en SAP
  estadoDoc: 0,

  fleteSuelto: {
    numeroDoc: "",
    materiales: [],
    // Cada partida tendra el mismo numero pero con el sufijo A,B,C...
    partidas: [],
  },

  isTransito: true,
  diasRestantes: "",
  llegada02AlPais: {
    fecha: "",
    confirmada: false,
  },
  numeroDoc: "",
  proveedor: "",
  naviera: "",
  diasLibres: 7,
  puerto: "Haina",
  createdBy: "",
  createdAt: "",
  fechaConclucionStamp: "",
  logModificaciones: [
    {
      fecha: "",
      userNameCreador: "",
      idCreador: "",
      descripcionCambio: "",
      documento: {},
    },
  ],
  filesAttach: [],

  costos: [
    {
      tipo: "Almacenamiento",
      monto: "",
      obs: "",
    },
    {
      tipo: "Arancel",
      monto: "",
      obs: "",
    },
    {
      tipo: "Cargos en destino",
      monto: "",
      obs: "",
    },
    {
      tipo: "Chasis propio prov. unio nat",
      monto: "",
      obs: "",
    },
    {
      tipo: "Demora en puerto",
      monto: "",
      obs: "",
    },
    {
      tipo: "Descarga de mercancia",
      monto: "",
      obs: "",
    },
    {
      tipo: "Despacho portuario",
      monto: "",
      obs: "",
    },
    {
      tipo: "Facilitadora de despacho FDA",
      monto: "",
      obs: "",
    },
    {
      tipo: "Flete maritimo",
      monto: "",
      obs: "",
    },
    {
      tipo: "Flete facturar suplidor",
      monto: "",
      obs: "",
    },
    {
      tipo: "Gestion aduanal",
      monto: "",
      obs: "",
    },
    {
      tipo: "Haina international terminal",
      monto: "",
      obs: "",
    },
    {
      tipo: "Impresion BL",
      monto: "",
      obs: "",
    },
    {
      tipo: "Seguro",
      monto: "",
      obs: "",
    },
    {
      tipo: "Tasas de Aduanas",
      monto: "",
      obs: "",
    },
    {
      tipo: "Transporte",
      monto: "",
      obs: "",
    },
    {
      tipo: "Zona multimodal Caucedo",
      monto: "",
      obs: "",
    },
    {
      tipo: "Otros",
      monto: "",
      obs: "",
    },
    {
      tipo: "",
      monto: "",
      obs: "",
    },
  ],
};
