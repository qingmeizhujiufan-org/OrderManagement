import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Breadcrumb,
  Button,
  Message,
  Notification,
  Divider,
  Icon,
  Popconfirm
} from 'antd';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
import {ZZTable} from 'Comps/zz-antD';

const resourceSaveUrl = restUrl.BASE_HOST + 'user/saveUserOwnResourcesOnly';
const queryDetailUrl = restUrl.BASE_HOST + 'user/qureyUserORByUserId';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber/>;
    }
    return <Input/>;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const {getFieldDecorator} = form;
          return (
            <td {...restProps}>
              {editing ? (
                  <FormItem style={{margin: 10}}>
                    {getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `请输入${title}!`,
                      }],
                      initialValue: record[dataIndex],
                    })(this.getInput())}
                  </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: sessionStorage.userId,
      count: 0,
      submitLoading: false,
      childrenDetail: [],
      editingKey: ''
    };

    this.columns = [
      {
        title: '序号',
        dataIndex: 'userId',
        align: 'left',
        width: 80,
        key: 'userId',
        render: (text, record, index) => (
          <div>{index + 1}</div>
        )
      }, {
        title: '用户电话',
        dataIndex: 'resourcePhone',
        align: 'center',
        width: 150,
        key: 'resourcePhone',
        editable: true
      }, {
        title: '用户微信',
        dataIndex: 'resourceWechatCode',
        align: 'center',
        width: 150,
        key: 'resourceWechatCode',
        editable: true
      }, {
        title: '用户粉丝',
        dataIndex: 'minFans',
        key: 'minFans',
        width: 150,
        align: 'center',
        editable: true
      }, {
        title: <a><Icon type="setting" style={{fontSize: 18}}/></a>,
        key: 'operation',
        width: 150,
        align: 'center',
        render: (text, record, index) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.key)}
                        style={{marginRight: 8}}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="取消?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <span>
                   <a onClick={() => this.edit(record.key)}>编辑</a>
                   <Divider type="vertical"/>
                  <Popconfirm title="是否删除?" onConfirm={() => this.handleDelete(text, record, index)}>
                  <a href="javascript:;">删除</a>
                  </Popconfirm>
                </span>
              )}
            </div>
          )
        }
      }]
  }

  componentDidMount = () => {
    this.queryDetail();
  }

  queryDetail = () => {
    const id = sessionStorage.userId;
    const param = {};
    param.userId = id;
    this.setState({
      loading: true
    });
    ajax.getJSON(queryDetailUrl, param, data => {
      if (data.success) {
        const childrenDetail = data.backData;

        this.setState({
          childrenDetail: childrenDetail,
          count: childrenDetail.length
        });
      } else {
        Message.error('用户资源查询失败');
      }
    });
  }

  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.childrenDetail];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ childrenDetail: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ childrenDetail: newData, editingKey: '' });
      }
    });
  }

  handleDelete = (text, record, index) => {
    let childrenDetail = [...this.state.childrenDetail];
    for (let i = 0; i < childrenDetail.length; i++) {
      if (childrenDetail[i].id === record.id) {
        childrenDetail[i].voState = 3;
        break;
      }
    }
    childrenDetail = childrenDetail.filter(item => item.id !== undefined);

    this.setState({childrenDetail});
  }

  handleAdd = () => {
    const {count, childrenDetail, userId} = this.state;
    const newData = {
      key: count,
      userId: userId,
      resourcePhone: '',
      resourceWechatCode: '',
      minFans: 1,
    };
    this.setState({
      childrenDetail: [...childrenDetail, newData],
      count: count + 1
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let childrenDetail = this.state.childrenDetail;
    childrenDetail.map(item => {
      if (item.voState && item.voState !== 3) {
        if (item.id) {
          item.voState = 2;
        } else {
          item.voState = 1;
        }
      }
    });
    ajax.postJSON(resourceSaveUrl, JSON.stringify(childrenDetail), (data) => {
      if (data.success) {
        Notification.success({
          message: '提示',
          description: '资源信息保存成功！'
        });
        this.queryDetail();

      } else {
        Message.error(data.backMsg);
      }

      this.setState({
        submitLoading: false
      });
    });
  }


  render() {
    const {submitLoading, childrenDetail} = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'minFans' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <div className="zui-content resourceInfo">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>个人管理</Breadcrumb.Item>
              <Breadcrumb.Item>资源中心</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>个人中心</h1>
        </div>
        <div className='pageContent'>
          <div className='ibox-content'>
            <Row>
              <Button onClick={this.handleAdd} type="primary" icon='plus' style={{marginBottom: 16}}>
                添加
              </Button>
              <ZZTable
                components={components}
                size='small'
                dataSource={childrenDetail.filter(item => item.voState !== 3)}
                columns={columns}
                rowClassName="editable-row"
              />
            </Row>
            <Row type="flex" justify="center" style={{marginTop: 40}}>
              <Button type="primary" size='large' style={{width: 120}} onClick={this.handleSubmit}
                      loading={submitLoading}>提交</Button>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

const resource = Form.create()(Index);

Index.contextTypes = {
  router: PropTypes.object
}

export default resource;