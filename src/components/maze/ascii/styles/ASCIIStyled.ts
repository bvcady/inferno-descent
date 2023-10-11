import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const ASCIIWrapper = styled("div")<{
  nX?: number;
  translation?: [number, number];
}>`
  --nX: ${({ nX }) => nX || 10};
  --cellSize: 2rem;

  display: grid;
  grid-template-columns: repeat(var(--nX), var(--cellSize));
  grid-template-rows: repeat(var(--nX), var(--cellSize));

  background-color: var(--mediumColor);
  padding: var(--cellSize);
  width: fit-content;

  --tX: -${({ translation }) => translation?.[0] || 0}px;
  --tY: -${({ translation }) => translation?.[1] || 0}px;

  transform: translateX(calc(var(--tX) + 150px))
    translateY(calc(var(--tY) + 150px));

  transition: transform 0.4s linear;

  user-select: none;
  pointer-events: none;
  cursor: none;
`;

export const CellWrapper = styled("code")<{
  customColor?: string;
  opacity?: string;
}>`
  display: grid;
  place-items: center;
  font-size: 2rem;
  position: relative;
  ${({ customColor }) =>
    customColor &&
    css`
      color: ${customColor};
    `};
  ${({ opacity }) =>
    opacity &&
    css`
      opacity: ${opacity};
    `};
`;

export const PlayerWrapper = styled(CellWrapper)`
  position: absolute;
  inset: 0;
  z-index: 2;
  font-size: 1.5rem;

  svg {
    height: 1.5rem;
  }

  #bg * {
    /* fill: #dadada; */
    fill: var(--bgColor);
  }
  #dark * {
    /* fill: #1d1d1b; */
    fill: var(--darkColor);
  }
  #light * {
    /* fill: #878787; */
    fill: var(--lightColor);
  }
  #medium * {
    /* fill: #575756; */
    fill: var(--mediumColor);
  }
`;
