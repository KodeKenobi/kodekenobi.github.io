import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useSpring } from "react-spring";

export interface GlobeProps {
    dark?: boolean;
    baseColor?: string;
    glowColor?: string;
    markerColor?: string;
    opacity?: number;
    brightness?: number;
    offsetX?: number;
    offsetY?: number;
    scale?: number;
}

export const Globe: React.FC<GlobeProps> = ({
    dark = true,
    baseColor = "#777A80",
    glowColor = "#50505A",
    markerColor = "#22d3ee",
    brightness = 1,
    offsetX = 0,
    offsetY = 0,
    scale = 1,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);
    const [{ r }, api] = useSpring(() => ({
        r: 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 40,
            precision: 0.001,
        },
    }));

    useEffect(() => {
        let phi = 0;
        let width = 0;
        let globe: any;
        let observer: IntersectionObserver;

        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth;
            }
        };
        window.addEventListener("resize", onResize);
        onResize();

        const initGlobe = () => {
            if (!canvasRef.current || globe) return;
            try {
                globe = createGlobe(canvasRef.current, {
                    devicePixelRatio: 2,
                    width: width * 2,
                    height: width * 2,
                    phi: 0,
                    theta: 0,
                    dark: dark ? 1 : 0,
                    diffuse: 1.2,
                    mapSamples: 12000, // Reduced from 16000 for performance
                    mapBrightness: brightness,
                    baseColor: hexToRgb(baseColor),
                    glowColor: hexToRgb(glowColor),
                    markerColor: hexToRgb(markerColor),
                    markers: [],
                    onRender: (state) => {
                        if (!pointerInteracting.current) {
                            phi += 0.005;
                        }
                        state.phi = phi + r.get();
                        state.width = width * 2;
                        state.height = width * 2;
                    },
                });
                if (canvasRef.current) canvasRef.current.style.opacity = "1";
            } catch (e) {
                console.error("Globe failed to initialize:", e);
            }
        };

        // Only initialize globe when visible to save WebGL contexts
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        initGlobe();
                    } else {
                        if (globe) {
                            globe.destroy();
                            globe = null;
                            if (canvasRef.current) canvasRef.current.style.opacity = "0";
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (canvasRef.current) {
            observer.observe(canvasRef.current);
        }

        return () => {
            if (globe) globe.destroy();
            if (observer) observer.disconnect();
            window.removeEventListener("resize", onResize);
        };
    }, [dark, baseColor, glowColor, markerColor, brightness, r]);


    return (
        <div
            style={{
                width: "100%",
                aspectRatio: "1/1",
                maxWidth: 600,
                margin: "auto",
                position: "relative",
                transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
            }}
        >
            <canvas
                ref={canvasRef}
                onPointerDown={(e) => {
                    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
                    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
                }}
                onPointerUp={() => {
                    pointerInteracting.current = null;
                    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
                }}
                onPointerOut={() => {
                    pointerInteracting.current = null;
                    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
                }}
                onMouseMove={(e) => {
                    if (pointerInteracting.current !== null) {
                        const delta = e.clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({
                            r: delta / 200,
                        });
                    }
                }}
                style={{
                    width: "100%",
                    height: "100%",
                    cursor: "grab",
                    contain: "layout paint size",
                    opacity: 0,
                    transition: "opacity 1s ease",
                }}
            />
        </div>
    );
};

function hexToRgb(hex: string): [number, number, number] {
    if (!hex || hex[0] !== '#') return [0.5, 0.5, 0.5];
    try {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return [isNaN(r) ? 0.5 : r, isNaN(g) ? 0.5 : g, isNaN(b) ? 0.5 : b];
    } catch (e) {
        return [0.5, 0.5, 0.5];
    }
}


export default Globe;
