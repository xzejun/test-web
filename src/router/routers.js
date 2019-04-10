export default [
  {
    path: '/',
    redirect: '/login',
    component: () => import('../main/login.vue'),
  },
  {
    path: '/login',
    component: () => import('../main/login.vue'),
  },

  {
    path: '/',
    component: () => {
      if (process.env.NODE_ENV === 'development') {
        return import('../main/index.vue');
      }
      return import('../app/index.vue');
    },
    children: [
      {
        // 关联(status:1关联,2修订,3审核)
        path: '/datamap/relation/:status',
        name: 'relation',
        component: () => import('../app/datamap/relation'),
      },
      {
        // 知识点匹配 首页项目列表
        path: '/datamap/index',
        name: 'datamapIndex',
        component: () => import('../app/datamap/index'),
      },
      {
        // 知识点匹配 查看某个项目(列表)
        path: '/datamap/see/:projectId',
        name: 'datamapSee',
        component: () => import('../app/datamap/see'),
      },
      {
        // 知识点匹配 导入数据
        path: '/datamap/importData/:projectId/:datatype',
        name: 'datamapImportData',
        component: () => import('../app/datamap/importData'),
      },
      {
        // 查看关联,审核草稿
        path: '/datamap/seeRelation',
        name: 'datamapSeeRelation',
        component: () => import('../app/datamap/seeRelation.vue'),
      },
      {
        // 查看结果
        path: '/datamap/seeResult',
        name: 'datamapSeeResult',
        component: () => import('../app/datamap/seeResult.vue'),
      },
      {
        // 查看审核
        path: '/datamap/seeExamine',
        name: 'datamapSeeExamine',
        component: () => import('../app/datamap/seeExamine.vue'),
      },
    ],
  },
];
