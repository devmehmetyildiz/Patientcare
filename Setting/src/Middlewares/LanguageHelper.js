
const languages = [
    'tr',
    'en'
]

module.exports = (req, res, next) => {
    if (req.headers && req.headers.language) {
        const language = req.headers.language
        languages.includes(language.toLowerCase()) && (req.language = language.toLowerCase())
        req.i18n.changeLanguage(language)
        console.log('req.i18n: ', req.i18n);
        console.log('req.t(test): ', req.t('test'));
    }
    next()
}