#!/bin/bash

cd /var/apps/Patientcare/Patientcare/Auth
npm install
npm run build

cd /var/apps/Patientcare/Patientcare/Business
npm install
npm run build

cd /var/apps/Patientcare/Patientcare/File
npm install
npm run build

cd /var/apps/Patientcare/Patientcare/Log
npm install
npm run build

cd /var/apps/Patientcare/Patientcare/Setting
npm install
npm run build

cd /var/apps/Patientcare/Patientcare/System
npm install
npm run build

cd /var/apps/Patientcare/Patientcare/Userrole
npm install
npm run build

cd /var/apps/Patientcare/Patientcare/Warehouse
npm install
npm run build

cd /var/apps/Patientcare/Patientcare

pm2 restart all