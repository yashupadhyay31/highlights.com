$path133 = 'C:\Users\Yash Upadhyay\.gemini\antigravity-ide\brain\e5c9b22c-5634-44f2-823e-6dba6cfbcb78\.system_generated\steps\133\content.md'
$raw133 = Get-Content $path133 -Raw

# 1. Extract Country Labels (NAME, LABEL_X, LABEL_Y)
$patternProps = '"NAME":"([^"]+)".*?"LABEL_X":([-\d\.]+).*?"LABEL_Y":([-\d\.]+)'
$matchesProps = [regex]::Matches($raw133, $patternProps)
$countryLabels = @()
$seenNames = @{}

foreach ($m in $matchesProps) {
    $name = $m.Groups[1].Value
    $lx = [double]$m.Groups[2].Value
    $ly = [double]$m.Groups[3].Value
    if (-not $seenNames.ContainsKey($name) -and $name.Length -ge 2) {
        $seenNames[$name] = $true
        $countryLabels += "{ name: '$($name.Replace("'", "\'"))', lat: $([math]::Round($ly, 2)), lng: $([math]::Round($lx, 2)) }"
    }
}

# 2. Extract All Country Polygon Boundary Rings
$patternRing = '\[\[-?\d+\.?\d*,-?\d+\.?\d*\](?:,\[-?\d+\.?\d*,-?\d+\.?\d*\])+\]'
$matchesRings = [regex]::Matches($raw133, $patternRing)
$countryRings = @()
foreach ($m in $matchesRings) {
    $countryRings += $m.Value
}

Write-Host "Total official sovereign country boundary rings: $($countryRings.Count)"
Write-Host "Total official country name labels: $($countryLabels.Count)"

$output = @"
// Official Natural Earth 1:110m Sovereign Country Borders (Public Domain)
// Exact boundary shapes and names for all sovereign nations worldwide.

export const COUNTRY_BORDERS = [
$($countryRings -join ",`n")
];

export const COUNTRY_LABELS_LOD = [
$($countryLabels -join ",`n")
];
"@

Set-Content -Path 'c:\Users\Yash Upadhyay\OneDrive\Pictures\Desktop\highlights.com\src\data\bordersData.js' -Value $output -Encoding UTF8
Write-Host "bordersData.js generated successfully!"
