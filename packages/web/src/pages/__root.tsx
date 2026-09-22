import ErrorPage from "@andhivie/web/components/layout/ErrorPage";
import NotFound from "@andhivie/web/components/layout/NotFound";
import {
    SocketProvider,
    useSocket,
} from "@andhivie/web/features/session/contexts/socket-context";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

const GameLayout = () => {
  const { isConnected, connect } = useSocket();

  useEffect(() => {
    if (!isConnected) {
      connect();
    }
  }, [connect, isConnected]);

  useEffect(() => {
    document.body.classList.add("bg-secondary");

    return () => {
      document.body.classList.remove("bg-secondary");
    };
  }, []);

  return (
    <div className="bg-secondary antialiased">
      <Outlet />
    </div>
  );
};

export const Route = createRootRoute({
  component: () => (
    <SocketProvider>
      <GameLayout />
    </SocketProvider>
  ),
  errorComponent: ({ error }) => (
    <div className="bg-secondary antialiased">
      <ErrorPage error={error} />
    </div>
  ),
  notFoundComponent: () => (
    <div className="bg-secondary antialiased">
      <NotFound />
    </div>
  ),
});