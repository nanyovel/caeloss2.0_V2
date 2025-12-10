import { ClearTheme, Tema } from "../../config/theme";
import styled from "styled-components";
import { InputSimpleEditable } from "../../components/InputGeneral";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { fetchDocsByConditionGetDocs } from "../../libs/useDocByCondition";
import ExportarExcel from "../../libs/ExportExcel";
import ColumnasItemsExcel from "../libs/ColumnasItemsExcel";

export default function ReportItems({ userMaster }) {
  console.log(userMaster);
  const generalReporte = async () => {
    console.log(userMaster);
    const hasPermiso = userMaster.permisos.includes("generalReportsDPT");
    if (!hasPermiso) {
      console.log("salir");
      return;
    }

    const allProducs = await fetchDocsByConditionGetDocs(
      "productos",
      undefined
    );

    const allAssets = await fetchDocsByConditionGetDocs(
      "productosAssets",
      undefined
    );

    console.log(allProducs);
    console.log(allAssets);

    const productsParsed = allProducs.map((product) => {
      const assest = allAssets.find(
        (asset) => asset.codigoProducto === product.head.codigo
      );

      if (assest) {
        console.log(assest);
        const urls = assest.elementos
          .filter((foto) => foto.tipo === 0)
          .map((foto) => foto.url);
        const cadena = urls.join("|");
        if (!cadena) {
          console.log("no existe");
          console.log(product);
        }
        console.log(cadena);
        return {
          ...product,
          imagenes: cadena,
        };
      } else {
        return product;
      }
    });

    // const itemsConFoto = productsParsed.filter((prod) => prod.imagenes);

    // console.log(itemsConFoto);
    ExportarExcel(productsParsed, ColumnasItemsExcel);
  };

  return (
    <ContainerMain className="clearModern">
      <CajaTipo>
        <Titulo>Reporte de productos:</Titulo>
        <ContainerMain>
          <TextoH3>Lista completa</TextoH3>

          <BtnSimple onClick={() => generalReporte()}>Exportar</BtnSimple>
        </ContainerMain>
      </CajaTipo>
    </ContainerMain>
  );
}

const ContainerMain = styled.div`
  width: 100%;
  /* border: 1px solid red */
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: ${Tema.primary.azulBrillante};
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulFrosting};
    backdrop-filter: blur(3px);
    color: white;
  }
`;
const CajaTipo = styled.div`
  width: 100%;
  color: white;
`;
const Titulo = styled.h2`
  text-decoration: underline;
  margin-left: 20px;
  font-weight: 400;
`;

const BtnSimple = styled(BtnGeneralButton)``;

const TextoH3 = styled.h3`
  color: ${Tema.primary.azulBrillante};
  text-decoration: underline;
  font-weight: lighter;
  margin-bottom: 15px;
  color: white;
`;
