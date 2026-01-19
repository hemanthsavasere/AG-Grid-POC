// Sample data for testing the AG Grid component

export interface RowData {
  id: number;
  name: string;
  email: string;
  country: string;
  city: string;
  department: string;
  position: string;
  salary: number;
  startDate: string;
  status: string;
}

const countries = ['USA', 'UK', 'Germany', 'France', 'Spain', 'Italy', 'Canada', 'Australia', 'Japan', 'Brazil'];
const cities = ['New York', 'London', 'Berlin', 'Paris', 'Madrid', 'Rome', 'Toronto', 'Sydney', 'Tokyo', 'Rio'];
const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Support', 'Product'];
const positions = ['Manager', 'Senior Developer', 'Developer', 'Analyst', 'Specialist', 'Coordinator', 'Director'];
const statuses = ['Active', 'On Leave', 'Remote', 'In Office'];
const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria', 'William', 'Jennifer', 'Richard', 'Linda', 'Thomas'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore'];

const getRandomElement = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

export const generateSampleData = (count: number): RowData[] => {
  const data: RowData[] = [];

  for (let i = 1; i <= count; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);

    data.push({
      id: i,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      country: getRandomElement(countries),
      city: getRandomElement(cities),
      department: getRandomElement(departments),
      position: getRandomElement(positions),
      salary: Math.floor(Math.random() * 150000) + 50000,
      startDate: getRandomDate(new Date(2015, 0, 1), new Date()),
      status: getRandomElement(statuses),
    });
  }

  return data;
};

// Generate different dataset sizes for testing
export const smallDataset = generateSampleData(100);
export const mediumDataset = generateSampleData(1000);
export const largeDataset = generateSampleData(10000);

// For testing the 25k limit warning
export const tooLargeDataset = generateSampleData(30000);

// Tree data structure for hierarchical display
export const treeDataset = [
  { path: ['Employees'], name: 'Employees', count: 15, totalSalary: 750000 },
  { path: ['Employees', 'Engineering'], name: 'Engineering', count: 8, totalSalary: 600000 },
  { path: ['Employees', 'Engineering', 'Backend'], name: 'Backend', count: 5, totalSalary: 400000 },
  { path: ['Employees', 'Engineering', 'Backend', 'John Doe'], name: 'John Doe', position: 'Senior Engineer', salary: 120000 },
  { path: ['Employees', 'Engineering', 'Backend', 'Jane Smith'], name: 'Jane Smith', position: 'Engineer', salary: 95000 },
  { path: ['Employees', 'Engineering', 'Backend', 'Mike Johnson'], name: 'Mike Johnson', position: 'Engineer', salary: 90000 },
  { path: ['Employees', 'Engineering', 'Backend', 'Sarah Williams'], name: 'Sarah Williams', position: 'Junior Engineer', salary: 70000 },
  { path: ['Employees', 'Engineering', 'Backend', 'Tom Brown'], name: 'Tom Brown', position: 'Junior Engineer', salary: 65000 },
  { path: ['Employees', 'Engineering', 'Frontend'], name: 'Frontend', count: 3, totalSalary: 200000 },
  { path: ['Employees', 'Engineering', 'Frontend', 'Alice Johnson'], name: 'Alice Johnson', position: 'Senior Engineer', salary: 115000 },
  { path: ['Employees', 'Engineering', 'Frontend', 'David Lee'], name: 'David Lee', position: 'Engineer', salary: 85000 },
  { path: ['Employees', 'Engineering', 'Frontend', 'Emma Davis'], name: 'Emma Davis', position: 'Junior Engineer', salary: 68000 },
  { path: ['Employees', 'Sales'], name: 'Sales', count: 7, totalSalary: 450000 },
  { path: ['Employees', 'Sales', 'North America'], name: 'North America', count: 4, totalSalary: 280000 },
  { path: ['Employees', 'Sales', 'North America', 'Bob Wilson'], name: 'Bob Wilson', position: 'Sales Manager', salary: 95000 },
  { path: ['Employees', 'Sales', 'North America', 'Carol Martinez'], name: 'Carol Martinez', position: 'Sales Rep', salary: 75000 },
  { path: ['Employees', 'Sales', 'North America', 'Daniel Garcia'], name: 'Daniel Garcia', position: 'Sales Rep', salary: 65000 },
  { path: ['Employees', 'Sales', 'North America', 'Emily Rodriguez'], name: 'Emily Rodriguez', position: 'Sales Rep', salary: 62000 },
  { path: ['Employees', 'Sales', 'Europe'], name: 'Europe', count: 3, totalSalary: 170000 },
  { path: ['Employees', 'Sales', 'Europe', 'Frank Anderson'], name: 'Frank Anderson', position: 'Sales Manager', salary: 88000 },
  { path: ['Employees', 'Sales', 'Europe', 'Grace Taylor'], name: 'Grace Taylor', position: 'Sales Rep', salary: 58000 },
  { path: ['Employees', 'Sales', 'Europe', 'Henry Thomas'], name: 'Henry Thomas', position: 'Sales Rep', salary: 55000 },
];
