@echo OFF
echo BaconBoxFlashExporter flex application runner script
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

set PATH=%FLEX_SDK%\bin\;%PATH%
@echo on

adl.exe src/application.xml

@echo off
endlocal
PAUSE
@echo on

