import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    Breadcrumb,
    Button,
    Upload,
    Icon,
    Spin,
    Tabs,
    Message,
    Notification
} from 'antd';
import assign from 'lodash/assign';

import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';

const userSaveUrl = restUrl.BASE_HOST + 'user/save';
const uploadUrl = restUrl.BASE_HOST + 'assessory/upload';
const delFileUrl = restUrl.BASE_HOST + 'assessory/delete';
const queryRoleUrl = restUrl.BASE_HOST + 'role/queryList';
const queryDetailUrl = restUrl.BASE_HOST + 'user/qureyOneUser';
const updatePasswordUrl = restUrl.BASE_HOST + 'user/updatePassword';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class DetailForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            data: {},
            imageUrl: '',
            fileList: [],
            loading: false,
            roleList: [],
            submitLoading: false
        };
    }

    componentDidMount = () => {
        this.queryDetail();
        this.queryRole();
    }

    handleChange = ({file, fileList}) => {
        console.log('file === ', file);
        if (file.status === 'done') {
            this.setState({fileList});
        }
        if (file.status === 'removed') {
            this.delFile(file.response.backData.id);
        }
    }

    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    delFile = id => {
        const param = {};
        param.id = id;
        ajax.postJSON(delFileUrl, JSON.stringify(param), data => {
            if (data.success) {
                Notification.success({
                    message: '提示',
                    description: '删除成功！'
                });

                this.setState({fileList: []});
            } else {
                Message.error(data.backMsg);
            }
        });
    }

    queryDetail = () => {
        const id = sessionStorage.userId;
        const param = {};
        param.id = id;
        this.setState({
            loading: true
        });
        ajax.getJSON(queryDetailUrl, param, data => {
            if (data.success) {
                let backData = data.backData;
                if (backData.assessorys) {
                    backData.assessorys.map((item, index) => {
                        backData.assessorys[index] = assign({}, item, {
                            uid: item.id,
                            status: 'done',
                            url: restUrl.ADDR + item.path + item.name,
                            response: {
                                backData: item
                            }
                        });
                    });
                } else {
                    backData.assessorys = [];
                }
                const fileList = [].concat(backData.assessorys);

                this.setState({
                    data: backData,
                    fileList,
                    loading: false
                });
            } else {
                Message.error('用户信息查询失败');
            }
        });
    }

    queryRole = () => {
        this.setState({roleLoading: true});
        ajax.getJSON(queryRoleUrl, null, data => {
            if (data.success) {
                let content = data.backData.content;
                let roleList = [];
                content.map(item => {
                    roleList.push({
                        id: item.id,
                        name: item.roleName
                    });
                });

                this.setState({
                    roleList,
                    roleLoading: false
                });
            } else {
                Message.error(data.backMsg);
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.id = sessionStorage.userId;
                values.assessorys = values.assessorys ? values.assessorys.map(item => {
                    return item.response.backData;
                }) : [];

                this.setState({
                    submitLoading: true
                });
                ajax.postJSON(userSaveUrl, JSON.stringify(values), (data) => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: '用户信息保存成功！'
                        });
                    } else {
                        Message.error(data.backMsg);
                    }
                    const backData = data.backData;
                    if (backData.assessorys && backData.assessorys.length > 0) {
                        sessionStorage.setItem('avatar', restUrl.ADDR + backData.assessorys[0].path + backData.assessorys[0].name);
                    } else {
                        sessionStorage.setItem('avatar', undefined);
                    }

                    this.setState({
                        submitLoading: false
                    }, () => {
                        this.queryDetail()
                    });
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {data, fileList, roleList, roleLoading, submitLoading} = this.state;
        return (
            <div className='userCenter'>
                <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
                    <Row type="flex" justify="center">
                        <Col span={8}>
                            <Row>
                                <Col span={20}>
                                    <FormItem
                                        label="用户角色"
                                    >
                                        <Spin spinning={roleLoading} indicator={<Icon type="loading"/>}>
                                            {getFieldDecorator('roleId', {
                                                rules: [{required: true, message: '角色不能为空!'}],
                                                initialValue: data.roleId
                                            })(
                                                <Select disabled>
                                                    {
                                                        roleList.map(item => {
                                                            return (<Option key={item.id}
                                                                            value={item.id}>{item.name}</Option>)
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </Spin>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={20}>
                                    <FormItem
                                        label="用户名"
                                    >
                                        {getFieldDecorator('userName', {
                                            rules: [{required: true, message: '请输入用户名'}],
                                            initialValue: data.userName
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={20}>
                                    <FormItem
                                        label="用户编码"
                                    >
                                        {getFieldDecorator('userCode', {
                                            rules: [{required: false}],
                                            initialValue: data.userCode
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={20}>
                                    <FormItem
                                        label="个人电话"
                                    >
                                        {getFieldDecorator('phone', {
                                            rules: [{required: true, message: '请输入个人电话'}],
                                            initialValue: data.phone
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={20}>
                                    <FormItem
                                        label="所属区域"
                                    >
                                        {getFieldDecorator('region', {
                                            rules: [{required: true, message: '请输入所属区域'}],
                                            initialValue: data.region
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={20}>
                                    <FormItem
                                        label="创建时间"
                                    >
                                        {getFieldDecorator('createTime', {
                                            rules: [{required: false}],
                                            initialValue: data.createTime
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <FormItem
                                label="头像"
                            >
                                {getFieldDecorator('assessorys', {
                                    valuePropName: 'fileList',
                                    getValueFromEvent: this.normFile,
                                    rules: [{required: false, message: '头像不能为空!'}],
                                    initialValue: data.assessorys
                                })(
                                    <Upload
                                        headers={{
                                            'X-Auth-Token': sessionStorage.token
                                        }}
                                        name='bannerImage'
                                        action={uploadUrl}
                                        listType="picture-card"
                                        onChange={this.handleChange}
                                    >
                                        {fileList.length === 0 ? <Button>
                                            <Icon type="upload"/> 上传头像
                                        </Button> : null}
                                    </Upload>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center" style={{marginTop: 40}}>
                        <Button type="primary" size='large' style={{width: 120}} htmlType="submit"
                                loading={submitLoading}>保存</Button>
                    </Row>
                </Form>
            </div>
        )
    }
}

DetailForm = Form.create({})(DetailForm);

class PasswordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitLoading: false
        };
    }

    validatePhone = (rule, value, callback) => {
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (value && value !== '' && !reg.test(value)) {
            callback(new Error('手机号格式不正确'));
        } else {
            callback();
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('handleSubmit  param === ', values);
                const val = {
                    phone: values.phoneNumber,
                    password: values.newPassword
                }
                this.setState({
                    submitLoading: true
                });
                ajax.postJSON(updatePasswordUrl, JSON.stringify(val), (data) => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: '修改密码成功！'
                        });
                    } else {
                        message.error(data.backMsg);
                    }

                    this.setState({
                        submitLoading: false
                    });
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {submitLoading} = this.state;
        return (
            <Form onSubmit={this.handleSubmit} autoComplete="off">
                <Row type="flex" justify="center" style={{marginTop: 40}}>
                    <Col {...itemGrid}>
                        <FormItem
                            {...formItemLayout}
                            label="手机号"
                        >
                            {getFieldDecorator('phoneNumber', {
                                initialValue: '',
                                rules: [{required: true, message: '请输入个人电话'}, {
                                    validator: this.validatePhone
                                }],
                            })(
                                <Input autoComplete="off"/>
                            )}
                        </FormItem>

                    </Col>
                    <Col {...itemGrid}>
                        <FormItem
                            {...formItemLayout}
                            label="新密码"
                        >
                            {getFieldDecorator('newPassword', {
                                initialValue: '',
                                rules: [{required: true, message: '请输入新密码'}],
                            })(
                                <Input type='password' autoComplete="off"/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="center" style={{marginTop: 40}}>
                    <Button type="primary" size='large' style={{width: 120}} htmlType="submit"
                            loading={submitLoading}>保存</Button>
                </Row>
            </Form>
        )
    }
}

PasswordForm = Form.create({})(PasswordForm);

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: ''
        };
    }

    componentDidMount = () => {

    }

    render() {
        const id = this.props.params.id;
        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>个人管理</Breadcrumb.Item>
                            <Breadcrumb.Item>个人中心</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>个人中心</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab={<span><Icon type="setting"/>个人信息</span>} key="1">
                                <DetailForm id={id}/>
                            </TabPane>
                            <TabPane tab={<span><Icon type="lock"/>修改密码</span>} key="2">
                                <PasswordForm/>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;