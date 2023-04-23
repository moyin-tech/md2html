import fs from 'fs-extra';
import path from 'path';
import minimist, { ParsedArgs } from 'minimist';
import { createMarkdownRenderer } from './markdown';

export interface RunArgvs extends Omit<ParsedArgs, '_'> {
  version?: string
  source?: string
}
export interface PackageJson {
	engines: {
		node: string;
	};
	version: string;
}
export function run(opts = {} as Omit<RunArgvs, '_'>) {
  const argvs = minimist<RunArgvs>(process.argv.slice(2), {
    alias: {
      help: 'h',
      version: 'v',
      source: 's'
    },
    default: {
      version: opts.v || opts.version || false,
      help: opts.v || opts.version || false,
      source: opts.s || opts.source || 'README.md',
    }
  })
  if (argvs.h || argvs.help) {
    console.log(`${cliHelp}${exampleHelp}`);
    return;
  }
  if (argvs.v || argvs.version) {
    console.log((require('../package.json') as PackageJson).version)
    return;
  }

  const renderer = createMarkdownRenderer('.', {}, '/')
  console.log(renderer.render('# a \n## b \n### c'))
}

export const cliHelp: string = `\n  Usage: md2html [options] [--help|h]
  Options:\n
    --source, -s            The path of the target file "README.md". Default: "README.md"
    --version, -v           Show version number
    --help, -h              Displays help information.
`;

export const exampleHelp: string =`\n  Example:
    \x1b[35mnpm\x1b[0m md2html
    \x1b[35mnpm\x1b[0m m2h"
    \x1b[35mnpm\x1b[0m md2html \x1b[33m--source\x1b[0m README.md
  
`;
