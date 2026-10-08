$root = 'c:\Users\18136\Desktop\zihuan\zihuan-birthday'
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://127.0.0.1:8766/')
$listener.Start()
Write-Output "serving $root at http://127.0.0.1:8766/"

function Get-Mime($ext) {
	switch ($ext) {
		'.html' { 'text/html; charset=utf-8' }
		'.css'  { 'text/css; charset=utf-8' }
		'.js'   { 'application/javascript; charset=utf-8' }
		'.jpg'  { 'image/jpeg' }
		'.jpeg' { 'image/jpeg' }
		'.png'  { 'image/png' }
		'.svg'  { 'image/svg+xml' }
		'.mp4'  { 'video/mp4' }
		'.webm' { 'video/webm' }
		'.mp3'  { 'audio/mpeg' }
		'.wav'  { 'audio/wav' }
		'.json' { 'application/json; charset=utf-8' }
		default { 'application/octet-stream' }
	}
}

while ($listener.IsListening) {
	try {
		$ctx = $listener.GetContext()
		$req = $ctx.Request
		$res = $ctx.Response
		$url = $req.Url.AbsolutePath
		if ($url -eq '/') { $url = '/index.html' }
		$path = Join-Path $root ($url.TrimStart('/') -replace '/', '\')

		if (-not (Test-Path $path -PathType Leaf)) {
			$res.StatusCode = 404
			$res.Close()
			continue
		}

		$ext = [System.IO.Path]::GetExtension($path).ToLower()
		$res.ContentType = Get-Mime $ext
		$res.AddHeader('Accept-Ranges', 'bytes')

		$fileLen = (Get-Item $path).Length
		$range = $req.Headers['Range']

		if ($range -and $range -match 'bytes=(\d*)-(\d*)') {
			$start = if ($Matches[1] -ne '') { [int64]$Matches[1] } else { $null }
			$end   = if ($Matches[2] -ne '') { [int64]$Matches[2] } else { $null }
			if ($null -eq $start) { $start = $fileLen - $end; $end = $fileLen - 1 }
			elseif ($null -eq $end) { $end = $fileLen - 1 }
			if ($start -ge $fileLen) {
				$res.StatusCode = 416
				$res.Close()
				continue
			}
			$len = $end - $start + 1
			$res.StatusCode = 206
			$res.AddHeader('Content-Range', "bytes $start-$end/$fileLen")
			$res.ContentLength64 = $len
			if ($req.HttpMethod -ne 'HEAD') {
				$fs = [System.IO.File]::OpenRead($path)
				$fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
				$buf = New-Object byte[] 65536
				$remaining = $len
				while ($remaining -gt 0) {
					$toRead = [Math]::Min($buf.Length, $remaining)
					$read = $fs.Read($buf, 0, $toRead)
					if ($read -le 0) { break }
					$res.OutputStream.Write($buf, 0, $read)
					$remaining -= $read
				}
				$fs.Close()
			}
		} else {
			$res.ContentLength64 = $fileLen
			if ($req.HttpMethod -ne 'HEAD') {
				$bytes = [System.IO.File]::ReadAllBytes($path)
				$res.OutputStream.Write($bytes, 0, $bytes.Length)
			}
		}
		$res.Close()
	} catch { }
}
