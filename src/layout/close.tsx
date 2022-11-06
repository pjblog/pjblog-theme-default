import React from 'react';
import { Result, Button, Typography } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

export function Close() {
  return <Result
    status="error"
    title="网站关闭"
    subTitle="由于某些特殊原因，网站暂时关闭，请联系管理员！"
    // extra={[
    //   <Button type="primary" key="console">
    //     Go Console
    //   </Button>,
    //   <Button key="buy">Buy Again</Button>,
    // ]}
  >
    {/* <div className="desc">
      <Paragraph>
        <Text
          strong
          style={{
            fontSize: 16,
          }}
        >
          The content you submitted has the following error:
        </Text>
      </Paragraph>
      <Paragraph>
        <CloseCircleOutlined className="site-result-demo-error-icon" /> Your account has been
        frozen. <a>Thaw immediately &gt;</a>
      </Paragraph>
      <Paragraph>
        <CloseCircleOutlined className="site-result-demo-error-icon" /> Your account is not yet
        eligible to apply. <a>Apply Unlock &gt;</a>
      </Paragraph>
    </div> */}
  </Result>
}