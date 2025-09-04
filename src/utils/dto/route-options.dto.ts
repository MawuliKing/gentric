import { IdentityEntity } from 'src/database/entities/identity.entity';

export class RouteOptions {
  user: IdentityEntity;
  isAuthenticated?: boolean = false;
}
