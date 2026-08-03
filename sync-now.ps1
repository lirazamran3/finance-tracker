Set-Location $PSScriptRoot

Get-Content "bank-credentials.env" | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process')
    }
}

node scripts/sync-bank.mjs
Read-Host "Done - press Enter to close"
