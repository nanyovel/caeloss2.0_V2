// Editables/MyDocPdf.jsx
import React, { Fragment } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import LogoCielosBase64 from "../../components/LogoCielosBas64";

// Estilos
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10 },
  row: {
    flexDirection: "row",
    marginBottom: 4,
    borderBottom: "1px solid black",
    justifyContent: "start",
  },
  rowSinBorder: {
    flexDirection: "row",
    marginBottom: 4,
    // borderBottom: "1px solid black",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  tableHeader: {
    backgroundColor: "#8eaec7",
    flexDirection: "row",
    border: "1px solid black",
  },
  cell: { padding: 4, border: "1px solid black" },
  th: {
    padding: 4,
    fontWeight: "bold",
    // borderLeft: "1px solid black",
    backgroundColor: "#D9EAF7",
  },
  logo: { width: 80, height: 40, marginBottom: 10 },
  line: { marginVertical: 1 },
  firma: {
    flex: 1,
    textAlign: "center",
    marginTop: 40,
    borderTop: "1px solid black",
  },
  colorBlanco: {
    color: "white",
  },
  margenDer: {
    marginRight: 20,
    fontWeight: "bold",
  },
  border: {
    border: "1px solid black",
    padding: 8,
    marginBottom: 25,
  },
  grilla: {
    border: "1px solid black",
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 7,
    paddingRight: 7,
  },
  tituloContacto: {
    // fontWeight: "bold",
    marginLeft: 20,
  },
});
export const PlantillaDocDevolucionPDF = ({ request }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Encabezado con logo y fecha */}
      <View style={styles.border}>
        <View style={styles.row}>
          <Image
            style={styles.logo}
            src={LogoCielosBase64} // Reemplaza con tu logo real o base64
          />
          <View
            style={{ flex: 1, textAlign: "center", justifyContent: "center" }}
          >
            <Text style={styles.sectionTitle}>
              SOLICITUD DE TRASLADO DE MATERIALES
            </Text>
            <Text style={{ fontSize: 10 }}>EN DEVOLUCIÓN</Text>
          </View>
          <View>
            <Text style={styles.grilla}>Fecha:</Text>
            <Text style={styles.grilla}>{request.fechaEjecucionCorta}</Text>
          </View>
        </View>

        {/* Datos generales */}
        {/* <View style={styles.row}>
        <Text style={{ flex: 2 }}>Departamento que realiza la solicitud:</Text>
        <Text style={{ flex: 1 }}>X Ventas  Proyecto</Text>
      </View> */}
        <View style={styles.row}>
          <Text style={styles.margenDer}>Sucursal:</Text>
          <Text style={styles.line}>Principal</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.margenDer}>Solicitante:</Text>
          <Text style={styles.line}>
            {request.datosSolicitante.nombre +
              " " +
              request.datosSolicitante.apellido}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.margenDer}>Cliente:</Text>
          <Text style={styles.line}>{request.datosReq.socioNegocio}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.margenDer}>Dirección:</Text>
          <Text style={styles.line}>{request.datosReq.detalles}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.margenDer}>Contacto:</Text>
        </View>
        {request.datosReq.personasContacto.map((person, index) => {
          return (
            <View style={styles.row} key={index}>
              <Text style={styles.tituloContacto}>
                {person.nombre + " | " + " "}
              </Text>
              <Text>{person.rol + " | " + " "}</Text>
              <Text>{person.telefono + " | " + " "}</Text>
            </View>
          );
        })}

        <View style={styles.row}>
          <Text style={styles.margenDer}></Text>
          <Text style={styles.line}></Text>
          <Text style={{ flex: 1, textAlign: "right" }}>
            N° de Proyecto:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {request.datosReq.numeroProyecto}
            </Text>
          </Text>
        </View>

        {/* Tabla de productos */}
        <View style={styles.tableHeader}>
          <Text style={{ ...styles.th, width: "20%" }}>Código</Text>
          <Text style={{ ...styles.th, width: "60%" }}>Descripción</Text>
          <Text style={{ ...styles.th, width: "20%" }}>Cantidad</Text>
        </View>

        {request.datosReq.materialesDev.map((item, idx) => (
          <View key={idx} style={styles.rowSinBorder}>
            <Text style={{ ...styles.cell, width: "20%" }}>{item.codigo}</Text>
            <Text style={{ ...styles.cell, width: "60%" }}>
              {item.descripcion}
            </Text>
            <Text style={{ ...styles.cell, width: "20%" }}>{item.qty}</Text>
          </View>
        ))}

        {/* Firmas */}
        <View style={styles.rowSinBorder}>
          <Text style={styles.firma}>
            Firma del Cliente / Responsable de la devolución en obra
          </Text>
          <Text style={styles.colorBlanco}>|||||||</Text>
          <Text style={styles.firma}>Firma del Chofer</Text>
        </View>
      </View>
      <Text>CA-FO-GL-012 Rev. 00 12/16</Text>
    </Page>
  </Document>
);
