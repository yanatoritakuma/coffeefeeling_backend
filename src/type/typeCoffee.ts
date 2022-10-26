import { Coffee } from '@prisma/client';

export type TBestCoffee = {
  bitterBest: Coffee[];
  acidityBes: Coffee[];
};
