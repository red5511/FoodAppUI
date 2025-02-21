import { Component } from '@angular/core';
import { BluetoothService } from '../../services/bluetooth/bluetooth-service';

@Component({
  selector: 'app-delivery-ordering',
  templateUrl: './delivery-ordering.component.html',
  styleUrls: ['./delivery-ordering.component.scss'],
})
export class DeliveryOrderingComponent {
  address: string = '';
  devices: any[] = [];
  connectedDevice: string | null = null;
  printData: string = '';

  constructor(private bluetoothService: BluetoothService) {}

  async listDevices() {
    console.log('Listing devices...');
    console.log(this.bluetoothService); // Check if the service is available
    this.devices = await this.bluetoothService.listDevices();
  }

  async connectToDevice(deviceId: string) {
    const success = await this.bluetoothService.connectToDevice(deviceId);
    if (success) {
      this.connectedDevice = deviceId;
    } else {
      alert('Failed to connect to device.');
    }
  }

  async print() {
    if (this.connectedDevice && this.printData.trim()) {
      await this.bluetoothService.sendData(this.printData + '\n');
      alert('Data sent to printer: ' + this.printData);
    } else {
      alert('Please connect to a printer and enter text.');
    }
  }
}
