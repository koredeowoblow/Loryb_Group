export type SupplierRecord = {
  id: string
  supplierName: string
  driverName: string
  refPhoneNo: string
  truckNo: string
  qtyOfGrains: number
  confirmedQty: number
  grainType: 'Maize' | 'Sorghum' | 'SoyaBeans'
  storeLocation: string
  weightNo: string
  rejectNo: number
  dateTimeIn: string
  dateTimeOut?: string
}

export type OrgSettings = {
  id: string
  companyName: string
  siteName: string
  address: string
  contactEmail: string
  contactPhone: string
  grainTypes: string[]
  logoUrl: string
}

export type User = {
  id: string
  name: string
  email: string
  role: 'CEO' | 'Admin' | 'Security' | 'Warehouse' | 'Logistics' | 'Finance'
  status?: 'Active' | 'Inactive' | 'Pending'
  lastLogin?: string
  password?: string
  fullName?: string
  phone?: string
}

export type Role = {
  id: string
  name: string
  description: string
  permissions: string[]
  isSystem: boolean
}

export type Invoice = {
  id: string
  invoiceNo: string
  linkedSaleId?: string
  linkedSupplierPaymentId?: string
  partyName: string
  amount: number
  issueDate: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
}

export type Driver = {
  id: string
  driverName: string
  phoneNo: string
  licenseNo: string
  licenseExpiry: string
  assignedTruckNo: string
  status: 'active' | 'inactive'
}

export type MaintenanceLogEntry = {
  id: string
  truckNo: string
  type: 'fuel' | 'maintenance'
  date: string
  cost: number
  odometerReading: number
  notes: string
}

export type LightTokenEntry = {
  id: string
  tokenNo: string
  issuedTo: string
  purpose: string
  timeIssued: string
  timeReturned: string
}

export type LabourerLogEntry = {
  id: string
  labourerName: string
  timeIn: string
  timeOut: string
  task: string
}

export type MaterialsHandoffEntry = {
  id: string
  vehicleNo: string
  materialQuality: string
  grainType: string
  driverName: string
  driverNo: string
  dateTime: string
}

export type ItemBought = {
  id: string
  supplierName: string
  truckNo: string
  goodsType: string
  goodsQty: number
  dateTimeIn: string
  dateTimeOut: string
}

export type VisitorLog = {
  id: string
  name: string
  address: string
  phoneNo: string
  personVisiting: string
  purpose: string
  timeIn: string
  timeOut?: string
  signature: string
}

export type MotorcycleLog = {
  id: string
  staffName: string
  destination: string
  purpose: string
  bikeNo: string
  date: string
  signature: string
  timeIn: string
  timeOut: string
}

export type StaffMovementLog = {
  id: string
  staffName: string
  destination: string
  purpose: string
  timeIn: string
  timeOut: string
}

export type StaffAttendance = {
  id: string
  name: string
  department: string
  timeIn: string
  timeOut: string
}

export type GoodsReceivedNote = {
  id: string
  grainType: string
  noOfBagsReceived: number
  netWeight: number
  binCardRef: string
  date: string
}

export type BinCardEntry = {
  id: string
  grainType: string
  date: string
  qtyIn: number
  qtyOut: number
  balance: number
  reference: string
}

export type Truck = {
  id: string
  truckNo: string
  capacity: number
  status: 'idle' | 'in-transit' | 'maintenance'
  assignedDriver: string
}

export type Trip = {
  id: string
  truckNo: string
  driverName: string
  origin: string
  destination: string
  status: 'pending' | 'in-transit' | 'delivered'
  etaOrCompletedAt: string
  continentalWaybillNo: string
  lbWaybillNo: string
  gatePassNo: string
}

export type SupplierPayment = {
  id: string
  supplierName: string
  linkedSuppliersRecordId: string
  amountOwed: number
  amountPaid: number
  status: string
  date: string
}

export type Sale = {
  id: string
  linkedDispatchRecordId: string
  transporterName: string
  amount: number
  date: string
}

export type PayrollEntry = {
  id: string
  staffName: string
  department: string
  daysPresent: number
  amount: number
  period: string
}

export type InventoryAlert = {
  id: string
  grainType: string
  currentQty: number
  thresholdQty: number
  status: 'ok' | 'low' | 'critical'
  lastUpdated: string
}

export type Waybill = {
  id: string
  continentalWaybillNo: string
  lbWaybillNo: string
  linkedTripId: string
  truckNo: string
  destination: string
  dateIssued: string
  status: 'active' | 'closed'
}

export type Expense = {
  id: string
  category: string
  description: string
  amount: number
  date: string
  paidBy: string
  linkedTruckNo?: string
}

export type DispatchRecord = {
  id: string
  transporterName: string
  driverName: string
  truckNo: string
  driverPhone: string
  qtyOfGrains: number
  confirmedQty: number
  grainType: 'Maize' | 'Sorghum' | 'SoyaBeans'
  weight: number
  continentalWaybillNo: string
  lbWaybillNo: string
  destination: string
  gatePassNo: string
  driverSignature: string
  dateTimeIn: string
  dateTimeOut?: string
}

export type Stock = {
  id: string
  grainType: string
  totalQty: number
  status: 'ok' | 'low' | 'critical'
  lastUpdated: string
}

export type Branch = {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
}

export type Staff = {
  id: string;
  name: string;
  phone?: string;
  role?: string;
  branchId?: string;
  createdAt: string;
  updatedAt: string;
}

export type AttendanceLog = {
  id: string;
  staffId: string;
  branchId: string;
  clockIn: string;
  clockOut?: string;
  status: 'in' | 'out';
  createdAt: string;
}

export type Production = {
  id: string;
  branchId: string;
  staffId: string;
  metricType: string;
  value: number;
  recordedAt: string;
  createdAt: string;
}
