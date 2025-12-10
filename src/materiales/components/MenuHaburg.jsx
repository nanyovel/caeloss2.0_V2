import React, { useState } from "react";
import styled from "styled-components";
import menuHamburg from "./../../../public/img/rayas.svg";
import menuX from "./../../../public/img/xImg.png";

export default function MenuHaburg({ setOpenMenuMobil, openMenuMobil }) {
  const toggleMobil = () => {
    setOpenMenuMobil(!openMenuMobil);
  };
  return (
    <CajaMenuHamburg>
      <Img
        className={openMenuMobil == false ? "rayas" : ""}
        onClick={() => toggleMobil()}
        src={openMenuMobil ? menuX : menuHamburg}
      />
    </CajaMenuHamburg>
  );
}
const CajaMenuHamburg = styled.div`
  /* background-color: white; */
  display: none;
  display: block;
  width: 50px;
  height: 50px;
  position: fixed;
  right: 70px;
  bottom: 20px;
  justify-content: center;
  align-items: center;

  display: flex;
`;
const Img = styled.img`
  height: 30px;
  &.rayas {
    height: 45px;
  }
`;
