import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Purchase } from "../entity/Purchase";
import { Between } from "typeorm";

export class PurchaseController {
  private purchaseRepository = AppDataSource.getRepository(Purchase);

  async all(request: Request, response: Response, next: NextFunction) {
    const year: number = parseInt(request.query.year);
    const month: number = parseInt(request.query.month);

    if (!year && month) {
      response.send(404);
    }

    if (year && month) {
      const start = new Date(year, month - 1, 0);
      const end = new Date(year, month - 1, 31);
      return await this.purchaseRepository.find({
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
      return await this.purchaseRepository.find({
        where: {
          date: Between(start, end),
        },
        order: {
          date: "ASC"
        }
      });
    }

    return this.purchaseRepository.find({
      order: {
        date: "DESC"
      }
    });
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const id: number = parseInt(request.params.id);

    const purchase: Purchase = await this.purchaseRepository.findOne({
      where: { id }
    });

    if (!purchase) {
      response.send(404);
    }
    return purchase;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { name, date, value } = request.body;

    const purchase = Object.assign(new Purchase(), {
      name,
      date,
      value
    });

    try {
      return await this.purchaseRepository.save(purchase);
    } catch {
      response.send(400);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const id: number = parseInt(request.params.id);

    const purchase: Purchase = await this.purchaseRepository.findOneBy({ id });

    if (!purchase) {
      response.send(404);
    }

    await this.purchaseRepository.remove(purchase);
    return "purchase has been removed";
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const id: number = parseInt(request.params.id);

    const purchase: Purchase = await this.purchaseRepository.findOneBy({ id });

    if (!purchase) {
      response.send(404);
    }

    const { name, date, value } = request.body;
    const newPurchase = Object.assign(new Purchase(), {
      name,
      date,
      value
    });

    try {
      await this.purchaseRepository.update(id, newPurchase);
      return await this.purchaseRepository.findOneBy({ id });
    } catch {
      response.send(400);
    }
  }
}