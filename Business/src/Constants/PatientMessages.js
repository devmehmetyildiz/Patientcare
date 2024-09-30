const messages = {
    ERROR: {
        PATIENTEVENTMOVEMENT_NOT_FOUND: {
            code: 'PATIENTEVENTMOVEMENT_NOT_FOUND', description: {
                en: 'patient event movement not found',
                tr: 'hasta vaka hareketi bulunamadı',
            }
        },
        PATIENTEVENTMOVEMENT_NOT_ACTIVE: {
            code: 'PATIENTEVENTMOVEMENT_NOT_ACTIVE', description: {
                en: 'patient event movement not active',
                tr: 'hasta vaka hareketi bulunamadı',
            }
        },
        PATIENTMOVEMENT_NOT_FOUND: {
            code: 'PATIENTMOVEMENT_NOT_FOUND', description: {
                en: 'patient movement not found',
                tr: 'hasta hareketi bulunamadı',
            }
        },
        PATIENTMOVEMENT_NOT_ACTIVE: {
            code: 'PATIENTMOVEMENT_NOT_ACTIVE', description: {
                en: 'patient movement not active',
                tr: 'hasta hareketi bulunamadı',
            }
        },
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
        MOVEMENT_END_DATE_TOO_BIG: {
            code: 'MOVEMENT_END_DATE_TOO_BIG', description: {
                en: 'The movement end date is too big, you should enter lower date before next movement start',
                tr: 'Hareket sona erme tarihi çok güncel, geçmiş tarihli hareketlerde bir sonraki hareket tarihinden daha geçmiş hareket tarihi girmen gerekli',
            }
        },
        MOVEMENT_END_DATE_REQUIRED: {
            code: 'MOVEMENT_END_DATE_REQUIRED', description: {
                en: 'The movement end date required, system should know end date when you enter past dated movement',
                tr: 'Bu işlem için hareket sona erme tarihi gerekli, geçmiş tarihli hareket girişlerinde sistem bitiş tarihi bilmeli',
            }
        },
        USERID_REQUIRED: {
            code: 'USERID_REQUIRED', description: {
                en: 'The User ID required',
                tr: 'Bu işlem için Giriş Yapan Kullanıcı gerekli',
            }
        },
        EVENTID_REQUIRED: {
            code: 'EVENTID_REQUIRED', description: {
                en: 'The Event ID required',
                tr: 'Bu işlem için vaka gerekli',
            }
        },
        OCCUREDDATE_REQUIRED: {
            code: 'OCCUREDDATE_REQUIRED', description: {
                en: 'The Occured date required',
                tr: 'Bu işlem için gerçekleşme tarihi gerekli',
            }
        },
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
        PATIENTEVENTMOVEMENTID_REQUIRED: {
            code: 'PATIENTEVENTMOVEMENTID_REQUIRED', description: {
                en: 'The PatienteventmovementID required',
                tr: 'Bu işlem için Hasta Vaka Hareket Uuid gerekli',
            }
        },
        UNSUPPORTED_PATIENTEVENTMOVEMENTID: {
            code: 'UNSUPPORTED_PATIENTEVENTMOVEMENTID', description: {
                en: 'The patient event movement id is unsupported',
                tr: 'Tanımsız hasta vaka hareket uuid değeri',
            }
        },
        PATIENTMOVEMENTID_REQUIRED: {
            code: 'PATIENTMOVEMENTID_REQUIRED', description: {
                en: 'The PatientmovementID required',
                tr: 'Bu işlem için Hasta Hareket Uuid gerekli',
            }
        },
        UNSUPPORTED_PATIENTMOVEMENTID: {
            code: 'UNSUPPORTED_PATIENTMOVEMENTID', description: {
                en: 'The patient movement id is unsupported',
                tr: 'Tanımsız hasta hareket uuid değeri',
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
