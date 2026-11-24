param([Parameter(Mandatory=$true)][string]$Manifest)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$root=Split-Path $PSScriptRoot
$dataPath=Join-Path $root 'src/data/catalog.json'
$catalog=@()
if(Test-Path $dataPath){$catalog=@(Get-Content -Raw -Encoding UTF8 $dataPath | ConvertFrom-Json)}
$allowed=@('STREET','TRAVEL','PORTRAIT','NATURE','SPORTS','DAILY')
foreach($entry in (Get-Content -Raw -Encoding UTF8 $Manifest | ConvertFrom-Json)){
  if($entry.id -notmatch '^[a-z0-9-]+$' -or $entry.category -cnotin $allowed){throw 'Invalid id or category'}
  $img=[Drawing.Image]::FromFile($entry.source)
  try {
    $year=$null
    try{$date=[Text.Encoding]::ASCII.GetString($img.GetPropertyItem(36867).Value);if($date -match '^(\d{4}):'){$year=$Matches[1]}}catch{}
    try{$orientation=[BitConverter]::ToUInt16($img.GetPropertyItem(274).Value,0)
      $rot=@(0,0,4,2,6,5,1,7,3);if($orientation -ge 2 -and $orientation -le 8){$img.RotateFlip([Drawing.RotateFlipType]$rot[$orientation])}
    }catch{}
    $paths=@{}
    foreach($size in @(720,1440,3200)){
      $dir=if($size -eq 3200){$entry.category.ToLower()}else{'thumbnails'}
      $rel="images/$dir/$($entry.id)-$size.jpg"
      $path=Join-Path "$root/public" $rel
      [IO.Directory]::CreateDirectory((Split-Path $path)) | Out-Null
      $scale=[Math]::Min([double]1,$size/[Math]::Max($img.Width,$img.Height))
      $bm=[Drawing.Bitmap]::new([int][Math]::Max(1,$img.Width*$scale),[int][Math]::Max(1,$img.Height*$scale))
      $g=[Drawing.Graphics]::FromImage($bm)
      try{$g.InterpolationMode='HighQualityBicubic';$g.DrawImage($img,0,0,$bm.Width,$bm.Height)
        $codec=[Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
        $param=[Drawing.Imaging.EncoderParameters]::new(1)
        $param.Param[0]=[Drawing.Imaging.EncoderParameter]::new([Drawing.Imaging.Encoder]::Quality,[long]90)
        $bm.Save($path,$codec,$param);$param.Dispose()
      }finally{$g.Dispose();$bm.Dispose()}
      $paths["$size"]=$rel
    }
    $catalog=@($catalog | Where-Object id -ne $entry.id)
    $catalog+= [ordered]@{id=$entry.id;title=$entry.title;category=$entry.category;location=$entry.location;description=$entry.description;year=$year;width=$img.Width;height=$img.Height;src=$paths['3200'];medium=$paths['1440'];thumb=$paths['720'];order=$entry.order;coverOrder=$entry.coverOrder}
  }finally{$img.Dispose()}
}
ConvertTo-Json -InputObject @($catalog | Sort-Object { $_.order }) -Depth 4 | Set-Content -Encoding UTF8 $dataPath

