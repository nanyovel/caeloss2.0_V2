// COMPONENTE MODIFICADO PARA QUE SEAN DOS VIDEOS ESTATICOS, QUEDA MUCHO CODIGO QUE NO SE ESTA UTILIZANDO, PARA EFICIENCIA DE LA BASE DE DATOS
// COMPONENTE MODIFICADO PARA QUE SEAN DOS VIDEOS ESTATICOS, QUEDA MUCHO CODIGO QUE NO SE ESTA UTILIZANDO, PARA EFICIENCIA DE LA BASE DE DATOS
// COMPONENTE MODIFICADO PARA QUE SEAN DOS VIDEOS ESTATICOS, QUEDA MUCHO CODIGO QUE NO SE ESTA UTILIZANDO, PARA EFICIENCIA DE LA BASE DE DATOS
//
// BASE DE DATOS ELIMINADA, LIKE QUE LE DIERON A LOS VIDEOS
//
// CALCULADORA DE FLETE
const like = [
  "epaniagua",
  "mcapote",
  "ematos",
  "hdelarosa",
  "lnunez",
  "jsanchez",
  "rbeltre",
  "jperez",
];
//
//// SISTEMA GESTION DE IMPORTACIONES
//
const likesSGI = [
  "epaniagua",
  "mcapote",
  "mmeran",
  "hdelarosa",
  "jperez",
  "jsanchez",
];

//

