const messages = {
    ERROR: {
        PATIENT_NOT_FOUND: {
            code: 'PATIENT_NOT_FOUND', description: {
                en: 'patient not found',
                tr: 'hasta bulunamadı',
            }
        },
        PATIENT_NOT_ACTIVE: {
            code: 'PATIENT_NOT_ACTIVE', description: {
                en: 'patient not active',
                tr: 'hasta bulunamadı',
            }
        },
        PATIENT_NOT_ON_PREREGISRATION: {
            code: 'PATIENT_NOT_ON_PREREGISRATION', description: {
                en: 'patient is not on preregistrations',
                tr: 'hasta ön kayıtta değil',
            }
        },
        PATIENTDEFINE_NOT_FOUND: {
            code: 'PATIENTDEFINE_NOT_FOUND', description: {
                en: 'patient define not found',
                tr: 'hasta tanımı bulunamadı',
            }
        },
        PATIENT_NOT_CHECKED: {
            code: 'PURCHASEORDER_NOT_CHECKED', description: {
                en: 'Purchase order not checked',
                tr: 'Satın alma aktif kontrol edilmemiş',
            }
        },
        PATIENT_NOT_APPROVED: {
            code: 'PATIENT_NOT_APPROVED', description: {
                en: 'Patient not approved',
                tr: 'Hasta onaylanmamış',
            }
        },
        PATIENT_IS_COMPLETED: {
            code: 'PATIENT_IS_COMPLETED', description: {
                en: 'Patient is completed',
                tr: 'Hasta tamamlanmış',
            }
        },
        PATIENT_IS_APPROVED: {
            code: 'PATIENT_IS_APPROVED', description: {
                en: 'Patient is approved',
                tr: 'Hasta onaylanmış',
            }
        },
        PATIENT_IS_CHECKED: {
            code: 'PATIENT_IS_CHECKED', description: {
                en: 'Patient is checked',
                tr: 'Hasta kontrol edilmiş',
            }
        },

    },
    VALIDATION_ERROR: {
        COUNTRYID_REQUIRED: {
            code: 'COUNTRYID_REQUIRED', description: {
                en: 'The CountryID required',
                tr: 'Bu işlem için kimlik numarası gerekli',
            }
        },
        FLOORID_REQUIRED: {
            code: 'FLOORID_REQUIRED', description: {
                en: 'The Floor required',
                tr: 'Bu işlem için Kat gerekli',
            }
        },
        BEDID_REQUIRED: {
            code: 'BEDID_REQUIRED', description: {
                en: 'The Bed required',
                tr: 'Bu işlem için Yatak gerekli',
            }
        },
        ROOMID_REQUIRED: {
            code: 'ROOMID_REQUIRED', description: {
                en: 'The Room required',
                tr: 'Bu işlem için Oda gerekli',
            }
        },
        PATIENTDEFINE_NOT_FOUND: {
            code: 'PATIENTDEFINE_NOT_FOUND', description: {
                en: 'patient define not found',
                tr: 'hasta tanımı bulunamadı',
            }
        },
        DEPARTMENTID_REQUIRED: {
            code: 'DEPARTMENTID_REQUIRED', description: {
                en: 'The DepartmentID required',
                tr: 'Bu işlem için DepartmentID gerekli',
            }
        },
        CASEID_REQUIRED: {
            code: 'CASEID_REQUIRED', description: {
                en: 'The CaseID required',
                tr: 'Bu işlem için CaseID gerekli',
            }
        },
        ISONINSTITUTION_REQUIRED: {
            code: 'ISONINSTITUTION_REQUIRED', description: {
                en: 'The Isoninstitution required',
                tr: 'Bu işlem için Isoninstitution gerekli',
            }
        },
        ISTRANSFERSTOCKS_REQUIRED: {
            code: 'ISTRANSFERSTOCKS_REQUIRED', description: {
                en: 'The isTransferstocks required',
                tr: 'Bu işlem için isTransferstocks gerekli',
            }
        },
        APPROVALDATE_REQUIRED: {
            code: 'APPROVALDATE_REQUIRED', description: {
                en: 'The Approval date required',
                tr: 'Bu işlem için giriş Tarihi tarihi gerekli',
            }
        },
        HAPPENSDATE_REQUIRED: {
            code: 'HAPPENSDATE_REQUIRED', description: {
                en: 'The happens date required',
                tr: 'Bu işlem için olur tarihi gerekli',
            }
        },
        STOCKDEFINEID_REQUIRED: {
            code: 'STOCKDEFINEID_REQUIRED', description: {
                en: 'The stock define id required',
                tr: 'Bu işlem için stok tanımı gerekli',
            }
        },
        SKT_REQUIRED: {
            code: 'SKT_REQUIRED', description: {
                en: 'The skt required',
                tr: 'Bu işlem için skt gerekli',
            }
        },
        TYPE_REQUIRED: {
            code: 'TYPE_REQUIRED', description: {
                en: 'The type required',
                tr: 'Bu işlem için stok türü gerekli',
            }
        },
        AMOUNT_REQUIRED: {
            code: 'AMOUNT_REQUIRED', description: {
                en: 'The amount required',
                tr: 'Bu işlem için miktar gerekli',
            }
        },
        PATIENTID_REQUIRED: {
            code: 'PATIENTID_REQUIRED', description: {
                en: 'The PatientID required',
                tr: 'Bu işlem için PatientID gerekli',
            }
        },
        UNSUPPORTED_PATIENTID: {
            code: 'UNSUPPORTED_PATIENTID', description: {
                en: 'The patientid is unsupported',
                tr: 'Tanımsız patientid',
            }
        },
        ISLEFT_REQUIRED: {
            code: 'ISLEFT_REQUIRED', description: {
                en: 'The is left is unsupported',
                tr: 'Ayrılmış mı? Bilgisi gerekli',
            }
        },
        ISALIVE_REQUIRED: {
            code: 'ISALIVE_REQUIRED', description: {
                en: 'The is alive is unsupported',
                tr: 'yaşıyor mu? Bilgisi gerekli',
            }
        },
        PATIENT_ALREADY_LEFT: {
            code: 'PATIENT_ALREADY_LEFT', description: {
                en: 'Patient already left from organiztion',
                tr: 'Hasta zaten kurumdan ayrılmış',
            }
        },
        PATIENT_IS_NOT_LEFT_OR_DEAD: {
            code: 'PATIENT_IS_NOT_LEFT_OR_DEAD', description: {
                en: 'Patient already left or dead from organiztion',
                tr: 'Hasta zaten kurumdan ayrılmamış veya vefat etmemiş',
            }
        },
        PATIENT_ALREADY_DEAD: {
            code: 'PATIENT_ALREADY_DEAD', description: {
                en: 'Patient already dead from organiztion',
                tr: 'Hasta zaten kurumdan ölmüş',
            }
        },
    }
}
module.exports = messages
