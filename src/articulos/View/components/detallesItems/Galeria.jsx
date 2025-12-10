import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import ImgFlechaIzq from "./../../../../../public/img/icon/flecha-izquierda-azul.png";
import ImgFlechaDer from "./../../../../../public/img/icon/flecha-correcta-derecha-azul.png";
import ImgFullScreen from "./../../../../../public/img/icon/pantalla-completa-lg.png";
import ImgNoScreen from "./../../../../../public/img/icon/minimizar.png";
import MenuPestannias from "../../../../components/MenuPestannias";
import { Tema } from "../../../../config/theme";

export default function Carrusel({ productMaster, automatico }) {
  const [arrayPestannias, setArrayPestannias] = useState([
    {
      nombre: "Imagenes",
      select: true,
      key: "imagenes",
    },
    {
      nombre: "Videos",
      select: false,
      key: "videos",
    },
  ]);
  const handlePestannias = (e) => {
    const keyData = e.target.dataset.key;

    console.log(keyData);
    setArrayPestannias(
      arrayPestannias.map((opcion, index) => {
        return {
          ...opcion,
          select: keyData == opcion.key,
        };
      })
    );
  };
  const anchoImagenInitial = 800;
  const [anchoImagen, setAnchoImage] = useState(anchoImagenInitial);

  const altoConenedorInitial = 550;
  const [altoContenedor, setAltoContenedor] = useState(altoConenedorInitial);

  const arrayImg = productMaster.galeria.imagenes.map((img, index) => {
    return img;
  });
  const arrayVideosInitial = productMaster.galeria.videos.map(
    (video, index) => {
      return video;
    }
  );

  const [arrayVideos, setArrayVideos] = useState([...arrayVideosInitial]);

  // **************** HANDLE IMAGENES next/prev ****************
  const [traslatee, setTraslatee] = useState("");
  const [indexImg, setIndexImg] = useState(0);

  const nextImg = () => {
    const qtyAvanzar = (indexImg + 1) * anchoImagen;
    setTraslatee(`-${qtyAvanzar}px`);

    setIndexImg(indexImg + 1);

    if (indexImg == arrayImg.length - 1) {
      setTraslatee("");
      setIndexImg(0);
    }
  };

  const prevImg = () => {
    if (indexImg != 0) {
      const qtyRetroceder = (indexImg - 1) * anchoImagen;
      setTraslatee(`-${qtyRetroceder}px`);

      setIndexImg(indexImg - 1);
    }
  };

  // ********************* HANDLE full screen imagen ****************
  const [isFullscreen, setIsFullscreen] = useState(false);
  const elementRef = useRef(null);
  const fullScreen = () => {
    resetPosicionImg(!isFullscreen);
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      console.log(elementRef.current);
      if (elementRef.current.requestFullscreen) {
        elementRef.current.requestFullscreen();
      } else if (elementRef.current.mozRequestFullScreen) {
        /* Firefox */
        elementRef.current.mozRequestFullScreen();
      } else if (elementRef.current.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elementRef.current.webkitRequestFullscreen();
      } else if (elementRef.current.msRequestFullscreen) {
        /* IE/Edge */
        elementRef.current.msRequestFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const resetPosicionImg = (statusFullScreen) => {
    let anchoImgAux = 0;
    console.log(statusFullScreen);
    if (statusFullScreen) {
      anchoImgAux = 1536;
      setAltoContenedor(window.screen.height * 1.2);
    } else {
      anchoImgAux = anchoImagenInitial;
      setAltoContenedor(altoConenedorInitial);
    }
    const posicionarImg = indexImg * anchoImgAux;
    setTraslatee(`-${posicionarImg}px`);

    setAnchoImage(anchoImgAux);
  };
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        resetPosicionImg(true);
      } else {
        resetPosicionImg(false);
      }
      console.log(document.fullscreenElement);
      //   if (!document.fullscreenElement) {
      //     setAnchoImage(1536);
      //     setAltoContenedor(window.screen.height * 1.2);
      //     setIsFullscreen(false);
      //     if (elementRef.current) {
      //       setAnchoImage(anchoImagenInitial);
      //       setAltoContenedor(altoConenedorInitial);
      //     }
      //   }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isFullscreen]);

  // ********************* HANDLE VIDEOS ****************
  const [traslateVideo, setTraslateVideo] = useState("");
  const [indexVideo, setIndexVideo] = useState(0);
  const nextVideo = () => {
    const qtyAvanzar = (indexVideo + 1) * anchoImagen;
    setTraslateVideo(`-${qtyAvanzar}px`);

    setIndexVideo(indexVideo + 1);

    if (indexVideo == arrayVideos.length - 1) {
      setTraslateVideo("");
      setIndexVideo(0);
    }
    setArrayVideos([]);
    setTimeout(() => {
      setArrayVideos([...arrayVideosInitial]);
    }, 40);
  };

  const prevVideo = () => {
    if (indexVideo != 0) {
      const qtyRetroceder = (indexVideo - 1) * anchoImagen;
      setTraslateVideo(`-${qtyRetroceder}px`);

      setIndexVideo(indexVideo - 1);
      setArrayVideos([]);
      setTimeout(() => {
        setArrayVideos([...arrayVideosInitial]);
      }, 40);
    }
  };

  return (
    <CarouselContainer $ancho={anchoImagen + "px"}>
      <CajaPestannias>
        <MenuPestannias
          arrayOpciones={arrayPestannias}
          handlePestannias={handlePestannias}
        />
      </CajaPestannias>
      {arrayPestannias.find((opcion) => opcion.select).key == "imagenes" && (
        <WrapContenido ref={elementRef}>
          <CarouselWrapper
            $trasladar={traslatee}
            className={isFullscreen ? "fullScreen" : ""}
          >
            {arrayImg.map((image, index) => (
              <CajaImagen key={index}>
                <CarouselImage
                  $ancho={anchoImagen + "px"}
                  $alto={altoContenedor * 0.72 + "px"}
                  className={isFullscreen ? "fullScreen" : ""}
                  src={image.url}
                  alt={`Imagen ${index}`}
                />
                <CajaTexto>
                  <Texto>{image.titulo}</Texto>
                </CajaTexto>
              </CajaImagen>
            ))}
          </CarouselWrapper>
          <CajaBtn className="prev" onClick={() => prevImg()}>
            <ImgBoton src={ImgFlechaIzq} />
          </CajaBtn>
          <CajaBtn onClick={() => nextImg()}>
            <ImgBoton src={ImgFlechaDer} />
          </CajaBtn>
          {!isFullscreen && (
            <CajaFullScreen onClick={() => fullScreen()}>
              <ImgFS src={ImgFullScreen} />
            </CajaFullScreen>
          )}
          {isFullscreen && (
            <CajaFullScreen onClick={() => fullScreen()}>
              <ImgFS src={ImgNoScreen} />
            </CajaFullScreen>
          )}
        </WrapContenido>
      )}

      {arrayPestannias.find((opcion) => opcion.select).key == "videos" && (
        <WrapContenido>
          <CarouselWrapper $trasladar={traslateVideo}>
            {arrayVideos.map((video, index) => (
              <CajaVideo key={index}>
                <Iframe
                  // width="560"
                  // height="400"
                  height={altoContenedor * 0.72}
                  $ancho={anchoImagen + "px"}
                  src={
                    video.url.includes("shorts")
                      ? "https://www.youtube.com/embed/" + video.url.slice(27)
                      : "https://www.youtube.com/embed/" + video.url.slice(17)
                  }
                  title="YouTube video player"
                  // frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></Iframe>
                <CajaTexto>
                  <Texto>{video.titulo}</Texto>
                </CajaTexto>
              </CajaVideo>
            ))}
          </CarouselWrapper>
          <CajaBtn className="prev" onClick={() => prevVideo()}>
            <ImgBoton src={ImgFlechaIzq} />
          </CajaBtn>
          <CajaBtn onClick={() => nextVideo()}>
            <ImgBoton src={ImgFlechaDer} />
          </CajaBtn>
        </WrapContenido>
      )}
    </CarouselContainer>
  );
}

const CarouselContainer = styled.div`
  width: 100%;
  height: 550px;
  overflow: hidden;
  position: relative;
  border: 2px solid ${Tema.primary.azulBrillante};
  border-radius: 10px;
`;

const CarouselWrapper = styled.div`
  display: flex;
  transition: transform 0.6s ease;
  transform: translate(${(props) => props.$trasladar});
  height: 100%;
`;

const CarouselImage = styled.img`
  flex-shrink: 0;
  display: inline;
  display: block;
  object-fit: contain;
  transition: transform 1s ease-in-out;
  width: ${(props) => props.$ancho};
  height: ${(props) => props.$alto};
  border-bottom: 2px solid ${Tema.primary.azulBrillante};
`;

const CajaBtn = styled.div`
  position: absolute;
  right: 0;
  bottom: 50%;
  transform: translate(0, 50%);
  cursor: pointer;
  &.prev {
    right: auto;
    left: 0;
  }
  transition: ease 0.2s all;
  border: 1px solid white;
  background-color: white;
  padding: 4px;
  border-radius: 5px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  &:hover {
    width: 50px;
    box-shadow: ${Tema.config.sombra};
  }
`;
const ImgBoton = styled.img`
  width: 40px;
`;

const CajaPestannias = styled.div`
  width: 100%;
  min-height: 50px;
  padding-top: 20px;
  padding-left: 15px;
  margin-bottom: 5px;
`;
const CajaImagen = styled.div`
  height: 550px;
`;
const WrapContenido = styled.div``;
const CajaVideo = styled.div`
  /* display: flex; */
  height: 550px;
  width: 100%;
  justify-content: center;
`;
const Iframe = styled.iframe`
  margin-bottom: 15px;
  width: 100%;
  width: ${(props) => props.$ancho};
`;
const CajaTexto = styled.div`
  width: 100%;
  min-height: 60px;
`;
const Texto = styled.h2`
  width: 100%;
  color: ${Tema.neutral.grisTextoGoogle};
  padding: 0 15px;
`;
const CajaFullScreen = styled.div`
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 20px;
  bottom: 120px;
  transform: translate(0, 50%);
  background-color: white;

  transition: ease 0.2s all;
  /* border: 1px solid white; */
  background-color: white;
  padding: 4px;
  border-radius: 5px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  &:hover {
    cursor: pointer;
    width: 50px;
    box-shadow: ${Tema.config.sombra};
  }
`;
const ImgFS = styled.img`
  width: 25px;
`;
const CajaElementoFull = styled.div`
  background-color: red;
  position: fixed;
`;
const ImgFull = styled.img`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("/ruta-de-tu-imagen.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
  &:fullscreen {
    width: 100%;
    height: 100%;
  }
`;
