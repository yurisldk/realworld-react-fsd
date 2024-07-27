import { AxiosHeaders, AxiosResponse } from 'axios'

export class AxiosLib {
  static mockResolvedAxiosResponse<D>(data: D): AxiosResponse<D> {
    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: new AxiosHeaders() },
    }
  }
}
