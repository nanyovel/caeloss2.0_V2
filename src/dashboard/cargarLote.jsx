import { collection, writeBatch, doc } from "firebase/firestore";
import db from "../firebase/firebaseConfig";

/**
 * Sube un array grande de objetos a Firestore en lotes de máximo 500.
 * @param {Array} dataArray - Array con los objetos a subir.
 * @param {string} collectionName - Nombre de la colección destino.
 */
export async function cargarLote(dataArray, collectionName) {
  console.log("subiendo");
  // return; // Desactivado temporalmente
  const chunkSize = 500; // Límite por lote
  for (let i = 0; i < dataArray.length; i += chunkSize) {
    const batch = writeBatch(db);
    const chunk = dataArray.slice(i, i + chunkSize);

    chunk.forEach((item) => {
      const newDocRef = doc(collection(db, collectionName)); // genera ID automático
      batch.set(newDocRef, item);
    });

    await batch.commit();
    console.log(`✅ Subido lote ${Math.floor(i / chunkSize) + 1}`);
  }

  console.log("🎉 Todos los datos fueron subidos correctamente.");
}
