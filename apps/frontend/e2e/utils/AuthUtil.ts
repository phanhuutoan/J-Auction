import { Page, expect } from "@playwright/test";

export class AuthUtil {
  private page: Page;
  private host: string;

  constructor(page: Page, host: string) {
    this.page = page;
    this.host = host;
  }

  async fillRegisterForm(email: string, password: string, name: string) {
    await this.page.getByRole("textbox", { name: "email" }).type(email);
    await this.page.getByRole("textbox", { name: "password" }).type(password);
    await this.page.locator('xpath=//input[@name="userName"]').type(name);
  }

  async signupUser(email: string, password: string, name: string) {
    await this.page.goto(`${this.host}/auth/signup`);
    const signup = this.page.getByRole("heading", { name: "Signup!" });
    await expect(signup).toBeVisible();
    await this.fillRegisterForm(email, password, name);
    const buttonA = this.page.getByRole("button", { name: "Submit!" });
    await buttonA.click();
  }
}
