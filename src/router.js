import Vue from 'vue'
import Router from 'vue-router'
import bar from './routers/bar'
import system from './routers/system'
import picture from './routers/picture'

const login = () =>
    import('./views/frame/login');
const index = () =>
    import('./views/frame/index');
const personal = () =>
    import('./views/frame/personal');
const imgIndex = () =>
    import('./views/frame/imgIndex')
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/index',
            name: 'index',
            component: index,
            children: [
                {
                    path: '/personal',
                    name: 'personal',
                    component: personal
                },
                ...bar,
                ...system,
                ...picture,
            ]
        },
        {
            path: '/imgIndex',
            name: 'imgIndex',
            component: imgIndex,
        }
    ]
})
