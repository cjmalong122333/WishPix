$ErrorActionPreference = "Stop"

$SdkDir = "$env:LOCALAPPDATA\Android\Sdk"
$BuildTools = "$SdkDir\build-tools\35.0.0"
$PlatformJar = "$SdkDir\platforms\android-34\android.jar"
$JbrBin = "C:\Program Files\Android\Android Studio\jbr\bin"

$Env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$Env:PATH = "$JbrBin;$Env:PATH"

$AndroidDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BuildDir = Join-Path $AndroidDir "build"
$GenDir = Join-Path $BuildDir "gen"
$ObjDir = Join-Path $BuildDir "obj"
$DexDir = Join-Path $BuildDir "dex"
$KeystorePath = Join-Path $AndroidDir "wishpix-release.keystore"
$OutputApk = Join-Path (Split-Path -Parent $AndroidDir) "public\wishpix-android.apk"

if (Test-Path $BuildDir) {
    Remove-Item -Recurse -Force $BuildDir
}
New-Item -ItemType Directory -Force -Path $GenDir, $ObjDir, $DexDir | Out-Null

Write-Host "[1/6] Compiling Android resources with aapt2..."
$CompiledResZip = Join-Path $BuildDir "compiled_res.zip"
& "$BuildTools\aapt2.exe" compile --dir (Join-Path $AndroidDir "res") -o $CompiledResZip

Write-Host "[2/6] Linking resources and generating R.java..."
$UnalignedApk = Join-Path $BuildDir "wishpix-unaligned.apk"
& "$BuildTools\aapt2.exe" link `
    -o $UnalignedApk `
    -I $PlatformJar `
    --manifest (Join-Path $AndroidDir "AndroidManifest.xml") `
    --java $GenDir `
    $CompiledResZip

Write-Host "[3/6] Compiling Java sources..."
$JavaFiles = @(
    (Join-Path $AndroidDir "src\com\wishpix\teacherapp\MainActivity.java"),
    (Join-Path $GenDir "com\wishpix\teacherapp\R.java")
)
& "$JbrBin\javac.exe" `
    --release 11 `
    -classpath $PlatformJar `
    -d $ObjDir `
    $JavaFiles

Write-Host "[4/6] Converting bytecode to DEX with d8..."
$ClassFiles = Get-ChildItem -Path $ObjDir -Recurse -Filter "*.class" | ForEach-Object { $_.FullName }
& "$BuildTools\d8.bat" `
    --lib $PlatformJar `
    --min-api 24 `
    --output $DexDir `
    $ClassFiles

Write-Host "[5/6] Packaging classes.dex & zipaligning APK..."
& "$JbrBin\jar.exe" -uf $UnalignedApk -C $DexDir classes.dex

$AlignedApk = Join-Path $BuildDir "wishpix-aligned.apk"
& "$BuildTools\zipalign.exe" -f 4 $UnalignedApk $AlignedApk

Write-Host "[6/6] Signing APK with apksigner..."
if (-not (Test-Path $KeystorePath)) {
    & "$JbrBin\keytool.exe" -genkeypair `
        -v `
        -keystore $KeystorePath `
        -alias wishpix `
        -keyalg RSA `
        -keysize 2048 `
        -validity 10000 `
        -storepass wishpix123 `
        -keypass wishpix123 `
        -dname "CN=WishPix Teacher App, OU=Education, O=WishPix, L=Manila, S=NCR, C=PH"
}

& "$BuildTools\apksigner.bat" sign `
    --ks $KeystorePath `
    --ks-key-alias wishpix `
    --ks-pass pass:wishpix123 `
    --key-pass pass:wishpix123 `
    --out $OutputApk `
    $AlignedApk

& "$BuildTools\apksigner.bat" verify --verbose $OutputApk
Remove-Item -Recurse -Force $BuildDir
Write-Host "Successfully built and verified signed Android APK at: $OutputApk"
