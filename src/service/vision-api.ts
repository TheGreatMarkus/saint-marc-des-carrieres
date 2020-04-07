/**
 * Include a env.ts file with an exported object of type Env
 *
 * Example:
 *
 * export const env = {
 *   apiKey: "your-api-key",
 * };
 *
 */
import { env } from "../../env";
import { ItemCategory } from "../types";
import { itemCategories, unknownItem } from "../data/categories";

const googleVisionApi = "https://vision.googleapis.com/v1/images:annotate";
const numResults = 7;

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
export const getImageInformation = async (
  base64Image: string
): Promise<ItemCategory> => {
  return fetch(`${googleVisionApi}?key=${env.apiKey}`, {
    method: "POST",
    body: JSON.stringify({
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              maxResults: numResults,
              type: "LABEL_DETECTION",
            },
          ],
        },
      ],
    }),
  })
    .then((reponse) => {
      return reponse.json();
    })
    .then((data) => {
      let labels = [];
      for (const { description } of data.responses[0].labelAnnotations) {
        labels.push(description);
      }

      let labelString = labels.join(" ");

      return categorizeItem(labelString);
    })
    .catch((error) => {
      return unknownItem;
    });
};

/**
 *
 * @param {string} string
 * @param {string[]} keywords
 */
const stringContainsKeywords = (string: string, keywords: string[]) => {
  let regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "i");
  // console.log(`string: ${string}`);
  // console.log(`regex: ${regex}`);
  // console.log(`search: ${string.search(regex)}`);
  return string.search(regex) !== -1;
};

const categorizeItem = (labelString: string): ItemCategory => {
  const result = itemCategories.find((category) => {
    return stringContainsKeywords(labelString, category.labels);
  });
  console.log("\n\nSEARCH RESULTS");
  console.log({ result, labelString });

  if (!result) {
    return unknownItem;
  }
  return result;
};
