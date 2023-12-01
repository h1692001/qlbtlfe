import React from 'react';
import { Table, Space,Button } from 'antd';
import { Header } from 'antd/es/layout/layout';

const ManageTeacher = () => {

    const columns = [
        {
            title: 'Tên Bài tập lớn',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Ngành',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Khoa',
            key: 'tags',
            dataIndex: 'tags',

        },
        {
            title: 'Đăng bởi',
            key: 'tags',
            dataIndex: 'tags',

        },
        {
            title: 'Giảng viên phụ trách',
            key: 'tags',
            dataIndex: 'tags',

        },
        {
            title: 'Action',
            key: 'action',
            render: () => {
                return <Space>
                    <p className='text-[#1677ff] underline'>Xem chi tiết</p>
                    <p className='text-[#1677ff] underline'>Xóa</p>
                </Space>
            }
        },
    ];

    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        },
    ];
    return <div >
        <Table columns={columns} dataSource={data} />
    </div>
}

export default ManageTeacher;