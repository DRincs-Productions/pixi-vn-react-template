import { TanStackDevtools } from "@tanstack/react-devtools";
import { hotkeysDevtoolsPlugin } from "@tanstack/react-hotkeys-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

export default function DevDevtools() {
    return (
        <TanStackDevtools
            config={{
                position: "bottom-right",
            }}
            plugins={[
                {
                    name: "UI screens",
                    render: <TanStackRouterDevtoolsPanel />,
                },
                { ...hotkeysDevtoolsPlugin(), name: "Hotkeys" },
                {
                    name: "UI cache",
                    render: <ReactQueryDevtoolsPanel />,
                },
            ]}
        />
    );
}
