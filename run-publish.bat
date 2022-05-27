call run-tsc.bat
if  errorlevel 1 goto ERROR_TSC

call yarn build
if  errorlevel 1 goto ERROR_BUILD

call run-test.bat
if  errorlevel 1 goto ERROR_TEST

call npm version patch --no-git-tag-version
call npm publish
goto SUCCESS

:ERROR_TSC
echo TSC FAILED

:ERROR_TEST
echo TEST FAILED

:ERROR_BUILD
echo BUILD FAILED

:SUCCESS