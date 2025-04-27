#!/bin/sh

BASE="definitions/base"

# This script requires `protoc` to combine protocol definitions into a single binary file.
protoc \
  --proto_path=definitions/base \
  --descriptor_set_out=base.pb \
  --include_imports \
  $BASE/head.proto $BASE/define.proto $BASE/player.proto