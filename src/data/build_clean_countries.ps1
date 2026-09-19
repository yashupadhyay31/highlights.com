$path133 = 'C:\Users\Yash Upadhyay\.gemini\antigravity-ide\brain\e5c9b22c-5634-44f2-823e-6dba6cfbcb78\.system_generated\steps\133\content.md'

$raw133 = Get-Content $path133 -Raw
$lines133 = $raw133 -split "`n"
$jsonStr = ($lines133[8..($lines133.Length-1)] -join "`n").Trim()

# Parse JSON using JavaScriptSerializer to handle large JSON properly
Add-Type -AssemblyName System.Web.Extensions
$serializer = New-Object System.Web.Script.Serialization.JavaScriptSerializer
$serializer.MaxJsonLength = 200000000
$geoObj = $serializer.DeserializeObject($jsonStr)

$countryRings = @()
$countryLabels = @()

foreach ($feat in $geoObj["features"]) {
    $props = $feat["properties"]
    $geom = $feat["geometry"]
    $name = $props["NAME"]
    $labelX = $props["LABEL_X"]
    $labelY = $props["LABEL_Y"]

    if ($name -and $labelX -ne $null -and $labelY -ne $null) {
        $countryLabels += "{ name: '$($name.Replace("'", "\'"))', lat: $([math]::Round($labelY, 2)), lng: $([math]::Round($labelX, 2)) }"
    }

    if ($geom["type"] -eq "Polygon") {
        foreach ($ring in $geom["coordinates"]) {
            $pts = @()
            foreach ($p in $ring) {
                $pts += "[$([math]::Round($p[0], 2)),$([math]::Round($p[1], 2))]"
            }
            if ($pts.Count -ge 3) {
                $countryRings += "[ " + ($pts -join ",") + " ]"
            }
        }
    } elseif ($geom["type"] -eq "MultiPolygon") {
        foreach ($poly in $geom["coordinates"]) {
            foreach ($ring in $poly) {
                $pts = @()
                foreach ($p in $ring) {
                    $pts += "[$([math]::Round($p[0], 2)),$([math]::Round($p[1], 2))]"
                }
                if ($pts.Count -ge 3) {
                    $countryRings += "[ " + ($pts -join ",") + " ]"
                }
            }
        }
    }
}

Write-Host "Processed countries successfully!"
Write-Host "Total Country Boundary Rings: $($countryRings.Count)"
Write-Host "Total Country Name Labels: $($countryLabels.Count)"

$output = @"
// Official Natural Earth 1:110m Real-World Sovereign Country Borders (Public Domain)
// Exact boundary shapes and names for all sovereign nations worldwide.

export const COUNTRY_BORDERS = [
$($countryRings -join ",`n")
];

export const COUNTRY_LABELS_LOD = [
$($countryLabels -join ",`n")
];
"@

Set-Content -Path 'c:\Users\Yash Upadhyay\OneDrive\Pictures\Desktop\highlights.com\src\data\bordersData.js' -Value $output -Encoding UTF8
Write-Host "bordersData.js updated with ALL sovereign world country borders and names!"
