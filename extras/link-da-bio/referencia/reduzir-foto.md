# Reduzir e recortar a foto

Dois recortes saem da mesma foto: quadrado de 800 pixels para o topo e para a conversa, e
retrato de 900 por 1125 para a apresentação, que só existe se a página tiver o bloco de
apresentação. Gravados como `.jpg`, com o primeiro nome da pessoa em minúsculas, sem espaço
e sem acento: `renata-topo.jpg` e `renata-retrato.jpg`. O original fica fora da pasta que
vai ser publicada. Foto original menor que o recorte perde nitidez: prefira a maior que ela
tiver.

A pasta `meu-link-da-bio` precisa existir antes de rodar o comando.

## Windows (PowerShell)

Troque os três caminhos e rode uma vez para cada recorte, mudando `$largura` e `$altura`.

```powershell
Add-Type -AssemblyName System.Drawing
$origem  = "C:\caminho\da\foto-original.jpg"
$destino = "C:\caminho\do\projeto\meu-link-da-bio\renata-topo.jpg"
$largura = 800; $altura = 800        # topo e conversa: 800 x 800. Apresentação: 900 x 1125

$img = [System.Drawing.Image]::FromFile($origem)
if ($img.Width -lt $largura -or $img.Height -lt $altura) { Write-Warning "A foto original é menor que o recorte e vai perder nitidez. Se tiver uma foto maior, use ela." }
$escala = [Math]::Max([double]$largura / [double]$img.Width, [double]$altura / [double]$img.Height)
$cw = [int][Math]::Floor($largura / $escala); $ch = [int][Math]::Floor($altura / $escala)
$cx = [int](($img.Width - $cw) / 2); $cy = [int](($img.Height - $ch) * 0.25)   # 0.25 deixa o rosto mais para cima
$bmp = New-Object System.Drawing.Bitmap $largura, $altura
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, (New-Object System.Drawing.Rectangle 0,0,$largura,$altura), (New-Object System.Drawing.Rectangle $cx,$cy,$cw,$ch), [System.Drawing.GraphicsUnit]::Pixel)
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]85)
$bmp.Save($destino, $codec, $params)
$g.Dispose(); $bmp.Dispose(); $img.Dispose()
Get-Item $destino | Select-Object Name, Length
```

Se o arquivo passar de 500 KB, troque o `85` por `75` e rode de novo.

## Mac (Terminal)

```bash
# converter HEIC em JPG, se a foto veio do iPhone
sips -s format jpeg foto-original.heic --out foto-original.jpg

# recorte quadrado de 800 (topo e conversa)
sips -c 800 800 -Z 1000 foto-original.jpg --out meu-link-da-bio/renata-topo.jpg

# recorte retrato de 900 x 1125 (só se houver bloco de apresentação)
sips -c 1125 900 -Z 1400 foto-original.jpg --out meu-link-da-bio/renata-retrato.jpg
```

O `-Z` reduz antes de recortar, para o recorte pegar a parte central e não um canto. Se o
rosto ficar cortado, aumente o número depois do `-Z`.

## Conferir

O arquivo abre como imagem, tem largura maior que zero e fica abaixo de 500 KB.
