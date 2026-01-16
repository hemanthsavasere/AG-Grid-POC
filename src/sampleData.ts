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
