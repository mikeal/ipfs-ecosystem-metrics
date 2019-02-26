#!/bin/sh
':' //# comment; exec /usr/bin/env node --experimental-worker "$0" "$@"
const { pull, mkfilter } = require('../gharchive-metrics')
const deps = require('pkg-dependency-network')
const log = require('single-line-log').stdout
const pkg = require('./node_modules/gharchive-metrics/package.json')

const urlOption = yargs => {
  yargs.option('url', {
    desc: 'Cache service URL',
    default: pkg.productionURL
  })
}
const parallelismOption = yargs => {
  yargs.option('parallelism', {
    desc: 'Max number of concurrent requests',
    default: 20
  })
}
const profileOption = yargs => {
  yargs.positional('profile', {
    required: true,
    desc: 'AWS profile name'
  })
}

const pullOptions = yargs => {
  yargs.positional('outputDir', {
    desc: 'Directory to write filtered activity.',
    required: true
  })
}

const ghargs = yargs => {
  yargs.option('ghtoken', {
    default: process.env.GHTOKEN,
    desc: 'GitHub token, defaults to $GHTOKEN'
  })
}

const lioargs = yargs => {
  yargs.option('liotoken', {
    default: process.env.LIOTOKEN,
    desc: 'Libraries.io token, defaults to $LIOTOKEN'
  })
}

const run = async (argv) => {
  // let repos = await deps('ipfs', argv.ghtoken, argv.liotoken, log)
  //  repos = repos.map(r => r.full_name)
  //  let filter = await mkfilter(['type', 'actor.login'], [], repos, argv.profile)
  //  let hash = filter.cid.toBaseEncodedString()
  let hash = 'zdpuAwAs4qSxJXJ89fiN1u1myefZGyvHUfAR1Rqzdj2JtJAex'
  argv.year = '2018'
  argv.filter = hash
  await pull.year(argv)
}

require('yargs') // eslint-ignore-line
  .command({
    command: '$0 <outputDir>',
    desc: 'Run a full regression.',
    builder: yargs => {
      urlOption(yargs)
      pullOptions(yargs)
      parallelismOption(yargs)
      profileOption(yargs)
      ghargs(yargs)
      lioargs(yargs)
    },
    handler: run
  })
  .argv
