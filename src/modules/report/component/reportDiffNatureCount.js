import React from 'react';
import PropTypes from 'prop-types';
import {
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
import restUrl from 'RestUrl';
import axios from 'Utils/axios';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import Util from "Utils/util";

const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const exportMultiPurchaseOrderUrl = restUrl.BASE_HOST + 'order/exportMultiPurchase';

class Index extends React.Component {
    constructor(props) {
        super(props);

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
        axios.post('order/multiPurchaseOrder', JSON.stringify(param)).then(res => res.data).then(data => {
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
            <div className="zui-content report">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>报表管理</Breadcrumb.Item>
                            <Breadcrumb.Item>不同性质订单统计</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>不同性质订单统计</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
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