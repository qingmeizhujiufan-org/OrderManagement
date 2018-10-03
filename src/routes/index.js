import React from 'react';
import {Route, IndexRoute, hashHistory, Router} from 'react-router';

import App from '../modules/App';
import Frame from '../modules/Frame';

/* 登录 */
import Login from '../modules/login/component/login';
/* 用户管理 */
import UserList from "../modules/user/component/userList";
import UserDetail from "../modules/user/component/userDetail";
import UserEdit from "../modules/user/component/userEdit";
import UserAdd from "../modules/user/component/userAdd";
/* 商品管理 */
import ProductList from "../modules/product/component/productList";
import ProductDetail from "../modules/product/component/productDetail";
import ProductEdit from "../modules/product/component/productEdit";
import ProductAdd from "../modules/product/component/productAdd";
/* 订单管理 */
import OrderList from "../modules/order/component/orderList";
import OrderAdd from "../modules/order/component/orderAdd";
import OrderEdit from "../modules/order/component/orderEdit";
import SenderList from "../modules/order/component/sender";
/* 报表管理 */
import ReportList from "../modules/report/component/reportList";

/* 个人设置 */
import SettingList from "../modules/setting/component/userCenter";
import MessageList from "../modules/setting/component/messageList";
import ResourceList from "../modules/setting/component/resourceInfo";

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
