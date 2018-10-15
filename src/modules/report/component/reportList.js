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
    Form, Input
} from 'antd';
import {
    Bar,
    Pie,
} from 'Comps/Charts';
import moment from 'moment';
import find from "lodash/find";
import restUrl from 'RestUrl';
import ajax from 'Utils/ajax';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import Util from "Utils/util";
import {formItemLayout} from "Utils/formItemGrid";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const regionOrderUrl = restUrl.BASE_HOST + 'order/regionOrder';
const exportRegionOrderUrl = restUrl.BASE_HOST + 'order/exportRegionOrder';

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

        this.twoTimesColumns = [
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
            loading: false,
            submitLoading: false,
            dataSource: [],
            totalLineList: [],
            periodData: []
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('handleSubmit  values === ', values);
                const param = {
                    deliverBeginDate: values.deliverDate[0].format("YYYY-MM-DD"),
                    deliverEndDate: values.deliverDate[1].format("YYYY-MM-DD")
                };
                this.setState({
                    submitLoading: true
                });
                ajax.postJSON(regionOrderUrl, JSON.stringify(param), data => {
                    if (data.success) {
                        if (data.backData) {
                            const dataSource = data.backData;
                            const periodData = [];
                            const totalLineList = [];
                            dataSource.map((item, index) => {
                                item.key = item.id;
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

                                if (index !== totalLineList.length - 1) {
                                    periodData.push({
                                        x: item.title,
                                        y: item.totalAmount
                                    });
                                }
                            });
                            console.log('totalLineList == ', totalLineList);
                            console.log('periodData == ', periodData);

                            this.setState({
                                dataSource,
                                totalLineList,
                                periodData
                            });
                        } else {
                            this.setState({
                                dataSource: []
                            });
                        }
                    } else {
                        Message.error('查询列表失败');
                    }
                    this.setState({submitLoading: false});
                });
            }
        });
    }

    exportRegionOrder = () => {
        const values = this.props.form.getFieldsValue();
        if (values.deliverDate) {
            Util.exportExcel({
                url: exportRegionOrderUrl,
                method: 'POST',
                body: JSON.stringify({
                    deliverBeginDate: values.deliverDate[0].format("YYYY-MM-DD"),
                    deliverEndDate: values.deliverDate[1].format("YYYY-MM-DD"),
                }),
                error: function () {
                    Message.error('导出失败，请重试！');
                }
            });
        } else {
            Message.warning('请选择时间区间');
        }
    }

    render() {
        const {getFieldDecorator, getFieldsValue} = this.props.form;
        const {dataSource, loading, submitLoading, periodData} = this.state;

        const values = getFieldsValue();
        let title = '时间段: -- 的订单数据';
        if (values.deliverDate) {
            title = `时间段:${values.deliverDate[0].format("YYYYMMDD")}-${values.deliverDate[1].format("YYYYMMDD")}的订单数据`;
        }

        return (
            <div className="zui-content">
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
                            <TabPane tab={<span><Icon type="clock-circle"/>时间段</span>} key="1">
                                <Row gutter={24}>
                                    <Col span={16}>
                                        <ZZCard>
                                            <Form layout="inline" onSubmit={this.handleSubmit}
                                                  style={{marginBottom: 15}}>
                                                <FormItem>
                                                    {getFieldDecorator('deliverDate', {
                                                        rules: [{required: true, message: '请选择日期区间'}]
                                                    })(
                                                        <RangePicker
                                                            format={dateFormat}
                                                        />
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
                                                loading={loading}
                                            />
                                        </ZZCard>
                                    </Col>
                                    <Col span={8}>
                                        <ZZCard title={'近一个月各区累计总金额柱状图'}>
                                            <Bar height={350} data={periodData}/>
                                        </ZZCard>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab={<span><Icon type="dollar"/>购买多次</span>} key="2">
                                <Row>
                                    <Col span={14}>
                                        <ZZCard>
                                            <Button
                                                icon='download'
                                                onClick={this.outOrderList}
                                                style={{marginBottom: 15}}
                                            >导出表格</Button>
                                            <ZZTable
                                                columns={this.twoTimesColumns}
                                                dataSource={dataSource}
                                                loading={loading}
                                            />
                                        </ZZCard>
                                    </Col>
                                    <Col span={8}>
                                        <ZZCard>
                                            <Button
                                                icon='download'
                                                onClick={this.outOrderList}
                                                style={{marginBottom: 15}}
                                            >导出图表</Button>
                                            <div>是是是</div>
                                        </ZZCard>
                                    </Col>
                                </Row>
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