import { useEffect, useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { es } from "date-fns/locale";
// import { BotonQuery } from '../components/BotonQuery';
import { useParams } from "react-router-dom";

import { doc, updateDoc } from "firebase/firestore";

import { v4 as uuidv4 } from "uuid";

import { Alerta } from "../../../components/Alerta.jsx";
import db from "../../../firebase/firebaseConfig.js";
import { Tema, Theme } from "../../../config/theme.jsx";

export const TutorialesParcial = ({
  // setDBTutoriales,
  dbTutoriales,
  dbUsuario,
  userMaster,
}) => {
  // useDocByCondition("tutoriales", setDBTutoriales);
  // Variables varias necesarias
  // let location = useLocation();
  const parametro = useParams();
  let docUser = parametro.id;

  // Alertas
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  // // *************** FUNCION INTERMEDIARIA ADVERTENCIA ****************** //

  const [listaTutoriales, setListaTutoriales] = useState();
  const [listaTutoEditable, setListaTutoEditable] = useState();

  //
  //
  //
  //
  //
  useEffect(() => {
    let tutorAdd = [];
    //
    //
    //
    //
    //

    setListaTutoriales([
      {
        urlVideo: "https://www.youtube.com/embed/M1Y3tcEXRxo",
        titulo: "Sistema de gestion de transporte - TMS",
      },
      {
        urlVideo:
          "https://www.youtube.com/embed/Em1yWGLhcgU?si=QTFv8k7wnNiCYInp",

        titulo: "Calculadora de fletes",
      },
    ]);
    // setListaTutoEditable(tutorParsed);
  }, [dbTutoriales, dbUsuario]);

  const [valorComentario, setValorComentario] = useState("");
  // const [comentEditando, setComentEditando]=useState('')

  const handleInput = (e) => {
    const id = e.target.dataset.id;
    const idComentario = e.target.dataset.idcomentario;
    const { value, name } = e.target;

    if (name == "valorComentario") {
      setValorComentario(e.target.value);
    }

    if (name == "editando") {
      // setComentEditando(value)
      const tutoSelect = listaTutoriales.find((tuto) => {
        if (tuto.id == id) {
          return tuto;
        }
      });

      const comentSelect = tutoSelect.comentarios.find((coment) => {
        if (coment.idComentario == idComentario) {
          return coment;
        }
      });

      const comentUp = {
        ...comentSelect,
        texto: value,
      };

      const listaComentUp = tutoSelect.comentarios.map((coment) => {
        if (coment.idComentario == comentUp.idComentario) {
          return comentUp;
        } else {
          return coment;
        }
      });

      setListaTutoEditable(
        listaTutoriales.map((tuto) => {
          return {
            ...tuto,
            comentarios: listaComentUp,
          };
        })
      );
    }
  };

  const agregarComentario = async (e) => {
    const valorText = valorComentario;
    if (userMaster) {
      if (valorComentario == "") {
        setMensajeAlerta("Aun no escribe un comentario.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      }
      if (valorComentario) {
        const id = e.target.dataset.id;
        const tutorialUp = doc(db, "tutoriales", id);

        const tutorial = dbTutoriales.find((tuto) => {
          if (tuto.id == id) {
            return tuto;
          }
        });

        const comentarioUpdated = [
          ...tutorial.comentarios,
          {
            fecha: format(new Date(), `dd/MM/yyyy hh:mm:ss:SSS aa`, {
              locale: es,
            }),
            texto: valorComentario,
            user: userMaster.userName,
            estadoDoc: 0,
            idComentario: uuidv4(),
          },
        ];

        try {
          setValorComentario("");
          await updateDoc(tutorialUp, {
            comentarios: comentarioUpdated,
          });
        } catch (error) {
          setValorComentario(valorText);
          console.log(error);
          setMensajeAlerta("Error con la base de datos");
          setTipoAlerta("error");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
        }
      }
    }
  };

  const eliminarComent = async (e) => {
    const valorText = valorComentario;
    const id = e.target.dataset.id;
    const idComentario = e.target.dataset.idcomentario;
    const tutorialUp = doc(db, "tutoriales", id);

    const tutorial = dbTutoriales.find((tuto) => {
      if (tuto.id == id) {
        return tuto;
      }
    });

    const comentarioUpdated = tutorial.comentarios.map((coment) => {
      console.log(coment.idComentario);
      console.log(idComentario);
      if (coment.idComentario == idComentario) {
        return {
          ...coment,
          estadoDoc: 2,

          apellidoUsuario: null,
          avatar: null,
          editando: false,
          fechaMostrar: null,
          nombreUsuario: null,
        };
      } else {
        return {
          ...coment,
          apellidoUsuario: null,
          avatar: null,
          editando: false,
          fechaMostrar: null,
          nombreUsuario: null,
        };
      }
    });

    try {
      setValorComentario("");
      await updateDoc(tutorialUp, {
        comentarios: comentarioUpdated,
      });
    } catch (error) {
      setValorComentario(valorText);
      console.log(error);
      setMensajeAlerta("Error con la base de datos");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
  };

  const editarComentario = (e) => {
    const id = e.target.dataset.id;
    const idComentario = e.target.dataset.idcomentario;

    const tutoSelect = listaTutoriales.find((tutorial) => {
      if (tutorial.id == id) {
        return tutorial;
      }
    });

    const comentSelect = tutoSelect.comentarios.find((coment) => {
      if (coment.idComentario == idComentario) {
        return coment;
      }
    });

    const comentUpSelect = {
      ...comentSelect,
      editando: true,
    };

    const comentListUp = tutoSelect.comentarios.map((coment) => {
      // console.log()
      if (coment.idComentario == idComentario) {
        return comentUpSelect;
      } else {
        return coment;
      }
    });

    const alo = listaTutoriales.map((tuto) => {
      if (tuto.id == tutoSelect.id) {
        return {
          ...tuto,
          comentarios: comentListUp,
        };
      } else {
        return {
          ...tuto,
        };
      }
    });

    console.log(alo);
    setListaTutoriales(alo);
  };

  const cancelarEdicion = (e) => {
    const id = e.target.dataset.id;
    const idComentario = e.target.dataset.idcomentario;

    const tutoSelect = listaTutoriales.find((tutorial) => {
      if (tutorial.id == id) {
        return tutorial;
      }
    });

    const comentSelect = tutoSelect.comentarios.find((coment) => {
      if (coment.idComentario == idComentario) {
        return coment;
      }
    });

    const comentUpSelect = {
      ...comentSelect,
      editando: false,
    };

    const comentListUp = tutoSelect.comentarios.map((coment) => {
      // console.log()
      if (coment.idComentario == idComentario) {
        return comentUpSelect;
      } else {
        return coment;
      }
    });

    const alo = listaTutoriales.map((tuto) => {
      if (tuto.id == tutoSelect.id) {
        return {
          ...tuto,
          comentarios: comentListUp,
        };
      } else {
        return {
          ...tuto,
        };
      }
    });

    setListaTutoriales(alo);
    setListaTutoEditable(listaTutoriales);
  };

  const guardarEdicion = async (e) => {
    const valorText = valorComentario;
    const id = e.target.dataset.id;
    const idComentario = e.target.dataset.idcomentario;

    const tutoSelect = listaTutoEditable.find((tutorial) => {
      if (tutorial.id == id) {
        return tutorial;
      }
    });

    const comentSelect = tutoSelect.comentarios.find((coment) => {
      if (coment.idComentario == idComentario) {
        return coment;
      }
    });

    const comentListUp = tutoSelect.comentarios.map((coment) => {
      if (coment.idComentario == idComentario) {
        return comentSelect;
      } else {
        return coment;
      }
    });

    const tutorialUp = doc(db, "tutoriales", id);
    try {
      setValorComentario("");
      await updateDoc(tutorialUp, {
        comentarios: comentListUp,
      });
    } catch (error) {
      setValorComentario(valorText);
      console.log(error);
      setMensajeAlerta("Error con la base de datos");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
  };

  const darLikeToggle = async (e) => {
    const valorText = valorComentario;
    e.stopPropagation(); // Detener la propagación del evento

    const id = e.currentTarget.dataset.id;

    const tutoSelect = listaTutoriales.find((tutorial) => {
      if (tutorial.id == id) {
        return tutorial;
      }
    });

    console.log(id);
    console.log(tutoSelect);
    const like = tutoSelect.like;

    let likeUp = [];
    if (like.includes(userMaster.userName)) {
      likeUp = like.filter((like) => like != userMaster.userName);
    } else if (!like.includes(userMaster.userName)) {
      likeUp = [...like, userMaster.userName];
    }

    const tutorialUp = doc(db, "tutoriales", id);
    try {
      await updateDoc(tutorialUp, {
        like: likeUp,
      });
    } catch (error) {
      setValorComentario(valorText);
      console.log(error);
      setMensajeAlerta("Error con la base de datos");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
  };

  const [arrayNombreLiked, setArrayNombresLiked] = useState([]);

  const mostrarLiked = (e) => {
    const id = e.currentTarget.dataset.id;

    const tutoSelect = listaTutoriales.find((tutorial) => {
      if (tutorial.id == id) {
        return tutorial;
      }
    });

    let nuevoArrayNombre = [];
    tutoSelect.like.forEach((like) => {
      dbUsuario.forEach((persona) => {
        // console.log(persona.userName)
        console.log(like);
        if (persona.userName == like) {
          console.log("asd");
          nuevoArrayNombre = [...nuevoArrayNombre, persona.nombre];
        }
      });
    });

    console.log(nuevoArrayNombre);
    setArrayNombresLiked(nuevoArrayNombre);

    const listaUp = listaTutoriales.map((tuto) => {
      if (tuto.id == id) {
        return {
          ...tuto,
          mostrarLikes: true,
        };
      } else {
        return tuto;
      }
    });

    setListaTutoriales(listaUp);
  };

  const hideLiked = (e) => {
    const id = e.currentTarget.dataset.id;

    const listaUp = listaTutoriales.map((tuto) => {
      if (tuto.id == id) {
        return {
          ...tuto,
          mostrarLikes: false,
        };
      } else {
        return tuto;
      }
    });

    setListaTutoriales(listaUp);
  };

  return (
    <>
      <TarjetaDoc className={Theme.config.modoClear ? "clearModern" : ""}>
        {listaTutoriales?.map((tutorial, index) => {
          return (
            <CajaVideo key={index}>
              <Titulos>{tutorial.titulo}</Titulos>

              <CajitaVideo>
                <iframe
                  width="800"
                  height="380"
                  src={tutorial.urlVideo}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </CajitaVideo>
            </CajaVideo>
          );
        })}
      </TarjetaDoc>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
};

const TarjetaDoc = styled.div`
  border: 1px solid white;
  width: 85%;
  margin: auto;
  border-radius: 10px;
  margin-bottom: 35px;
  /* background-color: ${Tema.secondary.azulProfundo}; */
  padding: 20px;

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
  h4 {
    color: white;
    text-align: end;
    font-weight: lighter;
    font-size: 1.2rem;
  }
  &.home {
    height: 500px;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  @media screen and (max-width: 620px) {
    width: 100%;
  }
`;

const CajaVideo = styled.div`
  margin-bottom: 65px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
  /* background-color: ${Tema.secondary.azulSuave}; */
`;
const Titulos = styled.h3`
  font-size: 1.5rem;
  color: ${Tema.secondary.azulOpaco};
  border-bottom: 1px solid;
  margin-bottom: 10px;
  color: white;
  font-weight: 400;
  /* color: #14192b; */
`;

const CajitaVideo = styled.div`
  display: flex;
  /* justify-content: center; */
`;
