@echo off
REM =============================================================
echo Cleaning build...
del /s/f/q build
rmdir build
REM =============================================================
echo Compiling...
md build
tamec .\src\main.tscript -o .\build\module.tame && tamec .\src\main.tscript -o .\build\index.html -js html && tamec .\src\main.tscript -o .\build\index-debug.html -js html-debug
REM =============================================================
echo Done!
