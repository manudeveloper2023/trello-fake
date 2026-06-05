import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';

@Injectable({})
export class BlockPositionEngine {
  static between(a: Decimal, b: Decimal): Decimal {
    return a.add(b).div(2);
  }

  static after(a: Decimal): Decimal {
    return a.add(1000);
  }

  static before(b: Decimal): Decimal {
    return b.sub(1000);
  }

  static empty(): Decimal {
    return new Decimal(1000);
  }
}
