import { RouteObject } from 'react-router-dom'
import HomePage from '@/pages/HomePage/HomePage'
import ProfilePage from '@/pages/ProfilePage/ProfilePage'
import Root from '@/pages/Root'
import AboutPage from '@/pages/AboutPage/AboutPage'
import InventoryPage from './pages/InventoryPage/InventoryPage'
import ProductPage from './pages/ProductPage/ProductPage'
import HierarchyPage from './pages/HierarchyPage/HierarchyPage'
import { RouteName } from './constants/RouteName'

export const routes: RouteObject[] = [
  {
    path: RouteName.HOME,
    element: <Root />,
    children: [
      {
        path: RouteName.HOME,
        element: <HomePage />
      },
      {
        path: `${RouteName.PRODUCTS}/:id`,
        element: <ProductPage />
      },
      {
        path: RouteName.PROFILE,
        element: <ProfilePage />
      },
      {
        path: RouteName.ABOUT,
        element: <AboutPage />
      },
      {
        path: 'inventory',
        element: <InventoryPage />
      },
      {
        path: 'products',
        element: <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p className="text-gray-600">Product details page coming soon</p>
          </div>
        </div>
      },
      {
        path: RouteName.HIERARCHY,
        element: <HierarchyPage />
      }
    ]
  }
]