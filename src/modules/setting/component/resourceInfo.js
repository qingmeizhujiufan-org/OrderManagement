import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
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
import axios from 'Utils/axios';
import remove from 'lodash/remove';
import includes from 'lodash/includes';
import '../index.less';
import {ZZTable} from 'Comps/zz-antD';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
    <EditableContext.Provider value={form}>
        <tr {...props}  />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber style={{width: '100%'}}/>;
        }
        return <Input/>;
    };

    validatePhone = (rule, value, callback) => {
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (value && value !== '' && !reg.test(value)) {
            callback(new Error('手机号格式不正确'));
        } else {
            callback();
        }
    }

    validateNumber = (rule, value, callback) => {
        callback();
    }

    switchValidator = dataIndex => {
        if (dataIndex === 'resourcePhone') return this.validatePhone;
        else if (dataIndex === 'minFans') return this.validateNumber;
        else return null;
    }

    render() {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
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
                                            required: dataIndex === 'minFans' ? false : true,
                                            message: `请输入${title}`
                                        }, {
                                            validator: this.switchValidator(dataIndex),
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
            dataSource: [],
            editingKey: []
        };

        this.columns = [
            {
                title: '序号',
                dataIndex: 'userId',
                align: 'left',
                width: '10%',
                key: 'userId',
                render: (text, record, index) => (
                    <div>{index + 1}</div>
                )
            }, {
                title: '用户电话',
                dataIndex: 'resourcePhone',
                align: 'center',
                width: '25%',
                key: 'resourcePhone',
                editable: true
            }, {
                title: '用户微信',
                dataIndex: 'resourceWechatCode',
                align: 'left',
                width: '25%',
                key: 'resourceWechatCode',
                editable: true
            }, {
                title: '用户粉丝数',
                dataIndex: 'minFans',
                key: 'minFans',
                width: '20%',
                align: 'right',
                editable: true
            }, {
                title: <a><Icon type="setting" style={{fontSize: 18}}/></a>,
                key: 'operation',
                width: '20%',
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
                        >确定</a>
                    )}
                  </EditableContext.Consumer>
                  <Divider type="vertical"/>
                  <Popconfirm
                      title="取消?"
                      onConfirm={() => this.cancel(record)}
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
        axios.get('user/qureyUserORByUserId', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                const backData = data.backData;

                this.setState({
                    dataSource: backData,
                    count: backData.length,
                    editingKey: []
                });
            } else {
                Message.error('用户资源查询失败');
            }
        });
    }

    isEditing = (record) => {
        return includes(this.state.editingKey, record.key);
    };

    edit(key) {
        let newKeys = remove(this.state.editingKey, function (n) {
            return n !== key;
        });
        newKeys.push(key)
        this.setState({editingKey: newKeys});
    }

    cancel = (record) => {
        let dataSource = [...this.state.dataSource];
        let newKeys = remove(this.state.editingKey, function (n) {
            return n !== record.key;
        });

        if (!record.id) {
            dataSource = dataSource.filter(item => item.key !== record.key);
        }

        this.setState({
            dataSource,
            editingKey: newKeys
        });
    };

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.dataSource];
            const index = newData.findIndex(item => key === item.key);
            let newKeys = remove(this.state.editingKey, function (n) {
                return n !== key;
            });

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({dataSource: newData, editingKey: newKeys});
            } else {
                newData.push(row);
                this.setState({dataSource: newData, editingKey: newKeys});
            }
        });
    }

    handleDelete = (text, record, index) => {
        let dataSource = [...this.state.dataSource];
        for (let i = 0; i < dataSource.length; i++) {
            if (dataSource[i].id === record.id) {
                dataSource[i].voState = 3;
                break;
            }
        }
        if (!record.id) {
            dataSource = dataSource.filter(item => item.key !== record.key);
        }

        this.setState({dataSource});
    }

    handleAdd = () => {
        const {count, dataSource, userId, editingKey} = this.state;

        const newData = {
            key: count,
            userId: userId,
            resourcePhone: null,
            resourceWechatCode: null,
            minFans: null,
            voState: 1
        };
        editingKey.push(count);
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
            editingKey: editingKey
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let dataSource = this.state.dataSource;
        if (dataSource.length === 0) {
            Message.warning('请添加资源信息!');
            return;
        }
        dataSource.map(item => {
            if (item.voState && item.voState !== 3) {
                if (item.id) {
                    item.voState = 2;
                } else {
                    item.voState = 1;
                }
            }
        });
        axios.post('user/saveUserOwnResourcesOnly', dataSource).then(res => res.data).then(data => {
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
        const {submitLoading, dataSource} = this.state;
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
                    <h1 className='title'>资源中心</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Row>
                            <Button onClick={this.handleAdd} type="primary" icon='plus' style={{marginBottom: 16}}>
                                添加行
                            </Button>
                            <ZZTable
                                components={components}
                                dataSource={dataSource.filter(item => item.voState !== 3)}
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

const Resource = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default Resource;