import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UserApi from '../../api/UserApi';
import { useDispatch } from 'react-redux';
import { login } from '../../store/actions/authAction';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Typography, Spin } from 'antd';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const Container = styled("div")`
    .ant-spin-nested-loading{
        width:100%
    }
`

const validationSchema = Yup.object().shape({
    password: Yup.string().required('Không để trống'),
    password2: Yup.string().oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
});

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    useEffect(() => {
        const checkToken = async () => {
            try {
                const res = await UserApi.checkForgotToken(params['token']);
            }
            catch (e) {
                navigate("/login")
            }
        }
        checkToken()
    }, [])
    const [isLoading, setIsLoading] = useState(false);
    const formik = useFormik({
        initialValues: {
            password: '',
            password2: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const res = await UserApi.resetPassword({ ...values, token: params['token'] });
                Swal.fire("Yeah!", "Mật khẩu của bạn đã được khôi phục", 'success');
                setIsLoading(false);
            }
            catch (e) {

            }
        },
    });

    return (
        <Container className='flex justify-center'>
            <div className='pt-[100px] w-[400px] flex flex-col items-center gap-[20px]'>
                <p className='text-[24px] font-[600]'>Khôi phục mật khẩu</p>

                <div className='w-full flex flex-col gap-[8px]'>
                    <Input.Password
                        className='py-[14px]'
                        placeholder='Mật khẩu mới'
                        name='password'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div className='text-red-500 error-message'>{formik.errors.password}</div>
                    )}
                </div>
                <div className='w-full flex flex-col gap-[8px]'>
                    <Input.Password
                        className='py-[14px]'
                        placeholder='Nhập lại mật khẩu'
                        name='password2'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password2}
                    />
                    {formik.touched.password2 && formik.errors.password2 && (
                        <div className='text-red-500 error-message'>{formik.errors.password2}</div>
                    )}
                </div>
                <Spin spinning={isLoading} style={{ width: '100%' }}>
                    <Button
                        type='primary'
                        className='w-full h-[40px] bg-[#1677ff]'
                        onClick={formik.handleSubmit}
                    >
                        Lưu mật khẩu
                    </Button>
                </Spin>

                <div className='flex justify-between w-full text-[13px] text-[#1976d2] underline'>
                    <Link to='/login'>Quay lại đăng nhập</Link>
                </div>
            </div>
        </Container>
    );
};

export default ResetPassword;
