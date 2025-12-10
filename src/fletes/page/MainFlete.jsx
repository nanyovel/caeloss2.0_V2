import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { OpcionUnica } from "../../components/OpcionUnica.jsx";
import { AvisoModal } from "../../components/Avisos/AvisoModal.jsx";
import { Alerta } from "../../components/Alerta.jsx";
import { obtenerDocPorId } from "../../libs/useDocByCondition.js";

import { formatoDOP, soloNumeros } from "../../libs/StringParsed.jsx";
import { dbProvincias } from "../DBFletex.jsx";
import {
  FormulaOficialFlete,
  RangoRadio,
} from "../components/FormulaOficialFlete.js";
import { CSSLoader } from "../../components/CSSLoader.jsx";
import {
  km13Localidad,
  localidades,
  localidadesAlmacen,
  pantojaLocalidad,
} from "../../components/corporativo/Corporativo.js";
import { ClearTheme, Tema, Theme } from "../../config/theme.jsx";
import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
} from "../../components/InputGeneral.jsx";
import { BtnGeneralButton } from "../../components/BtnGeneralButton.jsx";

import { reqSchema } from "../../transportes/schemas/reqSchema.js";
import { GenerarMonto } from "../../transportes/libs/GenerarMonto.js";
import { detallesPagoVehiculo } from "../../transportes/schemas/mixSchema.js";
import { generarUUID } from "../../libs/generarUUID.js";
import { BotonQuery } from "../../components/BotonQuery.jsx";
import { datosEntregaSchemaVehAdd } from "../../transportes/schemas/vehiculoAddSchema.js";

