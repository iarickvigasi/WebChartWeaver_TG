 const displayJSON = (json) => {
    let text = '';
    // loop through each key in json
    for (let key in json){
        // get value of each key
        const value = json[key];
        // if the value is an object
        if (typeof value === 'object') {
            // append key and start of object
            text += `${key}: {`
            // loop through each key in the object
            for (let subKey in value) {
                // get the value of each key
                const subValue = value[subKey];
                // append key and value
                text += `${subKey}: ${subValue}`
            }
            // append end of object
            text += '}'
        } else {
            // append key and value
            text += `${key}: ${value} \n`
        }
    }
    // return the text
    return text;
}

export {
    displayJSON
}