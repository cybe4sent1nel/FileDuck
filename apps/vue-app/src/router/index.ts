import { createRouter, createWebHistory } from 'vue-router';
import UploadView from '../views/UploadView.vue';
import DownloadView from '../views/DownloadView.vue';
import HistoryView from '../views/HistoryView.vue';
import DocsView from '../views/DocsView.vue';
import FAQView from '../views/FAQView.vue';
import PrivacyView from '../views/PrivacyView.vue';
import TermsView from '../views/TermsView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import OfflineView from '../views/OfflineView.vue';
import ErrorView from '../views/ErrorView.vue';

const routes = [
  {
    path: '/',
    name: 'Upload',
    component: UploadView,
  },
  {
    path: '/download',
    name: 'Download',
    component: DownloadView,
  },
  {
    path: '/d/:code',
    name: 'DirectDownload',
    component: DownloadView,
  },
  {
    path: '/history',
    name: 'History',
    component: HistoryView,
  },
  {
    path: '/docs',
    name: 'Docs',
    component: DocsView,
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FAQView,
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: PrivacyView,
  },
  {
    path: '/terms',
    name: 'Terms',
    component: TermsView,
  },
  {
    path: '/offline',
    name: 'Offline',
    component: OfflineView,
  },
  {
    path: '/error',
    name: 'Error',
    component: ErrorView,
    props: route => ({ 
      errorCode: route.params.errorCode || route.query.code,
      errorDescription: route.params.errorDescription || route.query.message 
    }),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
