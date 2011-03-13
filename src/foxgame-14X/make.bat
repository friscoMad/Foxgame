set x=foxgame

md build\chrome
cd chrome
7za a -tzip %x%.jar * -r0 -mx=0 -x!CVS* -x!Nuevo*
move %x%.jar ..\build\chrome
cd ..
copy *-GL.rdf build
copy *-GL.js build
ren build\install-GL.rdf install.rdf
ren build\install-GL.js install.js
xcopy /S defaults build\defaults\
cd build
7za a -tzip %x%.xpi * -r -mx=9 -mpass=4 -mfb=255 -x!CVS*
move %x%.xpi ..\
cd ..
rd build /s/q


md build\chrome
cd chrome
7za a -tzip %x%.jar * -r0 -mx=9 -x!CVS* -xr!locale\* 
7za a -tzip %x%.jar locale\bs-BA\* -r0 -mx=0 -x!CVS* -x!Nuevo*
move %x%.jar ..\build\chrome
cd ..
copy *-BA.rdf build
copy *-BA.js build
ren build\install-BA.rdf install.rdf
ren build\install-BA.js install.js
xcopy /S defaults build\defaults\
cd build
7za a -tzip %x%-BA.xpi * -r -mx=9 -xr!CVS\*
move %x%-BA.xpi ..\
cd ..
rd build /s/q