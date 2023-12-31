import React from 'react';
import { Table, Space, Button, Modal, Spin, Input, Select, Tag } from 'antd';
import UserApi from '../../api/UserApi';
import { useEffect, useState } from 'react';
import ClassApi from '../../api/ClassApi';
import BTLApi from "../../api/BTLApi"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import SubjectApi from '../../api/SubjectApi';

const ManageBTLStore = () => {

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
                    <Tag key={Math.random()}>{dt.userId}</Tag>
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
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (data) => {
                return <p className='font-[600]' style={{ color: data === "PENDING" ? "#1677ff" : data === "APPROVE" ? "#77dd77" : "#d40a00" }}>{data}</p>
            }
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => {
                return <Space>
                    <a href={record.path} target='_blank' className='text-[#1677ff] underline  cursor-pointer' >Tải về</a>
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
            render: (dt) => dt?.memberGroup?.map(ss => <Tag key={Math.random()}>{ss.member.fullname}</Tag>)
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
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [file, setFile] = useState();
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState();
    const [btlName, setBtlName] = useState("");
    const [nopbai, setNopbai] = useState([]);
    const [tab, setTab] = useState(1);
    const [groups, setGroups] = useState([]);
    const [selectedClass2, setSelectedCLass2] = useState();
    const fetchNopbai = async () => {
        try {
            const res = await ClassApi.checknopbaiSubject(selectedClass);
            setNopbai(res);
        } catch (e) {

        }
    }
    const fetchMember = async () => {
        try {
            const res = await ClassApi.getMembersStudentSubject(selectedClass);
            const categoryOption = [];
            res.forEach(dt => {
                categoryOption.push({
                    value: dt.member.id,
                    label: dt.member.fullname
                })
            })
            setStudents(categoryOption);
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
    const fetchBtl = async () => {
        try {
            const res = await BTLApi.getAllBtlSubject(selectedClass);

            setBtl(res);
        } catch (e) {

        }
    }

    useEffect(() => {
        fetchMember();
    }, [selectedClass])
    useEffect(() => {
        fetchClasses();
    }, [])

    const uploadBTL = async () => {
        try {
            setIsLoading(true);
            const formDt = new FormData();
            formDt.append("file", file);
            formDt.append("uploader", userCurrent?.id);
            formDt.append("classV", selectedClass2.id);
            formDt.append("name", btlName);
            const res = await BTLApi.uploadBTL(formDt);
            setIsLoading(false);
            fetchBtl();
            Swal.fire("Thành công", "Đã nộp bài tập", "success")

        }
        catch (e) {
            setIsLoading(false);

        }
    }
    
    return <div >
        <div className='py-[12px] flex gap-[20px]'>
            <Select className='w-[300px]' options={classes?.map(cl => ({ value: cl.id, label: cl.name }))} placeholder='Chọn môn' onChange={(e) => { setSelectedClass(e); setNopbai([]); }}></Select>
            <Button type='primary' onClick={() => {
                if (selectedClass) {
                    fetchBtl();
                    setTab(1);
                }
            }}>Xem danh sách bài tập đã nộp</Button>
            <Button type='primary' onClick={() => { setIsModalCreateOpen(true) }}>Nộp bài tập</Button>
            <Button type='primary' onClick={() => {
                if (selectedClass) {
                    fetchNopbai();
                    setTab(2);
                }
            }}>Xem tình trạng nộp bài</Button>
        </div>
        {tab === 1 && <Table columns={columns} dataSource={btl} />}
        {tab === 2 && <Table columns={classes.find(cl => cl.id === selectedClass).subjectType === "person" ? columnsCheckdanop : columnsNhomCheckdanop} dataSource={nopbai} />}
        <Modal title='Nộp bài tập' open={isModalCreateOpen} onOk={() => { uploadBTL() }} onCancel={() => setIsModalCreateOpen(false)}>
            <Spin spinning={isLoading}>
                <div className='flex flex-col gap-[20px]'>
                    <Input
                        className='w-full'
                        placeholder="Tên đề tài"
                        onChange={(e) => { setBtlName(e.target.value) }}
                    ></Input>
                    <Select
                        options={classes?.map(cl => ({ value: cl.id, label: cl.name }))}
                        className='w-full'
                        showSearch
                        placeholder="Chọn môn"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label.trim().toLowerCase() ?? '').includes(input.trim().toLowerCase())}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        onChange={(e) => { setSelectedCLass2(classes.find(cl=>cl.id===e));  }}
                    ></Select>
                    <div>
                        <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Chọn bài tập lớn</p>
                        <input type='file' placeholder='Chọn bài tập lớn' onChange={(e) => { setFile(e.target.files[0]) }}></input>
                    </div>
                </div>
            </Spin>
        </Modal>
    </div>
}

export default ManageBTLStore;