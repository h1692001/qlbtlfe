import React from 'react';
import { Table, Space, Button, Modal, Spin, Input, Select } from 'antd';
import { Header } from 'antd/es/layout/layout';
import UserApi from '../../api/UserApi';
import { useEffect, useState } from 'react';
import MajorApi from '../../api/MajorApi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const ManageStudent = () => {

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
            render:(dt)=>{
                return <>{dt.name}</>
            }
        },
        {
            title: 'Khoa',
            dataIndex: 'major',
            key: 'major',
            render:(dt)=>{
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

    const [students, setStudents] = useState([]);
    const [majors, setMajors] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newStudent, setNewStudent] = useState({});
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

    const fetchStudents = async () => {
        try {
            const res = await UserApi.getAllStudents();
            setStudents(res);
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

    useEffect(() => {
        fetchStudents();
        fetchMajors();
    }, [])

    const SignupSchema = Yup.object().shape({
        fullname: Yup.string().required('Họ tên sinh viên là bắt buộc'),
        studentId: Yup.string().required('Mã sinh viên là bắt buộc'),
        email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
        majorId: Yup.string().required('Ngành học là bắt buộc'),
    });

    const formik = useFormik({
        initialValues: {
            fullname: '',
            studentId: '',
            email: '',
            majorId: undefined,
        },
        validationSchema: SignupSchema,
        onSubmit: async (values) => {
            try {
                const res = await UserApi.signupStudent(values);
                await fetchStudents();
                Swal.fire("Thành công", "Đã thêm sinh viên thành công", 'success');
            } catch (e) {
                Swal.fire("Thất bại", "Có lỗi xảy ra! Thử lại sau", 'error');
            }
        },
    });

    return <div >
        <div className='py-[12px]'>
            <Button type='primary' onClick={() => { setIsModalCreateOpen(true) }}>Thêm sinh viên</Button>
        </div>
        <Table columns={columns} dataSource={students} />
        <Modal title='Thêm sinh viên' open={isModalCreateOpen} onOk={formik.handleSubmit} onCancel={() => setIsModalCreateOpen(false)}>
            <Spin spinning={isLoading}>
                <div style={{ marginTop: '20px' }}>
                    <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Họ tên sinh viên</p>
                    <Input
                        value={formik.values.fullname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='fullname'
                    />
                    {formik.touched.fullname && formik.errors.fullname ? (
                        <div className='error text-[#B31217]'>{formik.errors.fullname}</div>
                    ) : null}
                </div>
                <div style={{ marginTop: '20px' }}>
                    <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Mã sinh viên</p>
                    <Input
                        value={formik.values.studentId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='studentId'
                    />
                    {formik.touched.studentId && formik.errors.studentId ? (
                        <div className='error text-[#B31217]'>{formik.errors.studentId}</div>
                    ) : null}
                </div>
                <div style={{ marginTop: '20px' }}>
                    <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Email</p>
                    <Input value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} name='email' />
                    {formik.touched.email && formik.errors.email ? (
                        <div className='error text-[#B31217]'>{formik.errors.email}</div>
                    ) : null}
                </div>

                <div style={{ marginTop: '20px' }}>
                    <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Ngành</p>
                    <Select
                        placeholder='Chọn ngành'
                        onChange={(value) => formik.setFieldValue('majorId', value)}
                        options={majors}
                        style={{
                            width: '100%',
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.majorId}
                        name='majorId'
                    />
                    {formik.touched.majorId && formik.errors.majorId ? (
                        <div className='error text-[#B31217]'>{formik.errors.majorId}</div>
                    ) : null}
                </div>
            </Spin>
        </Modal>
    </div>
}

export default ManageStudent;