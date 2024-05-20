import { PropsWithChildren, ReactNode } from "react";
import { SmokeProps } from "..";
import { AmbientLightProps, CanvasProps, DirectionalLightProps } from "@react-three/fiber";

/**
 * The smoke scene properties. Supports all properties from the Canvas component.
 */
export type SmokeSceneProps = Omit<CanvasProps, "children"> &
  PropsWithChildren<{
    /**
     * The smoke properties.
     * This will be used to render the smoke component.
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
