import styled from "styled-components";
import { ClearTheme, Tema } from "../../config/theme";

export const OrigenMonto = [
  "Formula inicial",
  "Manual Inicial",
  "Cambio de vehiculo",
  "Costo y precio manual",
  "Ayundate adicional",
];
export const aprobacionMonto = ["No aprobado", "Default", "Aprobado"];
export const CalificacionReview = [
  "Sin Calificar",
  "Muy Malo",
  "Malo",
  "Regular",
  "Bueno",
  "Muy Bueno",
];
export const StyleTextStateReq = [
  {
    numero: -1,
    codigo: "borradorStateReq",
    texto: "Draft - Precio",
    coloFondo: "#F78C6B",
    colorTitulo: "black",
  },
  {
    numero: 0,
    codigo: "esperaStateReq",
    texto: "A la espera...",
    coloFondo: "#a3a3a3da",
    colorTitulo: "black",
  },
  {
    numero: 1,
    codigo: "planificacionStateReq",
    texto: "Planificada",
    coloFondo: "#ffc107",
    colorTitulo: "#0d161c",
  },
  {
    numero: 2,
    codigo: "ejecucionStateReq",
    texto: "Ejecucion",
    coloFondo: "#0074d9",
    colorTitulo: "white",
  },
  {
    numero: 3,
    codigo: "realizadaStateReq",
    texto: "Realizada",
    coloFondo: "#28a745",
    colorTitulo: "white",
  },
  {
    numero: 4,
    codigo: "canceladaStateReq",
    texto: "Cancelada",
    coloFondo: "#dc3545",
    colorTitulo: "white",
  },
];
export const StyleTextTypeReq = [
  {
    numero: 0,
    codigo: "entregas",
    texto: "Entrega",
  },
  {
    numero: 1,
    codigo: "traslado",
    texto: "Traslado",
  },
  {
    numero: 2,
    codigo: "retiroObra",
    texto: "Retiro en obra",
  },
  {
    numero: 3,
    codigo: "retiroProveedor",
    texto: "Retiro a proveedor",
  },
];
export const StyleTextStateDriver = [
  {
    numero: 0,
    codigo: "offStateDriver",
    texto: "OFF",
  },
  {
    numero: 1,
    codigo: "disponibleStateDriver",
    texto: "Disponible",
  },
  {
    numero: 2,
    codigo: "ejecucionStateDriver",
    texto: "Ejecucion",
  },
  {
    numero: 3,
    codigo: "inactivoStateDriver",
    texto: "Inactivo",
  },
];
export const StyleTextTypeDriver = [
  {
    numero: 0,
    codigo: "IN",
    texto: "Interno",
  },
  {
    numero: 1,
    codigo: "EI",
    texto: "Externo Independiente",
  },
  {
    numero: 2,
    codigo: "EE",
    texto: "Externo Empresa",
  },
];

export const CajaStatusComponent = styled.div`
  &.borradorStateReq {
    background-color: ${ClearTheme.complementary.narajanBrillante};
    color: black;
  }
  &.esperaStateReq {
    background-color: #a3a3a3da;
    color: black;
  }
  &.planificacionStateReq {
    background-color: #ffc107;
    color: ${Tema.secondary.azulOlivo};
  }
  &.ejecucionStateReq {
    color: white;

    background-color: ${Tema.complementary.azulStatic};
  }
  &.realizadaStateReq {
    background-color: ${Tema.complementary.success};
    color: white;
  }
  &.canceladaStateReq {
    background-color: ${ClearTheme.complementary.danger};
    color: white;
    border: 1px solid black;
  }

  &.defaultStateReq {
    background-color: white;
    color: black;
  }
`;

export const EstadosChoferes = [
  {
    nombre: "OFF",
    select: false,
  },
  {
    nombre: "Disponible",
    select: false,
  },
  {
    nombre: "Ejecucion",
    select: false,
  },
  {
    nombre: "Inactivo",
    select: false,
  },
];
export const EstadosSolicitudes = [
  {
    nombre: "A la espera",
    select: false,
  },
  {
    nombre: "Planificada",
    select: false,
  },
  {
    nombre: "Ejecucion",
    select: false,
  },
  {
    nombre: "Concluida",
    select: false,
  },
  {
    nombre: "Inactivo",
    select: false,
  },
];

export const AsuntosSegunEstadoReq = [
  "Solicitud creada",
  "Solicitud planificada",
  "Solicitud en ejecucion",
  "Solicitud concluida",
  "Solicitud cancelada",
];
