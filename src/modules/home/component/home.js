import React from 'react';
import {Layout, Menu, Icon, Row, Col, Steps, Carousel, Progress, Timeline, Card, Radio, Spin} from 'antd';
import {ZZCard} from 'Comps/zz-antD';
import {
    Bar,
    Pie,
} from 'Comps/Charts';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../home.less';

const Step = Steps.Step;
const {Meta} = Card;

const tabList = [{
    key: 'culture',
    tab: '文化',
}, {
    key: 'art',
    tab: '艺术品',
}, {
    key: 'product',
    tab: '新闻',
}];

const getWebTotalUrl = restUrl.ADDR + 'Server/getWebTotal';
const getNewlyUrl = restUrl.ADDR + 'user/getNewlyRegisterUserData';
const countCANUrl = restUrl.ADDR + 'Server/countCAN';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            webTotal: {},
            totalLoading: false,
            type: 'week',
            userData: [],
            userLoading: false,
            canTotal: [],
            canLoading: false,
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.getWebTotal();
        this.getNewlyData();
        this.countCAN();
    }

    getWebTotal = () => {
        this.setState({totalLoading: true});
        ajax.getJSON(getWebTotalUrl, null, data => {
           if(data.success){
               this.setState({
                   webTotal: data.backData,
                   totalLoading: false
               });
           } else {

           }
        });
    }

    getNewlyData = () => {
        let param = {};
        param.type = this.state.type;
        this.setState({userLoading: true});
        ajax.getJSON(getNewlyUrl, param, data => {
            if(data.success){
                data = data.backData;
                const chartData = [];
                data.map(item => {
                    chartData.push({
                        x: item.countDate,
                        y: item.num
                    });
                });
                this.setState({
                    userData: chartData
                });
            }else {
                message.error(data.backMsg);
            }
            this.setState({userLoading: false});
        });
    }

    countCAN = () => {
        this.setState({canLoading: true});
        ajax.getJSON(countCANUrl, null, data => {
            if(data.success){
                const backData = data.backData;
                const canTotal = [{
                    x: '文化',
                    y: backData.cultureTotal
                }, {
                    x: '艺术品',
                    y: backData.artTotal
                }, {
                    x: '新闻',
                    y: backData.newsTotal
                }, {
                    x: '美图',
                    y: backData.tasteTotal
                }, {
                    x: '视频',
                    y: backData.videoTotal
                }];
                this.setState({
                    canTotal,
                    canLoading: false
                });
            } else {

            }
        });
    }

    changeType = e => {
        console.log('e === ', e.target);
        if(this.state.type === e.target.value) return;
        this.setState({type: e.target.value}, () => {
            this.getNewlyData();
        });
    }

    render() {
        const {data, webTotal, totalLoading, type, userData, userLoading, canTotal, canLoading} = this.state;
        // const pieTotal = canTotal.length === 4 ? (canTotal[0].y + canTotal[1].y + canTotal[2].y + canTotal[3].y) : null;

        return (
            <div className="zui-content home">
                <div className='pageContent'>
                    <Row gutter={24} className="base-info">
                        <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                            <ZZCard loading={totalLoading}>
                                <Row type="flex" align="middle">
                                    <Col><Icon type="flag" className="icon"
                                               style={{backgroundColor: '#2dcb73', color: '#fff'}}/></Col>
                                    <Col>
                                        <h3>{webTotal.cultureTotal}</h3>
                                        <span>文化总数</span>
                                    </Col>
                                </Row>
                            </ZZCard>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                            <ZZCard loading={totalLoading}>
                                <Row type="flex" align="middle">
                                    <Col><Icon type="cloud" className="icon"
                                               style={{backgroundColor: '#1890ff', color: '#fff'}}/></Col>
                                    <Col>
                                        <h3>{webTotal.artTotal}</h3>
                                        <span>艺术品总数</span>
                                    </Col>
                                </Row>
                            </ZZCard>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                            <ZZCard loading={totalLoading}>
                                <Row type="flex" align="middle">
                                    <Col><Icon type="picture" className="icon"
                                               style={{backgroundColor: '#ff604f', color: '#fff'}}/></Col>
                                    <Col>
                                        <h3>{webTotal.tasteTotal}</h3>
                                        <span>美图总数</span>
                                    </Col>
                                </Row>
                            </ZZCard>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                            <ZZCard loading={totalLoading}>
                                <Row type="flex" align="middle">
                                    <Col><Icon type="youtube" className="icon"
                                               style={{backgroundColor: '#faad14', color: '#fff'}}/></Col>
                                    <Col>
                                        <h3>{webTotal.videoTotal}</h3>
                                        <span>视频总数</span>
                                    </Col>
                                </Row>
                            </ZZCard>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={18}>
                            <ZZCard
                                title="最近注册用户统计"
                                extra={(
                                    <Radio.Group defaultValue="week" buttonStyle="solid" onChange={e => this.changeType(e)}>
                                        <Radio.Button value="threeday">最近三天</Radio.Button>
                                        <Radio.Button value="week">最近一周</Radio.Button>
                                        <Radio.Button value="month">最近一个月</Radio.Button>
                                    </Radio.Group>
                                )}
                                loading={userLoading}
                            >
                                <Bar height={418} data={userData} />
                            </ZZCard>
                        </Col>
                        <Col span={6}>
                            <ZZCard
                                title={'浏览占比'}
                                loading={canLoading}
                            >
                                <Pie
                                    hasLegend
                                    subTitle="总体浏览量"
                                    total={canTotal.reduce((pre, now) => now.y + pre, 0)}
                                    data={canTotal}
                                    height={248}
                                    lineWidth={4}
                                />
                            </ZZCard>
                        </Col>
                    </Row>
                    {/*<Row style={{marginTop: 24}}>*/}
                        {/*<Col>*/}
                            {/*<ZZCard*/}
                                {/*tabList={tabList}*/}
                                {/*activeTabKey={'culture'}*/}
                                {/*onTabChange={(key) => { this.onTabChange(key, 'noTitleKey'); }}*/}
                            {/*>*/}
                                {/*<h1>fafads</h1>*/}
                            {/*</ZZCard>*/}
                        {/*</Col>*/}
                    {/*</Row>*/}
                </div>
            </div>
        );
    }
}

// Index.contextTypes = {
//     router: React.PropTypes.object
// }

export default Index;
