const HelpstatuMessages = {
  ERROR: {
    PARAMETER_NOT_FOUND: {
      code: 'PARAMETER_NOT_FOUND', description: {
        en: 'parameter not found',
        tr: 'Parametre bulunamadı',
      }
    },
    PARAMETER_NOT_ACTIVE: {
      code: 'PARAMETER_NOT_ACTIVE', description: {
        en: 'parameter not active',
        tr: ' Parametre aktif değil',
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
    TYPE_REQUIRED: {
      code: 'TYPE_REQUIRED', description: {
        en: 'The type required',
        tr: 'Bu işlem için tür gerekli',
      }
    },
    PARAMETERID_REQUIRED: {
      code: 'PARAMETERID_REQUIRED', description: {
        en: 'The parameter id required',
        tr: 'Bu için Parametre numarası Gerekli',
      }
    },
    UNSUPPORTED_PARAMETERID: {
      code: 'UNSUPPORTED_PARAMETERID', description: {
        en: 'Help parameter id is unsupported',
        tr: 'Parametre numarası geçersiz',
      }
    },
  }

}
module.exports = HelpstatuMessages
