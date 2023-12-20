import { Table, Space, Button, Modal, Spin, Input, Select, Tag } from 'antd';
import { useState, useEffect } from 'react';
import ClassApi from '../../api/ClassApi';
import BTLApi from "../../api/BTLApi";

const SearchBTL = () => {
    const columns = [
        {
            title: 'Tên Bài tập lớn',
            dataIndex: 'name',
            key: 'name',
        },

        {
            title: 'Đăng bởi',
            key: 'publisher',
            dataIndex: 'publisher',
            render: (data) => <>
                {data.map(dt => (
                    <Tag key={dt.userId}>{dt.userId}</Tag>
                ))}
            </>
        },
        {
            title: 'Ngày đăng',
            key: 'createdAt',
            dataIndex: 'createdAt',
            render: (dt) => {
                const inputDate = new Date(dt);
                const year = inputDate.getFullYear();
                const month = String(inputDate.getMonth() + 1).padStart(2, '0');
                const day = String(inputDate.getDate()).padStart(2, '0');


                const formattedDateString = `${year}/${month}/${day}`;


                return formattedDateString;
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return <Space>
                    <a href={record.path} target='_blank' className='text-[#1677ff] underline' >Tải về</a>
                </Space>
            }
        },
    ];

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(-1);
    const [searchBTL, setSearchBTL] = useState([]);
    const [keyword, setKeyword] = useState("");
    const fetchClasses = async () => {
        try {
            const res = await ClassApi.getAllClass();
            const categoryOption = [];
            res.forEach(dt => {
                categoryOption.push({
                    value: dt.id,
                    label: dt.name
                })
            })
            setClasses(categoryOption);
        } catch (e) {

        }
    }

    useEffect(() => {
        fetchClasses();
    }, [])

    const search = async () => {
        try {
            const res = await BTLApi.search({ name: keyword, classId: selectedClass })
            setSearchBTL(res);
        }
        catch (e) {

        }
    }
    useEffect(() => {
        search();
    }, [keyword, selectedClass])
    return <div>
        <div className='flex gap-[20px]'>
            <Input className='w-[300px]' placeholder='Nhập tên bài tập lớn' onChange={(e) => { setKeyword(e.target.value) }}></Input>
            <Select options={classes} className='w-[300px]' placeholder='Chọn lớp' onChange={(e) => { setSelectedClass(e) }}></Select>
        </div>
        <div className='mt-[20px]'>
            <Table columns={columns} dataSource={searchBTL} />
        </div>
    </div>
}
export default SearchBTL;