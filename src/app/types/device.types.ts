export type DeviceInfo = {
  name?: string;
  model: string;
  platform: string;
  operatingSystem: string;
  osVersion: string;
  iosVersion?: number;
  androidSDKVersion?: number;
  manufacturer: string;
  isVirtual: boolean;
  memUsed?: number;
  diskFree?: number;
  diskTotal?: number;
  realDiskFree?: number;
  webviewVersion: string;
};
