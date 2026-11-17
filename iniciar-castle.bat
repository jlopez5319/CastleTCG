
@echo off
title CASTLE TCG

echo ================================
echo       INICIANDO CASTLE TCG
echo ================================

echo Iniciando BACKEND...
start "Castle TCG - Backend" cmd /k "cd /d C:\Users\jose5\Desktop\CastleTCG\backend && node server.js"

timeout /t 3 /nobreak >nul

echo Iniciando FRONTEND...
start "Castle TCG - Frontend" cmd /k "cd /d C:\Users\jose5\Desktop\CastleTCG\frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo Abriendo CASTLE TCG...
start http://localhost:5173

echo.
echo CASTLE TCG INICIADO.
