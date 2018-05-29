import { AuthenticationService } from './authentication.service';
import { StoreService } from './store.service';
import { UsersService } from './users.service';
import { BackendService } from './classes/backend.service';

export const services = [BackendService, AuthenticationService, StoreService, UsersService];
