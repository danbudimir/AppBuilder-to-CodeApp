import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAccounts } from "@/hooks/useIssuesData";

export default function AccountsPage() {
  const accountsQ = useAccounts();
  const [search, setSearch] = useState("");

  const accounts = accountsQ.data ?? [];
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return accounts;

    return accounts.filter((a) =>
      [a.name, a.accountnumber, a.emailaddress1, a.telephone1, a.address1_city]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(query)),
    );
  }, [accounts, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Accounts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse Dataverse accounts and scroll through available records.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dataverse Account Table</CardTitle>
          <CardDescription>
            Showing name, account number, email, phone, and city.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {accountsQ.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : accountsQ.error ? (
            <div className="rounded-md bg-destructive/10 text-destructive text-sm px-3 py-2 border border-destructive/30">
              Failed to load accounts. Open the app via the Power Apps Local Play URL so Dataverse is available.
            </div>
          ) : (
            <div className="border rounded-md max-h-[65vh] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Account #</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>City</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => (
                    <TableRow key={a.accountid ?? `${a.name}-${a.accountnumber}`}>
                      <TableCell className="font-medium">{a.name ?? "-"}</TableCell>
                      <TableCell>{a.accountnumber ?? "-"}</TableCell>
                      <TableCell>{a.emailaddress1 ?? "-"}</TableCell>
                      <TableCell>{a.telephone1 ?? "-"}</TableCell>
                      <TableCell>{a.address1_city ?? "-"}</TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No accounts found.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
