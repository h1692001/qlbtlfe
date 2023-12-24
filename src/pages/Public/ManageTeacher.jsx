import React from 'react';
import { Table, Space, Button, Modal, Spin, Input, Select } from 'antd';
import { Header } from 'antd/es/layout/layout';
import UserApi from '../../api/UserApi';
import { useEffect, useState } from 'react';
import MajorApi from '../../api/MajorApi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const ManageTeacher = () => {

    const columns = [
        {
            title: 'Tên giảng viên',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Mã giảng viên',
            key: 'userId',
            dataIndex: 'userId',

        },
        {
            title: 'Khoa',
            dataIndex: 'faculty',
            key: 'faculty',
            render:(dt)=>{
                return <>{dt.name}</>
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (dt) => {
                if (dt === 1) {
                    return <p>Vô hiệu</p>
                } else {
                    return <p>Đang hoạt động</p>
                }
            }
        },
        {
            title: '',
            key: 'action',
            render: (record) => {
                return <Space>
                    <p className='text-[#1677ff] underline cursor-pointer'
                        onClick={() => {
                            setShowUpdateClassModal(true);
                            setUpdateModalInfo(record)
                        }}>Cập nhật</p>
                    {record.status !== 1 && <p className='text-[#1677ff] underline  cursor-pointer'
                        onClick={async () => {
                            try {
                                const res = await UserApi.disable(record.id);
                                fetchTeachers();
                                Swal.fire("Yeah!", "Tài khoản giảng viên này đã bị vô hiệu", 'success')
                            }
                            catch (e) {
                                Swal.fire("Oops", "Có lỗi xảy ra! Thử lại sau", 'error')

                            }
                        }}>Vô hiệu</p>}
                    {record.status === 1 && <p className='text-[#1677ff] underline  cursor-pointer'
                        onClick={async () => {
                            try {
                                const res = await UserApi.enable(record.id);
                                fetchTeachers();
                                Swal.fire("Yeah!", "Tài khoản giảng viên này đã hoạt động", 'success')
                            }
                            catch (e) {
                                Swal.fire("Oops", "Có lỗi xảy ra! Thử lại sau", 'error')
                            }
                        }}>Tái hoạt động</p>}
                </Space>
            }
        },
    ];

    const [teachers, setTeacher] = useState([]);
    const [majors, setMajors] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

    
    const [showUpdateClassModal, setShowUpdateClassModal] = useState(false);
    const [updateModelInfo, setUpdateModalInfo] = useState({});


    const fetchTeachers = async () => {
        try {
            const res = await UserApi.getAllTeachers();
            setTeacher(res);
        } catch (e) {

        }
    }

    const fetchFaculty = async () => {
        try {
            const res = await MajorApi.getAllFaculty();
            const categoryOption = [];
            res.forEach(dt => {
                categoryOption.push({
                    value: dt.id,
                    label: dt.name
                })
            })
            setMajors(categoryOption);
        } catch (e) {

        }
    }

    useEffect(() => {
        fetchTeachers();
        fetchFaculty();
    }, [])

    const SignupSchema = Yup.object().shape({
        fullname: Yup.string().required('Họ tên giảng viên là bắt buộc'),
        studentId: Yup.string().required('Mã giảng viên là bắt buộc'),
        email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
        facultyId: Yup.string().required('Ngành học là bắt buộc'),
    });

    const formik = useFormik({
        initialValues: {
            fullname: '',
            studentId: '',
            email: '',
            facultyId: undefined,
        },
        validationSchema: SignupSchema,
        onSubmit: async (values) => {
            try {
                const res = await UserApi.signupTeacher(values);
                await fetchTeachers();
                Swal.fire("Thành công", "Đã thêm giảng viên thành công", 'success');
            } catch (e) {
                Swal.fire("Thất bại", "Có lỗi xảy ra! Thử lại sau", 'error');
            }
        },
    });

    const formik2 = useFormik({
        initialValues: {
            fullname: '',
            studentId: '',
            email: '',
            facultyId: undefined,
            id: ""
        },
        validationSchema: SignupSchema,
        onSubmit: async (values) => {
            try {
                values.id=updateModelInfo.id
                const res = await UserApi.updateTeacher(values);
                await fetchTeachers();
                Swal.fire("Thành công", "Đã  sửa thông tin giảng viên thành công", 'success');
            } catch (e) {
                Swal.fire("Thất bại", "Có lỗi xảy ra! Thử lại sau", 'error');
            }
        },
    });

    return <div >
        <div className='py-[12px]'>
            <Button type='primary' onClick={() => { setIsModalCreateOpen(true) }}>Thêm giảng viên</Button>
        </div>
        <Table columns={columns} dataSource={teachers} />
        <Modal title='Thêm giảng viên' open={isModalCreateOpen} onOk={formik.handleSubmit} onCancel={() => setIsModalCreateOpen(false)}>
            <Spin spinning={isLoading}>
                <div style={{ marginTop: '20px' }}>
                    <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Họ tên giảng viên</p>
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
                    <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Mã giảng viên</p>
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
                    <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Khoa</p>
                    <Select
                        placeholder='Chọn khoa'
                        onChange={(value) => formik.setFieldValue('facultyId', value)}
                        options={majors}
                        style={{
                            width: '100%',
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.facultyId}
                        name='facultyId'
                    />
                    {formik.touched.facultyId && formik.errors.facultyId ? (
                        <div className='error text-[#B31217]'>{formik.errors.facultyId}</div>
                    ) : null}
                </div>
            </Spin>
        </Modal>

        
        <Modal title='Sửa thông tin giảng viên' open={showUpdateClassModal} onOk={formik2.handleSubmit} onCancel={() => setShowUpdateClassModal(false)}>
            <Spin spinning={isLoading}>
            <div style={{ marginTop: '20px' }}>
                    <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Họ tên giảng viên</p>
                    <Input
                        value={formik2.values.fullname}
                        onChange={formik2.handleChange}
                        onBlur={formik2.handleBlur}
                        name='fullname'
                    />
                    {formik2.touched.fullname && formik2.errors.fullname ? (
                        <div className='error text-[#B31217]'>{formik2.errors.fullname}</div>
                    ) : null}
                </div>
                <div style={{ marginTop: '20px' }}>
                    <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Mã giảng viên</p>
                    <Input
                        value={formik2.values.studentId}
                        onChange={formik2.handleChange}
                        onBlur={formik2.handleBlur}
                        name='studentId'
                    />
                    {formik2.touched.studentId && formik2.errors.studentId ? (
                        <div className='error text-[#B31217]'>{formik2.errors.studentId}</div>
                    ) : null}
                </div>
                <div style={{ marginTop: '20px' }}>
                    <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Email</p>
                    <Input value={formik2.values.email} onChange={formik2.handleChange} onBlur={formik2.handleBlur} name='email' />
                    {formik2.touched.email && formik2.errors.email ? (
                        <div className='error text-[#B31217]'>{formik2.errors.email}</div>
                    ) : null}
                </div>

                <div style={{ marginTop: '20px' }}>
                    <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Khoa</p>
                    <Select
                        placeholder='Chọn khoa'
                        onChange={(value) => formik2.setFieldValue('facultyId', value)}
                        options={majors}
                        style={{
                            width: '100%',
                        }}
                        onBlur={formik2.handleBlur}
                        value={formik2.values.facultyId}
                        name='facultyId'
                    />
                    {formik2.touched.facultyId && formik2.errors.facultyId ? (
                        <div className='error text-[#B31217]'>{formik2.errors.facultyId}</div>
                    ) : null}
                </div>
            </Spin>
        </Modal>
    </div>
}

export default ManageTeacher;