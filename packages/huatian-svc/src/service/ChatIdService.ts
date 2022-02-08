import { ChatIdSetDao } from "../dao/Dao";
import { DB } from "../dao/DB";

const STEP = 10e4;

export class ChatIdService {
  private static inst: ChatIdService = new ChatIdService();
  private base_id: number = -1;
  private start_id: number = 0;
  public static getInstance() {
    return ChatIdService.inst;
  }

  async requestIdSet() {
    if (this.base_id >= this.start_id && this.base_id <= this.start_id + STEP) {
      return;
    }
    const sequelize = DB.getSequelize();
    const transaction = await sequelize.transaction();
    try {
      const lastRecord = await ChatIdSetDao.findOne({
        order: [["id", "desc"]],
        lock: transaction.LOCK.UPDATE,
      });

      const startNumber = lastRecord
        ? lastRecord.getDataValue("start") + 10e4
        : 0;

      await ChatIdSetDao.create({
        app: "test",
        start: startNumber,
      });

      this.start_id = startNumber;
      this.base_id = startNumber;
    } catch (error) {
      console.log(error);
      transaction.rollback();
    }
  }

  async getId() {
    await this.requestIdSet();
    return this.base_id++;
  }
}
