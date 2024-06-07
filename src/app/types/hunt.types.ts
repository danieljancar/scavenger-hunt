export interface HuntTime {
  start: Date;
  end: Date;
}

export interface ScavengerHunt {
  name: string;
  rewards: number;
  penalties: number;
  time: HuntTime;
  date: Date;
}
