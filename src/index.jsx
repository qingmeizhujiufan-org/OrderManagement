import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import PageRouter from 'routes/index'
import './index.less'//全局样式
import './assets/css/iconfont.css';

const store = configureStore();

const orignalSetItem = sessionStorage.setItem;
sessionStorage.setItem = function(key,newValue){
    const setItemEvent = new Event("setItemEvent");
    setItemEvent.newValue = newValue;
    window.dispatchEvent(setItemEvent);
    orignalSetItem.apply(this,arguments);
}

ReactDOM.render(
    <Provider store={store}>
        <PageRouter/>
    </Provider>, window.document.getElementById('main')
);