export interface Issues {
  ID: number;
  issueId?: string;
  title: string;
  description?: string;
  severity: {
    Value: string;
  };
  status: {
    Value: string;
  };
  category?: {
    Value: string;
  };
  reporter: string;
  reportedDate?: string;
  buildingId?: {
    Id: number;
    Value: string;
  };
  roomId?: {
    Id: number;
    Value: string;
  };
}
