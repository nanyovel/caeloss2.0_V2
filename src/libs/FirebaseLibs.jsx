import {
  getFirestore,
  writeBatch,
  collection,
  doc,
  updateDoc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import db from "../firebase/firebaseConfig";

export const actualizarUnaPropiedad = async ({
  nombreColeccion,
  // data master es todos los objetos a actualizar, que puede ser la coleccion completa o una parte a raiz de una condicion
  dataMaster,
  propiedadAfectar,
  nuevoValor,
}) => {
  return;
  const batch = writeBatch(db);

  dataMaster.forEach((item) => {
    const refItemActualizar = doc(db, nombreColeccion, item.id);

    batch.update(refItemActualizar, {
      ...item,
      [propiedadAfectar]: nuevoValor,
    });
  });

  try {
    batch.commit().then(() => {
      console.log(
        "propiedad " +
          propiedadAfectar +
          "del lote completo actualizado correctamente!"
      );
    });
  } catch (error) {
    console.log(error);
  }
};
export const actualizarFullDangerous = async (
  itemActualizar,
  nombreColeccion,
  nuevoItem
) => {
  const batch = writeBatch(db);

  const refItemActualizar = doc(db, nombreColeccion, itemActualizar.id);
  batch.update(refItemActualizar, nuevoItem);

  try {
    batch.commit().then(() => {
      console.log("lote actualizado correctamente!");
    });
  } catch (error) {
    console.log(error);
  }
};

// Actualizar un documento
export const actualizaUnDoc = async (nombreColeccion, id, nuevoDocumento) => {
  const docActualizar = doc(db, nombreColeccion, id);
  try {
    console.log(nuevoDocumento);
    await updateDoc(docActualizar, nuevoDocumento);
    console.log("exito!!!✅✅✅✅");
  } catch (error) {
    console.log(error);
  }
};

// Cargar un array completo a una colecion de firebase, tomar en cuenta:
// ------1-Firebase no permite subir un array directamente, sino que tienes que subir documento por documento
// ------2-Firebase no permite subir mas de 500 documentos por lote, en el siguiente bloque se sube todo y funciona para un bloque menor de 500

export const cargarDatos = async (arrayDataBase, nombreColeccion) => {
  return;
  // const collectionRef = collection(db, "omarMiguel");
  const collectionRef = collection(db, nombreColeccion);
  const batch = writeBatch(db);

  arrayDataBase.forEach((item, index) => {
    const docRef = doc(collectionRef);
    batch.set(docRef, item);
  });

  try {
    batch.commit().then(() => {
      console.log("lote subido correctamente!");
    });
  } catch (error) {
    console.log(error);
  }
};

// Subir un documento id automatico
export const subirUnDoc = async (documentoCargar, nombreColeccion) => {
  try {
    await addDoc(collection(db, nombreColeccion), documentoCargar);
  } catch (error) {
    console.log(error);
  }
};
// Subir documento ID propio
export const subirUnDocIdPropio = async (
  documentoCargar,
  nombreColeccion,
  idDoc
) => {
  try {
    // Crear referencia al documento usando el ID personalizado
    const docRef = doc(db, nombreColeccion, idDoc);
    // Subir el documento a Firestore con el ID especificado
    await setDoc(docRef, documentoCargar);
  } catch (error) {
    console.log(error);
  }
};
