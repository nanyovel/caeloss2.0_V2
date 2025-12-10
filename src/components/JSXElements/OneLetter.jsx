import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

import React from "react";
import { faBell, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";

export function BellLetter({ qty }) {
  return (
    <CajaBell>
      <Icono bounce={qty > 0} icon={faBell} />
      {qty > 0 && (
        <LetterNotificacion className="bell">{qty}</LetterNotificacion>
      )}
    </CajaBell>
  );
}
export function ConfigLetter() {
  return (
    <CajaBell>
      <Icono icon={faGear} />
    </CajaBell>
  );
}
export function LikeLetter({ qty }) {
  return (
    <CajaBell>
      <Icono icon={faHeart} />
      {qty > 0 && (
        <LetterNotificacion className="bell white">{qty}</LetterNotificacion>
      )}
    </CajaBell>
  );
}

const CajaBell = styled.div`
  /* width: 25px; */
  /* border: 1px solid white; */
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: ease all 0.2s;
  &:hover {
    background-color: #173a58;
    cursor: pointer;
  }
`;

export const LetterNotificacion = styled.span`
  position: absolute;
  right: 0;
  bottom: 3px;
  /* transform: translate(0, -50%); */
  background-color: #d13438;
  color: white;
  background-color: red;
  &.white {
    background-color: #07af26;
    color: #fff;
  }
  width: 20px;
  height: 20px;
  border-radius: 1em;
  font-size: 14px;
  text-align: center;
  /* padding: 4px; */

  align-content: center;
  padding-right: 2px;

  &.bell {
    bottom: -3px;
    right: -4px;
  }
  &.dosDigitos {
    width: 25px;
    height: 25px;
  }
`;
{
  /* <Icono icon={faUserLock} /> */
}
const Icono = styled(FontAwesomeIcon)`
  /* margin-right: 7px; */
  font-size: 2rem;
`;
