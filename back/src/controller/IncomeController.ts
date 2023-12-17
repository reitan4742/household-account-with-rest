import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Income } from "../entity/Income";
import { Between } from "typeorm";

export class IncomeController {
  private incomeRepository = AppDataSource.getRepository(Income);

  async all(request: Request, response: Response, next: NextFunction) {
    const year: number = parseInt(request.query.year);
    const month: number = parseInt(request.query.month);

    if (!year && month) {
      response.send(404);
    }

    if (year && month) {
      const start = new Date(year, month - 1, 0);
      const end = new Date(year, month - 1, 31);
      return await this.incomeRepository.find({
        where: {
          date: Between(start, end),
        },
        order: {
          date: "ASC"
        }
      });
    }

    if (year) {
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);
      return await this.incomeRepository.find({
        where: {
          date: Between(start, end),
        },
        order: {
          date: "ASC"
        }
      });
    }

    return this.incomeRepository.find({
      order: {
        date: "DESC"
      }
    });
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const id: number = parseInt(request.params.id);

    const income: Income = await this.incomeRepository.findOne({
      where: { id }
    });

    if (!income) {
      response.send(404);
    }
    return income;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { date, name, value} = request.body;

    const income = Object.assign(new Income(), {
      date,
      name,
      value
    });

    try {
      return await this.incomeRepository.save(income);
    } catch {
      response.send(400);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const id: number = parseInt(request.params.id);

    const income: Income = await this.incomeRepository.findOneBy({ id });

    if (!income) {
      response.send(404);
    }

    await this.incomeRepository.remove(income);
    return "income has been removed";
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const id: number = parseInt(request.params.id);

    const income: Income = await this.incomeRepository.findOneBy({ id });

    if (!income) {
      response.send(404);
    }

    const { date, name, value } = request.body;
    const newIncome = Object.assign(new Income(), {
      date,
      name,
      value
    });

    try {
      await this.incomeRepository.update(id, newIncome);
      return await this.incomeRepository.findOneBy({ id });
    } catch {
      response.send(400);
    }
  }
}