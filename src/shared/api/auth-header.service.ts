type AuthHeader = Record<'Authorization', string | undefined>;

export interface IAuthHeaderService {
  getHeader(): AuthHeader;
  tokenSetEventHandler(token: string): void;
  tokenResetEventHandler(): void;
}

export class AuthHeaderService implements IAuthHeaderService {
  private readonly header: AuthHeader = { Authorization: undefined };

  getHeader() {
    return this.header;
  }

  tokenSetEventHandler(token: string) {
    this.header.Authorization = `Bearer ${token}`;
  }

  tokenResetEventHandler() {
    this.header.Authorization = undefined;
  }
}
