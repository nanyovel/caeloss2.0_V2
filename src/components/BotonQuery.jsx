import styled from "styled-components";
import { BtnGeneralButton } from "./BtnGeneralButton";
import { Tema } from "../config/theme";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

export const BotonQuery = (props) => {
  const queryProps = () => {
    console.log(props);
  };
  const user = getAuth().currentUser;
  const [isJJose, setIsJose] = useState(false);
  useEffect(() => {
    if (user) {
      if (user.email == "jperez@cielosacusticos.com") {
        setIsJose(true);
      }
    }
  }, [user]);
  return (
    <CajaBotones className={Tema.config.modoDev && isJJose ? "mostrar" : ""}>
      <BtnGeneralButton onClick={() => queryProps()}>Query</BtnGeneralButton>
    </CajaBotones>
  );
};

const CajaBotones = styled.div`
  /* border: 1px solid red; */
  width: 100%;
  display: none;
  &.mostrar {
    display: block;
  }
`;
