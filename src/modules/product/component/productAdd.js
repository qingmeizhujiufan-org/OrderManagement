import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Form, Input, Select, Breadcrumb, Button, Upload, Icon, Spin, Notification, Message} from 'antd';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
import {message} from "antd/lib/index";

const productAddUrl = restUrl.BASE_HOST + 'product/save';
const uploadUrl = restUrl.BASE_HOST + 'assessory/upload';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 12},
};

class Index extends React.Component {
    state = {
        confirmDirty: false,
        fileList: [],
        submitLoadingsubmitLoading: false,

    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                delete values.picSrc;
                this.setState({
                    submitLoading: true
                });

                console.log('handleSubmit  param === ', values);
                this.setState({
                    submitLoading: true
                });
                ajax.postJSON(productAddUrl, JSON.stringify(values), data => {
                    if (data.success) {
                        data = data.backData;
                        data.map(function (item, index) {
                            item.key = index;
                        });
                        this.setState({
                            dataSource: data,
                            loading: false
                        });
                    } else {
                        this.setState({
                            loading: false
                        });
                        message.error(data.backMsg);
                    }
                });
            }
        });
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const {fileList, submitLoading} = this.state;

        return (

            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>首页</Breadcrumb.Item>
                            <Breadcrumb.Item>产品管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增产品</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>新增产品</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="产品图片"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('picSrc', {
                                            valuePropName: 'fileList',
                                            getValueFromEvent: this.normFile,
                                            rules: [{required: false, message: '图片不能为空!'}],
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
                                        {...formItemLayout}
                                        label="所属仓库"
                                    >
                                        {getFieldDecorator('wareHouse', {
                                            rules: [{
                                                required: true, message: '请输入所属仓库',
                                            }],
                                        })(
                                            <Select placeholder="请输入所属仓库">
                                                <Option value="0">武汉</Option>
                                                <Option value="1">北京</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="产品名称"
                                    >
                                        {getFieldDecorator('name', {
                                            rules: [{
                                                required: true, message: '请输入产品名称',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="产品单位"
                                    >
                                        {getFieldDecorator('unit', {
                                            rules: [{
                                                required: true, message: '请输入产品单位',
                                            }],
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
                                        label="成本价格"
                                    >
                                        {getFieldDecorator('costPrice', {
                                            rules: [{
                                                required: true, message: '请输入成本价格',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="备注"
                                    >
                                        {getFieldDecorator('memo', {
                                            rules: [{
                                                required: true, message: '请输入备注',
                                            }],
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
                                        label="产品条码"
                                    >
                                        {getFieldDecorator('barCode', {
                                            rules: [{required: true, message: '请输入产品条码'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <div className='toolbar'>
                                <div className='pull-right'>
                                    <Button type="primary" size='large' htmlType="submit"
                                            loading={submitLoading}>提交</Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

const productAdd = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default productAdd;