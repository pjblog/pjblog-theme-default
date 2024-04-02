import { PropsWithoutRef } from "react";
import { IArchivePageProps } from "../types";
import { useHTML } from "../html";
import { Layout } from "../layout";
import { Col, Pagination, Row } from "antd";
import { Media } from "../home";
import { User } from "../components/user";
import { SideList } from "../components/side-list";

export default function (props: PropsWithoutRef<IArchivePageProps>) {
  const html = useHTML();
  return <Layout
    title={html.title}
    description={html.description}
    categories={props.categories}
    currentCategory={props.location.query.category}
    url={props.location.url}
    icp={html.icp}
    theme={html.theme}
  >
    <Row gutter={40}>
      <Col span={17}>
        <Row gutter={[0, 48]}>
          {
            props.medias.data.map(media => {
              return <Col span={24} key={media.token}>
                <Media {...media} />
              </Col>
            })
          }
          <Col span={24}>
            <Pagination
              current={props.location.query.page}
              pageSize={props.medias.size}
              total={props.medias.total}
              onChange={page => {
                const URI = new URL('http://localhost' + props.location.url);
                URI.searchParams.set('page', page + '');
                window.location.href = URI.pathname + URI.search;
              }}
            />
          </Col>
        </Row>
      </Col>
      <Col span={7}>
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <User value={props.me} url={props.location.url} />
          </Col>
          <Col span={24}>
            <SideList value={props.hots} title="热门文章" />
          </Col>
          <Col span={24}>
            <SideList value={props.latests} title="最新文章" />
          </Col>
        </Row>
      </Col>
    </Row>
  </Layout>
}