import styles from './index.module.less';
import dayjs from 'dayjs';
import classnames from 'classnames';
import { useArticle, IArticleHeaded, transformHeadings } from '@pjblog/hooks';
import { useRequestParam } from '@codixjs/codix';
import { Result, Button, Typography, Anchor, Tag, Divider } from 'antd';
import { Flex, useCategorySetter } from '../../components';
import { Fragment, PropsWithChildren, PropsWithoutRef, useEffect, useMemo } from 'react';
import { usePath } from '../../hooks';

const { Link } = Anchor;

export default function Article() {
  const code = useRequestParam<string>('code');
  const setCategory = useCategorySetter();  
  const { data, error } = useArticle(code);
  const headings = useMemo(() => transformHeadings(data.headings), [data.headings]);
  const ARTICLE = usePath('ARTICLE');

  useEffect(() => {
    setCategory(data.category.id);
    return () => setCategory(0);
  },[data.category.id])

  if (error) {
    return <Result
      status="error"
      title={error.code}
      subTitle={error.message}
      extra={[
        <Button type="primary" key="back" onClick={() => window.history.go(-1)}>
          返回
        </Button>,
      ]}
    ></Result>
  }

  return <div className={styles.article}>
    <Typography.Title level={2} className={styles.title}>{data.title}</Typography.Title>
    <div dangerouslySetInnerHTML={{ __html: data.html }} className={classnames('markdown', styles.html)}></div>
    <div className={styles.headings}>
      <Anchor>
        <Links dataSource={headings} />
      </Anchor>
    </div>

    <Divider orientation="left" plain>
      文章信息
    </Divider>
    <div className={styles.extras}>
      {!!data.prev && <Item title="上一篇">
        <Typography.Link onClick={() => ARTICLE.redirect({ code: data.prev.code })}>{data.prev.title}[{data.prev.reads}]</Typography.Link>
      </Item>}
      <Item title="MD5">{data.md5}</Item>
      <Item title="阅读量">{data.readCount}</Item>
      <Item title="分类"><Typography.Link>{data.category.name}</Typography.Link></Item>
      <Item title="标签">
        {
          data.tags.map(tag => {
            return <Tag key={tag.id}>{tag.name}</Tag>
          })
        }
      </Item>
      <Item title="来源">
        {
          data.original
            ? '原创'
            : <Typography.Link href={data.from} target="_blank">{data.from}</Typography.Link>
        }
      </Item>
      <Item title="创建时间">{dayjs(data.ctime).format('YYYY-MM-DD HH:mm:ss')}</Item>
      <Item title="修改时间">{dayjs(data.mtime).format('YYYY-MM-DD HH:mm:ss')}</Item>
      {!!data.next && <Item title="下一篇">
        <Typography.Link onClick={() => ARTICLE.redirect({ code: data.next.code })}>{data.next.title}[{data.next.reads}]</Typography.Link>
      </Item>}
    </div>
  </div>
}

function Links(props: PropsWithoutRef<{ dataSource: IArticleHeaded[] }>) {
  if (!props.dataSource.length) return;
  return <Fragment>
    {
      props.dataSource.map(chunk => {
        return <Link href={'#' + chunk.id} title={chunk.name} key={chunk.id}>
          <Links dataSource={chunk.children} />
        </Link>
      })
    }
  </Fragment>
}

function Item(props: PropsWithChildren<{ title: string }>) {
  return <Flex block valign="middle" className={styles.item} gap={12}>
    <div className={styles.label}>{props.title}</div>
    <div className={styles.text}>{props.children}</div>
  </Flex>
}