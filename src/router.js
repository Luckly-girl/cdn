import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

export const constantRouterMap = [{
    path: "/",
    redirect: {
      name: "login"
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./views/login")
  },
  {
    path: "/regist",
    name: "regist",
    component: () => import("./views/regist")
  },
  {
    path: "/forget",
    name: "forget",
    component: () => import("./views/forget")
  }
];
export const parentRouterMap = [{
  path: "/cdn",
  name: "layout",
  component: () => import("./components/Layout"),
  children: [{
      path: "home",
      name: "home",
      component: () => import("./views/dashboard")
    },
    {
      path: "basicFacts",
      name: "basicFacts",
      component: () => import("./views/basicFacts"),
      meta: {
        showNav: true
      }
    },
    {
      path: "flowPacket",
      name: "flowPacket",
      component: () => import("./views/flowPacket"),
      meta: {
        showNav: true
      }
    },
    {
      path: "cdn",
      name: "cdn",
      component: () => import("./views/cdn"),
    },
    {
      path: "domain",
      name: "domain",
      component: () => import("./views/domain"),
      meta: {
        showNav: true
      }
    },
    {
      path: "credentials",
      name: "credentials",
      component: () => import("./views/credentials"),
      meta: {
        showNav: true
      }
    },
    {
      path: "workOrderHistory",
      name: "workOrderHistory",
      component: () => import("./views/workOrder/workOrderHistory")
    },
    {
      path: "workOrderSub",
      name: "workOrderSub",
      component: () => import("./views/workOrder/workOrderSub")
    },
    {
      path: "dataCenter",
      name: "dataCenter",
      component: () => import('./views/dataCenter'),
      meta: {
        showNav: true
      }
    },
    {
      path: "record",
      name: "record",
      component: () => import("./views/record"),
      meta: {
        showNav: true
      }
    },
    {
      path: "openWaf",
      name: "openWaf",
      component: () => import("./views/openWaf"),
      meta: {
        showNav: true
      }
    },
    {
      path: "openFirewall",
      name: "openFirewall",
      component: () => import("./views/openFirewall"),
      meta: {
        showNav: true
      }
    },
    {
      path: "domainSetUp",
      name: "domainSetUp",
      component: () => import("./views/domainSetUp"),
      meta: {
        showNav: true
      }
    },
    {
      path: "wafSet",
      name: "wafSet",
      component: () => import("./views/wafSet"),
      meta: {
        showNav: true
      }
    }
  ]
}];
export default new Router({
  mode: "history",
  routes: constantRouterMap
});

export const errorRouter = {
  path: "*",
  component: () => import("./views/error/404")
};


// export const asyncRouterMap = [
//   {
//     path: 'nodeList',
//     name: 'nodeList',
//     component: () => import('./views/nodeList'),
//     meta: { navTitle: 'CDN管理', title: '节点列表' }
//   },
//   {
//     path: 'production',
//     name: 'production',
//     component: () => import('./views/production'),
//     meta: { navTitle: 'CDN管理', title: '产品管理' }
//   },
//   {
//     path: 'site',
//     name: 'site',
//     component: () => import('./views/site'),
//     meta: { navTitle: 'CDN管理', title: '站点管理' }
//   },
//   {
//     path: 'DNS',
//     name: 'DNS',
//     component: () => import('./views/DNS'),
//     meta: { navTitle: 'CDN管理', title: 'DNS管理' }
//   },
//   {
//     path: 'siteDetection',
//     name: 'siteDetection',
//     component: () => import('./views/siteDetection'),
//     meta: { navTitle: 'CDN管理', title: '站点检测' }
//   },
//   {
//     path: 'security',
//     name: 'security',
//     component: () => import('./views/security'),S
//     meta: { navTitle: 'CDN管理', title: '安全管理' }
//   },
//   {
//     path: 'transferRecord',
//     name: 'transferRecord',
//     component: () => import('./views/transferRecord'),
//     meta: { navTitle: 'CDN管理', title: '转移记录' }
//   },
//   {
//     path: 'logStorageRecord',
//     name: 'logStorageRecord',
//     component: () => import('./views/logStorageRecord'),
//     meta: { navTitle: 'CDN管理', title: '日志封禁记录' }
//   },
//   {
//     path: 'user',
//     name: 'user',
//     component: () => import('./views/user'),
//     meta: { navTitle: '系统管理', title: '用户管理' }
//   },
//   {
//     path: 'role',
//     name: 'role',
//     component: () => import('./views/role'),
//     meta: { navTitle: '系统管理', title: '角色管理' }
//   },
//   {
//     path: 'organizationalStructure',
//     name: 'organizationalStructure',
//     component: () => import('./views/organizationalStructure'),
//     meta: { navTitle: '组织架构', title: '组织架构' }
//   },
//   {
//     path: 'permission',
//     name: 'permission',
//     component: () => import('./views/permission'),
//     meta: { navTitle: '系统管理', title: '权限管理' }
//   },
//   {
//     path: 'openLog',
//     name: 'openLog',
//     component: () => import('./views/operationLog'),
//     meta: { navTitle: '系统管理', title: '操作日志' }
//   },
//   {
//     path: 'personalDetails',
//     name: 'personalDetails',
//     component: () => import('./views/personalDetails'),
//     meta: { navTitle: '账号管理', title: '个人详情' }
//   }
// ]