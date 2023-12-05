import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UserApi from '../../api/UserApi';
import { useDispatch } from 'react-redux';
import { login } from '../../store/actions/authAction';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Typography, Spin } from 'antd';
import styled from 'styled-components';

const Container=styled("div")`
    .ant-spin-nested-loading{
        width:100%
    }
`

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
});

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const res = await UserApi.forgotPassword(values);
                Swal.fire("Yeah!", "Mail xác nhận quên mật khẩu của bạn đã được gửi", 'success');
                setIsLoading(false);
            }
            catch (e) {

            }
        },
    });

    return (
        <Container className='flex justify-center'>
            <div className='pt-[100px] w-[400px] flex flex-col items-center gap-[20px]'>
                <p className='text-[24px] font-[600]'>Quên mật khẩu</p>

                <div className='w-full flex flex-col gap-[8px]'>
                    <Input
                        className='py-[14px]'
                        placeholder='Email'
                        name='email'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div className='text-red-500 error-message'>{formik.errors.email}</div>
                    )}
                </div>
                <Spin spinning={isLoading}  style={{width:'100%'}}>
                    <Button
                        type='primary'
                        className='w-full h-[40px] bg-[#1677ff]'
                        onClick={formik.handleSubmit}
                    >
                        Gửi mail xác nhận
                    </Button>
                </Spin>

                <div className='flex justify-between w-full text-[13px] text-[#1976d2] underline'>
                    <Link to='/login'>Quay lại đăng nhập</Link>
                    {/* <Link to='/signup'>Bạn chưa có tài khoản? Đăng kí ngay</Link> */}
                </div>
            </div>
        </Container>
    );
};

export default ForgotPassword;
