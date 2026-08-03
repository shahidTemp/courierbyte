// @ts-nocheck
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { DefaultCatchBoundary } from '@/components/common/error'
import { NotFound } from '@/components/common/notFound'
import { Loader } from '@/components/common/loader'


export function getRouter() {
  const queryClient = new QueryClient()

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultPendingMs: 1000, // ডেটা আসতে ১s এর বেশি লাগলে সাথে সাথে pendingComponent (Loader) দেখাবে
    defaultPendingComponent: () => <Loader />,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}
