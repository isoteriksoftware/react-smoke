import { PropsWithChildren, ReactNode } from "react";
import { SmokeProps } from "..";
import { AmbientLightProps, CanvasProps, DirectionalLightProps } from "@react-three/fiber";

export type SmokeSceneProps = Omit<CanvasProps, "children"> &
  PropsWithChildren<{
    smoke?: SmokeProps;
    suspenseFallback?: ReactNode;
    disableDefaultLights?: boolean;
    ambientLightProps?: AmbientLightProps;
    directionalLightProps?: DirectionalLightProps;
  }>;
