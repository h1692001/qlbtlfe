import React from 'react';
import { Table, Space, Button, Modal, Spin, Input, Select } from 'antd';
import UserApi from '../../api/UserApi';
import { useEffect, useState } from 'react';
import ClassApi from '../../api/ClassApi';
import BTLApi from "../../api/BTLApi"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const ManageBTLStore = () => {

    const columns = [
        {
            title: 'Tên sinh viên',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Mã sinh viên',
            key: 'userId',
            dataIndex: 'userId',

        },
        {
            title: 'Ngành',
            dataIndex: 'faculty',
            key: 'faculty',
            render: (dt) => {
                return <>{dt.name}</>
            }
        },
        {
            title: 'Khoa',
            dataIndex: 'major',
            key: 'major',
            render: (dt) => {
                return <>{dt.majorName}</>
            }
        },
        {
            title: '',
            key: 'action',
            render: () => {
                return <Space>
                    <p className='text-[#1677ff] underline'>Cập nhật</p>
                    <p className='text-[#1677ff] underline'>Vô hiệu</p>
                </Space>
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
    const fetchMember = async () => {
        try {
            const res = await ClassApi.getMembersStudent(selectedClass);
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

    const fetchClasses = async () => {
        try {
            const res = await ClassApi.getAllByUser(userCurrent?.id);
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
            formDt.append("uploader", selectedStudents);
            formDt.append("classV", selectedClass);
            formDt.append("name", btlName);
            const res = await BTLApi.uploadBTL(formDt);
            setIsLoading(false);
            Swal.fire("Thành công", "Đã nộp bài tập", "success")

        }
        catch (e) {
            setIsLoading(false);

        }
    }

    return <div >
        <div className='py-[12px]'>
            <Button type='primary' onClick={() => { setIsModalCreateOpen(true) }}>Nộp bài tập</Button>
        </div>
        {/* <Table columns={columns} dataSource={students} /> */}
        <Modal title='Nộp bài tập' open={isModalCreateOpen} onOk={() => { uploadBTL() }} onCancel={() => setIsModalCreateOpen(false)}>
            <Spin spinning={isLoading}>
                <div className='flex flex-col gap-[20px]'>
                    <Input
                        className='w-full'
                        placeholder="Tên đề tài"
                        onChange={(e) => { setBtlName(e.target.value) }}
                    ></Input>
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
                        mode="multiple"
                        options={students}
                        className='w-full'
                        showSearch
                        placeholder="Chọn sinh viên nộp"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label.trim().toLowerCase() ?? '').includes(input.trim().toLowerCase())}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        onChange={(e) => { setSelectedStudents(e) }}
                    ></Select>

                    <div>
                        <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Chọn bài tập lớn</p>
                        <input type='file' placeholder='Chọn bài tập lớn'  onChange={(e) => { setFile(e.target.files[0]) }}></input>
                    </div>
                </div>
            </Spin>
        </Modal>
    </div>
}

export default ManageBTLStore;