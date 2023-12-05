import React from 'react';
import { Table, Space, Button, Modal, Spin, Input, Select, Tabs } from 'antd';
import { Header } from 'antd/es/layout/layout';
import ClassApi from '../../api/ClassApi';
import { useEffect, useState } from 'react';
import MajorApi from '../../api/MajorApi';
import Swal from 'sweetalert2';
import UserApi from '../../api/UserApi';

const ClassMember = () => {

    const columns = [
        {
            title: 'Tên thành viên',
            dataIndex: 'member',
            key: 'member',
            render: (dt) => {
                return <>{dt.fullname}</>
            }
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: '',
            key: 'action',
            render: () => {
                return <Space>
                    <p className='text-[#1677ff] underline'>Vô hiệu</p>
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
    const [teachers,setTeachers]=useState([]);
    
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
            const res = await ClassApi.getAllMember(selectedClass);
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
            const res = await ClassApi.addMember({ role: 'STUDENT', id: selectedClass, memberId: selectedUser });
            Swal.fire("Thành công", 'Đã thêm thành viên thành công', 'success')
        }
        catch (e) {
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
            label: 'Sinh viên',
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
                    <Select
                        options={students}
                        className='w-full'
                        showSearch
                        placeholder="Chọn sinh viên"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label.trim().toLowerCase() ?? '').includes(input.trim().toLowerCase())}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        onChange={(e) => { setSelectedUser(e) }}
                    ></Select>
                </div>
            ),
        },
        {
            key: '2',
            label: 'Giảng viên',
            children: <div className='flex flex-col gap-[20px]'>
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
                <Select
                    options={teachers}
                    className='w-full'
                    showSearch
                    placeholder="Chọn sinh viên"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label.trim().toLowerCase() ?? '').includes(input.trim().toLowerCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    onChange={(e) => { setSelectedUser(e) }}
                ></Select>
            </div>,
        },
    ];

    return <div >
        <div className='py-[12px] flex gap-[20px]'>
            <Select className='w-[300px]' options={classes} placeholder='Chọn lớp' onChange={(e) => { setSelectedClass(e) }}></Select>
            <Button type='primary' onClick={() => {
                if (selectedClass) {
                    fetchMember();
                }
            }}>Xem thành viên</Button>
            <Button type='primary' onClick={() => { setIsModalCreateOpen(true) }}>Thêm thành viên</Button>
        </div>
        <Table columns={columns} dataSource={member} />
        <Modal title='Thêm lớp' open={isModalCreateOpen} onOk={() => {

            if (selecttedTab === 1) {
                addStudent();

            } else {
                addTeacher();

            }
        }} onCancel={() => setIsModalCreateOpen(false)}>
            <Spin spinning={isLoading}>
                <Tabs defaultActiveKey="1" items={items} onChange={(e) => { setSelectedTab(e) }} />
            </Spin>
        </Modal>
    </div>
}

export default ClassMember;