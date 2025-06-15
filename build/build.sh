#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-


function build_cli_init () {
  export LANG{,UAGE}=en_US.UTF-8  # make error messages search engine-friendly
  local REPOPATH="$(readlink -m -- "$BASH_SOURCE"/../..)"
  cd -- "$REPOPATH" || return $?

  # [ dist/deps.min.mjs -nt src/deps.bundle.js ] ||
  nodejs build/deps.pack.js || return $?
}










build_cli_init "$@"; exit $?
