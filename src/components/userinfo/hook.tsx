import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getUserInfo, createNewUserInfoState, userLogout, userLogin, userRegister, userProfile, userPassword } from './service';
import { useAsync, useAsyncCallback } from '@codixjs/fetch';
import { useRequestConfigs } from '../request';
import { redirect, replace } from '@codixjs/codix';

export const UserInfoContext = createContext(createNewUserInfoState());
export const UserActionContext = createContext<{ reload: () => void }>({
  reload: () => {},
});

export function UserInfoProvider(props: React.PropsWithChildren<{}>) {
  const { data, execute } = useRequestUserInfo();
  return <UserInfoContext.Provider value={data}>
    <UserActionContext.Provider value={{ reload: execute }}>
      {props.children}
    </UserActionContext.Provider>
  </UserInfoContext.Provider>
}

export function useRequestUserInfo() {
  const configs = useRequestConfigs();
  return useAsync(getUserInfo.namespace, () => getUserInfo(configs));
}

export function useUserInfo() {
  return useContext(UserInfoContext);
}

export function useUserAction() {
  return useContext(UserActionContext);
}

export function useLogout() {
  const { reload } = useUserAction();
  const { loading, execute } = useAsyncCallback(userLogout);
  const logout = useCallback(() => execute().then(reload), [execute, reload]);

  return {
    loading,
    logout,
  }
}

export function useLogin() {
  const { reload } = useUserAction();
  const [account, setAccount] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const { loading, execute } = useAsyncCallback(userLogin);
  const submit = useCallback(
    () => execute(account, password).then(reload), 
    [execute, account, password, reload]
  );

  return {
    account, setAccount,
    password, setPassword,
    loading, submit,
  }
}

export function useLoginLocation() {
  return {
    redirect: useCallback(() =>redirect('/login'), []),
    replace: useCallback(() => replace('/login'), []),
  }
}

export function useRegister() {
  const { reload } = useUserAction();
  const [account, setAccount] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const [confirmPassword, setConfirmPassword] = useState<string>(null);
  const { loading, execute } = useAsyncCallback(userRegister);

  const submit = useCallback(() => {
    if (!account) return Promise.reject(new Error('请输入账号'));
    if (!password) return Promise.reject(new Error('请输入密码'));
    if (password !== confirmPassword) return Promise.reject(new Error('两次输入的密码不一致'));
    return execute(account, password).then(reload)
  }, [account, password, confirmPassword, execute, reload]);

  return {
    account, setAccount,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    loading, submit,
  }
}

export function useRegisterLocation() {
  return {
    redirect: useCallback(() =>redirect('/register'), []),
    replace: useCallback(() => replace('/register'), []),
  }
}

export function useProfile() {
  const user = useUserInfo();
  const { reload } = useUserAction();
  const [nickname, setNickname] = useState<string>(user.nickname);
  const [email, setEmail] = useState<string>(user.email);
  const [avatar, setAvatar] = useState<string>(user.avatar);
  const { loading, execute } = useAsyncCallback(userProfile);

  const submit = useCallback(() => {
    if (!nickname) return Promise.reject(new Error('请输入昵称'));
    if (!email) return Promise.reject(new Error('请输入邮箱'));
    return execute(nickname, email, avatar).then(reload);
  }, [nickname, email, execute, avatar, reload]);

  useEffect(() => {
    setNickname(user.nickname);
    setEmail(user.email);
    setAvatar(user.avatar);
  }, [user.nickname, user.email, user.avatar]);

  return {
    nickname, setNickname,
    email, setEmail,
    avatar, setAvatar,
    loading, submit,
  }
}

export function useProfileLocation() {
  return {
    redirect: useCallback(() =>redirect('/profile'), []),
    replace: useCallback(() => replace('/profile'), []),
  }
}

export function usePassword() {
  const { reload } = useUserAction();
  const [oldPassword, setOldPassword] = useState<string>(null);
  const [newPassword, setNewPassword] = useState<string>(null);
  const [comPassword, setComPassword] = useState<string>(null);
  const { loading, execute } = useAsyncCallback(userPassword);

  const submit = useCallback(() => {
    if (!oldPassword) return Promise.reject(new Error('请输入旧密码'));
    if (!newPassword) return Promise.reject(new Error('请输入新密码'));
    if (newPassword !== comPassword) return Promise.reject(new Error('两次输入的密码不一致'));
    return execute(oldPassword, newPassword, comPassword).then(reload);
  }, [oldPassword, newPassword, comPassword, execute, reload]);

  return {
    oldPassword, setOldPassword,
    newPassword, setNewPassword,
    comPassword, setComPassword,
    loading, submit,
  }
}

export function usePasswordLocation() {
  return {
    redirect: useCallback(() =>redirect('/password'), []),
    replace: useCallback(() => replace('/password'), []),
  }
}