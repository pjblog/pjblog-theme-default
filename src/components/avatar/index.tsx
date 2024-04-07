import { PropsWithoutRef } from "react";

export function Avatar(props: PropsWithoutRef<{
  src: string,
  size?: number,
  alt?: string,
  shape?: 'circle' | 'square'
}>) {
  return <img src={props.src} alt={props.alt} style={{
    width: props.size || 30,
    height: props.size || 30,
    'borderRadius': props.shape === 'square' ? 3 : '50%'
  }} />
}