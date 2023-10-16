/* eslint-disable @next/next/no-img-element */
import { useMazeStore } from "@/store/MazeStore";
import { theme } from "@/styles/Global";
import styled from "@emotion/styled";
import { Skeleton, keyframes } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

export const ViewPort = ({ children }: Props) => {
  const { player } = useMazeStore((state) => state);
  const [blur, setBlur] = useState("0px");

  useEffect(() => {
    setBlur("0.5px");

    const blurTimeout = setTimeout(() => {
      setBlur("0px");
    }, 300);

    return () => clearTimeout(blurTimeout);
  }, [player]);

  return (
    <div
      style={{
        aspectRatio: "160/144",
        maxWidth: "min(300px, 100dvw)",
        overflow: "hidden",
        boxShadow: "0 0 0 1rem var(--lightColor)",
        pointerEvents: "none",
        background: theme.colors.dark,
        position: "relative",
        borderRadius: "0.25rem",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          margin: 0,
          padding: 0,
          background: theme.colors.accent,
          mixBlendMode: "soft-light",
        }}
      />
      <BlurLayer blur={blur} />
      <Skeleton
        animation="wave"
        sx={{
          position: "absolute",
          inset: "-50%",
          zIndex: 3,
          margin: 0,
          padding: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          zIndex: 4,
          inset: "0",
          backgroundRepeat: "repeat",
          backgroundPosition: "6px -3px",
          backgroundImage: 'url("sprites/grid.svg")',
          mixBlendMode: "darken",
          opacity: 0.25,
        }}
      ></div>
      <LightWrapper>
        <LightStreak width="3rem" left="10%" intensity="1" />
        <LightStreak
          width="2rem"
          left="calc(10% + 5rem)"
          intensity="0.8"
          delay={"10s"}
          style={{ transform: "rotate(33deg)" }}
        />
      </LightWrapper>
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 7,
          margin: 0,
          padding: 0,
          mixBlendMode: "hard-light",
          opacity: "0.4",
          boxShadow: "inset 0 0 0 1px white",
        }}
      />
      {children}
    </div>
  );
};

const BlurLayer = styled("div")<{ blur: string }>`
  position: absolute;
  z-index: 3;
  inset: 0;
  backdrop-filter: blur(${({ blur }) => blur});
  -webkit-backdrop-filter: blur(${({ blur }) => blur});
`;

const LightWrapper = styled("div")`
  position: absolute;
  inset: 0;
  mix-blend-mode: saturation;
  filter: blur(4px);
  -webkit-filter: blur(4px);
  z-index: 6;
`;

const lightMovement = keyframes`
	0% {
    background-position: 0% 0px;
  }
	50% {
    background-position: 100% 1000px;
  }
	100% {
    background-position: 0% 0px;
  }
`;

const LightStreak = styled("div")<{
  width?: string;
  left?: string;
  intensity?: string;
  delay?: string;
}>`
  position: absolute;
  width: ${({ width }) => width || "10px"};
  left: ${({ left }) => left || "1rem"};
  top: -50%;
  height: 200%;
  z-index: 6;
  background-size: 200% 200%;
  background-color: transparent;
  background-position: 84% 0;
  background: linear-gradient(
    48deg,
    #e3c1f4,
    #d9d7ed,
    #dff7f1,
    #acf0ff,
    #e3c1f4,
    #d9d7ed,
    #dff7f1,
    #acf0ff,
    #e3c1f4
  );
  opacity: ${({ intensity }) => intensity};
  transform: rotate(45deg);
  animation: ${lightMovement} 30s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay || "0s"};
`;