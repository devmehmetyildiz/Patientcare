#!/bin/bash

cd /var/apps/Patientcare_test/Patientcare/Auth
npm install
npm run build

cd /var/apps/Patientcare_test/Patientcare/Business
npm install
npm run build

cd /var/apps/Patientcare_test/Patientcare/File
npm install
npm run build

cd /var/apps/Patientcare_test/Patientcare/Log
npm install
npm run build

cd /var/apps/Patientcare_test/Patientcare/Setting
npm install
npm run build

cd /var/apps/Patientcare_test/Patientcare/System
npm install
npm run build

cd /var/apps/Patientcare_test/Patientcare/Userrole
npm install
npm run build

cd /var/apps/Patientcare_test/Patientcare/Warehouse
npm install
npm run build

cd /var/apps/Patientcare_test/Patientcare/Web
npm install
npm run build

cd /var/apps/Patientcare_test/Patientcare

pm2 restart all