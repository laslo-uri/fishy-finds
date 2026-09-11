# Full FishyFinds live smoke — guest + all seed roles + write paths.
# Prerequisites: app at http://localhost:8080
# Usage: .\scripts\full-smoke.ps1

$ErrorActionPreference = 'Continue'
$base = 'http://localhost:8080'
$fail = 0
$pass = 0

function Ok($name, $cond, $extra = '') {
    if ($cond) {
        Write-Host ("PASS  {0} {1}" -f $name, $extra)
        $script:pass++
    } else {
        Write-Host ("FAIL  {0} {1}" -f $name, $extra)
        $script:fail++
    }
}

function Auth($email) {
    $tok = Invoke-RestMethod -Uri "$base/api/signIn" -Method Post -ContentType 'application/json' -Body (@{ email = $email; password = 'password' } | ConvertTo-Json)
    return (@{ accessToken = $tok.accessToken } | ConvertTo-Json -Compress)
}

Write-Host '=== Guest catalogs ==='
foreach ($p in @('/api/allBungalows', '/api/allBoats', '/api/allCourses')) {
    $r = Invoke-WebRequest -Uri "$base$p" -UseBasicParsing
    Ok "GET $p" ($r.StatusCode -eq 200 -and $r.Content.Length -gt 100) ("bytes=" + $r.Content.Length)
}

Write-Host '=== Logins ==='
$roles = @{
    CUSTOMER   = 'mail@mail.com'
    BUNGALOW   = 'zokaMagic@mail.com'
    BOAT       = 'zokiSumi@mail.com'
    INSTRUCTOR = 'vesnaVuki@mail.com'
    ADMIN      = 'admin@admin.com'
}
$auth = @{}
foreach ($k in $roles.Keys) {
    try {
        $auth[$k] = Auth $roles[$k]
        Ok "LOGIN $k" ($auth[$k] -match 'accessToken')
    } catch {
        Ok "LOGIN $k" $false $_.Exception.Message
    }
}

Write-Host '=== Customer ==='
$cust = $auth['CUSTOMER']
foreach ($p in @('/api/upcomingReservationsForCustomer', '/api/getPenalForUser', '/api/getSubscriptionsByUser', '/api/allPassedReservationsForCustomerWithoutDuplicatedOffers')) {
    try {
        $r = Invoke-WebRequest -Uri "$base$p" -Headers @{ Authorization = $cust } -UseBasicParsing
        Ok "CUSTOMER $p" ($r.StatusCode -eq 200) ("bytes=" + $r.Content.Length)
    } catch { Ok "CUSTOMER $p" $false $_.Exception.Message }
}
$hist = Invoke-WebRequest -Uri "$base/api/historyOfReservationsForCustomer" -Method Post -Headers @{ Authorization = $cust } -ContentType 'application/json' -Body (@{ offerType = 'BUNGALOW' } | ConvertTo-Json) -UseBasicParsing
Ok 'CUSTOMER history BUNGALOW' ($hist.StatusCode -eq 200) ("bytes=" + $hist.Content.Length)

$start = '2027-06-10T12:00:00'
$filter = @{ duration = '2'; start = $start; offerType = 'BUNGALOW'; numberOfPeople = '2' } | ConvertTo-Json
$ft = Invoke-WebRequest -Uri "$base/api/filterAvailableTerms" -Method Post -Headers @{ Authorization = $cust } -ContentType 'application/json' -Body $filter -UseBasicParsing
Ok 'CUSTOMER filterAvailableTerms' ($ft.StatusCode -eq 200 -and $ft.Content.Length -gt 2) ("bytes=" + $ft.Content.Length)

