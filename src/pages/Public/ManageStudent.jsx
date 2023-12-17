import React from 'react';
import { Table, Space, Button, Modal, Spin, Input, Select } from 'antd';
import { Header } from 'antd/es/layout/layout';
import UserApi from '../../api/UserApi';
import { useEffect, useState } from 'react';
import MajorApi from '../../api/MajorApi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import ClassApi from '../../api/ClassApi';


const ManageStudent = () => {


    const [students, setStudents] = useState([]);
    const [majors, setMajors] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newStudent, setNewStudent] = useState({});
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState();

    const [showUpdateClassModal, setShowUpdateClassModal] = useState(false);
    const [updateModelInfo, setUpdateModalInfo] = useState({});

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
        fetchClasses();
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

    const formik2 = useFormik({
        initialValues: {
            fullname: '',
            studentId: '',
            email: '',
            majorId: undefined,
            id: ""
        },
        validationSchema: SignupSchema,
        onSubmit: async (values) => {
            try {
                values.id = updateModelInfo.id
                const res = await UserApi.updateStudent(values);
                await fetchStudents();
                Swal.fire("Thành công", "Đã sửa thông tin sinh viên thành công", 'success');
            } catch (e) {
                Swal.fire("Thất bại", "Có lỗi xảy ra! Thử lại sau", 'error');
            }
        },
    });

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
    const uniqueNamesMap = new Map();

    const newArray = students.reduce((acc, obj) => {
        const name = obj.fullname;

        if (!uniqueNamesMap.has(name)) {
            uniqueNamesMap.set(name, { text: name, value: name });
            acc.push(uniqueNamesMap.get(name));
        }

        return acc;
    }, []);
    const columns = [
        {
            title: 'Tên sinh viên',
            dataIndex: 'fullname',
            key: 'fullname',
            filterSearch: true,
            filters: newArray.map((value) => value),
            onFilter: (value, record) => {
                return record.fullname === value;
            },
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
                    <p className='text-[#1677ff] underline'
                        onClick={() => {
                            setShowUpdateClassModal(true);
                            setUpdateModalInfo(record)
                        }}>Cập nhật</p>
                    {record.status !== 1 && <p className='text-[#1677ff] underline'
                        onClick={async () => {
                            try {
                                const res = await UserApi.disable(record.id);
                                fetchStudents();
                                Swal.fire("Yeah!", "Tài khoản sinh viên này đã bị vô hiệu", 'success')
                            }
                            catch (e) {
                                Swal.fire("Oops", "Có lỗi xảy ra! Thử lại sau", 'error')

                            }
                        }}>Vô hiệu</p>}
                    {record.status === 1 && <p className='text-[#1677ff] underline'
                        onClick={async () => {
                            try {
                                const res = await UserApi.enable(record.id);
                                fetchStudents();
                                Swal.fire("Yeah!", "Tài khoản sinh viên này đã hoạt động", 'success')
                            }
                            catch (e) {
                                Swal.fire("Oops", "Có lỗi xảy ra! Thử lại sau", 'error')
                            }
                        }}>Tái hoạt động</p>}
                </Space>
            }
        },
    ];

    const fetchMember = async () => {
        try {
            const res = await ClassApi.getMembersStudent(selectedClass);
            setStudents(res.map(dt=>dt.member));
        }
        catch (e) {

        }
    }

    return <div >
        <div className='py-[12px] flex items-center gap-[18px]'>
            <Button type='primary' onClick={() => { setIsModalCreateOpen(true) }}>Thêm sinh viên</Button>
            <div className='py-[12px] flex gap-[20px]'>
                <Select className='w-[300px]' options={classes} placeholder='Chọn lớp' onChange={(e) => { setSelectedClass(e) }}></Select>
                <Button type='primary' onClick={() => {
                    if (selectedClass) {
                        fetchMember();
                    }
                }}>Xem sinh viên</Button>
                
            </div>
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

        <Modal title='Sửa thông tin sinh viên' open={showUpdateClassModal} onOk={formik2.handleSubmit} onCancel={() => setShowUpdateClassModal(false)}>
            <Spin spinning={isLoading}>
                <div style={{ marginTop: '20px' }}>
                    <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Họ tên sinh viên</p>
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
                    <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Mã sinh viên</p>
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
                    <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Ngành</p>
                    <Select
                        placeholder='Chọn ngành'
                        onChange={(value) => formik2.setFieldValue('majorId', value)}
                        options={majors}
                        style={{
                            width: '100%',
                        }}
                        onBlur={formik2.handleBlur}
                        value={formik2.values.majorId}
                        name='majorId'
                    />
                    {formik2.touched.majorId && formik2.errors.majorId ? (
                        <div className='error text-[#B31217]'>{formik2.errors.majorId}</div>
                    ) : null}
                </div>
            </Spin>
        </Modal>
    </div>
}

export default ManageStudent;