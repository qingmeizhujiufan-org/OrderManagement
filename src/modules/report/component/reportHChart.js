import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Tabs,
    Icon,
    Breadcrumb,
    Notification,
    Message,
    Button,
    DatePicker,
    Form,
    Input
} from 'antd';
import {
    Bar,
    Pie,
} from 'Comps/Charts';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import find from "lodash/find";
import restUrl from 'RestUrl';
import ajax from 'Utils/ajax';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import Util from "Utils/util";

const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const countPeriodOrderUrl = restUrl.BASE_HOST + 'order/countPeriodOrder';
const multiPurchaseOrderUrl = restUrl.BASE_HOST + 'order/multiPurchaseOrder';
const exportMultiPurchaseOrderUrl = restUrl.BASE_HOST + 'order/exportMultiPurchase';

class MultiPurchase extends React.Component {
    constructor(props) {
        super();
        this.columns = [
            {
                title: '一个月内两次购买客户档案',
                align: 'left',
                children: [{
                    title: '区域',
                    width: 100,
                    align: 'center',
                    dataIndex: 'region',
                    key: 'region'
                }, {
                    title: '业务员',
                    width: 100,
                    align: 'center',
                    dataIndex: 'orderNature',
                    key: 'orderNature'
                }, {
                    title: '客户',
                    width: 100,
                    align: 'center',
                    dataIndex: 'count',
                    key: 'count',
                }, {
                    title: '两次总金额',
                    width: 100,
                    align: 'center',
                    dataIndex: 'depositAmout',
                    key: 'depositAmout',
                    render: (text, record, index) => (
                        <span>{Util.shiftThousands(text)}</span>
                    )
                }]
            }
        ];

        this.state = {
            loading: true,
            submitLoading: false,
            chartLoading: false,
            dataSource: [],
            totalLineList: [],
            chartData: []
        }
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        const values = this.props.form.getFieldsValue();
        this.queryList({
            orderNature: values.orderNature,
            deliverBeginDate: moment().add('year', 0).month(moment().month()).startOf('month').format("YYYY-MM-DD"),
            deliverEndDate: moment().add('year', 0).month(moment().month()).endOf('month').format("YYYY-MM-DD")
        }, () => {
            this.setState({loading: false});
        })
        this.queryChartData();
    }

