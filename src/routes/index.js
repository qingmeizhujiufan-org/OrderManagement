import React from 'react';
import {Route, IndexRoute, hashHistory, Router} from 'react-router';

import App from '../modules/App';
import Frame from '../modules/Frame';

/* 登录 */
import Login from '../modules/login/component/login';
import Home from "../modules/home/component/home";
import User from "../modules/user/component";
import UserList from "../modules/user/component/userList";
import UserAdd from "../modules/user/component/userAdd";
import ProductList from "../modules/product/component/productList";
import EditProduct from "../modules/product/component/editProduct";
import AddProduct from "../modules/product/component/addProduct";
import Organize from "../modules/organize/component";
import OrderList from "../modules/order/component/orderList";

const requireAuth = (nextState, replace) => {
    if (!sessionStorage.expireDate || new Date(sessionStorage.expireDate).getTime() <= new Date().getTime()) {
        replace({pathname: '/'})
    }
}

class PageRouter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
    }

    render() {
        return (
            <div>
                <Router history={hashHistory}>
                    <Route path="/" component={App}>
                        <IndexRoute component={Login}/>
                        <Route path="login" component={Login}/>
                        <Route path="/frame(/*)" component={Frame} onEnter={requireAuth}>
                            <IndexRoute component={Home}/>
                            <Route path="home" component={Home} />
                            <Route path="product/productList" component={ProductList} />
                            <Route path="product/productList/edit/:id" component={EditProduct} />
                            <Route path="product/productList/add" component={AddProduct} />
                            <Route path="organize" component={Organize} />
                            <Route path="user/count" component={User} />
                            <Route path="user/add" component={UserAdd} />
                            <Route path="user/list" component={UserList} />
                            <Route path="order/orderList" component={OrderList} />
                        </Route>
                    </Route>
                </Router>
            </div>
        )
    }
}

export default PageRouter;
