import { PropsWithoutRef } from "react";
import { IArchivePageProps } from "../types";
import { useHTML } from "../html";
import { Layout } from "../layout";
import { Media } from "../home";
import { User } from "../components/user";
import { SideList } from "../components/side-list";
import { Flex } from "../components/Flex";
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.less';

// @ts-ignore
const Paginations = (Pagination?.default || Pagination) as typeof Pagination;

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
    <Flex block gap={48}>
      <Flex span={1} scroll="hide" direction="vertical">
        {props.medias.data.map(media => <Media key={media.token} {...media} />)}
        <Paginations
          current={props.location.query.page}
          pageSize={props.medias.size}
          total={props.medias.total}
          onChange={page => {
            const URI = new URL('http://localhost' + props.location.url);
            URI.searchParams.set('page', page + '');
            window.location.href = URI.pathname + URI.search;
          }}
        />
      </Flex>
      <div className="sidebar">
        <User value={props.me} url={props.location.url} />
        <SideList value={props.hots} title="热门文章" />
        <SideList value={props.latests} title="最新文章" />
      </div>
    </Flex>
  </Layout>
}