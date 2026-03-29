<#
Installs the Render CLI on Windows. Attempts npm global install first,
then prints manual instructions if that fails.
#>
try {
    Write-Host "Attempting to install Render CLI via npm (may require admin rights)..."
    npm install -g @render/cli --no-audit --no-fund
    if (Get-Command render -ErrorAction SilentlyContinue) {
        Write-Host "Render CLI installed:" (render --version)
        exit 0
    }
} catch {
    Write-Warning "npm global install failed or Render CLI not available."
}

Write-Host "If the automated install failed, install Render CLI manually:"
Write-Host "  1) Follow instructions: https://render.com/docs/deploying#using-the-render-cli"
Write-Host "  2) On Windows you can use npm or WSL. Example (PowerShell as Admin):"
Write-Host "     npm install -g @render/cli"

