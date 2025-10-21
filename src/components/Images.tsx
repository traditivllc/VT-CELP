import { getEnv } from "@/lib/utils";
import type { FC } from "react";

const Image: FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = ({ ...props }) => {
  props.src = props.src?.startsWith("/")
    ? `${getEnv("BASE_ASSETS", "")}${props.src}`
    : props.src;
  return <img className="w-full" {...props} />;
};

export default Image;
