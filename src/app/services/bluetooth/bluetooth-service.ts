import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
// Import the gbk.js library for GBK encoding
import gbk from 'gbk.js';
import { ToastrService } from 'ngx-toastr';
import { OrderDto, OrderProductDto } from '../models';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  YHDAA_MAX_ROW_NUMBER_OF_CHARS_FOR_SMALL_TEXT: number = 31;
  GS = 29;
  ESC = 0x1b;
  connectedDeviceId: string | null = null;
  connected: boolean = false;
  maxAttempts: number = 2;
  private connectionMonitorSubscription: Subscription | null = null;
  private bluetoothSubject = new BehaviorSubject<boolean>(false);
  bluetoothSubjectVisibility$ = this.bluetoothSubject.asObservable();

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private androidPermissions: AndroidPermissions,
    private toastService: ToastrService
  ) {}

  startConnectionMonitor() {
    // Unsubscribe from any previous monitor to avoid duplicate subscriptions
    if (this.connectionMonitorSubscription) {
      this.connectionMonitorSubscription.unsubscribe();
    }

    // Check every 5 seconds (adjust interval as needed)
    this.connectionMonitorSubscription = interval(17000).subscribe(async () => {
      try {
        await this.bluetoothSerial.isConnected();
        console.log('Device is still connected.');
      } catch (error) {
        console.log('Device disconnected detected by monitor.');
        this.handleDisconnect();
        this.connectionMonitorSubscription?.unsubscribe();
      }
    });
  }

  getConnectedDeviceId(): string | null {
    return this.connectedDeviceId;
  }

  async connectOnAppStart() {
    var tempDeviceId = localStorage.getItem(
      'defaultBluetoothDeviceId'
    ) as string;
    console.log('connectOnAppStart');

    if (!tempDeviceId) {
      return;
    }

    if (!(await this.isBluetoothEnabled())) {
      await this.requestBluetoothEnable();
    }
    let attempt = 0;
    while (!this.connected && attempt < this.maxAttempts) {
      attempt++;
      console.log(`Connection attempt ${attempt} for device ${tempDeviceId}`);
      this.connected = await this.connectToDevice(tempDeviceId);
      if (!this.connected) {
        console.log('Connection failed, retrying in 3 seconds...');
        await this.delay(10000); // Wait for 3 seconds before trying again
      }
    }
    if (this.connected) {
      this.toastService.success(
        'Drukarka bonowa została podłączona przez bluetooth'
      );
      this.connectedDeviceId = tempDeviceId;
    } else {
      this.toastService.error(
        'Nie udało się podłączyć drukarki bonowej: ' +
          tempDeviceId +
          ', przejdź do ustawień i podłącz ją ręcznie'
      );
    }
    this.bluetoothSubject.next(this.connected);
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async isBluetoothEnabled(): Promise<any> {
    try {
      return await this.bluetoothSerial.isEnabled();
    } catch (error) {
      return false;
    }
  }

  async requestBluetoothEnable(): Promise<boolean> {
    try {
      // This will prompt the user to enable Bluetooth if it's disabled.
      await this.bluetoothSerial.enable();
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkAndRequestPermissions(): Promise<boolean> {
    const permissions = [
      this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
      this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
    ];

    try {
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

  async connectToDevicePublic(deviceId: string): Promise<boolean> {
    this.connected = await this.connectToDevice(deviceId);
    this.bluetoothSubject.next(this.connected);
    return this.connected;
  }

  private async connectToDevice(deviceId: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      console.log('Connecting to device:', deviceId);
      let connectionConfirmed = false;

      const subscription = this.bluetoothSerial.connect(deviceId).subscribe(
        async () => {
          console.log('Connected to:', deviceId);
          // Wait a short period for the connection to stabilize
          await this.delay(3000);
          try {
            // Explicitly verify that the device is connected
            connectionConfirmed = await this.bluetoothSerial.isConnected();
            if (connectionConfirmed) {
              this.startConnectionMonitor();
              resolve(true);
              this.connected = true;
            } else {
              resolve(false);
              this.connected = false;
            }
          } catch (error) {
            console.error('Connection verification failed:', error);
            resolve(false);
            this.connected = false;
          }
        },
        (error) => {
          console.error('Connection error:', error);
          resolve(false);
          this.connected = false;
        }
      );

      // Fallback: if no connection event occurs within 5 seconds, assume failure
      setTimeout(() => {
        if (!connectionConfirmed) {
          console.log('Connection timeout: Device may not be on.');
          subscription.unsubscribe();
          resolve(false);
        }
      }, 5000);
    });
  }

  async sendPrintDataRaw(data: Uint8Array) {
    await this.bluetoothSerial.write(data.buffer);
  }

  async sendPrintData(text: string) {
    try {
      // Build the command using printer initialization and text commands.
      const command = this.posPrintText(text + '\n', 2, 2);
      const setCutCommand = this.posSetCut(1);
      const printInitCommand = this.posSetPrintInit();
      const xdCommand: Uint8Array = new Uint8Array([
        29, 33, 0, 27, 116, 0, 28, 38, 27, 77, 0, 89, 111, 117, 32, 104, 97,
        118, 101, 32, 115, 117, 99, 99, 101, 115, 115, 102, 117, 108, 108, 121,
        32, 99, 114, 101, 97, 116, 101, 100, 32, 99, 111, 109, 109, 117, 110,
        105, 99, 97, 116, 105, 111, 110, 115, 32, 98, 101, 116, 119, 101, 101,
        110, 32, 121, 111, 117, 114, 32, 100, 101, 118, 105, 99, 101, 32, 97,
        110, 100, 32, 111, 117, 114, 32, 98, 108, 117, 101, 116, 111, 111, 116,
        104, 32, 112, 114, 105, 110, 116, 101, 114, 46, 10, 32, 32, 116, 104,
        101, 32, 99, 111, 109, 112, 97, 110, 121, 32, 105, 115, 32, 97, 32, 104,
        105, 103, 104, 45, 116, 101, 99, 104, 32, 101, 110, 116, 101, 114, 112,
        114, 105, 115, 101, 32, 119, 104, 105, 99, 104, 32, 115, 112, 101, 99,
        105, 97, 108, 105, 122, 101, 115, 32, 105, 110, 32, 82, 38, 68, 44, 109,
        97, 110, 117, 102, 97, 99, 116, 117, 114, 105, 110, 103, 44, 109, 97,
        114, 107, 101, 116, 105, 110, 103, 32, 111, 102, 32, 116, 104, 101, 114,
        109, 97, 108, 32, 112, 114, 105, 110, 116, 101, 114, 115, 32, 97, 110,
        100, 32, 98, 97, 114, 99, 111, 100, 101, 32, 115, 99, 97, 110, 110, 101,
        114, 115, 46, 10, 10,
      ]);
      // Send the raw binary data (write() accepts an ArrayBuffer)
      await this.bluetoothSerial.write(command.buffer);
      await this.bluetoothSerial.write(setCutCommand.buffer);
      await this.bluetoothSerial.write(printInitCommand.buffer);
      console.log('Data sent successfully:', command);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }

  posSetPrintInit(): Uint8Array {
    const escInitCommand = new Uint8Array([this.ESC, 64]); // Command.GS_V_m_n[3]
    const combined = new Uint8Array(escInitCommand.length);
    combined.set(escInitCommand, 0);
    return combined;
  }

  posSetCut(value: number = 1): Uint8Array {
    const gsVMNCommand = new Uint8Array([this.GS, 86, 66, value]); // Command.GS_V_m_n[3]
    const combined = new Uint8Array(gsVMNCommand.length);
    combined.set(gsVMNCommand, 0);
    return combined;
  }

  /**
   * Helper function to build a printer command with GBK encoding.
   *
   * This function creates a command by:
   *  - Initializing the printer (ESC @)
   *  - Setting text size (GS ! n)
   *  - Converting the provided text to GBK-encoded bytes.
   *
   * Adjust the command bytes and logic to match your printer’s specifications.
   */
  posPrintText(
    text: string,
    widthTimes: number = 0,
    heightTimes: number = 0,
    fontType: number = 0
  ): Uint8Array {
    const FS: number = 28;
    const intToWidth: Uint8Array = new Uint8Array([0, 16, 32, 48]);
    const intToHeight: Uint8Array = new Uint8Array([0, 1, 2, 3]);
    const sizeCommand = new Uint8Array([
      this.GS,
      33,
      intToWidth.at(widthTimes)! + intToHeight.at(heightTimes)!,
    ]); // Command.GS_ExclamationMark
    const initCommand = new Uint8Array([this.ESC, 116, 0]); // Command.ESC_t
    const fsCommand = new Uint8Array([FS, 38]); // Command.FS_and
    const escM_Command = new Uint8Array([this.ESC, 77, 0]); // Command.ESC_M

    // Convert text to GBK-encoded bytes using gbk.js.
    // The encode function returns a Uint8Array.
    const textBytes: Uint8Array = gbk.encode(text, 'gbk');

    // Combine the commands and text into one Uint8Array.
    const combined = new Uint8Array(
      sizeCommand.length +
        initCommand.length +
        fsCommand.length +
        escM_Command.length +
        textBytes.length
    );
    combined.set(sizeCommand, 0);
    combined.set(initCommand, initCommand.length);
    combined.set(fsCommand, fsCommand.length);
    combined.set(escM_Command, escM_Command.length);
    combined.set(textBytes, initCommand.length + sizeCommand.length);

    return combined;
  }

  async printOrderDetails(order: OrderDto) {
    if (this.connectedDeviceId !== null) {
      const formattedExecutionTime = order.executionTime?.replace('T', ' ');
      const orderId = order.id;
      const totalPrice = order.price;
      var stringToPrint = `Zamówienie #${orderId}\n${formattedExecutionTime}\n\n`;

      if (order.orderProducts && order.orderProducts.length > 0) {
        order.orderProducts.forEach((orderProduct) => {
          var i: number = 0;
          for (i = 0; i < orderProduct.quantity!; i++) {
            stringToPrint += this.getOrderProductText(orderProduct);
          }
        });
        stringToPrint += '\n';
      }
      stringToPrint += `Suma: ${totalPrice}`;
      await this.sendPrintData(stringToPrint);
    }
  }

  getOrderProductText(orderProduct: OrderProductDto) {
    var tempTextToPrint: string = '';
    const productName = orderProduct.product!.name;
    const note = orderProduct.note ? orderProduct.note : '';
    const price = orderProduct.price !== undefined ? orderProduct.price : 0.0;
    const quantity =
      orderProduct.quantity !== undefined ? orderProduct.quantity : 0;

    // Example line: "Pizza Margherita (extra cheese) - 25 x 2"
    tempTextToPrint += `${productName}\n`;

    tempTextToPrint += this.getProductPropartyText(orderProduct);

    if (orderProduct.note) {
      tempTextToPrint += `Notatka: \n${note}\n`;
    }
    const priceString = price.toString();
    tempTextToPrint +=
      ' '.repeat(
        this.YHDAA_MAX_ROW_NUMBER_OF_CHARS_FOR_SMALL_TEXT - priceString.length
      ) + priceString;
    return tempTextToPrint;
  }

  getProductPropartyText(orderProduct: OrderProductDto): string {
    var tempTextToPrint: string = '';

    if (
      orderProduct.productPropertiesList &&
      orderProduct.productPropertiesList.length > 0
    ) {
      // Sort the list: required items first
      const sortedProps = orderProduct.productPropertiesList.sort((a, b) => {
        if (a.required && !b.required) {
          return -1;
        } else if (!a.required && b.required) {
          return 1;
        }
        return 0;
      });

      // Loop over sorted properties and add their property names
      sortedProps.forEach((prop) => {
        if (prop.propertyList && prop.propertyList.length > 0) {
          // Get a comma-separated list of the property names
          const propertyNames = prop.propertyList
            .map((pp: any) => pp.name)
            .join(', ');
          // Optionally include the property group name (prop.name)
          tempTextToPrint += `, ${propertyNames}`;
        }
      });
      return tempTextToPrint;
    } else {
      return tempTextToPrint;
    }
  }

  handleDisconnect() {
    this.connected = false;
    this.bluetoothSubject.next(this.connected);
    this.connectedDeviceId = null;
    this.toastService.error(
      'Połączenie z drukarką bonową zostało zerwane, udaj sie do ustawień, aby połączyć się ponownie'
    );
  }
}
