import React from "react";

export default function ElementJSX() {
  return (
    <Container>
      <CajaDetalles className="izq">
        <CajitaDetalle>
          <TituloDetalle>Codigo:</TituloDetalle>
          <DetalleTexto>{articuloDB.head.codigo}</DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle>
          <TituloDetalle>Fabricante:</TituloDetalle>
          <DetalleTexto>{articuloDB.head.fabricante}</DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle className="">
          <TituloDetalle>Origen:</TituloDetalle>
          <DetalleTexto className="flag">
            {articuloDB.head.paisOrigen.pais}
            <Img
              className="flag"
              src={generatorIconFlagURL(articuloDB.head.paisOrigen.siglas)}
            />
          </DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle className="vertical">
          <TituloDetalle className="vertical">Documentos:</TituloDetalle>
          <CajaVerticalTexto>
            {articuloDB.head.documentos.map((doc, index) => {
              return (
                <DetalleTexto className="vertical enlace" key={index}>
                  <IconoEpty>
                    {doc.isFabricante && (
                      <IconoCertified
                        title="Oficial del fabricante"
                        src={ImgCertified}
                      />
                    )}
                  </IconoEpty>
                  <Icono icon={faCircleDown} />
                  <Enlace target="_blank" to={doc.url}>
                    {doc.titulo}
                  </Enlace>
                </DetalleTexto>
              );
            })}
          </CajaVerticalTexto>
        </CajitaDetalle>
        <CajitaDetalle className="vertical">
          <TituloDetalle className="vertical">Enlaces:</TituloDetalle>
          <CajaVerticalTexto>
            {articuloDB.head.enlaces.map((doc, index) => {
              return (
                <DetalleTexto className="vertical enlace" key={index}>
                  <IconoEpty>
                    {doc.isFabricante && (
                      <IconoCertified
                        title="Oficial del fabricante"
                        src={ImgCertified}
                      />
                    )}
                  </IconoEpty>

                  <Icono icon={faLink} />
                  <Enlace target="_blank" to={doc.url}>
                    {doc.titulo}
                  </Enlace>
                </DetalleTexto>
              );
            })}
          </CajaVerticalTexto>
        </CajitaDetalle>
      </CajaDetalles>
      <CajaDetalles className="der">
        <CajaFotoProducto>
          <Img
            className="imagenDestacada"
            src={articuloDB.head.imagenesDestacadas[0]}
          />
        </CajaFotoProducto>
        <CajaNombreProducto>
          <TituloProducto>{articuloDB.head.descripcion}</TituloProducto>
        </CajaNombreProducto>
      </CajaDetalles>

      <CajitaDetalle className="vertical">
        <TituloDetalle className="vertical">Principales uso:</TituloDetalle>
        <DetalleTexto className="lista">Muros.</DetalleTexto>
        <DetalleTexto className="lista">
          Muros con acabado cerámico o pétreo.
        </DetalleTexto>
        <DetalleTexto className="lista">Cielos rasos.</DetalleTexto>
        <DetalleTexto className="lista">Elementos de fachada.</DetalleTexto>
        <DetalleTexto className="lista">
          {" "}
          Muros divisorios de baños.
        </DetalleTexto>
        <DetalleTexto className="lista"> Cocinas industriales.</DetalleTexto>
        <DetalleTexto className="lista">Cuartos de lavado.</DetalleTexto>
      </CajitaDetalle>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
`;

const CajaDetalles = styled.div`
  width: 70%;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  border: 2px solid ${Tema.primary.grisNatural};
  padding: 10px;
  border-radius: 5px;
  background-color: ${Tema.secondary.azulProfundo};
  color: ${Tema.secondary.azulOpaco};
`;
const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};

  justify-content: space-between;
  &.vertical {
    flex-direction: column;
    border: none;
    width: 100%;
    background-color: ${Tema.secondary.azulSuave};
    padding: 4px;
    margin-bottom: 3px;
  }
`;
const TituloDetalle = styled.p`
  width: 49%;
  text-align: start;
  color: ${Tema.neutral.blancoHueso};

  &.vertical {
    width: 100%;
    text-align: start;
    text-decoration: underline;
    margin-bottom: 5px;
  }
`;

const DetalleTexto = styled.p`
  text-align: end;
  height: 20px;
  width: 49%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${Tema.neutral.blancoHueso};
  &.vertical {
    width: 100%;
    text-align: start;
    margin-bottom: 4px;
    padding-left: 15px;
    overflow: visible;
    white-space: wrap;
    height: auto;
  }
  &.lista {
    /* border: 1px solid red; */
    text-align: start;
    padding-left: 15px;
    width: 100%;
  }
`;
