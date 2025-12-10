export const parsearPath = (location, rutas, setPageSelect) => {
  const pathname = location.pathname;
  const opcionSelect = rutas.find(
    (ruta) => pathname == ruta.pathModulo + ruta.path
  );
  if (opcionSelect) {
    setPageSelect(opcionSelect);
  }
};
