export const fileStorageSchema = {
  url: "", // URL pública de descarga
  nombre: "", // nombre original del archivo
  rutaStorage: "", // ruta en Storage
  extension: "", // pdf, jpg, png...
  tipoMime: "", // application/pdf, image/jpeg...
  size: 0, // tamaño en bytes
  descripcion: "", // descripción opcional
  status: "activo", // activo | eliminado
  tags: [], // etiquetas opcionales
  createdAt: "", // fecha subida
  createdBy: "", // nombre/email
  idUsuario: "", // UID de Firebase Auth
};
