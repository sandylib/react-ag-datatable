import '@sandylib27/react-ag-datatable/styles.css';
import { DataTable, type ColDef } from '@sandylib27/react-ag-datatable';

interface Stock {
  id: number;
  ticker: string;
  company: string;
  sector: string;
  country: string;
  exchange: string;
}

const data: Stock[] = [
  { id: 1, ticker: 'AAPL', company: 'Apple Inc.', sector: 'Technology', country: 'USA', exchange: 'NASDAQ' },
  { id: 2, ticker: 'MSFT', company: 'Microsoft Corp.', sector: 'Technology', country: 'USA', exchange: 'NASDAQ' },
  { id: 3, ticker: 'GOOGL', company: 'Alphabet Inc.', sector: 'Technology', country: 'USA', exchange: 'NASDAQ' },
  { id: 4, ticker: 'AMZN', company: 'Amazon.com Inc.', sector: 'Consumer Cyclical', country: 'USA', exchange: 'NASDAQ' },
  { id: 5, ticker: 'TSLA', company: 'Tesla Inc.', sector: 'Automotive', country: 'USA', exchange: 'NASDAQ' },
  { id: 6, ticker: 'NVDA', company: 'NVIDIA Corp.', sector: 'Technology', country: 'USA', exchange: 'NASDAQ' },
  { id: 7, ticker: 'BHP', company: 'BHP Group', sector: 'Mining', country: 'Australia', exchange: 'ASX' },
  { id: 8, ticker: 'CBA', company: 'Commonwealth Bank', sector: 'Financials', country: 'Australia', exchange: 'ASX' },
  { id: 9, ticker: 'NESN', company: 'Nestlé SA', sector: 'Consumer Staples', country: 'Switzerland', exchange: 'SIX' },
  { id: 10, ticker: 'ROCHE', company: 'Roche Holding', sector: 'Healthcare', country: 'Switzerland', exchange: 'SIX' },
  { id: 11, ticker: 'SAP', company: 'SAP SE', sector: 'Technology', country: 'Germany', exchange: 'XETRA' },
  { id: 12, ticker: 'SIE', company: 'Siemens AG', sector: 'Industrials', country: 'Germany', exchange: 'XETRA' },
  { id: 13, ticker: 'SHEL', company: 'Shell PLC', sector: 'Energy', country: 'UK', exchange: 'LSE' },
  { id: 14, ticker: 'AZN', company: 'AstraZeneca', sector: 'Healthcare', country: 'UK', exchange: 'LSE' },
  { id: 15, ticker: 'SONY', company: 'Sony Group', sector: 'Technology', country: 'Japan', exchange: 'TSE' },
  { id: 16, ticker: 'TM', company: 'Toyota Motor', sector: 'Automotive', country: 'Japan', exchange: 'TSE' },
  { id: 17, ticker: 'BABA', company: 'Alibaba Group', sector: 'Technology', country: 'China', exchange: 'HKEX' },
  { id: 18, ticker: 'TCEHY', company: 'Tencent Holdings', sector: 'Technology', country: 'China', exchange: 'HKEX' },
  { id: 19, ticker: 'RELIANCE', company: 'Reliance Industries', sector: 'Energy', country: 'India', exchange: 'BSE' },
  { id: 20, ticker: 'INFY', company: 'Infosys Ltd.', sector: 'Technology', country: 'India', exchange: 'BSE' },
];

const columns: ColDef<Stock>[] = [
  { field: 'ticker', headerName: 'Ticker', maxWidth: 120 },
  { field: 'company', headerName: 'Company' },
  { field: 'sector', headerName: 'Sector' },
  { field: 'country', headerName: 'Country' },
  { field: 'exchange', headerName: 'Exchange', maxWidth: 120 },
];

export default function SetFilterExample() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Set Filter Example</h2>
      <p style={{ marginBottom: 12, color: '#666' }}>
        Click any column header filter icon to open a searchable set filter.
        Try filtering by country or sector.
      </p>
      <DataTable<Stock>
        data={data}
        columns={columns}
        enableColumnFilter
        bordered
        hoverable
      />
    </div>
  );
}
