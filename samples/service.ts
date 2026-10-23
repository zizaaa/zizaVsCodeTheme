// Comment: TypeScript sample
import type { Request, Response } from 'express';

export interface User {
  id: number;
  name: string;
  email?: string;
}

type Role = 'admin' | 'user';

enum Status { Active = 1, Disabled = 0 }

@Injectable()
export class UserService<T extends User> {
  private readonly cache = new Map<number, T>();

  constructor(private db: Database) {}

  public async findById(id: number): Promise<T | undefined> {
    if (this.cache.has(id)) return this.cache.get(id);
    const user = await this.db.query<T>(`SELECT * FROM users WHERE id = ${id}`);
    this.cache.set(id, user);
    return user ?? undefined;
  }
}

export const handler = (req: Request, res: Response): void => {
  const { id } = req.params;
  res.status(200).json({ ok: true, id: Number(id), status: Status.Active });
};