    queryList = (param, endLoading) => {
        ajax.postJSON(multiPurchaseOrderUrl, JSON.stringify(param), data => {
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
                Message.error(data.backMsg);
            }
            endLoading();
        });
    }

    queryChartData = () => {
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('handleSubmit  values === ', values);
                const values = this.props.form.getFieldsValue();

                this.setState({submitLoading: true});
                this.queryList({
                    orderNature: values.orderNature,
                    deliverBeginDate: values.deliverDate[0].format("YYYY-MM-DD"),
                    deliverEndDate: values.deliverDate[1].format("YYYY-MM-DD")
                }, () => {
                    this.setState({submitLoading: false});
                });
            }
        });
    }

    exportMultiPurchaseOrder = () => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.deliverMonth = values.deliverMonth ? values.deliverMonth.format("YYYY-MM") : '';
                Util.exportExcel({
                    url: exportMultiPurchaseOrderUrl,
                    method: 'POST',
                    body: JSON.stringify(values),
                    error: function () {
                        Message.error('客户信息导出失败');
                    }
                });
            }
        })
    }

    render() {
        const {getFieldDecorator, getFieldsValue} = this.props.form;
        const {dataSource, loading, submitLoading, chartLoading, chartData} = this.state;

        const values = getFieldsValue();
        const orderNature = values.orderNature;
        const deliverDate = values.deliverMonth ? values.deliverMonth.format("YYYY-MM") : '';
        let title = `订单性质:${orderNature}的订单数据`;
        return (
            <div>
                <Row gutter={24}>
                    <Col>
                        <ZZCard
                            title={(
                                <Form layout="inline" onSubmit={this.handleSubmit}>
                                    <FormItem label="订单性质">
                                        {getFieldDecorator('orderNature', {
                                            rules: [{required: true, message: '请输入订单性质'}],
                                            initialValue: '热线'

                                        })(
                                            <Input autoComplete="off"/>
                                        )}
                                    </FormItem>
                                    <FormItem label="订单日期">
                                        {getFieldDecorator('deliverDate', {
                                            rules: [{required: true, message: '请选择日期区间'}],
                                            initialValue: [
                                                moment().add('year', 0).month(moment().month()).startOf('month'),
                                                moment().add('year', 0).month(moment().month()).endOf('month')
                                            ]
                                        })(
                                            <RangePicker format={dateFormat}/>
                                        )}
                                    </FormItem>
                                    <FormItem>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={submitLoading}
                                        >查询数据</Button>
                                        <Button
                                            icon='download'
                                            onClick={this.exportMultiPurchaseOrder}
                                            style={{marginLeft: 15}}
                                        >导出表格</Button>
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
                                columns={this.dateColumns}
                                dataSource={dataSource}
                                loading={submitLoading}
                            />
                        </ZZCard>
                    </Col>
                </Row>
                <Row gutter={24} style={{marginTop: 24}}>

                </Row>
            </div>
        )
    }
}

MultiPurchase = Form.create()(MultiPurchase);

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.dateColumns = [
            {
                title: '区域',
                width: 100,
                align: 'center',
                dataIndex: 'region',
                key: 'region',
                render: (value, row, index) => {
                    const obj = {
                        children: value,
                        props: {},
                    };
                    const totalLineList = this.state.totalLineList;

                    const _cur = find(totalLineList, {startIndex: index});
                    if (_cur) {
                        obj.props.rowSpan = _cur.rowspan;
                    } else {
                        obj.props.rowSpan = 0;
                    }

                    // const _total = find(totalLineList, {index: index});
                    // if (_total) {
                    //     obj.props.rowSpan = 0;
                    //     obj.props.colSpan = 0;
                    // } else {
                    //     obj.props.colSpan = 1;
                    // }

                    return obj;
                }
            }, {
                title: '订单性质',
                width: 100,
                align: 'center',
                dataIndex: 'orderNature',
                key: 'orderNature',
                // render: (value, row, index) => {
                //     const obj = {
                //         children: value,
                //         props: {},
                //     };
                //     const totalLineList = this.state.totalLineList;
                //
                //     const _total = find(totalLineList, {index: index});
                //     if (_total) {
                //         obj.props.colSpan = 1;
                //     } else {
                //         obj.props.colSpan = 1;
                //     }
                //
                //     return obj;
                // }
            }, {
                title: '单数',
                width: 100,
                align: 'right',
                dataIndex: 'orderNum',
                key: 'orderNum',
            }, {
                title: '定金',
                width: 100,
                align: 'right',
                dataIndex: 'depositAmout',
                key: 'depositAmout',
                render: (text, record, index) => (
                    <span>{Util.shiftThousands(text)}</span>
                )
            }, {
                title: '代收金额',
                width: 100,
                align: 'right',
                dataIndex: 'collectionAmout',
                key: 'collectionAmout',
                render: (text, record, index) => (
                    <span>{Util.shiftThousands(text)}</span>
                )
            }, {
                title: '总金额',
                width: 100,
                align: 'right',
                dataIndex: 'totalAmount',
                key: 'totalAmount',
                render: (text, record, index) => (
                    <span>{Util.shiftThousands(text)}</span>
                )
            }, {
                title: '签收单数',
                width: 100,
                align: 'right',
                dataIndex: 'signNum',
                key: 'signNum'
            }, {
                title: '签收金额',
                width: 100,
                align: 'right',
                dataIndex: 'signAmount',
                key: 'signAmount',
                render: (text, record, index) => (
                    <span>{Util.shiftThousands(text)}</span>
                )
            }, {
                title: '签收率',
                width: 100,
                align: 'right',
                dataIndex: 'signRate',
                key: 'signRate'
            }, {
                title: '货物成本',
                width: 100,
                align: 'right',
                dataIndex: 'costAmount',
                key: 'costAmount',
                render: (text, record, index) => (
                    <span>{Util.shiftThousands(text)}</span>
                )
            }];


        this.state = {
            loading: true,
            submitLoading: false,
            periodLoading: false,
            dataSource: [],
            totalLineList: [],
            periodData: []
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.queryBarData({
            deliverBeginDate: moment().add('year', 0).month(moment().month()).startOf('month').format("YYYY-MM-DD"),
            deliverEndDate: moment().add('year', 0).month(moment().month()).endOf('month').format("YYYY-MM-DD")
        });
    }

    queryBarData = (param, callback) => {
        this.setState({
            periodLoading: true
        });
        ajax.postJSON(countPeriodOrderUrl, JSON.stringify(param), data => {
            this.setState({periodLoading: false});
            if (data.success) {
                if (data.backData) {
                    const backData = data.backData;
                    const periodData = [];

                    backData.map(item => {
                        periodData.push({
                            x: item.region,
                            y: item.totalAmount
                        });
                    });

                    this.setState({
                        periodData
                    });
                }
            } else {
                Message.error(data.backMsg);
            }
            if(typeof callback === 'function') callback();
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('handleSubmit  values === ', values);
                this.setState({submitLoading: true});
                this.queryBarData({
                    deliverBeginDate: values.deliverDate[0].format("YYYY-MM-DD"),
                    deliverEndDate: values.deliverDate[1].format("YYYY-MM-DD")
                }, () => this.setState({submitLoading: false}));
            }
        });
    }

    render() {
        const {getFieldDecorator, getFieldsValue} = this.props.form;
        const {submitLoading, periodLoading, periodData} = this.state;

        const values = getFieldsValue();
        const deliverBeginDate = moment().add('year', 0).month(moment().month()).startOf('month').format("YYYY-MM-DD");
        const deliverEndDate = moment().add('year', 0).month(moment().month()).endOf('month').format("YYYY-MM-DD");
        let title = `时间段:${deliverBeginDate}-${deliverEndDate}的订单数据`;
        if (values.deliverDate) {
            title = `时间段:${values.deliverDate[0].format("YYYYMMDD")}-${values.deliverDate[1].format("YYYYMMDD")}的订单数据`;
        }

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>报表管理</Breadcrumb.Item>
                            <Breadcrumb.Item>图表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>图表</h1>
                </div>
                <div className='pageContent'>
                    <ZZCard
                        title={(
                            <Form layout="inline" onSubmit={this.handleSubmit}>
                                <FormItem>
                                    {getFieldDecorator('deliverDate', {
                                        rules: [{required: true, message: '请选择日期区间'}],
                                        initialValue: [
                                            moment().add('year', 0).month(moment().month()).startOf('month'),
                                            moment().add('year', 0).month(moment().month()).endOf('month')
                                        ]
                                    })(
                                        <RangePicker format={dateFormat}/>
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
                    >
                        <Row gutter={24}>
                            <Col span={17}>
                                <ZZCard title={'各区累计总金额柱状图'} loading={periodLoading}>
                                    <Bar height={350} data={periodData} color='#5578DC'/>
                                </ZZCard>
                            </Col>
                            <Col span={7}>
                                <ZZCard title={'各区累计总金额扇形图'} loading={periodLoading}>
                                    <Pie
                                        hasLegend
                                        subTitle="总计"
                                        total={periodData.reduce((total, now) => total + now.y, 0)}
                                        data={periodData}
                                        height={344}
                                        lineWidth={4}
                                        colors={['#FAD337', '#4DCA73', '#5CDECF', '#39A0FF', '#9C91DB', '#425088', '#E9A574']}
                                    />
                                </ZZCard>
                            </Col>
                        </Row>
                    </ZZCard>
                </div>
            </div>
        );
    }
}

const ReportList = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default ReportList;