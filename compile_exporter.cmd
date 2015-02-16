@echo OFF
echo BaconBoxFlashExporter flex application compiler script
setlocal

REM Some default paths
IF NOT DEFINED FLEX_SDK set FLEX_SDK=C:\opt\flexsdk\

REM Verify it works
IF NOT EXIST %FLEX_SDK% (
	@echo Please set FLEX_SDK to the complete path of the Flex SDK.
	@echo Tried: %FLEX_SDK%
	exit /B 1
)


set FLEX_HOME=%FLEX_SDK%
set PLAYERGLOBAL_HOME=%FLEX_HOME%\frameworks\libs\player\

IF NOT DEFINED TARGET_PLAYER (
	set TARGET_PLAYER=16.0
)

if NOT DEFINED AIR_CFG (
	set AIR_CFG=%FLEX_SDK%\frameworks\air-config.xml
)

set PATH=%FLEX_SDK%\bin\;%PATH%
@echo on

mxmlc -load-config=%AIR_CFG% ^
	+configname=air ^
	-target-player %TARGET_PLAYER% ^
	-include-libraries+=blooddy_crypto.swc ^
	%* ^
	"src\FlexBaconBoxExporter.mxml"

@echo off
endlocal
PAUSE
@echo on

