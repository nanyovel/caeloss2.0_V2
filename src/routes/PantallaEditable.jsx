import React from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { MyDocument } from "./Editables/MyDocPdf";
import { Header } from "../components/Header";
import Footer from "../components/Footer";
import styled from "styled-components";
import { BtnGeneralButton } from "../components/BtnGeneralButton";
import { faCloudArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Datos simulados
const cliente = "Juan Pérez";
const productos = [
  { nombre: "Construccion MT2", cantidad: 2, precio: 100 },
  { nombre: "Material", cantidad: 1, precio: 150 },
];

export const PantallaEditable = () => (
  <>
    <Header titulo="PDF Dinámico" />

    <div style={{ margin: "20px" }}>
      <PDFDownloadLink
        document={<MyDocument cliente={cliente} productos={productos} />}
        fileName="factura.pdf"
      >
        {({ loading }) =>
          loading ? (
            "Generando PDF..."
          ) : (
            <BtnNormal>
              <Icono icon={faCloudArrowDown} />
              PDF
            </BtnNormal>
          )
        }
      </PDFDownloadLink>
    </div>

    <PDFViewer width="100%" height="600">
      <MyDocument cliente={cliente} productos={productos} />
    </PDFViewer>

    <Footer />
  </>
);
const BtnNormal = styled(BtnGeneralButton)`
  white-space: nowrap;
  margin: 0;
  margin-right: 5px;
  width: auto;
`;
const Icono = styled(FontAwesomeIcon)`
  margin-right: 5px;
  pointer-events: none;
`;
