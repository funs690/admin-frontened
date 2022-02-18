import React, { Component } from 'react'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'
import { Layout, Divider, Row, Col, Table, Button, Icon, message } from 'antd'
import '@/style/view-style/table.scss'
import { get_entity_page } from '@/api/api'

const columns = [
    {
        title: '序号',
        render: (text, record, index) => `${index + 1}`
    },
    {
        title: '实体名称',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '概念名称',
        dataIndex: 'concept',
        key: 'concept'
    },
    {
        title: '所属知识谱图',
        dataIndex: 'graphName',
        key: 'graphName'
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
    },
    {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime'
    },
    {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <span>
                <Button type='link'>
                    <Icon type='eye' />
                    预览
                </Button>
                <Divider type='vertical' />
                <Button type='link'>
                    <Icon type='edit' />
                    编辑
                </Button>
                <Divider type='vertical' />
                <Button type='link'>
                    <Icon type='delete' />
                    删除
                </Button>
            </span>
        )
    }
]

class EntityTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: {
                pageNo: 1,
                pageSize: 10
            },
            data: {
                list: [],
                total: 0
            }
        }
    }

    componentWillMount() {
        this.getData(this.state.query)
    }

    goSizeChange = (current, pageSize) => {
        this.getData({ pageNo: current, pageSize })
    }

    getData(query) {
        get_entity_page({ params: query })
            .then(res => {
                let { pageNo, pageSize, total, list } = res.data
                this.setState({ data: { list, total }, query: { pageNo, pageSize } })
            })
            .catch(err => {
                message.error('获取实体数据列表失败')
            })
    }

    goToPage = pageNo => {
        //alert(this.state.query.pageSize)
        let { query } = this.state
        this.getData({ pageNo, pageSize: query.pageSize })
    }

    render() {
        return (
            <Table
                columns={columns}
                dataSource={this.state.data.list}
                pagination={{
                    total: this.state.data.total,
                    pageNo: this.state.query.pageNo,
                    pageSize: this.state.query.pageSize,
                    defaultPageSize: this.state.query.pageSize,
                    defaultCurrent: this.state.query.pageNo,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '15', '20', '50'],
                    onShowSizeChange: this.goSizeChange,
                    onChange: this.goToPage,
                    showTotal(total) {
                        return '共 ' + total + ' 条数据'
                    }
                }}
            />
        )
    }
}

const TableView = () => (
    <Layout className='animated fadeIn'>
        <div>
            <CustomBreadcrumb arr={['知识图谱', '实体']}></CustomBreadcrumb>
        </div>

        <Row>
            <Col>
                <div className='base-style'></div>
            </Col>
            <Col>
                <div className='base-style'>
                    <h3 id='basic'>实体信息</h3>
                    <Divider />
                    <EntityTable />
                </div>
            </Col>
        </Row>
    </Layout>
)

export default TableView
