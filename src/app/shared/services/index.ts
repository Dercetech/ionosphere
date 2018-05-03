import { AuthenticationService } from './authentication.service';
import { InterfaceService } from './interface.service';

export * from './authentication.service';
export * from './interface.service';

export const services = [AuthenticationService, InterfaceService];
