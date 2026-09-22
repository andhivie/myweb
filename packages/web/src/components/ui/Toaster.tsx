import { ToastBar, Toaster as ToasterRaw } from "react-hot-toast";

const Toaster = () => (
  <ToasterRaw
    position="top-center"
    toastOptions={{
      duration: 3500,
      style: {
        background: "var(--color-surface)",
        color: "var(--color-foreground)",
        border: "1px solid var(--color-accent)",
        borderRadius: "var(--radius-md)",
        padding: "12px 16px",
        fontSize: "14px",
        fontWeight: 500,
        maxWidth: "400px",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
      },
      success: {
        iconTheme: {
          primary: "#10b981",
          secondary: "var(--color-surface)",
        },
      },
      error: {
        iconTheme: {
          primary: "#ef4444",
          secondary: "var(--color-surface)",
        },
      },
    }}
  >
    {(t) => <ToastBar toast={t}>{({ icon, message }) => (<>{icon}{message}</>)}</ToastBar>}
  </ToasterRaw>
);

export default Toaster;