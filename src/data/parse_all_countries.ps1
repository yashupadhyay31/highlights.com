$path133 = 'C:\Users\Yash Upadhyay\.gemini\antigravity-ide\brain\e5c9b22c-5634-44f2-823e-6dba6cfbcb78\.system_generated\steps\133\content.md'
$raw133 = Get-Content $path133 -Raw

$featuresSplit = $raw133 -split '\{"type":"Feature"'

$countryRings = @()
$countryLabels = @()
$seenNames = @{}

# Pattern for rings
$patternRing = '\[\[-?\d+\.?\d*,-?\d+\.?\d*\](?:,\[-?\d+\.?\d*,-?\d+\.?\d*\])+\]'

foreach ($feat in $featuresSplit) {
    if ($feat.Length -lt 20) { continue }
    
    # Extract NAME
    $name = $null
    if ($feat -match '"NAME":"([^"]+)"') {
        $name = $matches[1]
    }
    
    # Extract LABEL_X and LABEL_Y
    $lx = $null
    $ly = $null
    if ($feat -match '"LABEL_X":([-\d\.]+)') {
        $lx = [double]$matches[1]
    }
    if ($feat -match '"LABEL_Y":([-\d\.]+)') {
        $ly = [double]$matches[1]
    }

    if ($name -and $lx -ne $null -and $ly -ne $null -and -not $seenNames.ContainsKey($name)) {
        $seenNames[$name] = $true
        $countryLabels += "{ name: '$($name.Replace("'", "\'"))', lat: $([math]::Round($ly, 2)), lng: $([math]::Round($lx, 2)) }"
    }

    # Extract rings inside this feature
    $rings = [regex]::Matches($feat, $patternRing)
    foreach ($r in $rings) {
        $countryRings += $r.Value
    }
}

Write-Host "Total official country boundary rings: $($countryRings.Count)"
Write-Host "Total official country name labels: $($countryLabels.Count)"

$output = @"
// Official Natural Earth 1:110m Sovereign Country Borders (Public Domain)
// Exact boundary shapes and official names for all sovereign nations worldwide.

export const COUNTRY_BORDERS = [
$($countryRings -join ",`n")
];

export const COUNTRY_LABELS_LOD = [
$($countryLabels -join ",`n")
];
"@

Set-Content -Path 'c:\Users\Yash Upadhyay\OneDrive\Pictures\Desktop\highlights.com\src\data\bordersData.js' -Value $output -Encoding UTF8
Write-Host "bordersData.js generated with ALL world countries and official perimeters!"
