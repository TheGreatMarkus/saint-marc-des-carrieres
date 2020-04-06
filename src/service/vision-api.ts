import { env } from "../../env";
import { ItemCategory, Action, CategoryName } from "../types";

const googleVisionApi = "https://vision.googleapis.com/v1/images:annotate";
const numResults = 7;

const itemCategories: ItemCategory[] = [
  {
    name: CategoryName.COFFEE,
    labels: ["coffee"],
    actions: [Action.RECYCLE, Action.COMPOST],
    info:
      "Coffee Cups are often recyclable or compostable, depending on material.",
  },
  {
    name: CategoryName.ALUMINUM_CAN,
    labels: ["aluminum can"],
    actions: [Action.RECYCLE],
    info: "All recycling cans can be recycled!",
  },
  {
    name: CategoryName.DRINK,
    labels: ["drink", "juice", "liquid"],
    actions: [Action.RECYCLE, Action.TRASH],
    info:
      "Drink containers are often made of recyclable plastic and glass. Please check the type of container before disposing of the drink",
  },
  {
    name: CategoryName.METAL,
    labels: ["aluminum", "tin", "metal"],
    actions: [Action.RECYCLE],
    info: "Metal is infinitely recyclable!",
  },
  {
    name: CategoryName.PAPER,
    labels: ["cardboard", "paper"],
    actions: [Action.RECYCLE, Action.COMPOST],
    info:
      "Clean paper products are both recyclable and compostable. Soiled paper, such as greasy pizza boxes, are compostable but not recyclable!",
  },
  {
    name: CategoryName.PLASTIC,
    labels: ["plastic"],
    actions: [Action.RECYCLE],
    info:
      "Plastics are often recyclable, but there are a few exceptions: plastic bags, straws and coffee cups. Additionally, only CLEAN plastics are recyclable, so rinse first!",
  },
  {
    name: CategoryName.GLASS,
    labels: ["glass"],
    actions: [Action.RECYCLE],
    info: "Glass is infinitely recyclable!",
  },
  {
    name: CategoryName.ORGANIC,
    labels: ["food", "apple", "banana", "fruit"],
    actions: [Action.COMPOST, Action.TRASH],
    info:
      "Things that are compostable include some foods, dead leaves, fruit and vegetable scraps, cardboard, and more. Organics that arent compostable include things that emit odors and attract rodents and flies, such as fats and oils, dairy products and meat products.",
  },
  {
    name: CategoryName.EWASTE,
    labels: [
      "computer",
      "smartphone",
      "phone",
      "electronic",
      "technology",
      "laptop",
    ],
    actions: [Action.EWASTE],
    info:
      "If it's an electronic device and you wish to dispose of it (defective, etc.), it's e-waste. Dispose of it in specially designated areas in your city.",
  },
  {
    name: CategoryName.TRASH,
    labels: ["trash"],
    actions: [Action.TRASH],
    info:
      "Trash is usually composite materials or plastics that aren't recyclable, such as cereal, cookie or cracker wrappers, black plastic containers, coffee cups, bubble wrap, plastic or foil wrappers, straws, toothpicks, ribbons, broken dishes, etc.",
  },
];

const unknownItem: ItemCategory = {
  name: CategoryName.UNKNOWN,
  labels: [],
  actions: [Action.UNKNOWN],
  info:
    "The item's material is unclear. Please conduct your own research as to what action to take",
};

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
