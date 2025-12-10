import React, { useState } from "react";
import styled from "styled-components";
import { ClearTheme } from "../../config/theme";
import { InputSimpleEditable } from "../../components/InputGeneral";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";

export default function TablaBLsRep() {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const handleFechas = (e) => {
    const { name, value } = e.target;
    if (name == "desde") {
      setFechaDesde(value);
    } else if (name == "hasta") {
      setFechaHasta(value);
    }
  };
  const generalReporte = async () => {
    const hasPermiso = userMaster.permisos.includes("generalReportsIMS");
    if (!hasPermiso) {
      return;
    }
    const annioDesde = fechaDesde.slice(0, 4);
    const mesDesde = fechaDesde.slice(5, 7);
    const diaDesde = fechaDesde.slice(8, 10);

    const desdeES6 = new Date(
      Number(annioDesde),
      Number(mesDesde) - 1,
      Number(diaDesde)
    );

    const annioHasta = fechaHasta.slice(0, 4);
    const mesHasta = fechaHasta.slice(5, 7);
    const diaHasta = fechaHasta.slice(8, 10);

    // Notar que se agrego un dia mas para tomar las 12 de las noche de ese dia
    const hastaES6 = new Date(
      Number(annioHasta),
      Number(mesHasta) - 1,
      Number(diaHasta) + 1
    );

    // Dame solo los BL que no esten eliminados
    const blSinEliminar = dbBillOfLading.filter((bl) => {
      if (bl.estadoDoc < 2) {
        return bl;
      }
    });

    // Dame los BL tengan la propiedad llegadaAlPaisDetalles y ademas el rango de fecha indicado
    const blFiltrados = blSinEliminar.filter((bl) => {
      if (bl.llegadaAlPaisDetalles) {
        if (bl.llegadaAlPaisDetalles.fechaConfirmada) {
          const annioBLES6 = bl.llegadaAlPaisDetalles.fecha.slice(6, 10);
          const mesBLES6 = bl.llegadaAlPaisDetalles.fecha.slice(3, 5);
          const diaBLES6 = bl.llegadaAlPaisDetalles.fecha.slice(0, 2);
          const llegadaAlPaisBLES6 = new Date(
            annioBLES6,
            mesBLES6 - 1,
            diaBLES6
          );

          if (llegadaAlPaisBLES6 > desdeES6 && llegadaAlPaisBLES6 < hastaES6) {
            console.log(bl);
            return bl;
          }
        }
      }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bill of Lading");

    worksheet.columns = [
      { header: "Numero", key: "numeroDoc", width: 10 },
      { header: "Proveedor", key: "proveedor", width: 40 },
      { header: "Naviera", key: "naviera", width: 40 },
      { header: "Puerto", key: "puerto", width: 40 },
      { header: "Llegada al pais", key: "llegadaPais", width: 15 },
      { header: "Status", key: "estadoDoc", width: 10 },
      { header: "Dias libres", key: "diasLibres", width: 10 },
      { header: "Qty Contenedores", key: "qtyFurgones", width: 10 },
    ];

    blFiltrados.forEach((bl, index) => {
      worksheet.addRow({
        numeroDoc: bl.numeroDoc,
        proveedor: bl.proveedor,
        naviera: bl.naviera,
        puerto: bl.puerto,
        llegadaPais: bl.llegadaAlPaisDetalles.fecha.slice(0, 10),
        estadoDoc: bl.estadoDoc,
        qtyFurgones: bl.furgones.length,
        diasLibres: bl.diasLibres,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Reporte.xlsx");
  };

  return (
    <ContainerMain>
      <TextoH3>Indique el rango de fecha</TextoH3>
      <CajaDatePicker>
        <CajitaDate>
          <DatePicker
            type="date"
            name="desde"
            value={fechaDesde}
            onChange={(e) => handleFechas(e)}
          />
          <Guion>Desde</Guion>
        </CajitaDate>
        <Guion>-</Guion>
        <CajitaDate>
          <DatePicker
            type="date"
            name="hasta"
            value={fechaHasta}
            onChange={(e) => handleFechas(e)}
          />
          <Guion>Hasta</Guion>
        </CajitaDate>
      </CajaDatePicker>
      <BtnGeneralButton onClick={() => generalReporte(dbOrdenes)}>
        Generar
      </BtnGeneralButton>
    </ContainerMain>
  );
}
const ContainerMain = styled.div`
  width: 100%;
  border: 4px solid ${ClearTheme.complementary.warning};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const TextoH3 = styled.h3`
  text-decoration: underline;
  font-weight: lighter;
  margin-bottom: 15px;
  color: white;
`;
const CajaDatePicker = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
const Guion = styled.h3`
  color: white;
  font-weight: 1rem;
  font-weight: lighter;
`;

const CajitaDate = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const DatePicker = styled(InputSimpleEditable)``;
