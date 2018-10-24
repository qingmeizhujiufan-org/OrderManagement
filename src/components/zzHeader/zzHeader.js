import React from 'react';
import PropTypes from 'prop-types';
import {Layout, Row, Col, Icon, Badge, Dropdown, Menu, Avatar, Notification, Divider} from 'antd';
import restUrl from 'RestUrl';
import './zzHeader.less';

const {Header} = Layout;

const logoutUrl = restUrl.ADDR + 'server/LoginOut';

const orignalSetItem = sessionStorage.setItem;
sessionStorage.setItem = function (key, newValue) {
    const setItemEvent = new Event("setItemEvent");
    setItemEvent.key = key;
    setItemEvent.newValue = newValue;
    window.dispatchEvent(setItemEvent);
    orignalSetItem.apply(this, arguments);
};

class ZZHeader extends React.Component {
    constructor(props) {
        super(props);

        this.menu = (
            <Menu>
                <Menu.Item>
                    <span onClick={this.goUserCenter}>个人中心</span>
                </Menu.Item>
                <Menu.Item>
                    <span onClick={this.logout}>退出登录</span>
                </Menu.Item>
            </Menu>
        );

        this.state = {
            avatar: sessionStorage.getItem('avatar')
        };
    }

    componentDidMount = () => {
        window.addEventListener('setItemEvent', e => {
            console.log('e === ', e);
            if (e.key === 'avatar' && e.newValue) {
                this.setState({avatar: e.newValue});
            }
        });
    }

    goUserCenter = () => {
        this.context.router.push('/frame/setting/list/');
    }

    checkMessage = () => {
        this.context.router.push('/frame/setting/list/message');
    }

    logout = () => {
        sessionStorage.clear();
        Notification.success({
            message: '提示',
            description: '已安全退出！'
        });
        this.context.router.push('/login');
        // let param = {};
        // param.userId = sessionStorage.userId;
        // ajax.postJSON(logoutUrl, JSON.stringify(param), (data) => {
        //     if (data.success) {
        //         sessionStorage.clear();
        //         Notification.success({
        //             message: '提示',
        //             description: '已安全退出！'
        //         });
        //         this.context.router.push('/login');
        //     } else {
        //         message.error(data.backMsg);
        //     }
        // });
    }

    render() {
        const {collapsed, onToggleClick} = this.props;
        const {avatar} = this.state;

        return (
            <Header className="zui-header">
                <Row type="flex" justify="space-between" align="middle">
                    <Icon
                        className="trigger"
                        type={collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={onToggleClick}
                    />
                    {/*<Badge dot>*/}
                    {/*<span onClick={this.checkMessage}>*/}
                    {/*<Icon type="bell" theme="outlined" style={{fontSize: 20, color: '#fff', verticalAlign: 'text-bottom'}}/>*/}
                    {/*</span>*/}
                    {/*</Badge>*/}
                    {/*<Divider type="vertical" style={{margin: '0 30px'}}/>*/}
                    <Dropdown overlay={this.menu}>
                        <a className="ant-dropdown-link" style={{color: '#fff'}}>
                            <Avatar
                                className='zui-avatar'
                                size="small"
                                icon={avatar ? avatar : "user"}
                                src={avatar ? avatar : null}
                            /> {sessionStorage.userName} <Icon type="down"/>
                        </a>
                    </Dropdown>
                </Row>
            </Header>
        );
    }
}

ZZHeader.contextTypes = {
    router: PropTypes.object
}

export default ZZHeader;
