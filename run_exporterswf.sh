#!/bin/bash

set -e
set -u

if [[ -z "${FLEX_SDK:-}" ]]; then
	export FLEX_SDK="$HOME/opt/flexsdk"
fi
if [[ ! -d "$FLEX_SDK" ]]; then
	echo "Please set FLEX_SDK to the complete path of the Flex SDK."
	echo "Tried: $FLEX_SDK"
	exit 1
fi

@() {
	echo "> $*"
	"$@"
}

export FLEX_HOME=$FLEX_SDK
export PLAYERGLOBAL_HOME="$FLEX_HOME/frameworks/libs/player/"
export TARGET_PLAYER="${TARGET_PLAYER:-14.0}"
if [[ -z "${AIR_CFG:-}" ]]; then
	export AIR_CFG="$FLEX_SDK/frameworks/air-config.xml"
fi

FLEX_COMPILER="$FLEX_SDK/lib/flex-compiler-oem.jar"
MXMLC="$FLEX_SDK/bin/mxmlc"

#cd src
@ "$FLEX_SDK/bin/adl" src/application.xml "$@"
