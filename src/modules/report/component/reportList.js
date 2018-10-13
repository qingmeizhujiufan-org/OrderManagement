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
    DatePicker
} from 'antd';
import {
    Bar,
    Pie,
} from 'Comps/Charts';
import find from "lodash/find";
import restUrl from 'RestUrl';
import ajax from 'Utils/ajax';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import Util from "Utils/util";

const TabPane = Tabs.TabPane;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const regionOrderUrl = restUrl.BASE_HOST + 'order/regionOrder';
const exportOrderUrl = restUrl.BASE_HOST + 'order/exportOrder';

class OrderList extends React.Component {
    constructor(props) {
        super(props);

        this.dateColumns = [
            {
                title: '时间段: 9.1-9.10',
                align: 'left',
                children: [{
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
                    title: '货物成本',
                    width: 100,
                    align: 'right',
                    dataIndex: 'costAmount',
                    key: 'costAmount',
                    render: (text, record, index) => (
                        <span>{Util.shiftThousands(text)}</span>
                    )
                }]
            }
        ];

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

        this.threeTimesColumns = [
            {
                title: '一个月内三次购买客户档案',
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
                    dataIndex: 'userName',
                    key: 'userName'
                }, {
                    title: '客户',
                    width: 100,
                    align: 'center',
                    dataIndex: 'receiverName',
                    key: 'receiverName',
                }, {
                    title: '三次总金额',
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
            dataSource: [],
            totalLineList: [],
            params: {
                pageNumber: 1,
                pageSize: 10,
            },
            keyWords: '123',
            searchKey: {},
            periodData: []
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.queryList();
    }

    queryList = () => {
        const param = {
            deliverBeginDate: '2018-09-01',
            deliverEndDate: '2018-10-13'
        };
        this.setState({loading: true});
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
            this.setState({loading: false});
        });
    }

    render() {
        const {dataSource, loading, periodData} = this.state;

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
                                    <Col span={12}>
                                        <ZZCard>
                                            <div style={{marginBottom: 15}}>
                                                <RangePicker
                                                    format={dateFormat}
                                                />
                                                <Button
                                                    type='primary'
                                                    icon='download'
                                                    onClick={this.outOrderList}
                                                    style={{marginLeft: 15}}
                                                >导出表格</Button>
                                            </div>
                                            <ZZTable
                                                columns={this.dateColumns}
                                                dataSource={dataSource}
                                                loading={loading}
                                            />
                                        </ZZCard>
                                    </Col>
                                    <Col span={12}>
                                        <ZZCard title={'近一个月各区累计总金额柱状图'}>
                                            <Bar height={500} data={periodData}/>
                                        </ZZCard>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab={<span><Icon type="dollar"/>购买两次</span>} key="2">
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
                            <TabPane tab={<span><Icon type="pound"/>购买三次</span>} key="3">
                                <Row>
                                    <Col span={14}>
                                        <ZZCard>
                                            <Button
                                                icon='download'
                                                onClick={this.outOrderList}
                                                style={{marginBottom: 15}}
                                            >导出表格</Button>
                                            <ZZTable
                                                columns={this.threeTimesColumns}
                                                dataSource={dataSource}
                                                loading={loading}
                                            />
                                        </ZZCard>
                                    </Col>
                                    <Col span={8}>
                                        <ZZCard>
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

OrderList.contextTypes = {
    router: PropTypes.object
}

export default OrderList;