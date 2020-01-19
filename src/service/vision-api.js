import env from "../../env.js"

const googleVisionApi = "https://vision.googleapis.com/v1/images:annotate";
const numResults = 7;

const materialTypes = {
    metal: "Metal",
    plastic: "Plastic",
    paper: "Paper",
    glass: "Glass",
    organic: "Organic Material",
    ewaste: "E-Waste",
    unknown: "Material Unknown"
}

const actionTypes = {
    recycle: "Recyclable",
    organic: "Compostable",
    trash: "Trash",
    ewaste: "E-waste",
    unknown: "Action Unknown"
}

const labelMap = {
    material: {
        metal: ['aluminum', 'tin', 'metal'],
        plastic: ['plastic'],
        paper: ['cardboard', 'paper'],
        glass: ['glass'],
        organic: ['food', 'apple']
    },
    type: {
        beverage: ['bottle', 'drink', 'beverage']
    }

}

/**
 * Get labels from base64 image
 * 
 * Usage: Call with "await" in an async function.
 * 
 * Example:
 *  
 * let information = await getImageInformation(base64);
 * 
 * @param {string} base64Image 
 */
export const getImageInformation = async (base64Image) => {

    let response = await fetch(`${googleVisionApi}?key=${env.visionApiKey}`, {
        method: 'POST',
        body: JSON.stringify({
            "requests": [{
                "image": {
                    "content": base64Image
                },
                "features": [{
                    "maxResults": numResults,
                    "type": "LABEL_DETECTION"
                }]
            }]
        })
    });

    let objectInfo = await response.json()
        .then(data => {
            console.log(data);
            let labels = [];
            for (const { mid, description, score, topicality } of data.responses[0].labelAnnotations) {
                labels.push(description);
            }
            let labelString = labels.join(" ");
            let type, material, action;

            type = findType(labelString);
            material = findMaterial(labelString);
            action = findAction(material);
            moreInfo = findMoreInfo(material, action);

            const imageInformation = {
                type: type,
                material: material,
                action, action,
                moreInfo: moreInfo
            }

            console.log(imageInformation);

            return imageInformation;
        }).catch((error) => { console.log(error) });

    return objectInfo;
}


/**
 * 
 * @param {string} string 
 * @param {string[]} keywords 
 */
const stringContainsKeywords = (string, keywords) => {
    let regex = new RegExp(`(${keywords.join("|")})`, 'i');
    console.log(`string: ${string}`);
    console.log(`regex: ${regex}`);
    console.log(`search: ${string.search(regex)}`);
    console.log(string.search(regex));
    return string.search(regex) !== -1;
}

const findType = (labelString) => {
    return '';
}

const findMaterial = (labelString) => {
    if (stringContainsKeywords(labelString, labelMap.material.metal)) {
        return materialTypes.metal;
    } else if (stringContainsKeywords(labelString, labelMap.material.plastic)) {
        return materialTypes.plastic;
    } else if (stringContainsKeywords(labelString, labelMap.material.paper)) {
        return materialTypes.paper;
    } else if (stringContainsKeywords(labelString, labelMap.material.glass)) {
        return materialTypes.glass;
    } else if (stringContainsKeywords(labelString, labelMap.material.organic)) {
        return materialTypes.organic;
    } else {
        return materialTypes.unknown;
    }
}

const findAction = (material) => {
    switch (material) {
        case materialTypes.plastic:
        case materialTypes.paper:
        case materialTypes.glass:
        case materialTypes.metal:
            return actionTypes.recycle;
            break;
        case materialTypes.organic:
            return actionTypes.organic;
            break;
        case materialTypes.trash:
            return actionTypes.trash;
            break;
        case materialTypes.ewaste:
            return actionTypes.ewaste;
            break;
        default:
            return actionTypes.unknown;
            return '';
            break;
    }
}

const findMoreInfo = (material) => {
    switch (material) {
        case materialTypes.plastic:
            return 'Plastics are often recyclable, but there are a few exceptions: plastic bags, straws and coffee cups aren\'t usually recyclable. Additionally, only CLEAN plastics are recyclable, so wash your food off before putting it in the bin!';
            break;
        case materialTypes.paper:
            return 'Clean paper products are both recyclable and compostable. Soiled paper, such as greasy pizza boxes, are compostable but not recyclable, so rip up that old pizza box and compost it!';
            break;
        case materialTypes.glass:
        case materialTypes.metal:
            return 'Both glass and metal (such as aluminum cans) products are infinitely recyclable!';
            break;
        case materialTypes.organic:
            return 'Things that are compostable include dead leaves, twigs, grass clippings, fruit and vegetable scraps, coffee grounds, cardboard, and more. Things that arent compostable include things that emit odors and attract rodents and flies, such as fats and oils, dairy products and meat products.';
            break;
        case materialTypes.trash:
            return 'Trash is usually composite materials or plastics that aren\'t recyclable, such as cereal, cookie or cracker wrappers, black plastic containers, coffee cups, bubble wrap, plastic or foil wrappers, straws, toothpicks, ribbons, broken dishes, etc.';
            break;
        case materialTypes.ewaste:
            return 'If you can plug it into an outlet, or it has circuit boards or chips, it\'s e-waste. Dispose of it in specially designated areas in your city.';
            break;
        default:
            return "The item's material is unclear. Please conduct your own research as to what action to take"
    }
}
