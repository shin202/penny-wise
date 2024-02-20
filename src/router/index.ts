import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuth } from '@/stores/auth.store'
import { storeToRefs } from 'pinia'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue')
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiredAuth: true },
      children: [
        {
          path: '',
          name: 'welcome',
          component: () => import('../views/WelcomeView.vue')
        },
        {
          path: '/wallets',
          name: 'walletHome',
          component: () => import('../views/wallets/HomeView.vue'),
          meta: { breadcrumb: 'My Wallets' },
          children: [
            {
              path: '',
              name: 'wallets',
              component: () => import('../views/wallets/WalletListView.vue'),
              meta: { breadcrumb: 'List Wallets' }
            },
            {
              path: ':id',
              name: 'editWallet',
              component: () => import('../views/wallets/EditWalletView.vue'),
              meta: { breadcrumb: 'Edit Wallet' },
              props: (route) => ({ id: Number(route.params.id) })
            }
          ]
        },
        {
          path: '/currencies',
          name: 'currencyHome',
          component: () => import('../views/currencies/HomeView.vue'),
          meta: { breadcrumb: 'Currencies' },
          children: [
            {
              path: '',
              name: 'currencies',
              component: () => import('../views/currencies/CurrencyListView.vue'),
              meta: { breadcrumb: 'List Currencies' }
            },
            {
              path: ':id',
              name: 'editCurrency',
              component: () => import('../views/currencies/EditCurrencyView.vue'),
              meta: { breadcrumb: 'Edit Currency' },
              props: (route) => ({ id: Number(route.params.id) })
            }
          ]
        },
        {
          path: '/images',
          name: 'imageHome',
          component: () => import('../views/images/HomeView.vue'),
          meta: { breadcrumb: 'Images' },
          children: [
            {
              path: '',
              name: 'images',
              component: () => import('../views/images/ImageListView.vue'),
              meta: { breadcrumb: 'List Images' }
            },
            {
              path: 'new',
              name: 'createImage',
              component: () => import('../views/images/CreateImageView.vue'),
              meta: { breadcrumb: 'New Image' }
            }
          ]
        },
        {
          path: '/categories',
          name: 'categoryHome',
          component: () => import('../views/categories/HomeView.vue'),
          meta: { breadcrumb: 'Categories' },
          children: [
            {
              path: '',
              name: 'categories',
              component: () => import('../views/categories/CategoryListView.vue'),
              meta: { breadcrumb: 'List Categories' }
            }
          ]
        },
        {
          path: '/transactions',
          name: 'transactionHome',
          component: () => import('../views/transactions/HomeView.vue'),
          meta: { breadcrumb: 'Transactions' },
          children: [
            {
              path: '',
              name: 'transactions',
              component: () => import('../views/transactions/TransactionHistoryView.vue'),
              meta: { breadcrumb: 'Transaction History' }
            }
          ]
        },
        {
          path: '/stats',
          name: 'statsHome',
          component: () => import('../views/stats/HomeView.vue'),
          meta: { breadcrumb: 'Stats' },
          children: [
            {
              path: '',
              name: 'stats',
              component: () => import('../views/stats/StatsView.vue'),
              meta: { breadcrumb: 'Overview' }
            }
          ]
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: () => import('../views/ForgotPasswordView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const auth = useAuth()
  const { isAuthenticated } = storeToRefs(auth)
  const requiredAuth = to.matched.some((i) => i.meta?.requiredAuth)

  if (requiredAuth && !isAuthenticated.value) {
    return next({ path: '/login' })
  } else if (
    (to.path === '/login' && isAuthenticated.value) ||
    (to.path === '/forgot-password' && isAuthenticated.value)
  ) {
    return next({ name: 'welcome' })
  } else {
    return next()
  }
})

export default router
