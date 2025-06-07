export interface CreateRaceDto {
  name: string;
  startTime: Date;
  endTime: Date;
  elevation: number;
  user: number;
}

export interface CreatePointDto {
  race: number;
  location: string;
}
