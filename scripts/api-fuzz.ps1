param(
  [int]$Port = 3030,
  [int]$WaitSeconds = 120
)

$ErrorActionPreference = "Stop"

function Assert-Code {
  param(
    [Parameter(Mandatory = $true)][string]$Label,
    [Parameter(Mandatory = $true)][string]$Actual,
    [Parameter(Mandatory = $true)][string[]]$Expected
  )
  if ($Expected -notcontains $Actual) {
    throw "${Label}: expected $($Expected -join ', '), got $Actual"
  }
}

function Remove-NextDevLock {
  $lockPath = Join-Path (Get-Location) ".next/dev/lock"
  if (Test-Path $lockPath) {
    Remove-Item $lockPath -Force -ErrorAction SilentlyContinue
  }
}

function CurlOut {
  param(
    [Parameter(Mandatory = $true)][string]$Method,
    [Parameter(Mandatory = $true)][string]$Url,
    [string]$Body,
    [string[]]$Headers = @()
  )

  $args = @("-s", "-L", "-D", "-", "-o", "-", "-X", $Method)
  foreach ($header in $Headers) { $args += @("-H", $header) }
  if ($null -ne $Body) { $args += @("-H", "Content-Type: application/json", "--data-binary", $Body) }
  $args += $Url

  $outRaw = (& curl.exe @args)
  $out = if ($outRaw -is [string]) { $outRaw } else { ($outRaw -join "`n") }
  $lines = $out -split "\r?\n"
  $httpIndexes = @()
  for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "^HTTP/") { $httpIndexes += $i }
  }
  if ($httpIndexes.Count -eq 0) {
    return [pscustomobject]@{ code = "???"; body = $out }
  }

  $httpIdx = $httpIndexes[-1]
  $statusLine = $lines[$httpIdx]
  $parts = $statusLine -split "\s+"
  $code = if ($parts.Length -ge 2) { $parts[1] } else { "???" }

  $blankIdx = -1
  for ($i = $httpIdx; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -eq "") { $blankIdx = $i; break }
  }
  $bodyText = if ($blankIdx -ge 0 -and $blankIdx -lt ($lines.Length - 1)) {
    ($lines[($blankIdx + 1)..($lines.Length - 1)] -join "`n")
  } else {
    ""
  }

  return [pscustomobject]@{ code = $code; body = $bodyText }
}

function Get-EtagHeader {
  param(
    [Parameter(Mandatory = $true)][string]$Url,
    [string[]]$Headers = @()
  )

  $args = @("-s", "-L", "-D", "-", "-o", "NUL")
  foreach ($header in $Headers) { $args += @("-H", $header) }
  $args += $Url
  $hdrRaw = (& curl.exe @args)
  $hdr = if ($hdrRaw -is [string]) { $hdrRaw } else { ($hdrRaw -join "`n") }
  $line = ($hdr -split "\r?\n" | Where-Object { $_ -match "^ETag:" } | Select-Object -Last 1)
  if (-not $line) { return "" }
  return $line.Split(":", 2)[1].Trim()
}

Remove-NextDevLock

$env:USE_DB = "false"
$env:LOG_LEVEL = "debug"

$cwd = (Get-Location).Path
$outFile = Join-Path $env:TEMP "next-dev-$Port-out.log"
$errFile = Join-Path $env:TEMP "next-dev-$Port-err.log"
Remove-Item $outFile -Force -ErrorAction SilentlyContinue
Remove-Item $errFile -Force -ErrorAction SilentlyContinue

$dev = Start-Process -FilePath bun -WorkingDirectory $cwd -ArgumentList @("run", "dev", "--", "-p", "$Port") -PassThru -RedirectStandardOutput $outFile -RedirectStandardError $errFile

$base = "http://localhost:$Port/api/v1"

$ready = $false
$deadline = (Get-Date).AddSeconds($WaitSeconds)
while ((Get-Date) -lt $deadline) {
  if ($dev.HasExited) { break }
  $code = (& curl.exe -s -o NUL -w "%{http_code}" "$base/health")
  if ($code -ne "000") { $ready = $true; break }
  Start-Sleep -Milliseconds 500
}

if (-not $ready) {
  $stderr = if (Test-Path $errFile) { Get-Content $errFile -Raw } else { "" }
  try { Stop-Process -Id $dev.Id -Force -ErrorAction SilentlyContinue } catch {}
  throw "next dev not ready on port $Port. stderr:`n$stderr"
}

$results = New-Object System.Collections.Generic.List[object]

