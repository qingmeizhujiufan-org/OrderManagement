import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {Layout, Row, Col, Affix, Icon, Input, Dropdown, Menu, Avatar, Tooltip, Notification, Divider} from 'antd';
import restUrl from 'RestUrl';
import ajax from 'Utils/ajax';
import './zzHeader.less';

const {Header} = Layout;

const logoutUrl = restUrl.ADDR + 'server/LoginOut';

class ZZHeader extends React.Component {
    constructor(props) {
        super(props);

        this.menu = (
            <Menu>
                <Menu.Item>
                    <span onClick={this.logout}>退出登录</span>
                </Menu.Item>
            </Menu>
        );
    }

    logout = () => {
        let param = {};
        param.userId = sessionStorage.userId;
        ajax.postJSON(logoutUrl, JSON.stringify(param), (data) => {
            if (data.success) {
                // sessionStorage.removeItem('token');
                // sessionStorage.removeItem('expireDate');
                // sessionStorage.removeItem('userId');
                // sessionStorage.removeItem('type');
                // sessionStorage.removeItem('typeName');
                sessionStorage.clear();
                notification.open({
                    message: '已安全退出！',
                    icon: <Icon type="smile-circle" style={{color: '#108ee9'}}/>,
                });
                this.context.router.push('/login');
            } else {
                notification.warning({
                    message: data.backMsg
                });
            }
        });
    }

    render() {
        const {collapsed, onToggleClick} = this.props;

        return (
            <Header className="zui-header">
                <Row type="flex" justify="space-between" align="middle" style={{height: '100%'}}>
                    <Col span={2}>
                        <Tooltip placement="right" title={collapsed ? '点击张开左侧菜单栏' : '点击收缩左侧菜单栏'}>
                            <Icon
                                className="trigger"
                                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={onToggleClick}
                            />
                        </Tooltip>
                    </Col>
                    <Col span={10}>
                    </Col>
                    <Col span={12} style={{textAlign: 'right'}}>
                        <Icon type="bell" theme="outlined"
                              style={{fontSize: 18, verticalAlign: 'text-bottom'}}/>
                        <Divider type="vertical" style={{margin: '0 30px'}} />
                        <Dropdown overlay={this.menu}>
                            <a className="ant-dropdown-link">
                                <Avatar
                                    style={{marginRight: 5, verticalAlign: '-6px', backgroundColor: '#fc5a59'}}
                                    size="small"
                                    icon={sessionStorage.getItem('avatar') || "user"}
                                    src={sessionStorage.getItem('avatar') || null}
                                /> 管理员<Icon type="down"/>
                            </a>
                        </Dropdown>
                    </Col>
                </Row>
            </Header>
        );
    }
}

ZZHeader.contextTypes = {
    router: PropTypes.object
}

export default ZZHeader;
