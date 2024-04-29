const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const users = [
  {
    id: 1,
    name: "Harry Potter",
    role: "Student",
    house: "Gryffindor",
    status: "active",
    age: "17",
    avatar:
      "https://upload.wikimedia.org/wikipedia/en/d/d7/Harry_Potter_character_poster.jpg?20210608000322",
    email: "harry.potter@hogwarts.edu",
    complaint:
      "Severus Snape's biased treatment of Gryffindor students in the Potions class often leads Harry Potter to feel unfairly targeted and discouraged.",
  },
  {
    id: 2,
    name: "Hermione Granger",
    role: "Student",
    house: "Gryffindor",
    status: "active",
    age: "17",
    avatar:
      "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRKMA0Vhx2HFxv8roCzf7jCjyfW9fD0CnS2cUmF67ietlN2kDtOtsSTDhXoPXi7",
    email: "hermione.granger@hogwarts.edu",
    complaint:
      "Severus Snape's strict grading system in the Potions class unfairly penalizes students for minor mistakes, hindering their learning and growth.",
  },
  {
    id: 3,
    name: "Neville Longbottom",
    role: "Student",
    house: "Gryffindor",
    status: "active",
    age: "17",
    avatar:
      "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT7zVc2MbYzSEBGhziTP6A3LPjy_IzYnf1vVZTfMbC5qk6TTwcDjPOckTGMWWPz",
    email: "neville.longbottom@hogwarts.edu",
    complaint:
      "Severus Snape's lack of patience and encouragement in the Potions class causes Neville Longbottom to feel constantly anxious and underperform.",
  },
  {
    id: 4,
    name: "Draco Malfoy",
    role: "Student",
    house: "Slytherin",
    status: "active",
    age: "17",
    avatar:
      "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTFMoY0uBm0Gf2vaoQsS25dNmoDcIRTphl4Z5KsoFiDsi2cAXuKii6p_hN6XvHY",
    email: "draco.malfoy@hogwarts.edu",
    complaint:
      "Severus Snape's favoritism towards Slytherin students in the Potions class fosters a toxic competitive atmosphere among houses, hindering cooperation and mutual respect.",
  },
  {
    id: 5,
    name: "Luna Lovegood",
    role: "Student",
    house: "Ravenclaw",
    status: "active",
    age: "16",
    avatar:
      "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS-v4l-a4OI23PK20jltIXUscTWhwbq5b-aVW5LdGY6rD_9Xn-57GLJYerHJbux",
    email: "luna.lovegood@hogwarts.edu",
    complaint:
      "Severus Snape's refusal to explain the rationale behind certain potion ingredients and processes in the Potions class hinders Luna Lovegood's ability to fully understand and appreciate the subject.",
  },
];

export { columns, users };
