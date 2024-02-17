const MakingtypeMessages = {
  ERROR: {
    MAKINGTYPE_NOT_FOUND: {
      code: 'MAKINGTYPE_NOT_FOUND', description: {
        en: 'Making type not found',
        tr: 'Hizmetin verilme şekli bulunamadı',
      }
    },
    MAKINGTYPE_NOT_ACTIVE: {
      code: 'MAKINGTYPE_NOT_ACTIVE', description: {
        en: 'Making type not active',
        tr: 'Hizmetin verilme şekli aktif değil',
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
    MAKINGTYPEID_REQUIRED: {
      code: 'MAKINGTYPEID_REQUIRED', description: {
        en: 'The Making type id required',
        tr: 'Bu için Hizmetin verilme şekli numarası Gerekli',
      }
    },
    UNSUPPORTED_MAKINGTYPEID: {
      code: 'UNSUPPORTED_MAKINGTYPEID', description: {
        en: 'Making type id is unsupported',
        tr: 'Hizmetin verilme şekli numarası geçersiz',
      }
    },
  }

}
module.exports = MakingtypeMessages
