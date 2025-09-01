# UI Issues Scanner for Windows PowerShell
# Scans for problematic styling patterns in your aviation app

Write-Host "🔍 Scanning for UI Issues..." -ForegroundColor Blue

# Directories to scan
$scanDirs = @(
    "src/components",
    "src/pages", 
    "src/hooks",
    "src/contexts"
)

# Problematic patterns
$patterns = @(
    @{ Pattern = 'className="[^"]*aviation-[^"]*"'; Description = "Tailwind aviation classes" },
    @{ Pattern = "className='[^']*aviation-[^']*'"; Description = "Tailwind aviation classes (single quotes)" },
    @{ Pattern = 'className="[^"]*aviation-card[^"]*"'; Description = "aviation-card CSS class" },
    @{ Pattern = 'className="[^"]*aviation-button[^"]*"'; Description = "aviation-button CSS class" },
    @{ Pattern = 'className="[^"]*aviation-input[^"]*"'; Description = "aviation-input CSS class" },
    @{ Pattern = 'className="[^"]*question-option[^"]*"'; Description = "question-option CSS class" }
)

$problematicFiles = @()

foreach ($dir in $scanDirs) {
    if (Test-Path $dir) {
        Write-Host "Scanning $dir..." -ForegroundColor Gray
        
        $files = Get-ChildItem -Path $dir -Recurse -Include "*.tsx", "*.ts" | Where-Object {
            $_.FullName -notmatch "design-system" -and $_.FullName -notmatch "examples"
        }
        
        foreach ($file in $files) {
            $content = Get-Content $file.FullName -Raw
            $issues = @()
            
            foreach ($pattern in $patterns) {
                $matches = [regex]::Matches($content, $pattern.Pattern)
                if ($matches.Count -gt 0) {
                    $issues += @{
                        Description = $pattern.Description
                        Count = $matches.Count
                        Examples = $matches | Select-Object -First 3 | ForEach-Object { $_.Value }
                    }
                }
            }
            
            if ($issues.Count -gt 0) {
                $problematicFiles += @{
                    FilePath = $file.FullName
                    Issues = $issues
                }
            }
        }
    }
}

if ($problematicFiles.Count -eq 0) {
    Write-Host "✅ No UI issues found! Your code is already using the design system correctly." -ForegroundColor Green
    exit
}

Write-Host "❌ Found $($problematicFiles.Count) files with UI issues:" -ForegroundColor Red
Write-Host ""

foreach ($file in $problematicFiles) {
    Write-Host $file.FilePath -ForegroundColor White -BackgroundColor DarkBlue
    
    foreach ($issue in $file.Issues) {
        Write-Host "  ⚠️  $($issue.Description): $($issue.Count) instances" -ForegroundColor Yellow
        foreach ($example in $issue.Examples) {
            Write-Host "    $example" -ForegroundColor Gray
        }
    }
    
    Write-Host "  💡 Suggestions:" -ForegroundColor Blue
    Write-Host "    • Replace with design system components" -ForegroundColor Green
    Write-Host "    • Use useDesignSystem() hook for custom styling" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🚨 CRITICAL: These issues are causing UI inconsistencies!" -ForegroundColor Red -BackgroundColor White
Write-Host "Follow the migration guide in DESIGN_SYSTEM_MIGRATION.md to fix these issues." -ForegroundColor Yellow
