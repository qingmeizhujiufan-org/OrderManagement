import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Row,
    Col,
    Breadcrumb,
    Icon,
    Input,
    Select,
    Divider,
    Button,
    notification,
    Tree,
    Spin,
    Tabs,
    message,
    Alert
} from 'antd';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import util from 'Utils/util';
import '../index.less';
import {convertToRaw} from "draft-js";
import {Modal} from "antd/lib/index";

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

const getAllOrganizeInfoUrl = restUrl.ADDR + 'organize/getAllOrganizeInfo';
const saveUrl = restUrl.ADDR + 'organize/save';
const delAdminUrl = restUrl.ADDR + 'organize/delete';
const queryListUrl = restUrl.ADDR + 'city/queryList';
const queryUserNamesUrl = restUrl.ADDR + 'server/queryUserNames';

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 12},
};

class Organize extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [{
            title: '用户名',
            dataIndex: 'userName',
            key: 'userName',
            align: 'left'
        }, {
            title: '类型',
            dataIndex: 'typeName',
            key: 'typeName',
            align: 'center'
        }, {
            title: '姓名',
            dataIndex: 'realName',
            key: 'realName',
            align: 'center'
        }, {
            title: '所属城市',
            dataIndex: 'cityName',
            key: 'cityName',
            align: 'center'
        }, {
            width: 180,
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            align: 'center'
        }, {
            title: <a><Icon type="setting" style={{fontSize: 18}}/></a>,
            key: 'operation',
            width: 120,
            align: 'center',
            render: (text, record, index) => (
                <div>
                    {
                        (record.type !== 1 && record.id !== sessionStorage.userId) ? (
                            <a onClick={() => this.onDelete(record.id)}>删除</a>
                        ) : null
                    }
                </div>
            )
        }];

        this.state = {
            confirmDirty: false,
            type: sessionStorage.type,
            data: [],
            userNames: [],
            namesLoading: false,
            loadUserNamesStatus: false,
            loading: true,
            submitLoading: false,
            cityList: [],
            cityLoading: false
        };
    }

    componentDidMount = () => {
        this.getAllOrganizeInfo();
        this.getCityList();
        this.queryUserNames();
    }

    //获取组织信息
    getAllOrganizeInfo = () => {
        const param = {};
        param.userId = sessionStorage.userId;
        this.setState({
            loading: true
        });
        ajax.getJSON(getAllOrganizeInfoUrl, param, (data) => {
            if (data.success) {
                let backData = data.backData;
                backData.map(item => item.key = item.id);

                this.setState({
                    data: backData,
                    loading: false
                });
            }
        });
    }

    getCityList = () => {
        this.setState({
            cityLoading: true
        });
        let param = {};
        ajax.getJSON(queryListUrl, param, data => {
            if (data.success) {
                let backData = data.backData;
                this.setState({
                    cityList: backData,
                    cityLoading: false
                });
            }
        });
    }

    queryUserNames = () => {
        ajax.getJSON(queryUserNamesUrl, null, data => {
           if(data.success){
               this.setState({
                   userNames: data.backData,
                   loadUserNamesStatus: true
               });
           }
            this.setState({
                namesLoading: true
            });
        });
    }

    loadTree = list => {
        let tree = util.listToTree(list);
        if (tree) {
            return (
                <Tree
                    showLine
                    defaultExpandAll={true}
                >
                    {this.loadTreeNode(tree)}
                </Tree>
            );
        } else {
            return null;
        }

    }

    loadTreeNode = (treeData) => {
        return treeData.map(item => {
            if (item.children && item.children.length > 0) {
                return (
                    <TreeNode key={item.id} title={<span
                        style={{fontSize: 14, color: '#000'}}>{`${item.userName}(${item.typeName})`}</span>}>
                        {this.loadTreeNode(item.children)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    key={item.id}
                    title={`${item.userName}(${item.typeName})`}
                />
            );
        });
    }

    validateUserName = (rule, value, callback) => {
        const userNames = this.state.userNames;
        userNames.map(item => {
            if(item === value){
                callback('用户名已存在，请重新输入!');
            }
        });
        callback();
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('pwd')) {
            callback('密码不一致，请重新输入!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['userPwd'], {force: true});
        }
        callback();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.pId = sessionStorage.userId;
                console.log('handleSubmit  param === ', values);
                this.setState({
                    submitLoading: true
                });
                ajax.postJSON(saveUrl, JSON.stringify(values), (data) => {
                    if (data.success) {
                        notification.open({
                            message: this.state.type === '1' ? '新增管理员成功！' : '新增运营人员成功！',
                            icon: <Icon type="smile-circle" style={{color: '#108ee9'}}/>,
                        });

                        this.setState({
                            submitLoading: false
                        });

                        this.getAllOrganizeInfo();
                    }
                });
            }
        });
    }

    onDelete = (key) => {
        Modal.confirm({
            title: '提示',
            content: '确认要删除吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                let param = {};
                param.id = key;
                ajax.postJSON(delAdminUrl, JSON.stringify(param), data => {
                    if (data.success) {
                        notification.open({
                            message: '删除成功！',
                            icon: <Icon type="smile-circle" style={{color: '#108ee9'}}/>,
                        });
                        let dataSource = [...this.state.data];
                        dataSource = dataSource.filter(item => item.id !== key);
                        this.setState({
                            data: dataSource
                        });
                    } else {
                        message.warning(data.backMsg);
                    }
                });
            }
        });
    }

    render() {
        let {
            type,
            data,
            namesLoading,
            loadUserNamesStatus,
            loading,
            submitLoading,
            cityList,
            cityLoading
        } = this.state;
        const {getFieldDecorator, setFieldsValue} = this.props.form;
        const userInfo = _.find(data, {id: sessionStorage.userId});

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>首页</Breadcrumb.Item>
                            <Breadcrumb.Item>平台概况</Breadcrumb.Item>
                            <Breadcrumb.Item>组织权限</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>组织管理</h1>
                </div>
                <div className='pageContent'>
                    <Row gutter={32}>
                        {
                            type === '1' ? (
                                <Col span={6}>
                                    <ZZCard loading={loading} title="组织树">
                                        {this.loadTree(data)}
                                    </ZZCard>
                                </Col>
                            ) : null
                        }
                        <Col span={type === '1' ? 18 : 24}>
                            <ZZCard loading={loading} title={type === '1' ? "管理员管理" : '运营人员管理'}>
                                <Tabs defaultActiveKey="1">
                                    <TabPane tab={<span><Icon type="bars"/>组织人员列表</span>} key="1">
                                        <ZZTable
                                            dataSource={type === '1' ? util.listToTree(data) : data}
                                            columns={this.columns}
                                            bordered={true}
                                        />
                                    </TabPane>
                                    <TabPane tab={<span><Icon
                                        type="plus-square"/>{sessionStorage.type === '1' ? '新增管理员' : '新增运营人员'}</span>}
                                             key="2">
                                        {
                                            (namesLoading && !loadUserNamesStatus) ? (
                                                <Alert message="用户名获取失败，不允许新增！" banner closable />
                                            ) : null
                                        }
                                        <Form onSubmit={this.handleSubmit}>
                                            <Row>
                                                <Col span={12}>
                                                    <FormItem
                                                        label="登录名"
                                                        {...formItemLayout}
                                                    >
                                                        {getFieldDecorator('userName', {
                                                            rules: [{required: true, message: '登录名不能为空!'},{
                                                                validator: this.validateUserName,
                                                            }],
                                                        })(
                                                            <Input placeholder="登录名"/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col span={12}>
                                                    <FormItem
                                                        label="城市选择"
                                                        {...formItemLayout}
                                                    >
                                                        <Spin spinning={cityLoading} indicator={<Icon type="loading"/>}>
                                                            {getFieldDecorator('cityId', {
                                                                rules: [{required: true, message: '城市不能为空!'}],
                                                                initialValue: userInfo ? userInfo.cityId : null
                                                            })(
                                                                <Select
                                                                    disabled={type !== '1'}
                                                                >
                                                                    {
                                                                        cityList.map(item => {
                                                                            return (<Option key={item.id}
                                                                                            value={item.id}>{item.cityName}</Option>)
                                                                        })
                                                                    }
                                                                </Select>
                                                            )}
                                                        </Spin>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={12}>
                                                    <FormItem
                                                        label="密码"
                                                        {...formItemLayout}
                                                    >
                                                        {getFieldDecorator('pwd', {
                                                            rules: [{
                                                                required: true, message: '密码不能为空!'
                                                            }, {
                                                                validator: this.validateToNextPassword,
                                                            }],
                                                        })(
                                                            <Input type='password' placeholder="密码"/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col span={12}>
                                                    <FormItem
                                                        label="重复密码"
                                                        {...formItemLayout}
                                                    >
                                                        {getFieldDecorator('userPwd', {
                                                            rules: [{
                                                                required: true, message: '重复密码不能为空!'
                                                            }, {
                                                                validator: this.compareToFirstPassword,
                                                            }],
                                                        })(
                                                            <Input type='password' placeholder="重复密码"
                                                                   onBlur={this.handleConfirmBlur}/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={12}>
                                                    <FormItem
                                                        label="用户名"
                                                        {...formItemLayout}
                                                    >
                                                        {getFieldDecorator('realName', {
                                                            rules: [{required: true, message: '用户名不能为空!'}],
                                                        })(
                                                            <Input placeholder="用户名"/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col span={12}>
                                                    <FormItem
                                                        label="类型"
                                                        {...formItemLayout}
                                                    >
                                                        {getFieldDecorator('typeName', {
                                                            initialValue: type === '1' ? '管理员' : '运营人员'
                                                        })(
                                                            <Input disabled/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Divider/>
                                            <Row>
                                                <Col offset={3}>
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        loading={submitLoading}
                                                        disabled={!loadUserNamesStatus}
                                                    >
                                                        {type === '1' ? '新增管理员' : '新增运营人员'}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </TabPane>
                                </Tabs>
                            </ZZCard>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const WrappedOrganize = Form.create()(Organize);
Organize.contextTypes = {
    router: PropTypes.object
}

export default WrappedOrganize;
