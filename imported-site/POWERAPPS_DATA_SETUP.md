# Power Apps Data Source Setup

This app is already initialized as a Power Apps Code App and has `power.config.json`.

Use this sequence to add real Power Platform data sources.

## 1) Start app in Power Apps host

```sh
npm run dev
```

The Vite plugin prints a **Local Play** URL. Open that URL.

## 2) Discover available connections

```sh
npm run powerapps:list-connections
npm run powerapps:list-connection-refs
```

## 3) Add a Dataverse table data source

Interactive:

```sh
npm run powerapps:add-datasource -- --api-id dataverse
```

Non-interactive example:

```sh
npx power-apps add-data-source \
  --api-id dataverse \
  --resource-name <table-logical-name> \
  --connection-ref <connection-reference-name>
```

## 4) Add a SQL table data source (optional)

```sh
npx power-apps add-data-source \
  --api-id shared_sql \
  --connection-id <connection-id> \
  --dataset <database-name-or-id> \
  --resource-name <table-name>
```

## 5) Verify config update

After adding data sources, `power.config.json` is updated with `connectionReferences` and `databaseReferences`.

## Notes

- You can repeat `add-data-source` multiple times.
- Keep local in-memory services until your real data sources are connected.
- If auth/session expires, re-run the Power Apps command and sign in again.
