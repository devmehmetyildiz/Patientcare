const messages = {
  ERROR: {
    MAILSETTING_NOT_FOUND: {
      code: 'MAILSETTING_NOT_FOUND', description: {
        en: 'The mail setting not found',
        tr: 'Mail ayarı bulunamadı',
      }
    },
    MAILSETTING_NOT_ACTIVE: {
      code: 'MAILSETTING_NOT_ACTIVE', description: {
        en: 'The mail setting not active',
        tr: 'Mail ayarı aktif değil',
      }
    },
    PRINTTEMPLATE_NOT_FOUND: {
      code: 'PRINTTEMPLATE_NOT_FOUND', description: {
        en: 'The print template not found',
        tr: 'Yazdırma taslağı bulunamadı',
      }
    },
    PRINTTEMPLATE_NOT_ACTIVE: {
      code: 'PRINTTEMPLATE_NOT_ACTIVE', description: {
        en: 'The print template not active',
        tr: 'Yazdırma taslağı aktif değil',
      }
    },
    RULE_NOT_FOUND: {
      code: 'RULE_NOT_FOUND', description: {
        en: 'The rule not found',
        tr: 'Kural bulunamadı',
      }
    },
    RULE_NOT_ACTIVE: {
      code: 'RULE_NOT_ACTIVE', description: {
        en: 'The rule not active',
        tr: 'Kural aktif değil',
      }
    },
    RULELOG_NOT_FOUND: {
      code: 'RULELOG_NOT_FOUND', description: {
        en: 'The rule log not found',
        tr: 'Kural bulunamadı',
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
    USER_REQUIRED: {
      code: 'USER_REQUIRED', description: {
        en: 'The user required',
        tr: 'Bu işlem için kullanıcı gerekli',
      }
    },
    PASSWORD_REQUIRED: {
      code: 'PASSWORD_REQUIRED', description: {
        en: 'The password required',
        tr: 'Bu işlem için parola gerekli',
      }
    },
    SMTPHOST_REQUIRED: {
      code: 'SMTPHOST_REQUIRED', description: {
        en: 'The smtp host required',
        tr: 'Bu işlem için smtp host gerekli',
      }
    },
    SMTPPORT_REQUIRED: {
      code: 'SMTPPORT_REQUIRED', description: {
        en: 'The smtp port required',
        tr: 'Bu işlem için smtp port gerekli',
      }
    },
    MAILADDRESS_REQUIRED: {
      code: 'MAILADDRESS_REQUIRED', description: {
        en: 'The mail address required',
        tr: 'Bu işlem için mail adresi gerekli',
      }
    },
    ISBODYHTML_REQUIRED: {
      code: 'ISBODYHTML_REQUIRED', description: {
        en: 'The is body html knowledge required',
        tr: 'Bu işlem için body html mi? biglisi gerekli',
      }
    },
    ISSETTINGACTIVE_REQUIRED: {
      code: 'ISSETTINGACTIVE_REQUIRED', description: {
        en: 'The is setting active knowledge required',
        tr: 'Bu işlem için ayar aktif mi? bilgisi gerekli',
      }
    },
    MAILSETTINGID_REQUIRED: {
      code: 'MAILSETTINGID_REQUIRED', description: {
        en: 'The mailsettingid required',
        tr: 'Bu işlem için mailsettingid gerekli',
      }
    },
    UNSUPPORTED_MAILSETTINGID: {
      code: 'UNSUPPORTED_MAILSETTINGID', description: {
        en: 'unsupported mailsettingid',
        tr: 'Tanımsız mailsettingid',
      }
    },

    PRINTTEMPLATEID_REQUIRED: {
      code: 'PRINTTEMPLATEID_REQUIRED', description: {
        en: 'The printtemplateid required',
        tr: 'Bu işlem için printtemplateid gerekli',
      }
    },
    RULE_REQUIRED: {
      code: 'RULE_REQUIRED', description: {
        en: 'The rule required',
        tr: 'Bu işlem için kural gerekli',
      }
    },
    UNSUPPORTED_PRINTTEMPLATEID: {
      code: 'UNSUPPORTED_PRINTTEMPLATEID', description: {
        en: 'unsupported printtemplateid',
        tr: 'Tanımsız printtemplateid',
      }
    },
    RULEID_REQUIRED: {
      code: 'RULEID_REQUIRED', description: {
        en: 'The ruleId required',
        tr: 'Bu işlem için ruleId gerekli',
      }
    },
    UNSUPPORTED_RULEID: {
      code: 'UNSUPPORTED_RULEID', description: {
        en: 'unsupported ruleId',
        tr: 'Tanımsız ruleId',
      }
    },

    PRINTTEMPLATE_REQUIRED: {
      code: 'PRINTTEMPLATE_REQUIRED', description: {
        en: 'The printtemplate required',
        tr: 'Bu işlem için yazdırma taslağı gerekli',
      }
    },
    VALUEKEY_REQUIRED: {
      code: 'VALUEKEY_REQUIRED', description: {
        en: 'The value key required',
        tr: 'Bu işlem için değer anahtarı gerekli',
      }
    },
    DEPARTMENTID_REQUIRED: {
      code: 'DEPARTMENTID_REQUIRED', description: {
        en: 'The departmentid required',
        tr: 'Bu işlem için department id bilgisi gerekli',
      }
    },
  }

}
module.exports = messages
