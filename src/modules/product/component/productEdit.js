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
    Spin,
    Message,
    Notification,
    InputNumber
} from 'antd';
import axios from "Utils/axios";
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import '../index.less';

const FormItem = Form.Item;
const {TextArea} = Input;
const Option = Select.Option;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            loading: false,
            submitLoading: false
        };
    }

    componentDidMount = () => {
        this.queryDetail();
    }

    queryDetail = () => {
        const id = this.props.params.id;
        const param = {};
        param.id = id;
        this.setState({
            loading: true
        });
        axios.get('product/findbyid', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData;

                this.setState({
                    data: backData
                });
            } else {
                Message.error('产品信息查询失败');
            }
            this.setState({
                loading: false
            });
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.id = this.props.params.id;
                console.log('handleSubmit  param === ', values);
                this.setState({
                    submitLoading: true
                });
                axios.post('product/save', values).then(res => res.data).then(data => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: '产品信息保存成功！'
                        });

                        return this.context.router.push('/frame/product/list');
                    } else {
                        Message.error(data.backMsg);
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
        const {data, loading, submitLoading} = this.state;

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>产品管理</Breadcrumb.Item>
                            <Breadcrumb.Item>产品列表</Breadcrumb.Item>
                            <Breadcrumb.Item>更新产品信息</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>更新产品信息</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Spin spinning={loading} size='large'>
                            <Form onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="所属仓库"
                                        >
                                            {getFieldDecorator('wareHouse', {
                                                rules: [{required: true, message: '请输入所属仓库'}],
                                                initialValue: data.wareHouse
                                            })(
                                                <Select placeholder="请输入所属仓库">
                                                    <Option value={0}>武汉1</Option>
                                                    <Option value={1}>北京</Option>
                                                    <Option value={2}>武汉2</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="产品条码"
                                        >
                                            {getFieldDecorator('barCode', {
                                                rules: [{required: false, message: '请输入产品条码'}],
                                                initialValue: data.barCode
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="产品名称"
                                        >
                                            {getFieldDecorator('name', {
                                                rules: [{required: true, message: '请输入产品名称'}],
                                                initialValue: data.name
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="产品单位"
                                        >
                                            {getFieldDecorator('unit', {
                                                rules: [{required: true, message: '请输入产品单位'}],
                                                initialValue: data.unit
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="成本价格"
                                        >
                                            {getFieldDecorator('costPrice', {
                                                rules: [{required: true, message: '请输入成本价格'}],
                                                initialValue: data.costPrice
                                            })(
                                                <InputNumber
                                                    min={0}
                                                    precision={2}
                                                    step={1}
                                                    style={{width: '100%'}}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>

                                    <Col {...itemGrid}>
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
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="备注"
                                        >
                                            {getFieldDecorator('memo', {
                                                rules: [{required: false, message: '请输入备注'}],
                                                initialValue: data.memo
                                            })(
                                                <TextArea autosize={{minRows: 2, maxRows: 6}}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center" style={{marginTop: 40}}>
                                    <Button type="primary" size='large' style={{width: 120}} htmlType="submit"
                                            loading={submitLoading}>保存</Button>
                                </Row>
                            </Form>
                        </Spin>
                    </div>
                </div>
            </div>
        );
    }
}

const productEdit = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default productEdit;