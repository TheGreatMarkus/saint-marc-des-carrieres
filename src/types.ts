export interface ItemCategory {
  name: CategoryName;
  labels: string[];
  actions: Action[];
  info: string;
}

export enum CategoryName {
  COFFEE = "Coffee",
  ALUMINUM_CAN = "Aluminum Can",
  DRINK = "Drink",
  METAL = "Metal",
  PAPER = "Paper",
  PLASTIC = "Plastic",
  GLASS = "Glass",
  ORGANIC = "Organic Material",
  EWASTE = "E-Waste",
  TRASH = "Trash",
  UNKNOWN = "Unknown",
}

export enum Action {
  RECYCLE = "Recycle",
  COMPOST = "Compost",
  TRASH = "Trash",
  EWASTE = "E-Waste Management",
  UNKNOWN = "Unknown",
}
