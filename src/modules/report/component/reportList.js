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
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import find from "lodash/find";
import restUrl from 'RestUrl';
import ajax from 'Utils/ajax';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import Util from "Utils/util";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const regionOrderUrl = restUrl.BASE_HOST + 'order/regionOrder';
const exportRegionOrderUrl = restUrl.BASE_HOST + 'order/exportRegionOrder';
const multiPurchaseOrderUrl = restUrl.BASE_HOST + 'order/multiPurchaseOrder';
const exportMultiPurchaseOrderUrl = restUrl.BASE_HOST + 'order/exportMultiPurchase';

class MultiPurchase extends React.Component {
    constructor(props) {
        super();
        this.columns = [
            {
                title: '区域',
                width: '25%',
                align: 'center',
                dataIndex: 'region',
                key: 'region'
            }, {
                title: '业务员',
                width: '25%',
                align: 'center',
                dataIndex: 'userName',
                key: 'userName'
            }, {
                title: '客户',
                width: '25%',
                align: 'center',
                dataIndex: 'receiverName',
                key: 'receiverName',
            }, {
                title: '购买总金额',
                width: '25%',
                align: 'right',
                dataIndex: 'totalAmount',
                key: 'totalAmount',
                render: (text, record, index) => (
                    <span>{Util.shiftThousands(text)}</span>
                )
            }
        ];

        this.state = {
            loading: true,
            submitLoading: false,
            dataSource: []
        }
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        const values = this.props.form.getFieldsValue();
        this.queryList({
            orderNature: values.orderNature,
            deliverBeginDate: moment().add(0, 'year').month(moment().month()).startOf('month').format("YYYY-MM-DD"),
            deliverEndDate: moment().add(0, 'year').month(moment().month()).endOf('month').format("YYYY-MM-DD")
        }, () => {
            this.setState({loading: false});
        });
    }