function Add-Result([string]$Label, $Resp) {
  $results.Add([pscustomobject]@{ label = $Label; code = $Resp.code })
}

# --- Health ---
$health = CurlOut -Method "GET" -Url "$base/health"
Add-Result "GET /health" $health
Assert-Code "GET /health" $health.code @("200")

# --- Auth validate ---
$validateNoAuth = CurlOut -Method "POST" -Url "$base/auth/validate"
Add-Result "POST /auth/validate (no auth)" $validateNoAuth
Assert-Code "POST /auth/validate (no auth)" $validateNoAuth.code @("401")

$validateUser = CurlOut -Method "POST" -Url "$base/auth/validate" -Headers @("x-api-key: user-key")
Add-Result "POST /auth/validate (user-key)" $validateUser
Assert-Code "POST /auth/validate (user-key)" $validateUser.code @("200")

$validateEditor = CurlOut -Method "POST" -Url "$base/auth/validate" -Headers @("x-api-key: editor-key")
Add-Result "POST /auth/validate (editor-key)" $validateEditor
Assert-Code "POST /auth/validate (editor-key)" $validateEditor.code @("200")

$validateAdmin = CurlOut -Method "POST" -Url "$base/auth/validate" -Headers @("x-api-key: admin-key")
Add-Result "POST /auth/validate (admin-key)" $validateAdmin
Assert-Code "POST /auth/validate (admin-key)" $validateAdmin.code @("200")

# --- Entries list ---
$listPublic = CurlOut -Method "GET" -Url "$base/entries"
Add-Result "GET /entries" $listPublic
Assert-Code "GET /entries" $listPublic.code @("200")

$listDraftsNoAuth = CurlOut -Method "GET" -Url "$base/entries?includeDrafts=true"
Add-Result "GET /entries?includeDrafts=true (no auth)" $listDraftsNoAuth
Assert-Code "GET /entries?includeDrafts=true (no auth)" $listDraftsNoAuth.code @("401")

$listDraftsUser = CurlOut -Method "GET" -Url "$base/entries?includeDrafts=true" -Headers @("x-api-key: user-key")
Add-Result "GET /entries?includeDrafts=true (user)" $listDraftsUser
Assert-Code "GET /entries?includeDrafts=true (user)" $listDraftsUser.code @("403")

$listDraftsEditor = CurlOut -Method "GET" -Url "$base/entries?includeDrafts=true" -Headers @("x-api-key: editor-key")
Add-Result "GET /entries?includeDrafts=true (editor)" $listDraftsEditor
Assert-Code "GET /entries?includeDrafts=true (editor)" $listDraftsEditor.code @("200")

Add-Result "GET /entries?status=lol" (CurlOut -Method "GET" -Url "$base/entries?status=lol")
Add-Result "GET /entries?sort=lol" (CurlOut -Method "GET" -Url "$base/entries?sort=lol")

# --- Entries create validations ---
$createNoAuth = CurlOut -Method "POST" -Url "$base/entries" -Body '{"title":"t","mediaSource":0,"author":"a"}'
Add-Result "POST /entries (no auth)" $createNoAuth
Assert-Code "POST /entries (no auth)" $createNoAuth.code @("401")

Add-Result "POST /entries invalid JSON" (CurlOut -Method "POST" -Url "$base/entries" -Body '{"title":' -Headers @("x-api-key: editor-key"))
Add-Result "POST /entries slug traversal" (CurlOut -Method "POST" -Url "$base/entries" -Body '{"title":"t","mediaSource":0,"author":"a","slug":"../../etc/passwd"}' -Headers @("x-api-key: editor-key"))
Add-Result "POST /entries mediaSource=999" (CurlOut -Method "POST" -Url "$base/entries" -Body '{"title":"t","mediaSource":999,"author":"a"}' -Headers @("x-api-key: editor-key"))
Add-Result "POST /entries bad date" (CurlOut -Method "POST" -Url "$base/entries" -Body '{"title":"t","mediaSource":0,"author":"a","date":"not-a-date"}' -Headers @("x-api-key: editor-key"))
Add-Result "POST /entries duplicate tags" (CurlOut -Method "POST" -Url "$base/entries" -Body '{"title":"t","mediaSource":0,"author":"a","tags":["x","x"]}' -Headers @("x-api-key: editor-key"))

