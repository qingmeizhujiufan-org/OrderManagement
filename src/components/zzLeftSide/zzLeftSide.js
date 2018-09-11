import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {Layout, Icon, Menu} from 'antd';
import {Scrollbars} from 'react-custom-scrollbars';
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import {admin, operator} from './authority';
import menuTree from './menu';
import './zzLeftSide.less';

const {Sider} = Layout;
const SubMenu = Menu.SubMenu;

class ZZLeftSide extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            defaultSelectedKeys: '',
            menuTree: []
        };
    }

    componentWillMount = () => {
        this.authorityMenu();
    }

    componentDidMount = () => {
        this.selectActiveTab();
    }

    componentWillReceiveProps = nextProps => {
        if ('storageChange' in nextProps && nextProps.storageChange !== this.props.storageChange) {
            this.selectActiveTab();
        }
    }

    authorityMenu = () => {
        if (sessionStorage.type !== undefined && sessionStorage.type !== null) {
            if (sessionStorage.type === "1") {
                this.setState({menuTree});
            }
            else {
                let authority_menu = [];
                if (sessionStorage.type === "2") {
                    authority_menu = admin;
                }
                else if (sessionStorage.type === "3") {
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
                                _item.children.push(_.find(item.children, {key: sub_key}));
                            });
                            _menu.push(_item);
                        }
                    }
                });
                this.setState({menuTree: _menu});
            }
        }
    }

    selectActiveTab = () => {
        const menu = this.getFlatMenu(this.state.menuTree);

        for (let i = 0; i < menu.length; i++) {
            const item = menu[i];

            if (window.location.hash.split('#')[1].indexOf(item.link) > -1) {
                this.setState({defaultSelectedKeys: item.key});
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

    buildMenu = () => {
        const {defaultSelectedKeys, menuTree} = this.state;
        if (defaultSelectedKeys === '') return;
        const menu = menuTree.map(function (item, index) {
            if (item.children) {
                return (
                    <SubMenu
                        key={item.key}
                        title={<span><Icon type={item.iconType}/><span>{item.label}</span></span>}
                    >
                        {
                            item.children.map(function (subItem, subIndex) {
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
                defaultSelectedKeys={[defaultSelectedKeys]}
                defaultOpenKeys={['1', '2', '3', '4', '5', '6']}
            >
                {menu}
            </Menu>
        );
    }

    render() {
        const {menuTree} = this.state;
        const {collapsed} = this.props;
        const menu = menuTree.length > 0 ? this.buildMenu() : null;

        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={256}
                className="left-side"
            >
                <div className="logo">
                    <Link to="/">
                        <h1>ADMIN</h1>
                    </Link>
                </div>
                <Scrollbars style={{height: 'calc(100vh - 64px)'}}>
                    {menu}
                </Scrollbars>
            </Sider>
        );
    }
}

ZZLeftSide
    .contextTypes = {
    router: PropTypes.object
}

export default ZZLeftSide;
