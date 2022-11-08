import React from 'react';
import { Result } from 'antd';


export function Close() {
  return <Result
    status="error"
    title="网站关闭"
    subTitle="由于某些特殊原因，网站暂时关闭，请联系管理员！"
  />
}