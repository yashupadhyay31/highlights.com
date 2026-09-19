$path133 = 'C:\Users\Yash Upadhyay\.gemini\antigravity-ide\brain\e5c9b22c-5634-44f2-823e-6dba6cfbcb78\.system_generated\steps\133\content.md'
$bytes = [System.IO.File]::ReadAllBytes($path133)

# Find start of JSON '{'
$startIdx = 0
for ($i = 0; $i -lt $bytes.Length - 10; $i++) {
    if ($bytes[$i] -eq 123 -and $bytes[$i+1] -eq 34 -and $bytes[$i+2] -eq 116) { # '{"t'
        $startIdx = $i
        break
    }
}

$jsonBytes = $bytes[$startIdx..($bytes.Length - 1)]
$jsonDoc = [System.Text.Json.JsonDocument]::Parse($jsonBytes)
$root = $jsonDoc.RootElement
$features = $root.GetProperty("features")

$countryRings = @()
$countryLabels = @()

foreach ($feat in $features.EnumerateArray()) {
    $props = $feat.GetProperty("properties")
    $name = $props.GetProperty("NAME").GetString()
    $labelX = $props.GetProperty("LABEL_X").GetDouble()
    $labelY = $props.GetProperty("LABEL_Y").GetDouble()

    $countryLabels += "{ name: '$($name.Replace("'", "\'"))', lat: $([math]::Round($labelY, 2)), lng: $([math]::Round($labelX, 2)) }"

    $geom = $feat.GetProperty("geometry")
    $geomType = $geom.GetProperty("type").GetString()
    $coords = $geom.GetProperty("coordinates")

    if ($geomType -eq "Polygon") {
        foreach ($ring in $coords.EnumerateArray()) {
            $pts = @()
            foreach ($p in $ring.EnumerateArray()) {
                $x = $p[0].GetDouble()
                $y = $p[1].GetDouble()
                $pts += "[$([math]::Round($x, 2)),$([math]::Round($y, 2))]"
            }
            if ($pts.Count -ge 3) {
                $countryRings += "[ " + ($pts -join ",") + " ]"
            }
        }
    } elseif ($geomType -eq "MultiPolygon") {
        foreach ($poly in $coords.EnumerateArray()) {
            foreach ($ring in $poly.EnumerateArray()) {
                $pts = @()
                foreach ($p in $ring.EnumerateArray()) {
                    $x = $p[0].GetDouble()
                    $y = $p[1].GetDouble()
                    $pts += "[$([math]::Round($x, 2)),$([math]::Round($y, 2))]"
                }
                if ($pts.Count -ge 3) {
                    $countryRings += "[ " + ($pts -join ",") + " ]"
                }
            }
        }
    }
}

Write-Host "Success! Parsed $($features.GetArrayLength()) countries."
Write-Host "Extracted $($countryRings.Count) exact country boundary polygons."
Write-Host "Extracted $($countryLabels.Count) country labels."

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
Write-Host "bordersData.js written successfully!"
