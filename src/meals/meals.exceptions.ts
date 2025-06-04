export class MealNotFoundException extends Error {
  constructor(message: string = '') {
    super(message);
    this.name = 'MealNotFoundException';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MealNotFoundException);
    }
  }
}

export class FoodNotFoundException extends Error {
  constructor(message: string = '') {
    super(message);
    this.name = 'FoodNotFoundException';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FoodNotFoundException);
    }
  }
}
