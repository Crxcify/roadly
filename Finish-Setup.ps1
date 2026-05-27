Write-Host "======================================"
Write-Host "  ROADLY - GITHUB ACTIONS FINALIZER"
Write-Host "======================================"
Write-Host ""
Write-Host "Installing Git... (Please click 'Yes' on the administrator prompt if it appears)"
winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements

# Refresh PATH so Git is recognized immediately
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

if (-Not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git might need a terminal restart. Please close this window and run the script again."
    Pause
    exit
}

Write-Host ""
Write-Host "Initializing Git Repository..."
git config --global user.email "you@example.com"
git config --global user.name "LO"
git init
git add .
git commit -m "Initial commit for Android APK build setup"

Write-Host ""
Write-Host "Please go to GitHub.com, create a NEW empty repository, and paste the URL below."
$repoUrl = Read-Host "Repository URL (e.g. https://github.com/username/roadly.git)"

if ($repoUrl) {
    git branch -M main
    git remote add origin $repoUrl
    Write-Host ""
    Write-Host "Pushing to GitHub! A browser window may open to log you in..."
    git push -u origin main
    Write-Host ""
    Write-Host "Done! Go to your GitHub repository -> Actions tab to see your Android APK building right now!"
} else {
    Write-Host "No URL provided, skipping push."
}
Pause
