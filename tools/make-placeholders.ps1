# Generates labelled placeholder PNGs into ../images (Windows PowerShell, System.Drawing).
# Sizes are @2x of the size shown in the email. Replace the files with real artwork, same file names.
Add-Type -AssemblyName System.Drawing
$out = Join-Path $PSScriptRoot '..\images'
New-Item -ItemType Directory -Force $out | Out-Null

function New-Placeholder($name, $w, $h, $line1, $line2) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'; $g.TextRenderingHint = 'AntiAliasGridFit'
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml('#EFEFF1'))
  $pen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml('#C9CACF')), 3
  $g.DrawRectangle($pen, 1, 1, $w - 3, $h - 3)
  $g.DrawLine($pen, 0, 0, $w, $h); $g.DrawLine($pen, $w, 0, 0, $h)
  $sf = New-Object System.Drawing.StringFormat; $sf.Alignment = 'Center'; $sf.LineAlignment = 'Center'
  $size = [Math]::Max(14, [Math]::Min($w, $h) / 14)
  $f1 = New-Object System.Drawing.Font 'Arial', $size, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $f2 = New-Object System.Drawing.Font 'Arial', ($size * 0.8), ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
  # Label plate so text stays readable over the diagonals
  $plateW = [Math]::Min($w - 20, $size * 22); $plateH = $size * 3.6
  $plate = New-Object System.Drawing.RectangleF (($w - $plateW) / 2), (($h - $plateH) / 2), $plateW, $plateH
  $g.FillRectangle((New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#EFEFF1'))), $plate)
  $dark = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#2A2A2D'))
  $mid = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#67686F'))
  $r1 = New-Object System.Drawing.RectangleF $plate.X, ($plate.Y + $size * 0.2), $plate.Width, ($size * 1.5)
  $r2 = New-Object System.Drawing.RectangleF $plate.X, ($plate.Y + $size * 1.8), $plate.Width, ($size * 1.5)
  $g.DrawString($line1, $f1, $dark, $r1, $sf)
  $g.DrawString($line2, $f2, $mid, $r2, $sf)
  $bmp.Save((Join-Path $out $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

New-Placeholder 'logo.png'             288  56  'LOGO' 'Ohtuleht Digiklubi 288x56'
New-Placeholder 'hero-welcome.png'     280 280  'HERO: WELCOME' 'welcome illustration 280x280'
New-Placeholder 'hero-gift.png'        240 240  'HERO: GIFT' 'coupon illustration 240x240'
New-Placeholder 'hero-points.png'      240 240  'HERO: POINTS' 'points illustration 240x240'
New-Placeholder 'hero-friends.png'     240 240  'HERO: FRIENDS' 'referral illustration 240x240'
New-Placeholder 'hero-next-reward.png' 280 280  'HERO: NEXT REWARD' 'next-reward 280x280'
New-Placeholder 'reward.png'           160 160  'REWARD' 'image 160x160'
Get-ChildItem $out | Select-Object Name, Length
