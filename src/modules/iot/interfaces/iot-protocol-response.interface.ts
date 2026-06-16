export interface IotProtocolResponse<TData> {
  status: true;
  message: string;
  data: TData;
}

export interface RegisteredDeviceData {
  authorization: string;
  imei: string;
  deviceUID: string;
}

export interface TempPresetData {
  preset: string;
}