    queryList = (param, endLoading) => {
        ajax.postJSON(multiPurchaseOrderUrl, JSON.stringify(param), data => {
            if (data.success) {
                if (data.backData) {
                    const dataSource = data.backData.slice(2);

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
        const values = this.props.form.getFieldsValue();
        if (values.orderNature === undefined || values.orderNature === null || values.orderNature === '') {
            Message.warning('请填写订单性质！');
            return;
        }
        if (values.deliverDate === undefined || values.deliverDate === null || values.deliverDate === '') {
            Message.warning('请选择订单期间！');
            return;
        }

        Util.exportExcel({
            url: exportMultiPurchaseOrderUrl,
            method: 'POST',
            body: JSON.stringify({
                orderNature: values.orderNature,
                deliverBeginDate: values.deliverDate[0].format("YYYY-MM-DD"),
                deliverEndDate: values.deliverDate[1].format("YYYY-MM-DD"),
            }),
            error: data => {
                Message.error(data.backMsg);
            }
        });
    }

    render() {
        const {getFieldDecorator, getFieldsValue} = this.props.form;
        const {dataSource, loading, submitLoading} = this.state;

        const values = getFieldsValue();
        const orderNature = values.orderNature;
        const deliverBeginDate = values.deliverDate ? values.deliverDate[0].format("YYYYMMDD") : '';
        const deliverEndDate = values.deliverDate ? values.deliverDate[1].format("YYYYMMDD") : '';

        let title = `${deliverBeginDate}-${deliverEndDate}${orderNature}的客户档案`;
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
                                                moment().add(0, 'year').month(moment().month()).startOf('month'),
                                                moment().add(0, 'year').month(moment().month()).endOf('month')
                                            ]
                                        })(
                                            <RangePicker format={dateFormat} allowClear={false}/>
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
                                columns={this.columns}
                                dataSource={dataSource}
                                loading={submitLoading}
                            />
                        </ZZCard>
                    </Col>
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

                    return obj;
                }
            }, {
                title: '订单性质',
                width: 100,
                align: 'center',
                dataIndex: 'orderNature',
                key: 'orderNature'
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
            totalLineList: []
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.queryList({
            deliverBeginDate: moment().add(0, 'year').month(moment().month()).startOf('month').format("YYYY-MM-DD"),
            deliverEndDate: moment().add(0, 'year').month(moment().month()).endOf('month').format("YYYY-MM-DD")
        }, () => {
            this.setState({loading: false});
        })
    }

    queryList = (param, endLoading) => {
        ajax.postJSON(regionOrderUrl, JSON.stringify(param), data => {
            if (data.success) {
                if (data.backData) {
                    const dataSource = data.backData;
                    const totalLineList = [];
                    dataSource.map((item, index) => {
                        item.key = index;
                        if (item.orderNature === '合计' || item.region === '总计') {
                            totalLineList.push({
                                title: item.region,
                                index,
                                totalAmount: item.totalAmount
                            });
                        }
                    });
                    totalLineList.map((item, index) => {
                        if (index === 0) {
                            item.startIndex = 0;
                            item.rowspan = item.index + 1;
                        } else {
                            item.startIndex = totalLineList[index - 1].index + 1;
                            item.rowspan = item.index - totalLineList[index - 1].index;
                        }
                    });

                    this.setState({
                        dataSource,
                        totalLineList
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
                this.queryList({
                    deliverBeginDate: values.deliverDate[0].format("YYYY-MM-DD"),
                    deliverEndDate: values.deliverDate[1].format("YYYY-MM-DD")
                }, () => {
                    this.setState({submitLoading: false});
                });
            }
        });
    }

    exportRegionOrder = () => {
        const values = this.props.form.getFieldsValue();
        if (values.deliverDate === undefined || values.deliverDate === null || values.deliverDate === '') {
            Message.warning('请选择订单期间！');
            return;
        }

        Util.exportExcel({
            url: exportRegionOrderUrl,
            method: 'POST',
            body: JSON.stringify({
                deliverBeginDate: values.deliverDate[0].format("YYYY-MM-DD"),
                deliverEndDate: values.deliverDate[1].format("YYYY-MM-DD"),
            }),
            error: data => {
                Message.error(data.backMsg);
            }
        });
    }

    render() {
        const {getFieldDecorator, getFieldsValue} = this.props.form;
        const {dataSource, loading, submitLoading} = this.state;

        const values = getFieldsValue();
        const deliverBeginDate = moment().add(0, 'year').month(moment().month()).startOf('month').format("YYYY-MM-DD");
        const deliverEndDate = moment().add(0, 'year').month(moment().month()).endOf('month').format("YYYY-MM-DD");
        let title = `时间段:${deliverBeginDate}-${deliverEndDate}的订单数据`;
        if (values.deliverDate && values.deliverDate !== '') {
            title = `时间段:${values.deliverDate[0].format("YYYYMMDD")}-${values.deliverDate[1].format("YYYYMMDD")}的订单数据`;
        }

        return (
            <div className="zui-content report">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>报表管理</Breadcrumb.Item>
                            <Breadcrumb.Item>报表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>报表</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Tabs defaultActiveKey="1">
                            <TabPane forceRender tab={<span><Icon type="clock-circle"/>各区订单统计</span>} key="1">
                                <Row gutter={24}>
                                    <Col>
                                        <ZZCard
                                            title={(
                                                <Form layout="inline" onSubmit={this.handleSubmit}>
                                                    <FormItem>
                                                        {getFieldDecorator('deliverDate', {
                                                            rules: [{required: true, message: '请选择日期区间'}],
                                                            initialValue: [
                                                                moment().add(0, 'year').month(moment().month()).startOf('month'),
                                                                moment().add(0, 'year').month(moment().month()).endOf('month')
                                                            ]
                                                        })(
                                                            <RangePicker format={dateFormat} allowClear={false}/>
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
                                                            onClick={this.exportRegionOrder}
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
                            </TabPane>
                            <TabPane forceRender tab={<span><Icon type="dollar"/>不同性质订单统计</span>} key="2">
                                <MultiPurchase/>
                            </TabPane>
                        </Tabs>
                    </div>
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