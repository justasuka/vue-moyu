const admin = () =>
  import(/* webpackChunkName: "system" */'../views/system/admin/admin');
const sysRole = () =>
  import(/* webpackChunkName: "system" */'../views/system/sysRole/sysRole');
const sysPerm = () =>
  import(/* webpackChunkName: "system" */'../views/system/sysPerm/sysPerm');
const  self= () =>
    import(/* webpackChunkName: "system" */'../views/system/setting/self');
export default [{
    path: 'admin',
    name: 'admin',
    component: admin
  },
  {
    path: 'sysRole',
    name: 'sysRole',
    component: sysRole
  },
  {
    path: 'sysPerm',
    name: 'sysPerm',
    component: sysPerm
  },
  {
    path: 'self',
    name: 'self',
    component: self
  },
]