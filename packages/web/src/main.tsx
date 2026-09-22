import { applyBranding, loadBranding } from "@andhivie/web/branding";
import Toaster from "@andhivie/web/components/ui/Toaster";
import { socketClient } from "@andhivie/web/features/session/contexts/socket-context";
import "@andhivie/web/i18n";
import "@andhivie/web/index.css";
import { routeTree } from "@andhivie/web/route.gen";
import "@fontsource-variable/outfit/wght.css";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const router = createRouter({ routeTree, context: { socket: socketClient } });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

applyBranding(await loadBranding());

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>
);