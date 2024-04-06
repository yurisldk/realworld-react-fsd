import { createJsonMutation, createJsonQuery } from '../../lib/fetch';
import { zodContract } from '../../lib/zod';
import { IAuthHeaderService } from '../auth-header.service';
import { IUrlService } from '../url.service';
import { UserDtoSchema } from './auth.contracts';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
  UserDto,
} from './auth.types';

export interface IAuthService {
  currentUserQuery(signal?: AbortSignal): Promise<UserDto>;

  createUserMutation(params: { user: CreateUserDto }): Promise<UserDto>;

  loginUserMutation(params: { user: LoginUserDto }): Promise<UserDto>;

  updateUserMutation(params: { user: UpdateUserDto }): Promise<UserDto>;
}

export class AuthService implements IAuthService {
  constructor(
    private readonly urlService: IUrlService,
    private readonly authHeaderService: IAuthHeaderService,
  ) {}

  currentUserQuery(signal?: AbortSignal) {
    return createJsonQuery({
      request: {
        url: this.urlService.getUrl('/user'),
        method: 'GET',
        headers: { ...this.authHeaderService.getHeader() },
      },
      response: { contract: zodContract(UserDtoSchema) },
      abort: signal,
    });
  }

  createUserMutation(params: { user: CreateUserDto }) {
    return createJsonMutation({
      request: {
        url: this.urlService.getUrl('/users'),
        method: 'POST',
        body: JSON.stringify({ user: params.user }),
      },
      response: { contract: zodContract(UserDtoSchema) },
    });
  }

  loginUserMutation(params: { user: LoginUserDto }) {
    return createJsonMutation({
      request: {
        url: this.urlService.getUrl('/users/login'),
        method: 'POST',
        body: JSON.stringify({ user: params.user }),
      },
      response: { contract: zodContract(UserDtoSchema) },
    });
  }

  updateUserMutation(params: { user: UpdateUserDto }) {
    return createJsonMutation({
      request: {
        url: this.urlService.getUrl('/user'),
        method: 'PUT',
        headers: { ...this.authHeaderService.getHeader() },
        body: JSON.stringify({ user: params.user }),
      },
      response: { contract: zodContract(UserDtoSchema) },
    });
  }
}
