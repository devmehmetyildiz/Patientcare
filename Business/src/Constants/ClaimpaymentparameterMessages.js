const messages = {
    ERROR: {
        CLAIMPAYMENTPARAMETER_NOT_FOUND: {
            code: 'CLAIMPAYMENTPARAMETER_NOT_FOUND', description: {
                en: 'claim payment parameter not found',
                tr: 'hakediş parametresi bulunamadı',
            }
        },
        CLAIMPAYMENTPARAMETER_NOT_ACTIVE: {
            code: 'CLAIMPAYMENTPARAMETER_NOT_ACTIVE', description: {
                en: 'claim payment parameter not active',
                tr: 'hakediş parametresi bulunamadı',
            }
        },
        CLAIMPAYMENTPARAMETER_ALREADY_APPROVED: {
            code: 'CLAIMPAYMENTPARAMETER_ALREADY_APPROVED', description: {
                en: 'claim payment parameter already approve',
                tr: 'hakediş parametresi zaten onaylı',
            }
        },
        CLAIMPAYMENTPARAMETER_IS_NOT_APPROVED: {
            code: 'CLAIMPAYMENTPARAMETER_IS_NOT_APPROVED', description: {
                en: 'claim payment parameter is not approved',
                tr: 'hakediş parametresi onaylı değil',
            }
        },
    },
    VALIDATION_ERROR: {
        TYPE_REQUIRED: {
            code: 'TYPE_REQUIRED', description: {
                en: 'The claim payment parameter type required',
                tr: 'Bu işlem için hakediş parametre türü gerekli',
            }
        },
        COSTUMERTYPEID_REQUIRED: {
            code: 'COSTUMERTYPEID_REQUIRED', description: {
                en: 'The claim payment parameter costumer type required',
                tr: 'Bu işlem için hakediş parametre müşteri türü gerekli',
            }
        },
        PERPAYMENT_REQUIRED: {
            code: 'PERPAYMENT_REQUIRED', description: {
                en: 'The claim payment parameter per payment required',
                tr: 'Bu işlem için hakediş parametre birim ücret gerekli',
            }
        },
        CLAIMPAYMENTPARAMETERID_REQUIRED: {
            code: 'CLAIMPAYMENTPARAMETERID_REQUIRED', description: {
                en: 'The claim payment parameter id required',
                tr: 'Bu işlem için hakediş parametre numarası gerekli',
            }
        },
        UNSUPPORTED_CLAIMPAYMENTPARAMETERID: {
            code: 'UNSUPPORTED_CLAIMPAYMENTPARAMETERID', description: {
                en: 'The claim payment parameter id unsupported',
                tr: 'hakediş parametre numarası geçersiz',
            }
        },

    }
}
module.exports = messages
