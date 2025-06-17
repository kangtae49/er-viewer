!macro customInstall
    WriteRegStr HKCU "Software\\ErViewer" "InstallPath" "$INSTDIR"

    WriteRegStr HKCR "Directory\\shell\\OpenErViewer" "" "ErViewer"
    WriteRegStr HKCR "Directory\\shell\\OpenErViewer" "Icon" '"$INSTDIR\\erViewer.exe"'
    WriteRegStr HKCR "Directory\\shell\\OpenErViewer\\command" "" '"$INSTDIR\\erViewer.exe" "%V"'

    WriteRegStr HKCR "Directory\\Background\\shell\\OpenErViewer" "" "ErViewer"
    WriteRegStr HKCR "Directory\\Background\\shell\\OpenErViewer" "Icon" '"$INSTDIR\\erViewer.exe"'
    WriteRegStr HKCR "Directory\\Background\\shell\\OpenErViewer\\command" "" '"$INSTDIR\\erViewer.exe" "%V"'
!macroend

!macro customUnInstall
    DeleteRegKey HKCR "Directory\\shell\\OpenErViewer"
    DeleteRegKey HKCR "Directory\\Background\\shell\\OpenErViewer"
    DeleteRegKey HKCU "Software\\ErViewer"
!macroend