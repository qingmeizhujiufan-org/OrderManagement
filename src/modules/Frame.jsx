import React from 'react';
import {Layout, LocaleProvider} from 'antd';
import ZZHeader from '../containers/zzHeader';
import ZZLeftSide from '../containers/zzLeftSide';
import ZZFooter from 'Comps/zzFooter/zzFooter';
import {Scrollbars} from 'react-custom-scrollbars';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

const {Content} = Layout;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storageChange: 1
        };
    }

    collapse = (broken) => {
        console.log("broken ===",broken)
    }

    render() {
        const breakpoint  ={
          xs: '480px',
          sm: '576px',
          md: '768px',
          lg: '992px',
          xl: '1200px',
          xxl: '1600px',
        }
        return (
            <LocaleProvider locale={zh_CN}>
                <Layout>
                    <ZZLeftSide storageChange={this.state.storageChange}/>
                    <Layout>
                        <ZZHeader/>
                        <Content>
                            <Scrollbars style={{height: 'calc(100vh - 64px)'}}>
                                {this.props.children}
                                <ZZFooter/>
                            </Scrollbars>
                        </Content>
                    </Layout>
                </Layout>
            </LocaleProvider>
        );
    }
}