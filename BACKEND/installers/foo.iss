; MyAppInstaller.iss - Inno Setup script

[Setup]
AppName=SecureAuthSystem
AppVersion=1.0
DefaultDirName={pf}\SecureAuthSystem
DefaultGroupName=SecureAuthSystem
OutputDir=.
OutputBaseFilename=SecureAuthInstaller
Compression=lzma
SolidCompression=yes

[Files]
Source: "anomaly_detect.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "client_streamer.exe"; DestDir: "{app}"; Flags: ignoreversion
; If you have additional files/folders:
; Source: "images\*"; DestDir: "{app}\images"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Run Anomaly Detection"; Filename: "{app}\anomaly_detect.exe"
Name: "{group}\Run Client Streamer"; Filename: "{app}\client_streamer.exe"
Name: "{group}\Uninstall SecureAuthSystem"; Filename: "{uninstallexe}"
