
export default function PrintBodyReplacer(body, meta) {
    Object.keys(meta).forEach(firstLayer => {
        if (meta[firstLayer] && typeof meta[firstLayer] === 'object') {
            Object.keys(meta[firstLayer]).forEach(secondLayer => {
                if (meta[firstLayer][secondLayer] && typeof meta[firstLayer][secondLayer] === 'object') {
                    Object.keys(meta[firstLayer][secondLayer]).forEach(thirdLayer => {
                        if (meta[firstLayer][secondLayer][thirdLayer] && typeof meta[firstLayer][secondLayer][thirdLayer] === 'object') {
                            Object.keys(meta[firstLayer][secondLayer][thirdLayer]).forEach(fourthLayer => {
                                if (body.includes(`{{${firstLayer}.${secondLayer}.${thirdLayer}.${fourthLayer}}}`)) { body = replaceAll(body, `{{${firstLayer}.${secondLayer}.${thirdLayer}.${fourthLayer}}}`, meta[firstLayer][secondLayer][thirdLayer][fourthLayer]) }
                            })
                        } else {
                            if (body.includes(`{{${firstLayer}.${secondLayer}.${thirdLayer}}}`)) { body = replaceAll(body, `{{${firstLayer}.${secondLayer}.${thirdLayer}}}`, meta[firstLayer][secondLayer][thirdLayer]) }
                        }
                    })
                } else {
                    if (body.includes(`{{${firstLayer}.${secondLayer}}}`)) { body = replaceAll(body, `{{${firstLayer}.${secondLayer}}}`, meta[firstLayer][secondLayer]) }
                }
            })
        } else {
            if (body.includes(`{{${firstLayer}}}`)) { body = replaceAll(body, `{{${firstLayer}}}`, meta[firstLayer]) }
        }
    });
    return body;
}

function replaceAll(str, find, replace) {
    let res = str.split(find).join(replace ? replace : '')
    return res
}


