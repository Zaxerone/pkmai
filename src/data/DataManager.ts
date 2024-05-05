interface Pokemon {
  name: string;
  types: string[];
  baseStats: { [key: string]: number };
  abilities: { [key: string]: string };
  weightkg: number;
  gen: number;
  tier: string;
}

interface Ability {
  num: number;
  accuracy: number | boolean;
  basePower: number;
  category: "Special" | "Status" | "Attack";
  isNonstandart: string;
  name: string;
  pp: number;
  priority: number;
  flags: { [key: string]: number };
  isZ: string;
  zMove: object;
  self: any;
  critRatio: number;
  secondary: any;
  target: string;
  type: string;
  contestType: string;
  desc: string;
  shortDesc: string;
}
