import { ReactNode } from "react";
import { SmokeProps } from "..";
import { AmbientLightProps, CanvasProps, DirectionalLightProps } from "@react-three/fiber";

export type SmokeSceneProps = CanvasProps & {
  smoke: SmokeProps;
  suspenseFallback?: ReactNode;
  disableDefaultLights?: boolean;
  ambientLightProps?: AmbientLightProps;
  directionalLightProps?: DirectionalLightProps;
};
