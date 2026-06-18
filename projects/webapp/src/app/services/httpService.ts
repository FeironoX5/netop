import { ofetch } from 'ofetch';
import { useAppStore } from '../stores/appStore';

class HttpService {
  get<T = any>(urn: string) {
    const { connection } = useAppStore();
    if (!connection) return;
    return ofetch<T>(
      `http://${connection.url}:${connection.port}/${urn}`,
      { method: 'GET' },
    );
  }
}

export const httpService = new HttpService();
