import { ChangeDetectorRef, Component } from '@angular/core';
import { BluetoothService } from '../../services/bluetooth/bluetooth-service';
import { Capacitor } from '@capacitor/core';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-settings-bluetooth',
  templateUrl: './settings-bluetooth.component.html',
  styleUrl: './settings-bluetooth.component.scss',
})
export class SettingsBluetoothComponent {
  devices: any[] = [];
  connectedDevice: string | null = null;
  printData: string = '';
  isBluetoothEnabled: boolean | null = false;
  selectedDevice: any = undefined;
  defaultBluetoothDeviceId: string | null = null;
  checked: boolean = false;
  isWeb: boolean = Capacitor.getPlatform() === 'web';
  isConnectLoading: boolean = false;
  isRefreshLoading: boolean = false;
  messages: Message[] = [
    {
      severity: 'warn',
      detail:
        'Ustawienia niedostępne przez strone WWW. Zarządzać ustawieniami drukarki bluetooth można tylko z poziomu aplikacji na urządzeniu mobilnym',
    },
  ];
  messages2: Message[] = [];
  constructor(
    private bluetoothService: BluetoothService,
    private cdr: ChangeDetectorRef
  ) {
    this.defaultBluetoothDeviceId = localStorage.getItem(
      'defaultBluetoothDeviceId'
    ) as string;

    if (this.defaultBluetoothDeviceId) {
      this.checked = true;
      this.messages2 = [
        {
          severity: 'info',
          detail:
            'Twoim domyślnym urządzeniem jest ' +
            this.defaultBluetoothDeviceId +
            ', aplikacja przy starcie będzie próbować połączyć sie z nim',
        },
      ];
    }
  }

  async ngOnInit() {
    this.connectedDevice = this.bluetoothService.getConnectedDeviceId();
    // Check if Bluetooth is enabled when the page loads.
    try {
      this.isBluetoothEnabled =
        await this.bluetoothService.isBluetoothEnabled();
      if (!this.isBluetoothEnabled) {
        await this.bluetoothService.requestBluetoothEnable();
      }
    } catch (error) {
      alert('Wystąpił bład podczas uruchania bluetooth');
    }

    await this.listDevices();
  }

  async listDevices() {
    this.isRefreshLoading = true;
    if (this.isBluetoothEnabled) {
      this.devices = await this.bluetoothService.listDevices();
      if (this.defaultBluetoothDeviceId) {
        this.selectedDevice = this.devices.find(
          (el) => el.id === this.defaultBluetoothDeviceId
        );
        console.log('in if');
        console.log(this.selectedDevice);
        this.cdr.detectChanges();
      }
    } else {
      await this.bluetoothService.requestBluetoothEnable();
    }
    this.isRefreshLoading = false;
  }

  async connectToDevice(deviceId: string) {
    if (deviceId === null) {
      return;
    }
    this.isConnectLoading = true; // Start loading

    console.log('connectToDevice');
    console.log(deviceId);

    if (this.checked) {
      localStorage.setItem('defaultBluetoothDeviceId', deviceId);
      this.defaultBluetoothDeviceId = deviceId;
      this.messages2 = [
        {
          severity: 'info',
          detail:
            'Twoim domyślnym urządzeniem jest ' +
            this.defaultBluetoothDeviceId +
            ', aplikacja przy starcie będzie próbować połączyć sie z nim',
        },
      ];
    } else {
      localStorage.removeItem('defaultBluetoothDeviceId');
      this.defaultBluetoothDeviceId = null;
    }
    const success = await this.bluetoothService.connectToDevicePublic(deviceId);
    if (success) {
      this.connectedDevice = deviceId;
    } else {
      alert('Wystąpił bład podczas łaczenia sie z urządzeniem');
    }
    this.isConnectLoading = false;
  }

  async print() {
    if (this.connectedDevice) {
      await this.bluetoothService.sendPrintData(
        'Dzialam ;)\n 1234567890 \n abcdefgh' + '\n'
      );
      // alert('Data sent to printer: ' + this.printData);
    } else {
      // alert('Please connect to a printer and enter text.');
    }
  }
}
