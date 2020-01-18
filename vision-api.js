import env from "./env.js"
const googleVisionApi = "https://vision.googleapis.com/v1/images:annotate";



/**
 * Get labels from base64 image
 * 
 * Usage: In an async function:
 * 
 * await getLabelsFromImage(base64Image);
 * 
 * @param {*} base64Image 
 */
export const getLabelsFromImage = async (base64Image) => {

    let googleVisionRes = await fetch(`${googleVisionApi}?key=${env.visionApiKey}`, {
        method: 'POST',
        body: JSON.stringify({
            "requests": [
                {
                    "image": {
                        "content": base64Image
                    },
                    "features": [
                        {
                            "maxResults": 3,
                            "type": "LABEL_DETECTION"
                        }
                    ]
                }
            ]
        })
    });

    let labels = await googleVisionRes.json()
        .then(visionApiResponse => {
            console.log("in then() - Response from api!")
            console.log(visionApiResponse);
            let labels = [];
            for (const { mid, description, score, topicality } of visionApiResponse.responses[0].labelAnnotations) {
                labels.push(description);
            }
            console.log(labels);
            return labels;
        }).catch((error) => { console.log(error) });

    return labels;
}
