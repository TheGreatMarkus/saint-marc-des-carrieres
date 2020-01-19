import env from "../../env.js"

const googleVisionApi = "https://vision.googleapis.com/v1/images:annotate";
const numResults = 7;

export const actions = {
    recycle: "Recycle",
    compost: "Compost",
    trash: "Trash",
    ewaste: "E-Waste Management"
}

const itemCategories = [
    {
        name: "Coffee",
        labels: ['coffee'],
        actions: [actions.recycle, actions.compost],
        info: 'Coffee Cups are often recyclable or compostable, depending on material.'
    },
    {
        name: 'Aluminum Can',
        labels: ['aluminum can'],
        actions: [actions.recycle],
        info: 'All recycling cans can be recycled!'
    },
    {
        name: "Drink",
        labels: ['drink', 'juice', 'liquid'],
        actions: [actions.recycle, actions.trash],
        info: 'Drink containers are often made of recyclable plastic and glass. Please check the type of container before disposing of the drink'
    },
    {
        name: "Metal",
        labels: ['aluminum', 'tin', 'metal'],
        actions: [actions.recycle],
        info: 'Metal is infinitely recyclable!'
    },
    {
        name: "Paper",
        labels: ['cardboard', 'paper'],
        actions: [actions.recycle, actions.compost],
        info: 'Clean paper products are both recyclable and compostable. Soiled paper, such as greasy pizza boxes, are compostable but not recyclable!'
    },
    {
        name: "Plastic",
        labels: ['plastic'],
        actions: [actions.recycle],
        info: 'Plastics are often recyclable, but there are a few exceptions: plastic bags, straws and coffee cups. Additionally, only CLEAN plastics are recyclable, so rinse first!'
    },
    {
        name: "Glass",
        labels: ['glass'],
        actions: [actions.recycle],
        info: 'Glass is infinitely recyclable!'
    },
    {
        name: "Organic Material",
        labels: ['food', 'apple'],
        actions: [actions.compost,  actions.trash],
        info: 'Things that are compostable include some foods, dead leaves, twigs, grass clippings, fruit and vegetable scraps, coffee grounds, cardboard, and more. Organics that arent compostable include things that emit odors and attract rodents and flies, such as fats and oils, dairy products and meat products.'
    },
    {
        name: "E-Waste",
        labels: ['computer', 'smartphone', 'phone'],
        actions: [actions.ewaste],
        info: "If it's an electronic device and you wish to dispose of it (defective, etc.), it\'s e-waste. Dispose of it in specially designated areas in your city."
    },
    {
        name: "Trash",
        labels: ['trash'],
        actions: [actions.trash],
        info: 'Trash is usually composite materials or plastics that aren\'t recyclable, such as cereal, cookie or cracker wrappers, black plastic containers, coffee cups, bubble wrap, plastic or foil wrappers, straws, toothpicks, ribbons, broken dishes, etc.'
    }
]

const unknownItem = {
    category: 'Unknown',
    actions: ['Unknown'],
    info: "The item's material is unclear. Please conduct your own research as to what action to take"
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
            let labels = [];
            for (const { mid, description, score, topicality } of data.responses[0].labelAnnotations) {
                labels.push(description);
            }

            let labelString = labels.join(" ");

            result = categorizeItem(labelString);
            const { category, actions, info } = result;

            const imageInformation = {
                category: category,
                actions, actions,
                info: info
            }


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
    let regex = new RegExp(`\\b(${keywords.join("|")})\\b`, 'i');
    // console.log(`string: ${string}`);
    // console.log(`regex: ${regex}`);
    // console.log(`search: ${string.search(regex)}`);
    // console.log(string.search(regex));
    return string.search(regex) !== -1;
}

const categorizeItem = (labelString) => {
    for (const { name, labels, actions, info } of itemCategories) {
        // console.log(`\n\n\nTrying ${name} with labels ${labels.join()}`)
        // console.log(`labelString: ${labelString}`);
        if (stringContainsKeywords(labelString, labels)) {
            return {
                category: name,
                actions: actions,
                info: info
            }
        }
    }
    return unknownItem;
}
