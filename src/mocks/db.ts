let mockState = {
  "users": [
    { "id": "USR-1", "name": "CEO User", "email": "ceo@lorybgroup.com", "password": "Ceo@12345", "role": "CEO" },
    { "id": "USR-2", "name": "Admin User", "email": "admin@lorybgroup.com", "password": "Admin@12345", "role": "Admin" },
    { "id": "USR-3", "name": "Security User", "email": "security@lorybgroup.com", "password": "Security@123", "role": "Security" },
    { "id": "USR-4", "name": "Warehouse User", "email": "warehouse@lorybgroup.com", "password": "Warehouse@123", "role": "Warehouse" },
    { "id": "USR-5", "name": "Logistics User", "email": "logistics@lorybgroup.com", "password": "Logistics@123", "role": "Logistics" },
    { "id": "USR-6", "name": "Finance User", "email": "finance@lorybgroup.com", "password": "Finance@123", "role": "Finance" }
  ],
  "suppliers": [
    {
      "id": "REC-1",
      "supplierName": "Yusuf Mustapha Farms",
      "driverName": "Bola Ogunleye",
      "refPhoneNo": "0805656172",
      "truckNo": "KJA-597XA",
      "qtyOfGrains": 22858,
      "confirmedQty": 24892,
      "grainType": "SoyaBeans",
      "storeLocation": "Ibadan Center",
      "weightNo": "WGT-9422",
      "rejectNo": 1,
      "dateTimeIn": "2026-07-06T20:28:36Z",
      "dateTimeOut": "2026-07-07T01:16:36Z"
    },
    {
      "id": "REC-2",
      "supplierName": "Bola Danfulani Farms",
      "driverName": "Kemi Okafor",
      "refPhoneNo": "0802692065",
      "truckNo": "KJA-400XA",
      "qtyOfGrains": 28854,
      "confirmedQty": 23752,
      "grainType": "SoyaBeans",
      "storeLocation": "Oshodi Yard",
      "weightNo": "WGT-1960",
      "rejectNo": 3,
      "dateTimeIn": "2026-07-05T20:28:36Z",
      "dateTimeOut": "2026-07-06T01:16:36Z"
    },
    {
      "id": "REC-3",
      "supplierName": "Ade Adeyemi Farms",
      "driverName": "Yusuf Eze",
      "refPhoneNo": "0804368323",
      "truckNo": "KJA-755XA",
      "qtyOfGrains": 25994,
      "confirmedQty": 22977,
      "grainType": "Sorghum",
      "storeLocation": "Kaduna Plant",
      "weightNo": "WGT-5538",
      "rejectNo": 0,
      "dateTimeIn": "2026-07-04T20:28:36Z",
      "dateTimeOut": "2026-07-05T01:16:36Z"
    },
    {
      "id": "REC-4",
      "supplierName": "Bola Okafor Farms",
      "driverName": "Chinedu Olawale",
      "refPhoneNo": "0809085899",
      "truckNo": "KJA-164XA",
      "qtyOfGrains": 30517,
      "confirmedQty": 24174,
      "grainType": "Sorghum",
      "storeLocation": "Lekki Port",
      "weightNo": "WGT-7279",
      "rejectNo": 1,
      "dateTimeIn": "2026-07-03T20:28:36Z",
      "dateTimeOut": "2026-07-04T01:16:36Z"
    },
    {
      "id": "REC-5",
      "supplierName": "Ade Ogunleye Farms",
      "driverName": "Yusuf Adeyemi",
      "refPhoneNo": "0807229185",
      "truckNo": "KJA-519XA",
      "qtyOfGrains": 32982,
      "confirmedQty": 22495,
      "grainType": "SoyaBeans",
      "storeLocation": "Ibadan Center",
      "weightNo": "WGT-8837",
      "rejectNo": 2,
      "dateTimeIn": "2026-07-02T20:28:36Z",
      "dateTimeOut": "2026-07-03T01:16:36Z"
    },
    {
      "id": "REC-6",
      "supplierName": "Kemi Danfulani Farms",
      "driverName": "Fatima Olawale",
      "refPhoneNo": "0803730938",
      "truckNo": "KJA-525XA",
      "qtyOfGrains": 29923,
      "confirmedQty": 25316,
      "grainType": "SoyaBeans",
      "storeLocation": "Oshodi Yard",
      "weightNo": "WGT-8693",
      "rejectNo": 0,
      "dateTimeIn": "2026-07-01T20:28:36Z",
      "dateTimeOut": "2026-07-02T01:16:36Z"
    },
    {
      "id": "REC-7",
      "supplierName": "Chinedu Nwosu Farms",
      "driverName": "Ibrahim Balogun",
      "refPhoneNo": "0805815979",
      "truckNo": "KJA-872XA",
      "qtyOfGrains": 26041,
      "confirmedQty": 31823,
      "grainType": "Sorghum",
      "storeLocation": "Kano Silo",
      "weightNo": "WGT-7528",
      "rejectNo": 0,
      "dateTimeIn": "2026-06-30T20:28:36Z",
      "dateTimeOut": "2026-07-01T01:16:36Z"
    },
    {
      "id": "REC-8",
      "supplierName": "Abubakar Okafor Farms",
      "driverName": "Chioma Adeyemi",
      "refPhoneNo": "0806302460",
      "truckNo": "KJA-354XA",
      "qtyOfGrains": 35895,
      "confirmedQty": 26044,
      "grainType": "Maize",
      "storeLocation": "Ibadan Center",
      "weightNo": "WGT-9006",
      "rejectNo": 2,
      "dateTimeIn": "2026-06-29T20:28:36Z",
      "dateTimeOut": "2026-06-30T01:16:36Z"
    },
    {
      "id": "REC-9",
      "supplierName": "Oluwaseun Nwosu Farms",
      "driverName": "Fatima Olawale",
      "refPhoneNo": "0809246910",
      "truckNo": "KJA-977XA",
      "qtyOfGrains": 38234,
      "confirmedQty": 20015,
      "grainType": "SoyaBeans",
      "storeLocation": "Greenville LNG",
      "weightNo": "WGT-9817",
      "rejectNo": 4,
      "dateTimeIn": "2026-06-28T20:28:36Z",
      "dateTimeOut": "2026-06-29T01:16:36Z"
    },
    {
      "id": "REC-10",
      "supplierName": "Ngozi Adeyemi Farms",
      "driverName": "Ade Lawal",
      "refPhoneNo": "0805858207",
      "truckNo": "KJA-689XA",
      "qtyOfGrains": 29540,
      "confirmedQty": 31318,
      "grainType": "Maize",
      "storeLocation": "Ikeja Hub",
      "weightNo": "WGT-6314",
      "rejectNo": 3,
      "dateTimeIn": "2026-06-27T20:28:36Z",
      "dateTimeOut": "2026-06-28T01:16:36Z"
    },
    {
      "id": "REC-11",
      "supplierName": "Kemi Aliyu Farms",
      "driverName": "Musa Bello",
      "refPhoneNo": "0804162676",
      "truckNo": "KJA-640XA",
      "qtyOfGrains": 32870,
      "confirmedQty": 32706,
      "grainType": "Sorghum",
      "storeLocation": "Ibadan Center",
      "weightNo": "WGT-7256",
      "rejectNo": 4,
      "dateTimeIn": "2026-06-26T20:28:36Z",
      "dateTimeOut": "2026-06-27T01:16:36Z"
    },
    {
      "id": "REC-12",
      "supplierName": "Emeka Mustapha Farms",
      "driverName": "Yusuf Okeke",
      "refPhoneNo": "0802428319",
      "truckNo": "KJA-827XA",
      "qtyOfGrains": 38315,
      "confirmedQty": 38739,
      "grainType": "Sorghum",
      "storeLocation": "Kaduna Plant",
      "weightNo": "WGT-5128",
      "rejectNo": 3,
      "dateTimeIn": "2026-06-25T20:28:36Z",
      "dateTimeOut": "2026-06-26T01:16:36Z"
    },
    {
      "id": "REC-13",
      "supplierName": "Ade Okeke Farms",
      "driverName": "Ngozi Adeyemi",
      "refPhoneNo": "0801448865",
      "truckNo": "KJA-213XA",
      "qtyOfGrains": 35336,
      "confirmedQty": 27819,
      "grainType": "Sorghum",
      "storeLocation": "Kano Silo",
      "weightNo": "WGT-2089",
      "rejectNo": 2,
      "dateTimeIn": "2026-06-24T20:28:36Z",
      "dateTimeOut": "2026-06-25T01:16:36Z"
    },
    {
      "id": "REC-14",
      "supplierName": "Babajide Lawal Farms",
      "driverName": "Yusuf Olawale",
      "refPhoneNo": "0808296562",
      "truckNo": "KJA-999XA",
      "qtyOfGrains": 21969,
      "confirmedQty": 22111,
      "grainType": "Maize",
      "storeLocation": "Ibadan Center",
      "weightNo": "WGT-8324",
      "rejectNo": 5,
      "dateTimeIn": "2026-06-23T20:28:36Z",
      "dateTimeOut": "2026-06-24T01:16:36Z"
    },
    {
      "id": "REC-15",
      "supplierName": "Oluwaseun Olawale Farms",
      "driverName": "Ade Balogun",
      "refPhoneNo": "0803243607",
      "truckNo": "KJA-362XA",
      "qtyOfGrains": 31970,
      "confirmedQty": 31239,
      "grainType": "SoyaBeans",
      "storeLocation": "Kaduna Plant",
      "weightNo": "WGT-2764",
      "rejectNo": 5,
      "dateTimeIn": "2026-06-22T20:28:36Z",
      "dateTimeOut": "2026-06-23T01:16:36Z"
    },
    {
      "id": "REC-16",
      "supplierName": "Abubakar Abiodun Farms",
      "driverName": "Kemi Aliyu",
      "refPhoneNo": "0805775809",
      "truckNo": "KJA-151XA",
      "qtyOfGrains": 20421,
      "confirmedQty": 27313,
      "grainType": "Sorghum",
      "storeLocation": "Kano Silo",
      "weightNo": "WGT-1780",
      "rejectNo": 1,
      "dateTimeIn": "2026-06-21T20:28:36Z",
      "dateTimeOut": "2026-06-22T01:16:36Z"
    },
    {
      "id": "REC-17",
      "supplierName": "Emeka Lawal Farms",
      "driverName": "Fatima Olawale",
      "refPhoneNo": "0806367503",
      "truckNo": "KJA-516XA",
      "qtyOfGrains": 38575,
      "confirmedQty": 32581,
      "grainType": "SoyaBeans",
      "storeLocation": "Ibadan Center",
      "weightNo": "WGT-9684",
      "rejectNo": 3,
      "dateTimeIn": "2026-06-20T20:28:36Z",
      "dateTimeOut": "2026-06-21T01:16:36Z"
    },
    {
      "id": "REC-18",
      "supplierName": "Ngozi Ogunleye Farms",
      "driverName": "Bola Okeke",
      "refPhoneNo": "0805192863",
      "truckNo": "KJA-228XA",
      "qtyOfGrains": 22337,
      "confirmedQty": 25263,
      "grainType": "Maize",
      "storeLocation": "Port Harcourt Hub",
      "weightNo": "WGT-8410",
      "rejectNo": 5,
      "dateTimeIn": "2026-06-19T20:28:36Z",
      "dateTimeOut": "2026-06-20T01:16:36Z"
    },
    {
      "id": "REC-19",
      "supplierName": "Ibrahim Aliyu Farms",
      "driverName": "Chinedu Okeke",
      "refPhoneNo": "0807160168",
      "truckNo": "KJA-825XA",
      "qtyOfGrains": 35719,
      "confirmedQty": 19150,
      "grainType": "Maize",
      "storeLocation": "Ikeja Hub",
      "weightNo": "WGT-9550",
      "rejectNo": 3,
      "dateTimeIn": "2026-06-18T20:28:36Z",
      "dateTimeOut": "2026-06-19T01:16:36Z"
    },
    {
      "id": "REC-20",
      "supplierName": "Amina Mustapha Farms",
      "driverName": "Ibrahim Lawal",
      "refPhoneNo": "0804509708",
      "truckNo": "KJA-268XA",
      "qtyOfGrains": 24068,
      "confirmedQty": 25065,
      "grainType": "Sorghum",
      "storeLocation": "Kano Silo",
      "weightNo": "WGT-1868",
      "rejectNo": 5,
      "dateTimeIn": "2026-06-17T20:28:36Z",
      "dateTimeOut": "2026-06-18T01:16:36Z"
    }
  ],
  "invoices": [
    {
      "id": "REC-1",
      "invoiceNo": "INV-2026-1",
      "partyName": "Yusuf Mustapha Farms",
      "amount": 2725333,
      "issueDate": "2026-07-06",
      "dueDate": "2026-08-05",
      "status": "sent"
    },
    {
      "id": "REC-2",
      "invoiceNo": "INV-2026-2",
      "partyName": "Bola Danfulani Farms",
      "amount": 3744979,
      "issueDate": "2026-07-05",
      "dueDate": "2026-08-04",
      "status": "paid"
    },
    {
      "id": "REC-3",
      "invoiceNo": "INV-2026-3",
      "partyName": "Ade Adeyemi Farms",
      "amount": 3948960,
      "issueDate": "2026-07-04",
      "dueDate": "2026-08-03",
      "status": "paid"
    },
    {
      "id": "REC-4",
      "invoiceNo": "INV-2026-4",
      "partyName": "Bola Okafor Farms",
      "amount": 2181043,
      "issueDate": "2026-07-03",
      "dueDate": "2026-08-02",
      "status": "sent"
    },
    {
      "id": "REC-5",
      "invoiceNo": "INV-2026-5",
      "partyName": "Ade Ogunleye Farms",
      "amount": 3047257,
      "issueDate": "2026-07-02",
      "dueDate": "2026-08-01",
      "status": "sent"
    },
    {
      "id": "REC-6",
      "invoiceNo": "INV-2026-6",
      "partyName": "Kemi Danfulani Farms",
      "amount": 4568954,
      "issueDate": "2026-07-01",
      "dueDate": "2026-07-31",
      "status": "overdue"
    },
    {
      "id": "REC-7",
      "invoiceNo": "INV-2026-7",
      "partyName": "Chinedu Nwosu Farms",
      "amount": 503376,
      "issueDate": "2026-06-30",
      "dueDate": "2026-07-30",
      "status": "overdue"
    },
    {
      "id": "REC-8",
      "invoiceNo": "INV-2026-8",
      "partyName": "Abubakar Okafor Farms",
      "amount": 592834,
      "issueDate": "2026-06-29",
      "dueDate": "2026-07-29",
      "status": "paid"
    },
    {
      "id": "REC-9",
      "invoiceNo": "INV-2026-9",
      "partyName": "Oluwaseun Nwosu Farms",
      "amount": 2201172,
      "issueDate": "2026-06-28",
      "dueDate": "2026-07-28",
      "status": "sent"
    },
    {
      "id": "REC-10",
      "invoiceNo": "INV-2026-10",
      "partyName": "Ngozi Adeyemi Farms",
      "amount": 2731726,
      "issueDate": "2026-06-27",
      "dueDate": "2026-07-27",
      "status": "overdue"
    },
    {
      "id": "REC-11",
      "invoiceNo": "INV-2026-11",
      "partyName": "Kemi Aliyu Farms",
      "amount": 1259170,
      "issueDate": "2026-06-26",
      "dueDate": "2026-07-26",
      "status": "paid"
    },
    {
      "id": "REC-12",
      "invoiceNo": "INV-2026-12",
      "partyName": "Emeka Mustapha Farms",
      "amount": 4102363,
      "issueDate": "2026-06-25",
      "dueDate": "2026-07-25",
      "status": "sent"
    },
    {
      "id": "REC-13",
      "invoiceNo": "INV-2026-13",
      "partyName": "Ade Okeke Farms",
      "amount": 2121902,
      "issueDate": "2026-06-24",
      "dueDate": "2026-07-24",
      "status": "paid"
    },
    {
      "id": "REC-14",
      "invoiceNo": "INV-2026-14",
      "partyName": "Babajide Lawal Farms",
      "amount": 2710074,
      "issueDate": "2026-06-23",
      "dueDate": "2026-07-23",
      "status": "paid"
    },
    {
      "id": "REC-15",
      "invoiceNo": "INV-2026-15",
      "partyName": "Oluwaseun Olawale Farms",
      "amount": 3862374,
      "issueDate": "2026-06-22",
      "dueDate": "2026-07-22",
      "status": "sent"
    },
    {
      "id": "REC-16",
      "invoiceNo": "INV-2026-16",
      "partyName": "Abubakar Abiodun Farms",
      "amount": 2984954,
      "issueDate": "2026-06-21",
      "dueDate": "2026-07-21",
      "status": "paid"
    },
    {
      "id": "REC-17",
      "invoiceNo": "INV-2026-17",
      "partyName": "Emeka Lawal Farms",
      "amount": 3245274,
      "issueDate": "2026-06-20",
      "dueDate": "2026-07-20",
      "status": "overdue"
    },
    {
      "id": "REC-18",
      "invoiceNo": "INV-2026-18",
      "partyName": "Ngozi Ogunleye Farms",
      "amount": 653292,
      "issueDate": "2026-06-19",
      "dueDate": "2026-07-19",
      "status": "draft"
    },
    {
      "id": "REC-19",
      "invoiceNo": "INV-2026-19",
      "partyName": "Ibrahim Aliyu Farms",
      "amount": 3135312,
      "issueDate": "2026-06-18",
      "dueDate": "2026-07-18",
      "status": "paid"
    },
    {
      "id": "REC-20",
      "invoiceNo": "INV-2026-20",
      "partyName": "Amina Mustapha Farms",
      "amount": 3795053,
      "issueDate": "2026-06-17",
      "dueDate": "2026-07-17",
      "status": "draft"
    }
  ],
  "drivers": [
    {
      "id": "REC-1",
      "driverName": "Bola Ogunleye",
      "phoneNo": "0801428295",
      "licenseNo": "DL-86075",
      "licenseExpiry": "2027-06-21",
      "assignedTruckNo": "KJA-597XA",
      "status": "active"
    },
    {
      "id": "REC-2",
      "driverName": "Kemi Okafor",
      "phoneNo": "0806207652",
      "licenseNo": "DL-54558",
      "licenseExpiry": "2027-10-14",
      "assignedTruckNo": "KJA-400XA",
      "status": "active"
    },
    {
      "id": "REC-3",
      "driverName": "Yusuf Eze",
      "phoneNo": "0804818110",
      "licenseNo": "DL-34369",
      "licenseExpiry": "2026-11-26",
      "assignedTruckNo": "KJA-755XA",
      "status": "inactive"
    },
    {
      "id": "REC-4",
      "driverName": "Chinedu Olawale",
      "phoneNo": "0807299770",
      "licenseNo": "DL-68668",
      "licenseExpiry": "2027-09-30",
      "assignedTruckNo": "KJA-164XA",
      "status": "active"
    },
    {
      "id": "REC-5",
      "driverName": "Yusuf Adeyemi",
      "phoneNo": "0807229722",
      "licenseNo": "DL-17868",
      "licenseExpiry": "2027-07-24",
      "assignedTruckNo": "KJA-519XA",
      "status": "active"
    },
    {
      "id": "REC-6",
      "driverName": "Fatima Olawale",
      "phoneNo": "0805907113",
      "licenseNo": "DL-84769",
      "licenseExpiry": "2027-08-12",
      "assignedTruckNo": "KJA-525XA",
      "status": "active"
    },
    {
      "id": "REC-7",
      "driverName": "Ibrahim Balogun",
      "phoneNo": "0807698180",
      "licenseNo": "DL-37825",
      "licenseExpiry": "2026-12-05",
      "assignedTruckNo": "KJA-872XA",
      "status": "inactive"
    },
    {
      "id": "REC-8",
      "driverName": "Chioma Adeyemi",
      "phoneNo": "0809606485",
      "licenseNo": "DL-99430",
      "licenseExpiry": "2027-04-01",
      "assignedTruckNo": "KJA-354XA",
      "status": "inactive"
    },
    {
      "id": "REC-9",
      "driverName": "Fatima Olawale",
      "phoneNo": "0806454975",
      "licenseNo": "DL-99641",
      "licenseExpiry": "2027-02-17",
      "assignedTruckNo": "KJA-977XA",
      "status": "inactive"
    },
    {
      "id": "REC-10",
      "driverName": "Ade Lawal",
      "phoneNo": "0801873703",
      "licenseNo": "DL-83146",
      "licenseExpiry": "2027-04-29",
      "assignedTruckNo": "KJA-689XA",
      "status": "inactive"
    },
    {
      "id": "REC-11",
      "driverName": "Musa Bello",
      "phoneNo": "0807374577",
      "licenseNo": "DL-19221",
      "licenseExpiry": "2027-03-25",
      "assignedTruckNo": "KJA-640XA",
      "status": "active"
    },
    {
      "id": "REC-12",
      "driverName": "Yusuf Okeke",
      "phoneNo": "0807551202",
      "licenseNo": "DL-48712",
      "licenseExpiry": "2027-10-06",
      "assignedTruckNo": "KJA-827XA",
      "status": "active"
    },
    {
      "id": "REC-13",
      "driverName": "Ngozi Adeyemi",
      "phoneNo": "0808127602",
      "licenseNo": "DL-51253",
      "licenseExpiry": "2027-07-18",
      "assignedTruckNo": "KJA-213XA",
      "status": "active"
    },
    {
      "id": "REC-14",
      "driverName": "Yusuf Olawale",
      "phoneNo": "0802868751",
      "licenseNo": "DL-18209",
      "licenseExpiry": "2027-05-05",
      "assignedTruckNo": "KJA-999XA",
      "status": "active"
    },
    {
      "id": "REC-15",
      "driverName": "Ade Balogun",
      "phoneNo": "0808973075",
      "licenseNo": "DL-67086",
      "licenseExpiry": "2027-06-08",
      "assignedTruckNo": "KJA-362XA",
      "status": "inactive"
    },
    {
      "id": "REC-16",
      "driverName": "Kemi Aliyu",
      "phoneNo": "0803474329",
      "licenseNo": "DL-25704",
      "licenseExpiry": "2026-10-19",
      "assignedTruckNo": "KJA-151XA",
      "status": "inactive"
    },
    {
      "id": "REC-17",
      "driverName": "Fatima Olawale",
      "phoneNo": "0804611885",
      "licenseNo": "DL-48866",
      "licenseExpiry": "2027-01-12",
      "assignedTruckNo": "KJA-516XA",
      "status": "inactive"
    },
    {
      "id": "REC-18",
      "driverName": "Bola Okeke",
      "phoneNo": "0808889320",
      "licenseNo": "DL-78959",
      "licenseExpiry": "2027-02-13",
      "assignedTruckNo": "KJA-228XA",
      "status": "active"
    },
    {
      "id": "REC-19",
      "driverName": "Chinedu Okeke",
      "phoneNo": "0809036148",
      "licenseNo": "DL-84625",
      "licenseExpiry": "2027-07-09",
      "assignedTruckNo": "KJA-825XA",
      "status": "active"
    },
    {
      "id": "REC-20",
      "driverName": "Ibrahim Lawal",
      "phoneNo": "0806411556",
      "licenseNo": "DL-35374",
      "licenseExpiry": "2027-06-16",
      "assignedTruckNo": "KJA-268XA",
      "status": "inactive"
    }
  ],
  "maintenance": [
    {
      "id": "REC-1",
      "truckNo": "KJA-597XA",
      "type": "maintenance",
      "date": "2026-07-06",
      "cost": 197228,
      "odometerReading": 92019,
      "notes": "Routine check"
    },
    {
      "id": "REC-2",
      "truckNo": "KJA-400XA",
      "type": "fuel",
      "date": "2026-07-05",
      "cost": 182668,
      "odometerReading": 144858,
      "notes": "Routine check"
    },
    {
      "id": "REC-3",
      "truckNo": "KJA-755XA",
      "type": "fuel",
      "date": "2026-07-04",
      "cost": 348607,
      "odometerReading": 148890,
      "notes": "Routine check"
    },
    {
      "id": "REC-4",
      "truckNo": "KJA-164XA",
      "type": "maintenance",
      "date": "2026-07-03",
      "cost": 145951,
      "odometerReading": 132556,
      "notes": "Routine check"
    },
    {
      "id": "REC-5",
      "truckNo": "KJA-519XA",
      "type": "maintenance",
      "date": "2026-07-02",
      "cost": 94443,
      "odometerReading": 143061,
      "notes": "Routine check"
    },
    {
      "id": "REC-6",
      "truckNo": "KJA-525XA",
      "type": "fuel",
      "date": "2026-07-01",
      "cost": 269397,
      "odometerReading": 78562,
      "notes": "Routine check"
    },
    {
      "id": "REC-7",
      "truckNo": "KJA-872XA",
      "type": "maintenance",
      "date": "2026-06-30",
      "cost": 230987,
      "odometerReading": 50217,
      "notes": "Routine check"
    },
    {
      "id": "REC-8",
      "truckNo": "KJA-354XA",
      "type": "maintenance",
      "date": "2026-06-29",
      "cost": 126180,
      "odometerReading": 21032,
      "notes": "Routine check"
    },
    {
      "id": "REC-9",
      "truckNo": "KJA-977XA",
      "type": "maintenance",
      "date": "2026-06-28",
      "cost": 304181,
      "odometerReading": 30992,
      "notes": "Routine check"
    },
    {
      "id": "REC-10",
      "truckNo": "KJA-689XA",
      "type": "maintenance",
      "date": "2026-06-27",
      "cost": 380294,
      "odometerReading": 84485,
      "notes": "Routine check"
    },
    {
      "id": "REC-11",
      "truckNo": "KJA-640XA",
      "type": "maintenance",
      "date": "2026-06-26",
      "cost": 362928,
      "odometerReading": 35824,
      "notes": "Routine check"
    },
    {
      "id": "REC-12",
      "truckNo": "KJA-827XA",
      "type": "maintenance",
      "date": "2026-06-25",
      "cost": 136938,
      "odometerReading": 111894,
      "notes": "Routine check"
    },
    {
      "id": "REC-13",
      "truckNo": "KJA-213XA",
      "type": "maintenance",
      "date": "2026-06-24",
      "cost": 456044,
      "odometerReading": 136556,
      "notes": "Routine check"
    },
    {
      "id": "REC-14",
      "truckNo": "KJA-999XA",
      "type": "fuel",
      "date": "2026-06-23",
      "cost": 423326,
      "odometerReading": 46750,
      "notes": "Routine check"
    },
    {
      "id": "REC-15",
      "truckNo": "KJA-362XA",
      "type": "maintenance",
      "date": "2026-06-22",
      "cost": 332635,
      "odometerReading": 39633,
      "notes": "Routine check"
    },
    {
      "id": "REC-16",
      "truckNo": "KJA-151XA",
      "type": "maintenance",
      "date": "2026-06-21",
      "cost": 160646,
      "odometerReading": 103027,
      "notes": "Routine check"
    },
    {
      "id": "REC-17",
      "truckNo": "KJA-516XA",
      "type": "fuel",
      "date": "2026-06-20",
      "cost": 490132,
      "odometerReading": 36378,
      "notes": "Routine check"
    },
    {
      "id": "REC-18",
      "truckNo": "KJA-228XA",
      "type": "fuel",
      "date": "2026-06-19",
      "cost": 227161,
      "odometerReading": 141886,
      "notes": "Routine check"
    },
    {
      "id": "REC-19",
      "truckNo": "KJA-825XA",
      "type": "fuel",
      "date": "2026-06-18",
      "cost": 329795,
      "odometerReading": 110856,
      "notes": "Routine check"
    },
    {
      "id": "REC-20",
      "truckNo": "KJA-268XA",
      "type": "maintenance",
      "date": "2026-06-17",
      "cost": 122162,
      "odometerReading": 86608,
      "notes": "Routine check"
    }
  ],
  "lightTokens": [
    {
      "id": "REC-1",
      "tokenNo": "TKN-816",
      "issuedTo": "Bola Bello",
      "purpose": "Night Shift",
      "timeIssued": "2026-07-06T20:28:36Z",
      "timeReturned": "2026-07-07T08:28:36Z"
    },
    {
      "id": "REC-2",
      "tokenNo": "TKN-770",
      "issuedTo": "Musa Olawale",
      "purpose": "Night Shift",
      "timeIssued": "2026-07-05T20:28:36Z",
      "timeReturned": "2026-07-06T08:28:36Z"
    },
    {
      "id": "REC-3",
      "tokenNo": "TKN-453",
      "issuedTo": "Abubakar Ogunleye",
      "purpose": "Night Shift",
      "timeIssued": "2026-07-04T20:28:36Z",
      "timeReturned": "2026-07-05T08:28:36Z"
    },
    {
      "id": "REC-4",
      "tokenNo": "TKN-315",
      "issuedTo": "Abubakar Okeke",
      "purpose": "Night Shift",
      "timeIssued": "2026-07-03T20:28:36Z",
      "timeReturned": "2026-07-04T08:28:36Z"
    },
    {
      "id": "REC-5",
      "tokenNo": "TKN-364",
      "issuedTo": "Chinedu Nwosu",
      "purpose": "Night Shift",
      "timeIssued": "2026-07-02T20:28:36Z",
      "timeReturned": "2026-07-03T08:28:36Z"
    },
    {
      "id": "REC-6",
      "tokenNo": "TKN-647",
      "issuedTo": "Abubakar Balogun",
      "purpose": "Night Shift",
      "timeIssued": "2026-07-01T20:28:36Z",
      "timeReturned": "2026-07-02T08:28:36Z"
    },
    {
      "id": "REC-7",
      "tokenNo": "TKN-466",
      "issuedTo": "Bola Nwosu",
      "purpose": "Night Shift",
      "timeIssued": "2026-06-30T20:28:36Z",
      "timeReturned": "2026-07-01T08:28:36Z"
    },
    {
      "id": "REC-8",
      "tokenNo": "TKN-633",
      "issuedTo": "Emeka Okeke",
      "purpose": "Night Shift",
      "timeIssued": "2026-06-29T20:28:36Z",
      "timeReturned": "2026-06-30T08:28:36Z"
    },
    {
      "id": "REC-9",
      "tokenNo": "TKN-965",
      "issuedTo": "Abubakar Olawale",
      "purpose": "Night Shift",
      "timeIssued": "2026-06-28T20:28:36Z",
      "timeReturned": "2026-06-29T08:28:36Z"
    },
    {
      "id": "REC-10",
      "tokenNo": "TKN-379",
      "issuedTo": "Chinedu Abiodun",
      "purpose": "Night Shift",
      "timeIssued": "2026-06-27T20:28:36Z",
      "timeReturned": "2026-06-28T08:28:36Z"
    },
    {
      "id": "REC-11",
      "tokenNo": "TKN-842",
      "issuedTo": "Fatima Lawal",
      "purpose": "Night Shift",
      "timeIssued": "2026-06-26T20:28:36Z",
      "timeReturned": "2026-06-27T08:28:36Z"
    },
    {
      "id": "REC-12",
      "tokenNo": "TKN-833",
      "issuedTo": "Emeka Eze",
      "purpose": "Night Shift",
      "timeIssued": "2026-06-25T20:28:36Z",
      "timeReturned": "2026-06-26T08:28:36Z"
    },
    {
      "id": "REC-13",
      "tokenNo": "TKN-833",
      "issuedTo": "Babajide Lawal",
      "purpose": "Night Shift",
      "timeIssued": "2026-06-24T20:28:36Z",
      "timeReturned": "2026-06-25T08:28:36Z"
    },
    {
      "id": "REC-14",
      "tokenNo": "TKN-332",
      "issuedTo": "Musa Okeke",
      "purpose": "Night Shift",
      "timeIssued": "2026-06-23T20:28:36Z",
      "timeReturned": "2026-06-24T08:28:36Z"
    },
    {
      "id": "REC-15",
      "tokenNo": "TKN-198",
      "issuedTo": "Chinedu Mustapha",
      "purpose": "Night Shift",
      "timeIssued": "2026-06-22T20:28:36Z",
      "timeReturned": "2026-06-23T08:28:36Z"
    },
    {
      "id": "REC-16",
      "tokenNo": "TKN-301",
      "issuedTo": "Fatima Aliyu",
      "purpose": "Night Shift",
      "timeIssued": "2026-06-21T20:28:36Z",
      "timeReturned": "2026-06-22T08:28:36Z"
    },
    {
      "id": "REC-17",
      "tokenNo": "TKN-372",
      "issuedTo": "Amina Nwosu",
      "purpose": "Night Shift",
      "timeIssued": "2026-06-20T20:28:36Z",
      "timeReturned": "2026-06-21T08:28:36Z"
    },
    {
      "id": "REC-18",
      "tokenNo": "TKN-799",
      "issuedTo": "Chioma Lawal",
      "purpose": "Night Shift",
      "timeIssued": "2026-06-19T20:28:36Z",
      "timeReturned": "2026-06-20T08:28:36Z"
    },
    {
      "id": "REC-19",
      "tokenNo": "TKN-833",
      "issuedTo": "Amina Adeyemi",
      "purpose": "Night Shift",
      "timeIssued": "2026-06-18T20:28:36Z",
      "timeReturned": "2026-06-19T08:28:36Z"
    },
    {
      "id": "REC-20",
      "tokenNo": "TKN-562",
      "issuedTo": "Fatima Eze",
      "purpose": "Night Shift",
      "timeIssued": "2026-06-17T20:28:36Z",
      "timeReturned": "2026-06-18T08:28:36Z"
    }
  ],
  "labourers": [
    {
      "id": "REC-1",
      "labourerName": "Ngozi Mustapha",
      "timeIn": "2026-07-06T20:28:36Z",
      "timeOut": "2026-07-07T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-2",
      "labourerName": "Amina Adeyemi",
      "timeIn": "2026-07-05T20:28:36Z",
      "timeOut": "2026-07-06T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-3",
      "labourerName": "Amina Mustapha",
      "timeIn": "2026-07-04T20:28:36Z",
      "timeOut": "2026-07-05T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-4",
      "labourerName": "Ngozi Ogunleye",
      "timeIn": "2026-07-03T20:28:36Z",
      "timeOut": "2026-07-04T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-5",
      "labourerName": "Ibrahim Bello",
      "timeIn": "2026-07-02T20:28:36Z",
      "timeOut": "2026-07-03T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-6",
      "labourerName": "Bola Lawal",
      "timeIn": "2026-07-01T20:28:36Z",
      "timeOut": "2026-07-02T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-7",
      "labourerName": "Chioma Ogunleye",
      "timeIn": "2026-06-30T20:28:36Z",
      "timeOut": "2026-07-01T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-8",
      "labourerName": "Babajide Eze",
      "timeIn": "2026-06-29T20:28:36Z",
      "timeOut": "2026-06-30T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-9",
      "labourerName": "Fatima Bello",
      "timeIn": "2026-06-28T20:28:36Z",
      "timeOut": "2026-06-29T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-10",
      "labourerName": "Yusuf Eze",
      "timeIn": "2026-06-27T20:28:36Z",
      "timeOut": "2026-06-28T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-11",
      "labourerName": "Chinedu Okeke",
      "timeIn": "2026-06-26T20:28:36Z",
      "timeOut": "2026-06-27T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-12",
      "labourerName": "Bola Okeke",
      "timeIn": "2026-06-25T20:28:36Z",
      "timeOut": "2026-06-26T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-13",
      "labourerName": "Emeka Balogun",
      "timeIn": "2026-06-24T20:28:36Z",
      "timeOut": "2026-06-25T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-14",
      "labourerName": "Kemi Ogunleye",
      "timeIn": "2026-06-23T20:28:36Z",
      "timeOut": "2026-06-24T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-15",
      "labourerName": "Emeka Ogunleye",
      "timeIn": "2026-06-22T20:28:36Z",
      "timeOut": "2026-06-23T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-16",
      "labourerName": "Amina Bello",
      "timeIn": "2026-06-21T20:28:36Z",
      "timeOut": "2026-06-22T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-17",
      "labourerName": "Fatima Bello",
      "timeIn": "2026-06-20T20:28:36Z",
      "timeOut": "2026-06-21T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-18",
      "labourerName": "Emeka Nwosu",
      "timeIn": "2026-06-19T20:28:36Z",
      "timeOut": "2026-06-20T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-19",
      "labourerName": "Ngozi Adeyemi",
      "timeIn": "2026-06-18T20:28:36Z",
      "timeOut": "2026-06-19T06:04:36Z",
      "task": "Offloading"
    },
    {
      "id": "REC-20",
      "labourerName": "Ibrahim Okeke",
      "timeIn": "2026-06-17T20:28:36Z",
      "timeOut": "2026-06-18T06:04:36Z",
      "task": "Offloading"
    }
  ],
  "materialsHandoff": [
    {
      "id": "REC-1",
      "vehicleNo": "KJA-597XA",
      "materialQuality": "Good",
      "grainType": "SoyaBeans",
      "driverName": "Bola Ogunleye",
      "driverNo": "0804878187",
      "dateTime": "2026-07-06T20:28:36Z"
    },
    {
      "id": "REC-2",
      "vehicleNo": "KJA-400XA",
      "materialQuality": "Poor",
      "grainType": "SoyaBeans",
      "driverName": "Kemi Okafor",
      "driverNo": "0806765914",
      "dateTime": "2026-07-05T20:28:36Z"
    },
    {
      "id": "REC-3",
      "vehicleNo": "KJA-755XA",
      "materialQuality": "Poor",
      "grainType": "Sorghum",
      "driverName": "Yusuf Eze",
      "driverNo": "0801310677",
      "dateTime": "2026-07-04T20:28:36Z"
    },
    {
      "id": "REC-4",
      "vehicleNo": "KJA-164XA",
      "materialQuality": "Poor",
      "grainType": "Sorghum",
      "driverName": "Chinedu Olawale",
      "driverNo": "0805062683",
      "dateTime": "2026-07-03T20:28:36Z"
    },
    {
      "id": "REC-5",
      "vehicleNo": "KJA-519XA",
      "materialQuality": "Poor",
      "grainType": "SoyaBeans",
      "driverName": "Yusuf Adeyemi",
      "driverNo": "0805705588",
      "dateTime": "2026-07-02T20:28:36Z"
    },
    {
      "id": "REC-6",
      "vehicleNo": "KJA-525XA",
      "materialQuality": "Fair",
      "grainType": "SoyaBeans",
      "driverName": "Fatima Olawale",
      "driverNo": "0807961438",
      "dateTime": "2026-07-01T20:28:36Z"
    },
    {
      "id": "REC-7",
      "vehicleNo": "KJA-872XA",
      "materialQuality": "Fair",
      "grainType": "Sorghum",
      "driverName": "Ibrahim Balogun",
      "driverNo": "0802672406",
      "dateTime": "2026-06-30T20:28:36Z"
    },
    {
      "id": "REC-8",
      "vehicleNo": "KJA-354XA",
      "materialQuality": "Fair",
      "grainType": "Maize",
      "driverName": "Chioma Adeyemi",
      "driverNo": "0801671588",
      "dateTime": "2026-06-29T20:28:36Z"
    },
    {
      "id": "REC-9",
      "vehicleNo": "KJA-977XA",
      "materialQuality": "Good",
      "grainType": "SoyaBeans",
      "driverName": "Fatima Olawale",
      "driverNo": "0802616367",
      "dateTime": "2026-06-28T20:28:36Z"
    },
    {
      "id": "REC-10",
      "vehicleNo": "KJA-689XA",
      "materialQuality": "Fair",
      "grainType": "Maize",
      "driverName": "Ade Lawal",
      "driverNo": "0804569710",
      "dateTime": "2026-06-27T20:28:36Z"
    },
    {
      "id": "REC-11",
      "vehicleNo": "KJA-640XA",
      "materialQuality": "Fair",
      "grainType": "Sorghum",
      "driverName": "Musa Bello",
      "driverNo": "0807421259",
      "dateTime": "2026-06-26T20:28:36Z"
    },
    {
      "id": "REC-12",
      "vehicleNo": "KJA-827XA",
      "materialQuality": "Poor",
      "grainType": "Sorghum",
      "driverName": "Yusuf Okeke",
      "driverNo": "0809046056",
      "dateTime": "2026-06-25T20:28:36Z"
    },
    {
      "id": "REC-13",
      "vehicleNo": "KJA-213XA",
      "materialQuality": "Poor",
      "grainType": "Sorghum",
      "driverName": "Ngozi Adeyemi",
      "driverNo": "0801459330",
      "dateTime": "2026-06-24T20:28:36Z"
    },
    {
      "id": "REC-14",
      "vehicleNo": "KJA-999XA",
      "materialQuality": "Good",
      "grainType": "Maize",
      "driverName": "Yusuf Olawale",
      "driverNo": "0806826950",
      "dateTime": "2026-06-23T20:28:36Z"
    },
    {
      "id": "REC-15",
      "vehicleNo": "KJA-362XA",
      "materialQuality": "Fair",
      "grainType": "SoyaBeans",
      "driverName": "Ade Balogun",
      "driverNo": "0801040006",
      "dateTime": "2026-06-22T20:28:36Z"
    },
    {
      "id": "REC-16",
      "vehicleNo": "KJA-151XA",
      "materialQuality": "Good",
      "grainType": "Sorghum",
      "driverName": "Kemi Aliyu",
      "driverNo": "0804823495",
      "dateTime": "2026-06-21T20:28:36Z"
    },
    {
      "id": "REC-17",
      "vehicleNo": "KJA-516XA",
      "materialQuality": "Fair",
      "grainType": "SoyaBeans",
      "driverName": "Fatima Olawale",
      "driverNo": "0801084309",
      "dateTime": "2026-06-20T20:28:36Z"
    },
    {
      "id": "REC-18",
      "vehicleNo": "KJA-228XA",
      "materialQuality": "Good",
      "grainType": "Maize",
      "driverName": "Bola Okeke",
      "driverNo": "0802644697",
      "dateTime": "2026-06-19T20:28:36Z"
    },
    {
      "id": "REC-19",
      "vehicleNo": "KJA-825XA",
      "materialQuality": "Poor",
      "grainType": "Maize",
      "driverName": "Chinedu Okeke",
      "driverNo": "0808385696",
      "dateTime": "2026-06-18T20:28:36Z"
    },
    {
      "id": "REC-20",
      "vehicleNo": "KJA-268XA",
      "materialQuality": "Poor",
      "grainType": "Sorghum",
      "driverName": "Ibrahim Lawal",
      "driverNo": "0806686644",
      "dateTime": "2026-06-17T20:28:36Z"
    }
  ],
  "dispatchRecord": [
    {
      "id": "REC-1",
      "transporterName": "Trans Emeka Okeke",
      "driverName": "Bola Ogunleye",
      "truckNo": "KJA-597XA",
      "driverPhone": "0802265787",
      "qtyOfGrains": 25599,
      "confirmedQty": 26041,
      "grainType": "SoyaBeans",
      "weight": 34871,
      "continentalWaybillNo": "CW-1",
      "lbWaybillNo": "LB-1",
      "destination": "Port Harcourt Hub",
      "gatePassNo": "GP-1",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-07-06T20:28:36Z",
      "dateTimeOut": "2026-07-07T08:28:36Z"
    },
    {
      "id": "REC-2",
      "transporterName": "Trans Kemi Ogunleye",
      "driverName": "Kemi Okafor",
      "truckNo": "KJA-400XA",
      "driverPhone": "0803339230",
      "qtyOfGrains": 32847,
      "confirmedQty": 22853,
      "grainType": "SoyaBeans",
      "weight": 23432,
      "continentalWaybillNo": "CW-2",
      "lbWaybillNo": "LB-2",
      "destination": "Kaduna Plant",
      "gatePassNo": "GP-2",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-07-05T20:28:36Z",
      "dateTimeOut": "2026-07-06T08:28:36Z"
    },
    {
      "id": "REC-3",
      "transporterName": "Trans Bola Danfulani",
      "driverName": "Yusuf Eze",
      "truckNo": "KJA-755XA",
      "driverPhone": "0805406893",
      "qtyOfGrains": 26432,
      "confirmedQty": 30297,
      "grainType": "Sorghum",
      "weight": 33535,
      "continentalWaybillNo": "CW-3",
      "lbWaybillNo": "LB-3",
      "destination": "Ibadan Center",
      "gatePassNo": "GP-3",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-07-04T20:28:36Z",
      "dateTimeOut": "2026-07-05T08:28:36Z"
    },
    {
      "id": "REC-4",
      "transporterName": "Trans Bola Lawal",
      "driverName": "Chinedu Olawale",
      "truckNo": "KJA-164XA",
      "driverPhone": "0809805999",
      "qtyOfGrains": 32446,
      "confirmedQty": 22151,
      "grainType": "Sorghum",
      "weight": 20710,
      "continentalWaybillNo": "CW-4",
      "lbWaybillNo": "LB-4",
      "destination": "Kano Silo",
      "gatePassNo": "GP-4",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-07-03T20:28:36Z",
      "dateTimeOut": "2026-07-04T08:28:36Z"
    },
    {
      "id": "REC-5",
      "transporterName": "Trans Ibrahim Abiodun",
      "driverName": "Yusuf Adeyemi",
      "truckNo": "KJA-519XA",
      "driverPhone": "0809242266",
      "qtyOfGrains": 33328,
      "confirmedQty": 24355,
      "grainType": "SoyaBeans",
      "weight": 38846,
      "continentalWaybillNo": "CW-5",
      "lbWaybillNo": "LB-5",
      "destination": "Ikeja Hub",
      "gatePassNo": "GP-5",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-07-02T20:28:36Z",
      "dateTimeOut": "2026-07-03T08:28:36Z"
    },
    {
      "id": "REC-6",
      "transporterName": "Trans Ngozi Okafor",
      "driverName": "Fatima Olawale",
      "truckNo": "KJA-525XA",
      "driverPhone": "0804763946",
      "qtyOfGrains": 24761,
      "confirmedQty": 28813,
      "grainType": "SoyaBeans",
      "weight": 31363,
      "continentalWaybillNo": "CW-6",
      "lbWaybillNo": "LB-6",
      "destination": "Greenville LNG",
      "gatePassNo": "GP-6",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-07-01T20:28:36Z",
      "dateTimeOut": "2026-07-02T08:28:36Z"
    },
    {
      "id": "REC-7",
      "transporterName": "Trans Kemi Okafor",
      "driverName": "Ibrahim Balogun",
      "truckNo": "KJA-872XA",
      "driverPhone": "0805918323",
      "qtyOfGrains": 22645,
      "confirmedQty": 23058,
      "grainType": "Sorghum",
      "weight": 33231,
      "continentalWaybillNo": "CW-7",
      "lbWaybillNo": "LB-7",
      "destination": "Ikeja Hub",
      "gatePassNo": "GP-7",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-06-30T20:28:36Z",
      "dateTimeOut": "2026-07-01T08:28:36Z"
    },
    {
      "id": "REC-8",
      "transporterName": "Trans Babajide Balogun",
      "driverName": "Chioma Adeyemi",
      "truckNo": "KJA-354XA",
      "driverPhone": "0807675536",
      "qtyOfGrains": 26939,
      "confirmedQty": 21012,
      "grainType": "Maize",
      "weight": 24919,
      "continentalWaybillNo": "CW-8",
      "lbWaybillNo": "LB-8",
      "destination": "Kaduna Plant",
      "gatePassNo": "GP-8",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-06-29T20:28:36Z",
      "dateTimeOut": "2026-06-30T08:28:36Z"
    },
    {
      "id": "REC-9",
      "transporterName": "Trans Yusuf Aliyu",
      "driverName": "Fatima Olawale",
      "truckNo": "KJA-977XA",
      "driverPhone": "0805151393",
      "qtyOfGrains": 39156,
      "confirmedQty": 32939,
      "grainType": "SoyaBeans",
      "weight": 38635,
      "continentalWaybillNo": "CW-9",
      "lbWaybillNo": "LB-9",
      "destination": "Kano Silo",
      "gatePassNo": "GP-9",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-06-28T20:28:36Z",
      "dateTimeOut": "2026-06-29T08:28:36Z"
    },
    {
      "id": "REC-10",
      "transporterName": "Trans Kemi Okeke",
      "driverName": "Ade Lawal",
      "truckNo": "KJA-689XA",
      "driverPhone": "0808634419",
      "qtyOfGrains": 35011,
      "confirmedQty": 30051,
      "grainType": "Maize",
      "weight": 24928,
      "continentalWaybillNo": "CW-10",
      "lbWaybillNo": "LB-10",
      "destination": "Port Harcourt Hub",
      "gatePassNo": "GP-10",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-06-27T20:28:36Z",
      "dateTimeOut": "2026-06-28T08:28:36Z"
    },
    {
      "id": "REC-11",
      "transporterName": "Trans Emeka Okeke",
      "driverName": "Musa Bello",
      "truckNo": "KJA-640XA",
      "driverPhone": "0803385399",
      "qtyOfGrains": 21744,
      "confirmedQty": 21063,
      "grainType": "Sorghum",
      "weight": 30379,
      "continentalWaybillNo": "CW-11",
      "lbWaybillNo": "LB-11",
      "destination": "Port Harcourt Hub",
      "gatePassNo": "GP-11",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-06-26T20:28:36Z",
      "dateTimeOut": "2026-06-27T08:28:36Z"
    },
    {
      "id": "REC-12",
      "transporterName": "Trans Oluwaseun Olawale",
      "driverName": "Yusuf Okeke",
      "truckNo": "KJA-827XA",
      "driverPhone": "0803615257",
      "qtyOfGrains": 24511,
      "confirmedQty": 31598,
      "grainType": "Sorghum",
      "weight": 38509,
      "continentalWaybillNo": "CW-12",
      "lbWaybillNo": "LB-12",
      "destination": "Apapa Depot",
      "gatePassNo": "GP-12",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-06-25T20:28:36Z",
      "dateTimeOut": "2026-06-26T08:28:36Z"
    },
    {
      "id": "REC-13",
      "transporterName": "Trans Kemi Danfulani",
      "driverName": "Ngozi Adeyemi",
      "truckNo": "KJA-213XA",
      "driverPhone": "0802264958",
      "qtyOfGrains": 37838,
      "confirmedQty": 23739,
      "grainType": "Sorghum",
      "weight": 30834,
      "continentalWaybillNo": "CW-13",
      "lbWaybillNo": "LB-13",
      "destination": "Port Harcourt Hub",
      "gatePassNo": "GP-13",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-06-24T20:28:36Z",
      "dateTimeOut": "2026-06-25T08:28:36Z"
    },
    {
      "id": "REC-14",
      "transporterName": "Trans Amina Ogunleye",
      "driverName": "Yusuf Olawale",
      "truckNo": "KJA-999XA",
      "driverPhone": "0801624638",
      "qtyOfGrains": 26077,
      "confirmedQty": 26808,
      "grainType": "Maize",
      "weight": 38567,
      "continentalWaybillNo": "CW-14",
      "lbWaybillNo": "LB-14",
      "destination": "Oshodi Yard",
      "gatePassNo": "GP-14",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-06-23T20:28:36Z",
      "dateTimeOut": "2026-06-24T08:28:36Z"
    },
    {
      "id": "REC-15",
      "transporterName": "Trans Babajide Nwosu",
      "driverName": "Ade Balogun",
      "truckNo": "KJA-362XA",
      "driverPhone": "0802887955",
      "qtyOfGrains": 24810,
      "confirmedQty": 37372,
      "grainType": "SoyaBeans",
      "weight": 22030,
      "continentalWaybillNo": "CW-15",
      "lbWaybillNo": "LB-15",
      "destination": "Apapa Depot",
      "gatePassNo": "GP-15",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-06-22T20:28:36Z",
      "dateTimeOut": "2026-06-23T08:28:36Z"
    },
    {
      "id": "REC-16",
      "transporterName": "Trans Ngozi Aliyu",
      "driverName": "Kemi Aliyu",
      "truckNo": "KJA-151XA",
      "driverPhone": "0801509984",
      "qtyOfGrains": 28893,
      "confirmedQty": 20643,
      "grainType": "Sorghum",
      "weight": 25406,
      "continentalWaybillNo": "CW-16",
      "lbWaybillNo": "LB-16",
      "destination": "Ibadan Center",
      "gatePassNo": "GP-16",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-06-21T20:28:36Z",
      "dateTimeOut": "2026-06-22T08:28:36Z"
    },
    {
      "id": "REC-17",
      "transporterName": "Trans Fatima Okafor",
      "driverName": "Fatima Olawale",
      "truckNo": "KJA-516XA",
      "driverPhone": "0807057515",
      "qtyOfGrains": 36499,
      "confirmedQty": 28820,
      "grainType": "SoyaBeans",
      "weight": 27438,
      "continentalWaybillNo": "CW-17",
      "lbWaybillNo": "LB-17",
      "destination": "Ikeja Hub",
      "gatePassNo": "GP-17",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-06-20T20:28:36Z",
      "dateTimeOut": "2026-06-21T08:28:36Z"
    },
    {
      "id": "REC-18",
      "transporterName": "Trans Kemi Balogun",
      "driverName": "Bola Okeke",
      "truckNo": "KJA-228XA",
      "driverPhone": "0809769234",
      "qtyOfGrains": 34385,
      "confirmedQty": 20597,
      "grainType": "Maize",
      "weight": 38417,
      "continentalWaybillNo": "CW-18",
      "lbWaybillNo": "LB-18",
      "destination": "Lekki Port",
      "gatePassNo": "GP-18",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-06-19T20:28:36Z",
      "dateTimeOut": "2026-06-20T08:28:36Z"
    },
    {
      "id": "REC-19",
      "transporterName": "Trans Babajide Okafor",
      "driverName": "Chinedu Okeke",
      "truckNo": "KJA-825XA",
      "driverPhone": "0807838105",
      "qtyOfGrains": 25256,
      "confirmedQty": 21353,
      "grainType": "Maize",
      "weight": 22042,
      "continentalWaybillNo": "CW-19",
      "lbWaybillNo": "LB-19",
      "destination": "Lekki Port",
      "gatePassNo": "GP-19",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-06-18T20:28:36Z",
      "dateTimeOut": "2026-06-19T08:28:36Z"
    },
    {
      "id": "REC-20",
      "transporterName": "Trans Oluwaseun Nwosu",
      "driverName": "Ibrahim Lawal",
      "truckNo": "KJA-268XA",
      "driverPhone": "0803756115",
      "qtyOfGrains": 28477,
      "confirmedQty": 27764,
      "grainType": "Sorghum",
      "weight": 37043,
      "continentalWaybillNo": "CW-20",
      "lbWaybillNo": "LB-20",
      "destination": "Kano Silo",
      "gatePassNo": "GP-20",
      "driverSignature": "Signed",
      "dateTimeIn": "2026-06-17T20:28:36Z",
      "dateTimeOut": "2026-06-18T08:28:36Z"
    }
  ],
  "itemBought": [
    {
      "id": "REC-1",
      "supplierName": "Yusuf Mustapha Farms",
      "truckNo": "KJA-597XA",
      "goodsType": "SoyaBeans",
      "goodsQty": 127,
      "dateTimeIn": "2026-07-06T20:28:36Z",
      "dateTimeOut": "2026-07-07T20:28:36Z"
    },
    {
      "id": "REC-2",
      "supplierName": "Bola Danfulani Farms",
      "truckNo": "KJA-400XA",
      "goodsType": "SoyaBeans",
      "goodsQty": 258,
      "dateTimeIn": "2026-07-05T20:28:36Z",
      "dateTimeOut": "2026-07-06T20:28:36Z"
    },
    {
      "id": "REC-3",
      "supplierName": "Ade Adeyemi Farms",
      "truckNo": "KJA-755XA",
      "goodsType": "Sorghum",
      "goodsQty": 385,
      "dateTimeIn": "2026-07-04T20:28:36Z",
      "dateTimeOut": "2026-07-05T20:28:36Z"
    },
    {
      "id": "REC-4",
      "supplierName": "Bola Okafor Farms",
      "truckNo": "KJA-164XA",
      "goodsType": "Sorghum",
      "goodsQty": 484,
      "dateTimeIn": "2026-07-03T20:28:36Z",
      "dateTimeOut": "2026-07-04T20:28:36Z"
    },
    {
      "id": "REC-5",
      "supplierName": "Ade Ogunleye Farms",
      "truckNo": "KJA-519XA",
      "goodsType": "SoyaBeans",
      "goodsQty": 230,
      "dateTimeIn": "2026-07-02T20:28:36Z",
      "dateTimeOut": "2026-07-03T20:28:36Z"
    },
    {
      "id": "REC-6",
      "supplierName": "Kemi Danfulani Farms",
      "truckNo": "KJA-525XA",
      "goodsType": "SoyaBeans",
      "goodsQty": 294,
      "dateTimeIn": "2026-07-01T20:28:36Z",
      "dateTimeOut": "2026-07-02T20:28:36Z"
    },
    {
      "id": "REC-7",
      "supplierName": "Chinedu Nwosu Farms",
      "truckNo": "KJA-872XA",
      "goodsType": "Sorghum",
      "goodsQty": 449,
      "dateTimeIn": "2026-06-30T20:28:36Z",
      "dateTimeOut": "2026-07-01T20:28:36Z"
    },
    {
      "id": "REC-8",
      "supplierName": "Abubakar Okafor Farms",
      "truckNo": "KJA-354XA",
      "goodsType": "Maize",
      "goodsQty": 281,
      "dateTimeIn": "2026-06-29T20:28:36Z",
      "dateTimeOut": "2026-06-30T20:28:36Z"
    },
    {
      "id": "REC-9",
      "supplierName": "Oluwaseun Nwosu Farms",
      "truckNo": "KJA-977XA",
      "goodsType": "SoyaBeans",
      "goodsQty": 174,
      "dateTimeIn": "2026-06-28T20:28:36Z",
      "dateTimeOut": "2026-06-29T20:28:36Z"
    },
    {
      "id": "REC-10",
      "supplierName": "Ngozi Adeyemi Farms",
      "truckNo": "KJA-689XA",
      "goodsType": "Maize",
      "goodsQty": 400,
      "dateTimeIn": "2026-06-27T20:28:36Z",
      "dateTimeOut": "2026-06-28T20:28:36Z"
    },
    {
      "id": "REC-11",
      "supplierName": "Kemi Aliyu Farms",
      "truckNo": "KJA-640XA",
      "goodsType": "Sorghum",
      "goodsQty": 247,
      "dateTimeIn": "2026-06-26T20:28:36Z",
      "dateTimeOut": "2026-06-27T20:28:36Z"
    },
    {
      "id": "REC-12",
      "supplierName": "Emeka Mustapha Farms",
      "truckNo": "KJA-827XA",
      "goodsType": "Sorghum",
      "goodsQty": 452,
      "dateTimeIn": "2026-06-25T20:28:36Z",
      "dateTimeOut": "2026-06-26T20:28:36Z"
    },
    {
      "id": "REC-13",
      "supplierName": "Ade Okeke Farms",
      "truckNo": "KJA-213XA",
      "goodsType": "Sorghum",
      "goodsQty": 424,
      "dateTimeIn": "2026-06-24T20:28:36Z",
      "dateTimeOut": "2026-06-25T20:28:36Z"
    },
    {
      "id": "REC-14",
      "supplierName": "Babajide Lawal Farms",
      "truckNo": "KJA-999XA",
      "goodsType": "Maize",
      "goodsQty": 170,
      "dateTimeIn": "2026-06-23T20:28:36Z",
      "dateTimeOut": "2026-06-24T20:28:36Z"
    },
    {
      "id": "REC-15",
      "supplierName": "Oluwaseun Olawale Farms",
      "truckNo": "KJA-362XA",
      "goodsType": "SoyaBeans",
      "goodsQty": 168,
      "dateTimeIn": "2026-06-22T20:28:36Z",
      "dateTimeOut": "2026-06-23T20:28:36Z"
    },
    {
      "id": "REC-16",
      "supplierName": "Abubakar Abiodun Farms",
      "truckNo": "KJA-151XA",
      "goodsType": "Sorghum",
      "goodsQty": 411,
      "dateTimeIn": "2026-06-21T20:28:36Z",
      "dateTimeOut": "2026-06-22T20:28:36Z"
    },
    {
      "id": "REC-17",
      "supplierName": "Emeka Lawal Farms",
      "truckNo": "KJA-516XA",
      "goodsType": "SoyaBeans",
      "goodsQty": 450,
      "dateTimeIn": "2026-06-20T20:28:36Z",
      "dateTimeOut": "2026-06-21T20:28:36Z"
    },
    {
      "id": "REC-18",
      "supplierName": "Ngozi Ogunleye Farms",
      "truckNo": "KJA-228XA",
      "goodsType": "Maize",
      "goodsQty": 265,
      "dateTimeIn": "2026-06-19T20:28:36Z",
      "dateTimeOut": "2026-06-20T20:28:36Z"
    },
    {
      "id": "REC-19",
      "supplierName": "Ibrahim Aliyu Farms",
      "truckNo": "KJA-825XA",
      "goodsType": "Maize",
      "goodsQty": 313,
      "dateTimeIn": "2026-06-18T20:28:36Z",
      "dateTimeOut": "2026-06-19T20:28:36Z"
    },
    {
      "id": "REC-20",
      "supplierName": "Amina Mustapha Farms",
      "truckNo": "KJA-268XA",
      "goodsType": "Sorghum",
      "goodsQty": 263,
      "dateTimeIn": "2026-06-17T20:28:36Z",
      "dateTimeOut": "2026-06-18T20:28:36Z"
    }
  ],
  "visitorLog": [
    {
      "id": "REC-1",
      "name": "Musa Adeyemi",
      "address": "Kaduna Plant",
      "phoneNo": "0802236222",
      "personVisiting": "Bola Eze",
      "purpose": "Meeting",
      "timeIn": "2026-07-06T20:28:36Z",
      "timeOut": "2026-07-06T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-2",
      "name": "Bola Eze",
      "address": "Apapa Depot",
      "phoneNo": "0801250675",
      "personVisiting": "Yusuf Olawale",
      "purpose": "Meeting",
      "timeIn": "2026-07-05T20:28:36Z",
      "timeOut": "2026-07-05T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-3",
      "name": "Musa Eze",
      "address": "Ibadan Center",
      "phoneNo": "0801297450",
      "personVisiting": "Bola Mustapha",
      "purpose": "Meeting",
      "timeIn": "2026-07-04T20:28:36Z",
      "timeOut": "2026-07-04T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-4",
      "name": "Amina Danfulani",
      "address": "Apapa Depot",
      "phoneNo": "0808576670",
      "personVisiting": "Bola Eze",
      "purpose": "Meeting",
      "timeIn": "2026-07-03T20:28:36Z",
      "timeOut": "2026-07-03T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-5",
      "name": "Yusuf Eze",
      "address": "Ibadan Center",
      "phoneNo": "0805502850",
      "personVisiting": "Ade Bello",
      "purpose": "Meeting",
      "timeIn": "2026-07-02T20:28:36Z",
      "timeOut": "2026-07-02T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-6",
      "name": "Oluwaseun Aliyu",
      "address": "Kaduna Plant",
      "phoneNo": "0809655128",
      "personVisiting": "Bola Mustapha",
      "purpose": "Meeting",
      "timeIn": "2026-07-01T20:28:36Z",
      "timeOut": "2026-07-01T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-7",
      "name": "Fatima Adeyemi",
      "address": "Greenville LNG",
      "phoneNo": "0806927803",
      "personVisiting": "Oluwaseun Olawale",
      "purpose": "Meeting",
      "timeIn": "2026-06-30T20:28:36Z",
      "timeOut": "2026-06-30T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-8",
      "name": "Chinedu Eze",
      "address": "Ibadan Center",
      "phoneNo": "0807122024",
      "personVisiting": "Ngozi Ogunleye",
      "purpose": "Meeting",
      "timeIn": "2026-06-29T20:28:36Z",
      "timeOut": "2026-06-29T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-9",
      "name": "Amina Okafor",
      "address": "Ikeja Hub",
      "phoneNo": "0801118177",
      "personVisiting": "Babajide Mustapha",
      "purpose": "Meeting",
      "timeIn": "2026-06-28T20:28:36Z",
      "timeOut": "2026-06-28T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-10",
      "name": "Abubakar Balogun",
      "address": "Ikeja Hub",
      "phoneNo": "0807900082",
      "personVisiting": "Chinedu Okafor",
      "purpose": "Meeting",
      "timeIn": "2026-06-27T20:28:36Z",
      "timeOut": "2026-06-27T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-11",
      "name": "Babajide Lawal",
      "address": "Oshodi Yard",
      "phoneNo": "0805125596",
      "personVisiting": "Emeka Olawale",
      "purpose": "Meeting",
      "timeIn": "2026-06-26T20:28:36Z",
      "timeOut": "2026-06-26T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-12",
      "name": "Ade Danfulani",
      "address": "Ibadan Center",
      "phoneNo": "0802427049",
      "personVisiting": "Musa Lawal",
      "purpose": "Meeting",
      "timeIn": "2026-06-25T20:28:36Z",
      "timeOut": "2026-06-25T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-13",
      "name": "Emeka Bello",
      "address": "Kaduna Plant",
      "phoneNo": "0808980269",
      "personVisiting": "Ibrahim Aliyu",
      "purpose": "Meeting",
      "timeIn": "2026-06-24T20:28:36Z",
      "timeOut": "2026-06-24T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-14",
      "name": "Bola Lawal",
      "address": "Oshodi Yard",
      "phoneNo": "0801340969",
      "personVisiting": "Musa Danfulani",
      "purpose": "Meeting",
      "timeIn": "2026-06-23T20:28:36Z",
      "timeOut": "2026-06-23T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-15",
      "name": "Oluwaseun Okafor",
      "address": "Apapa Depot",
      "phoneNo": "0806614871",
      "personVisiting": "Amina Nwosu",
      "purpose": "Meeting",
      "timeIn": "2026-06-22T20:28:36Z",
      "timeOut": "2026-06-22T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-16",
      "name": "Kemi Abiodun",
      "address": "Ibadan Center",
      "phoneNo": "0803331534",
      "personVisiting": "Chinedu Danfulani",
      "purpose": "Meeting",
      "timeIn": "2026-06-21T20:28:36Z",
      "timeOut": "2026-06-21T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-17",
      "name": "Abubakar Okeke",
      "address": "Kaduna Plant",
      "phoneNo": "0809322216",
      "personVisiting": "Yusuf Okafor",
      "purpose": "Meeting",
      "timeIn": "2026-06-20T20:28:36Z",
      "timeOut": "2026-06-20T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-18",
      "name": "Chioma Eze",
      "address": "Port Harcourt Hub",
      "phoneNo": "0806967613",
      "personVisiting": "Babajide Okafor",
      "purpose": "Meeting",
      "timeIn": "2026-06-19T20:28:36Z",
      "timeOut": "2026-06-19T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-19",
      "name": "Yusuf Olawale",
      "address": "Apapa Depot",
      "phoneNo": "0802480505",
      "personVisiting": "Ngozi Okafor",
      "purpose": "Meeting",
      "timeIn": "2026-06-18T20:28:36Z",
      "timeOut": "2026-06-18T22:52:36Z",
      "signature": "Signed"
    },
    {
      "id": "REC-20",
      "name": "Oluwaseun Mustapha",
      "address": "Lekki Port",
      "phoneNo": "0801954139",
      "personVisiting": "Yusuf Adeyemi",
      "purpose": "Meeting",
      "timeIn": "2026-06-17T20:28:36Z",
      "timeOut": "2026-06-17T22:52:36Z",
      "signature": "Signed"
    }
  ],
  "motorcycleLog": [
    {
      "id": "REC-1",
      "staffName": "Yusuf Adeyemi",
      "destination": "Kaduna Plant",
      "purpose": "Delivery",
      "bikeNo": "MC-920",
      "date": "2026-07-06",
      "signature": "Signed",
      "timeIn": "2026-07-06T20:28:36Z",
      "timeOut": "2026-07-06T22:52:36Z"
    },
    {
      "id": "REC-2",
      "staffName": "Amina Mustapha",
      "destination": "Apapa Depot",
      "purpose": "Delivery",
      "bikeNo": "MC-245",
      "date": "2026-07-05",
      "signature": "Signed",
      "timeIn": "2026-07-05T20:28:36Z",
      "timeOut": "2026-07-05T22:52:36Z"
    },
    {
      "id": "REC-3",
      "staffName": "Oluwaseun Olawale",
      "destination": "Kano Silo",
      "purpose": "Delivery",
      "bikeNo": "MC-807",
      "date": "2026-07-04",
      "signature": "Signed",
      "timeIn": "2026-07-04T20:28:36Z",
      "timeOut": "2026-07-04T22:52:36Z"
    },
    {
      "id": "REC-4",
      "staffName": "Bola Abiodun",
      "destination": "Kano Silo",
      "purpose": "Delivery",
      "bikeNo": "MC-962",
      "date": "2026-07-03",
      "signature": "Signed",
      "timeIn": "2026-07-03T20:28:36Z",
      "timeOut": "2026-07-03T22:52:36Z"
    },
    {
      "id": "REC-5",
      "staffName": "Amina Okafor",
      "destination": "Oshodi Yard",
      "purpose": "Delivery",
      "bikeNo": "MC-762",
      "date": "2026-07-02",
      "signature": "Signed",
      "timeIn": "2026-07-02T20:28:36Z",
      "timeOut": "2026-07-02T22:52:36Z"
    },
    {
      "id": "REC-6",
      "staffName": "Ade Ogunleye",
      "destination": "Kaduna Plant",
      "purpose": "Delivery",
      "bikeNo": "MC-741",
      "date": "2026-07-01",
      "signature": "Signed",
      "timeIn": "2026-07-01T20:28:36Z",
      "timeOut": "2026-07-01T22:52:36Z"
    },
    {
      "id": "REC-7",
      "staffName": "Bola Okafor",
      "destination": "Port Harcourt Hub",
      "purpose": "Delivery",
      "bikeNo": "MC-482",
      "date": "2026-06-30",
      "signature": "Signed",
      "timeIn": "2026-06-30T20:28:36Z",
      "timeOut": "2026-06-30T22:52:36Z"
    },
    {
      "id": "REC-8",
      "staffName": "Ibrahim Okafor",
      "destination": "Lekki Port",
      "purpose": "Delivery",
      "bikeNo": "MC-429",
      "date": "2026-06-29",
      "signature": "Signed",
      "timeIn": "2026-06-29T20:28:36Z",
      "timeOut": "2026-06-29T22:52:36Z"
    },
    {
      "id": "REC-9",
      "staffName": "Abubakar Bello",
      "destination": "Port Harcourt Hub",
      "purpose": "Delivery",
      "bikeNo": "MC-299",
      "date": "2026-06-28",
      "signature": "Signed",
      "timeIn": "2026-06-28T20:28:36Z",
      "timeOut": "2026-06-28T22:52:36Z"
    },
    {
      "id": "REC-10",
      "staffName": "Ade Balogun",
      "destination": "Apapa Depot",
      "purpose": "Delivery",
      "bikeNo": "MC-410",
      "date": "2026-06-27",
      "signature": "Signed",
      "timeIn": "2026-06-27T20:28:36Z",
      "timeOut": "2026-06-27T22:52:36Z"
    },
    {
      "id": "REC-11",
      "staffName": "Musa Ogunleye",
      "destination": "Lekki Port",
      "purpose": "Delivery",
      "bikeNo": "MC-986",
      "date": "2026-06-26",
      "signature": "Signed",
      "timeIn": "2026-06-26T20:28:36Z",
      "timeOut": "2026-06-26T22:52:36Z"
    },
    {
      "id": "REC-12",
      "staffName": "Musa Lawal",
      "destination": "Lekki Port",
      "purpose": "Delivery",
      "bikeNo": "MC-478",
      "date": "2026-06-25",
      "signature": "Signed",
      "timeIn": "2026-06-25T20:28:36Z",
      "timeOut": "2026-06-25T22:52:36Z"
    },
    {
      "id": "REC-13",
      "staffName": "Chinedu Balogun",
      "destination": "Greenville LNG",
      "purpose": "Delivery",
      "bikeNo": "MC-493",
      "date": "2026-06-24",
      "signature": "Signed",
      "timeIn": "2026-06-24T20:28:36Z",
      "timeOut": "2026-06-24T22:52:36Z"
    },
    {
      "id": "REC-14",
      "staffName": "Abubakar Ogunleye",
      "destination": "Kano Silo",
      "purpose": "Delivery",
      "bikeNo": "MC-468",
      "date": "2026-06-23",
      "signature": "Signed",
      "timeIn": "2026-06-23T20:28:36Z",
      "timeOut": "2026-06-23T22:52:36Z"
    },
    {
      "id": "REC-15",
      "staffName": "Amina Aliyu",
      "destination": "Kaduna Plant",
      "purpose": "Delivery",
      "bikeNo": "MC-428",
      "date": "2026-06-22",
      "signature": "Signed",
      "timeIn": "2026-06-22T20:28:36Z",
      "timeOut": "2026-06-22T22:52:36Z"
    },
    {
      "id": "REC-16",
      "staffName": "Fatima Adeyemi",
      "destination": "Port Harcourt Hub",
      "purpose": "Delivery",
      "bikeNo": "MC-421",
      "date": "2026-06-21",
      "signature": "Signed",
      "timeIn": "2026-06-21T20:28:36Z",
      "timeOut": "2026-06-21T22:52:36Z"
    },
    {
      "id": "REC-17",
      "staffName": "Fatima Adeyemi",
      "destination": "Kano Silo",
      "purpose": "Delivery",
      "bikeNo": "MC-803",
      "date": "2026-06-20",
      "signature": "Signed",
      "timeIn": "2026-06-20T20:28:36Z",
      "timeOut": "2026-06-20T22:52:36Z"
    },
    {
      "id": "REC-18",
      "staffName": "Chioma Danfulani",
      "destination": "Greenville LNG",
      "purpose": "Delivery",
      "bikeNo": "MC-852",
      "date": "2026-06-19",
      "signature": "Signed",
      "timeIn": "2026-06-19T20:28:36Z",
      "timeOut": "2026-06-19T22:52:36Z"
    },
    {
      "id": "REC-19",
      "staffName": "Babajide Okeke",
      "destination": "Port Harcourt Hub",
      "purpose": "Delivery",
      "bikeNo": "MC-740",
      "date": "2026-06-18",
      "signature": "Signed",
      "timeIn": "2026-06-18T20:28:36Z",
      "timeOut": "2026-06-18T22:52:36Z"
    },
    {
      "id": "REC-20",
      "staffName": "Chinedu Mustapha",
      "destination": "Lekki Port",
      "purpose": "Delivery",
      "bikeNo": "MC-680",
      "date": "2026-06-17",
      "signature": "Signed",
      "timeIn": "2026-06-17T20:28:36Z",
      "timeOut": "2026-06-17T22:52:36Z"
    }
  ],
  "staffMovement": [
    {
      "id": "REC-1",
      "staffName": "Amina Adeyemi",
      "destination": "Lekki Port",
      "purpose": "Field Visit",
      "timeIn": "2026-07-06T20:28:36Z",
      "timeOut": "2026-07-07T01:16:36Z"
    },
    {
      "id": "REC-2",
      "staffName": "Abubakar Eze",
      "destination": "Ibadan Center",
      "purpose": "Field Visit",
      "timeIn": "2026-07-05T20:28:36Z",
      "timeOut": "2026-07-06T01:16:36Z"
    },
    {
      "id": "REC-3",
      "staffName": "Oluwaseun Danfulani",
      "destination": "Greenville LNG",
      "purpose": "Field Visit",
      "timeIn": "2026-07-04T20:28:36Z",
      "timeOut": "2026-07-05T01:16:36Z"
    },
    {
      "id": "REC-4",
      "staffName": "Fatima Aliyu",
      "destination": "Lekki Port",
      "purpose": "Field Visit",
      "timeIn": "2026-07-03T20:28:36Z",
      "timeOut": "2026-07-04T01:16:36Z"
    },
    {
      "id": "REC-5",
      "staffName": "Amina Bello",
      "destination": "Ibadan Center",
      "purpose": "Field Visit",
      "timeIn": "2026-07-02T20:28:36Z",
      "timeOut": "2026-07-03T01:16:36Z"
    },
    {
      "id": "REC-6",
      "staffName": "Babajide Adeyemi",
      "destination": "Apapa Depot",
      "purpose": "Field Visit",
      "timeIn": "2026-07-01T20:28:36Z",
      "timeOut": "2026-07-02T01:16:36Z"
    },
    {
      "id": "REC-7",
      "staffName": "Chioma Abiodun",
      "destination": "Greenville LNG",
      "purpose": "Field Visit",
      "timeIn": "2026-06-30T20:28:36Z",
      "timeOut": "2026-07-01T01:16:36Z"
    },
    {
      "id": "REC-8",
      "staffName": "Fatima Okafor",
      "destination": "Port Harcourt Hub",
      "purpose": "Field Visit",
      "timeIn": "2026-06-29T20:28:36Z",
      "timeOut": "2026-06-30T01:16:36Z"
    },
    {
      "id": "REC-9",
      "staffName": "Ngozi Lawal",
      "destination": "Oshodi Yard",
      "purpose": "Field Visit",
      "timeIn": "2026-06-28T20:28:36Z",
      "timeOut": "2026-06-29T01:16:36Z"
    },
    {
      "id": "REC-10",
      "staffName": "Emeka Danfulani",
      "destination": "Ibadan Center",
      "purpose": "Field Visit",
      "timeIn": "2026-06-27T20:28:36Z",
      "timeOut": "2026-06-28T01:16:36Z"
    },
    {
      "id": "REC-11",
      "staffName": "Abubakar Balogun",
      "destination": "Greenville LNG",
      "purpose": "Field Visit",
      "timeIn": "2026-06-26T20:28:36Z",
      "timeOut": "2026-06-27T01:16:36Z"
    },
    {
      "id": "REC-12",
      "staffName": "Amina Balogun",
      "destination": "Ibadan Center",
      "purpose": "Field Visit",
      "timeIn": "2026-06-25T20:28:36Z",
      "timeOut": "2026-06-26T01:16:36Z"
    },
    {
      "id": "REC-13",
      "staffName": "Oluwaseun Eze",
      "destination": "Lekki Port",
      "purpose": "Field Visit",
      "timeIn": "2026-06-24T20:28:36Z",
      "timeOut": "2026-06-25T01:16:36Z"
    },
    {
      "id": "REC-14",
      "staffName": "Yusuf Danfulani",
      "destination": "Apapa Depot",
      "purpose": "Field Visit",
      "timeIn": "2026-06-23T20:28:36Z",
      "timeOut": "2026-06-24T01:16:36Z"
    },
    {
      "id": "REC-15",
      "staffName": "Bola Abiodun",
      "destination": "Oshodi Yard",
      "purpose": "Field Visit",
      "timeIn": "2026-06-22T20:28:36Z",
      "timeOut": "2026-06-23T01:16:36Z"
    },
    {
      "id": "REC-16",
      "staffName": "Amina Olawale",
      "destination": "Apapa Depot",
      "purpose": "Field Visit",
      "timeIn": "2026-06-21T20:28:36Z",
      "timeOut": "2026-06-22T01:16:36Z"
    },
    {
      "id": "REC-17",
      "staffName": "Kemi Balogun",
      "destination": "Ikeja Hub",
      "purpose": "Field Visit",
      "timeIn": "2026-06-20T20:28:36Z",
      "timeOut": "2026-06-21T01:16:36Z"
    },
    {
      "id": "REC-18",
      "staffName": "Kemi Okafor",
      "destination": "Kano Silo",
      "purpose": "Field Visit",
      "timeIn": "2026-06-19T20:28:36Z",
      "timeOut": "2026-06-20T01:16:36Z"
    },
    {
      "id": "REC-19",
      "staffName": "Ngozi Okeke",
      "destination": "Port Harcourt Hub",
      "purpose": "Field Visit",
      "timeIn": "2026-06-18T20:28:36Z",
      "timeOut": "2026-06-19T01:16:36Z"
    },
    {
      "id": "REC-20",
      "staffName": "Kemi Olawale",
      "destination": "Ibadan Center",
      "purpose": "Field Visit",
      "timeIn": "2026-06-17T20:28:36Z",
      "timeOut": "2026-06-18T01:16:36Z"
    }
  ],
  "staffAttendance": [
    {
      "id": "REC-1",
      "name": "Musa Ogunleye",
      "department": "Warehouse",
      "timeIn": "2026-07-06T20:28:36Z",
      "timeOut": "2026-07-07T06:04:36Z"
    },
    {
      "id": "REC-2",
      "name": "Ngozi Okafor",
      "department": "Security",
      "timeIn": "2026-07-05T20:28:36Z",
      "timeOut": "2026-07-06T06:04:36Z"
    },
    {
      "id": "REC-3",
      "name": "Yusuf Eze",
      "department": "Logistics",
      "timeIn": "2026-07-04T20:28:36Z",
      "timeOut": "2026-07-05T06:04:36Z"
    },
    {
      "id": "REC-4",
      "name": "Ngozi Danfulani",
      "department": "Warehouse",
      "timeIn": "2026-07-03T20:28:36Z",
      "timeOut": "2026-07-04T06:04:36Z"
    },
    {
      "id": "REC-5",
      "name": "Oluwaseun Nwosu",
      "department": "Logistics",
      "timeIn": "2026-07-02T20:28:36Z",
      "timeOut": "2026-07-03T06:04:36Z"
    },
    {
      "id": "REC-6",
      "name": "Babajide Okafor",
      "department": "Logistics",
      "timeIn": "2026-07-01T20:28:36Z",
      "timeOut": "2026-07-02T06:04:36Z"
    },
    {
      "id": "REC-7",
      "name": "Ngozi Mustapha",
      "department": "Warehouse",
      "timeIn": "2026-06-30T20:28:36Z",
      "timeOut": "2026-07-01T06:04:36Z"
    },
    {
      "id": "REC-8",
      "name": "Kemi Lawal",
      "department": "Logistics",
      "timeIn": "2026-06-29T20:28:36Z",
      "timeOut": "2026-06-30T06:04:36Z"
    },
    {
      "id": "REC-9",
      "name": "Fatima Eze",
      "department": "Logistics",
      "timeIn": "2026-06-28T20:28:36Z",
      "timeOut": "2026-06-29T06:04:36Z"
    },
    {
      "id": "REC-10",
      "name": "Ibrahim Okafor",
      "department": "Warehouse",
      "timeIn": "2026-06-27T20:28:36Z",
      "timeOut": "2026-06-28T06:04:36Z"
    },
    {
      "id": "REC-11",
      "name": "Ade Okeke",
      "department": "Warehouse",
      "timeIn": "2026-06-26T20:28:36Z",
      "timeOut": "2026-06-27T06:04:36Z"
    },
    {
      "id": "REC-12",
      "name": "Chinedu Bello",
      "department": "Warehouse",
      "timeIn": "2026-06-25T20:28:36Z",
      "timeOut": "2026-06-26T06:04:36Z"
    },
    {
      "id": "REC-13",
      "name": "Emeka Aliyu",
      "department": "Logistics",
      "timeIn": "2026-06-24T20:28:36Z",
      "timeOut": "2026-06-25T06:04:36Z"
    },
    {
      "id": "REC-14",
      "name": "Emeka Balogun",
      "department": "Warehouse",
      "timeIn": "2026-06-23T20:28:36Z",
      "timeOut": "2026-06-24T06:04:36Z"
    },
    {
      "id": "REC-15",
      "name": "Bola Danfulani",
      "department": "Security",
      "timeIn": "2026-06-22T20:28:36Z",
      "timeOut": "2026-06-23T06:04:36Z"
    },
    {
      "id": "REC-16",
      "name": "Fatima Olawale",
      "department": "Logistics",
      "timeIn": "2026-06-21T20:28:36Z",
      "timeOut": "2026-06-22T06:04:36Z"
    },
    {
      "id": "REC-17",
      "name": "Bola Lawal",
      "department": "Warehouse",
      "timeIn": "2026-06-20T20:28:36Z",
      "timeOut": "2026-06-21T06:04:36Z"
    },
    {
      "id": "REC-18",
      "name": "Ibrahim Olawale",
      "department": "Security",
      "timeIn": "2026-06-19T20:28:36Z",
      "timeOut": "2026-06-20T06:04:36Z"
    },
    {
      "id": "REC-19",
      "name": "Abubakar Mustapha",
      "department": "Logistics",
      "timeIn": "2026-06-18T20:28:36Z",
      "timeOut": "2026-06-19T06:04:36Z"
    },
    {
      "id": "REC-20",
      "name": "Ade Lawal",
      "department": "Logistics",
      "timeIn": "2026-06-17T20:28:36Z",
      "timeOut": "2026-06-18T06:04:36Z"
    }
  ],
  "grn": [
    {
      "id": "REC-1",
      "grainType": "SoyaBeans",
      "noOfBagsReceived": 419,
      "netWeight": 21199,
      "binCardRef": "BC-615",
      "date": "2026-07-06"
    },
    {
      "id": "REC-2",
      "grainType": "SoyaBeans",
      "noOfBagsReceived": 513,
      "netWeight": 29453,
      "binCardRef": "BC-494",
      "date": "2026-07-05"
    },
    {
      "id": "REC-3",
      "grainType": "Sorghum",
      "noOfBagsReceived": 320,
      "netWeight": 24486,
      "binCardRef": "BC-223",
      "date": "2026-07-04"
    },
    {
      "id": "REC-4",
      "grainType": "Sorghum",
      "noOfBagsReceived": 480,
      "netWeight": 13021,
      "binCardRef": "BC-673",
      "date": "2026-07-03"
    },
    {
      "id": "REC-5",
      "grainType": "SoyaBeans",
      "noOfBagsReceived": 524,
      "netWeight": 23436,
      "binCardRef": "BC-724",
      "date": "2026-07-02"
    },
    {
      "id": "REC-6",
      "grainType": "SoyaBeans",
      "noOfBagsReceived": 398,
      "netWeight": 20972,
      "binCardRef": "BC-474",
      "date": "2026-07-01"
    },
    {
      "id": "REC-7",
      "grainType": "Sorghum",
      "noOfBagsReceived": 118,
      "netWeight": 10133,
      "binCardRef": "BC-614",
      "date": "2026-06-30"
    },
    {
      "id": "REC-8",
      "grainType": "Maize",
      "noOfBagsReceived": 564,
      "netWeight": 10362,
      "binCardRef": "BC-942",
      "date": "2026-06-29"
    },
    {
      "id": "REC-9",
      "grainType": "SoyaBeans",
      "noOfBagsReceived": 309,
      "netWeight": 11197,
      "binCardRef": "BC-605",
      "date": "2026-06-28"
    },
    {
      "id": "REC-10",
      "grainType": "Maize",
      "noOfBagsReceived": 321,
      "netWeight": 24066,
      "binCardRef": "BC-871",
      "date": "2026-06-27"
    },
    {
      "id": "REC-11",
      "grainType": "Sorghum",
      "noOfBagsReceived": 109,
      "netWeight": 20402,
      "binCardRef": "BC-658",
      "date": "2026-06-26"
    },
    {
      "id": "REC-12",
      "grainType": "Sorghum",
      "noOfBagsReceived": 302,
      "netWeight": 14339,
      "binCardRef": "BC-555",
      "date": "2026-06-25"
    },
    {
      "id": "REC-13",
      "grainType": "Sorghum",
      "noOfBagsReceived": 269,
      "netWeight": 19642,
      "binCardRef": "BC-397",
      "date": "2026-06-24"
    },
    {
      "id": "REC-14",
      "grainType": "Maize",
      "noOfBagsReceived": 122,
      "netWeight": 20964,
      "binCardRef": "BC-693",
      "date": "2026-06-23"
    },
    {
      "id": "REC-15",
      "grainType": "SoyaBeans",
      "noOfBagsReceived": 344,
      "netWeight": 14169,
      "binCardRef": "BC-919",
      "date": "2026-06-22"
    },
    {
      "id": "REC-16",
      "grainType": "Sorghum",
      "noOfBagsReceived": 376,
      "netWeight": 12483,
      "binCardRef": "BC-266",
      "date": "2026-06-21"
    },
    {
      "id": "REC-17",
      "grainType": "SoyaBeans",
      "noOfBagsReceived": 305,
      "netWeight": 17321,
      "binCardRef": "BC-109",
      "date": "2026-06-20"
    },
    {
      "id": "REC-18",
      "grainType": "Maize",
      "noOfBagsReceived": 590,
      "netWeight": 15806,
      "binCardRef": "BC-962",
      "date": "2026-06-19"
    },
    {
      "id": "REC-19",
      "grainType": "Maize",
      "noOfBagsReceived": 458,
      "netWeight": 28196,
      "binCardRef": "BC-993",
      "date": "2026-06-18"
    },
    {
      "id": "REC-20",
      "grainType": "Sorghum",
      "noOfBagsReceived": 240,
      "netWeight": 22845,
      "binCardRef": "BC-352",
      "date": "2026-06-17"
    }
  ],
  "binCard": [
    {
      "id": "REC-1",
      "grainType": "SoyaBeans",
      "date": "2026-07-06",
      "qtyIn": 12397,
      "qtyOut": 336,
      "balance": 189785,
      "reference": "REF-1"
    },
    {
      "id": "REC-2",
      "grainType": "SoyaBeans",
      "date": "2026-07-05",
      "qtyIn": 18149,
      "qtyOut": 1994,
      "balance": 93726,
      "reference": "REF-2"
    },
    {
      "id": "REC-3",
      "grainType": "Sorghum",
      "date": "2026-07-04",
      "qtyIn": 16109,
      "qtyOut": 985,
      "balance": 136484,
      "reference": "REF-3"
    },
    {
      "id": "REC-4",
      "grainType": "Sorghum",
      "date": "2026-07-03",
      "qtyIn": 23933,
      "qtyOut": 2687,
      "balance": 157791,
      "reference": "REF-4"
    },
    {
      "id": "REC-5",
      "grainType": "SoyaBeans",
      "date": "2026-07-02",
      "qtyIn": 25840,
      "qtyOut": 4382,
      "balance": 129339,
      "reference": "REF-5"
    },
    {
      "id": "REC-6",
      "grainType": "SoyaBeans",
      "date": "2026-07-01",
      "qtyIn": 21859,
      "qtyOut": 1391,
      "balance": 64163,
      "reference": "REF-6"
    },
    {
      "id": "REC-7",
      "grainType": "Sorghum",
      "date": "2026-06-30",
      "qtyIn": 21637,
      "qtyOut": 2295,
      "balance": 147942,
      "reference": "REF-7"
    },
    {
      "id": "REC-8",
      "grainType": "Maize",
      "date": "2026-06-29",
      "qtyIn": 13869,
      "qtyOut": 1440,
      "balance": 69081,
      "reference": "REF-8"
    },
    {
      "id": "REC-9",
      "grainType": "SoyaBeans",
      "date": "2026-06-28",
      "qtyIn": 20923,
      "qtyOut": 1601,
      "balance": 113526,
      "reference": "REF-9"
    },
    {
      "id": "REC-10",
      "grainType": "Maize",
      "date": "2026-06-27",
      "qtyIn": 28977,
      "qtyOut": 2808,
      "balance": 50222,
      "reference": "REF-10"
    },
    {
      "id": "REC-11",
      "grainType": "Sorghum",
      "date": "2026-06-26",
      "qtyIn": 26994,
      "qtyOut": 304,
      "balance": 93768,
      "reference": "REF-11"
    },
    {
      "id": "REC-12",
      "grainType": "Sorghum",
      "date": "2026-06-25",
      "qtyIn": 27877,
      "qtyOut": 1957,
      "balance": 194913,
      "reference": "REF-12"
    },
    {
      "id": "REC-13",
      "grainType": "Sorghum",
      "date": "2026-06-24",
      "qtyIn": 17178,
      "qtyOut": 4953,
      "balance": 66856,
      "reference": "REF-13"
    },
    {
      "id": "REC-14",
      "grainType": "Maize",
      "date": "2026-06-23",
      "qtyIn": 25849,
      "qtyOut": 2679,
      "balance": 102650,
      "reference": "REF-14"
    },
    {
      "id": "REC-15",
      "grainType": "SoyaBeans",
      "date": "2026-06-22",
      "qtyIn": 21665,
      "qtyOut": 2916,
      "balance": 142635,
      "reference": "REF-15"
    },
    {
      "id": "REC-16",
      "grainType": "Sorghum",
      "date": "2026-06-21",
      "qtyIn": 23822,
      "qtyOut": 2592,
      "balance": 55841,
      "reference": "REF-16"
    },
    {
      "id": "REC-17",
      "grainType": "SoyaBeans",
      "date": "2026-06-20",
      "qtyIn": 12983,
      "qtyOut": 1802,
      "balance": 124340,
      "reference": "REF-17"
    },
    {
      "id": "REC-18",
      "grainType": "Maize",
      "date": "2026-06-19",
      "qtyIn": 12668,
      "qtyOut": 2796,
      "balance": 136662,
      "reference": "REF-18"
    },
    {
      "id": "REC-19",
      "grainType": "Maize",
      "date": "2026-06-18",
      "qtyIn": 15555,
      "qtyOut": 978,
      "balance": 108498,
      "reference": "REF-19"
    },
    {
      "id": "REC-20",
      "grainType": "Sorghum",
      "date": "2026-06-17",
      "qtyIn": 17054,
      "qtyOut": 3901,
      "balance": 174930,
      "reference": "REF-20"
    }
  ],
  "trucks": [
    {
      "id": "REC-1",
      "truckNo": "KJA-597XA",
      "capacity": 45000,
      "status": "idle",
      "assignedDriver": "Bola Ogunleye"
    },
    {
      "id": "REC-2",
      "truckNo": "KJA-400XA",
      "capacity": 45000,
      "status": "idle",
      "assignedDriver": "Kemi Okafor"
    },
    {
      "id": "REC-3",
      "truckNo": "KJA-755XA",
      "capacity": 45000,
      "status": "maintenance",
      "assignedDriver": "Yusuf Eze"
    },
    {
      "id": "REC-4",
      "truckNo": "KJA-164XA",
      "capacity": 45000,
      "status": "maintenance",
      "assignedDriver": "Chinedu Olawale"
    },
    {
      "id": "REC-5",
      "truckNo": "KJA-519XA",
      "capacity": 45000,
      "status": "idle",
      "assignedDriver": "Yusuf Adeyemi"
    },
    {
      "id": "REC-6",
      "truckNo": "KJA-525XA",
      "capacity": 45000,
      "status": "idle",
      "assignedDriver": "Fatima Olawale"
    },
    {
      "id": "REC-7",
      "truckNo": "KJA-872XA",
      "capacity": 45000,
      "status": "idle",
      "assignedDriver": "Ibrahim Balogun"
    },
    {
      "id": "REC-8",
      "truckNo": "KJA-354XA",
      "capacity": 45000,
      "status": "in-transit",
      "assignedDriver": "Chioma Adeyemi"
    },
    {
      "id": "REC-9",
      "truckNo": "KJA-977XA",
      "capacity": 45000,
      "status": "maintenance",
      "assignedDriver": "Fatima Olawale"
    },
    {
      "id": "REC-10",
      "truckNo": "KJA-689XA",
      "capacity": 45000,
      "status": "maintenance",
      "assignedDriver": "Ade Lawal"
    },
    {
      "id": "REC-11",
      "truckNo": "KJA-640XA",
      "capacity": 45000,
      "status": "in-transit",
      "assignedDriver": "Musa Bello"
    },
    {
      "id": "REC-12",
      "truckNo": "KJA-827XA",
      "capacity": 45000,
      "status": "in-transit",
      "assignedDriver": "Yusuf Okeke"
    },
    {
      "id": "REC-13",
      "truckNo": "KJA-213XA",
      "capacity": 45000,
      "status": "in-transit",
      "assignedDriver": "Ngozi Adeyemi"
    },
    {
      "id": "REC-14",
      "truckNo": "KJA-999XA",
      "capacity": 45000,
      "status": "maintenance",
      "assignedDriver": "Yusuf Olawale"
    },
    {
      "id": "REC-15",
      "truckNo": "KJA-362XA",
      "capacity": 45000,
      "status": "idle",
      "assignedDriver": "Ade Balogun"
    },
    {
      "id": "REC-16",
      "truckNo": "KJA-151XA",
      "capacity": 45000,
      "status": "in-transit",
      "assignedDriver": "Kemi Aliyu"
    },
    {
      "id": "REC-17",
      "truckNo": "KJA-516XA",
      "capacity": 45000,
      "status": "maintenance",
      "assignedDriver": "Fatima Olawale"
    },
    {
      "id": "REC-18",
      "truckNo": "KJA-228XA",
      "capacity": 45000,
      "status": "idle",
      "assignedDriver": "Bola Okeke"
    },
    {
      "id": "REC-19",
      "truckNo": "KJA-825XA",
      "capacity": 45000,
      "status": "maintenance",
      "assignedDriver": "Chinedu Okeke"
    },
    {
      "id": "REC-20",
      "truckNo": "KJA-268XA",
      "capacity": 45000,
      "status": "idle",
      "assignedDriver": "Ibrahim Lawal"
    }
  ],
  "trips": [
    {
      "id": "REC-1",
      "truckNo": "KJA-597XA",
      "driverName": "Bola Ogunleye",
      "origin": "Oshodi Yard",
      "destination": "Greenville LNG",
      "status": "pending",
      "etaOrCompletedAt": "2026-07-08",
      "continentalWaybillNo": "CW-1",
      "lbWaybillNo": "LB-1",
      "gatePassNo": "GP-1"
    },
    {
      "id": "REC-2",
      "truckNo": "KJA-400XA",
      "driverName": "Kemi Okafor",
      "origin": "Lekki Port",
      "destination": "Kano Silo",
      "status": "pending",
      "etaOrCompletedAt": "2026-07-07",
      "continentalWaybillNo": "CW-2",
      "lbWaybillNo": "LB-2",
      "gatePassNo": "GP-2"
    },
    {
      "id": "REC-3",
      "truckNo": "KJA-755XA",
      "driverName": "Yusuf Eze",
      "origin": "Apapa Depot",
      "destination": "Kano Silo",
      "status": "delivered",
      "etaOrCompletedAt": "2026-07-06",
      "continentalWaybillNo": "CW-3",
      "lbWaybillNo": "LB-3",
      "gatePassNo": "GP-3"
    },
    {
      "id": "REC-4",
      "truckNo": "KJA-164XA",
      "driverName": "Chinedu Olawale",
      "origin": "Ikeja Hub",
      "destination": "Kano Silo",
      "status": "in-transit",
      "etaOrCompletedAt": "2026-07-05",
      "continentalWaybillNo": "CW-4",
      "lbWaybillNo": "LB-4",
      "gatePassNo": "GP-4"
    },
    {
      "id": "REC-5",
      "truckNo": "KJA-519XA",
      "driverName": "Yusuf Adeyemi",
      "origin": "Kano Silo",
      "destination": "Oshodi Yard",
      "status": "in-transit",
      "etaOrCompletedAt": "2026-07-04",
      "continentalWaybillNo": "CW-5",
      "lbWaybillNo": "LB-5",
      "gatePassNo": "GP-5"
    },
    {
      "id": "REC-6",
      "truckNo": "KJA-525XA",
      "driverName": "Fatima Olawale",
      "origin": "Greenville LNG",
      "destination": "Apapa Depot",
      "status": "delivered",
      "etaOrCompletedAt": "2026-07-03",
      "continentalWaybillNo": "CW-6",
      "lbWaybillNo": "LB-6",
      "gatePassNo": "GP-6"
    },
    {
      "id": "REC-7",
      "truckNo": "KJA-872XA",
      "driverName": "Ibrahim Balogun",
      "origin": "Ibadan Center",
      "destination": "Ikeja Hub",
      "status": "delivered",
      "etaOrCompletedAt": "2026-07-02",
      "continentalWaybillNo": "CW-7",
      "lbWaybillNo": "LB-7",
      "gatePassNo": "GP-7"
    },
    {
      "id": "REC-8",
      "truckNo": "KJA-354XA",
      "driverName": "Chioma Adeyemi",
      "origin": "Ibadan Center",
      "destination": "Kaduna Plant",
      "status": "in-transit",
      "etaOrCompletedAt": "2026-07-01",
      "continentalWaybillNo": "CW-8",
      "lbWaybillNo": "LB-8",
      "gatePassNo": "GP-8"
    },
    {
      "id": "REC-9",
      "truckNo": "KJA-977XA",
      "driverName": "Fatima Olawale",
      "origin": "Kaduna Plant",
      "destination": "Kaduna Plant",
      "status": "in-transit",
      "etaOrCompletedAt": "2026-06-30",
      "continentalWaybillNo": "CW-9",
      "lbWaybillNo": "LB-9",
      "gatePassNo": "GP-9"
    },
    {
      "id": "REC-10",
      "truckNo": "KJA-689XA",
      "driverName": "Ade Lawal",
      "origin": "Ikeja Hub",
      "destination": "Lekki Port",
      "status": "delivered",
      "etaOrCompletedAt": "2026-06-29",
      "continentalWaybillNo": "CW-10",
      "lbWaybillNo": "LB-10",
      "gatePassNo": "GP-10"
    },
    {
      "id": "REC-11",
      "truckNo": "KJA-640XA",
      "driverName": "Musa Bello",
      "origin": "Ikeja Hub",
      "destination": "Lekki Port",
      "status": "pending",
      "etaOrCompletedAt": "2026-06-28",
      "continentalWaybillNo": "CW-11",
      "lbWaybillNo": "LB-11",
      "gatePassNo": "GP-11"
    },
    {
      "id": "REC-12",
      "truckNo": "KJA-827XA",
      "driverName": "Yusuf Okeke",
      "origin": "Port Harcourt Hub",
      "destination": "Greenville LNG",
      "status": "in-transit",
      "etaOrCompletedAt": "2026-06-27",
      "continentalWaybillNo": "CW-12",
      "lbWaybillNo": "LB-12",
      "gatePassNo": "GP-12"
    },
    {
      "id": "REC-13",
      "truckNo": "KJA-213XA",
      "driverName": "Ngozi Adeyemi",
      "origin": "Kano Silo",
      "destination": "Port Harcourt Hub",
      "status": "pending",
      "etaOrCompletedAt": "2026-06-26",
      "continentalWaybillNo": "CW-13",
      "lbWaybillNo": "LB-13",
      "gatePassNo": "GP-13"
    },
    {
      "id": "REC-14",
      "truckNo": "KJA-999XA",
      "driverName": "Yusuf Olawale",
      "origin": "Port Harcourt Hub",
      "destination": "Greenville LNG",
      "status": "pending",
      "etaOrCompletedAt": "2026-06-25",
      "continentalWaybillNo": "CW-14",
      "lbWaybillNo": "LB-14",
      "gatePassNo": "GP-14"
    },
    {
      "id": "REC-15",
      "truckNo": "KJA-362XA",
      "driverName": "Ade Balogun",
      "origin": "Kaduna Plant",
      "destination": "Ikeja Hub",
      "status": "delivered",
      "etaOrCompletedAt": "2026-06-24",
      "continentalWaybillNo": "CW-15",
      "lbWaybillNo": "LB-15",
      "gatePassNo": "GP-15"
    },
    {
      "id": "REC-16",
      "truckNo": "KJA-151XA",
      "driverName": "Kemi Aliyu",
      "origin": "Ikeja Hub",
      "destination": "Kano Silo",
      "status": "pending",
      "etaOrCompletedAt": "2026-06-23",
      "continentalWaybillNo": "CW-16",
      "lbWaybillNo": "LB-16",
      "gatePassNo": "GP-16"
    },
    {
      "id": "REC-17",
      "truckNo": "KJA-516XA",
      "driverName": "Fatima Olawale",
      "origin": "Ibadan Center",
      "destination": "Lekki Port",
      "status": "pending",
      "etaOrCompletedAt": "2026-06-22",
      "continentalWaybillNo": "CW-17",
      "lbWaybillNo": "LB-17",
      "gatePassNo": "GP-17"
    },
    {
      "id": "REC-18",
      "truckNo": "KJA-228XA",
      "driverName": "Bola Okeke",
      "origin": "Ikeja Hub",
      "destination": "Ikeja Hub",
      "status": "in-transit",
      "etaOrCompletedAt": "2026-06-21",
      "continentalWaybillNo": "CW-18",
      "lbWaybillNo": "LB-18",
      "gatePassNo": "GP-18"
    },
    {
      "id": "REC-19",
      "truckNo": "KJA-825XA",
      "driverName": "Chinedu Okeke",
      "origin": "Greenville LNG",
      "destination": "Greenville LNG",
      "status": "pending",
      "etaOrCompletedAt": "2026-06-20",
      "continentalWaybillNo": "CW-19",
      "lbWaybillNo": "LB-19",
      "gatePassNo": "GP-19"
    },
    {
      "id": "REC-20",
      "truckNo": "KJA-268XA",
      "driverName": "Ibrahim Lawal",
      "origin": "Greenville LNG",
      "destination": "Port Harcourt Hub",
      "status": "in-transit",
      "etaOrCompletedAt": "2026-06-19",
      "continentalWaybillNo": "CW-20",
      "lbWaybillNo": "LB-20",
      "gatePassNo": "GP-20"
    }
  ],
  "supplierPayments": [
    {
      "id": "REC-1",
      "supplierName": "Yusuf Mustapha Farms",
      "linkedSuppliersRecordId": "REC-1",
      "amountOwed": 4521487,
      "amountPaid": 1691046,
      "status": "pending",
      "date": "2026-07-06"
    },
    {
      "id": "REC-2",
      "supplierName": "Bola Danfulani Farms",
      "linkedSuppliersRecordId": "REC-2",
      "amountOwed": 3546299,
      "amountPaid": 1537234,
      "status": "pending",
      "date": "2026-07-05"
    },
    {
      "id": "REC-3",
      "supplierName": "Ade Adeyemi Farms",
      "linkedSuppliersRecordId": "REC-3",
      "amountOwed": 4597741,
      "amountPaid": 1006716,
      "status": "partial",
      "date": "2026-07-04"
    },
    {
      "id": "REC-4",
      "supplierName": "Bola Okafor Farms",
      "linkedSuppliersRecordId": "REC-4",
      "amountOwed": 1158365,
      "amountPaid": 1569627,
      "status": "partial",
      "date": "2026-07-03"
    },
    {
      "id": "REC-5",
      "supplierName": "Ade Ogunleye Farms",
      "linkedSuppliersRecordId": "REC-5",
      "amountOwed": 4570713,
      "amountPaid": 1933407,
      "status": "pending",
      "date": "2026-07-02"
    },
    {
      "id": "REC-6",
      "supplierName": "Kemi Danfulani Farms",
      "linkedSuppliersRecordId": "REC-6",
      "amountOwed": 1803291,
      "amountPaid": 3221142,
      "status": "pending",
      "date": "2026-07-01"
    },
    {
      "id": "REC-7",
      "supplierName": "Chinedu Nwosu Farms",
      "linkedSuppliersRecordId": "REC-7",
      "amountOwed": 4798085,
      "amountPaid": 2269553,
      "status": "pending",
      "date": "2026-06-30"
    },
    {
      "id": "REC-8",
      "supplierName": "Abubakar Okafor Farms",
      "linkedSuppliersRecordId": "REC-8",
      "amountOwed": 2121635,
      "amountPaid": 4125434,
      "status": "paid",
      "date": "2026-06-29"
    },
    {
      "id": "REC-9",
      "supplierName": "Oluwaseun Nwosu Farms",
      "linkedSuppliersRecordId": "REC-9",
      "amountOwed": 4151418,
      "amountPaid": 3520994,
      "status": "partial",
      "date": "2026-06-28"
    },
    {
      "id": "REC-10",
      "supplierName": "Ngozi Adeyemi Farms",
      "linkedSuppliersRecordId": "REC-10",
      "amountOwed": 3311994,
      "amountPaid": 1575439,
      "status": "pending",
      "date": "2026-06-27"
    },
    {
      "id": "REC-11",
      "supplierName": "Kemi Aliyu Farms",
      "linkedSuppliersRecordId": "REC-11",
      "amountOwed": 2018783,
      "amountPaid": 2334254,
      "status": "paid",
      "date": "2026-06-26"
    },
    {
      "id": "REC-12",
      "supplierName": "Emeka Mustapha Farms",
      "linkedSuppliersRecordId": "REC-12",
      "amountOwed": 4870523,
      "amountPaid": 4133179,
      "status": "pending",
      "date": "2026-06-25"
    },
    {
      "id": "REC-13",
      "supplierName": "Ade Okeke Farms",
      "linkedSuppliersRecordId": "REC-13",
      "amountOwed": 1300375,
      "amountPaid": 719696,
      "status": "partial",
      "date": "2026-06-24"
    },
    {
      "id": "REC-14",
      "supplierName": "Babajide Lawal Farms",
      "linkedSuppliersRecordId": "REC-14",
      "amountOwed": 1138463,
      "amountPaid": 1305357,
      "status": "pending",
      "date": "2026-06-23"
    },
    {
      "id": "REC-15",
      "supplierName": "Oluwaseun Olawale Farms",
      "linkedSuppliersRecordId": "REC-15",
      "amountOwed": 2462994,
      "amountPaid": 3328278,
      "status": "partial",
      "date": "2026-06-22"
    },
    {
      "id": "REC-16",
      "supplierName": "Abubakar Abiodun Farms",
      "linkedSuppliersRecordId": "REC-16",
      "amountOwed": 3449679,
      "amountPaid": 2478305,
      "status": "paid",
      "date": "2026-06-21"
    },
    {
      "id": "REC-17",
      "supplierName": "Emeka Lawal Farms",
      "linkedSuppliersRecordId": "REC-17",
      "amountOwed": 2150954,
      "amountPaid": 2156146,
      "status": "paid",
      "date": "2026-06-20"
    },
    {
      "id": "REC-18",
      "supplierName": "Ngozi Ogunleye Farms",
      "linkedSuppliersRecordId": "REC-18",
      "amountOwed": 3077799,
      "amountPaid": 3541258,
      "status": "paid",
      "date": "2026-06-19"
    },
    {
      "id": "REC-19",
      "supplierName": "Ibrahim Aliyu Farms",
      "linkedSuppliersRecordId": "REC-19",
      "amountOwed": 2928923,
      "amountPaid": 4554223,
      "status": "paid",
      "date": "2026-06-18"
    },
    {
      "id": "REC-20",
      "supplierName": "Amina Mustapha Farms",
      "linkedSuppliersRecordId": "REC-20",
      "amountOwed": 1904694,
      "amountPaid": 4215028,
      "status": "pending",
      "date": "2026-06-17"
    }
  ],
  "sales": [
    {
      "id": "REC-1",
      "linkedDispatchRecordId": "DISP-1",
      "transporterName": "Yusuf Mustapha Farms",
      "amount": 9157344,
      "date": "2026-07-06"
    },
    {
      "id": "REC-2",
      "linkedDispatchRecordId": "DISP-2",
      "transporterName": "Bola Danfulani Farms",
      "amount": 6008585,
      "date": "2026-07-05"
    },
    {
      "id": "REC-3",
      "linkedDispatchRecordId": "DISP-3",
      "transporterName": "Ade Adeyemi Farms",
      "amount": 5874594,
      "date": "2026-07-04"
    },
    {
      "id": "REC-4",
      "linkedDispatchRecordId": "DISP-4",
      "transporterName": "Bola Okafor Farms",
      "amount": 5654314,
      "date": "2026-07-03"
    },
    {
      "id": "REC-5",
      "linkedDispatchRecordId": "DISP-5",
      "transporterName": "Ade Ogunleye Farms",
      "amount": 2026591,
      "date": "2026-07-02"
    },
    {
      "id": "REC-6",
      "linkedDispatchRecordId": "DISP-6",
      "transporterName": "Kemi Danfulani Farms",
      "amount": 7580499,
      "date": "2026-07-01"
    },
    {
      "id": "REC-7",
      "linkedDispatchRecordId": "DISP-7",
      "transporterName": "Chinedu Nwosu Farms",
      "amount": 8198399,
      "date": "2026-06-30"
    },
    {
      "id": "REC-8",
      "linkedDispatchRecordId": "DISP-8",
      "transporterName": "Abubakar Okafor Farms",
      "amount": 4187728,
      "date": "2026-06-29"
    },
    {
      "id": "REC-9",
      "linkedDispatchRecordId": "DISP-9",
      "transporterName": "Oluwaseun Nwosu Farms",
      "amount": 2721422,
      "date": "2026-06-28"
    },
    {
      "id": "REC-10",
      "linkedDispatchRecordId": "DISP-10",
      "transporterName": "Ngozi Adeyemi Farms",
      "amount": 9758057,
      "date": "2026-06-27"
    },
    {
      "id": "REC-11",
      "linkedDispatchRecordId": "DISP-11",
      "transporterName": "Kemi Aliyu Farms",
      "amount": 7368397,
      "date": "2026-06-26"
    },
    {
      "id": "REC-12",
      "linkedDispatchRecordId": "DISP-12",
      "transporterName": "Emeka Mustapha Farms",
      "amount": 2757654,
      "date": "2026-06-25"
    },
    {
      "id": "REC-13",
      "linkedDispatchRecordId": "DISP-13",
      "transporterName": "Ade Okeke Farms",
      "amount": 7524220,
      "date": "2026-06-24"
    },
    {
      "id": "REC-14",
      "linkedDispatchRecordId": "DISP-14",
      "transporterName": "Babajide Lawal Farms",
      "amount": 4976847,
      "date": "2026-06-23"
    },
    {
      "id": "REC-15",
      "linkedDispatchRecordId": "DISP-15",
      "transporterName": "Oluwaseun Olawale Farms",
      "amount": 5931289,
      "date": "2026-06-22"
    },
    {
      "id": "REC-16",
      "linkedDispatchRecordId": "DISP-16",
      "transporterName": "Abubakar Abiodun Farms",
      "amount": 3073958,
      "date": "2026-06-21"
    },
    {
      "id": "REC-17",
      "linkedDispatchRecordId": "DISP-17",
      "transporterName": "Emeka Lawal Farms",
      "amount": 9212675,
      "date": "2026-06-20"
    },
    {
      "id": "REC-18",
      "linkedDispatchRecordId": "DISP-18",
      "transporterName": "Ngozi Ogunleye Farms",
      "amount": 9022119,
      "date": "2026-06-19"
    },
    {
      "id": "REC-19",
      "linkedDispatchRecordId": "DISP-19",
      "transporterName": "Ibrahim Aliyu Farms",
      "amount": 8135277,
      "date": "2026-06-18"
    },
    {
      "id": "REC-20",
      "linkedDispatchRecordId": "DISP-20",
      "transporterName": "Amina Mustapha Farms",
      "amount": 6051747,
      "date": "2026-06-17"
    }
  ],
  "payroll": [
    {
      "id": "REC-1",
      "staffName": "Emeka Bello",
      "department": "Security",
      "daysPresent": 15,
      "amount": 179175,
      "period": "2026-06"
    },
    {
      "id": "REC-2",
      "staffName": "Amina Bello",
      "department": "Warehouse",
      "daysPresent": 22,
      "amount": 189235,
      "period": "2026-06"
    },
    {
      "id": "REC-3",
      "staffName": "Chioma Aliyu",
      "department": "Finance",
      "daysPresent": 17,
      "amount": 143960,
      "period": "2026-06"
    },
    {
      "id": "REC-4",
      "staffName": "Emeka Okeke",
      "department": "Finance",
      "daysPresent": 19,
      "amount": 182900,
      "period": "2026-06"
    },
    {
      "id": "REC-5",
      "staffName": "Fatima Adeyemi",
      "department": "Security",
      "daysPresent": 21,
      "amount": 145355,
      "period": "2026-06"
    },
    {
      "id": "REC-6",
      "staffName": "Babajide Okeke",
      "department": "Finance",
      "daysPresent": 21,
      "amount": 245952,
      "period": "2026-06"
    },
    {
      "id": "REC-7",
      "staffName": "Chinedu Danfulani",
      "department": "Logistics",
      "daysPresent": 18,
      "amount": 313691,
      "period": "2026-06"
    },
    {
      "id": "REC-8",
      "staffName": "Ngozi Olawale",
      "department": "Logistics",
      "daysPresent": 18,
      "amount": 209187,
      "period": "2026-06"
    },
    {
      "id": "REC-9",
      "staffName": "Ibrahim Okeke",
      "department": "Finance",
      "daysPresent": 18,
      "amount": 327429,
      "period": "2026-06"
    },
    {
      "id": "REC-10",
      "staffName": "Babajide Danfulani",
      "department": "Warehouse",
      "daysPresent": 22,
      "amount": 325007,
      "period": "2026-06"
    },
    {
      "id": "REC-11",
      "staffName": "Chioma Eze",
      "department": "Security",
      "daysPresent": 22,
      "amount": 253859,
      "period": "2026-06"
    },
    {
      "id": "REC-12",
      "staffName": "Musa Bello",
      "department": "Logistics",
      "daysPresent": 20,
      "amount": 173898,
      "period": "2026-06"
    },
    {
      "id": "REC-13",
      "staffName": "Chioma Mustapha",
      "department": "Security",
      "daysPresent": 17,
      "amount": 292732,
      "period": "2026-06"
    },
    {
      "id": "REC-14",
      "staffName": "Babajide Olawale",
      "department": "Finance",
      "daysPresent": 16,
      "amount": 255111,
      "period": "2026-06"
    },
    {
      "id": "REC-15",
      "staffName": "Chioma Abiodun",
      "department": "Security",
      "daysPresent": 20,
      "amount": 277139,
      "period": "2026-06"
    },
    {
      "id": "REC-16",
      "staffName": "Bola Balogun",
      "department": "Security",
      "daysPresent": 19,
      "amount": 219047,
      "period": "2026-06"
    },
    {
      "id": "REC-17",
      "staffName": "Fatima Ogunleye",
      "department": "Logistics",
      "daysPresent": 22,
      "amount": 240721,
      "period": "2026-06"
    },
    {
      "id": "REC-18",
      "staffName": "Abubakar Mustapha",
      "department": "Security",
      "daysPresent": 16,
      "amount": 261093,
      "period": "2026-06"
    },
    {
      "id": "REC-19",
      "staffName": "Bola Eze",
      "department": "Warehouse",
      "daysPresent": 22,
      "amount": 251146,
      "period": "2026-06"
    },
    {
      "id": "REC-20",
      "staffName": "Abubakar Balogun",
      "department": "Security",
      "daysPresent": 19,
      "amount": 124809,
      "period": "2026-06"
    }
  ],
  "inventoryAlerts": [
    {
      "id": "REC-1",
      "grainType": "SoyaBeans",
      "currentQty": 2161,
      "thresholdQty": 10000,
      "status": "low",
      "lastUpdated": "2026-07-06T20:28:36Z"
    },
    {
      "id": "REC-2",
      "grainType": "SoyaBeans",
      "currentQty": 1085,
      "thresholdQty": 10000,
      "status": "ok",
      "lastUpdated": "2026-07-05T20:28:36Z"
    },
    {
      "id": "REC-3",
      "grainType": "Sorghum",
      "currentQty": 4481,
      "thresholdQty": 10000,
      "status": "low",
      "lastUpdated": "2026-07-04T20:28:36Z"
    },
    {
      "id": "REC-4",
      "grainType": "Sorghum",
      "currentQty": 1315,
      "thresholdQty": 10000,
      "status": "ok",
      "lastUpdated": "2026-07-03T20:28:36Z"
    },
    {
      "id": "REC-5",
      "grainType": "SoyaBeans",
      "currentQty": 1753,
      "thresholdQty": 10000,
      "status": "low",
      "lastUpdated": "2026-07-02T20:28:36Z"
    },
    {
      "id": "REC-6",
      "grainType": "SoyaBeans",
      "currentQty": 3695,
      "thresholdQty": 10000,
      "status": "ok",
      "lastUpdated": "2026-07-01T20:28:36Z"
    },
    {
      "id": "REC-7",
      "grainType": "Sorghum",
      "currentQty": 4132,
      "thresholdQty": 10000,
      "status": "ok",
      "lastUpdated": "2026-06-30T20:28:36Z"
    },
    {
      "id": "REC-8",
      "grainType": "Maize",
      "currentQty": 1588,
      "thresholdQty": 10000,
      "status": "low",
      "lastUpdated": "2026-06-29T20:28:36Z"
    },
    {
      "id": "REC-9",
      "grainType": "SoyaBeans",
      "currentQty": 4269,
      "thresholdQty": 10000,
      "status": "critical",
      "lastUpdated": "2026-06-28T20:28:36Z"
    },
    {
      "id": "REC-10",
      "grainType": "Maize",
      "currentQty": 4599,
      "thresholdQty": 10000,
      "status": "low",
      "lastUpdated": "2026-06-27T20:28:36Z"
    },
    {
      "id": "REC-11",
      "grainType": "Sorghum",
      "currentQty": 2894,
      "thresholdQty": 10000,
      "status": "low",
      "lastUpdated": "2026-06-26T20:28:36Z"
    },
    {
      "id": "REC-12",
      "grainType": "Sorghum",
      "currentQty": 2240,
      "thresholdQty": 10000,
      "status": "low",
      "lastUpdated": "2026-06-25T20:28:36Z"
    },
    {
      "id": "REC-13",
      "grainType": "Sorghum",
      "currentQty": 3934,
      "thresholdQty": 10000,
      "status": "critical",
      "lastUpdated": "2026-06-24T20:28:36Z"
    },
    {
      "id": "REC-14",
      "grainType": "Maize",
      "currentQty": 4937,
      "thresholdQty": 10000,
      "status": "ok",
      "lastUpdated": "2026-06-23T20:28:36Z"
    },
    {
      "id": "REC-15",
      "grainType": "SoyaBeans",
      "currentQty": 1911,
      "thresholdQty": 10000,
      "status": "critical",
      "lastUpdated": "2026-06-22T20:28:36Z"
    },
    {
      "id": "REC-16",
      "grainType": "Sorghum",
      "currentQty": 2135,
      "thresholdQty": 10000,
      "status": "low",
      "lastUpdated": "2026-06-21T20:28:36Z"
    },
    {
      "id": "REC-17",
      "grainType": "SoyaBeans",
      "currentQty": 2893,
      "thresholdQty": 10000,
      "status": "ok",
      "lastUpdated": "2026-06-20T20:28:36Z"
    },
    {
      "id": "REC-18",
      "grainType": "Maize",
      "currentQty": 1437,
      "thresholdQty": 10000,
      "status": "ok",
      "lastUpdated": "2026-06-19T20:28:36Z"
    },
    {
      "id": "REC-19",
      "grainType": "Maize",
      "currentQty": 4419,
      "thresholdQty": 10000,
      "status": "critical",
      "lastUpdated": "2026-06-18T20:28:36Z"
    },
    {
      "id": "REC-20",
      "grainType": "Sorghum",
      "currentQty": 4788,
      "thresholdQty": 10000,
      "status": "ok",
      "lastUpdated": "2026-06-17T20:28:36Z"
    }
  ],
  "waybills": [
    {
      "id": "REC-1",
      "continentalWaybillNo": "CW-1",
      "lbWaybillNo": "LB-1",
      "linkedTripId": "TRIP-1",
      "truckNo": "KJA-597XA",
      "destination": "Ikeja Hub",
      "dateIssued": "2026-07-06",
      "status": "active"
    },
    {
      "id": "REC-2",
      "continentalWaybillNo": "CW-2",
      "lbWaybillNo": "LB-2",
      "linkedTripId": "TRIP-2",
      "truckNo": "KJA-400XA",
      "destination": "Oshodi Yard",
      "dateIssued": "2026-07-05",
      "status": "closed"
    },
    {
      "id": "REC-3",
      "continentalWaybillNo": "CW-3",
      "lbWaybillNo": "LB-3",
      "linkedTripId": "TRIP-3",
      "truckNo": "KJA-755XA",
      "destination": "Greenville LNG",
      "dateIssued": "2026-07-04",
      "status": "active"
    },
    {
      "id": "REC-4",
      "continentalWaybillNo": "CW-4",
      "lbWaybillNo": "LB-4",
      "linkedTripId": "TRIP-4",
      "truckNo": "KJA-164XA",
      "destination": "Kano Silo",
      "dateIssued": "2026-07-03",
      "status": "closed"
    },
    {
      "id": "REC-5",
      "continentalWaybillNo": "CW-5",
      "lbWaybillNo": "LB-5",
      "linkedTripId": "TRIP-5",
      "truckNo": "KJA-519XA",
      "destination": "Apapa Depot",
      "dateIssued": "2026-07-02",
      "status": "closed"
    },
    {
      "id": "REC-6",
      "continentalWaybillNo": "CW-6",
      "lbWaybillNo": "LB-6",
      "linkedTripId": "TRIP-6",
      "truckNo": "KJA-525XA",
      "destination": "Kano Silo",
      "dateIssued": "2026-07-01",
      "status": "closed"
    },
    {
      "id": "REC-7",
      "continentalWaybillNo": "CW-7",
      "lbWaybillNo": "LB-7",
      "linkedTripId": "TRIP-7",
      "truckNo": "KJA-872XA",
      "destination": "Kano Silo",
      "dateIssued": "2026-06-30",
      "status": "active"
    },
    {
      "id": "REC-8",
      "continentalWaybillNo": "CW-8",
      "lbWaybillNo": "LB-8",
      "linkedTripId": "TRIP-8",
      "truckNo": "KJA-354XA",
      "destination": "Apapa Depot",
      "dateIssued": "2026-06-29",
      "status": "active"
    },
    {
      "id": "REC-9",
      "continentalWaybillNo": "CW-9",
      "lbWaybillNo": "LB-9",
      "linkedTripId": "TRIP-9",
      "truckNo": "KJA-977XA",
      "destination": "Port Harcourt Hub",
      "dateIssued": "2026-06-28",
      "status": "active"
    },
    {
      "id": "REC-10",
      "continentalWaybillNo": "CW-10",
      "lbWaybillNo": "LB-10",
      "linkedTripId": "TRIP-10",
      "truckNo": "KJA-689XA",
      "destination": "Ikeja Hub",
      "dateIssued": "2026-06-27",
      "status": "closed"
    },
    {
      "id": "REC-11",
      "continentalWaybillNo": "CW-11",
      "lbWaybillNo": "LB-11",
      "linkedTripId": "TRIP-11",
      "truckNo": "KJA-640XA",
      "destination": "Kano Silo",
      "dateIssued": "2026-06-26",
      "status": "active"
    },
    {
      "id": "REC-12",
      "continentalWaybillNo": "CW-12",
      "lbWaybillNo": "LB-12",
      "linkedTripId": "TRIP-12",
      "truckNo": "KJA-827XA",
      "destination": "Lekki Port",
      "dateIssued": "2026-06-25",
      "status": "active"
    },
    {
      "id": "REC-13",
      "continentalWaybillNo": "CW-13",
      "lbWaybillNo": "LB-13",
      "linkedTripId": "TRIP-13",
      "truckNo": "KJA-213XA",
      "destination": "Kano Silo",
      "dateIssued": "2026-06-24",
      "status": "active"
    },
    {
      "id": "REC-14",
      "continentalWaybillNo": "CW-14",
      "lbWaybillNo": "LB-14",
      "linkedTripId": "TRIP-14",
      "truckNo": "KJA-999XA",
      "destination": "Apapa Depot",
      "dateIssued": "2026-06-23",
      "status": "closed"
    },
    {
      "id": "REC-15",
      "continentalWaybillNo": "CW-15",
      "lbWaybillNo": "LB-15",
      "linkedTripId": "TRIP-15",
      "truckNo": "KJA-362XA",
      "destination": "Lekki Port",
      "dateIssued": "2026-06-22",
      "status": "closed"
    },
    {
      "id": "REC-16",
      "continentalWaybillNo": "CW-16",
      "lbWaybillNo": "LB-16",
      "linkedTripId": "TRIP-16",
      "truckNo": "KJA-151XA",
      "destination": "Kano Silo",
      "dateIssued": "2026-06-21",
      "status": "active"
    },
    {
      "id": "REC-17",
      "continentalWaybillNo": "CW-17",
      "lbWaybillNo": "LB-17",
      "linkedTripId": "TRIP-17",
      "truckNo": "KJA-516XA",
      "destination": "Kaduna Plant",
      "dateIssued": "2026-06-20",
      "status": "closed"
    },
    {
      "id": "REC-18",
      "continentalWaybillNo": "CW-18",
      "lbWaybillNo": "LB-18",
      "linkedTripId": "TRIP-18",
      "truckNo": "KJA-228XA",
      "destination": "Port Harcourt Hub",
      "dateIssued": "2026-06-19",
      "status": "active"
    },
    {
      "id": "REC-19",
      "continentalWaybillNo": "CW-19",
      "lbWaybillNo": "LB-19",
      "linkedTripId": "TRIP-19",
      "truckNo": "KJA-825XA",
      "destination": "Lekki Port",
      "dateIssued": "2026-06-18",
      "status": "active"
    },
    {
      "id": "REC-20",
      "continentalWaybillNo": "CW-20",
      "lbWaybillNo": "LB-20",
      "linkedTripId": "TRIP-20",
      "truckNo": "KJA-268XA",
      "destination": "Kaduna Plant",
      "dateIssued": "2026-06-17",
      "status": "active"
    }
  ],
  "expenses": [
    {
      "id": "REC-1",
      "category": "Admin",
      "description": "Operational expense",
      "amount": 462857,
      "date": "2026-07-06",
      "paidBy": "Babajide Okeke",
      "linkedTruckNo": "KJA-597XA"
    },
    {
      "id": "REC-2",
      "category": "Admin",
      "description": "Operational expense",
      "amount": 73180,
      "date": "2026-07-05",
      "paidBy": "Babajide Olawale",
      "linkedTruckNo": "KJA-400XA"
    },
    {
      "id": "REC-3",
      "category": "Logistics",
      "description": "Operational expense",
      "amount": 439542,
      "date": "2026-07-04",
      "paidBy": "Yusuf Nwosu",
      "linkedTruckNo": "KJA-755XA"
    },
    {
      "id": "REC-4",
      "category": "Fuel",
      "description": "Operational expense",
      "amount": 82027,
      "date": "2026-07-03",
      "paidBy": "Ade Aliyu",
      "linkedTruckNo": "KJA-164XA"
    },
    {
      "id": "REC-5",
      "category": "Logistics",
      "description": "Operational expense",
      "amount": 405625,
      "date": "2026-07-02",
      "paidBy": "Emeka Danfulani",
      "linkedTruckNo": "KJA-519XA"
    },
    {
      "id": "REC-6",
      "category": "Fuel",
      "description": "Operational expense",
      "amount": 401534,
      "date": "2026-07-01",
      "paidBy": "Ibrahim Ogunleye",
      "linkedTruckNo": "KJA-525XA"
    },
    {
      "id": "REC-7",
      "category": "Maintenance",
      "description": "Operational expense",
      "amount": 118748,
      "date": "2026-06-30",
      "paidBy": "Oluwaseun Mustapha",
      "linkedTruckNo": "KJA-872XA"
    },
    {
      "id": "REC-8",
      "category": "Fuel",
      "description": "Operational expense",
      "amount": 349319,
      "date": "2026-06-29",
      "paidBy": "Babajide Okafor",
      "linkedTruckNo": "KJA-354XA"
    },
    {
      "id": "REC-9",
      "category": "Logistics",
      "description": "Operational expense",
      "amount": 285715,
      "date": "2026-06-28",
      "paidBy": "Chioma Eze",
      "linkedTruckNo": "KJA-977XA"
    },
    {
      "id": "REC-10",
      "category": "Fuel",
      "description": "Operational expense",
      "amount": 242391,
      "date": "2026-06-27",
      "paidBy": "Chinedu Balogun",
      "linkedTruckNo": "KJA-689XA"
    },
    {
      "id": "REC-11",
      "category": "Maintenance",
      "description": "Operational expense",
      "amount": 404723,
      "date": "2026-06-26",
      "paidBy": "Abubakar Aliyu",
      "linkedTruckNo": "KJA-640XA"
    },
    {
      "id": "REC-12",
      "category": "Admin",
      "description": "Operational expense",
      "amount": 139798,
      "date": "2026-06-25",
      "paidBy": "Ade Adeyemi",
      "linkedTruckNo": "KJA-827XA"
    },
    {
      "id": "REC-13",
      "category": "Maintenance",
      "description": "Operational expense",
      "amount": 449249,
      "date": "2026-06-24",
      "paidBy": "Yusuf Adeyemi",
      "linkedTruckNo": "KJA-213XA"
    },
    {
      "id": "REC-14",
      "category": "Admin",
      "description": "Operational expense",
      "amount": 490742,
      "date": "2026-06-23",
      "paidBy": "Yusuf Aliyu",
      "linkedTruckNo": "KJA-999XA"
    },
    {
      "id": "REC-15",
      "category": "Admin",
      "description": "Operational expense",
      "amount": 335656,
      "date": "2026-06-22",
      "paidBy": "Abubakar Ogunleye",
      "linkedTruckNo": "KJA-362XA"
    },
    {
      "id": "REC-16",
      "category": "Maintenance",
      "description": "Operational expense",
      "amount": 73087,
      "date": "2026-06-21",
      "paidBy": "Ngozi Aliyu",
      "linkedTruckNo": "KJA-151XA"
    },
    {
      "id": "REC-17",
      "category": "Maintenance",
      "description": "Operational expense",
      "amount": 133722,
      "date": "2026-06-20",
      "paidBy": "Ade Eze",
      "linkedTruckNo": "KJA-516XA"
    },
    {
      "id": "REC-18",
      "category": "Fuel",
      "description": "Operational expense",
      "amount": 123915,
      "date": "2026-06-19",
      "paidBy": "Amina Balogun",
      "linkedTruckNo": "KJA-228XA"
    },
    {
      "id": "REC-19",
      "category": "Maintenance",
      "description": "Operational expense",
      "amount": 433806,
      "date": "2026-06-18",
      "paidBy": "Yusuf Aliyu",
      "linkedTruckNo": "KJA-825XA"
    },
    {
      "id": "REC-20",
      "category": "Admin",
      "description": "Operational expense",
      "amount": 141025,
      "date": "2026-06-17",
      "paidBy": "Ngozi Okeke",
      "linkedTruckNo": "KJA-268XA"
    }
  ]
};

export function getMock<T>(key: string): T[] {
  return (mockState as any)[key] as unknown as T[] || [];
}

export function addMock<T extends {id: string}>(key: string, item: Omit<T, 'id'>): T {
  const newItem = { ...item, id: Math.random().toString(36).substring(7) } as T;
  if (!(mockState as any)[key]) (mockState as any)[key] = [];
  (mockState as any)[key].unshift(newItem as any);
  return newItem;
}
