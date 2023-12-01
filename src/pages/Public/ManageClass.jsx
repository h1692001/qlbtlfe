import React from 'react';
import { Table, Space, Button, Modal, Spin, Input, Select } from 'antd';
import { Header } from 'antd/es/layout/layout';
import ClassApi from '../../api/ClassApi';
import { useEffect, useState } from 'react';
import MajorApi from '../../api/MajorApi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const ManageClass = () => {

    const columns = [
        {
            title: 'Tên lớp',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Ngành',
            dataIndex: 'major',
            key: 'major',
            render: (dt) => {
                return <>{dt.majorName}</>
            }
        },
        {
            title: 'Ngày tạo',
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
    const [majors, setMajors] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newStudent, setNewStudent] = useState({});
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

    const fetchClasses = async () => {
        try {
            const res = await ClassApi.getAllClass();
            setClasses(res);
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
        fetchClasses();
        fetchMajors();
    }, [])

    const SignupSchema = Yup.object().shape({
        name: Yup.string().required('Tên lớp là bắt buộc'),
        majorId: Yup.string().required('Ngành học là bắt buộc'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            majorId: undefined,
        },
        validationSchema: SignupSchema,
        onSubmit: async (values) => {
            try {
                const res = await ClassApi.createClass(values);
                await fetchClasses();
                Swal.fire("Thành công", "Đã thêm sinh viên thành công", 'success');
            } catch (e) {
                Swal.fire("Thất bại", "Có lỗi xảy ra! Thử lại sau", 'error');
            }
        },
    });

    return <div >
        <div className='py-[12px]'>
            <Button type='primary' onClick={() => { setIsModalCreateOpen(true) }}>Thêm lớp</Button>
        </div>
        <Table columns={columns} dataSource={classes} />
        <Modal title='Thêm lớp' open={isModalCreateOpen} onOk={formik.handleSubmit} onCancel={() => setIsModalCreateOpen(false)}>
            <Spin spinning={isLoading}>
                <div style={{ marginTop: '20px' }}>
                    <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>Tên lớp</p>
                    <Input
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='name'
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div className='error text-[#B31217]'>{formik.errors.name}</div>
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

export default ManageClass;