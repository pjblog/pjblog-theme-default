import styles from './index.module.less';
import { useMyInfo, useLogout, useReloadMyInfo } from '@pjblog/hooks';
import { Avatar, Space, Dropdown, Typography, message } from 'antd';
import { Flex } from '../flex';
import { CaretDownOutlined, LoginOutlined, KeyOutlined, DesktopOutlined, EditOutlined, ShakeOutlined, LogoutOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import { usePath } from '../../hooks';

const unLoginedMenus = [
  {
    key: 'login',
    label: '去登录',
    icon: <LoginOutlined />
  },
  {
    key: 'register',
    label: '注册新用户',
    icon: <KeyOutlined />
  }
]

const loginedMenus = [
  {
    key: 'control',
    label: '进入后台',
    icon: <DesktopOutlined />
  },
  {
    key: 'profile',
    label: '修改资料',
    icon: <EditOutlined />
  },
  {
    key: 'password',
    label: '修改密码',
    icon: <ShakeOutlined />
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: <LogoutOutlined />,
  },
]

export function User() {
  const me = useMyInfo();
  const reload = useReloadMyInfo();
  const LOGIN = usePath('LOGIN');
  const REGISTER = usePath('REGISTER');
  const PROFILE = usePath('PROFILE');
  const PASSWORD = usePath('PASSWORD');
  const { execute } = useLogout();
  const onClick = useCallback((key: string) => {
    switch (key) {
      case 'login': return LOGIN.redirect();
      case 'register': return REGISTER.redirect();
      case 'profile': return PROFILE.redirect();
      case 'password': return PASSWORD.redirect();
      case 'control': return window.location.href = '/control/';
      case 'logout':
        return execute()
          .then(reload)
          .then(() => message.success('退出登录成功'))
          .catch(e => message.error(e.message));
    }
  }, []);
  return <Flex gap={8} valign="middle">
    <Avatar src={me.avatar} size={16} />
    <Dropdown menu={{ 
      items: me.id > 0 ? loginedMenus : unLoginedMenus,
      onClick: e => onClick(e.key),
    }} placement="bottomRight">
      <Typography.Text onClick={(e) => e.preventDefault()} className={styles.user}>
        <Space size={4}>
          {me.nickname || '未登录'}
          <CaretDownOutlined className={styles.icon} />
        </Space>
      </Typography.Text>
    </Dropdown>
  </Flex>
}