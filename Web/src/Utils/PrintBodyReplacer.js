import validator from "./Validator"

const PrintDataReplacer = (template, data) => {

    if (!data && !validator.isObject(data)) {
        return template
    }

    const arrayRegex = /{{#(\w+)}}([\s\S]*?){{\/\1}}/g;

    template = template.replace(arrayRegex, (match, key, content) => {
        if (!Array.isArray(data[key])) return match;
        return data[key]
            .map(item => PrintDataReplacer(content, item))
            .join("");
    });

    return template.replace(/{{(\w+)}}/g, (match, key) => (key in data ? data[key] : match));
}

export default PrintDataReplacer