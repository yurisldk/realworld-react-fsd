import { createContext } from 'react-router';
import type { UserResponse } from '~shared/api/generated/schemas/userResponse.zod';

export const userContext = createContext<UserResponse | null>(null);
