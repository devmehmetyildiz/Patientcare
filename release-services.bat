@Echo Off
CD /D "C:\Patientcare\Patientcare\Auth"
Call npm install
Call npm run build 
CD /D "C:\Patientcare\Patientcare\Business"
Call npm install
Call npm run build
CD /D "C:\Patientcare\Patientcare\File"
Call npm install
Call npm run build
CD /D "C:\Patientcare\Patientcare\Log"
Call npm install
Call npm run build
CD /D "C:\Patientcare\Patientcare\Setting"
Call npm install
Call npm run build
CD /D "C:\Patientcare\Patientcare\System"
Call npm install
Call npm run build
CD /D "C:\Patientcare\Patientcare\Userrole"
Call npm install
Call npm run build
CD /D "C:\Patientcare\Patientcare\Warehouse"
Call npm install
Call npm run build
CD /D "C:\Patientcare\Patientcare"