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
                        <Route path="product/productList" component={ProductList}/>
                        <Route path="product/detail/:id" component={ProductDetail}/>
                        <Route path="product/edit/:id" component={ProductEdit}/>
                        <Route path="product/add" component={ProductAdd}/>
                        <Route path="user/list" component={UserList}/>
                        <Route path="user/list/add" component={UserAdd}/>
                        <Route path="user/list/detail/:id" component={UserDetail}/>
                        <Route path="user/list/edit/:id" component={UserEdit}/>
                        <Route path="order/orderList" component={OrderList}/>
                        <Route path="order/add" component={OrderAdd}/>
                    </Route>
                </Route>
            </Router>
        )
    }
}

export default PageRouter;
