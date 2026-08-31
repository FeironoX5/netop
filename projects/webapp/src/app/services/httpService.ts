import { ofetch } from 'ofetch';
import { useAppStore } from '../stores/appStore';

class HttpService {
  get<T = unknown>(urn: string, signal?: AbortSignal) {
    const { connection } = useAppStore();
    if (!connection) return;
    return ofetch<T>(
      `http://${connection.url}:${connection.port}/${urn}`,
      { method: 'GET', signal },
    );
  }
}

export const httpService = new HttpService();
