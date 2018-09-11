import React from 'react';
import { Layout } from 'antd';
import './zzFooter.less';

const { Footer } = Layout;

class ZZFooter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Footer style={{ textAlign: 'center' }}>
        admin ©2018 Created by ZZ
      </Footer>
    );
  }
}

export default ZZFooter;
