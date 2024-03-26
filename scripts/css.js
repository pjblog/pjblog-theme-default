import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { extractStyle } from '@ant-design/static-style-extract';

const css = extractStyle();

writeFileSync(resolve('dist/assets/antd.min.css'), css);
