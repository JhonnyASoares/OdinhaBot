import { google } from "googleapis";

const sheets = google.sheets({
  version: "v4",
});

export async function getCellValue(spreadsheetId: string, range: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,

    key: process.env.GOOGLE_SHEETS_API,
  });
  //console.log(response);
  //console.log(response.data.values);

  return response.data.values?.[0]?.[0] ?? null;
}
