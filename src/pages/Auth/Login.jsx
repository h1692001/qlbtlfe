import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UserApi from '../../api/UserApi';
import { useDispatch } from 'react-redux';
import { login } from '../../store/actions/authAction';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from 'antd';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
  password: Yup.string().required('Mật khẩu không được để trống'),
});

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await UserApi.login(values);
        if (res.status === 1) {
          Swal.fire("Oops!", "Sai tài khoản/mật khẩu", 'error');
        } else {
          dispatch(login(res));
          setTimeout(() => {
            navigate('/');

          }, 300)

        }
      } catch (e) {

      }
    },
  });

  return (
    <div className='flex justify-center'>
      <div className='pt-[100px] w-[400px] flex flex-col items-center gap-[20px]'>
        <p className='text-[24px] font-[600]'>Đăng nhập</p>

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

        <div className='w-full flex flex-col gap-[8px]'>
          <Input.Password
            className='py-[14px]'
            placeholder='Password'
            name='password'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div className='text-red-500 error-message'>{formik.errors.password}</div>
          )}
        </div>

        <Button
          type='primary'
          className='w-full h-[40px] bg-[#1677ff]'
          onClick={formik.handleSubmit}
        >
          ĐĂNG NHẬP
        </Button>

        <div className='flex justify-between w-full text-[13px] text-[#1976d2] underline'>
          <Link to='/forgotPassword'>Quên mật khẩu</Link>
          {/* <Link to='/signup'>Bạn chưa có tài khoản? Đăng kí ngay</Link> */}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
