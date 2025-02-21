import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
    constructor(
        private bluetoothSerial: BluetoothSerial,
        private androidPermissions: AndroidPermissions
      ) {}
  async enableBluetooth() {
    try {
      const enabled = await this.bluetoothSerial.isEnabled();
      console.log('Bluetooth is enabled:', enabled);
    } catch (error) {
      console.error('Bluetooth not enabled:', error);
    }
  }

  async checkAndRequestPermissions(): Promise<boolean> {
    const permissions = [
      this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
      this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
    ];

    try {
      // Check permissions
      const result = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT
      );

      if (!result.hasPermission) {
        console.log('Requesting Bluetooth permissions...');
        await this.androidPermissions.requestPermissions(permissions);
      }
      
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  }

  async listDevices(): Promise<any[]> {
    const hasPermission = await this.checkAndRequestPermissions();
    if (!hasPermission) {
      console.error('Bluetooth permissions not granted!');
      return [];
    }

    try {
      const devices = await this.bluetoothSerial.list();
      console.log('Paired devices:', devices);
      return devices;
    } catch (error) {
      console.error('Error getting devices:', error);
      return [];
    }
  }

  async connectToDevice(deviceId: string): Promise<boolean> {
    try {
      console.log('Connecting to device:', deviceId);
      await this.bluetoothSerial.connect(deviceId).subscribe(
        () => console.log('Connected to:', deviceId),
        (error) => console.error('Connection error:', error)
      );
      return true;
    } catch (error) {
      console.error('Bluetooth connection error:', error);
      return false;
    }
  }

  async sendData(data: string) {
    try {
      await this.bluetoothSerial.write(data);
      console.log('Data sent successfully:', data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }
}
