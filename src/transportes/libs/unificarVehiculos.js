// Este componente es para unificar todos los vehiculos en un mismo array, que son vehiculos default mas vehiculos adicionales
export const unificarVehiculos = (request) => {
  console.log(request);
  // Se crea un nuevo array que contiene todos los vehiculos default y los vehiculos adicionales
  if (!request.datosFlete) {
    return [];
  }
  return [
    ...request.datosFlete.vehiculosAdicionales,
    {
      datosEntrega: {
        status: request.estadoDoc,
      },
    },
  ];
};