Write-Host '=== Owners / instructor ==='
$bung = $auth['BUNGALOW']
$boat = $auth['BOAT']
$inst = $auth['INSTRUCTOR']
$myB = Invoke-RestMethod -Uri "$base/api/allMyBungalows" -Headers @{ Authorization = $bung }
$myBoat = Invoke-RestMethod -Uri "$base/api/allMyBoats" -Headers @{ Authorization = $boat }
$myC = Invoke-RestMethod -Uri "$base/api/allMyCourses" -Headers @{ Authorization = $inst }
Ok 'BUNGALOW allMyBungalows' ($myB.Count -gt 0) ("count=" + $myB.Count)
Ok 'BOAT allMyBoats' ($myBoat.Count -gt 0) ("count=" + $myBoat.Count)
Ok 'INSTRUCTOR allMyCourses' ($myC.Count -gt 0) ("count=" + $myC.Count)

$bId = $myB[0].id
$boatId = $myBoat[0].id
$cId = $myC[0].id

foreach ($pair in @(
    @{ A = $bung; N = 'bung'; Id = $bId },
    @{ A = $boat; N = 'boat'; Id = $boatId },
    @{ A = $inst; N = 'course'; Id = $cId }
)) {
    $terms = Invoke-RestMethod -Uri "$base/api/getTermsByOfferId/$($pair.Id)" -Headers @{ Authorization = $pair.A }
    Ok ("TERMS $($pair.N)") ($terms.Count -gt 0) ("count=" + $terms.Count)
}

# add term
$termBody = @{
    startTime = (Get-Date).AddDays(90).ToString('yyyy-MM-ddTHH:mm:ss')
    endTime   = (Get-Date).AddDays(100).ToString('yyyy-MM-ddTHH:mm:ss')
} | ConvertTo-Json
$addTerm = Invoke-WebRequest -Uri "$base/api/addNewTermToOffer/$bId" -Method Post -Headers @{ Authorization = $bung } -ContentType 'application/json' -Body $termBody -UseBasicParsing
Ok 'BUNGALOW addNewTerm' ($addTerm.Content -eq 'true') $addTerm.Content

# quick action
$qa = @{
    offerId = "$bId"; startDate = (Get-Date).AddDays(110).ToString('yyyy-MM-ddTHH:mm:ss')
    duration = '2'; numberOfPeople = '2'; totalPrice = '180'; discount = '5'; additionalServices = 'smoke'
} | ConvertTo-Json
$qaR = Invoke-WebRequest -Uri "$base/api/createQuickAction" -Method Post -Headers @{ Authorization = $bung } -ContentType 'application/json' -Body $qa -UseBasicParsing
Ok 'BUNGALOW createQuickAction' ($qaR.Content -eq 'true') $qaR.Content
$acts = Invoke-WebRequest -Uri "$base/api/getActionsForOffer" -Method Post -Headers @{ Authorization = $bung } -ContentType 'application/json' -Body (@{ id = "$bId" } | ConvertTo-Json) -UseBasicParsing
Ok 'BUNGALOW getActionsForOffer' ($acts.StatusCode -eq 200 -and $acts.Content.Length -gt 2) ("bytes=" + $acts.Content.Length)

# book for client: scan terms for a free 1-day slot not already reserved
$terms2 = Invoke-RestMethod -Uri "$base/api/getTermsByOfferId/$bId" -Headers @{ Authorization = $bung }
$booked = $false
foreach ($termPick in @($terms2)) {
    $termStart = [datetime]::Parse($termPick.startTime.ToString())
    $termEnd = [datetime]::Parse($termPick.endTime.ToString())
    $candidate = $termStart.AddDays(5)
    if ($candidate.AddDays(1) -ge $termEnd) { continue }
    $bookStart = $candidate.ToString('yyyy-MM-ddTHH:mm:ss')
    $book = @{
        customerEmail = 'mail@mail.com'
        termId = [string]$termPick.id
        offerId = "$bId"
        startDate = $bookStart
        duration = '1'
        numberOfPeople = '1'
        additionalServices = ''
    } | ConvertTo-Json
    try {
        $br = Invoke-WebRequest -Uri "$base/api/makeReservationForClient" -Method Post -Headers @{ Authorization = $bung } -ContentType 'application/json' -Body $book -UseBasicParsing
        if ($br.Content -eq 'true') {
            Ok 'BUNGALOW bookForClient' $true ("term=$($termPick.id) start=$bookStart")
            $booked = $true
            break
        }
    } catch {}
}
if (-not $booked) { Ok 'BUNGALOW bookForClient' $false 'no free slot found' }

