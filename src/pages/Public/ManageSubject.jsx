import React from 'react';
import { Table, Space, Button, Modal, Spin, Input, Select, Tabs, Tag } from 'antd';
import { Header } from 'antd/es/layout/layout';
import ClassApi from '../../api/ClassApi';
import SubjectApi from '../../api/SubjectApi';
import { useEffect, useState } from 'react';
import MajorApi from '../../api/MajorApi';
import Swal from 'sweetalert2';
import UserApi from '../../api/UserApi';

const ManageSubject = () => {

    const columns = [
        {
            title: 'Tên môn học',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Lớp',
            key: 'classV',
            render: (record) => {
                return <p>{record?.classV?.name}</p>
            }
        },

        {
            title: 'Ngành',
            key: 'major',
            render: (record) => {
                return <p>{record?.classV?.major?.majorName}</p>
            }
        },
        {
            title: 'Giảng viên',
            key: 'teacher',
            dataIndex: 'teacher'
        },
        {
            title: '',
            key: 'action',
            render: (record) => {
                return <Space>
                    <p onClick={() => { setIsAddTeacher(true);setSelectedSubject(record) }} className='text-[#1677ff] underline'>Phân công giáo viên</p>
                </Space>
            }
        },
    ];

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState();
    const [majors, setMajors] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newStudent, setNewStudent] = useState({});
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [students, setStudents] = useState([]);
    const [selecttedTab, setSelectedTab] = useState(1);
    const [selectedUser, setSelectedUser] = useState();
    const [teachers, setTeachers] = useState([]);
    const [newSubject, setNewSubject] = useState("");
    const [isAddTeacher, setIsAddTeacher] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState();
    const [selectedSubject,setSelectedSubject]=useState();

    const fetchClasses = async () => {
        try {
            const res = await ClassApi.getAllAdmin();
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
    const [member, setMember] = useState([]);
    const fetchStudents = async () => {
        try {
            const res = await UserApi.getAllStudents();
            const categoryOption = [];
            res.forEach(dt => {
                categoryOption.push({
                    value: dt.id,
                    label: dt.userId,

                })
            })
            setStudents(categoryOption);
        } catch (e) {

        }
    }
    const fetchTeachers = async () => {
        try {
            const res = await UserApi.getAllTeachers();
            const categoryOption = [];
            res.forEach(dt => {
                categoryOption.push({
                    value: dt.id,
                    label: dt.userId,
                })
            })
            setTeachers(categoryOption);
        } catch (e) {

        }
    }

    const fetchMajors = async () => {
        try {
            const res = await MajorApi.getAllMajor();
            const categoryOption = [];
            res.forEach(dt => {
                categoryOption.push({
                    value: dt.id,
                    label: dt.majorName
                })
            })
            setMajors(categoryOption);
        } catch (e) {

        }
    }
    const fetchMember = async () => {
        try {
            const res = await SubjectApi.getAllSubject(selectedClass);
            setMember(res);
        }
        catch (e) {

        }
    }

    useEffect(() => {
        fetchClasses();
        fetchMajors();
        fetchStudents();
        fetchTeachers();
    }, [])

    const addStudent = async () => {
        try {
            setIsLoading(true)
            const res = await SubjectApi.addSubject({ classId: selectedClass, name: newSubject });
            Swal.fire("Thành công", 'Đã thêm môn học thành công', 'success')
            setNewStudent("");
            fetchMember(selectedClass);
            setIsModalCreateOpen(false);
            setIsLoading(false)
        }
        catch (e) {
            setIsLoading(false)
            Swal.fire("Thất bại", 'Có lỗi xảy ra! Thử lại sau', 'error')

        }
    }
    const addTeachers = async () => {
        try {
            setIsLoading(true)
            const res = await SubjectApi.addTeacher({ userId: selectedTeacher, id: selectedSubject?.id });
            Swal.fire("Thành công", 'Đã thêm giảng viên', 'success')
            
            setIsAddTeacher(false);
            fetchMember();
            setIsLoading(false)
        }
        catch (e) {
            setIsLoading(false)
            Swal.fire("Thất bại", 'Có lỗi xảy ra! Thử lại sau', 'error')

        }
    }

    const addTeacher = async () => {
        try {
            const res = await ClassApi.addMember({ role: 'TEACHER', id: selectedClass, memberId: selectedUser });
            Swal.fire("Thành công", 'Đã thêm thành viên thành công', 'success')
        }
        catch (e) {
            Swal.fire("Thất bại", 'Có lỗi xảy ra! Thử lại sau', 'error')

        }
    }



    const items = [
        {
            key: '1',
            label: 'Môn học',
            children: (
                <div className='flex flex-col gap-[20px]'>
                    <Select
                        options={classes}
                        className='w-full'
                        showSearch
                        placeholder="Chọn lớp"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label.trim().toLowerCase() ?? '').includes(input.trim().toLowerCase())}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        onChange={(e) => { setSelectedClass(e) }}
                    ></Select>
                    <Input onChange={(e) => { setNewSubject(e.target.value) }} placeholder='Tên môn học'></Input>
                </div>
            ),
        },
    ];

    return <div >
        <div className='py-[12px] flex gap-[20px]'>
            <Select className='w-[300px]' options={classes} placeholder='Chọn lớp' onChange={(e) => { setSelectedClass(e) }}></Select>
            <Button type='primary' onClick={() => {
                if (selectedClass) {
                    fetchMember();
                }
            }}>Xem danh sách môn</Button>
            <Button type='primary' onClick={() => { setIsModalCreateOpen(true) }}>Thêm môn học</Button>
        </div>
        <Table columns={columns} dataSource={member} />
        <Modal title='Thêm môn học' open={isModalCreateOpen} onOk={() => {
            addStudent();

        }} onCancel={() => setIsModalCreateOpen(false)}>
            <Spin spinning={isLoading}>
                <Tabs defaultActiveKey="1" items={items} onChange={(e) => { setSelectedTab(e) }} />
            </Spin>
        </Modal>
        <Modal title='Phân công giáo viên' open={isAddTeacher} onOk={() => {
            addTeachers();
        }} onCancel={() => setIsAddTeacher(false)}>
            <Spin spinning={isLoading}>
                <Select options={teachers} style={{ width: '100%' }} onChange={(e) => setSelectedTeacher(e)}></Select>
            </Spin>
        </Modal>
    </div>
}

export default ManageSubject;