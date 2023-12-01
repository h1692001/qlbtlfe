import * as React from 'react';
import { Tabs } from 'antd';
import StudentSignUp from './components/StudentSignUp';
import styled from 'styled-components';

const StyledSignUp = styled("div")`
    padding:0px 400px;
    .ant-tabs-tab-btn{
        font-size:18px;
    }
`;
const items = [
    {
        key: '2',
        label: 'Sinh viên',
        children: <StudentSignUp></StudentSignUp>,
    },
];

export default function SignUp() {
    return (
        <StyledSignUp>
            <Tabs defaultActiveKey="1" items={items} />
        </StyledSignUp>
    );
}