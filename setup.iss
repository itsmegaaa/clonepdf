[Setup]
AppName=iLovePDF Clone
AppVersion=1.0.2
AppPublisher=itsmegaaa
AppPublisherURL=https://github.com/itsmegaaa/clonepdf
DefaultDirName={autopf}\iLovePDF Clone
DefaultGroupName=iLovePDF Clone
OutputDir=.\Release
OutputBaseFilename=iLovePDF_Clone_Setup_v1.0.2
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin
ArchitecturesInstallIn64BitMode=x64

[Files]
; Salin semua file dari folder proyek saat ini ke folder instalasi.
; PENTING: Kita mengecualikan folder-folder berat & file rahasia agar ukuran installer tetap kecil.
Source: "*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "node_modules\*,frontend\node_modules\*,backend\node_modules\*,frontend\dist\*,backend\tmp\*,backend\poppler\*,.git\*,*.env,Release\*,ilovepdf-clone*.zip"

[Icons]
; Buat Shortcut di Start Menu dan Desktop
Name: "{group}\iLovePDF Clone"; Filename: "{app}\LaunchApp.vbs"; WorkingDir: "{app}"
Name: "{autodesktop}\iLovePDF Clone"; Filename: "{app}\LaunchApp.vbs"; WorkingDir: "{app}"

[Run]
; Jalankan skrip install.bat secara otomatis setelah file berhasil disalin
Filename: "{app}\install.bat"; Description: "Menginstal Dependensi Sistem (Node.js, LibreOffice, Poppler, dll) & NPM Modules"; Flags: postinstall waituntilterminated
