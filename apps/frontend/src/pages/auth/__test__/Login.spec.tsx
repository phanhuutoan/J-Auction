/* eslint-disable testing-library/no-unnecessary-act */
import "./_mockStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../Login";
import { mockAuth, mockNavigateFn } from "./_mockStore";
import { act } from "react-dom/test-utils";

describe("<Login /> component", () => {
  function renderLogin() {
    render(<Login />);
  }
  describe("UI test", () => {
    it("Should show login title and subtitle", async () => {
      renderLogin();
      expect(await screen.findByText("Login!")).toBeTruthy();
      expect(await screen.findByText("Welcome to Tony's auction")).toBeTruthy();
    });

    it("should show the correct form", () => {
      renderLogin();
      const emailTextBox = screen.getByRole("textbox", {
        name: "Email address",
      });
      const passwordTextBox = screen.getByRole("textbox", {
        name: "Password",
      });

      const emaillabel = screen.getByRole("label", {
        name: "Email address",
      });
      const passwordlabel = screen.getByRole("label", {
        name: "Password",
      });
      expect(emailTextBox).toBeTruthy();
      expect(passwordTextBox).toBeTruthy();
      expect(emaillabel).toBeTruthy();
      expect(passwordlabel).toBeTruthy();
    });

    it("Should show submit button and link", () => {
      renderLogin();

      const button = screen.getByRole("button", {
        name: "Submit!",
      });
      const link = screen.getByRole("app-link");

      expect(button).toBeTruthy();
      expect(link).toBeTruthy();
    });
  });

  describe("Behavior test", () => {
    it("should submit the form when people fill them out", async () => {
      renderLogin();
      const emailTextBox = screen.getByRole("textbox", {
        name: "Email address",
      });
      const passwordTextBox = screen.getByRole("textbox", {
        name: "Password",
      });
      const button = screen.getByRole("button", {
        name: "Submit!",
      });

      mockAuth.signin.mockResolvedValue({});

      userEvent.type(emailTextBox, "test@test.com");
      userEvent.type(passwordTextBox, "Password1234");

      await act(async () => {
        await userEvent.click(button);
      });
      expect(mockAuth.signin).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "Password1234",
      });

      expect(mockNavigateFn).toHaveBeenCalled();
    });

    it("shouldn't submit form when it is not full filled", async () => {
      renderLogin();

      const button = screen.getByRole("button", {
        name: "Submit!",
      });

      mockAuth.signin.mockResolvedValue({});

      await act(async () => {
        await userEvent.click(button);
      });

      expect(mockAuth.signin).not.toHaveBeenCalledWith();
    });
  });
});
