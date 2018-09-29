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
            authMenu: [],
            subMenuList: null
        };
    }

    componentWillMount = () => {
        this.setAuthMenu();
        // this.selectActiveTab();
    }

    componentDidMount = () => {
        // this.setMenuChildren();
        this.selectActiveTab();
        window.addEventListener('hashchange', () => {
            this.selectActiveTab();
        });
    }

    componentWillReceiveProps = nextProps => {
    }

    setAuthMenu = callback => {
        this.setState({authMenu: menuTree}, () => {
            if (typeof callback === 'function') callback();
        });
        // if (sessionStorage.type !== undefined && sessionStorage.type !== null) {
        //     if (sessionStorage.type === "1") {
        //         this.setState({authMenu: menuTree});
        //     }
        //     else {
        //         let authority_menu = [];
        //         if (sessionStorage.type === "2") {
        //             authority_menu = admin;
        //         }
        //         else if (sessionStorage.type === "3") {
        //             authority_menu = operator;
        //         }
        //         let _menu = [];
        //         menuTree.map(item => {
        //             const _item = {};
        //             for (let i = 0; i < authority_menu.length; i++) {
        //                 if (item.key === authority_menu[i].key) {
        //                     _item.key = item.key;
        //                     _item.iconType = item.iconType;
        //                     _item.label = item.label;
        //                     _item.children = [];
        //                     authority_menu[i].children.map(sub_key => {
        //                         _item.children.push(_.find(item.children, {key: sub_key}));
        //                     });
        //                     _menu.push(_item);
        //                 }
        //             }
        //         });
        //         this.setState({authMenu: _menu});
        //     }
        // }
    }

    selectActiveTab = callback => {
        const menu = this.getFlatMenu(this.state.authMenu);
        const hashUrl = location.hash.split('#')[1];
        for (let i = 0; i < menu.length; i++) {
            const item = menu[i];
            if (hashUrl.indexOf(item.link) > -1) {
                this.setState({selectedKeys: item.key}, () => {
                    if (typeof  callback === 'function') callback();
                });
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

    render() {
        const {selectedKeys, subMenuList} = this.state;
        const {collapsed} = this.props;
        console.log(' ========================= ');

        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={256}
                className="left-side"
            >
                <div className="logo">
                    <Link to="/frame/user/list">
                        <h1>ADMIN</h1>
                    </Link>
                </div>
                <Scrollbars style={{height: 'calc(100vh - 64px)'}}>
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
