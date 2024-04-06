export interface IUrlService {
  getUrl(path: string | undefined): string;
}

export class UrlService implements IUrlService {
  constructor(private readonly baseUrl: string) {}

  getUrl(path?: string) {
    return this.baseUrl.concat(path || '');
  }
}
