import { PropsWithChildren, useCallback, useEffect, useRef } from "react";

export function Link(props: PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) {
  const ref = useRef<HTMLAnchorElement>();
  const { children, href, ...extras } = props;
  useEffect(() => {
    if (ref.current) {
      const handler = (e: MouseEvent) => {
        if (!href) {
          e.preventDefault();
        }
      }
      ref.current.addEventListener('click', handler);
      return () => ref.current && ref.current.removeEventListener('click', handler);
    }
  }, [href]);
  return <a ref={ref} href={href || ''} {...extras}>{children}</a>
}