const messages = {
  ERROR: {
    CASE_NOT_FOUND: {
      code: 'CASE_NOT_FOUND', description: {
        en: 'Case not found',
        tr: 'Durum bulunamadı',
      }
    },
    CASE_NOT_ACTIVE: {
      code: 'CASE_NOT_ACTIVE', description: {
        en: 'Case not active',
        tr: 'Durum aktif değil',
      }
    },

  },
  VALIDATION_ERROR: {
    NAME_REQUIRED: {
      code: 'NAME_REQUIRED', description: {
        en: 'The name required',
        tr: 'Bu işlem için isim gerekli',
      }
    },
    SHORTNAME_REQUIRED: {
      code: 'SHORTNAME_REQUIRED', description: {
        en: 'The shortname required',
        tr: 'Bu işlem için kısaltma gerekli',
      }
    },
    CASECOLOR_REQUIRED: {
      code: 'CASECOLOR_REQUIRED', description: {
        en: 'The casecolor required',
        tr: 'Bu işlem için durum rengi gerekli',
      }
    },
    DEPARTMENTS_REQUIRED: {
      code: 'DEPARTMENTS_REQUIRED', description: {
        en: 'The departments required',
        tr: 'Bu işlem için departmanlar gerekli',
      }
    },
    CASEID_REQUIRED: {
      code: 'CASEID_REQUIRED', description: {
        en: 'The caseId required',
        tr: 'Bu işlem için caseid bilgisi gerekli',
      }
    },
    UNSUPPORTED_CASEID: {
      code: 'UNSTUPPORTED_CASEID', description: {
        en: 'The caseId is not supported',
        tr: 'geçersiz durum numarası',
      }
    },
    UNSUPPORTED_DEPARTMENTID: {
      code: 'UNSTUPPORTED_CASEID', description: {
        en: 'The department id is not supported',
        tr: 'geçersiz departman numarası',
      }
    },

  }

}
module.exports = messages
