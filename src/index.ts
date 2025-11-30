import fs from 'fs';
import minimist, { ParsedArgs } from 'minimist';
import { createMarkdownRenderer } from './markdown';

export interface RunArgvs extends Omit<ParsedArgs, '_'> {
  version?: string
  input?: string
  output?: string
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
      input: 'i',
      output: 'o',
    },
    default: {
      version: opts.v || opts.version || false,
      help: opts.v || opts.version || false,
      input: opts.i || opts.input || '',
      output: opts.o || opts.output || ''
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

  if (argvs.i || argvs.input) {
    const markdown = fs.readFileSync(argvs.input).toString()
    const renderer = createMarkdownRenderer('.', {}, '/')
    const html = renderer.render(markdown)
    if (argvs.o || argvs.output) {
      fs.writeFileSync(argvs.output, html)
      console.log('Success')
    } else {
      console.log(html)
    }
  } else {
    console.log('Missing Parameter "input".')
    process.exit(1)
  }
}

export const cliHelp: string = `\n  Usage: md2html [options] [--help|-h]
  Options:\n
    --input, -i            The path of the target file "*.md". Default: ""
    --output, -o            The path of the output file "*.html". Default: ""
    --version, -v           Show version number
    --help, -h              Displays help information.
`;

export const exampleHelp: string =`\n  Example:
    md2html --input README.md
    m2d --input README.md --output README.html
`;
