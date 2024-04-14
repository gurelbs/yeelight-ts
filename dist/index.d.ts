interface DeviceInfo {
    location?: string;
    id?: string;
    model?: string;
    power?: string;
    bright?: string;
    color_mode?: string;
    ct?: string;
    rgb?: string;
    hue?: string;
    sat?: string;
    name?: string;
}
interface CommandResult {
    id: number;
    result?: string[];
    error?: {
        code: number;
        message: string;
    };
}
/**
 * Represents a Yeelight device.
*/
export declare class Yeelight {
    private client;
    private readonly MULTICAST_ADDR;
    private readonly SSDP_PORT;
    private readonly CONTROL_PORT;
    constructor();
    private initialize;
    sendDiscovery(): void;
    handleDiscoveryResponse(callback: (info: DeviceInfo) => void): void;
    private parseDiscoveryResponse;
    sendCommand(ip: string, method: string, params: Array<string | number>): Promise<CommandResult>;
    setPower(ip: string, powerState: string, effect?: string, duration?: number): Promise<CommandResult>;
    private isInRange;
    setBrightness(ip: string, brightness: number): Promise<CommandResult>;
    setColorTemperature(ip: string, temperature: number): Promise<CommandResult>;
    setRGB(ip: string, rgb: number): Promise<CommandResult>;
    setHSV(ip: string, hue: number, sat: number): Promise<CommandResult>;
    setName(ip: string, name: string): Promise<CommandResult>;
}
export {};
