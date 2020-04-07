import { ItemCategory, CategoryName, Action } from "../types";

export const itemCategories: ItemCategory[] = [
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

export const unknownItem: ItemCategory = {
  name: CategoryName.UNKNOWN,
  labels: [],
  actions: [Action.UNKNOWN],
  info:
    "The item's material is unclear. Please conduct your own research as to what action to take",
};
