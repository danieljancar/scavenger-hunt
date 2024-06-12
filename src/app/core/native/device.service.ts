import { Injectable } from '@angular/core'
import { Device, DeviceId } from '@capacitor/device'
import { Preferences } from '@capacitor/preferences'
import { DeviceInfo } from '../../types/device.types'

@Injectable({
    providedIn: 'root',
})
export class DeviceService {
    constructor() {}

    public async getDeviceId(): Promise<DeviceId> {
        return await Device.getId()
    }

    public async getDeviceInfo(): Promise<DeviceInfo> {
        const deviceInfo = await Device.getInfo()

        return {
            androidSDKVersion: deviceInfo.androidSDKVersion,
            diskFree: deviceInfo.diskFree,
            diskTotal: deviceInfo.diskTotal,
            iosVersion: deviceInfo.iOSVersion,
            isVirtual: deviceInfo.isVirtual,
            manufacturer: deviceInfo.manufacturer,
            memUsed: deviceInfo.memUsed,
            name: deviceInfo.name,
            operatingSystem: deviceInfo.operatingSystem,
            realDiskFree: deviceInfo.realDiskFree,
            webviewVersion: deviceInfo.webViewVersion,
            model: deviceInfo.model,
            platform: deviceInfo.platform,
            osVersion: deviceInfo.osVersion,
        }
    }
}
