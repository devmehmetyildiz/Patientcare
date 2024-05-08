@Echo Off
CD /D "C:\MyFiles\Patientcare\Patientcare\Auth"
Call npm run build 
CD /D "C:\MyFiles\Patientcare\Patientcare\Business"
Call npm run build
CD /D "C:\MyFiles\Patientcare\Patientcare\File"
Call npm run build
CD /D "C:\MyFiles\Patientcare\Patientcare\Log"
Call npm run build
CD /D "C:\MyFiles\Patientcare\Patientcare\Setting"
Call npm run build
CD /D "C:\MyFiles\Patientcare\Patientcare\System"
Call npm run build
CD /D "C:\MyFiles\Patientcare\Patientcare\Userrole"
Call npm run build
CD /D "C:\MyFiles\Patientcare\Patientcare\Warehouse"
Call npm run build
CD /D "C:\MyFiles\Patientcare\Patientcare\Web"
Call npm run build
CD /D "C:\MyFiles\Patientcare\Patientcare"