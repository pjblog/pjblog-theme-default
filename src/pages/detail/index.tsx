import React, { Suspense } from 'react';
import dayjs from 'dayjs';
import { useArticle, useArticleLocation, useArticlesLocation, useUserInfo } from '../../components';
import styles from './index.module.less';
import { Row, Col, Typography, Divider, Tag } from 'antd';
import { Flex } from '../../lib';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Relative } from './relative';
import { PostCommandBox } from './post-box';

export default function DetailPage() {
  const user = useUserInfo();
  const { data } = useArticle();
  const Article = useArticleLocation();
  const Home = useArticlesLocation();
  return <Row gutter={[24, 12]}>
    <Col span={24}>
      <Typography.Title style={{ marginBottom: 0 }} level={3}>{data.title}</Typography.Title>
    </Col>
    <Col span={24}>
      <span>分类：<Typography.Link onClick={() => Home.redirect({ category: data.category.id })}>{data.category.cate_name}</Typography.Link></span>
      <Divider type="vertical" />
      <span>标签：{
        data.tags.map(tag => <Tag key={tag.id} onClick={() => Home.redirect({ tag: tag.id })}>{tag.name}</Tag>)  
      }</span>
      <Divider type="vertical" />
      <span>阅读量：{data.readCount}</span>
    </Col>
    <Col span={24}>
      <div dangerouslySetInnerHTML={{
        __html: data.html
      }}></div>
    </Col>
    <Col span={24}>
      发表于：{dayjs(data.ctime).format('YYYY-MM-DD HH:mm:ss')}
      <Divider type="vertical" />
      更新于：{dayjs(data.mtime).format('YYYY-MM-DD HH:mm:ss')}
    </Col>
    <Col span={12}>
      {
        !!data.prev && <Flex block align="left" valign="middle" gap={8}>
          <CaretLeftOutlined />
          <span>上一篇：</span>
          <Typography.Link onClick={() => Article.redirect(data.prev.code)}>{data.prev.title}</Typography.Link>
        </Flex>
      }
    </Col>
    <Col span={12}>
      {
        !!data.next && <Flex block align="right" valign="middle" gap={8}>
          <span>下一篇：</span>
          <Typography.Link onClick={() => Article.redirect(data.next.code)}>{data.next.title}</Typography.Link>
          <CaretRightOutlined />
        </Flex>
      }
    </Col>
    <Col span={24}>
      <Suspense fallback="loading...">
        <Relative id={data.id} size={100} />
      </Suspense>
    </Col>
    {
      user.id > 0 && <Col span={24}>
        <PostCommandBox id={data.id} />
      </Col>
    }
  </Row>
}