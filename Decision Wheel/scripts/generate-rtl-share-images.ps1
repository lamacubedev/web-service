Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$templatePath = Join-Path $root "share-images\template.png"
$outputDir = Join-Path $root "share-images"
$source = [System.Drawing.Image]::FromFile($templatePath)

function ConvertFrom-CodePoints([int[]] $points) {
  return -join ($points | ForEach-Object { [char]$_ })
}

$arabicLead = ConvertFrom-CodePoints @(0x0645, 0x0627, 0x0630, 0x0627, 0x0020, 0x0622, 0x0643, 0x0644)
$arabicQuestion = ConvertFrom-CodePoints @(0x0627, 0x0644, 0x064A, 0x0648, 0x0645, 0x061F)
$hebrewLead = ConvertFrom-CodePoints @(0x05DE, 0x05D4, 0x0020, 0x05DC, 0x05D0, 0x05DB, 0x05D5, 0x05DC)
$hebrewQuestion = ConvertFrom-CodePoints @(0x05D4, 0x05D9, 0x05D5, 0x05DD, 0x003F)

$items = @(
  @{ Code = "ar"; Lead = $arabicLead; Question = $arabicQuestion; Font = "Ebrima" },
  @{ Code = "he"; Lead = $hebrewLead; Question = $hebrewQuestion; Font = "Arial" }
)

foreach ($item in $items) {
  $bitmap = New-Object System.Drawing.Bitmap 1200, 630
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $destination = New-Object System.Drawing.Rectangle 0, 0, 1200, 630
  $sourceRect = New-Object System.Drawing.Rectangle 0, 170, $source.Width, ($source.Height - 340)
  $graphics.DrawImage($source, $destination, $sourceRect, [System.Drawing.GraphicsUnit]::Pixel)

  $format = New-Object System.Drawing.StringFormat
  $format.FormatFlags = [System.Drawing.StringFormatFlags]::DirectionRightToLeft
  $format.Alignment = [System.Drawing.StringAlignment]::Far
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center

  $leadFont = New-Object System.Drawing.Font $item.Font, 70, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $questionFont = New-Object System.Drawing.Font $item.Font, 82, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $brandFont = New-Object System.Drawing.Font "Arial", 27, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $darkBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#17201b"))
  $greenBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#137a5b"))

  $leadRect = New-Object System.Drawing.RectangleF 55, 125, 560, 110
  $questionRect = New-Object System.Drawing.RectangleF 55, 250, 560, 125
  $graphics.DrawString($item.Lead, $leadFont, $darkBrush, $leadRect, $format)
  $graphics.DrawString($item.Question, $questionFont, $greenBrush, $questionRect, $format)
  $graphics.DrawString("MENU ROULETTE RUSH", $brandFont, $greenBrush, 60, 455)

  $outputPath = Join-Path $outputDir ("share-" + $item.Code + ".jpg")
  $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

  $leadFont.Dispose()
  $questionFont.Dispose()
  $brandFont.Dispose()
  $darkBrush.Dispose()
  $greenBrush.Dispose()
  $format.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

$source.Dispose()
