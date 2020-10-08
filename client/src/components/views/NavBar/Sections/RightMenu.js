/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu, Avatar, Divider } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;

function RightMenu(props) {
  const user = useSelector((state) => state.user);
  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        localStorage.removeItem('userId');
        props.history.push('/login');
      } else {
        alert('Logout Failed');
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <Link to="/login">Login</Link>
        </Menu.Item>
        <Menu.Item key="app">
          <Link to="/register">Register</Link>
        </Menu.Item>
      </Menu>
    );
  } else if (user.userData) {
    if (props.mobile) {
      return (
        <Menu mode={props.mode}>
          <Menu.Item key="profile">
            <Link to="/me">Profile</Link>
          </Menu.Item>
          <Menu.Item key="logout">
            <Link to="#" onClick={logoutHandler}>
              Logout
            </Link>
          </Menu.Item>
        </Menu>
      );
    } else {
      return (
        <Menu
          mode={props.mode}
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <SubMenu
            title={<Avatar src={user.userData ? user.userData.image : ''} />}
            style={{ borderBottomStyle: 'none' }}
          >
            <Menu.Item key="name" className="disable-highlight">
              <Link to="/me">{user.userData.email}</Link>
            </Menu.Item>
            <hr
              style={{
                border: '0',
                height: '1px',
                background: ' #e8e8e8',
              }}
            />
            <Menu.Item key="profile" className="disable-highlight">
              <Link to="/me">Profile</Link>
            </Menu.Item>
            <Menu.Item key="logout" className="disable-highlight">
              <Link to="#" onClick={logoutHandler}>
                Logout
              </Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      );
    }
  } else {
    return <></>;
  }
}

export default withRouter(RightMenu);
