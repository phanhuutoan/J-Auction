export const mockAuth = {
  token: "tokenn",
  signin: jest.fn().mockImplementation(() => {
    mockAuth.token = "new token";
  }),
  signup: jest.fn(),
  autoSignin: jest.fn(),
};

jest.mock("../../../stores-sdk", () => ({
  useGetStore: () => ({
    authStore: mockAuth,
  }),
}));

export const mockNavigateFn = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigateFn,
  // eslint-disable-next-line jsx-a11y/aria-role
  Link: (props: any) => <div role="app-link">{props.children}</div>,
}));
