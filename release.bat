@Echo Off
CD /D "C:\MyFiles\Patientcare\Auth"
Call npm run build 
CD /D "C:\MyFiles\Patientcare\Business"
Call npm run build
CD /D "C:\MyFiles\Patientcare\File"
Call npm run build
CD /D "C:\MyFiles\Patientcare\Log"
Call npm run build
CD /D "C:\MyFiles\Patientcare\Setting"
Call npm run build
CD /D "C:\MyFiles\Patientcare\System"
Call npm run build
CD /D "C:\MyFiles\Patientcare\Userrole"
Call npm run build
CD /D "C:\MyFiles\Patientcare\Warehouse"
Call npm run build
CD /D "C:\MyFiles\Patientcare\Web"
Call npm run build
CD /D "C:\MyFiles\Patientcare"