# unavailability
$ua = @{
    offerId = "$boatId"
    startDate = (Get-Date).AddDays(130).ToString('yyyy-MM-ddTHH:mm:ss')
    endDate = (Get-Date).AddDays(132).ToString('yyyy-MM-ddTHH:mm:ss')
} | ConvertTo-Json
$uaR = Invoke-WebRequest -Uri "$base/api/offerUnavailability" -Method Post -Headers @{ Authorization = $boat } -ContentType 'application/json' -Body $ua -UseBasicParsing
Ok 'BOAT offerUnavailability' ($uaR.StatusCode -eq 200) ("bytes=" + $uaR.Content.Length)

# instructor quick action
$qa2 = @{
    offerId = "$cId"; startDate = (Get-Date).AddDays(115).ToString('yyyy-MM-ddTHH:mm:ss')
    duration = '1'; numberOfPeople = '3'; totalPrice = '90'; discount = '0'; additionalServices = ''
} | ConvertTo-Json
$qa2R = Invoke-WebRequest -Uri "$base/api/createQuickAction" -Method Post -Headers @{ Authorization = $inst } -ContentType 'application/json' -Body $qa2 -UseBasicParsing
Ok 'INSTRUCTOR createQuickAction' ($qa2R.Content -eq 'true') $qa2R.Content

foreach ($p in @('/api/ownerReservations', '/api/ownerReports', '/api/ownerOffers')) {
    $r = Invoke-WebRequest -Uri "$base$p" -Headers @{ Authorization = $bung } -UseBasicParsing
    Ok "BUNGALOW $p" ($r.StatusCode -eq 200) ("bytes=" + $r.Content.Length)
}

Write-Host '=== Admin ==='
$adm = $auth['ADMIN']
foreach ($p in @(
    '/api/allPendingComplaints', '/api/allPendingFeedbacks', '/api/getAllCreationPendingRequests',
    '/api/allPendingDeletionRequests', '/api/pendingPenalReports', '/api/getAllLoyaltyCategories',
    '/api/allUsers', '/api/allOffersAdmin', '/api/adminIncome', '/api/getSystemCut'
)) {
    try {
        $r = Invoke-WebRequest -Uri "$base$p" -Headers @{ Authorization = $adm } -UseBasicParsing
        Ok "ADMIN $p" ($r.StatusCode -eq 200) ("bytes=" + $r.Content.Length)
    } catch { Ok "ADMIN $p" $false $_.Exception.Message }
}

# loyalty CRUD
$loyName = 'SmokeCat' + (Get-Random -Maximum 9999)
$addL = Invoke-WebRequest -Uri "$base/api/addNewLoyaltyCategory" -Method Post -Headers @{ Authorization = $adm } -ContentType 'application/json' -Body (@{
    categoryName = $loyName; categoryDiscount = '7'; earningRate = '1'; requiredPoints = '999'
} | ConvertTo-Json) -UseBasicParsing
Ok 'ADMIN addLoyalty' ($addL.StatusCode -eq 200)
$cats = Invoke-RestMethod -Uri "$base/api/getAllLoyaltyCategories" -Headers @{ Authorization = $adm }
$created = @($cats) | Where-Object { $_.categoryName -eq $loyName } | Select-Object -First 1
Ok 'ADMIN loyaltyCreated' ($null -ne $created) ("name=$loyName cats=$($cats.Count)")
if ($created) {
    $del = Invoke-WebRequest -Uri "$base/api/deleteLoyaltyCategory" -Method Post -Headers @{ Authorization = $adm } -ContentType 'application/json' -Body (@{ id = [string]$created.id } | ConvertTo-Json) -UseBasicParsing
    Ok 'ADMIN deleteLoyalty' ($del.StatusCode -eq 200 -and $del.Content -eq 'true') $del.Content
}

