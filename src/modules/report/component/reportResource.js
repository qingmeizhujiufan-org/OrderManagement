import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Icon,
    Breadcrumb,
    Notification,
    Message,
    Button,
    DatePicker,
    Form,
    Input
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import find from "lodash/find";
import restUrl from 'RestUrl';
import axios from 'Utils/axios';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import Util from "Utils/util";

const FormItem = Form.Item;
const {MonthPicker} = DatePicker;
const dateFormat = 'YYYY/MM';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.dateColumns = [
            {
                title: '区域',
                width: '10%',
                align: 'center',
                dataIndex: 'region',
                key: 'region'
            }, {
                title: '第一月',
                width: '20%',
                align: 'right',
                dataIndex: 'fristNum',
                key: 'fristNum',
                render: (text, record, index) => (
                    <span>{index !== 0 ? Util.shiftThousands(text) : text}</span>
                )
            }, {
                title: '上月',
                width: '20%',
                align: 'right',
                dataIndex: 'beforeNum',
                key: 'beforeNum',
                render: (text, record, index) => (
                    <span>{index !== 0 ? Util.shiftThousands(text) : text}</span>
                )
            }, {
                title: '当前月',
                width: '20%',
                align: 'right',
                dataIndex: 'currentNum',
                key: 'currentNum',
                render: (text, record, index) => (
                    <span>{index !== 0 ? Util.shiftThousands(text) : text}</span>
                )
            }, {
                title: '增加粉',
                width: '15%',
                align: 'right',
                dataIndex: 'addNum',
                key: 'addNum',
                render: (text, record, index) => (
                    <span>{index !== 0 ? Util.shiftThousands(text) : text}</span>
                )
            }, {
                title: '总增加粉',
                width: '15%',
                align: 'right',
                dataIndex: 'sumAddNum',
                key: 'sumAddNum',
                render: (text, record, index) => (
                    <span>{index !== 0 ? Util.shiftThousands(text) : text}</span>
                )
            }];


        this.state = {
            loading: true,
            submitLoading: false,
            periodLoading: false,
            dataSource: [],
            totalLineList: []
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        const values = this.props.form.getFieldsValue();
        let params = {
            date: values.date.format("YYYY-MM-DD")
        };

        this.queryList(params, () => {
            this.setState({loading: false});
        })
    }

    queryList = (param, endLoading) => {
        axios.post('user/countRegionOResources', JSON.stringify(param)).then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    const dataSource = data.backData;

                    this.setState({
                        dataSource
                    });
                } else {
                    this.setState({
                        dataSource: []
                    });
                }
            } else {
                this.setState({
                    dataSource: []
                });
                Message.error(data.backMsg);
            }
            endLoading();
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({submitLoading: true});
                const values = this.props.form.getFieldsValue();
                let params = {
                    date: values.date.format("YYYY-MM-DD")
                };

                this.queryList(params, () => {
                    this.setState({submitLoading: false});
                });
            }
        });
    }

    render() {
        const {getFieldDecorator, getFieldsValue} = this.props.form;
        const {dataSource, loading, submitLoading} = this.state;

        const values = getFieldsValue();
        let title = values.date && `${values.date.format("YYYY年M月")}的各区用户拥有资源统计`;

        return (
            <div className="zui-content report-resource">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>报表管理</Breadcrumb.Item>
                            <Breadcrumb.Item>各区用户拥有资源统计</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>各区用户拥有资源统计</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Row gutter={24}>
                            <Col>
                                <ZZCard
                                    title={(
                                        <Form layout="inline" onSubmit={this.handleSubmit}>
                                            <FormItem label="日期">
                                                {getFieldDecorator('date', {
                                                    rules: [{required: true, message: '请选择日期区间'}],
                                                    initialValue: moment().add(0, 'year').month(moment().month()).startOf('month')
                                                })(
                                                    <MonthPicker format={dateFormat} allowClear={false}/>
                                                )}
                                            </FormItem>
                                            <FormItem>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    loading={submitLoading}
                                                >查询数据</Button>
                                            </FormItem>
                                        </Form>
                                    )}
                                    loading={loading}
                                >
                                    <div
                                        style={{
                                            padding: 10,
                                            color: 'rgba(0, 0, 0, 0.85)',
                                            backgroundColor: '#fafafa',
                                            border: '1px solid #e8e8e8',
                                            borderBottom: 'none'
                                        }}
                                    >{title}</div>
                                    <ZZTable
                                        showHeader={false}
                                        columns={this.dateColumns}
                                        dataSource={dataSource}
                                        loading={submitLoading}
                                    />
                                </ZZCard>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

const ReportResource = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default ReportResource;