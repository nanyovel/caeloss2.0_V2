import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { PlafonComercial } from "./PlafonComercial";
import { PlafonMachihembrado } from "./PlafonMachihembrado";
import { TechoLisoSheetRock } from "./TechoLisoSheetRock";
import { TechoLisoDensGlass } from "./TechoLisoDensGlassd";
// import { Macrolux } from "./Macrolux";
import { DivisionYeso } from "./DivisionYeso.jsx";
import { DivisionDensGlass } from "./DivisionDensGlass";
import { Header } from "../../components/Header";
import { Navegacion } from "../components/Navegacion";
import Footer from "../../components/Footer.jsx";
import styled from "styled-components";
import Notificaciones from "../../components/Notificaciones.jsx";
import MenuHaburg from "../components/MenuHaburg.jsx";

export const ListaPage = ({ userMaster }) => {
  const lugar = useLocation();
  const parametro = useParams();
  let id = parametro.id;
  let material = "";
  let subTituloHeader = "";

  let aparte = true;

  switch (id) {
    case "plafoncomercial":
      material = <PlafonComercial />;
      subTituloHeader = "Plafon Comercial";
      break;
    case "plafonmachihembrado":
      material = <PlafonMachihembrado />;
      subTituloHeader = "Plafon Machihembrado";

      aparte = false;
      break;
    case "techolisosheetrock":
      material = <TechoLisoSheetRock userMaster={userMaster} />;
      subTituloHeader = "Techo liso Sheetrock";
      break;
    case "techolisodensglass":
      material = <TechoLisoDensGlass />;
      subTituloHeader = "Techo liso Densglass";
      break;

    case "poliacryl":
      material = <Poliacryl />;
      subTituloHeader = "Poliacryl";
      aparte = false;
      break;
    case "divisionyeso":
      material = <DivisionYeso />;
      subTituloHeader = "Division yeso";
      break;
    case "divisiondensglass":
      material = <DivisionDensGlass />;
      subTituloHeader = "Division Densglass";
      break;
    case "pisoslaminados":
      material = <PisoLaminado />;
      subTituloHeader = "Piso laminado";
      aparte = false;
      break;
    case "pisosvinyl":
      material = <PisoLaminado />;
      subTituloHeader = "Piso laminado";
      aparte = false;
      break;
    case "decking":
      material = <PisoLaminado />;
      subTituloHeader = "Piso laminado";
      aparte = false;
      break;
    default:
      material = "";
      subTituloHeader = "";
      aparte = false;
      break;
  }
  const [openMenuMobil, setOpenMenuMobil] = useState(false);
  return (
    <ContainerMaster>
      <ContainerSecciones>
        <Header
          titulo="Calculadora de materiales"
          subTitulo={subTituloHeader}
        />
        <CajaFija>
          <MenuHaburg
            openMenuMobil={openMenuMobil}
            setOpenMenuMobil={setOpenMenuMobil}
          />
        </CajaFija>
        <Navegacion
          home={material ? false : true}
          openMenuMobil={openMenuMobil}
          setOpenMenuMobil={setOpenMenuMobil}
        />
      </ContainerSecciones>

      <ContainerSecciones className="contenido">
        {material ? (
          material
        ) : (
          <WrapTextoEpty>
            <TituloMateriales>
              Seleccione los materiales en el menu.
            </TituloMateriales>
          </WrapTextoEpty>
        )}
      </ContainerSecciones>
      <ContainerSecciones className="footer">
        <Footer />
      </ContainerSecciones>
    </ContainerMaster>
  );
};

const ContainerMaster = styled.div`
  position: relative;
  display: grid;
  min-height: 100%;
  grid-template-rows: auto 1fr auto;
`;
const ContainerSecciones = styled.div`
  &.contenido {
    margin-bottom: 40px;
    width: 100%;
    overflow-x: hidden;
  }
  &.footer {
    position: relative;
    bottom: 0;
    width: 100%;
    height: 50px;
    /* border: 1px solid red; */
  }
`;

// const Footer=styled.div`
//     position: absolute;
//     bottom: 1px;
//     width: 100%;
//     border: 2px solid green;
// `
const CajaFija = styled.div`
  background-color: #000000;
  display: none;
  width: 50px;
  height: 50px;
  position: fixed;

  bottom: 20px;
  right: 70px;
  z-index: 101;
  @media screen and (max-width: 620px) {
    display: block;
  }
`;
const WrapTextoEpty = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const TituloMateriales = styled.h2`
  width: 100%;
  text-align: center;
  color: white;
  font-weight: 200;
`;
