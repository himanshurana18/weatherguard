import { SetMetadata } from '@nestjs/common';

export type Role = 'user' | 'admin';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
