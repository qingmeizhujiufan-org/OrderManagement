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
    notification,
    Message,
    Notification
} from 'antd';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';

const userSaveUrl = restUrl.BASE_HOST + 'user/save';
const uploadUrl = restUrl.BASE_HOST + 'assessory/upload';
const queryRoleUrl = restUrl.BASE_HOST + 'role/queryList';
const queryDetailUrl = restUrl.BASE_HOST + 'user/qureyOneUser';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 12},
};

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            fileList: [],
            confirmDirty: false,
            roleList: [],
            loading: false,
            roleLoading: false,
            submitLoading: false
        };
    }

    componentDidMount = () => {
        this.queryDetail();
        this.queryRole();
    }

    queryDetail = () => {
        const id = this.props.params.id;
        const param = {};
        param.id = id;
        this.setState({
            loading: true
        });
        ajax.getJSON(queryDetailUrl, param, data => {
            if (data.success) {
                this.setState({
                    data: data.backData,
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

    handleChange = ({fileList}) => this.setState({fileList})

    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.id = this.props.params.id;
                values.assessorys = values.assessorys.map(item => {
                    return item.response.backData;
                });
                console.log('handleSubmit  param === ', values);
                this.setState({
                    submitLoading: true
                });
                ajax.postJSON(userSaveUrl, JSON.stringify(values), (data) => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: '用户信息保存成功！'
                        });

                        return this.context.router.push('/frame/user/list');
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
        const {data, fileList, roleList, loading, roleLoading, submitLoading} = this.state;

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>首页</Breadcrumb.Item>
                            <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                            <Breadcrumb.Item>用户列表</Breadcrumb.Item>
                            <Breadcrumb.Item>更新用户信息</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>更新用户信息</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Spin spinning={loading}>
                            <Form onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            label="头像"
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('assessorys', {
                                                valuePropName: 'fileList',
                                                getValueFromEvent: this.normFile,
                                                rules: [{required: false, message: '头像不能为空!'}],
                                            })(
                                                <Upload
                                                    name='bannerImage'
                                                    action={uploadUrl}
                                                    listType={'picture'}
                                                    onChange={this.handleChange}
                                                >
                                                    {fileList.length >= 1 ? null :
                                                        <Button><Icon type="upload"/> 上传</Button>}
                                                </Upload>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            label="角色选择"
                                            {...formItemLayout}
                                        >
                                            <Spin spinning={roleLoading} indicator={<Icon type="loading"/>}>
                                                {getFieldDecorator('roleId', {
                                                    rules: [{required: true, message: '角色不能为空!'}],
                                                    initialValue: data.roleId
                                                })(
                                                    <Select>
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
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="用户编码"
                                        >
                                            {getFieldDecorator('userCode', {
                                                rules: [{required: true, message: '请输入用户编码'}],
                                                initialValue: data.userCode
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="用户名"
                                        >
                                            {getFieldDecorator('userName', {
                                                rules: [{required: true, message: '请输入用户名'}],
                                                initialValue: data.userName
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="个人电话"
                                        >
                                            {getFieldDecorator('phone', {
                                                rules: [{required: true, message: '请输入个人电话'}],
                                                initialValue: data.phone
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="所属区域"
                                        >
                                            {getFieldDecorator('region', {
                                                rules: [{required: true, message: '请输入所属区域'}],
                                                initialValue: data.region
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
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
                                <div className='toolbar'>
                                    <div className='pull-right'>
                                        <Button type="primary" size='large' htmlType="submit"
                                                loading={submitLoading}>保存</Button>
                                    </div>
                                </div>
                            </Form>
                        </Spin>
                    </div>
                </div>
            </div>
        );
    }
}

const userEdit = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default userEdit;