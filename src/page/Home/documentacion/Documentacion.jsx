import { Header } from "../../../components/Header";
import { DocumentacionParcial } from "./DocumentacionParcial";

export const Documentacion = () => {
  return (
    <>
      <Header titulo={"Sobre Caeloss"} />
      <DocumentacionParcial completa={true} />
    </>
  );
};
