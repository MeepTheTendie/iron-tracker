import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Devtools as TanStackDevtools } from '@tanstack/react-devtools'

import Header from '../components/Header'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TanStackDevtools
        options={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            id: 'tanstack-router',
            name: 'Tanstack Router',
            render: (el) => import('react-dom/client').then(({ createRoot }) => {
              createRoot(el).render(<TanStackRouterDevtoolsPanel />)
            }),
          },
        ]}
      />
    </>
  ),
})
