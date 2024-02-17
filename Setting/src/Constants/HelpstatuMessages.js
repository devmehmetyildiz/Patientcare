const HelpstatuMessages = {
  ERROR: {
    HELPSTATU_NOT_FOUND: {
      code: 'HELPSTATU_NOT_FOUND', description: {
        en: 'Help statu not found',
        tr: 'Bakıma ihtiyaç durumu bulunamadı',
      }
    },
    HELPSTATU_NOT_ACTIVE: {
      code: 'HELPSTATU_NOT_ACTIVE', description: {
        en: 'Help statu not active',
        tr: 'Bakıma ihtiyaç durumu aktif değil',
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
    HELPSTATUID_REQUIRED: {
      code: 'HELPSTATUID_REQUIRED', description: {
        en: 'The help statu id required',
        tr: 'Bu için Bakıma ihtiyaç durumu numarası Gerekli',
      }
    },
    UNSUPPORTED_HELPSTATUID: {
      code: 'UNSUPPORTED_HELPSTATUID', description: {
        en: 'Help statu id is unsupported',
        tr: 'Bakıma ihtiyaç durumu numarası geçersiz',
      }
    },
  }

}
module.exports = HelpstatuMessages
