import * as yargs from 'yargs';

yargs
  .options({
    'r': {
      alias: 'role',
      default: '@everyone',
      description: 'Role to be muted',
      array: true,
    }
  })
  .help();

export default yargs;