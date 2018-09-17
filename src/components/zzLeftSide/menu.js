const Menu = [
    {
        key: '1',
        iconType: 'idcard',
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
        iconType: 'file-search',
        label: '产品管理',
        children: [
            {
                key: '2_1',
                link: '/frame/product/list',
                label: '产品列表'
            }
        ]
    }, {
        key: '3',
        iconType: 'file-text',
        label: '订单管理',
        children: [
            {
                key: '3_1',
                link: '/frame/order/list',
                label: '订单列表'
            }
        ]
    }, {
        key: '4',
        iconType: 'area-chart',
        label: '报表管理',
        children: [
            {
                key: '4_1',
                link: '/frame/order/list',
                label: '报表'
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
      }
    ]
  }
];

export default Menu;