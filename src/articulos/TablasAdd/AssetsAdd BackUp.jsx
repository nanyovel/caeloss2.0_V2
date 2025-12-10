// Creado el 9 diciembre
// Voy a cambiar la forma en subir asset, nombre de la coleccion y demas
// en adelante cada assets no sera un elemento de un objeto, sino cada asset es un objeto dentro de la coleccion
// esto accarrea varios cambios
import { useState } from "react";
import { InputSimpleEditable } from "../../components/InputGeneral";
import { BtnNormal } from "../../components/BtnNormal";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import styled from "styled-components";
import { collection, doc, writeBatch } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import {
  assetProductSchema2,
  elementosAssetsProductsSchema,
} from "../schemas/assetsSchema";
import { ES6AFormat } from "../../libs/FechaFormat";
import { itemsInicialSap } from "../Database/itemsSubir2";

export default function AssetsAdd({ userMaster }) {
  const [arrayFotos, setArrayFotos] = useState([]);
  const handleFile = (e) => {
    const files = e.target.files;
    if (files) {
      const arrayArchivos = Array.from(files);
      console.log(arrayArchivos);
      arrayArchivos.map((foto) => {
        console.log(foto.name);
      });
      setArrayFotos(arrayArchivos);
      // setFileFotoPerfil(files);
    }
  };
  const storage = getStorage();
  const subirImagenes = async () => {
    try {
      const arrayElementsCrudo = [];
      //
      // 🟢1-Sube las imagenes
      let index = 0;

      const codigosItems = itemsInicialSap.map((codigo) => {
        return codigo.codigo;
      });

      for (const foto of arrayFotos) {
        const codigoFoto = foto.name.slice(0, 5);
        const existe = codigosItems.includes(codigoFoto);
        if (!existe) {
          console.log("no existe el:");
          console.log(codigoFoto);
        }
        if (existe) {
          const nombreFoto =
            "productos/imagenes/" + foto.name + "_" + Date.now();
          const storageRefFoto = ref(storage, nombreFoto);
          const resultadoSubida = await uploadBytes(storageRefFoto, foto);
          const codigoItemArchivo = resultadoSubida.metadata.name.slice(0, 5);
          const url = await getDownloadURL(storageRefFoto);
          const itemFind = itemsInicialSap.find(
            (item) => item.codigo == codigoItemArchivo
          );

          console.log(codigoItemArchivo);
          // console.log(itemFind);
          const elementoAsset = {
            ...elementosAssetsProductsSchema,
            tipo: 0,
            subtipo: 0,
            url,
            comentarios: "DATA CARGA MASIVA nov 2025",
            codigoProducto: itemFind.codigo,
            itemsIncluidos: [itemFind.codigo],
            codigoCategoria: itemFind.categoria,
            categoriasIncluidas: [itemFind.categoria],
          };

          arrayElementsCrudo.push(elementoAsset);
          const porcientoTerminado = Math.round(
            ((index + 1) / arrayFotos.length) * 100
          );
          setPorcentaje(porcientoTerminado);
          index++;
        }
      }
      const assetsProductsData = itemsInicialSap.map((prod) => {
        return {
          ...assetProductSchema2,
          createdAt: ES6AFormat(new Date()),
          createdBy: userMaster.userName,
          descripcionProducto: prod.descripcion,
          codigoProducto: prod.codigo,
          categoriaProducto: prod.categoria,
          congloItemsIncluidos: [prod.codigo],
          congloCodigosCategorias: [prod.categoria],
          elementos: arrayElementsCrudo.filter(
            (el) => el.codigoProducto === prod.codigo
          ),
        };
      });

      const assetsProductsParsed = assetsProductsData.filter(
        (ap) => ap.elementos.length > 0
      );
      console.log(assetsProductsParsed);

      // 🟢2-Guardar la data en la base de datos
      const batch = writeBatch(db);
      assetsProductsParsed.forEach((asset) => {
        const collectionBLRef = collection(db, "productosAssets");
        const nuevoDocumentoRef = doc(collectionBLRef);
        batch.set(nuevoDocumentoRef, {
          ...asset,
        });
      });
      await batch.commit();
      alert("¡Carga masiva de assets completada!");
    } catch (error) {
      console.error(error);
    }
  };

  const [porcentaje, setPorcentaje] = useState(0);

  return (
    <ContainerMaster>
      <CajaSubir>
        <InputSimpleEditable
          type="file"
          multiple
          accept="image/*"
          onChange={handleFile}
        />
        <BtnNormal onClick={() => subirImagenes()}>Subir fotos!</BtnNormal>
      </CajaSubir>
      <ContenedorBarraPRogreso>
        <TextoPorcentaje>{porcentaje + "%"}</TextoPorcentaje>
        <BarraPRogreso porcentaje={porcentaje}></BarraPRogreso>
      </ContenedorBarraPRogreso>
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
const ContenedorBarraPRogreso = styled.div`
  width: 100%;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 20px;
  overflow: hidden;
  background-color: #dfdfdf;
  position: relative;
`;
const BarraPRogreso = styled.div`
  width: ${(props) => props.porcentaje}%;
  height: 100%;
  background-color: #58d65c;
`;
const TextoPorcentaje = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
`;
