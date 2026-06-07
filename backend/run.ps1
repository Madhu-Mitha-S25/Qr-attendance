$MavenVersion = "3.9.6"
$MavenDir = "$PSScriptRoot\.maven"
$MavenHome = "$MavenDir\apache-maven-$MavenVersion"
$MvnPath = "$MavenHome\bin\mvn.cmd"

if (!(Test-Path $MvnPath)) {
    Write-Host "Local Maven not found. Initialising standalone Maven $MavenVersion..." -ForegroundColor Green
    if (!(Test-Path $MavenDir)) {
        New-Item -ItemType Directory -Force -Path $MavenDir | Out-Null
    }
    
    $ZipUrl = "https://archive.apache.org/dist/maven/maven-3/$MavenVersion/binaries/apache-maven-$MavenVersion-bin.zip"
    $ZipPath = "$MavenDir\maven.zip"
    
    Write-Host "Downloading Maven binaries..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $ZipUrl -OutFile $ZipPath
    
    Write-Host "Extracting files..." -ForegroundColor Yellow
    Expand-Archive -Path $ZipPath -DestinationPath $MavenDir -Force
    
    Remove-Item $ZipPath -Force
    Write-Host "Standalone Maven ready at $MavenHome" -ForegroundColor Green
}

Write-Host "Starting Spring Boot Application..." -ForegroundColor Green
& $MvnPath spring-boot:run
