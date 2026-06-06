@echo off
echo =====================================================
echo  Flipkart Gridlock 2.0 — Traffic Intelligence Hub
echo =====================================================
echo.
echo Choose launch mode:
echo   1. Open HTML Dashboard in browser (file://, no server)
echo   5. Localhost Dashboard (http://localhost:8080)  ^<-- recommended
echo   2. Launch Streamlit Data Analysis App
echo   3. Launch FastAPI Backend (REST + WebSocket on port 8000)
echo   4. Full Stack: API + Dashboard
echo.
set /p choice="Enter 1-5: "

if "%choice%"=="5" (
    echo Starting local server on http://localhost:8080
    start "" "http://localhost:8080"
    cd /d "%~dp0"
    python -m http.server 8080
) else if "%choice%"=="1" (
    echo Opening HTML Dashboard...
    start "" "%~dp0index.html"
) else if "%choice%"=="2" (
    echo Starting Streamlit app...
    echo.
    echo Install dependencies first? (y/n)
    set /p install="Enter y/n: "
    if "%install%"=="y" (
        python -m pip install -r "%~dp0requirements.txt"
    )
    echo.
    echo Launching Streamlit on http://localhost:8501
    cd /d "%~dp0"
    python -m streamlit run app.py --server.port 8501 --browser.gatherUsageStats false
) else if "%choice%"=="3" (
    echo Starting FastAPI backend...
    cd /d "%~dp0backend"
    python -m pip install -r requirements.txt -q
    echo API docs: http://localhost:8000/docs
    echo WebSocket: ws://localhost:8000/ws/live-feed
    python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
) else if "%choice%"=="4" (
    echo Starting Full Stack...
    start "Gridlock API" cmd /k "cd /d %~dp0backend && python -m pip install -r requirements.txt -q && python -m uvicorn main:app --port 8000"
    timeout /t 3 /nobreak >nul
    start "" "%~dp0index.html"
    echo Dashboard opened. API running on http://localhost:8000
) else (
    echo Invalid choice.
)
pause
