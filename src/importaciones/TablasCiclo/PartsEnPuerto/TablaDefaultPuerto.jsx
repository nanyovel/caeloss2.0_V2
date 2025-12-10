import { useEffect, useState } from "react";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../../components/JSXElements/GrupoTabla.jsx";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { colorDaysRemaining } from "../../components/libs";
import { InputSimpleEditable } from "../../../components/InputGeneral.jsx";
import { ClearTheme, Theme } from "../../../config/theme.jsx";
import imgCheck from "../../../../public/img/checkImg.png";
import imgX from "../../../../public/img/xImg.png";

export default function TablaDefaultPuerto({
  userMaster,
  contenedores,
  identificador,
  day,
  MODO,
  modoAvanzar,
  handleTablaDefault,
}) {
  const [listaParsed, setListaParsed] = useState([]);
  useEffect(() => {
    let listaAux = contenedores;
    if (MODO == "semana") {
      listaAux = contenedores.filter((furgon) => {
        if (
          furgon.planificado == true &&
          furgon.fechaRecepProg?.slice(0, 10) == day.fecha.slice(0, 10)
        ) {
          return furgon;
        }
      });
    } else if (MODO == "planificar") {
      listaAux = contenedores.filter((furgon) => {
        if (!furgon.planificado) {
          return furgon;
        }
      });
    }
    setListaParsed(listaAux);
  }, [contenedores]);
  //
  return (
    <CajaTablaGroup>
      <TablaGroup>
        <thead>
          <FilasGroup className="cabeza">
            <CeldaHeadGroup>N°</CeldaHeadGroup>
            <CeldaHeadGroup>
              Numero*
              {userMaster?.userName == "jperez" && identificador}
            </CeldaHeadGroup>
            <CeldaHeadGroup title="Tamaño">T</CeldaHeadGroup>
            <CeldaHeadGroup>Proveedor</CeldaHeadGroup>
            <CeldaHeadGroup>BL*</CeldaHeadGroup>
            <CeldaHeadGroup>Naviera</CeldaHeadGroup>
            <CeldaHeadGroup>Puerto</CeldaHeadGroup>
            <CeldaHeadGroup title="Dias Libres">DL</CeldaHeadGroup>
            <CeldaHeadGroup title="Dias Restantes">DR</CeldaHeadGroup>
            <CeldaHeadGroup>Destino</CeldaHeadGroup>
            {modoAvanzar && <CeldaHeadGroup>Seleccion</CeldaHeadGroup>}
          </FilasGroup>
        </thead>
        <tbody>
          {listaParsed.map((furgon, index) => {
            return (
              <FilasGroup key={index} className={`body `}>
                <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                <CeldasBodyGroup>
                  {furgon.isCargaSuelta ? (
                    <Enlaces
                      to={`/importaciones/maestros/billoflading/${encodeURIComponent(
                        furgon.datosBL.numeroBL
                      )}`}
                      target="_blank"
                    >
                      {furgon.part}
                    </Enlaces>
                  ) : (
                    <Enlaces
                      to={`/importaciones/maestros/contenedores/${encodeURIComponent(
                        furgon.numeroDoc
                      )}`}
                      target="_blank"
                    >
                      {furgon.numeroDoc}
                    </Enlaces>
                  )}
                </CeldasBodyGroup>
                <CeldasBodyGroup>{furgon.tamannio}</CeldasBodyGroup>
                <CeldasBodyGroup className="startText">
                  {furgon.datosBL.proveedor}
                </CeldasBodyGroup>
                <CeldasBodyGroup className="startText">
                  <Enlaces
                    to={`/importaciones/maestros/billoflading/${encodeURIComponent(furgon.datosBL.numeroBL)}`}
                    target="_blank"
                  >
                    {furgon.datosBL.numeroBL}
                  </Enlaces>
                </CeldasBodyGroup>
                <CeldasBodyGroup className="startText">
                  {furgon.datosBL.naviera}
                </CeldasBodyGroup>
                <CeldasBodyGroup>{furgon.datosBL.puerto}</CeldasBodyGroup>
                <CeldasBodyGroup>{furgon.datosBL.diasLibres}</CeldasBodyGroup>
                <CeldasBodyGroup>
                  {!furgon.isCargaSuelta && (
                    <>
                      {furgon.diasRestantes}
                      {colorDaysRemaining(furgon.diasRestantes)}
                    </>
                  )}
                </CeldasBodyGroup>
                <CeldasBodyGroup className="inputEditable">
                  {modoAvanzar ? (
                    <InputEditable
                      type="text"
                      className="celda"
                      value={furgon.destino}
                      name="destino"
                      data-objetivo="handleinput"
                      data-furgon={furgon.numeroDoc}
                      onChange={(e) => {
                        handleTablaDefault(e);
                      }}
                    />
                  ) : (
                    furgon.destino
                  )}
                </CeldasBodyGroup>
                {modoAvanzar && (
                  <CeldasBodyGroup className="celdaBtn">
                    {MODO == "planificar" ? (
                      <Imagen
                        data-furgon={furgon.numeroDoc}
                        className="check"
                        data-objetivo="seleccionarFurgon"
                        onClick={(e) => handleTablaDefault(e)}
                        src={imgCheck}
                      />
                    ) : (
                      <Imagen
                        data-furgon={furgon.numeroDoc}
                        className="check"
                        data-objetivo="deseleccionarFurgon"
                        onClick={(e) => handleTablaDefault(e)}
                        src={imgX}
                      />
                    )}
                  </CeldasBodyGroup>
                )}
              </FilasGroup>
            );
          })}
        </tbody>
      </TablaGroup>
    </CajaTablaGroup>
  );
}

const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const InputEditable = styled(InputSimpleEditable)`
  height: 100%;
  width: 100%;
  margin: 0;
  /* border-radius: 5px; */
  font-size: 0.8rem;
  /* border-radius: 0; */
  /* color: inherit; */
  color: ${Theme.neutral.blancoHueso};
  color: white;
  &.celda {
    /* border-bottom: 1px solid #5a5a5a; */
    background-color: #e9e3e383;
    &:focus {
      border-bottom: 1px solid ${ClearTheme.complementary.warning};
      border-bottom: 1px solid #4e3636;
      /* border: 2px solid black; */
    }
  }
`;
const Imagen = styled.img`
  &.check {
    width: 25px;
    cursor: pointer;
    border: 1px solid transparent;
    padding: 2px;
    border-radius: 5px;
    &:hover {
      border: 1px solid ${ClearTheme.primary.azulBrillante};
    }
  }
`;
