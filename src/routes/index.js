import React from 'react';
import {Route, IndexRoute, hashHistory, Router} from 'react-router';
import Loadable from 'react-loadable';

const App = Loadable({
    loader: () => import('../modules/App'),
    loading: () => null
});
const Frame = Loadable({
    loader: () => import('../modules/Frame'),
    loading: () => null
});

/* 登录 */
const Login = Loadable({
    loader: () => import('../modules/login/component/login'),
    loading: () => null
});
/* 用户管理 */
const UserList = Loadable({
    loader: () => import("../modules/user/component/userList"),
    loading: () => null
});
const UserDetail = Loadable({
    loader: () => import("../modules/user/component/userDetail"),
    loading: () => null
});
const UserEdit = Loadable({
    loader: () => import("../modules/user/component/userEdit"),
    loading: () => null
});
const UserAdd = Loadable({
    loader: () => import("../modules/user/component/userAdd"),
    loading: () => null
});
/* 商品管理 */
const ProductList = Loadable({
    loader: () => import("../modules/product/component/productList"),
    loading: () => null
});
const ProductDetail = Loadable({
    loader: () => import("../modules/product/component/productDetail"),
    loading: () => null
});
const ProductEdit = Loadable({
    loader: () => import("../modules/product/component/productEdit"),
    loading: () => null
});
const ProductAdd = Loadable({
    loader: () => import("../modules/product/component/productAdd"),
    loading: () => null
});
/* 订单管理 */
const OrderList = Loadable({
    loader: () => import("../modules/order/component/orderList"),
    loading: () => null
});
const OrderAdd = Loadable({
    loader: () => import("../modules/order/component/orderAdd"),
    loading: () => null
});
const OrderEdit = Loadable({
    loader: () => import("../modules/order/component/orderEdit"),
    loading: () => null
});
const SenderList = Loadable({
    loader: () => import("../modules/order/component/sender"),
    loading: () => null
});
/* 报表管理 */
const ReportList = Loadable({
    loader: () => import("../modules/report/component/reportList"),
    loading: () => null
});

/* 个人设置 */
const SettingList = Loadable({
    loader: () => import("../modules/setting/component/userCenter"),
    loading: () => null
});
const MessageList = Loadable({
    loader: () => import("../modules/setting/component/messageList"),
    loading: () => null
});
const ResourceList = Loadable({
    loader: () => import("../modules/setting/component/resourceInfo"),
    loading: () => null
});

const requireAuth = (nextState, replace) => {
    if (!sessionStorage.expireDate || new Date(sessionStorage.expireDate).getTime() <= new Date().getTime()) {
        replace({pathname: '/'})
    }
}

class PageRouter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillMount = () => {

    }

    componentDidMount = () => {
    }

    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Login}/>
                    <Route path="login" component={Login}/>
                    <Route path="frame(/*)" component={Frame} onEnter={requireAuth}>
                        <IndexRoute component={UserList}/>
                        {/* 用户管理 */}
                        <Route path="user" component={App}>
                            <IndexRoute component={UserList}/>
                            <Route path="list" component={UserList}/>
                            <Route path="add" component={UserAdd}/>
                            <Route path="list/detail/:id" component={UserDetail}/>
                            <Route path="list/edit/:id" component={UserEdit}/>
                        </Route>
                        {/* 产品管理 */}
                        <Route path="product" component={App}>
                            <IndexRoute component={ProductList}/>
                            <Route path="list" component={ProductList}/>
                            <Route path="add" component={ProductAdd}/>
                            <Route path="list/detail/:id" component={ProductDetail}/>
                            <Route path="list/edit/:id" component={ProductEdit}/>
                        </Route>
                        {/* 订单管理 */}
                        <Route path="order" component={App}>
                            <IndexRoute component={OrderList}/>
                            <Route path="list" component={OrderList}/>
                            <Route path="add" component={OrderAdd}/>
                            <Route path="list/edit/:id" component={OrderEdit}/>
                            <Route path="sender" component={SenderList}/>
                        </Route>
                        <Route path="report" component={App}>
                            <IndexRoute component={ReportList}/>
                            <Route path="list" component={ReportList}/>
                        </Route>
                        {/* 个人设置 */}
                        <Route path="setting" component={App}>
                            <IndexRoute component={SettingList}/>
                            <Route path="list" component={SettingList}/>
                            <Route path="list/message" component={MessageList}/>
                            <Route path="resource" component={ResourceList}/>
                        </Route>
                    </Route>
                </Route>
            </Router>
        )
    }
}

export default PageRouter;
