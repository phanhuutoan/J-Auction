export interface SigninDTO {
  email: string;
  password: string;
}

export interface SignupDTO extends SigninDTO {
  userName: string;
}

export interface AuthResponseDTO {
  token: string;
}
