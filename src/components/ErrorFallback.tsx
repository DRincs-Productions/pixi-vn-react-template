import type { ErrorComponentProps } from "@tanstack/react-router";

function ErrorFallback({ error, reset }: ErrorComponentProps) {
    return (
        <div
            role="alert"
            style={{
                pointerEvents: "auto",
                backgroundColor: "black",
            }}
        >
            <h2
                style={{
                    color: "red",
                    fontSize: "2rem",
                    textAlign: "center",
                    marginTop: "1rem",
                }}
            >
                Something went wrong
            </h2>
            <p
                style={{
                    color: "white",
                    fontSize: "1.5rem",
                    textAlign: "center",
                    marginTop: "1rem",
                }}
            >
                {(error as Error).message}
            </p>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "1rem",
                    paddingBottom: "1rem",
                }}
            >
                <button
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "white",
                        borderRadius: "0.5rem",
                    }}
                    onClick={reset}
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
export default ErrorFallback;
