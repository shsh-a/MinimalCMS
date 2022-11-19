import { SetMetadata } from '@nestjs/common';

export const Policy = (policy: string) => SetMetadata('policy', policy);
