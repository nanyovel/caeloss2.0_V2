import { useState } from "react";
import { InputSimpleEditable } from "../../components/InputGeneral";
import { BtnNormal } from "../../components/BtnNormal";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import styled from "styled-components";
import { collection, doc, writeBatch } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";

import { ES6AFormat } from "../../libs/FechaFormat";
// import { itemsInicialSap } from "../Database/itemsSubir2";

import { recursoSchema } from "../schemas/recursoSchema";
import { PRODUCT_FULL2 } from "../../components/corporativo/PRODUCT_FULL2.JS";

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

      const codigosItems = PRODUCT_FULL2.map((codigo) => {
        return codigo.codigo;
      });

      for (const foto of arrayFotos) {
        console.log(foto);
        const codigoFoto = foto.name.slice(0, 5);
        const existe = codigosItems.includes(codigoFoto);
        if (!existe) {
          console.log("no existe el:");
          console.log(codigoFoto);
        }
        if (existe) {
          const nombreFoto =
            "productos/documentos/" + foto.name + "_" + Date.now();
          const storageRefFoto = ref(storage, nombreFoto);
          const resultadoSubida = await uploadBytes(storageRefFoto, foto);
          const codigoItemArchivo = resultadoSubida.metadata.name.slice(0, 5);
          const url = await getDownloadURL(storageRefFoto);
          const itemFind = PRODUCT_FULL2.find(
            (item) => item.codigo == codigoItemArchivo
          );

          const elementoAsset = {
            ...recursoSchema,
            createdAt: ES6AFormat(new Date()),
            createdBy: userMaster.userName,
            tipo: 0,
            agrupacion: "imagenProducto",
            url,
            comentarios: "DATA CARGA MASIVA dic 2025",
            itemsCodigos: [itemFind.codigo],
            categoriasCode: [itemFind.categoria],
            subCategoriasCode: [itemFind.subCategoria],
            fileName: foto.name,
            sizeBytes: foto.size,
            mimeType: foto.type,
            extension: foto.type.split("/")[1],
          };

          arrayElementsCrudo.push(elementoAsset);
          const porcientoTerminado = Math.round(
            ((index + 1) / arrayFotos.length) * 100
          );
          setPorcentaje(porcientoTerminado);
          index++;
        }
      }

      // 🟢2-Guardar la data en la base de datos
      const batch = writeBatch(db);
      arrayElementsCrudo.forEach((asset) => {
        const collectionBLRef = collection(db, "productoResource");
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
          // accept="*"
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
