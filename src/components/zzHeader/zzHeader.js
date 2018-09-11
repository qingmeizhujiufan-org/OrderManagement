import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {Layout, Row, Col, Affix, Icon, Input, Dropdown, Menu, Avatar, Tooltip, notification} from 'antd';
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
                        {/*<Input*/}
                            {/*className="input-search"*/}
                            {/*placeholder="别说话，搜我..."*/}
                            {/*prefix={<Icon type="search"*/}
                                          {/*style={{color: 'rgba(0,0,0,1)', fontSize: 16, fontWeight: 600}}/>}*/}
                            {/*style={{width: 200}}*/}
                        {/*/>*/}
                        <Dropdown overlay={this.menu}>
                            <a className="ant-dropdown-link">
                                <Avatar style={{verticalAlign: '-6px', backgroundColor: '#fc5a59'}} size="small"
                                        icon="user"/> 管理员<Icon type="down"/>
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
