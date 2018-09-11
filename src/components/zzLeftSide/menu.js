const Menu = [
  {
    key: '1',
    iconType: 'dashboard',
    label: '平台概况',
    children: [
      {
        key: '1_1',
        link: '/frame/home',
        label: '首页'
      }
    ]
  }, {
    key: '2',
    iconType: 'rocket',
    label: '用户管理',
    children: [
      {
        key: '2_1',
        link: '/frame/user/list',
        label: '用户列表'
      },
      // {
      //   key: '2_2',
      //   link: '/frame/user/add',
      //   label: '新增用户'
      // },
      {
        key: '2_2',
        link: '/frame/user/count',
        label: '统计分析'
      }
    ]
  }, {
    key: '3',
    iconType: 'solution',
    label: '权限管理',
    children: [
      {
        key: '3_1',
        link: '/frame/organize',
        label: '组织权限'
      }
    ]
  }, {
    key: '4',
    iconType: 'table',
    label: '产品管理',
    children: [
      {
        key: '4_1',
        link: '/frame/product/productList',
        label: '产品列表'
      }
    ]
  }, {
    key: '5',
    iconType: 'line-chart',
    label: '订单管理',
    children: [
      {
        key: '5_1',
        link: '/frame/order/orderList',
        label: '订单列表'
      }
    ]
  }
];

export default Menu;