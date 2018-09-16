import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Input,
    Icon,
    Badge,
    Menu,
    Breadcrumb,
    Dropdown,
    Divider,
    notification,
    Spin,
    Tabs,
    message,
    Modal,
    Radio,
    Button
} from 'antd';
import _ from 'lodash';
import restUrl from 'RestUrl';
import ajax from 'Utils/ajax';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
const getLiveListUrl = restUrl.ADDR + 'product/queryListByAdmin';
const reviewUrl = restUrl.ADDR + 'product/review';
const delLiveUrl = restUrl.ADDR + 'product/delete';

class ProductList extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [
            {title: '区域', dataIndex: 'region', key: 'region', fixed: 'left'},
            {title: '业务员姓名', dataIndex: 'user_name', key: 'user_name', fixed: 'left'},
            {title: '订单编号', align: 'center', dataIndex: 'order_code', key: 'order_code', fixed: 'left'},
            {title: '所属仓库', align: 'center', dataIndex: 'warehouse', key: 'warehouse'},
            {title: '订单性质', dataIndex: 'order_nature', key: 'order_nature'},
            {title: '快递类别', align: 'center', dataIndex: 'expressType', key: 'expressType'},
            {title: '寄件电话', dataIndex: 'serder_phone', key: 'serder_phone'},
            {title: '寄件地址', align: 'center', dataIndex: 'sender_addr', key: 'sender_addr'},
            {title: '成单微信号', align: 'center', dataIndex: 'order_wechat_code', key: 'order_wechat_code'},
            {title: '成单日期', align: 'center', dataIndex: 'order_date', key: 'order_date'},
            {title: '发货日期', align: 'center', dataIndex: 'deliver_date', key: 'deliver_date'},
            {title: '收件人', align: 'center', dataIndex: 'receiver_name', key: 'receiver_name'},
            {title: '收件人电话', align: 'center', dataIndex: 'Receiver_phone', key: 'Receiver_phone'},
            {title: '收件人地址', align: 'center', dataIndex: 'receiver_addr', key: 'receiver_addr'},
            {title: '定金', align: 'center', dataIndex: 'deposit_amout', key: 'deposit_amout'},
            {title: '代收金额', align: 'center', dataIndex: 'collection_amout', key: 'collection_amout'},
            {title: '总金额', align: 'center', dataIndex: 'total_amount', key: 'total_amount'},
            {title: '国际件', align: 'center', dataIndex: 'is_foreign_express', key: 'is_foreign_express'},
            {title: '订单状态', align: 'center', dataIndex: 'order_state', key: 'order_state'},
            {title: '是否超过成本', align: 'center', dataIndex: 'is_over_cost', key: 'is_over_cost'},
            {title: '成本', align: 'center', dataIndex: 'cost_amount', key: 'cost_amount'},
            {title: '快递单号', align: 'center', dataIndex: 'express_code', key: 'express_code'},
            {title: '快递状态', align: 'center', dataIndex: 'express_state', key: 'express_state'},
            {title: '广告渠道', align: 'center', dataIndex: 'advert_ channel', key: 'advert_ channel'},
            {title: '进线时间', align: 'center', dataIndex: 'incomline_time', key: 'incomline_time'},
            {title: '备注', align: 'center', dataIndex: 'remark', key: 'remark'},
            {
                title: '操作', key: 'action', align: 'center', fixed: 'right',
                render: (text, record) => (
                    <span>
            <a href="javascript:;">明细</a>
            <Divider type="vertical"/>
            <a href="javascript:;">确认</a>
          </span>
                )
            }
        ];

        this.state = {
            loading: false,
            dataSource: [],
            searchText: '',
            state: 999
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.getList();
    }

    getList = () => {

    }

    addOrder = () => {
        return this.context.router.push('/frame/order/list/add');

    }

    onReview = (record, index, state) => {
        Modal.confirm({
            title: '审核新闻',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                let param = {};
                param.id = record.id;
                param.state = state;
                param.creator = record.creator;
                ajax.postJSON(reviewUrl, JSON.stringify(param), data => {
                    if (data.success) {
                        notification.open({
                            message: '审核成功！',
                            icon: <Icon type="smile-circle" style={{color: '#108ee9'}}/>,
                        });
                        const dataSource = [...this.state.dataSource];
                        dataSource[index].state = state;

                        this.setState({
                            dataSource,
                        });
                    } else {
                        message.warning(data.backMsg);
                    }
                });
            }
        });
    }


    render() {
        const {loading, dataSource, searchText, state} = this.state;
        let n_dataSource = [...dataSource].filter(item => item.newsTitle.indexOf(searchText) > -1);
        if (state !== 999) {
            n_dataSource = n_dataSource.filter(item => item.state === state);
        }
        return (
            <div className="zui-content page-newsList">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>首页</Breadcrumb.Item>
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>订单列表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>订单列表</h1>
                    <div className='search-area'>
                        <Row type='flex' justify="space-around" align="middle">
                            <Col span={8}>
                                <Search
                                    placeholder="搜索订单关键字"
                                    enterButton
                                    size="large"
                                    onSearch={searchText => this.setState({searchText})}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className='pageContent'>
                    <ZZCard>
                        <Button type="primary" icon='plus' onClick={this.addOrder}
                                style={{marginBottom: 15}}>新增订单</Button>

                        <ZZTable
                            dataSource={n_dataSource}
                            columns={this.columns}
                            scroll={{x: 2400}}
                        />
                    </ZZCard>
                </div>
            </div>
        );
    }
}

ProductList.contextTypes = {
    router: PropTypes.object
}

export default ProductList;