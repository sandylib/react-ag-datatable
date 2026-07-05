import '@sandylib27/react-ag-datatable/styles.css';
import { DataTable, type ColDef } from '@sandylib27/react-ag-datatable';

interface City {
  id: number;
  city: string;
  country: string;
  continent: string;
  population: number;
  timezone: string;
}

const data: City[] = [
  { id: 1, city: 'Tokyo', country: 'Japan', continent: 'Asia', population: 13960000, timezone: 'JST' },
  { id: 2, city: 'Delhi', country: 'India', continent: 'Asia', population: 11030000, timezone: 'IST' },
  { id: 3, city: 'Shanghai', country: 'China', continent: 'Asia', population: 24870000, timezone: 'CST' },
  { id: 4, city: 'São Paulo', country: 'Brazil', continent: 'South America', population: 12330000, timezone: 'BRT' },
  { id: 5, city: 'Mumbai', country: 'India', continent: 'Asia', population: 12440000, timezone: 'IST' },
  { id: 6, city: 'Beijing', country: 'China', continent: 'Asia', population: 21540000, timezone: 'CST' },
  { id: 7, city: 'Cairo', country: 'Egypt', continent: 'Africa', population: 9120000, timezone: 'EET' },
  { id: 8, city: 'Mexico City', country: 'Mexico', continent: 'North America', population: 8855000, timezone: 'CST' },
  { id: 9, city: 'Dhaka', country: 'Bangladesh', continent: 'Asia', population: 8906000, timezone: 'BST' },
  { id: 10, city: 'Osaka', country: 'Japan', continent: 'Asia', population: 2750000, timezone: 'JST' },
  { id: 11, city: 'New York', country: 'USA', continent: 'North America', population: 8336000, timezone: 'EST' },
  { id: 12, city: 'Karachi', country: 'Pakistan', continent: 'Asia', population: 14910000, timezone: 'PKT' },
  { id: 13, city: 'Buenos Aires', country: 'Argentina', continent: 'South America', population: 2890000, timezone: 'ART' },
  { id: 14, city: 'Istanbul', country: 'Turkey', continent: 'Europe', population: 15460000, timezone: 'TRT' },
  { id: 15, city: 'Kolkata', country: 'India', continent: 'Asia', population: 4496000, timezone: 'IST' },
  { id: 16, city: 'Lagos', country: 'Nigeria', continent: 'Africa', population: 14860000, timezone: 'WAT' },
  { id: 17, city: 'Manila', country: 'Philippines', continent: 'Asia', population: 1780000, timezone: 'PHT' },
  { id: 18, city: 'Rio de Janeiro', country: 'Brazil', continent: 'South America', population: 6748000, timezone: 'BRT' },
  { id: 19, city: 'Guangzhou', country: 'China', continent: 'Asia', population: 13500000, timezone: 'CST' },
  { id: 20, city: 'Lahore', country: 'Pakistan', continent: 'Asia', population: 11130000, timezone: 'PKT' },
  { id: 21, city: 'Shenzhen', country: 'China', continent: 'Asia', population: 12590000, timezone: 'CST' },
  { id: 22, city: 'Bangalore', country: 'India', continent: 'Asia', population: 8443000, timezone: 'IST' },
  { id: 23, city: 'Paris', country: 'France', continent: 'Europe', population: 2161000, timezone: 'CET' },
  { id: 24, city: 'Bogotá', country: 'Colombia', continent: 'South America', population: 7181000, timezone: 'COT' },
  { id: 25, city: 'Jakarta', country: 'Indonesia', continent: 'Asia', population: 10560000, timezone: 'WIB' },
  { id: 26, city: 'Lima', country: 'Peru', continent: 'South America', population: 9751000, timezone: 'PET' },
  { id: 27, city: 'Bangkok', country: 'Thailand', continent: 'Asia', population: 5680000, timezone: 'ICT' },
  { id: 28, city: 'Seoul', country: 'South Korea', continent: 'Asia', population: 9776000, timezone: 'KST' },
  { id: 29, city: 'Hyderabad', country: 'India', continent: 'Asia', population: 6809000, timezone: 'IST' },
  { id: 30, city: 'London', country: 'UK', continent: 'Europe', population: 8982000, timezone: 'GMT' },
  { id: 31, city: 'Tehran', country: 'Iran', continent: 'Asia', population: 8694000, timezone: 'IRST' },
  { id: 32, city: 'Ho Chi Minh City', country: 'Vietnam', continent: 'Asia', population: 8993000, timezone: 'ICT' },
  { id: 33, city: 'Hong Kong', country: 'China', continent: 'Asia', population: 7482000, timezone: 'HKT' },
  { id: 34, city: 'Chennai', country: 'India', continent: 'Asia', population: 4682000, timezone: 'IST' },
  { id: 35, city: 'Tianjin', country: 'China', continent: 'Asia', population: 13870000, timezone: 'CST' },
  { id: 36, city: 'Chengdu', country: 'China', continent: 'Asia', population: 16330000, timezone: 'CST' },
  { id: 37, city: 'Wuhan', country: 'China', continent: 'Asia', population: 12330000, timezone: 'CST' },
  { id: 38, city: 'Sydney', country: 'Australia', continent: 'Oceania', population: 5312000, timezone: 'AEST' },
  { id: 39, city: 'Melbourne', country: 'Australia', continent: 'Oceania', population: 5078000, timezone: 'AEST' },
  { id: 40, city: 'Riyadh', country: 'Saudi Arabia', continent: 'Asia', population: 7676000, timezone: 'AST' },
  { id: 41, city: 'Santiago', country: 'Chile', continent: 'South America', population: 5614000, timezone: 'CLT' },
  { id: 42, city: 'Madrid', country: 'Spain', continent: 'Europe', population: 3223000, timezone: 'CET' },
  { id: 43, city: 'Toronto', country: 'Canada', continent: 'North America', population: 2731000, timezone: 'EST' },
  { id: 44, city: 'Nairobi', country: 'Kenya', continent: 'Africa', population: 4397000, timezone: 'EAT' },
  { id: 45, city: 'Berlin', country: 'Germany', continent: 'Europe', population: 3645000, timezone: 'CET' },
  { id: 46, city: 'Singapore', country: 'Singapore', continent: 'Asia', population: 5686000, timezone: 'SGT' },
  { id: 47, city: 'Johannesburg', country: 'South Africa', continent: 'Africa', population: 5635000, timezone: 'SAST' },
  { id: 48, city: 'Moscow', country: 'Russia', continent: 'Europe', population: 12510000, timezone: 'MSK' },
  { id: 49, city: 'Los Angeles', country: 'USA', continent: 'North America', population: 3979000, timezone: 'PST' },
  { id: 50, city: 'Chicago', country: 'USA', continent: 'North America', population: 2696000, timezone: 'CST' },
];

const columns: ColDef<City>[] = [
  { field: 'city', headerName: 'City' },
  { field: 'country', headerName: 'Country' },
  { field: 'continent', headerName: 'Continent' },
  {
    field: 'population',
    headerName: 'Population',
    type: 'numericColumn',
    valueFormatter: (params) => params.value?.toLocaleString(),
  },
  { field: 'timezone', headerName: 'Timezone', maxWidth: 100 },
];

export default function LocalPaginationExample() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Local Pagination Example</h2>
      <p style={{ marginBottom: 12, color: '#666' }}>
        50 rows paginated locally (10 per page). Filter a column to see pagination
        update with reduced row counts.
      </p>
      <DataTable<City>
        data={data}
        columns={columns}
        pagination
        pageSize={10}
        pageSizeOptions={[10, 25, 50]}
        enableColumnFilter
        bordered
        hoverable
      />
    </div>
  );
}
