import React from 'react';
import { Table, Space, Button, Select, Tag } from 'antd';
import { useState, useEffect } from 'react';
import ClassApi from '../../api/ClassApi';
import BTLApi from '../../api/BTLApi';
import { useSelector } from 'react-redux';
import SubjectApi from '../../api/SubjectApi';


const ManageBTLTeacher = () => {

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
            render: (data) => {
                data.map(dt => {
                    return <Tag key={dt.userId}>{dt.userId}</Tag>
                })
            }
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
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (data) => {
                return <p className='font-[600]' style={{ color: data === "PENDING" ? "#1677ff" : data === "APPROVE" ? "#77dd77" : "#d40a00" }}>{data}</p>
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return <Space>
                    <a href={record.path} target='_blank' className='text-[#1677ff] underline' >Tải về</a>
                    {record?.status === "PENDING" && <>
                        <p className='text-[#77dd77] underline'
                            onClick={async () => {
                                try {
                                    const res = await BTLApi.changeStatus({ id: record.id, status: "APPROVE" });
                                    fetchBtl();
                                }
                                catch (e) {

                                }
                            }}>Duyệt</p>
                        <p className='text-[#d40a00] underline'
                            onClick={async () => {
                                try {
                                    const res = await BTLApi.changeStatus({ id: record.id, status: "CANCEL" });
                                    fetchBtl();
                                }
                                catch (e) {

                                }
                            }}>Hủy</p>
                    </>
                    }
                </Space>
            }
        },
    ];

    const columnsCheckdanop = [
        {
            title: 'Tên sinh viên ',
            dataIndex: 'member',
            key: 'member',
            render: (dt) => (<>{dt.fullname}</>)
        },

        {
            title: 'Mã sinh viên',
            key: 'member2',
            dataIndex: 'member',
            render: (dt) => (<>{dt.userId}</>)
        },
        {
            title: 'Trạng thái nộp',
            key: 'isSubmit',
            dataIndex: 'isSubmit',
            render: (dt) => (<>{dt === 1 ? "Đã nộp" : "Chưa nộp"}</>)
        },
        {
            title: 'Ngày nộp',
            key: 'submittedAt',
            dataIndex: 'submittedAt',
            render: (dt) => {
                if (dt) {
                    const inputDate = new Date(dt);
                    const year = inputDate.getFullYear();
                    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
                    const day = String(inputDate.getDate()).padStart(2, '0');
                    const formattedDateString = `${year}/${month}/${day}`;
                    return formattedDateString;
                }
            }
        },

    ];

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState();
    const [nopbai, setNopbai] = useState([]);
    const [tab, setTab] = useState(1);
    const fetchBtl = async () => {
        try {
            const res = await BTLApi.getAllBtlSubject(selectedClass);

            setBtl(res);
        } catch (e) {

        }
    }

    const fetchNopbai = async () => {
        try {
            const res = await ClassApi.checknopbaiSubject(selectedClass);
            setNopbai(res);
        } catch (e) {

        }
    }
    const {userCurrent}=useSelector(state=>state.auth);
    const [btl, setBtl] = useState([]);
    const fetchClasses = async () => {
        try {
            const res = await SubjectApi.getAllSubjectByUser(userCurrent?.id);
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
    return <div >
        <div className='py-[12px] flex gap-[20px]'>
            <Select className='w-[300px]' options={classes} placeholder='Chọn môn học' onChange={(e) => { setSelectedClass(e) }}></Select>
            <Button type='primary' onClick={() => {
                if (selectedClass) {
                    fetchBtl();
                    setTab(1);
                }
            }}>Xem danh sách nộp</Button>
            <Button type='primary' onClick={() => {
                if (selectedClass) {
                    fetchNopbai();
                    setTab(2);
                }
            }}>Xem tình trạng nộp bài</Button>
        </div>

        {tab === 1 && <Table columns={columns} dataSource={btl} />}
        {tab === 2 && <Table columns={columnsCheckdanop} dataSource={nopbai} />}
    </div>
}

export default ManageBTLTeacher;