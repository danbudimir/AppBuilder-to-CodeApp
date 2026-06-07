export interface Rooms {
  ID: number;
  name: string;
  floor?: number;
  roomType?: {
    Value: string;
  };
  buildingId?: {
    Id: number;
    Value: string;
  };
}
