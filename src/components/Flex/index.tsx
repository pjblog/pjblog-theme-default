import React, { useMemo } from 'react';
import classnames from 'classnames';
import styles from './index.module.less';

export type FlexAlign = 'left' | 'center' | 'right' | 'between' | 'around' | 'evenly';
export type FlexValign = 'top' | 'middle' | 'bottom' | 'stretch' | 'baseline';
export type FlexDirection = 'horizontal' | 'vertical';
export type FlexWrap = 'nowrap' | 'wrap' | 'reverse';
export type FlexScroll = 'x' | 'y' | 'both' | 'hide';

const EAlign = {
  left: styles['fx-a-l'],
  center: styles['fx-a-c'],
  right: styles['fx-a-r'],
  between: styles['fx-a-b'],
  around: styles['fx-a-a'],
  evenly: styles['fx-a-e'],
}

const EValign = {
  top: styles['fx-v-t'],
  middle: styles['fx-v-m'],
  bottom: styles['fx-v-b'],
  stretch: styles['fx-v-s'],
  baseline: styles['fx-v-l'],
}

const EAlignX = {
  left: styles['fx-v-t'],
  center: styles['fx-v-m'],
  right: styles['fx-v-b'],
  between: styles['fx-a-c-b'],
  around: styles['fx-a-c-a'],
  evenly: styles['fx-a-c-e'],
}

const EValignX = {
  top: styles['fx-a-l'],
  middle: styles['fx-a-c'],
  bottom: styles['fx-a-r'],
  stretch: styles['fx-a-b'],
  baseline: styles['fx-a-a'],
}

const EDirection = {
  horizontal: styles['fx-d-h'],
  vertical: styles['fx-d-v'],
}

const EWrap = {
  nowrap: styles['fx-w-n'],
  wrap: styles['fx-w-w'],
  reverse: styles['fx-w-r'],
}

const EScroll = {
  x: styles['fx-s-x'],
  y: styles['fx-s-y'],
  both: styles['fx-s-b'],
  hide: styles['fx-s-h'],
}

export function Flex(props: React.PropsWithChildren<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  align?: FlexAlign,
  valign?: FlexValign,
  direction?: FlexDirection,
  wrap?: FlexWrap,
  scroll?: FlexScroll,
  gap?: number | [number, number],
  span?: number,
  block?: boolean,
  full?: boolean,
}>) {
  const { align, valign, direction, wrap, scroll, gap, span, block, full, style, ...extras } = props;
  const directionClassName = EDirection[direction || 'horizontal'];
  const isVertical = direction === 'vertical';
  const alignClassName = isVertical ? EAlignX[align || 'left'] : EAlign[align || 'left'];
  const valignClassName = isVertical ? EValignX[valign || 'top'] : EValign[valign || 'top'];
  const wrapClassName = EWrap[wrap];
  const scrollClassName = EScroll[scroll];

  const classes = classnames(
    styles.fx,
    props.className,
    directionClassName,
    alignClassName,
    valignClassName,
    wrapClassName,
    scrollClassName,
    props.block ? styles['fx-b'] : undefined,
    props.full ? styles['fx-f'] : undefined,
    props.span ? styles['fx-s-' + props.span] : undefined
  );

  const _gap = useMemo<[number, number]>(() => {
    return props.gap === undefined
      ? [0, 0]
      : Array.isArray(props.gap)
        ? props.gap
        : [props.gap, 0];
  }, [props.gap]);

  const _styles = useMemo(() => {
    const s = style || {}
    return {
      ...s,
      rowGap: _gap[1],
      columnGap: _gap[0],
    }
  }, [_gap]);

  return <div {...extras} className={classes} style={_styles}>{props.children}</div>
}