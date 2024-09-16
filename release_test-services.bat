@Echo Off
CD /D "C:\Patientcare_test\Patientcare\Auth"
Call npm install
Call npm run build 
CD /D "C:\Patientcare_test\Patientcare\Business"
Call npm install
Call npm run build
CD /D "C:\Patientcare_test\Patientcare\File"
Call npm install
Call npm run build
CD /D "C:\Patientcare_test\Patientcare\Log"
Call npm install
Call npm run build
CD /D "C:\Patientcare_test\Patientcare\Setting"
Call npm install
Call npm run build
CD /D "C:\Patientcare_test\Patientcare\System"
Call npm install
Call npm run build
CD /D "C:\Patientcare_test\Patientcare\Userrole"
Call npm install
Call npm run build
CD /D "C:\Patientcare_test\Patientcare\Warehouse"
Call npm install
Call npm run build
CD /D "C:\Patientcare_test\Patientcare"