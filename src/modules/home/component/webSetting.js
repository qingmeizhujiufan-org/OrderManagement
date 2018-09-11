import React from 'react';
import PropTypes from 'prop-types';
import {Upload, Icon, Modal, Row, Col, Breadcrumb, Form, Button, notification, message, Divider, Spin} from 'antd';
import {ZZCard} from 'Comps/zz-antD';
import '../home.less';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 12},
};

const queryHomeCulutreDetailUrl = restUrl.ADDR + 'Server/queryHomeCulutreDetail';
const saveUrl = restUrl.ADDR + 'Server/saveHomeSlider';
const queryMusicUrl = restUrl.ADDR + 'Server/queryMusic';
const saveMusicUrl = restUrl.ADDR + 'Server/saveMusic';

class SliderSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            loading: false,
            submitLoading: false,
            fileList_1: [],
            fileList_2: [],
            fileList_3: [],
            fileList_4: [],
            fileList_5: [],
            fileList_6: [],
            fileList_7: [],
            fileList_8: [],
            fileList_9: []
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.queryHomeCulutreDetail();
    }

    queryHomeCulutreDetail = () => {
        this.setState({
            loading: true
        });
        let param = {};
        ajax.getJSON(queryHomeCulutreDetailUrl, param, data => {
            if (data.success) {
                let backData = data.backData;
                let fileList = {
                    fileList_1: [],
                    fileList_2: [],
                    fileList_3: [],
                    fileList_4: [],
                    fileList_5: [],
                    fileList_6: [],
                    fileList_7: [],
                    fileList_8: [],
                    fileList_9: []
                };
                for (let item in backData) {
                    backData[item].uid = backData[item].id;
                    backData[item].name = backData[item].fileName;
                    backData[item].status = 'done';
                    backData[item].url = restUrl.BASE_HOST + backData[item].filePath;
                    backData[item].response = {
                        data: {
                            id: backData[item].id
                        }
                    };
                    backData[item] = [backData[item]];
                    fileList['fileList_' + item.split('_')[1]] = backData[item];
                    this.setState(fileList);
                }
                console.log('backData == ', backData);
                console.log('state == ', this.state);
                this.setState({
                    data: backData,
                    loading: false
                });
            } else {

            }
        });
    }

    handleChange = ({fileList}, slider) => {
        if (slider === 'slider_1') {
            this.setState({fileList_1: fileList});
        } else if (slider === 'slider_2') {
            this.setState({fileList_2: fileList});
        } else if (slider === 'slider_3') {
            this.setState({fileList_3: fileList});
        } else if (slider === 'slider_4') {
            this.setState({fileList_4: fileList});
        } else if (slider === 'slider_5') {
            this.setState({fileList_5: fileList});
        } else if (slider === 'slider_6') {
            this.setState({fileList_6: fileList});
        } else if (slider === 'slider_7') {
            this.setState({fileList_7: fileList});
        } else if (slider === 'slider_8') {
            this.setState({fileList_8: fileList});
        } else if (slider === 'slider_9') {
            this.setState({fileList_9: fileList});
        }
    }

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
                values.slider_1 = values.slider_1.map(item => {
                    return item.response.data.id;
                }).join(',');
                values.slider_2 = values.slider_2.map(item => {
                    return item.response.data.id;
                }).join(',');
                values.slider_3 = values.slider_3.map(item => {
                    return item.response.data.id;
                }).join(',');
                values.slider_4 = values.slider_4.map(item => {
                    return item.response.data.id;
                }).join(',');
                values.slider_5 = values.slider_5.map(item => {
                    return item.response.data.id;
                }).join(',');
                values.slider_6 = values.slider_6.map(item => {
                    return item.response.data.id;
                }).join(',');
                values.slider_7 = values.slider_7.map(item => {
                    return item.response.data.id;
                }).join(',');
                values.slider_8 = values.slider_8.map(item => {
                    return item.response.data.id;
                }).join(',');
                values.slider_9 = values.slider_9.map(item => {
                    return item.response.data.id;
                }).join(',');

                this.setState({
                    submitLoading: true
                });
                ajax.postJSON(saveUrl, JSON.stringify(values), (data) => {
                    if (data.success) {
                        notification.open({
                            message: '保存成功！',
                            icon: <Icon type="smile-circle" style={{color: '#108ee9'}}/>,
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
        const {
            data,
            loading,
            submitLoading,
            fileList_1,
            fileList_2,
            fileList_3,
            fileList_4,
            fileList_5,
            fileList_6,
            fileList_7,
            fileList_8,
            fileList_9
        } = this.state;
        const {getFieldDecorator, setFieldsValue} = this.props.form;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传</div>
            </div>
        );

        return (
            <Form onSubmit={this.handleSubmit}>
                <Spin spinning={loading}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <FormItem
                                label="第1张"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('slider_1', {
                                    valuePropName: 'fileList',
                                    getValueFromEvent: this.normFile,
                                    rules: [{required: true, message: '图片不能为空!'}],
                                    initialValue: data.slider_1
                                })(
                                    <Upload
                                        action={restUrl.UPLOAD}
                                        listType={'picture-card'}
                                        onChange={e => this.handleChange(e, 'slider_1')}
                                    >
                                        {fileList_1.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                label="第2张"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('slider_2', {
                                    valuePropName: 'fileList',
                                    getValueFromEvent: this.normFile,
                                    rules: [{required: true, message: '图片不能为空!'}],
                                    initialValue: data.slider_2
                                })(
                                    <Upload
                                        action={restUrl.UPLOAD}
                                        listType={'picture-card'}
                                        onChange={e => this.handleChange(e, 'slider_2')}
                                    >
                                        {fileList_2.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                label="第3张"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('slider_3', {
                                    valuePropName: 'fileList',
                                    getValueFromEvent: this.normFile,
                                    rules: [{required: true, message: '图片不能为空!'}],
                                    initialValue: data.slider_3
                                })(
                                    <Upload
                                        action={restUrl.UPLOAD}
                                        listType={'picture-card'}
                                        onChange={e => this.handleChange(e, 'slider_3')}
                                    >
                                        {fileList_3.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <FormItem
                                label="第4张"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('slider_4', {
                                    valuePropName: 'fileList',
                                    getValueFromEvent: this.normFile,
                                    rules: [{required: true, message: '图片不能为空!'}],
                                    initialValue: data.slider_4
                                })(
                                    <Upload
                                        action={restUrl.UPLOAD}
                                        listType={'picture-card'}
                                        onChange={e => this.handleChange(e, 'slider_4')}
                                    >
                                        {fileList_4.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                label="第5张"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('slider_5', {
                                    valuePropName: 'fileList',
                                    getValueFromEvent: this.normFile,
                                    rules: [{required: true, message: '图片不能为空!'}],
                                    initialValue: data.slider_5
                                })(
                                    <Upload
                                        action={restUrl.UPLOAD}
                                        listType={'picture-card'}
                                        onChange={e => this.handleChange(e, 'slider_5')}
                                    >
                                        {fileList_5.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                label="第6张"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('slider_6', {
                                    valuePropName: 'fileList',
                                    getValueFromEvent: this.normFile,
                                    rules: [{required: true, message: '图片不能为空!'}],
                                    initialValue: data.slider_6
                                })(
                                    <Upload
                                        action={restUrl.UPLOAD}
                                        listType={'picture-card'}
                                        onChange={e => this.handleChange(e, 'slider_6')}
                                    >
                                        {fileList_6.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <FormItem
                                label="第7张"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('slider_7', {
                                    valuePropName: 'fileList',
                                    getValueFromEvent: this.normFile,
                                    rules: [{required: true, message: '图片不能为空!'}],
                                    initialValue: data.slider_7
                                })(
                                    <Upload
                                        action={restUrl.UPLOAD}
                                        listType={'picture-card'}
                                        onChange={e => this.handleChange(e, 'slider_7')}
                                    >
                                        {fileList_7.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                label="第8张"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('slider_8', {
                                    valuePropName: 'fileList',
                                    getValueFromEvent: this.normFile,
                                    rules: [{required: true, message: '图片不能为空!'}],
                                    initialValue: data.slider_8
                                })(
                                    <Upload
                                        action={restUrl.UPLOAD}
                                        listType={'picture-card'}
                                        onChange={e => this.handleChange(e, 'slider_8')}
                                    >
                                        {fileList_8.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                label="第9张"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('slider_9', {
                                    valuePropName: 'fileList',
                                    getValueFromEvent: this.normFile,
                                    rules: [{required: true, message: '图片不能为空!'}],
                                    initialValue: data.slider_9
                                })(
                                    <Upload
                                        action={restUrl.UPLOAD}
                                        listType={'picture-card'}
                                        onChange={e => this.handleChange(e, 'slider_9')}
                                    >
                                        {fileList_9.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Divider/>
                    <div style={{textAlign: 'center'}}>
                        <Button size="large" type="primary" htmlType="submit"
                                loading={submitLoading}>提交</Button>
                    </div>
                </Spin>
            </Form>

        );
    }
}

const WrappedSliderSetting = Form.create()(SliderSetting);

class MusicSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            loading: false,
            submitLoading: false,
            fileList: []
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.queryMusicDetail();
    }

    queryMusicDetail = () => {
        this.setState({
            loading: true
        });
        let param = {};
        ajax.getJSON(queryMusicUrl, param, data => {
            if (data.success) {
                let backData = data.music;
                const bgMusic = backData.bgMusic;
                let bgMusicList = bgMusic.fileName ? [{
                    uid: bgMusic.id,
                    name: bgMusic.fileName,
                    status: 'done',
                    url: restUrl.BASE_HOST + bgMusic.filePath,
                    response: {
                        data: {
                            id: bgMusic.id
                        }
                    }
                }] : [];
                backData.bgMusic = bgMusicList;
                this.setState({
                    data: backData,
                    fileList: bgMusicList,
                    loading: false
                });
            } else {

            }
        });
    }

    handleChange = ({fileList}) => {
        this.setState({fileList});
    }

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
                values.bgMusic = values.bgMusic.map(item => {
                    return item.response.data.id;
                }).join(',');

                this.setState({
                    submitLoading: true
                });
                ajax.postJSON(saveMusicUrl, JSON.stringify(values), (data) => {
                    if (data.success) {
                        notification.open({
                            message: '背景音乐保存成功！',
                            icon: <Icon type="smile-circle" style={{color: '#108ee9'}}/>,
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
        const {
            data,
            loading,
            submitLoading,
            fileList
        } = this.state;
        const {getFieldDecorator, setFieldsValue} = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit}>
                <Row gutter={24}>
                    <Col>
                        <FormItem
                            label="背景音乐上传"
                            labelCol={{span: 24}}
                            wrapperCol={{span: 24}}
                        >
                            {getFieldDecorator('bgMusic', {
                                valuePropName: 'fileList',
                                getValueFromEvent: this.normFile,
                                rules: [{required: true, message: '音乐不能为空!'}],
                                initialValue: data.bgMusic
                            })(
                                <Upload
                                    action={restUrl.UPLOAD}
                                    onChange={this.handleChange}
                                >
                                    {fileList.length >= 1 ? null : (<Button>
                                        <Icon type="upload"/> 上传
                                    </Button>)}
                                </Upload>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Divider/>
                <div style={{textAlign: 'center'}}>
                    <Button size="large" type="primary" htmlType="submit"
                            loading={submitLoading}>提交</Button>
                </div>
            </Form>
        );
    }
}

const WrappedMusicSetting = Form.create()(MusicSetting);

class WebSetting extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="zui-content home">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>首页</Breadcrumb.Item>
                            <Breadcrumb.Item>网站设置</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>网站设置</h1>
                </div>
                <div className='pageContent'>
                    <Row gutter={24}>
                        <Col span={18}>
                            <ZZCard title='网站文化展示轮播图设置'>
                                <WrappedSliderSetting/>
                            </ZZCard>
                        </Col>
                        <Col span={6}>
                            <ZZCard title='网站背景音乐设置'>
                                <WrappedMusicSetting/>
                            </ZZCard>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

WebSetting.contextTypes = {
    router: PropTypes.object
}


export default WebSetting;
