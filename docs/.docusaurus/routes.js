import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '23b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', 'dcc'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '13d'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c88'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '8d3'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '1dc'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '8ab'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '96a'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'b8b'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'ed7'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', 'a8c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/api-design',
                component: ComponentCreator('/docs/architecture/api-design', '4ea'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/database-schema',
                component: ComponentCreator('/docs/architecture/database-schema', 'b35'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/overview',
                component: ComponentCreator('/docs/architecture/overview', '20a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/technology-stack',
                component: ComponentCreator('/docs/architecture/technology-stack', 'a88'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/components/ai-features',
                component: ComponentCreator('/docs/components/ai-features', '0ed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/components/ai-features-backup',
                component: ComponentCreator('/docs/components/ai-features-backup', '80b'),
                exact: true
              },
              {
                path: '/docs/components/authentication',
                component: ComponentCreator('/docs/components/authentication', 'b04'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/components/authentication-backup',
                component: ComponentCreator('/docs/components/authentication-backup', 'e37'),
                exact: true
              },
              {
                path: '/docs/components/course-management',
                component: ComponentCreator('/docs/components/course-management', '2c3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/components/course-management-backup',
                component: ComponentCreator('/docs/components/course-management-backup', '616'),
                exact: true
              },
              {
                path: '/docs/components/learning-system',
                component: ComponentCreator('/docs/components/learning-system', 'dca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/components/learning-system-backup',
                component: ComponentCreator('/docs/components/learning-system-backup', 'cff'),
                exact: true
              },
              {
                path: '/docs/components/payment-processing',
                component: ComponentCreator('/docs/components/payment-processing', '74c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/components/payment-processing-backup',
                component: ComponentCreator('/docs/components/payment-processing-backup', 'b0c'),
                exact: true
              },
              {
                path: '/docs/frontend/component-system',
                component: ComponentCreator('/docs/frontend/component-system', '8ef'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/introduction',
                component: ComponentCreator('/docs/introduction', 'b92'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/introduction',
                component: ComponentCreator('/docs/introduction', '457'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
