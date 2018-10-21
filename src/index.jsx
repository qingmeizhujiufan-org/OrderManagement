import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import PageRouter from 'routes/index'
import './index.less'//全局样式
import './assets/css/iconfont.css';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <PageRouter/>
    </Provider>, window.document.getElementById('main')
);