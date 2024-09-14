import { test } from 'vitest';
import { getRelativePath } from '../src/main';
const path = require('path');
const sep = path.sep;

test('init', () => {
  const code = `
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { Tree, Radio } from 'antd'

// relative start
import { useStore } from '../../store'
import {
  format,
  formatDate,
  formatTime,
  isObject,
  isArray,
  getCookie,
  listToTree
} from '../../../utils'
import interfaceName from './interface'
import logo from '../../../assets/images/logo.png'
// relative end

import './index.scss'
  `;
  const filePath = '/Users/name/Documents/demo/src/pages/Admin/HelloWorld/index.tsx';
  const relativePaths = getRelativePath(code);
  const aliasPaths = relativePaths.map(item => {
    const absolutePath = path.normalize(path.join(path.parse(filePath).dir, item));
    const aliasPath = '@/' + absolutePath.split(`src${sep}`)[1].replace(/\\/g, '/');
    return aliasPath;
  });
  console.log('🚀 ~ file: main.spec.ts ~ line 33 ~ test ~ aliasPaths', aliasPaths);
});