export const MainFlete = ({
  datosFlete,
  setDatosFlete,
  tipoSolicitud,
  setDatosMontos,
  resetValue,
  userMaster,
  plantilla,
}) => {
  // ******** RECURSOS GENERALES *******
  // Alertas
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [hasModal, setHasModal] = useState(false);

  // ******** Detalle de camiones desde la base de datos ********
  const [camionesDB, setCamionesDB] = useState([]);
  obtenerDocPorId("miscelaneo", "detallesCamiones", setCamionesDB);

  // ********************* UseEffect INITIAL ****************************
  const resultadoImprimirPlantilla = {
    costo: "-",
    precio: "-",
    distancia: "-",
    destino: "-",
    provincia: "-",
    mapa: "",
  };
  const [datosFleteEditable, setDatosFleteEditable] = useState({});
  const [datosFleteInitial, setDatosFleteInitial] = useState({});
  const [municipiosAplanadoAux, setMunicipiosAplanadosAux] = useState([]);

  const [resultadoImprimir, setResultadoImprimir] = useState({});
  const [resultadoImprimirInitial, setResultadoImprimirInitial] = useState({});

  const [datosParseados, setDatosParseados] = useState(false);

  useEffect(() => {
    const listaMunicipios = new Set();
    const provinciasSinMunRepetidos = dbProvincias.map((pro, index) => {
      return {
        ...pro,
        municipios: pro.municipios.map((muni, i) => {
          if (listaMunicipios.has(muni.label) == false) {
            listaMunicipios.add(muni.label);
            return {
              ...muni,
            };
          } else {
            return {
              ...muni,
              label: muni.label + "A" + i + index,
            };
          }
        }),
      };
    });
    const localidadParsed =
      tipoSolicitud == 1
        ? [...localidades, km13Localidad, pantojaLocalidad]
        : localidades;
    const datosFletePlantillaInicial = {
      ...reqSchema.datosFlete,
      puntoPartida: localidadParsed.map((localidad) => {
        return {
          ...localidad,
          nombre: localidad.nombreResumido,
        };
      }),
      destinos: provinciasSinMunRepetidos,
    };

    if (camionesDB?.array?.length > 0 && reqSchema.datosFlete) {
      setResultadoImprimir(resultadoImprimirPlantilla);
      setResultadoImprimirInitial(resultadoImprimirPlantilla);

      const datosFleteAux = {
        ...datosFletePlantillaInicial,
        destinos: datosFletePlantillaInicial.destinos.map(
          (provincia, index) => {
            const municipioParsed = provincia.municipios.map((municipio) => {
              return { ...municipio, select: false };
            });

            return {
              ...provincia,
              municipios: municipioParsed,
              select: false,
            };
          }
        ),
        unidadVehicular: camionesDB.array,
        // 29/11 continuar aqui
      };

      // PARSEAR VEHICULOS ADICIONALES
      const vehiculosAdd = arrayVehiculosAdd.flatMap((vehiculo) => vehiculo);
      const vehiculosAddFiltradosAux = vehiculosAdd
        .filter((vehiculo) => vehiculo.select)
        .map((vehiculo) => {
          const { groupNumber, ...vehiculoSinGroupNumber } = vehiculo;
          return {
            ...vehiculoSinGroupNumber,
          };
        });
      const datosFleteVehAddParsed = {
        ...datosFleteAux,
        vehiculosAdicionales: vehiculosAddFiltradosAux,
      };

      setDatosFleteEditable(datosFleteVehAddParsed);
      setDatosFleteInitial(datosFleteVehAddParsed);
      setDatosFlete(datosFleteVehAddParsed);
      setMunicipiosAplanadosAux(
        datosFleteVehAddParsed.destinos.map((destino) => {
          return destino;
        })
      );
      setMunicipiosAplanadosAux(
        datosFleteAux.destinos.flatMap((destino) => destino.municipios)
      );
      const resultadoAux = {
        ...resultadoImprimirInitial,
        mapa: datosFleteAux.puntoPartida.find((punto) => {
          if (punto.select == true) {
            return punto;
          }
        }).mapa,
      };
      console.log(resultadoAux);
      setResultadoImprimirInitial(resultadoAux);
      setResultadoImprimir(resultadoAux);

      setDatosParseados(true);
    }
  }, [camionesDB, reqSchema]);

  // ****** RESETEAR VALORES, LUEGO DE ENVIAR UNA SOLICITUD ******

  useEffect(() => {
    setDatosFleteEditable({ ...datosFleteInitial });
    setResultadoImprimir({ ...resultadoImprimirInitial });
    setMunicipioInputAux("");
  }, [resetValue]);

  useEffect(() => {
    if (datosParseados) {
      setMunicipiosAplanadosAux(
        datosFleteEditable.destinos.flatMap((destino) => destino.municipios)
      );
    }
  }, [datosFleteEditable]);

  const [distanciaManualInputs, setDistanciaManualInputs] = useState("");
  const [rutaPeligrosa, setRutaPeligrosa] = useState(false);
  const [municipioInputAux, setMunicipioInputAux] = useState("");

  // ********************* ALIMENTAR DESDE PLANTILLA *********************
  const [plantillaEjecutada, setPlantillaEjecutada] = useState(false);
  useEffect(() => {
    console.log(plantilla);
    if (plantilla && datosParseados) {
      let fleteEditableAux = { ...datosFleteEditable };

      // **************** ELEGIR MODALIDAD ****************
      let indexModalidad = null;
      plantilla.datosFlete.modalidad.forEach((modalidad, index) => {
        if (modalidad.select == true) {
          indexModalidad = index;
        }
      });
      fleteEditableAux = elegirModalidad(indexModalidad, fleteEditableAux);
      // Si la modalidad selecionada es por kilometro
      if (indexModalidad == 1) {
        setDistanciaManualInputs(plantilla.datosFlete.distanciaManualInputs);
      }

      // **************** ELEGIR PUNTO PARTIDA ****************
      const codePlantilla =
        plantilla.datosFlete.puntoPartidaSeleccionado.codigoInterno;
      fleteEditableAux = elegirPuntoPartida(
        null,
        fleteEditableAux,
        codePlantilla
      );
      // **************** ELEGIR DESTINO ****************
      if (plantilla.datosFlete.provinciaSeleccionada) {
        const valueDestino =
          plantilla.datosFlete.provinciaSeleccionada.municipioSeleccionado
            .label;
        fleteEditableAux = elegirDestino(valueDestino, fleteEditableAux);
      }
      // setMunicipioInputAux(valueManucipio);
      setDatosFleteEditable({ ...fleteEditableAux });
      setDatosFlete({ ...fleteEditableAux });
      console.log(fleteEditableAux);
    }
  }, [plantilla, datosParseados]);

  useEffect(() => {
    console.log(datosFlete);
  }, [datosFlete]);

  const elegirModalidad = (index, fleteEditableAux) => {
    const fleteEditableParsed = (fleteEditableAux = {
      ...datosFleteInitial,
      modalidad: datosFleteInitial.modalidad.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      })),
    });
    setResultadoImprimir({ ...resultadoImprimirInitial });
    setMunicipioInputAux("");

    return fleteEditableParsed;
  };
  const elegirPuntoPartida = (index, fleteEditableAux, codePlantilla) => {
    const fleteEditableParsed = (fleteEditableAux = {
      ...fleteEditableAux,
      puntoPartida: fleteEditableAux.puntoPartida.map((opcion, i) => {
        let puntoDeseado = false;
        // SI es por plantilla o si es por handleInput
        if (index || index == 0) {
          if (i == index) {
            puntoDeseado = true;
          }
        } else {
          if (codePlantilla) {
            if (opcion.codigoInterno === codePlantilla) {
              puntoDeseado = true;
            }
          }
        }

        if (puntoDeseado) {
          setResultadoImprimir({
            ...resultadoImprimir,
            mapa: opcion.mapa,
          });
        }
        return {
          ...opcion,
          select: puntoDeseado,
        };
      }),
    });
    return fleteEditableParsed;
  };
  const elegirDestino = (value, fleteEditableAux) => {
    console.log(value);
    setMunicipioInputAux(value);
    const fleteEditableParsed = {
      ...fleteEditableAux,
      destinos: fleteEditableAux.destinos.map((provincia, index) => {
        let provincialSelecionada = false;
        const municipioParsed = provincia.municipios.map((municipio) => {
          if (municipio.label == value) {
            console.log("🔴🔴🔴🔴🔴");
            provincialSelecionada = true;
            return {
              ...municipio,
              select: true,
            };
          } else {
            return { ...municipio, select: false };
          }
        });
        return {
          ...provincia,
          municipios: municipioParsed,
          select: provincialSelecionada,
        };
      }),
    };
    return fleteEditableParsed;
  };

  // ********************* MANEJANDO LOS INPUTS *********************
  const handleInputs = (event) => {
    let index = Number(event.target.dataset.id);
    const { name, value } = event.target;
    const nameDataset = event.target.dataset.name;

    // **** UNICAMENTE SELECCIONAR ****
    let fleteEditableAux = { ...datosFleteEditable };
    let distanciaManualAux = "";
    if (name == "modalidad") {
      setDistanciaManualInputs("");
      fleteEditableAux = elegirModalidad(index, fleteEditableAux);
    } else if (name == "puntoPartida") {
      fleteEditableAux = elegirPuntoPartida(index, fleteEditableAux, null);
    } else if (name == "destino") {
      fleteEditableAux = elegirDestino(value, fleteEditableAux);
    } else if (nameDataset == "vehiculo") {
      const indexDataset = Number(event.target.dataset.id);
      fleteEditableAux = {
        ...fleteEditableAux,
        unidadVehicular: fleteEditableAux.unidadVehicular.map(
          (vehiculo, index) => {
            return {
              ...vehiculo,
              select: indexDataset == index,
            };
          }
        ),
      };
    } else if (name == "distanciaManual") {
      if (soloNumeros(Number(value))) {
        const valorParsed = Number(value);

        setDistanciaManualInputs(valorParsed);

        distanciaManualAux = valorParsed;
      }
      // que acepte punto
      if (value.slice(-1) == ".") {
        setDistanciaManualInputs(value);
      }
      fleteEditableAux = {
        ...fleteEditableAux,
        distancia: distanciaManualAux,
      };
    } else if (name == "sucOrigen") {
      fleteEditableAux = {
        ...fleteEditableAux,
        puntoPartida: fleteEditableAux.puntoPartida.map((punto, i) => {
          return {
            ...punto,
            // select: i == Number(value),
            select: punto.nombreSucursalOrigen == value,
          };
        }),
      };
    } else if (name == "sucDestino") {
      console.log(value);
      // return;
      fleteEditableAux = {
        ...fleteEditableAux,
        destinos: fleteEditableAux.destinos.map((destino, i) => {
          let municipioSeleccionado = false;
          const municipios = destino.municipios.map((muni) => {
            if (muni.hasSucursal == true && muni.codigoInterno == value) {
              municipioSeleccionado = true;
              return {
                ...muni,
                select: true,
              };
            } else {
              return {
                ...muni,
                select: false,
              };
            }
          });
          return {
            ...destino,
            municipios: municipios,
            select: municipioSeleccionado,
          };
        }),
        sucDestino: localidadesAlmacen.find(
          (local) => local.codigoInterno == value
        ),
      };
    }

    if (fleteEditableAux.modalidad[1].select && name != "distanciaManual") {
      distanciaManualAux = distanciaManualInputs;
      fleteEditableAux = {
        ...fleteEditableAux,
        distancia: distanciaManualAux,
      };
    }

    // Agregale un id como un elemento a cada camion
    // Esto para poder relacionarlo con cada monto y luego estos monto poder relacionarse con cada pago

    // fleteEditableAux = {
    //   ...fleteEditableAux,
    //   idCamionComoElemento: generarUUID(),
    // };
    //
    //
    //
    //
    // FIN DE LOS INPUTS PRINCIPALES
    //
    //

    // ******* Inicio del codigo para realizar Calculo *******
    const validacion = {
      hasModalidad: false,
      hasPuntoPartida: false,
      hasDestino: false,
      hasVehiculo: false,
    };
    setDatosFleteEditable({ ...fleteEditableAux });
    setDatosFlete({ ...fleteEditableAux });
    // Validacion para calculo
    fleteEditableAux.modalidad.forEach((modalidad) => {
      if (modalidad.select == true) {
        validacion.hasModalidad = true;
      }
    });
    fleteEditableAux.puntoPartida.forEach((punto) => {
      if (punto.select == true) {
        validacion.hasPuntoPartida = true;
      }
    });
    fleteEditableAux.destinos.forEach((destino) => {
      let hasMunicipio = false;
      destino.municipios.forEach((municipio) => {
        if (municipio.select == true) {
          hasMunicipio = true;
        }
      });
      if (destino.select == true && hasMunicipio == true) {
        validacion.hasDestino = true;
      }
    });
    fleteEditableAux.unidadVehicular.forEach((vehiculo) => {
      if (vehiculo.select == true) {
        validacion.hasVehiculo = true;
      }
    });

    // Si todo esta correcto, realiza el calculo
    // Si todo esta correcto, realiza el calculo
    // Si todo esta correcto, realiza el calculo
    if (
      validacion.hasModalidad == true &&
      validacion.hasPuntoPartida == true &&
      (validacion.hasDestino == true ||
        fleteEditableAux.modalidad[1].select == true) &&
      validacion.hasVehiculo == true
    ) {
      calcular(fleteEditableAux);
      setFleteParseado(fleteEditableAux);
    } else {
      // *************************** AUNQUE EL CALCULO NO SE CULMINE, INFORMA AL PADRE*****************
      // *************************** AUNQUE EL CALCULO NO SE CULMINE, INFORMA AL PADRE*****************
      // *************************** AUNQUE EL CALCULO NO SE CULMINE, INFORMA AL PADRE*****************
      // *************************** AUNQUE EL CALCULO NO SE CULMINE, INFORMA AL PADRE*****************
      // *************************** AUNQUE EL CALCULO NO SE CULMINE, INFORMA AL PADRE*****************
      // Aunque no se halla seleccionado todo, es necesario llenar datosFlete, para informar a los componentes padres los datos que si estan llenos y los campos que siguen vacios, para las validaciones
      //
      //
      // LAS PROXIMAS VARIABLES A DECLARA SON EXCLUSIVAMENTE AUXILIARES PARA PODER INFORMAR A COMPONENTE PADRE; CUALES CAMPOS ESTAN LLENADOS CORRECTAMENTE Y CUALES NO.
      const puntoPartidaSeleccionado = fleteEditableAux?.puntoPartida.find(
        (punto) => punto.select
      );
      const provinciaSeleccionada = fleteEditableAux.destinos.find(
        (destino) => destino.select
      );
      // Elimina el array municipios de la provincia seleccionada
      const { municipios, ...provinciaSinMunicipios } =
        provinciaSeleccionada || "";
      const municipioSeleccionado = provinciaSeleccionada?.municipios.find(
        (municipio) => municipio.select
      );

      const unidadVehicularSeleccionado =
        fleteEditableAux?.unidadVehicular.find((vehiculo) => vehiculo.select);

      setDatosFlete({
        ...fleteEditableAux,
        modalidad:
          validacion.hasModalidad == true ? fleteEditableAux.modalidad : null,
        puntoPartidaSeleccionado:
          validacion.hasPuntoPartida == true ? puntoPartidaSeleccionado : null,
        // validacion.hasPuntoPartida == true
        //   ? fleteEditableAux.puntoPartida
        //   : null,
        provinciaSeleccionada:
          validacion.hasDestino == true
            ? {
                ...provinciaSinMunicipios,
                municipioSeleccionado: municipioSeleccionado,
              }
            : null,
        vehiculoSeleccionado:
          validacion.hasVehiculo == true ? unidadVehicularSeleccionado : null,
      });
    }
    //
    // **** FIN DEL CODIGO PARA SELECIONAR ****
    //
  };

  // ******************REALIZAR CALCULO*************
  const [resultadoFinal, setResultadoFinal] = useState(null);
  const calcular = (datosFleteCalc) => {
    const resultado = FormulaOficialFlete(datosFleteCalc, tipoSolicitud);
    console.log(resultado);
    setResultadoFinal(resultado);

    //Si el destino es Micges, notificar con alerta,
    if (resultado.alerta) {
      setMensajeAlerta(resultado.mensaje);
      setTipoAlerta(resultado.tipo);
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), resultado.duracion);

      setResultadoImprimir({
        ...resultadoImprimirInitial,
      });
      return "";
    } else {
      setDispatchAlerta(false);
    }

    // ******************************** PARA IMPRIMIR ********************************
    // ******************************** PARA IMPRIMIR ********************************
    // ******************************** PARA IMPRIMIR ********************************
    // ******************************** PARA IMPRIMIR ********************************
    // ******************************** PARA IMPRIMIR ********************************
    // ******************************** PARA IMPRIMIR ********************************
    const municipioSeleccionado = datosFleteCalc?.destinos
      ?.find((destino) => destino.select == true)
      ?.municipios?.find((municipio) => municipio.select == true);

    const puntoPartida = datosFleteCalc.puntoPartida.find(
      (punto) => punto.select
    );

    // DISTANCIA
    const destinoSeleccionado = datosFleteCalc?.destinos?.find(
      (destino) => destino.select
    );
    const distanciaParsed = resultado.distancia + "KM";
    // ((destinoSeleccionado?.codeLabel == "Radio") == false ? "KM" : "");

    // DESTINO // MUNICIPIO
    let destinoParsed = "";
    if (datosFleteCalc.modalidad[0].select == true) {
      destinoParsed = datosFleteCalc?.destinos
        .find((destino) => destino.select == true)
        .municipios?.find((municipio) => municipio.select == true).label;
    } else if (datosFleteCalc.modalidad[1].select) {
      destinoParsed = RangoRadio(datosFleteCalc.distancia);
    }

    // PROVINCIA
    let provinciaParsed = "";
    if (datosFleteCalc.modalidad[0].select == true) {
      provinciaParsed = datosFleteCalc.destinos.find(
        (destino) => destino.select == true
      ).label;
    }

    // MAPA
    let linkMapaParsed;
    if (datosFleteCalc.modalidad[0].select) {
      linkMapaParsed = municipioSeleccionado[puntoPartida?.nombreLink];
    } else if (datosFleteCalc.modalidad[1].select) {
      linkMapaParsed = datosFleteCalc.puntoPartida.find(
        (punto) => punto.select
      ).mapa;
    }
    if (municipioSeleccionado?.label == "Miches") {
      setRutaPeligrosa(true);
      setMensajeAlerta(
        "Para visitar Miches se recomienda tomar la ruta por Punta Cana, para evitar accidentes."
      );
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 9000);
    } else {
      setRutaPeligrosa(false);
    }

    console.log(destinoParsed);
    setResultadoImprimir({
      ...resultadoImprimir,
      costo: resultado.costo,
      precio: resultado.precio,
      distancia: distanciaParsed,
      destino: destinoParsed,
      provincia: provinciaParsed,
      mapa: linkMapaParsed,
    });
    // if (tipoSolicitud == 0) {
    if (true) {
      //
      // ******************************** PARA SUBIR A LA BASE DE DATOS ********************************
      // ******************************** PARA SUBIR A LA BASE DE DATOS ********************************
      // ******************************** PARA SUBIR A LA BASE DE DATOS ********************************
      // ******************************** PARA SUBIR A LA BASE DE DATOS ********************************
      // ******************************** PARA SUBIR A LA BASE DE DATOS ********************************
      // ******************************** PARA SUBIR A LA BASE DE DATOS ********************************
      //
      // Elimina el array destinos, punto de partida unidad vehicular; que son todas las provincias
      // const { destinos, puntoPartida, unidadVehicular, ...fleteParsed } =
      //   datosFleteCalc;
      const fleteParsed = datosFleteCalc;

      // Dame solamente la provincia seleccionada
      const provinciaSeleccionada = datosFleteCalc.destinos.find(
        (destino) => destino.select
      );
      // Elimina el array municipios de la provincia seleccionada
      const { municipios, ...provinciaSinMunicipios } =
        provinciaSeleccionada || "";
      // Dame solamente el municipio seleccionado
      const municipioSeleccionado = provinciaSeleccionada?.municipios.find(
        (municipio) => municipio.select
      );
      // Dame solamente el punto de partida seleccionado
      const puntoPartidaSeleccionado = datosFleteCalc?.puntoPartida.find(
        (punto) => punto.select
      );
      const unidadVehicularSeleccionado = datosFleteCalc?.unidadVehicular.find(
        (vehiculo) => vehiculo.select
      );

      const datosPrincipal = {
        ...fleteParsed,
        idCamionComoElemento: generarUUID(),
        costo: resultado.costo,
        precio: resultado.precio,
        puntoPartidaSeleccionado: puntoPartidaSeleccionado,
        provinciaSeleccionada: datosFleteCalc.modalidad[0].select
          ? {
              ...provinciaSinMunicipios,
              municipioSeleccionado: municipioSeleccionado,
            }
          : {
              label: "Por kilometros",
              select: true,

              municipioSeleccionado: {
                label: "Por kilometros",
                distanciaBvro: 0,
                distanciaPyL: 0,
                distanciaSD: 0,
                distanciaStgo: 0,
                distanciaZO: 0,
                linkSD:
                  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7568.328028508939!2d-69.95935031051269!3d18.47622850753703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1694482832742!5m2!1sen!2sdo" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
                linkBvro:
                  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.475213389718!2d-68.41801832505466!3d18.642659465433997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1694483436524!5m2!1sen!2sdo" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
                linkPyL:
                  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.7625242706954!2d-69.89758222505777!3d18.494412969973272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl!5e0!3m2!1sen!2sdo!4v1694483751959!5m2!1sen!2sdo" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
                linkZO:
                  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.879968184371!2d-69.84916962505694!3d18.53432556875443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1694483966098!5m2!1sen!2sdo" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
                linkStgo:
                  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.4539742057013!2d-70.7253629250362!3d19.47909493919493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos!5e0!3m2!1sen!2sdo!4v1694484146173!5m2!1sen!2sdo" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
                provincia: "Por kilometros",
                select: true,
              },
            },
        vehiculoSeleccionado: unidadVehicularSeleccionado,
        distancia: resultado.distancia,
        modalidad: datosFleteCalc.modalidad,

        destino: destinoParsed,
        mapa: linkMapaParsed,
        distanciaManualInputs: distanciaManualInputs,
      };
      setDatosFlete({ ...datosPrincipal });
      //
    }
  };
  //
  //
  // Actualizar datos montos
  useEffect(() => {
    let proceder = false;
    // *************DATOS MONTOS***********
    //
    // 7878

    const unidadVehicularSeleccionado = datosFlete?.vehiculoSeleccionado;
    if (unidadVehicularSeleccionado && resultadoImprimir.costo) {
      proceder = true;
    }
    if (proceder) {
      const datosMontosAux = GenerarMonto({
        // Initial formula
        datosFlete: datosFlete,
        origen: 0,
        userMaster: userMaster,
      });

      //
      if (tipoSolicitud != "fletes") {
        setDatosMontos([{ ...datosMontosAux }]);
      }
    }
  }, [datosFlete]);

  // 7475
  // Poder agregar mas de un vehiculo
  const [arrayVehiculosAdd, setArrayVehiculosAdd] = useState([]);
  const agregarGroupVeh = (e) => {
    const name = e.target.name;
    const nuevoGrupo = datosFleteEditable.unidadVehicular.map(
      (vehiculo, index) => {
        return {
          ...vehiculo,
          groupNumber: arrayVehiculosAdd.length,
          datosEntrega: {
            ...datosEntregaSchemaVehAdd,
          },
          detallesPago: {
            ...detallesPagoVehiculo,
          },
          select: false,
          ayudantesAdicionales: [],
        };
      }
    );

    if (name == "mas") {
      // ******* PARA SELECCIONAL UN SEGUN VEHICULO PRIMERO CALCULA TODO *******
      const hasProceder = validacionVehiculoAdd();
      if (hasProceder == false) {
        return;
      }
      if (arrayVehiculosAdd.length >= 5) {
        setMensajeAlerta("Solo se permite adicional hasta 5 vehiculos.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
      if (arrayVehiculosAdd.length == 0) {
        setArrayVehiculosAdd([[...nuevoGrupo]]);
      } else {
        setArrayVehiculosAdd([...arrayVehiculosAdd, nuevoGrupo]);
      }
    } else if (name == "menos") {
      setArrayVehiculosAdd((prev) => prev.slice(0, -1));
    }
  };

  // ********************* MANEJANDO LOS INPUTS *********************
  const [fleteParseado, setFleteParseado] = useState({});
  const handleVehiculosAdicion = (event) => {
    if (validacionVehiculoAdd() == false) {
      return;
    }
    let index = Number(event.target.dataset.id);
    const nameDataset = event.target.dataset.name;
    const groupNumber = event.target.dataset.groupnumber;

    // **** UNICAMENTE SELECCIONAR ****
    let arrayVehiculoAux = [];
    if (nameDataset == "vehiculo") {
      const indexDataset = Number(event.target.dataset.id);

      const newAdd = arrayVehiculosAdd.map((vehiculos, indexGroup) => {
        if (groupNumber == indexGroup) {
          return [
            ...vehiculos.map((driver, indexVehiculo) => {
              let seleccionado = false;
              if (indexDataset == indexVehiculo) {
                seleccionado = true;
              }
              return {
                ...driver,
                select: seleccionado,
                idCamionComoElemento: generarUUID(),
              };
            }),
          ];
        } else {
          return vehiculos;
        }
      });
      setArrayVehiculosAdd(newAdd);
      arrayVehiculoAux = newAdd;
    }

    // Si todo esta correcto, realiza el calculo
    // Dame el vehiculo que seleccionaste
    const thisVehiculo = arrayVehiculoAux[groupNumber].find(
      (vehiculo) => vehiculo.select
    );
    if (thisVehiculo) {
      const resultado = FormulaOficialFlete(
        fleteParseado,
        tipoSolicitud,
        thisVehiculo
      );

      const newArray2 = arrayVehiculoAux.map((group, index) => {
        if (group[0].groupNumber == groupNumber) {
          return group.map((vehiculo) => {
            if (vehiculo.select) {
              return {
                ...vehiculo,
                resultado: resultado,
              };
            } else {
              return { ...vehiculo, resultado: {} };
            }
          });
        } else {
          return group;
        }
      });
      setArrayVehiculosAdd(newArray2);
    }
  };
  const validacionVehiculoAdd = () => {
    let proceder = true;
    // ******* PARA SELECCIONAL UN SEGUN VEHICULO PRIMERO CALCULA TODO *******
    const validacion = {
      hasModalidad: false,
      hasPuntoPartida: false,
      hasDestino: false,
      hasVehiculo: false,
    };
    let fleteEditableAux = {
      ...datosFleteEditable,
    };

    // Selecciono modalidad
    fleteEditableAux.modalidad.forEach((modalidad) => {
      if (modalidad.select == true) {
        validacion.hasModalidad = true;
      }
    });
    // Esta validacion nunca deberia ejecutarse
    if (!validacion.hasModalidad) {
      setMensajeAlerta("Primero debe seleccionar modalidad.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      proceder = false;
    }
    // Selecciono punto de partida
    fleteEditableAux.puntoPartida.forEach((punto) => {
      if (punto.select == true) {
        validacion.hasPuntoPartida = true;
      }
    });
    if (!validacion.hasPuntoPartida) {
      setMensajeAlerta("Selecciona punto de partida.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      proceder = false;
    }
    // Selecciono destino
    fleteEditableAux.destinos.forEach((destino) => {
      let hasMunicipio = false;
      destino.municipios.forEach((municipio) => {
        if (municipio.select == true) {
          hasMunicipio = true;
        }
      });
      if (destino.select == true && hasMunicipio == true) {
        validacion.hasDestino = true;
      }
    });
    if (!validacion.hasDestino) {
      setMensajeAlerta("Selecciona destino.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      proceder = false;
    }
    // Selecciono vehiculo del grupo Master
    fleteEditableAux.unidadVehicular.forEach((vehiculo) => {
      if (vehiculo.select == true) {
        validacion.hasVehiculo = true;
      }
    });
    if (!validacion.hasVehiculo) {
      setMensajeAlerta("Selecciona camion principal.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      proceder = false;
    }

    return proceder;
  };

  useEffect(() => {
    if (datosParseados) {
      const vehiculosAdd = arrayVehiculosAdd.flatMap((vehiculo) => vehiculo);
      const vehiculosAddFiltradosAux = vehiculosAdd
        .filter((vehiculo) => vehiculo.select)
        .map((vehiculo) => {
          const { groupNumber, ...vehiculoSinGroupNumber } = vehiculo;
          return {
            ...vehiculoSinGroupNumber,
          };
        });

      setDatosFlete({
        ...datosFlete,
        vehiculosAdicionales: vehiculosAddFiltradosAux,
      });
      setDatosFleteEditable({
        ...datosFleteEditable,
        vehiculosAdicionales: vehiculosAddFiltradosAux,
      });
    }
  }, [arrayVehiculosAdd]);
  //
  return datosParseados ? (
    <Container>
      <BotonQuery
        datosFlete={datosFlete}
        datosFleteEditable={datosFleteEditable}
        arrayVehiculosAdd={arrayVehiculosAdd}
        resultadoImprimir={resultadoImprimir}
      />

      <>
        {tipoSolicitud == 1 && (
          <Container2px className={Theme.config.modoClear ? "clearModern" : ""}>
            <CajasInterna>
              <CajitaDetalle
                className={Theme.config.modoClear ? "clearModern" : ""}
              >
                <TituloDetalle
                  className={Theme.config.modoClear ? "clearModern" : ""}
                >
                  Sucursal Origen:
                </TituloDetalle>
                <MenuDesplegable2
                  className={Theme.config.modoClear ? "clearModern" : ""}
                  value={
                    datosFleteEditable.puntoPartida.find(
                      (opcion) => opcion.select === true
                    )?.nombreSucursalOrigen
                  }
                  name="sucOrigen"
                  onChange={(e) => {
                    handleInputs(e);
                  }}
                >
                  {datosFleteEditable.puntoPartida
                    .filter((opcion) => {
                      if (opcion.codigoInterno != "p&L03") {
                        return opcion;
                      }
                    })

                    .map((opcion, index) => {
                      return (
                        <Opciones2
                          value={opcion.nombreSucursalOrigen}
                          key={index}
                        >
                          {opcion.nombreSucursalOrigen}
                        </Opciones2>
                      );
                    })}
                </MenuDesplegable2>
              </CajitaDetalle>
              <CajitaDetalle
                className={Theme.config.modoClear ? "clearModern" : ""}
              >
                <TituloDetalle
                  className={Theme.config.modoClear ? "clearModern" : ""}
                >
                  Sucursal destino:
                </TituloDetalle>

                <MenuDesplegable2
                  className={Theme.config.modoClear ? "clearModern" : ""}
                  value={
                    (municipiosAplanadoAux.length > 0 &&
                      municipiosAplanadoAux?.find((muni) => muni.select == true)
                        ?.codigoInterno) ||
                    ""
                  }
                  name="sucDestino"
                  onChange={(e) => {
                    handleInputs(e);
                  }}
                >
                  <Opciones2
                    value=""
                    disabled
                    className={Theme.config.modoClear ? "clearModern" : ""}
                  >
                    Seleccione sucursal
                  </Opciones2>

                  {municipiosAplanadoAux
                    .filter((mun, index) => {
                      if (mun.hasSucursal) {
                        return mun;
                      }
                    })
                    .map((mun, index) => {
                      return (
                        <Opciones2
                          className={
                            Theme.config.modoClear ? "clearModern" : ""
                          }
                          data-provincia={mun.provincia}
                          value={mun.codigoInterno}
                          key={index}
                        >
                          {mun.nombreSucursal}
                        </Opciones2>
                      );
                    })}
                </MenuDesplegable2>
              </CajitaDetalle>
            </CajasInterna>
          </Container2px>
        )}
        {tipoSolicitud != 1 && (
          <>
            <SeccionParametros>
              <OpcionUnica
                titulo="Modalidad"
                name="modalidad"
                arrayOpciones={datosFleteEditable?.modalidad}
                handleOpciones={handleInputs}
                flete={true}
                masPeque={true}
              />

              <OpcionUnica
                titulo="Punto de partida"
                name="puntoPartida"
                arrayOpciones={datosFleteEditable?.puntoPartida}
                handleOpciones={handleInputs}
                flete={true}
              />
            </SeccionParametros>

            <SeccionEntradaDatos className="oficial seccionDestino">
              {datosFleteEditable?.modalidad[0]?.select ? (
                <>
                  <CajaEntrada>
                    <TituloSimple>Destinos:</TituloSimple>
                    <InputDesplegable
                      className={Theme.config.modoClear ? "clearModern" : ""}
                      placeholder="Empiece a escribir el destino"
                      name="destino"
                      value={municipioInputAux}
                      list="municipios"
                      onChange={(e) => handleInputs(e)}
                      autoComplete="off"
                    />
                    <DataList id="municipios">
                      {datosFleteEditable.destinos
                        .flatMap((provincia) => provincia.municipios)
                        .map((mun, index) => {
                          return (
                            <Opcion
                              data-provincia={mun.provincia}
                              value={mun.label}
                              key={index}
                            >
                              {mun.provincia}
                            </Opcion>
                          );
                        })}
                    </DataList>
                  </CajaEntrada>
                </>
              ) : (
                <CajaEntrada className="cajaDistancia">
                  <TituloSimple className="disKM">
                    Ingrese distancia en Km:
                  </TituloSimple>
                  <InputSencillo
                    placeholder="0"
                    name="distanciaManual"
                    value={distanciaManualInputs}
                    className={Theme.config.modoClear ? "clearModern" : ""}
                    onChange={(e) => handleInputs(e)}
                    autoComplete="off"
                  />
                </CajaEntrada>
              )}
            </SeccionEntradaDatos>
          </>
        )}

        <SeccionEntradaDatos className="seccionCamiones">
          <TituloSimple>Unidad Vehicular:</TituloSimple>
          <CajaCamiones>
            {datosFleteEditable.unidadVehicular?.map((vehiculo, index) => {
              return (
                <Card
                  className={`
                    ${vehiculo.select == true ? "selected" : ""}
                    ${Theme.config.modoClear ? "clearModern" : ""}
                    `}
                  data-id={index}
                  data-name="vehiculo"
                  key={index}
                  onClick={(e) => {
                    handleInputs(e);
                  }}
                >
                  <EnlacePrincipal>
                    <div>
                      <TextoCard
                        data-id={index}
                        data-name="vehiculo"
                        onClick={(e) => {
                          handleInputs(e);
                        }}
                      >
                        {vehiculo.descripcion}
                      </TextoCard>
                    </div>
                    <CajaImagen>
                      <ImagenCarro
                        src={vehiculo.urlFoto}
                        data-id={index}
                        data-name="vehiculo"
                        onClick={(e) => {
                          handleInputs(e);
                        }}
                      />
                    </CajaImagen>
                  </EnlacePrincipal>
                </Card>
              );
            })}
          </CajaCamiones>
          <VehiculosAdicionales>
            <CajaBtnVehiAdd>
              <BtnSimple name="mas" onClick={(e) => agregarGroupVeh(e)}>
                +
              </BtnSimple>
              <BtnSimple name="menos" onClick={(e) => agregarGroupVeh(e)}>
                -
              </BtnSimple>
            </CajaBtnVehiAdd>
            {arrayVehiculosAdd.length > 0 &&
              arrayVehiculosAdd.map((grupoVeh, index) => {
                return (
                  <CajaCamiones key={index}>
                    {grupoVeh?.map((vehiculo, index) => {
                      return (
                        <Card
                          className={`
                          ${vehiculo.select == true ? "selected" : ""}
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          `}
                          data-groupnumber={vehiculo.groupNumber}
                          data-id={index}
                          data-name="vehiculo"
                          key={index}
                          onClick={(e) => {
                            handleVehiculosAdicion(e);
                          }}
                        >
                          <EnlacePrincipal>
                            <div>
                              <TextoCard
                                data-groupnumber={vehiculo.groupNumber}
                                data-id={index}
                                data-name="vehiculo"
                                onClick={(e) => {
                                  handleVehiculosAdicion(e);
                                }}
                              >
                                {vehiculo.descripcion}
                              </TextoCard>
                            </div>
                            <CajaImagen>
                              <ImagenCarro
                                data-groupnumber={vehiculo.groupNumber}
                                src={vehiculo.urlFoto}
                                data-id={index}
                                data-name="vehiculo"
                                onClick={(e) => {
                                  handleVehiculosAdicion(e);
                                }}
                              />
                            </CajaImagen>
                          </EnlacePrincipal>
                        </Card>
                      );
                    })}
                  </CajaCamiones>
                );
              })}
          </VehiculosAdicionales>
        </SeccionEntradaDatos>

        <SeccionSalidaDatos>
          <CajaInput>
            <TextoInput>Costo</TextoInput>
            <ParrafoSalida>
              {resultadoImprimir.costo == "-"
                ? "-"
                : formatoDOP(
                    resultadoImprimir.costo +
                      arrayVehiculosAdd.reduce((acumulador, valorActual) => {
                        const sumaInterna = valorActual.reduce(
                          (suma, vehiculo) => {
                            return suma + (vehiculo?.resultado?.costo || 0);
                          },
                          0
                        );
                        return acumulador + sumaInterna;
                      }, 0)
                  ) || ""}
            </ParrafoSalida>
          </CajaInput>

          <CajaInput>
            <TextoInput>Precio</TextoInput>
            <ParrafoSalida>
              {/* {resultadoImprimir.precio == "-" ? "-" : resultadoImprimir.precio} */}
              {resultadoImprimir.precio == "-"
                ? "-"
                : formatoDOP(
                    resultadoImprimir.precio +
                      arrayVehiculosAdd.reduce((acumulador, valorActual) => {
                        const sumaInterna = valorActual.reduce(
                          (suma, vehiculo) => {
                            return suma + (vehiculo?.resultado?.precio || 0);
                          },
                          0
                        );
                        return acumulador + sumaInterna;
                      }, 0)
                  ) || ""}
            </ParrafoSalida>
          </CajaInput>

          <CajaInput>
            <TextoInput>Distancia</TextoInput>
            <ParrafoSalida>{resultadoImprimir.distancia}</ParrafoSalida>
          </CajaInput>
          <CajaInput>
            <TextoInput>Destino</TextoInput>
            <ParrafoSalida>
              {resultadoImprimir.destino == "-"
                ? "-"
                : resultadoImprimir.destino}
            </ParrafoSalida>
          </CajaInput>
          <CajaInput>
            <TextoInput>Provincia</TextoInput>
            <ParrafoSalida>
              {resultadoImprimir.provincia == "-"
                ? "-"
                : resultadoImprimir.provincia}
            </ParrafoSalida>
          </CajaInput>
        </SeccionSalidaDatos>

        {tipoSolicitud != 1 && (
          <SeccionMapa
            className={`${rutaPeligrosa ? " peligro " : ""} ${tipoSolicitud != "fletes" ? "anchoReducido" : ""}`}
          >
            {rutaPeligrosa ? (
              <TextoPeligro>DESTINO PELIGROSO</TextoPeligro>
            ) : (
              ""
            )}
            <div>
              <MapaGoogle
                src={resultadoImprimir.mapa ? resultadoImprimir.mapa : ""}
              ></MapaGoogle>
            </div>
          </SeccionMapa>
        )}

        <Alerta
          estadoAlerta={dispatchAlerta}
          tipo={tipoAlerta}
          mensaje={mensajeAlerta}
        />

        <AvisoModal
          tituloMain={"Ruta peligrosa"}
          tituloSecond={"Aviso"}
          hasModal={hasModal}
          setHasModal={setHasModal}
          hasBtnClose={true}
          tipo={"fletes"}
        >
          <CajaAviso>
            <TextoAviso>
              Miches se considera una ruta peligrosa, por lo cual es necesario
              que la ruta a utilizar sea a través de Punta Cana, a continuación
              algunas recomendaciones:
            </TextoAviso>
            <ListaDesordenada>
              <ElementosLista>
                Buscar asesoramiento con personal del área.{" "}
              </ElementosLista>
              <ElementosLista>
                Conversar con el chofer sobre el potencial peligro.{" "}
              </ElementosLista>
              <ElementosLista>Evaluar rutas seguras. </ElementosLista>
              <ElementosLista>Enviar un chofer experimentado. </ElementosLista>
              <ElementosLista>
                Indicarle al chofer que realice un chequeo de su unidad
                vehicular; frenos, neumáticos, luces y demás.{" "}
              </ElementosLista>
            </ListaDesordenada>
          </CajaAviso>
        </AvisoModal>
      </>
    </Container>
  ) : (
    <CajaSinCargar>
      <CSSLoader></CSSLoader>
    </CajaSinCargar>
  );
};
const CajaSinCargar = styled.div`
  min-height: 100vh;
`;
const Container = styled.div`
  position: relative;
  width: 100%;
`;
const CajaAviso = styled.div``;
const TextoAviso = styled.div`
  color: ${Tema.primary.azulBrillante};
`;
const ListaDesordenada = styled.ul`
  margin-left: 35px;
  color: ${Tema.secondary.azulOpaco};
`;
const ElementosLista = styled.li``;

const SeccionParametros = styled.section`
  margin-top: 10px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: row;
  padding: 15px;
  @media screen and (max-width: 820px) {
    flex-direction: column;
    gap: 5px;
    justify-content: start;
    align-items: start;
  }
  gap: 15px;
`;
const SeccionEntradaDatos = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;

  &.seccionDestino {
    /* height: 40px; */
  }
  &.seccionCamiones {
    padding: 10px;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
  }
  &.oficial {
    /* margin-bottom: 50px; */
  }
`;

const CajaEntrada = styled.div`
  display: flex;
  align-items: center;
  /* width: 40%; */
  /* height: 2rem; */
  margin-right: 25px;
  &.cajaDistancia {
    width: 60%;
  }

  @media screen and (max-width: 500px) {
    width: 100%;
    height: auto;
    padding: 5px;
    flex-direction: column;
    margin: 0;
  }
`;
const TituloSimple = styled.h2`
  font-size: 16px;
  font-weight: 400;
  display: inline-block;
  color: #fff;
  margin-bottom: 8px;
  margin-left: 20px;
  border-bottom: 1px solid #fff;
  margin-right: 15px;
  &.disKM {
    white-space: nowrap;
  }
`;
const CajaCamiones = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 100%;

  @media screen and (max-width: 620px) {
    margin: 0;
    flex-wrap: wrap;
  }
`;

const ImagenCarro = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Card = styled.div`
  width: 20%;
  height: 200px;
  border: 2px solid #535353;
  overflow: hidden;
  border-radius: 20px 0 20px 0;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  margin: 0 5px;
  margin-bottom: 25px;
  transition: border 0.4s ease;
  transition: width ease 0.5s;
  background-color: ${Tema.secondary.azulProfundo};
  &:hover {
    border: 2px solid ${Tema.primary.azulBrillante};
    cursor: pointer;
  }
  &.selected {
    border: 2px solid ${Tema.primary.azulBrillante};
    width: 50%;
  }

  @media screen and (max-width: 550px) {
    min-width: 33%;
    width: 50%;
    height: auto;
    flex-wrap: wrap;
    &.selected {
      border: 2px solid ${Tema.primary.azulBrillante};
      width: 100%;
    }
  }
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerde};
    background-color: transparent;
  }
`;
const EnlacePrincipal = styled.div`
  display: flex;
  flex-direction: column;
  text-decoration: none;
  /* opacity: 0.5; */
  position: relative;
  border-radius &:hover {
    opacity: 1;
    animation: arroz 1s;
    animation-direction: normal;
  }

  @keyframes arroz {
    0% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
`;

const CajaImagen = styled.div`
  display: block;
  width: 100%;
  height: 80%;
  background-size: contain;
  background-repeat: no-repeat;
  object-fit: cover;
  background-position: center;

  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const TextoCard = styled.h2`
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 200;
  text-align: center;
  background-color: ${Tema.complementary.success};
  height: 2rem;
  padding: 5px;
`;

const SeccionSalidaDatos = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  margin: auto;
  gap: 5px;
  margin-bottom: 20px;
`;

const CajaInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ParrafoSalida = styled.p`
  background-color: ${Tema.primary.grisNatural};
  color: white;
  min-width: 100px;
  padding: 0 10px;
  /* width: 150px; */
  height: 1.9rem;
  font-size: 0.9rem;
  border-radius: 5px;
  text-align: center;
  line-height: 1.8rem;
  align-items: center;
  outline: none;
  border: 1px solid black;
`;
const InputSencillo = styled(InputSimpleEditable)`
  /* background-color: ${Tema.primary.grisNatural}; */
  color: white;
  min-width: 150px;
  padding: auto 5px;
  height: 1.9rem;
  font-size: 0.9rem;
  border-radius: 5px;
  text-align: center;
  line-height: 1.8rem;
  align-items: center;
  outline: none;
  border: 1px solid black;
  &.anchoPagina {
    background-color: ${Tema.primary.grisNatural};
  }
`;

const TextoInput = styled.h2`
  font-size: 1.2rem;
  color: white;
  font-weight: lighter;
`;

const SeccionMapa = styled.div`
  &.peligro {
    border: 12px solid ${Tema.complementary.danger};
    background-color: ${Tema.complementary.danger};
  }

  width: 90%;
  margin: auto;
`;
const TextoPeligro = styled.h2`
  color: white;
  width: 100%;
  text-align: center;
  font-size: 28px;
  letter-spacing: 4px;
`;

const MapaGoogle = styled.iframe`
  width: 95%;
  display: block;
  margin: auto;
  height: 500px;
  border-radius: 5px;
  border: none;
  box-shadow: 5px 5px 5px -1px rgba(0, 0, 0, 0.43);
`;

const InputDesplegable = styled(InputSimpleEditable)`
  width: 300px;
  height: 35px;
  padding: 5px;
  border: none;
  border: 1px solid black;
  border-radius: 5px;

  outline: none;
  background-color: ${Tema.secondary.azulGraciel};
  color: ${Tema.primary.azulBrillante};
  display: flex;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }

  @media screen and (max-width: 550px) {
    width: 85%;
  }
`;
const DataList = styled.datalist`
  background-color: red;
  width: 150%;
`;

const Opcion = styled.option`
  background-color: red;
`;

const TituloDetalle = styled.p`
  width: 100%;
  padding-left: 5px;
  color: inherit;
  text-align: start;
  &.tituloArray {
    /* color: #a1a6aa; */
    text-decoration: underline;
  }
  color: ${Tema.secondary.azulOpaco};
  &.clearModern {
    color: ${ClearTheme.neutral.neutral600};
  }
`;

const MenuDesplegable2 = styled(MenuDesplegable)`
  outline: none;
  border: none;
  height: 30px;
  width: 100%;
  margin-bottom: 5px;
  border-radius: 4px;
  &.cabecera {
    border: 1px solid ${Tema.secondary.azulProfundo};
  }
  color: ${Tema.primary.azulBrillante};

  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
`;

const Opciones2 = styled(Opciones)`
  border: none;
`;

const CajitaDetalle = styled.div`
  display: flex;
  /* border-bottom: 1px solid ${Tema.secondary.azulOpaco}; */
  color: ${Tema.secondary.azulOpaco};

  background-color: ${Tema.secondary.azulProfundo};
  padding: 5px;
  border-radius: 5px;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1px;
  &.enArray {
    padding: 0;
  }
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerdeClaro};
    border: 1px solid black;
  }
`;

const Container2px = styled.div`
  border: 2px solid ${Tema.neutral.blancoHueso};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  background-color: ${Tema.secondary.azulProfundo};
  padding: 15px;
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulFrosting};
    backdrop-filter: blur(3px);
    border: 1px solid white;
  }
`;

const CajasInterna = styled.div`
  width: 50%;
  border-radius: 10px;
  padding: 10px;
`;
// 1208
const VehiculosAdicionales = styled.div``;
const CajaBtnVehiAdd = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const BtnSimple = styled(BtnGeneralButton)``;
