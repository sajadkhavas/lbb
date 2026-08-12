import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // The browser and the router must not race to restore two different positions.
    // LBB always opens a fresh page at its top; product back/forward continuity is
    // handled by the router navigation itself, not by a late post-hydration jump.
    scrollRestoration: false,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
