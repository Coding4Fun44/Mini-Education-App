export type Question = {
  id: number;
  image: any;
  options: string[];
  correctIndex: number;
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    image: require("../assets/images/loose-items.png"),
    options: [
      "Loose items like toys and blankets",
      "Crib Bumpers",
      "BedSharing",
    ],
    correctIndex: 0,
  },
  {
    id: 2,
    image: require("../assets/images/crib-bumpers.png"),
    options: [
      "Loose items like toys and blankets",
      "Crib Bumpers",
      "BedSharing",
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    image: require("../assets/images/bedsharing.png"),
    options: [
      "Crib Bumpers",
      "Loose items like toys and blankets",
      "BedSharing",
    ],
    correctIndex: 2,
  },
];
