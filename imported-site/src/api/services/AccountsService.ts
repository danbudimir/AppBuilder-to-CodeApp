import { getClient, type IOperationResult } from "@microsoft/power-apps/data";

type AccountRecord = {
  accountid?: string;
  name?: string;
  accountnumber?: string;
  emailaddress1?: string;
  telephone1?: string;
  address1_city?: string;
};

const dataClient = getClient({
  accounts: {
    tableId: "account",
    dataSourceType: "Dataverse",
    apis: {},
  },
});

export class AccountsService {
  public static async getAll(top = 200): Promise<IOperationResult<AccountRecord[]>> {
    return dataClient.retrieveMultipleRecordsAsync<AccountRecord>("accounts", {
      top,
      orderBy: ["name asc"],
      select: [
        "accountid",
        "name",
        "accountnumber",
        "emailaddress1",
        "telephone1",
        "address1_city",
      ],
    });
  }
}

export type { AccountRecord };
