Set WshShell = CreateObject("WScript.Shell")

' Jalankan start.bat dalam mode minimized (angka 7) agar tidak mengganggu layar
WshShell.Run chr(34) & "start.bat" & Chr(34), 7, false

' Beri waktu 5 detik agar server Backend dan Frontend siap
WScript.Sleep 5000

' Buka browser default ke alamat lokal aplikasi
WshShell.Run "http://localhost:5173"
