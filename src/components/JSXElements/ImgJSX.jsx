import styled from "styled-components";

export const AvatarPerfil = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
  /* border: 3px solid white; */

  border-radius: 50%;
  &.masculino {
    border: 3px solid black;
    border-color: black;
  }
  &.femenino {
    border: 3px solid white;
  }
  &.small {
    width: 100px;
    height: 100px;
  }
  &.xSmall {
    width: 80px;
    height: 80px;
  }
  &.xxSmall {
    width: 60px;
    height: 60px;
  }
  &.xxxSmall {
    width: 50px;
    height: 50px;
  }
  &.xxxxSmall {
    width: 40px;
    height: 40px;
  }
  &.medium {
    width: 150px;
    height: 150px;
  }
  &.perfilHover {
    &:hover {
      transition: all 0.2s ease;
      transform: scale(1.5);
    }
  }
`;
