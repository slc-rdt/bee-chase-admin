export default interface Game {
  id: string;
  access_code: string;
  name: string;
  description: string;
  password: string;
  start_time: Date;
  end_time: Date;
}
