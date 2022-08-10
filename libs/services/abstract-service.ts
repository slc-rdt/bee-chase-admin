export default abstract class AbstractService {
  protected get apiUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL;
  }
}
