import {
    type DeviceDiagnosticsSnapshot,
    detectBrowserEngine,
    detectPlatform,
    getBrowserCapabilities,
    getCurrentFps,
    getGameVersion,
    getJsMemoryInfo,
    getMotionVersion,
    getPixiJsVersion,
    getPixiVnVersion,
    getResolutionInfo,
    getToneJsVersion,
    getWebglDiagnostics,
} from "@/lib/utils/device-diagnostics-utility";
import { useEffect, useMemo, useState } from "react";

const LIVE_REFRESH_INTERVAL_MS = 1000;

/**
 * WebGL support, browser capabilities, UA, platform and engine don't change during a session,
 * so they're probed once. FPS, resolution and JS memory are polled since they change live.
 */
export function useDeviceDiagnostics(): DeviceDiagnosticsSnapshot {
    const webgl = useMemo(() => getWebglDiagnostics(), []);
    const capabilities = useMemo(() => getBrowserCapabilities(), []);
    const platform = useMemo(() => detectPlatform(), []);
    const browserEngine = useMemo(() => detectBrowserEngine(), []);
    const gameVersion = useMemo(() => getGameVersion(), []);
    const pixiJsVersion = useMemo(() => getPixiJsVersion(), []);
    const pixiVnVersion = useMemo(() => getPixiVnVersion(), []);
    const toneJsVersion = useMemo(() => getToneJsVersion(), []);
    const motionVersion = useMemo(() => getMotionVersion(), []);

    const [resolution, setResolution] = useState(() => getResolutionInfo());
    const [memory, setMemory] = useState(() => getJsMemoryInfo());
    const [fps, setFps] = useState<number | null>(() => getCurrentFps());

    useEffect(() => {
        const onResize = () => setResolution(getResolutionInfo());
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setFps(getCurrentFps());
            setMemory(getJsMemoryInfo());
        }, LIVE_REFRESH_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    return {
        webgl,
        capabilities,
        resolution,
        memory,
        fps,
        userAgent: navigator.userAgent,
        platform,
        browserEngine,
        gameVersion,
        pixiJsVersion,
        pixiVnVersion,
        toneJsVersion,
        motionVersion,
    };
}
