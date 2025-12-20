import styled from "styled-components";
import { BtnNormal } from "../../components/BtnNormal";
import { cargarLote } from "../../dashboard/cargarLote";
import { productoSchema } from "../schemas/productoSchema";
import { PRODUCT_FULL2 } from "../../components/corporativo/PRODUCT_FULL2.JS";

export default function ProductosAdd() {
  const subirData = () => {
    const productosParsed = PRODUCT_FULL2.map((prod) => {
      return {
        ...productoSchema,
        head: {
          ...productoSchema.head,
          codigo: prod.codigo,
          descripcion: prod.descripcion,
          unidadMedida: prod.unidadMedida,
          categoria: prod.categoria,
          subCategoria: prod.subCategoria,
          proveedores: [prod.proveedor],
          marca: prod.marca,
        },
      };
    });

    cargarLote(productosParsed, "productos");
  };
  return (
    <ContainerMaster>
      <CajaSubir>
        <BtnNormal onClick={() => subirData()}>Subir data!</BtnNormal>
      </CajaSubir>
    </ContainerMaster>
  );
}
const ContainerMaster = styled.div`
  position: relative;
`;
const CajaSubir = styled.div`
  width: 60%;
  border: 1px solid #ccc;
  margin: auto;
  border-radius: 8px;
  padding: 20px;
`;
