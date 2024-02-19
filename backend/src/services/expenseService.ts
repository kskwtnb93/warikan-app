import { ExpenseRepository } from "../repositories/expenseRepository";
import { Expense, Settlement } from "../type";
import { calculateSettlements } from "../utils/settlements";
import { GroupService } from "./groupService";

export class ExpenseService {
  constructor(
    private expenseRepository: ExpenseRepository,
    private groupService: GroupService
  ) {}

  // 清算リストの取得
  getSettlements = (groupName: string): Settlement[] => {
    const group = this.groupService.getGroupByName(groupName);
    if (!group) {
      throw new Error(`グループ： ${groupName} が存在しません`);
    }

    const expenses = this.expenseRepository
      .loadExpenses()
      .filter((expense) => expense.groupName === groupName);
    return calculateSettlements(expenses, group.members);
  };

  // 支出の登録
  addExpense = (expense: Expense): void => {
    const group = this.groupService.getGroupByName(expense.groupName);
    if (!group) {
      throw new Error(`グループ： ${expense.groupName} が存在しません`);
    }

    if (!group.members.includes(expense.payer)) {
      throw new Error("支払い者がメンバーの中にいません");
    }

    this.expenseRepository.saveExpense(expense);
  };
}
