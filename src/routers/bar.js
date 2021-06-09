const door = () =>
    import(/* webpackChunkName: "bar" */'../views/bar/door/door');
export default [
    {
        path: 'door',
        name: 'door',
        component: door
    },
]