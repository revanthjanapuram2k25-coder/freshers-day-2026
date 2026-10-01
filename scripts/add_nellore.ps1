Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\sures\.gemini\antigravity-ide\brain\41ebc9ff-beea-4578-a4cb-36e589122e9d\.user_uploaded\media_1790788462435.png"
$outPath = "C:\Users\sures\.gemini\antigravity-ide\scratch\freshers-party\public\logo.png"

$srcImg = [System.Drawing.Image]::FromFile($srcPath)
$newWidth = 200
$newHeight = 228

$bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# White background
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.FillRectangle($brushWhite, 0, 0, $newWidth, $newHeight)

# Draw original image
$g.DrawImage($srcImg, 0, 0, 200, 200)

# Draw NELLORE text
$font = New-Object System.Drawing.Font("Arial", 10.5, [System.Drawing.FontStyle]::Bold)
# Matching Narayana Navy Blue: Color(16, 44, 87)
$brushText = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(16, 44, 87))

$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

$rect = New-Object System.Drawing.RectangleF(0, 200, 200, 24)
$g.DrawString("NELLORE", $font, $brushText, $rect, $sf)

$srcImg.Dispose()
$brushWhite.Dispose()
$brushText.Dispose()
$font.Dispose()
$sf.Dispose()
$g.Dispose()

$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Output "Successfully updated logo.png with NELLORE"
