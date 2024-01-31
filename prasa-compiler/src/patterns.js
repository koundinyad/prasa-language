export const seq = {
  ya: "IUU",
  ma: "UUU",
  ta: "UUI",
  ra: "UIU",
  ja: "IUI",
  ba: "UII",
  na: "III",
  sa: "IIU",
  va: "IU",
  ga: "U",
};

export const syllable_patterns = [
  {
    name: "Utpalamāla",
    pattern: `${seq.ba}${seq.ra}${seq.na}${seq.ba}${seq.ba}${seq.ra}${seq.va}`,
    len: 20,
  },
  {
    name: "Campakamāla",
    pattern: `${seq.na}${seq.ja}${seq.ba}${seq.ja}${seq.ja}${seq.ja}${seq.ra}`,
    len: 21,
  },
  {
    name: "Mattēbham",
    pattern: `${seq.sa}${seq.ba}${seq.ra}${seq.na}${seq.ma}${seq.ya}${seq.va}`,
    len: 20,
  },
  {
    name: "Śārdūlam",
    pattern: `${seq.ma}${seq.sa}${seq.ja}${seq.sa}${seq.ta}${seq.ta}${seq.ga}`,
    len: 19,
  },
];
