import React from 'react';
import styles from './index.module.less';
import { useArticles, useArticlesLocation, useArticlesQuery } from '../../components';
import { Spin, Pagination, Row, Col, Divider } from 'antd';
import { Article } from './article';
export default function Welcome() {
  const { page, size } = useArticlesQuery();
  const { data, loading } = useArticles();
  const location = useArticlesLocation();
  return <Row gutter={[24, 24]}>
    <Col span={24}>
      当前分类：{data.category || '-'}
      <Divider type="vertical" />
      当前标签：{data.tag || '-'}
    </Col>
    <Col span={24}>
      <Spin spinning={loading}>
        {
          data.list.map(chunk => {
            return <Article {...chunk} key={chunk.id} />
          })
        }
      </Spin>
    </Col>
    <Col span={24}>
      <Pagination 
        current={page} 
        pageSize={size} 
        total={data.total} 
        onChange={(page, size) => location.redirect({ page, size })} 
      />
    </Col>
  </Row>
}