Write-Host '=== Customer follow + cancel path ==='
# follow first bungalow offer
try {
    $follow = Invoke-WebRequest -Uri "$base/api/addFollower" -Method Post -Headers @{ Authorization = $cust } -ContentType 'application/json' -Body (@{ id = "$bId" } | ConvertTo-Json) -UseBasicParsing
    Ok 'CUSTOMER follow' ($follow.StatusCode -eq 200) $follow.Content
    $subs = Invoke-WebRequest -Uri "$base/api/getSubscriptionsByUser" -Headers @{ Authorization = $cust } -UseBasicParsing
    Ok 'CUSTOMER subscriptions' ($subs.StatusCode -eq 200 -and $subs.Content.Length -gt 2) ("bytes=" + $subs.Content.Length)
} catch { Ok 'CUSTOMER follow' $false $_.Exception.Message }

# reserve via filter if available (try a few slots)
$termsFilter = $null
try { $termsFilter = $ft.Content | ConvertFrom-Json } catch {}
$reserved = $false
if ($termsFilter) {
    foreach ($t in @($termsFilter) | Select-Object -First 8) {
        $reserveStart = ([datetime]::Parse($t.startTime.ToString())).AddDays(4).ToString('yyyy-MM-ddTHH:mm:ss')
        $payload = @{
            termId = [string]$t.id
            offerId = [string]$t.offer.id
            startDate = $reserveStart
            duration = '2'
            numberOfPeople = '2'
            additionalServices = ''
        } | ConvertTo-Json -Depth 5
        try {
            $res = Invoke-WebRequest -Uri "$base/api/makeReservation" -Method Post -Headers @{ Authorization = $cust } -ContentType 'application/json' -Body $payload -UseBasicParsing
            if ($res.Content -eq 'true') {
                Ok 'CUSTOMER makeReservation' $true ("term=$($t.id) start=$reserveStart")
                $reserved = $true
                $up = Invoke-RestMethod -Uri "$base/api/upcomingReservationsForCustomer" -Headers @{ Authorization = $cust }
                $mine = @($up) | Where-Object { $_.startDate -and ([datetime]::Parse($_.startDate.ToString()).ToString('yyyy-MM-ddTHH:mm:ss') -eq $reserveStart) } | Select-Object -First 1
                if (-not $mine) { $mine = @($up) | Select-Object -Last 1 }
                if ($mine -and $mine.id) {
                    $cancelStart = [datetime]::Parse($mine.startDate.ToString())
                    if ($cancelStart -gt (Get-Date).AddDays(4)) {
                        $cr = Invoke-WebRequest -Uri "$base/api/cancelReservation" -Method Post -Headers @{ Authorization = $cust } -ContentType 'application/json' -Body (@{ id = [string]$mine.id } | ConvertTo-Json) -UseBasicParsing
                        Ok 'CUSTOMER cancelReservation' ($cr.Content -eq 'true') $cr.Content
                    } else {
                        Ok 'CUSTOMER cancelReservation' $true 'skipped (start too soon)'
                    }
                } else {
                    Ok 'CUSTOMER cancelReservation' $false 'no upcoming row'
                }
                break
            }
        } catch {}
    }
}
if (-not $reserved) { Ok 'CUSTOMER makeReservation' $false 'no free filtered slot' }

Write-Host '=== SPA routes ==='
foreach ($p in @('/', '/bungalows', '/boats', '/courses', '/sign-in', '/make-reservation', '/my-bungalows', '/my-boats', '/my-courses', '/owner-calendar', '/owner-reports', '/admin', '/admin/registrations', '/admin/complaints', '/admin/reviews', '/admin/penalties', '/admin-loyalty', '/admin-income', '/profile', '/following')) {
    try {
        $r = Invoke-WebRequest -Uri "$base$p" -UseBasicParsing -TimeoutSec 10
        Ok "SPA $p" ($r.StatusCode -eq 200)
    } catch { Ok "SPA $p" $false $_.Exception.Message }
}

Write-Host ''
Write-Host ("SUMMARY pass={0} fail={1}" -f $pass, $fail)
if ($fail -gt 0) { exit 1 } else { exit 0 }