# Create a unique draft entry (used for GET/PATCH checks only; approve uses seed entry)
$uniq = [guid]::NewGuid().ToString("N").Substring(0, 8)
$createBody = (@{ title = "Break-$uniq"; content = "ok"; mediaSource = 0; author = "me" } | ConvertTo-Json -Compress)
$created = CurlOut -Method "POST" -Url "$base/entries" -Body $createBody -Headers @("x-api-key: editor-key")
Add-Result "POST /entries valid" $created
Assert-Code "POST /entries valid" $created.code @("201")

$slug = (($created.body | ConvertFrom-Json).data.slug)
Add-Result "GET /entries/$slug (no auth)" (CurlOut -Method "GET" -Url "$base/entries/$slug")
Add-Result "GET /entries/$slug (editor)" (CurlOut -Method "GET" -Url "$base/entries/$slug" -Headers @("x-api-key: editor-key"))
Add-Result "GET /entries/not-a-real-slug (no auth)" (CurlOut -Method "GET" -Url "$base/entries/not-a-real-slug")

$etag = Get-EtagHeader -Url "$base/entries/$slug" -Headers @("x-api-key: editor-key")
Add-Result "PATCH /entries/$slug (no auth)" (CurlOut -Method "PATCH" -Url "$base/entries/$slug" -Body '{"title":"x"}')
Add-Result "PATCH /entries/$slug wrong If-Match" (CurlOut -Method "PATCH" -Url "$base/entries/$slug" -Body '{"summary":"x"}' -Headers @("x-api-key: editor-key", 'If-Match: "bogus"'))
Add-Result "PATCH /entries/$slug no If-Match" (CurlOut -Method "PATCH" -Url "$base/entries/$slug" -Body '{"summary":"x"}' -Headers @("x-api-key: editor-key"))
$etag2 = Get-EtagHeader -Url "$base/entries/$slug" -Headers @("x-api-key: editor-key")
Add-Result "PATCH /entries/$slug correct If-Match" (CurlOut -Method "PATCH" -Url "$base/entries/$slug" -Body '{"summary":"x2"}' -Headers @("x-api-key: editor-key", "If-Match: $etag2"))

# --- Approve workflow against a seed draft (stable slug) ---
$seedDraft = "borrador-de-caso-de-exito"
$seedEtag = Get-EtagHeader -Url "$base/entries/$seedDraft" -Headers @("x-api-key: editor-key")
Add-Result "POST /entries/$seedDraft/approve (editor)" (CurlOut -Method "POST" -Url "$base/entries/$seedDraft/approve" -Body '{"approve":true}' -Headers @("x-api-key: editor-key", "If-Match: $seedEtag"))
Add-Result "POST /entries/$seedDraft/approve (admin correct If-Match)" (CurlOut -Method "POST" -Url "$base/entries/$seedDraft/approve" -Body '{"approve":true}' -Headers @("x-api-key: admin-key", "If-Match: $seedEtag"))
Add-Result "POST /entries/$seedDraft/approve (admin revert)" (CurlOut -Method "POST" -Url "$base/entries/$seedDraft/approve" -Body '{"approve":false}' -Headers @("x-api-key: admin-key"))
Add-Result "POST /entries/unknown/approve (admin)" (CurlOut -Method "POST" -Url "$base/entries/unknown/approve" -Body '{"approve":true}' -Headers @("x-api-key: admin-key"))

# --- Media ---
$signNoAuth = CurlOut -Method "POST" -Url "$base/media/sign" -Body "{}"
Add-Result "POST /media/sign (no auth)" $signNoAuth
Assert-Code "POST /media/sign (no auth)" $signNoAuth.code @("401")

$signEditor = CurlOut -Method "POST" -Url "$base/media/sign" -Body "{}" -Headers @("x-api-key: editor-key")
Add-Result "POST /media/sign (editor)" $signEditor
Assert-Code "POST /media/sign (editor)" $signEditor.code @("200")

Add-Result "DELETE /media/delete invalid JSON" (CurlOut -Method "DELETE" -Url "$base/media/delete" -Body '{"public_id":' -Headers @("x-api-key: editor-key"))
Add-Result "DELETE /media/delete not-found" (CurlOut -Method "DELETE" -Url "$base/media/delete" -Body '{"public_id":"not-found"}' -Headers @("x-api-key: editor-key"))
Add-Result "DELETE /media/delete some-id" (CurlOut -Method "DELETE" -Url "$base/media/delete" -Body '{"public_id":"some-id"}' -Headers @("x-api-key: editor-key"))

try { Stop-Process -Id $dev.Id -Force -ErrorAction SilentlyContinue } catch {}
Remove-NextDevLock

$results | Format-Table -AutoSize
