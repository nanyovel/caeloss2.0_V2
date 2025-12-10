import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ExportarExcel = async (listaDoc, columnas, nombreHoja) => {
  const arrayList = listaDoc;
  const columnasAux = columnas;
  const workbook = new ExcelJS.Workbook();
  const hojaNombre = nombreHoja ? nombreHoja : "Hoja1";
  const worksheet = workbook.addWorksheet(hojaNombre);

  worksheet.columns = columnasAux;

  function obtenerValorPorRuta(objeto, ruta) {
    return ruta
      .split(".")
      .reduce((acumulador, parte) => acumulador && acumulador[parte], objeto);
  }
  console.log(arrayList);
  arrayList.forEach((doc, index) => {
    const rowValues = [];
    columnasAux.forEach((columna, i) => {
      rowValues[i] = obtenerValorPorRuta(doc, columnasAux[i].ruta);
    });
    worksheet.addRow(rowValues);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "Reporte.xlsx");
};

export default ExportarExcel;
