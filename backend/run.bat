@echo off
title Spring Boot Backend Runner
echo Launching local Maven runner...
powershell -ExecutionPolicy Bypass -File "%~dp0run.ps1"
pause
