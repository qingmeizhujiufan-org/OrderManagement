const Menu = [
    {
        key: '1',
        iconType: 'file-text',
        label: '订单管理',
        children: [
            {
                key: '1_1',
                link: '/frame/order/list',
                label: '订单列表'
            }, {
                key: '1_2',
                link: '/frame/order/add',
                label: '新增订单'
            }, {
                key: '1_3',
                link: '/frame/order/sender',
                label: '寄件信息列表'
            }
        ]
    }, {
        key: '2',
        iconType: 'area-chart',
        label: '报表管理',
        children: [
            {
                key: '2_1',
                link: '/frame/report/list',
                label: '各区订单统计'
            }, {
                key: '2_2',
                link: '/frame/report/diffnatureCount',
                label: '不同性质订单统计'
            }, {
                key: '2_3',
                link: '/frame/report/chart',
                label: '各区累计总金额'
            }, {
                key: '2_4',
                link: '/frame/report/personal',
                label: '个人统计'
            }, {
                key: '2_5',
                link: '/frame/report/diffnature',
                label: '不同性质订单汇总'
            }, {
                key: '2_6',
                link: '/frame/report/resource',
                label: '资源统计'
            }
        ]
    }, {
        key: '3',
        iconType: 'file-search',
        label: '产品管理',
        children: [
            {
                key: '3_1',
                link: '/frame/product/list',
                label: '产品列表'
            }, {
                key: '3_2',
                link: '/frame/product/add',
                label: '新增产品'
            }
        ]
    }, {
        key: '4',
        iconType: 'idcard',
        label: '用户管理',
        children: [
            {
                key: '4_1',
                link: '/frame/user/list',
                label: '用户列表'
            }, {
                key: '4_2',
                link: '/frame/user/add',
                label: '新增用户'
            }, {
                key: '4_3',
                link: '/frame/user/resource',
                label: '用户资源'
            }
        ]
    }, {
        key: '5',
        iconType: 'setting',
        label: '个人设置',
        children: [
            {
                key: '5_1',
                link: '/frame/setting/list',
                label: '个人中心'
            }, {
                key: '5_2',
                link: '/frame/setting/resource',
                label: '资源信息'
            }
        ]
    }
];

export default Menu;