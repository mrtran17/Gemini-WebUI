import { createRouter, createWebHistory } from 'vue-router';
// import AppLayout from '../App.vue'; 
import ChatPage from '../views/ChatPage.vue'; // You'd create this component
// import ProjectsPage from '../views/ProjectsPage.vue'; // Example
// import TemplatesPage from '../views/TemplatesPage.vue'; // Example

const routes = [
  {
    path: '/',
    name: 'Chat',
    component: ChatPage, // This would be the component containing your ChatView.vue logic
                        // or ChatView.vue itself if you restructure App.vue
  },
  // Example for a Projects page:
  // {
  //   path: '/projects',
  //   name: 'Projects',
  //   component: ProjectsPage,
  // },
  // Example for a Templates page:
  // {
  //   path: '/templates',
  //   name: 'Templates',
  //   component: TemplatesPage,
  // },
  // Add other routes here
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // For standard browser history mode
  // history: createWebHashHistory(import.meta.env.BASE_URL), // For hash mode (# in URL)
  routes,
});

export default router;