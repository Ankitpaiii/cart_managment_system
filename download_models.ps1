$baseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
$files = @(
    "tiny_face_detector_model-weights_manifest.json",
    "tiny_face_detector_model-shard1",
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_recognition_model-weights_manifest.json",
    "face_recognition_model-shard1",
    "face_recognition_model-shard2"
)
New-Item -ItemType Directory -Force -Path "frontend/public/models"
foreach ($file in $files) {
    if (-not (Test-Path "frontend/public/models/$file")) {
        Write-Host "Downloading $file..."
        Invoke-WebRequest -Uri "$baseUrl/$file" -OutFile "frontend/public/models/$file"
    }
    else {
        Write-Host "$file already exists."
    }
}
Write-Host "Download complete."
