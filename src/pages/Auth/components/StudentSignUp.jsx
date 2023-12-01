import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UserApi from '../../../api/UserApi';
import MajorApi from '../../../api/MajorApi';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { Input, Button, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const StyledStudentSignUp = styled('div')`
  .MuiInputBase-root {
    width: 100% !important;
  }
`;

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
  fullName: Yup.string().required('Họ và tên không được để trống'),
  studentId: Yup.string().required('Mã sinh viên không được để trống'),
  password: Yup.string().required('Mật khẩu không được để trống'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
    .required('Nhập lại mật khẩu không được để trống'),
});

const StudentSignUp = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      fullName: '',
      studentId: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await UserApi.signupStudent(values);
        Swal.fire('Success', 'Created account successfully', 'success');
        // Redirect or perform other actions after successful signup
        navigate('/login');
      } catch (e) {
        Swal.fire('Error', 'Created account fail', 'error');
      }
    },
  });

  return (
    <StyledStudentSignUp>
      <div className='flex justify-center'>
        <div className='pt-[100px] w-[400px] flex flex-col items-center gap-[20px]'>
          <p className='text-[24px] font-[600]'>Đăng kí</p>

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
            <Input
              className='py-[14px]'
              placeholder='Họ và tên'
              name='fullName'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fullName}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <div className='text-red-500 error-message'>{formik.errors.fullName}</div>
            )}
          </div>

          <div className='w-full flex flex-col gap-[8px]'>
            <Input
              className='py-[14px]'
              placeholder='Mã sinh viên'
              name='studentId'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.studentId}
            />
            {formik.touched.studentId && formik.errors.studentId && (
              <div className='text-red-500 error-message'>{formik.errors.studentId}</div>
            )}
          </div>

          <div className='w-full flex flex-col gap-[8px]'>
            <Input.Password
              className='py-[14px]'
              type='password'
              placeholder='Mật khẩu'
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
              type='password'
              placeholder='Nhập lại mật khẩu'
              name='confirmPassword'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className='text-red-500 error-message'>{formik.errors.confirmPassword}</div>
            )}
          </div>

          <Button
            type='primary'
            className='w-full h-[40px] bg-[#1677ff]'
            onClick={formik.handleSubmit}
          >
            ĐĂNG KÍ
          </Button>

          <div className='flex justify-end w-full text-[13px] text-[#1976d2] underline'>
            <Link to='/login'>Đã có tài khoản? Đăng nhập</Link>
          </div>
        </div>
      </div>
    </StyledStudentSignUp>
  );
};
export default StudentSignUp;
