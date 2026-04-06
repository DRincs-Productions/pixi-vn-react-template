import useClosePageDetector from "./hooks/useClosePageDetector";
import useKeyboardDetector from "./hooks/useKeyboardDetector";
import useEventListener from "./hooks/useKeyDetector";
import GameSaveScreen from "./screens/GameSaveScreen";
import SaveLoadAlert from "./screens/modals/SaveLoadAlert";
import OfflineScreen from "./screens/OfflineScreen";
import Settings from "./screens/Settings";

function HomeChild() {
    useKeyboardDetector();
    useClosePageDetector();
    // Prevent the user from going back to the previous page
    useEventListener({
        type: "popstate",
        listener: () => {
            window.history.forward();
        },
    });

    return (
        <>
            <Settings />
            <GameSaveScreen />
            <SaveLoadAlert />
            <OfflineScreen />
        </>
    );
}

export default function Home() {
    return <HomeChild />;
}
