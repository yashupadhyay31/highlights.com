$path133 = 'C:\Users\Yash Upadhyay\.gemini\antigravity-ide\brain\e5c9b22c-5634-44f2-823e-6dba6cfbcb78\.system_generated\steps\133\content.md'
$path135 = 'C:\Users\Yash Upadhyay\.gemini\antigravity-ide\brain\e5c9b22c-5634-44f2-823e-6dba6cfbcb78\.system_generated\steps\135\content.md'

$raw133 = Get-Content $path133 -Raw
$patternRing = '\[\[-?\d+\.?\d*,-?\d+\.?\d*\](?:,\[-?\d+\.?\d*,-?\d+\.?\d*\])+\]'

$matches133 = [regex]::Matches($raw133, $patternRing)
$countryRings = @()
foreach ($m in $matches133) {
    $countryRings += $m.Value
}

$raw135 = Get-Content $path135 -Raw
$matches135 = [regex]::Matches($raw135, $patternRing)
$stateRings = @()
foreach ($m in $matches135) {
    $stateRings += $m.Value
}

Write-Host "Total exact country rings: $($countryRings.Count)"
Write-Host "Total exact state rings: $($stateRings.Count)"

$output = @"
// Official Natural Earth 1:110m Real-World Country & State Boundary Polygons (Public Domain)
// Exact boundary shapes matching real geopolitical world maps.

export const COUNTRY_BORDERS = [
$($countryRings -join ",`n")
];

export const STATE_BORDERS = [
$($stateRings -join ",`n")
];

export const COUNTRY_LABELS_LOD = [
  { name: 'UNITED STATES', lat: 39.5, lng: -98.5 },
  { name: 'CANADA', lat: 56.0, lng: -106.0 },
  { name: 'MEXICO', lat: 23.6, lng: -102.5 },
  { name: 'BRAZIL', lat: -14.2, lng: -51.9 },
  { name: 'ARGENTINA', lat: -38.4, lng: -63.6 },
  { name: 'CHILE', lat: -35.6, lng: -71.5 },
  { name: 'PERU', lat: -9.1, lng: -75.0 },
  { name: 'COLOMBIA', lat: 4.5, lng: -73.2 },
  { name: 'UNITED KINGDOM', lat: 55.3, lng: -3.4 },
  { name: 'FRANCE', lat: 46.2, lng: 2.2 },
  { name: 'GERMANY', lat: 51.1, lng: 10.4 },
  { name: 'SPAIN', lat: 40.4, lng: -3.7 },
  { name: 'ITALY', lat: 41.8, lng: 12.5 },
  { name: 'POLAND', lat: 51.9, lng: 19.1 },
  { name: 'UKRAINE', lat: 48.3, lng: 31.1 },
  { name: 'RUSSIA', lat: 61.5, lng: 95.3 },
  { name: 'TURKEY', lat: 38.9, lng: 35.2 },
  { name: 'SAUDI ARABIA', lat: 23.8, lng: 45.0 },
  { name: 'IRAN', lat: 32.4, lng: 53.6 },
  { name: 'IRAQ', lat: 33.2, lng: 43.6 },
  { name: 'ISRAEL', lat: 31.0, lng: 34.8 },
  { name: 'EGYPT', lat: 26.8, lng: 30.8 },
  { name: 'SOUTH AFRICA', lat: -30.5, lng: 22.9 },
  { name: 'NIGERIA', lat: 9.0, lng: 8.6 },
  { name: 'KENYA', lat: -0.02, lng: 37.9 },
  { name: 'INDIA', lat: 20.5, lng: 78.9 },
  { name: 'PAKISTAN', lat: 30.3, lng: 69.3 },
  { name: 'CHINA', lat: 35.8, lng: 104.1 },
  { name: 'JAPAN', lat: 36.2, lng: 138.2 },
  { name: 'SOUTH KOREA', lat: 35.9, lng: 127.7 },
  { name: 'AUSTRALIA', lat: -25.2, lng: 133.7 },
  { name: 'INDONESIA', lat: -0.7, lng: 113.9 }
];

export const STATE_LABELS_LOD = [
  { name: 'California', lat: 36.7, lng: -119.4 },
  { name: 'Texas', lat: 31.0, lng: -99.9 },
  { name: 'New York', lat: 43.0, lng: -75.0 },
  { name: 'Florida', lat: 27.6, lng: -81.5 },
  { name: 'Washington', lat: 47.7, lng: -120.7 },
  { name: 'Illinois', lat: 40.6, lng: -89.3 },
  { name: 'Maharashtra', lat: 19.7, lng: 75.7 },
  { name: 'Delhi NCR', lat: 28.7, lng: 77.1 },
  { name: 'Karnataka', lat: 15.3, lng: 75.7 },
  { name: 'Tamil Nadu', lat: 11.1, lng: 78.6 },
  { name: 'Gujarat', lat: 22.2, lng: 71.1 },
  { name: 'Rajasthan', lat: 27.0, lng: 74.2 },
  { name: 'Uttar Pradesh', lat: 26.8, lng: 80.9 },
  { name: 'Ontario', lat: 51.2, lng: -85.3 },
  { name: 'Quebec', lat: 52.9, lng: -73.5 },
  { name: 'New South Wales', lat: -31.8, lng: 145.6 },
  { name: 'Bavaria', lat: 48.7, lng: 11.4 },
  { name: 'Guangdong', lat: 23.3, lng: 113.2 }
];
"@

Set-Content -Path 'c:\Users\Yash Upadhyay\OneDrive\Pictures\Desktop\highlights.com\src\data\bordersData.js' -Value $output -Encoding UTF8
Write-Host "bordersData.js saved with full real-world Natural Earth boundaries!"
