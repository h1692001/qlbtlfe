import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  SearchOutlined
} from "@ant-design/icons";
import Logo from "../../assets/logo.png";
import { Breadcrumb, Layout, Menu, theme, Dropdown } from "antd";
import { useState, useEffect } from "react";
import { TbReportAnalytics } from "react-icons/tb";
import { TbBuildingWarehouse } from "react-icons/tb";
import { GoChecklist } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { getCurrentUser, logout } from "../../store/actions/authAction";
import UserApi from "../../api/UserApi";
import styled from "styled-components";

const StyledPublic = styled("div")`
  padding: 15px;
  background-color: #1e1e2c;
  .ant-layout-sider {
    border-radius: 12px !important;
    background-color: #2f3142;
    overflow: hidden;
  }
  .ant-menu {
    background-color: #2f3142;
  }
  .ant-menu-dark.ant-menu-inline .ant-menu-sub.ant-menu-inline {
    background-color: #2f3142;
  }
  .ant-layout-sider-trigger {
    background-color: #7370fe;
  }
  .ant-menu-item,
  .ant-menu-submenu-title {
    padding: 30px 24px;
  }

  .ant-menu-item-selected {
    background-color: #292c3e;
    position: relative;
    overflow: hidden;
  }

  .ant-menu-item-selected:before {
    content: "";
    position: absolute;
    left: -6px;
    top: 50%;
    transform: translateY(-50%) !important;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #7370fe;
  }
  .ant-layout-header {
    padding: 14px 0;
    height: auto !important;
  }
`;

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const adminItems = [
  getItem("Quản lí Bài tập lớn", "/", <TbBuildingWarehouse />),
  getItem("Quản lí tài khoản", "sub2", <AppstoreOutlined />, [
    getItem("Quản lí sinh viên", "/manageStudent"),
    getItem("Quản lí giáo viên", "/manageTeacher"),
  ]),
  getItem("Quản lí lớp học", "sub3", <AppstoreOutlined />, [
    getItem("Danh sách lớp", "/manageClass"),
    getItem("Danh sách thành viên lớp", "/classMembers"),
  ]),
  getItem("Báo cáo thống kê", "/statistic", <TbReportAnalytics />),
];

const studentItems = [
  getItem("Kho Bài tập lớn của tôi", "/", <TbBuildingWarehouse />),
  getItem("Khai thác Bài tập lớn", "/search", <SearchOutlined />),
];
const App = () => {
  const [headerTitle, setHeaderTitle] = useState("Quản lí Bài tập lớn");
  const [menu, setMenu] = useState([]);
  const { userCurrent } = useSelector((state) => state.auth);
  useEffect(() => {
    if (userCurrent?.role === "ADMIN") {
      setMenu(adminItems);
    } else if (userCurrent?.role === "STUDENT") {
      setMenu(studentItems);
      setHeaderTitle("Kho Bài tập lớn của tôi")
    }
  }, [userCurrent]);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const checkAccess = async () => {
    try {
      const res = await UserApi.getCurrentUser();
      dispatch(getCurrentUser(res));
    } catch (err) {
      navigate("/");
      dispatch(logout());
    }
  };
  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("persist:auth"))?.isLoggedIn === "true"
    ) {
      checkAccess();
    }
  }, []);

  const items = [
    {
      key: "1",
      label: <Link to="/profile">Thông tin tài khoản</Link>,
    },
    { 
      key: "2",
      label: (
        <div
          onClick={() => {
            dispatch(logout());
          }}
        >
          Đăng xuất
        </div>
      ),
    },
  ];

  const navigate = useNavigate();
  const onClick = (e) => {
    const flattenArr = menu.flatMap((item) =>
      item.children ? item.children : [item]
    );
    const selectedItem = flattenArr.find((item) => item.key === e.key);

    if (selectedItem) {
      setHeaderTitle(selectedItem.label);
      navigate(e.key);
    }
  };

  return (
    <StyledPublic>
      <Layout
        style={{
          minHeight: "97vh",
          backgroundColor: "#1E1E2C",
          overflow: "hidden",
        }}
      >
        <div className="bg-[#2f3142] rounded-[30px]">
          <Sider width={270}>
            <div className="px-[40px] py-[10px] flex justify-center">
              <img src={Logo} alt="logo"></img>
            </div>
            <Menu
              onClick={onClick}
              style={{
                height: "100%",
              }}
              theme="dark"
              defaultSelectedKeys={"/"}
              mode="inline"
              items={menu}
            />
          </Sider>
        </div>
        <Layout
          style={{
            padding: "0 30px",
            backgroundColor: "#1E1E2C",
          }}
        >
          <Header
            style={{
              backgroundColor: "#1E1E2C",
              padding: "14px 0",
            }}
            className="flex justify-between items-center py-[14px]"
          >
            <p className="font-[600] text-[24px] text-white">{headerTitle}</p>

            <Dropdown
              menu={{
                items,
              }}
            >
              <div className="px-[20px] rounded-[12px] flex gap-[20px] bg-[#222433] items-center py-[12px]">
                <img
                  src={userCurrent?.avatar}
                  alt="avt"
                  className="h-[40px] w-[40px] object-cover rounded-[50%]"
                ></img>
                <div className="text-white leading-[30px]">
                  <p>
                    Chào,{" "}
                    <span className="font-[600]">
                      {
                        userCurrent?.userName?.split(" ")[
                          userCurrent?.userName?.split(" ").length - 1
                        ]
                      }
                    </span>
                  </p>
                  <p className="text-white leading-[30px]">
                    {userCurrent?.userId}
                  </p>
                </div>
              </div>
            </Dropdown>
          </Header>
          <Content
            style={{
              padding: "12px",
              backgroundColor: "#222433",
              borderRadius: "20px",
            }}
          >
            <Outlet></Outlet>
          </Content>
        </Layout>
      </Layout>
    </StyledPublic>
  );
};
export default App;
