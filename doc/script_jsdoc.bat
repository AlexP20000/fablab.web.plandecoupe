:: author : alexandre mailliu
:: date   : 14/05/2018

:: this script ask the user whether he wants to generate the jsdoc for our box generator
:: it's a batch script, so it must be called with windows

@echo This script is going to generate/re-generate the javascript documentation (jsdoc)
@set /p id= Do you want to generate the documentation (yes/no) ?
@if %id% == yes (
    jsdoc ..\src\generate_svg_boxes.js
) else (
  echo no problem, see you soon master !
)

pause