import { ButtonBase } from "@mui/material";
import { ArrowButtonWrapper } from "../styles/ButtonsStyled";

interface Props {
  callback: () => void;
  rotation?: string;
  position?: "up" | "left" | "right" | "down";
}
export const ArrowButton = ({
  position = "up",
  callback,
  rotation = "0deg",
}: Props) => {
  return (
    <ArrowButtonWrapper
      {...{ position, rotation }}
      onClick={callback}
    ></ArrowButtonWrapper>
  );
};
