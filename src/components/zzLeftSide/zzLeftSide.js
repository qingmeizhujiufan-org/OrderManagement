import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {Layout, Icon, Menu} from 'antd';
import {Scrollbars} from 'react-custom-scrollbars';
import find from 'lodash/find';
import {admin, subAdmin, operator} from './authority';
import menuTree from './menu';
import './zzLeftSide.less';

import Logo from 'Img/logo.png';

const {Sider} = Layout;
const SubMenu = Menu.SubMenu;

class ZZLeftSide extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            defaultSelectedKeys: '',
            authMenu: [],
            subMenuList: null
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.setAuthMenu(this.selectActiveTab);

        window.addEventListener('hashchange', () => {
            this.selectActiveTab();
        });
    }

    componentWillUnmount = () => {
        window.removeEventListener('hashchange', () => {
            this.selectActiveTab();
        });
    }

    setAuthMenu = callback => {
        if (sessionStorage.type !== undefined && sessionStorage.type !== null) {
            const type = sessionStorage.type;
            let authority_menu = [];
            if (type === "1")
                authority_menu = admin;
            else if (type === "2") {
                authority_menu = subAdmin;
            }
            else if (type === "3") {
                authority_menu = operator;
            }
            let _menu = [];
            menuTree.map(item => {
                const _item = {};
                for (let i = 0; i < authority_menu.length; i++) {
                    if (item.key === authority_menu[i].key) {
                        _item.key = item.key;
                        _item.iconType = item.iconType;
                        _item.label = item.label;
                        _item.children = [];
                        authority_menu[i].children.map(sub_key => {
                            _item.children.push(find(item.children, {key: sub_key}));
                        });
                        _menu.push(_item);
                    }
                }
            });

            this.setState({authMenu: _menu}, () => {
                if (typeof callback === 'function') callback();
            });
        }
    }

    selectActiveTab = () => {
        const menu = this.getFlatMenu(this.state.authMenu);
        const hashUrl = location.hash.split('#')[1];
        for (let i = 0; i < menu.length; i++) {
            const item = menu[i];
            if (hashUrl.indexOf(item.link) > -1) {
                this.setState({selectedKeys: item.key});
                return;
            }
        }
    }

    getFlatMenu = menu => {
        return menu.reduce((keys, item) => {
            keys.push(item);
            if (item.children) {
                return keys.concat(this.getFlatMenu(item.children));
            }
            return keys;
        }, []);
    }

    setMenuChildren = () => {
        const {selectedKeys, authMenu} = this.state;
        const subMenuList = authMenu.map(item => {
            if (item.children) {
                return (
                    <SubMenu
                        key={item.key}
                        title={<span><Icon type={item.iconType}/><span>{item.label}</span></span>}
                    >
                        {
                            item.children.map(subItem => {
                                return (
                                    <Menu.Item key={subItem.key}>
                                        <Link to={subItem.link}>{subItem.label}</Link>
                                    </Menu.Item>
                                )
                            })
                        }
                    </SubMenu>
                )
            } else {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.link}>
                            <Icon type={item.iconType}/>
                            <span>{item.label}</span>
                        </Link>
                    </Menu.Item>
                )
            }
        });

        return (
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[selectedKeys]}
                defaultSelectedKeys={['1_1']}
                defaultOpenKeys={['1', '2', '3', '4', '5']}
            >{subMenuList}</Menu>
        );
    }

    onClick = e => {
        this.setState({
            selectedKeys: e.key
        });
    }

    onBreakpoint = broken => {
        this.props.onToggleClick(broken ? false : true);
    }

    render() {
        const {collapsed} = this.props;

        return (
            <Sider
                breakpoint="lg"
                onBreakpoint={this.onBreakpoint}
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={200}
                className="left-side"
            >
                <div className="logo">
                    <h1><img src={Logo}/></h1>
                </div>
                <Scrollbars className='zui-menu'>
                    {this.setMenuChildren()}
                </Scrollbars>
            </Sider>
        );
    }
}

ZZLeftSide.contextTypes = {
    router: PropTypes.object
}

export default ZZLeftSide;
