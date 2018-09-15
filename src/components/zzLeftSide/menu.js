const Menu = [
    {
        key: '1',
        iconType: 'rocket',
        label: '用户管理',
        children: [
            {
                key: '1_1',
                link: '/frame/user/list',
                label: '用户列表'
            }
        ]
    }, {
        key: '2',
        iconType: 'table',
        label: '产品管理',
        children: [
            {
                key: '2_1',
                link: '/frame/product/productList',
                label: '产品列表'
            }
        ]
    }, {
        key: '3',
        iconType: 'line-chart',
        label: '订单管理',
        children: [
            {
                key: '3_1',
                link: '/frame/order/orderList',
                label: '订单列表'
            }
        ]
    }, {
        key: '4',
        iconType: 'line-chart',
        label: '报表管理',
        children: [
            {
                key: '4_1',
                link: '/frame/order/orderList',
                label: '报表'
            }
        ]
    }
];

export default Menu;