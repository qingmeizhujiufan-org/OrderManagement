import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Row,
    Col,
    Icon,
    Input,
    Breadcrumb,
    Button,
    Upload,
    Select,
    notification,
    Spin
} from 'antd';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
import ZZEditor from '../../../components/zzEditor/zzEditor';

import {EditorState, convertToRaw, ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const FormItem = Form.Item;
const Option = Select.Option;
const queryListUrl = restUrl.BASE_HOST + 'city/queryList';
const queryDetailUrl = restUrl.BASE_HOST + 'product/findbyid';
const saveLiveUrl = restUrl.BASE_HOST + 'product/save';

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 12},
};

class ProductEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: sessionStorage.type,
            data: {},
            fileList: [],
            cityList: [],
            editorState: EditorState.createEmpty(),
            loading: false,
            cityLoading: false
        };
    }

    componentDidMount = () => {
        this.getList();
        this.queryDetail();
    }

    getList = () => {
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

    queryDetail = () => {
        this.setState({
            loading: true
        });
        let param = {};
        param.id = this.props.params.id;
        ajax.getJSON(queryDetailUrl, param, data => {
            if (data.success) {
                let backData = data.backData;
                if (backData.newsContent && backData.newsContent !== '') {
                    backData.newsContent = draftToHtml(JSON.parse(backData.newsContent));
                    const contentBlock = htmlToDraft(backData.newsContent);
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    const editorState = EditorState.createWithContent(contentState);

                    this.setState({
                        editorState
                    });
                }
                const newsCover = backData.newsCover;
                let photoList = [{
                    uid: newsCover.id,
                    name: newsCover.fileName,
                    status: 'done',
                    url: restUrl.BASE_HOST + newsCover.filePath,
                    response: {
                        data: {
                            id: newsCover.id
                        }
                    }
                }];

                backData.newsCover = photoList;

                this.setState({
                    data: backData,
                    fileList: photoList,
                    loading: false
                });
            } else {

            }
        });
    }

    handleChange = ({fileList}) => {
        this.setState({
            fileList
        });
    }

    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    saveEditorState = (editorState) => {
        this.setState({
            editorState
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.id = this.props.params.id;
                values.newsCover = values.newsCover.map(item => {
                    return item.response.data.id;
                }).join(',');
                values.newsContent = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
                console.log('handleSubmit  param === ', values);

                ajax.postJSON(saveLiveUrl, JSON.stringify(values), (data) => {
                    if (data.success) {
                        notification.open({
                            message: '修改新闻信息成功！',
                            icon: <Icon type="smile-circle" style={{color: '#108ee9'}}/>,
                        });
                    }
                });
            }
        });
    }

    render() {
        let {type, data, fileList, editorState, loading, cityList, cityLoading} = this.state;
        const {getFieldDecorator, setFieldsValue} = this.props.form;

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>首页</Breadcrumb.Item>
                            <Breadcrumb.Item>新闻资讯</Breadcrumb.Item>
                            <Breadcrumb.Item>新闻列表</Breadcrumb.Item>
                            <Breadcrumb.Item>更新新闻</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>修改新闻信息</h1>
                </div>
                <div className='pageContent'>
                    <div className="ibox-content">
                        <Spin spinning={loading} size="large">
                            <Form onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            label="封面图片"
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('newsCover', {
                                                valuePropName: 'fileList',
                                                getValueFromEvent: this.normFile,
                                                rules: [{required: true, message: '封面图片不能为空!'}],
                                                initialValue: data.newsCover
                                            })(
                                                <Upload
                                                    action={restUrl.UPLOAD}
                                                    listType={'picture'}
                                                    className='upload-list-inline'
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
                                            label="城市选择"
                                            {...formItemLayout}
                                        >
                                            <Spin spinning={cityLoading} indicator={<Icon type="loading"/>}>
                                                {getFieldDecorator('cityId', {
                                                    rules: [{required: true, message: '城市不能为空!'}],
                                                    initialValue: data.cityId
                                                })(
                                                    <Select
                                                        disabled={type !== '1'}
                                                    >
                                                        {
                                                            cityList.map(item => {
                                                                return (<Option key={item.id} value={item.id}>{item.cityName}</Option>)
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
                                            label="名称"
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('newsTitle', {
                                                rules: [{required: true, message: '名称不能为空!'}],
                                                initialValue: data.newsTitle
                                            })(
                                                <Input placeholder=""/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            label="说明"
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('newsBrief', {
                                                initialValue: data.newsBrief
                                            })(
                                                <Input.TextArea autosize={{minRows: 4, maxRows: 6}}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <ZZEditor editorState={editorState} saveEditorState={this.saveEditorState}/>
                                    </Col>
                                </Row>
                                <div className='toolbar'>
                                    <div className='pull-right'>
                                        <Button
                                            type="primary"
                                            size={'large'}
                                            htmlType="submit"
                                            disabled={type === '1' ? false : !!data.state}
                                        >确认</Button>
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

const WrappedEditLive = Form.create()(ProductEdit);
ProductEdit.contextTypes = {
    router: PropTypes.object
}

export default WrappedEditLive;
