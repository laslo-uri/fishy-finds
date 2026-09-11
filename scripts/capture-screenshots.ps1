# Capture FishyFinds UI screenshots (guest + authenticated roles).
# Prerequisites: app at http://localhost:8080, Edge/Chrome installed.
# Usage: .\scripts\capture-screenshots.ps1

$ErrorActionPreference = 'Continue'
$outDir = Join-Path $PSScriptRoot '..\docs\screenshots'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$browser = $null
foreach ($candidate in @(
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
)) {
    if (Test-Path $candidate) { $browser = $candidate; break }
}
if (-not $browser) {
    Write-Error 'Edge or Chrome not found.'
    exit 1
}

function Capture-Page([string]$File, [string]$Url, [int]$BudgetMs = 25000) {
    $target = Join-Path $outDir $File
    Write-Host "Capturing $Url -> $File"
    $argLine = "--headless=new --disable-gpu --hide-scrollbars --window-size=1280,800 --virtual-time-budget=$BudgetMs --screenshot=`"$target`" `"$Url`""
    cmd /c "`"$browser`" $argLine >nul 2>&1"
    if (Test-Path $target) {
        Write-Host ("  {0} bytes" -f (Get-Item $target).Length)
    } else {
        Write-Warning "Missing screenshot file $File"
    }
}

Write-Host "Browser: $browser"
Write-Host "Output:  $outDir"

$guest = @(
    @{ File = '01-guest-home.png'; Url = 'http://localhost:8080/'; Budget = 15000 },
    @{ File = '02-bungalows.png'; Url = 'http://localhost:8080/bungalows'; Budget = 40000 },
    @{ File = '03-sign-in.png'; Url = 'http://localhost:8080/sign-in'; Budget = 12000 },
    @{ File = '13-boats-catalog.png'; Url = 'http://localhost:8080/boats'; Budget = 40000 },
    @{ File = '14-courses-catalog.png'; Url = 'http://localhost:8080/courses'; Budget = 40000 }
)
foreach ($page in $guest) { Capture-Page $page.File $page.Url $page.Budget }

$sessionPages = @(
    @{ File = '04-make-reservation.png'; Email = 'mail@mail.com'; Redirect = '/make-reservation' },
    @{ File = '05-upcoming.png'; Email = 'mail@mail.com'; Redirect = '/upcoming-reservations' },
    @{ File = '06-owner-bungalows.png'; Email = 'zokaMagic@mail.com'; Redirect = '/my-bungalows' },
    @{ File = '07-owner-calendar.png'; Email = 'zokaMagic@mail.com'; Redirect = '/owner-calendar' },
    @{ File = '08-owner-reports.png'; Email = 'zokaMagic@mail.com'; Redirect = '/owner-reports' },
    @{ File = '15-my-boats.png'; Email = 'zokiSumi@mail.com'; Redirect = '/my-boats' },
    @{ File = '16-my-courses.png'; Email = 'vesnaVuki@mail.com'; Redirect = '/my-courses' },
    @{ File = '09-admin-home.png'; Email = 'admin@admin.com'; Redirect = '/admin' },
    @{ File = '10-admin-registrations.png'; Email = 'admin@admin.com'; Redirect = '/admin/registrations' },
    @{ File = '11-admin-complaints.png'; Email = 'admin@admin.com'; Redirect = '/admin/complaints' },
    @{ File = '12-admin-income.png'; Email = 'admin@admin.com'; Redirect = '/admin-income' }
)

foreach ($page in $sessionPages) {
    $url = "http://localhost:8080/dev-session.html?email=$([uri]::EscapeDataString($page.Email))&password=password&redirect=$([uri]::EscapeDataString($page.Redirect))"
    Capture-Page $page.File $url 40000
}

Write-Host 'Done. Review docs/screenshots/.'
Get-ChildItem $outDir\*.png | Sort-Object Name | ForEach-Object { "{0,-30} {1,8}" -f $_.Name, $_.Length }
