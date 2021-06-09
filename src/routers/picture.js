const sysDd = () =>
    import(/* webpackChunkName: "picture" */'../views/picture/dd/sysDd');
const sysDdtype = () =>
    import(/* webpackChunkName: "picture" */'../views/picture/dd/sysDdtype');
const sysLog = () =>
    import(/* webpackChunkName: "picture" */'../views/picture/sysLog/sysLog');
const sysDepartment = () =>
    import(/* webpackChunkName: "picture" */'../views/picture/sysDepartment/sysDepartment');
const sysFile = () =>
    import(/* webpackChunkName: "picture" */'../views/picture/sysFile/sysFile');
const sysImage=()=>
    import('../views/picture/sysImage/sysImage');
export default [
    {
        path: 'sysDd',
        name: 'sysDd',
        component: sysDd
    },
    {
        path: 'sysDdtype',
        name: 'sysDdtype',
        component: sysDdtype
    },
    {
        path: 'sysLog',
        name: 'sysLog',
        component: sysLog
    },
    {
        path: 'sysDepartment',
        name: 'sysDepartment',
        component: sysDepartment
    },
    {
        path: 'sysFile',
        name: 'sysFile',
        component: sysFile
    },{
        path: 'sysImage',
        name: 'sysImage',
        component: sysImage

    }
]