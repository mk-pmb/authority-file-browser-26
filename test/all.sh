#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-


function run_all_tests_cli_init () {
  export LANG{,UAGE}=en_US.UTF-8  # make error messages search engine-friendly
  local REPOPATH="$(readlink -m -- "$BASH_SOURCE"/../..)"
  # cd -- "$REPOPATH" || return $?

  echo W: "$0: stub!" >&2
}










run_all_tests_cli_init "$@"; exit $?
