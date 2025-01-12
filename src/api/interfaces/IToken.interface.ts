export interface AllowedRoute {
  route: string;
  verb: string;
}

export interface IToken {
  userId: number;
  rolesId: number[];
}
