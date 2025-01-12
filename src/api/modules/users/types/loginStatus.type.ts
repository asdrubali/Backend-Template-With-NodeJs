type LoginStatusTypes = "H" | "BI" | "BIT";

const LoginStatusTypesArr: LoginStatusTypes[] = [
  "H",   // You can log in
  "BIT", // Temporarily blocked
  "BI",  // Blocked
];

export {
    LoginStatusTypes,
    LoginStatusTypesArr
}
