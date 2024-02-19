import fs from "fs";

import { Group } from "../type";
import { GroupRepository } from "./groupRepository";

jest.mock("fs");

describe("GroupRepository", () => {
  const mockFs = jest.mocked(fs);
  let repo: GroupRepository;

  beforeEach(() => {
    // 各テスト実行前にfsモジュールのexistsSync, readFileSync, writeFileSyncメソッドのモックをクリアします。
    // これにより、テスト間での状態の漏洩を防ぎ、各テストがクリーンな状態から開始されることを保証します。
    // モックの振る舞いがテスト全体で一貫性を持ち、予測可能になるようにします。
    mockFs.existsSync.mockClear();
    mockFs.readFileSync.mockClear();
    mockFs.writeFileSync.mockClear();

    repo = new GroupRepository("groups.json");
  });

  describe("loadGroups", () => {
    it("グループ一覧が取得できる", () => {
      const groups: Group[] = [
        {
          name: "group1",
          members: ["一郎", "二郎"],
        },
        {
          name: "group2",
          members: ["太朗", "花子"],
        },
      ];
      const mockData = JSON.stringify(groups);

      // ファイルが存在する
      mockFs.existsSync.mockReturnValueOnce(true);
      // モックデータを返す
      mockFs.readFileSync.mockReturnValueOnce(mockData);

      // loadGroups()の返り値がモックデータと同じかテスト
      const result = repo.loadGroups();
      expect(result).toEqual(groups);
    });

    it("ファイルが存在しない場合は[]が返される", () => {
      // ファイルが存在しない
      mockFs.existsSync.mockReturnValueOnce(false);
      const result = repo.loadGroups();
      expect(result).toEqual([]);
    });
  });

  describe("saveGroup", () => {
    it("グループが保存される", () => {
      const group: Group = {
        name: "group1",
        members: ["一郎", "二郎"],
      };

      mockFs.existsSync.mockReturnValueOnce(true);
      mockFs.readFileSync.mockReturnValueOnce(JSON.stringify([]));

      repo.saveGroup(group);
      // fsモジュールのwriteFileSyncメソッドが正しく実行されたか
      // toHaveBeenCalledWith()には、writeFileSyncメソッドの引数が渡される
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        "groups.json", // 書き込む対象ファイル
        JSON.stringify([group]) // 書き込むデータ
      );
    });
  });
});
