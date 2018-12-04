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
import _find from "lodash/find";
import restUrl from 'RestUrl';
import axios from 'Utils/axios';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import Util from "Utils/util";

const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY/MM/DD';

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
                    console.log('totalLineList === ', totalLineList);
                    const _cur = _find(totalLineList, {startIndex: index});
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
            loading: false,
            submitLoading: false,
            periodLoading: false,
            dataSource: [],
            totalLineList: []
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
    }

    queryList = (param, endLoading) => {
        axios.post('order/regionOrderNature', JSON.stringify(param)).then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    const dataSource = data.backData;
                    const totalLineList = [];
                    for (let i = 0; i < dataSource.length; i++) {
                        let count = 0;
                        for (let j = i + 1; j < dataSource.length; j++) {
                            if (dataSource[i].region === dataSource[j].region){
                                count++;
                            }
                        }
                        i += count;
                        totalLineList.push({
                            title: dataSource[i].region,
                            index: i
                        });
                    }

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
                const values = this.props.form.getFieldsValue();
                let params = {
                    deliverBeginDate: values.deliverDate[0].format("YYYY-MM-DD"),
                    deliverEndDate: values.deliverDate[1].format("YYYY-MM-DD"),
                    orderNature: values.orderNature
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
        let title = values.deliverDate && `时间段:${values.deliverDate[0].format("YYYYMMDD")}-${values.deliverDate[1].format("YYYYMMDD")}的各区不同性质订单汇总`;

        return (
            <div className="zui-content report">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>报表管理</Breadcrumb.Item>
                            <Breadcrumb.Item>不同性质订单汇总</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>不同性质订单汇总</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Row gutter={24}>
                            <Col>
                                <ZZCard
                                    title={(
                                        <Form layout="inline" onSubmit={this.handleSubmit}>
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
                                            <FormItem label="订单性质">
                                                {getFieldDecorator('orderNature', {
                                                    rules: [{required: true, message: '订单性质不能为空'}]
                                                })(
                                                    <Input/>
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

const ReportDiffNature = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default ReportDiffNature;