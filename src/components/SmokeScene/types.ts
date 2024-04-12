import { PropsWithChildren, ReactNode } from "react";
import { SmokeProps } from "..";
import { AmbientLightProps, CanvasProps, DirectionalLightProps } from "@react-three/fiber";

export type SmokeSceneProps = Omit<CanvasProps, "children"> &
  PropsWithChildren<{
    /**
     * The smoke properties.
     * This will be passed to the smoke component.
     */
    smoke?: SmokeProps;

    /**
     * The fallback component to display while the smoke component is loading.
     */
    suspenseFallback?: ReactNode;

    /**
     * Whether to disable the default lights.
     * @default false
     */
    disableDefaultLights?: boolean;

    /**
     * The ambient light properties.
     */
    ambientLightProps?: AmbientLightProps;

    /**
     * The directional light properties.
     */
    directionalLightProps?: DirectionalLightProps;
  }>;
