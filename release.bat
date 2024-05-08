@Echo Off
CD /D "C:\Patientcare\Patientcare\Auth"
Call npm run build 
CD /D "C:\Patientcare\Patientcare\Business"
Call npm run build
CD /D "C:\Patientcare\Patientcare\File"
Call npm run build
CD /D "C:\Patientcare\Patientcare\Log"
Call npm run build
CD /D "C:\Patientcare\Patientcare\Setting"
Call npm run build
CD /D "C:\Patientcare\Patientcare\System"
Call npm run build
CD /D "C:\Patientcare\Patientcare\Userrole"
Call npm run build
CD /D "C:\Patientcare\Patientcare\Warehouse"
Call npm run build
CD /D "C:\Patientcare\Patientcare\Web"
Call npm run build
CD /D "C:\Patientcare\Patientcare"