import React from 'react';
import {Route, IndexRoute, hashHistory, Router} from 'react-router';
import {Icon} from 'antd';
import Loadable from 'react-loadable';

function Loading(props) {
    if (props.error) {
        return <div>错误! <button onClick={props.retry}>点击重试</button></div>;
    } else if (props.timedOut) {
        return <div>已经超时加载... <button onClick={props.retry}>点击重试</button></div>;
    } else if (props.pastDelay) {
        return (
            <div style={{
                padding: '30px 0',
                textAlign: 'center'
            }}>
                <Icon type="loading" style={{fontSize: 24}}/>
            </div>
        );
    } else {
        return null;
    }
}

const App = Loadable({
    loader: () => import('../modules/App'),
    loading: Loading
});
const Frame = Loadable({
    loader: () => import('../modules/Frame'),
    loading: Loading
});

/* 登录 */
const Login = Loadable({
    loader: () => import('../modules/login/component/login'),
    loading: Loading
});
/* 用户管理 */
const UserList = Loadable({
    loader: () => import("../modules/user/component/userList"),
    loading: Loading
});
const UserDetail = Loadable({
    loader: () => import("../modules/user/component/userDetail"),
    loading: Loading
});
const UserEdit = Loadable({
    loader: () => import("../modules/user/component/userEdit"),
    loading: Loading
});
const UserAdd = Loadable({
    loader: () => import("../modules/user/component/userAdd"),
    loading: Loading
});
const UserResource = Loadable({
    loader: () => import("../modules/user/component/userResource"),
    loading: Loading
});
/* 商品管理 */
const ProductList = Loadable({
    loader: () => import("../modules/product/component/productList"),
    loading: Loading
});
const ProductDetail = Loadable({
    loader: () => import("../modules/product/component/productDetail"),
    loading: Loading
});
const ProductEdit = Loadable({
    loader: () => import("../modules/product/component/productEdit"),
    loading: Loading
});
const ProductAdd = Loadable({
    loader: () => import("../modules/product/component/productAdd"),
    loading: Loading
});
/* 订单管理 */
const OrderList = Loadable({
    loader: () => import("../modules/order/component/orderList"),
    loading: Loading
});
const OrderAdd = Loadable({
    loader: () => import("../modules/order/component/orderAdd"),
    loading: Loading
});
const OrderEdit = Loadable({
    loader: () => import("../modules/order/component/orderEdit"),
    loading: Loading
});
const SenderList = Loadable({
    loader: () => import("../modules/order/component/sender"),
    loading: Loading
});
/* 报表管理 */
const ReportList = Loadable({
    loader: () => import("../modules/report/component/reportList"),
    loading: Loading
});
const ReportDiffNatureCount = Loadable({
    loader: () => import("../modules/report/component/reportDiffNatureCount"),
    loading: Loading
});
const ReportHChart = Loadable({
    loader: () => import("../modules/report/component/reportHChart"),
    loading: Loading
});
const ReportPersonal = Loadable({
    loader: () => import("../modules/report/component/reportPersonal"),
    loading: Loading
});
const ReportDiffNature = Loadable({
    loader: () => import("../modules/report/component/reportDiffNature"),
    loading: Loading
});
const ReportResource = Loadable({
    loader: () => import("../modules/report/component/reportResource"),
    loading: Loading
});

/* 个人设置 */
const SettingList = Loadable({
    loader: () => import("../modules/setting/component/userCenter"),
    loading: Loading
});
const ResourceList = Loadable({
    loader: () => import("../modules/setting/component/resourceInfo"),
    loading: Loading
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
                            <Route path="resource" component={UserResource}/>
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
                        {/* 报表管理 */}
                        <Route path="report" component={App}>
                            <IndexRoute component={ReportList}/>
                            <Route path="list" component={ReportList}/>
                            <Route path="diffnaturecount" component={ReportDiffNatureCount}/>
                            <Route path="chart" component={ReportHChart}/>
                            <Route path="personal" component={ReportPersonal}/>
                            <Route path="diffnature" component={ReportDiffNature}/>
                            <Route path="resource" component={ReportResource}/>
                        </Route>
                        {/* 个人设置 */}
                        <Route path="setting" component={App}>
                            <IndexRoute component={SettingList}/>
                            <Route path="list" component={SettingList}/>
                            <Route path="resource" component={ResourceList}/>
                        </Route>
                    </Route>
                </Route>
            </Router>
        )
    }
}

export default PageRouter;
