import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

interface Node {
  value: string
  start: {
    line: number
    column: number
  }
  end: {
    line: number
    column: number
  }
}

export function getRelativePath(code: string) {
  const ast = parse(code, {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    startLine: 0,
    plugins: ['jsx', 'typescript']
  });

  const relativeReg = /\.{1,2}\/.+(?<!.scss)$/;
  const relativePaths: Node[] = [];
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source;
      const value = source.value;
      if (relativeReg.test(value)) {
        const start = source.loc!.start;
        const end = source.loc!.end;
        relativePaths.push({ value, start, end });
      }
    }
  });
  return relativePaths;
}
