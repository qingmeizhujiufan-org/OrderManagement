import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    List,
    Breadcrumb,
    Button,
    Icon,
    Message,
    Notification
} from 'antd';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';

const queryListUrl = restUrl.BASE_HOST + 'message/queryList';

class messageList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            initLoading: true,
            loading: false,
            data: [],
            list: [],
        };
    }

    componentDidMount() {
        this.getData((res) => {
            this.setState({
                initLoading: false,
                data: res.backData,
                list: res.backData,
            });
        });
    }

    getData = (callback) => {
        const id = sessionStorage.userId;
        const param = {};
        param.receiverId = id;
        ajax.getJSON(queryListUrl, {}, data => {
            if (data.success) {
                callback(data)
            } else {
                Message.error('消息列表查询失败');
            }
        });
    }

    onLoadMore = () => {
        this.setState({
            loading: true,
            list: this.state.data.concat([...new Array(count)].map(() => ({loading: true, name: {}}))),
        });
        this.getData((res) => {
            const data = this.state.data.concat(res.backData);
            this.setState({
                data,
                list: data,
                loading: false,
            }, () => {
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    render() {

        const {initLoading, loading, list} = this.state;
        const loadMore = !initLoading && !loading ? (
            <div style={{textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px'}}>
                <Button onClick={this.onLoadMore}>loading more</Button>
            </div>
        ) : null;

        const IconText = ({type, text}) => (
            <span>
        <Icon type={type} style={{marginRight: 8}}/>
                {text}
      </span>
        );

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>个人设置</Breadcrumb.Item>
                            <Breadcrumb.Item>个人中心</Breadcrumb.Item>
                            <Breadcrumb.Item>消息中心</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>消息中心</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Row>
                            <Col span={10}>
                                <List
                                    className="demo-loadmore-list"
                                    loading={initLoading}
                                    itemLayout="vertical"
                                    loadMore={loadMore}
                                    dataSource={list}
                                    renderItem={item => (
                                        <List.Item
                                            actions={[<IconText type="like-o" text="156"/>,
                                                <IconText type="message" text="2"/>]}>
                                            <Skeleton avatar title={false} loading={item.loading} active>
                                                <List.Item.Meta
                                                    title={item.msgTitle}
                                                />
                                                <div>{item.msgBody}</div>
                                            </Skeleton>
                                        </List.Item>
                                    )}
                                />
                            </Col>
                            <Col span={14}>22</Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}


messageList.contextTypes = {
    router: PropTypes.object
}

export default messageList;