// Returns array of years to be used in select, range is from 100 years ago to current year.
export const getYears = () => {
  const today = new Date();
  let year = today.getFullYear();

  // If month is January, do not include current year (birthdate picker will only allow users to choose dates up to the previous month)
  if (today.getMonth() === 0) {
    year -= 1;
  }
  let years = [];
  for (let i = 0; i <= 100; i++) {
    years.push(year - i);
  }
  return years;
};

// Returns array of months to be used in select, if the birth year selected is the current year then only months up to the previous month will be shown.
export const getMonths = (year) => {
  const today = new Date();
  const currYear = today.getFullYear();
  const currMonth = today.getMonth();
  let months = [
    { idx: 1, name: "January" },
    { idx: 2, name: "February" },
    { idx: 3, name: "March" },
    { idx: 4, name: "April" },
    { idx: 5, name: "May" },
    { idx: 6, name: "June" },
    { idx: 7, name: "July" },
    { idx: 8, name: "August" },
    { idx: 9, name: "September" },
    { idx: 10, name: "October" },
    { idx: 11, name: "November" },
    { idx: 12, name: "December" },
  ];
  if (year === currYear) {
    months = months.slice(0, currMonth);
  }

  return months;
};

export const getDays = (month) => {
  switch (month) {
    case "February":
      return [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
      ];
    case "April":
    case "June":
    case "September":
    case "November":
      return [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
      ];
    default:
      return [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
      ];
  }
};
