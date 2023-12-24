import React from 'react';
import { Table, Space, Button, Select, Tag, Modal, Spin, Input } from 'antd';
import { useState, useEffect } from 'react';
import ClassApi from '../../api/ClassApi';
import BTLApi from '../../api/BTLApi';
import { useSelector } from 'react-redux';
import SubjectApi from '../../api/SubjectApi';
import Swal from 'sweetalert2';

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
                    <a href={record.path} target='_blank' className='text-[#1677ff] underline  cursor-pointer' >Tải về</a>
                    {record?.status === "PENDING" && <>
                        <p className='text-[#77dd77] underline  cursor-pointer'
                            onClick={async () => {
                                try {
                                    const res = await BTLApi.changeStatus({ id: record.id, status: "APPROVE" });
                                    fetchBtl();
                                }
                                catch (e) {

                                }
                            }}>Duyệt</p>
                        <p className='text-[#d40a00] underline  cursor-pointer'
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
    const columnsNhomCheckdanop = [
        {
            title: 'Tên nhóm ',
            dataIndex: 'name',
            key: 'name',
        },

        {
            title: 'Thành viên',
            key: 'member2',
            render: (dt) => dt?.memberGroup?.map(ss => <Tag key={Math.random}>{ss.member.fullname}</Tag>)
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
    const [isLoading, setIsLoading] = useState(false);
    const [selectedClass, setSelectedClass] = useState();
    const [newGroup, setNewGroup] = useState({});
    const [nopbai, setNopbai] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [students, setStudents] = useState([]);
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
    const { userCurrent } = useSelector(state => state.auth);
    const [btl, setBtl] = useState([]);
    const fetchClasses = async () => {
        try {
            const res = await SubjectApi.getAllSubjectByUser(userCurrent?.id);
            setClasses(res);
        } catch (e) {

        }
    }

    useEffect(() => {
        fetchClasses();
    }, [])

    const fetchMember = async () => {
        try {
            const res = await ClassApi.getMembersStudentSubject(selectedClass);
            const categoryOption = [];
            res.forEach(dt => {
                categoryOption.push({
                    value: dt.member.id,
                    label: dt.member.fullname + "-" + dt.member.userId
                })
            })
            setStudents(categoryOption);
        } catch (e) {

        }
    }
    useEffect(() => {
        fetchMember();
    }, [selectedClass])

    const addGroup = async () => {
        try {
            setIsLoading(true);
            const res = await SubjectApi.addGroup(newGroup);
            Swal.fire("Yeah!", "Thêm nhóm bài tập thành công", 'success')
            setIsLoading(false);
            fetchNopbai();
        } catch (e) {
            Swal.fire("Opps!", "Có lỗi xảy ra thử lại sau", 'error')
            setIsLoading(false);
        }
    }
    return <div >
        <div className='py-[12px] flex gap-[20px]'>
            <Select className='w-[300px]' options={classes?.map(cl => ({ value: cl.id, label: cl.name }))} placeholder='Chọn môn học' onChange={(e) => { setSelectedClass(e); setNopbai([]); }}></Select>
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
            <Button type='primary' onClick={() => {
                setShowModal(true);

            }}>Thêm nhóm bài tập</Button>
        </div>

        {tab === 1 && <Table columns={columns} dataSource={btl} />}
        {tab === 2 && <Table columns={classes.find(cl => cl.id === selectedClass).subjectType === "person" ? columnsCheckdanop : columnsNhomCheckdanop} dataSource={nopbai} />}

        <Modal title='Thêm nhóm bài tập' open={showModal} onOk={() => {
            addGroup();
        }} onCancel={() => setShowModal(false)}>
            <Spin spinning={isLoading}>
                <Select className='w-[300px]' options={classes?.filter(cl => { console.log(cl);; return cl.subjectType === "group" })?.map(cl => { return { value: cl.id, label: cl.name+"-"+cl.role } })} placeholder='Chọn môn học' style={{ width: '100%', marginTop: '10px' }} onChange={(e) => { setSelectedClass(e); setNewGroup(prev => ({ ...prev, id: e })) }}></Select>
                <Input style={{ width: '100%', marginTop: '10px' }} placeholder='Tên nhóm' onChange={(e) => { setNewGroup(prev => ({ ...prev, name: e.target.value })) }}></Input>
                <Select
                    mode="multiple"
                    options={students}
                    className='w-full'
                    showSearch
                    placeholder="Chọn thành viên nhóm"
                    style={{ width: '100%', marginTop: '10px' }}
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label.trim().toLowerCase() ?? '').includes(input.trim().toLowerCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    onChange={(e) => { setNewGroup(prev => ({ ...prev, userIds: e })) }}
                ></Select>

            </Spin>
        </Modal>
    </div>
}

export default ManageBTLTeacher;