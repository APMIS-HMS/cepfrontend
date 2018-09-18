var apmisInvoiceDump  = {
  "total": 274,
  "limit": 20,
  "skip": 0,
  "data": [
    {
      "_id": "5a98391a6a32591e60d0cdd1",
      "updatedAt": "2018-03-01T17:32:10.479Z",
      "createdAt": "2018-03-01T17:32:10.479Z",
      "facilityId": "5a8d661bdb20d527d8e19f8c",
      "patientId": "5a93e55f9bbfc825101d90f3",
      "totalDiscount": 0,
      "subTotal": 1500,
      "totalPrice": 1500,
      "balance": 0,
      "invoiceNo": "IV/121/617",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-01T17:32:10.479Z",
          "balance": 0,
          "paymentMethod": {
            "planDetails": false,
            "isDefault": true,
            "_id": "5a93e55f9bbfc825101d90f4",
            "planType": "wallet"
          },
          "description": "undefined-undefined",
          "amountPaid": 1500
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a940e269bbfc825101d913b",
          "billObject": {
            "serviceModifierObject": [],
            "patientObject": {
              "personDetails": {
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [],
                "updatedAt": "2018-02-26T10:45:50.459Z",
                "createdAt": "2018-02-26T10:45:50.459Z",
                "title": "Dr.",
                "firstName": "Goodluck",
                "lastName": "Jonathan",
                "gender": "Male",
                "dateOfBirth": "1957-02-11T23:00:00.000Z",
                "motherMaidenName": "Nwogu",
                "primaryContactPhoneNo": "07033670940",
                "wallet": {
                  "balance": 5000,
                  "ledgerBalance": 5000,
                  "transactions": [
                    {
                      "transactionType": "Cr",
                      "amount": 5000,
                      "transactionMedium": "e-payment",
                      "transactionStatus": "Completed",
                      "balance": 5000,
                      "ledgerBalance": 5000,
                      "createdAt": "2018-03-01T17:30:40.581Z",
                      "updatedAt": "2018-03-01T17:30:40.581Z",
                      "_id": "5a9838c06a32591e60d0cdd0",
                      "sourceId": "5a8117b16a6e8510ecbc7683",
                      "sourceType": "Person",
                      "refCode": "112177",
                      "description": "Funded wallet via e-payment",
                      "destinationId": "5a93e55e9bbfc825101d90f0",
                      "destinationType": "Person",
                      "paidBy": "5a8117b16a6e8510ecbc7683"
                    }
                  ],
                  "createdAt": "2018-02-26T10:45:50.459Z",
                  "updatedAt": "2018-02-26T10:45:50.459Z",
                  "_id": "5a93e55e9bbfc825101d90f1"
                },
                "apmisId": "ED-35395",
                "__v": 0,
                "_id": "5a93e55e9bbfc825101d90f0"
              },
              "age": "61 years",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": true,
                  "_id": "5a93e55f9bbfc825101d90f4",
                  "planType": "wallet"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8d661bdb20d527d8e19f8c",
              "personId": "5a93e55e9bbfc825101d90f0",
              "createdAt": "2018-02-26T10:45:51.646Z",
              "updatedAt": "2018-02-26T10:45:51.646Z",
              "_id": "5a93e55f9bbfc825101d90f3"
            },
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "modifierId": [],
            "createdAt": "2018-02-26T13:39:50.914Z",
            "updatedAt": "2018-03-01T17:32:10.463Z",
            "_id": "5a940e269bbfc825101d913c",
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 1500,
            "quantity": 1,
            "patientId": "5a93e55f9bbfc825101d90f3",
            "serviceId": "5a8f14fb70292129407f9bc8",
            "facilityServiceId": "5a8d661bdb20d527d8e19f8e",
            "description": "",
            "facilityId": "5a8d661bdb20d527d8e19f8c",
            "unitPrice": 1500
          },
          "billingId": "5a940e269bbfc825101d913c"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a93e55f9bbfc825101d90f3",
        "__v": 0,
        "facilityId": "5a8d661bdb20d527d8e19f8c",
        "personId": "5a93e55e9bbfc825101d90f0",
        "createdAt": "2018-02-26T10:45:51.646Z",
        "updatedAt": "2018-08-21T11:17:54.697Z",
        "timeLines": [],
        "clientsNo": [
          {
            "minorLocationId": {
              "description": "",
              "locationId": "59896b6bb3abed2f546bda58",
              "name": "PPP lab",
              "_id": "5a8f132270292129407f9bc2",
              "isActive": true
            },
            "clientNumber": "FEMI1938"
          },
          {
            "clientNumber": "4358",
            "minorLocationId": "5a8f132270292129407f9bc2"
          },
          {
            "clientNumber": "N/A",
            "minorLocationId": "5a8f130270292129407f9bc0"
          }
        ],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planDetails": false,
            "isDefault": true,
            "_id": "5a93e55f9bbfc825101d90f4",
            "planType": "wallet"
          }
        ],
        "isActive": false,
        "age": "61 years",
        "personDetails": {
          "_id": "5a93e55e9bbfc825101d90f0",
          "__v": 0,
          "apmisId": "ED-35395",
          "wallet": {
            "balance": 4000,
            "ledgerBalance": 4000,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 5000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 5000,
                "ledgerBalance": 5000,
                "createdAt": "2018-03-01T17:30:40.581Z",
                "updatedAt": "2018-03-01T17:30:40.581Z",
                "_id": "5a9838c06a32591e60d0cdd0",
                "sourceId": "5a8117b16a6e8510ecbc7683",
                "sourceType": "Person",
                "refCode": "112177",
                "description": "Funded wallet via e-payment",
                "destinationId": "5a93e55e9bbfc825101d90f0",
                "destinationType": "Person",
                "paidBy": "5a8117b16a6e8510ecbc7683"
              },
              {
                "transactionType": "Dr",
                "amount": 1000,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 4000,
                "ledgerBalance": 4000,
                "createdAt": "2018-03-08T09:14:43.806Z",
                "updatedAt": "2018-03-08T09:14:43.806Z",
                "_id": "5aa0ff036e191d07f897d132",
                "description": "Laboratory-Pregnancy test -blood",
                "refCode": "136416"
              }
            ],
            "createdAt": "2018-02-26T10:45:50.459Z",
            "updatedAt": "2018-02-26T10:45:50.459Z",
            "_id": "5a93e55e9bbfc825101d90f1"
          },
          "primaryContactPhoneNo": "07033670940",
          "motherMaidenName": "Nwogu",
          "dateOfBirth": "1957-02-11T23:00:00.000Z",
          "gender": "Male",
          "lastName": "Jonathan",
          "firstName": "Goodluck",
          "title": "Dr.",
          "createdAt": "2018-02-26T10:45:50.459Z",
          "updatedAt": "2018-03-08T09:14:43.806Z",
          "nextOfKin": [],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": [
            {
              "minorLocationId": {
                "description": "",
                "locationId": "59896b6bb3abed2f546bda58",
                "name": "PPP lab",
                "_id": "5a8f132270292129407f9bc2",
                "isActive": true
              },
              "clientNumber": "FEMI1938"
            },
            {
              "clientNumber": "4358",
              "minorLocationId": "5a8f132270292129407f9bc2"
            },
            {
              "clientNumber": "N/A",
              "minorLocationId": "5a8f130270292129407f9bc0"
            }
          ]
        },
        "facilityObj": {
          "name": "SHELL NIGERIA",
          "_id": "5a8d661bdb20d527d8e19f8c",
          "email": "ogunniran.seyi2@gmail.com",
          "primaryContactPhoneNo": "07030212799",
          "shortName": "AHF"
        }
      }
    },
    {
      "_id": "5a9c7048665bbc3878103c6f",
      "updatedAt": "2018-03-04T22:16:40.448Z",
      "createdAt": "2018-03-04T22:16:40.448Z",
      "facilityId": "5a8fdc7e70292129407f9bee",
      "patientId": "5a9c6fe1665bbc3878103c68",
      "totalDiscount": 0,
      "subTotal": 500,
      "totalPrice": 500,
      "balance": 0,
      "invoiceNo": "IV/421/4889",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-04T22:16:40.447Z",
          "balance": 0,
          "paymentMethod": {
            "planDetails": false,
            "isDefault": true,
            "_id": "5a9c6fe1665bbc3878103c69",
            "bearerPersonId": "5a9c6fe1665bbc3878103c65",
            "planType": "wallet"
          },
          "description": "Medical Records-Patient Registration",
          "amountPaid": 500
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9c6fe2665bbc3878103c6a",
          "billObject": {
            "serviceModifierObject": [],
            "facilityServiceObject": {
              "serviceId": "5a9c6f98665bbc3878103c63",
              "service": "Patient Registration",
              "category": "Medical Records",
              "categoryId": "5a8fdc7e70292129407f9bf6"
            },
            "patientObject": {
              "personDetails": {
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [],
                "updatedAt": "2018-03-04T22:14:57.035Z",
                "createdAt": "2018-03-04T22:14:57.035Z",
                "title": "Mr.",
                "firstName": "Akindara",
                "lastName": "Ayoola",
                "gender": "Male",
                "dateOfBirth": "2000-03-03T23:00:00.000Z",
                "motherMaidenName": "Ola",
                "primaryContactPhoneNo": "08038377330",
                "wallet": {
                  "balance": 5000,
                  "ledgerBalance": 5000,
                  "transactions": [
                    {
                      "transactionType": "Cr",
                      "amount": 5000,
                      "transactionMedium": "e-payment",
                      "transactionStatus": "Completed",
                      "balance": 5000,
                      "ledgerBalance": 5000,
                      "createdAt": "2018-03-04T22:16:08.174Z",
                      "updatedAt": "2018-03-04T22:16:08.174Z",
                      "_id": "5a9c7028665bbc3878103c6e",
                      "sourceId": "5a8fd87770292129407f9beb",
                      "sourceType": "Person",
                      "refCode": "134894",
                      "description": "Funded wallet via e-payment",
                      "destinationId": "5a9c6fe1665bbc3878103c65",
                      "destinationType": "Person",
                      "paidBy": "5a8fd87770292129407f9beb"
                    }
                  ],
                  "createdAt": "2018-03-04T22:14:57.032Z",
                  "updatedAt": "2018-03-04T22:14:57.032Z",
                  "_id": "5a9c6fe1665bbc3878103c66"
                },
                "apmisId": "TU-59392",
                "__v": 0,
                "_id": "5a9c6fe1665bbc3878103c65"
              },
              "age": "18 years",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": true,
                  "_id": "5a9c6fe1665bbc3878103c69",
                  "bearerPersonId": "5a9c6fe1665bbc3878103c65",
                  "planType": "wallet"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8fdc7e70292129407f9bee",
              "personId": "5a9c6fe1665bbc3878103c65",
              "createdAt": "2018-03-04T22:14:57.852Z",
              "updatedAt": "2018-03-04T22:14:57.852Z",
              "_id": "5a9c6fe1665bbc3878103c68"
            },
            "serviceObject": {
              "name": "Patient Registration",
              "code": "PR001",
              "_id": "5a9c6f98665bbc3878103c63",
              "updatedAt": "2018-03-04T22:13:44.725Z",
              "createdAt": "2018-03-04T22:13:44.725Z",
              "panels": []
            },
            "isBearerConfirmed": true,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-04T22:14:58.271Z",
            "updatedAt": "2018-03-04T22:16:40.447Z",
            "_id": "5a9c6fe2665bbc3878103c6b",
            "covered": {
              "coverType": "wallet"
            },
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 500,
            "quantity": 1,
            "patientId": "5a9c6fe1665bbc3878103c68",
            "serviceId": "5a9c6f98665bbc3878103c63",
            "facilityServiceId": "5a8fdc7e70292129407f9bf0",
            "description": "",
            "facilityId": "5a8fdc7e70292129407f9bee",
            "unitPrice": 500
          },
          "billingId": "5a9c6fe2665bbc3878103c6b"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a9c6fe1665bbc3878103c68",
        "updatedAt": "2018-03-04T22:14:57.852Z",
        "createdAt": "2018-03-04T22:14:57.852Z",
        "personId": "5a9c6fe1665bbc3878103c65",
        "facilityId": "5a8fdc7e70292129407f9bee",
        "timeLines": [],
        "clientsNo": [],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planType": "wallet",
            "bearerPersonId": "5a9c6fe1665bbc3878103c65",
            "_id": "5a9c6fe1665bbc3878103c69",
            "isDefault": true,
            "planDetails": false
          }
        ],
        "isActive": false,
        "__v": 0,
        "age": "18 years",
        "personDetails": {
          "_id": "5a9c6fe1665bbc3878103c65",
          "__v": 0,
          "apmisId": "TU-59392",
          "wallet": {
            "balance": 4500,
            "ledgerBalance": 4500,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 5000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 5000,
                "ledgerBalance": 5000,
                "createdAt": "2018-03-04T22:16:08.174Z",
                "updatedAt": "2018-03-04T22:16:08.174Z",
                "_id": "5a9c7028665bbc3878103c6e",
                "sourceId": "5a8fd87770292129407f9beb",
                "sourceType": "Person",
                "refCode": "134894",
                "description": "Funded wallet via e-payment",
                "destinationId": "5a9c6fe1665bbc3878103c65",
                "destinationType": "Person",
                "paidBy": "5a8fd87770292129407f9beb"
              },
              {
                "transactionType": "Dr",
                "amount": 500,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 4500,
                "ledgerBalance": 4500,
                "createdAt": "2018-03-04T22:16:41.706Z",
                "updatedAt": "2018-03-04T22:16:41.706Z",
                "_id": "5a9c7049665bbc3878103c70",
                "description": "Medical Records-Patient Registration",
                "refCode": "899198"
              }
            ],
            "createdAt": "2018-03-04T22:14:57.032Z",
            "updatedAt": "2018-03-04T22:14:57.032Z",
            "_id": "5a9c6fe1665bbc3878103c66"
          },
          "primaryContactPhoneNo": "08038377330",
          "motherMaidenName": "Ola",
          "dateOfBirth": "2000-03-03T23:00:00.000Z",
          "gender": "Male",
          "lastName": "Ayoola",
          "firstName": "Akindara",
          "title": "Mr.",
          "createdAt": "2018-03-04T22:14:57.035Z",
          "updatedAt": "2018-03-04T22:16:41.709Z",
          "nextOfKin": [],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": []
        },
        "facilityObj": {
          "name": "Mind Rest",
          "_id": "5a8fdc7e70292129407f9bee",
          "email": "info@mindrest.org",
          "primaryContactPhoneNo": "08038377330",
          "shortName": "MR"
        }
      }
    },
    {
      "_id": "5a9c70e0665bbc3878103c7b",
      "updatedAt": "2018-03-04T22:19:24.031Z",
      "createdAt": "2018-03-04T22:19:12.057Z",
      "facilityId": "5a8fdc7e70292129407f9bee",
      "patientId": "5a9c709a665bbc3878103c74",
      "totalDiscount": 0,
      "subTotal": 500,
      "totalPrice": 500,
      "balance": 0,
      "invoiceNo": "IV/421/8285",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "amountPaid": 500,
          "paymentMethod": {
            "planType": "wallet",
            "bearerPersonId": "5a9c7099665bbc3878103c71",
            "_id": "5a9c709a665bbc3878103c75",
            "isDefault": true,
            "planDetails": false,
            "reason": null
          },
          "description": "Medical Records - Patient Registration",
          "balance": 0,
          "createdAt": "2018-03-04T22:19:24.029Z"
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9c709b665bbc3878103c76",
          "billObject": {
            "serviceModifierObject": [],
            "facilityServiceObject": {
              "serviceId": "5a9c6f98665bbc3878103c63",
              "service": "Patient Registration",
              "category": "Medical Records",
              "categoryId": "5a8fdc7e70292129407f9bf6"
            },
            "patientObject": {
              "personDetails": {
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [],
                "updatedAt": "2018-03-04T22:18:01.802Z",
                "createdAt": "2018-03-04T22:18:01.802Z",
                "title": "Mrs.",
                "firstName": "Kema",
                "lastName": "Amma",
                "gender": "Female",
                "dateOfBirth": "2002-03-03T23:00:00.000Z",
                "motherMaidenName": "Era",
                "primaryContactPhoneNo": "09067543321",
                "wallet": {
                  "balance": 3000,
                  "ledgerBalance": 3000,
                  "transactions": [
                    {
                      "transactionType": "Cr",
                      "amount": 3000,
                      "transactionMedium": "e-payment",
                      "transactionStatus": "Completed",
                      "balance": 3000,
                      "ledgerBalance": 3000,
                      "createdAt": "2018-03-04T22:18:38.335Z",
                      "updatedAt": "2018-03-04T22:18:38.335Z",
                      "_id": "5a9c70be665bbc3878103c7a",
                      "sourceId": "5a8fd87770292129407f9beb",
                      "sourceType": "Person",
                      "refCode": "236491",
                      "description": "Funded wallet via e-payment",
                      "destinationId": "5a9c7099665bbc3878103c71",
                      "destinationType": "Person",
                      "paidBy": "5a8fd87770292129407f9beb"
                    }
                  ],
                  "createdAt": "2018-03-04T22:18:01.801Z",
                  "updatedAt": "2018-03-04T22:18:01.801Z",
                  "_id": "5a9c7099665bbc3878103c72"
                },
                "apmisId": "BX-19224",
                "__v": 0,
                "_id": "5a9c7099665bbc3878103c71"
              },
              "age": "16 years",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": true,
                  "_id": "5a9c709a665bbc3878103c75",
                  "bearerPersonId": "5a9c7099665bbc3878103c71",
                  "planType": "wallet"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8fdc7e70292129407f9bee",
              "personId": "5a9c7099665bbc3878103c71",
              "createdAt": "2018-03-04T22:18:02.603Z",
              "updatedAt": "2018-03-04T22:18:02.603Z",
              "_id": "5a9c709a665bbc3878103c74"
            },
            "serviceObject": {
              "name": "Patient Registration",
              "code": "PR001",
              "_id": "5a9c6f98665bbc3878103c63",
              "updatedAt": "2018-03-04T22:13:44.725Z",
              "createdAt": "2018-03-04T22:13:44.725Z",
              "panels": []
            },
            "isBearerConfirmed": true,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-04T22:18:03.027Z",
            "updatedAt": "2018-03-04T22:18:03.027Z",
            "_id": "5a9c709b665bbc3878103c77",
            "covered": {
              "coverType": "wallet"
            },
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 500,
            "quantity": 1,
            "patientId": "5a9c709a665bbc3878103c74",
            "serviceId": "5a9c6f98665bbc3878103c63",
            "facilityServiceId": "5a8fdc7e70292129407f9bf0",
            "description": "",
            "facilityId": "5a8fdc7e70292129407f9bee",
            "unitPrice": 500
          },
          "billingId": "5a9c709b665bbc3878103c77"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a9c709a665bbc3878103c74",
        "updatedAt": "2018-03-04T22:18:02.603Z",
        "createdAt": "2018-03-04T22:18:02.603Z",
        "personId": "5a9c7099665bbc3878103c71",
        "facilityId": "5a8fdc7e70292129407f9bee",
        "timeLines": [],
        "clientsNo": [],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planType": "wallet",
            "bearerPersonId": "5a9c7099665bbc3878103c71",
            "_id": "5a9c709a665bbc3878103c75",
            "isDefault": true,
            "planDetails": false
          }
        ],
        "isActive": false,
        "__v": 0,
        "age": "16 years",
        "personDetails": {
          "_id": "5a9c7099665bbc3878103c71",
          "__v": 0,
          "apmisId": "BX-19224",
          "wallet": {
            "balance": 2500,
            "ledgerBalance": 2500,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 3000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 3000,
                "ledgerBalance": 3000,
                "createdAt": "2018-03-04T22:18:38.335Z",
                "updatedAt": "2018-03-04T22:18:38.335Z",
                "_id": "5a9c70be665bbc3878103c7a",
                "sourceId": "5a8fd87770292129407f9beb",
                "sourceType": "Person",
                "refCode": "236491",
                "description": "Funded wallet via e-payment",
                "destinationId": "5a9c7099665bbc3878103c71",
                "destinationType": "Person",
                "paidBy": "5a8fd87770292129407f9beb"
              },
              {
                "transactionType": "Dr",
                "amount": 500,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 2500,
                "ledgerBalance": 2500,
                "createdAt": "2018-03-04T22:19:26.091Z",
                "updatedAt": "2018-03-04T22:19:26.091Z",
                "_id": "5a9c70ee665bbc3878103c7c",
                "description": "Medical Records - Patient Registration",
                "refCode": "110750"
              }
            ],
            "createdAt": "2018-03-04T22:18:01.801Z",
            "updatedAt": "2018-03-04T22:18:01.801Z",
            "_id": "5a9c7099665bbc3878103c72"
          },
          "primaryContactPhoneNo": "09067543321",
          "motherMaidenName": "Era",
          "dateOfBirth": "2002-03-03T23:00:00.000Z",
          "gender": "Female",
          "lastName": "Amma",
          "firstName": "Kema",
          "title": "Mrs.",
          "createdAt": "2018-03-04T22:18:01.802Z",
          "updatedAt": "2018-03-04T22:19:26.092Z",
          "nextOfKin": [],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": []
        },
        "facilityObj": {
          "name": "Mind Rest",
          "_id": "5a8fdc7e70292129407f9bee",
          "email": "info@mindrest.org",
          "primaryContactPhoneNo": "08038377330",
          "shortName": "MR"
        }
      }
    },
    {
      "_id": "5a9c72d0665bbc3878103c8c",
      "updatedAt": "2018-03-04T22:27:28.866Z",
      "createdAt": "2018-03-04T22:27:28.866Z",
      "facilityId": "5a8fdc7e70292129407f9bee",
      "patientId": "5a9c7231665bbc3878103c84",
      "totalDiscount": 0,
      "subTotal": 500,
      "totalPrice": 500,
      "balance": 0,
      "invoiceNo": "IV/421/3461",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-04T22:27:28.865Z",
          "balance": 0,
          "paymentMethod": {
            "planDetails": false,
            "isDefault": false,
            "_id": "5a9c7231665bbc3878103c86",
            "planType": "wallet"
          },
          "description": "Medical Records-Patient Registration",
          "amountPaid": 500
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9c7233665bbc3878103c87",
          "billObject": {
            "serviceModifierObject": [],
            "facilityServiceObject": {
              "serviceId": "5a9c6f98665bbc3878103c63",
              "service": "Patient Registration",
              "category": "Medical Records",
              "categoryId": "5a8fdc7e70292129407f9bf6"
            },
            "patientObject": {
              "personDetails": {
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [],
                "updatedAt": "2018-03-04T22:24:48.509Z",
                "createdAt": "2018-03-04T22:24:48.509Z",
                "title": "Mr.",
                "firstName": "Clement",
                "lastName": "Timothy",
                "gender": "Male",
                "dateOfBirth": "2018-03-04T22:24:22.684Z",
                "motherMaidenName": "Yaya",
                "primaryContactPhoneNo": "09087876567",
                "wallet": {
                  "balance": 6000,
                  "ledgerBalance": 6000,
                  "transactions": [
                    {
                      "transactionType": "Cr",
                      "amount": 6000,
                      "transactionMedium": "e-payment",
                      "transactionStatus": "Completed",
                      "balance": 6000,
                      "ledgerBalance": 6000,
                      "createdAt": "2018-03-04T22:26:56.899Z",
                      "updatedAt": "2018-03-04T22:26:56.899Z",
                      "_id": "5a9c72b0665bbc3878103c8b",
                      "sourceId": "5a8fd87770292129407f9beb",
                      "sourceType": "Person",
                      "refCode": "953543",
                      "description": "Funded wallet via e-payment",
                      "destinationId": "5a9c7230665bbc3878103c81",
                      "destinationType": "Person",
                      "paidBy": "5a8fd87770292129407f9beb"
                    }
                  ],
                  "createdAt": "2018-03-04T22:24:48.508Z",
                  "updatedAt": "2018-03-04T22:24:48.508Z",
                  "_id": "5a9c7230665bbc3878103c82"
                },
                "apmisId": "XY-92079",
                "__v": 0,
                "_id": "5a9c7230665bbc3878103c81"
              },
              "age": "0 day",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": false,
                  "_id": "5a9c7231665bbc3878103c86",
                  "planType": "wallet"
                },
                {
                  "planDetails": {
                    "principalId": "7000",
                    "principalName": "Clement Timothy",
                    "familyId": "5a9c7206665bbc3878103c7e"
                  },
                  "isDefault": true,
                  "_id": "5a9c7231665bbc3878103c85",
                  "bearerPersonId": "5a9c7230665bbc3878103c81",
                  "planType": "family"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8fdc7e70292129407f9bee",
              "personId": "5a9c7230665bbc3878103c81",
              "createdAt": "2018-03-04T22:24:49.289Z",
              "updatedAt": "2018-03-04T22:24:49.289Z",
              "_id": "5a9c7231665bbc3878103c84"
            },
            "serviceObject": {
              "name": "Patient Registration",
              "code": "PR001",
              "_id": "5a9c6f98665bbc3878103c63",
              "updatedAt": "2018-03-04T22:13:44.725Z",
              "createdAt": "2018-03-04T22:13:44.725Z",
              "panels": []
            },
            "unitPrice": 500,
            "facilityId": "5a8fdc7e70292129407f9bee",
            "description": "",
            "facilityServiceId": "5a8fdc7e70292129407f9bf0",
            "serviceId": "5a9c6f98665bbc3878103c63",
            "patientId": "5a9c7231665bbc3878103c84",
            "quantity": 1,
            "totalPrice": 500,
            "unitDiscountedAmount": 0,
            "totalDiscoutedAmount": 0,
            "covered": {
              "verifiedAt": "2018-03-04T22:25:37.692Z",
              "billAccepted": true,
              "isVerify": true,
              "familyId": "5a9c7206665bbc3878103c7e",
              "coverType": "family"
            },
            "_id": "5a9c7233665bbc3878103c88",
            "updatedAt": "2018-03-04T22:27:28.865Z",
            "createdAt": "2018-03-04T22:24:51.379Z",
            "modifierId": [],
            "active": true,
            "isInvoiceGenerated": true,
            "isServiceEnjoyed": true,
            "paymentCompleted": true,
            "paymentStatus": [],
            "payments": [],
            "isBearerConfirmed": true
          },
          "billingId": "5a9c7233665bbc3878103c88"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a9c7231665bbc3878103c84",
        "updatedAt": "2018-03-04T22:24:49.289Z",
        "createdAt": "2018-03-04T22:24:49.289Z",
        "personId": "5a9c7230665bbc3878103c81",
        "facilityId": "5a8fdc7e70292129407f9bee",
        "timeLines": [],
        "clientsNo": [],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planType": "wallet",
            "_id": "5a9c7231665bbc3878103c86",
            "isDefault": false,
            "planDetails": false
          },
          {
            "planType": "family",
            "bearerPersonId": "5a9c7230665bbc3878103c81",
            "_id": "5a9c7231665bbc3878103c85",
            "isDefault": true,
            "planDetails": {
              "familyId": "5a9c7206665bbc3878103c7e",
              "principalName": "Clement Timothy",
              "principalId": "7000"
            }
          }
        ],
        "isActive": false,
        "__v": 0,
        "age": "6 months",
        "personDetails": {
          "_id": "5a9c7230665bbc3878103c81",
          "__v": 0,
          "apmisId": "XY-92079",
          "wallet": {
            "_id": "5a9c7230665bbc3878103c82",
            "updatedAt": "2018-03-04T22:24:48.508Z",
            "createdAt": "2018-03-04T22:24:48.508Z",
            "transactions": [
              {
                "paidBy": "5a8fd87770292129407f9beb",
                "destinationType": "Person",
                "destinationId": "5a9c7230665bbc3878103c81",
                "description": "Funded wallet via e-payment",
                "refCode": "953543",
                "sourceType": "Person",
                "sourceId": "5a8fd87770292129407f9beb",
                "_id": "5a9c72b0665bbc3878103c8b",
                "updatedAt": "2018-03-04T22:26:56.899Z",
                "createdAt": "2018-03-04T22:26:56.899Z",
                "ledgerBalance": 6000,
                "balance": 6000,
                "transactionStatus": "Completed",
                "transactionMedium": "e-payment",
                "amount": 6000,
                "transactionType": "Cr"
              }
            ],
            "ledgerBalance": 6000,
            "balance": 6000
          },
          "primaryContactPhoneNo": "09087876567",
          "motherMaidenName": "Yaya",
          "dateOfBirth": "2018-03-04T22:24:22.684Z",
          "gender": "Male",
          "lastName": "Timothy",
          "firstName": "Clement",
          "title": "Mr.",
          "createdAt": "2018-03-04T22:24:48.509Z",
          "updatedAt": "2018-03-04T22:24:48.509Z",
          "nextOfKin": [],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": []
        },
        "facilityObj": {
          "name": "Mind Rest",
          "_id": "5a8fdc7e70292129407f9bee",
          "email": "info@mindrest.org",
          "primaryContactPhoneNo": "08038377330",
          "shortName": "MR"
        }
      }
    },
    {
      "_id": "5a9c748000f5d9262caf72aa",
      "updatedAt": "2018-03-04T22:34:40.213Z",
      "createdAt": "2018-03-04T22:34:40.213Z",
      "facilityId": "5a8fdc7e70292129407f9bee",
      "patientId": "5a9c7340665bbc3878103c90",
      "totalDiscount": 0,
      "subTotal": 500,
      "totalPrice": 500,
      "balance": 0,
      "invoiceNo": "IV/421/5309",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-04T22:34:40.211Z",
          "balance": 0,
          "paymentMethod": {
            "planDetails": false,
            "isDefault": false,
            "_id": "5a9c7340665bbc3878103c92",
            "planType": "wallet"
          },
          "description": "Medical Records-Patient Registration",
          "amountPaid": 500
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9c7343665bbc3878103c93",
          "billObject": {
            "serviceModifierObject": [],
            "facilityServiceObject": {
              "serviceId": "5a9c6f98665bbc3878103c63",
              "service": "Patient Registration",
              "category": "Medical Records",
              "categoryId": "5a8fdc7e70292129407f9bf6"
            },
            "patientObject": {
              "personDetails": {
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [],
                "updatedAt": "2018-03-04T22:29:19.882Z",
                "createdAt": "2018-03-04T22:29:19.882Z",
                "title": "Mr.",
                "firstName": "Aina",
                "lastName": "Oke",
                "gender": "Male",
                "dateOfBirth": "2018-03-04T22:28:48.285Z",
                "motherMaidenName": "Yaya",
                "primaryContactPhoneNo": "09089765432",
                "wallet": {
                  "balance": 500,
                  "ledgerBalance": 500,
                  "transactions": [
                    {
                      "transactionType": "Cr",
                      "amount": 500,
                      "transactionMedium": "e-payment",
                      "transactionStatus": "Completed",
                      "balance": 500,
                      "ledgerBalance": 500,
                      "createdAt": "2018-03-04T22:34:08.125Z",
                      "updatedAt": "2018-03-04T22:34:08.125Z",
                      "_id": "5a9c746000f5d9262caf72a9",
                      "sourceId": "5a8fd87770292129407f9beb",
                      "sourceType": "Person",
                      "refCode": "765066",
                      "description": "Funded wallet via e-payment",
                      "destinationId": "5a9c733f665bbc3878103c8d",
                      "destinationType": "Person",
                      "paidBy": "5a8fd87770292129407f9beb"
                    }
                  ],
                  "createdAt": "2018-03-04T22:29:19.881Z",
                  "updatedAt": "2018-03-04T22:29:19.881Z",
                  "_id": "5a9c733f665bbc3878103c8e"
                },
                "apmisId": "SR-32629",
                "__v": 0,
                "_id": "5a9c733f665bbc3878103c8d"
              },
              "age": "0 day",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": false,
                  "_id": "5a9c7340665bbc3878103c92",
                  "planType": "wallet"
                },
                {
                  "planDetails": {
                    "principalId": "7000",
                    "principalName": "Clement Timothy",
                    "familyId": "5a9c7206665bbc3878103c7e"
                  },
                  "isDefault": true,
                  "_id": "5a9c7340665bbc3878103c91",
                  "bearerPersonId": "5a9c7230665bbc3878103c81",
                  "planType": "family"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8fdc7e70292129407f9bee",
              "personId": "5a9c733f665bbc3878103c8d",
              "createdAt": "2018-03-04T22:29:20.654Z",
              "updatedAt": "2018-03-04T22:29:20.654Z",
              "_id": "5a9c7340665bbc3878103c90"
            },
            "serviceObject": {
              "name": "Patient Registration",
              "code": "PR001",
              "_id": "5a9c6f98665bbc3878103c63",
              "updatedAt": "2018-03-04T22:13:44.725Z",
              "createdAt": "2018-03-04T22:13:44.725Z",
              "panels": []
            },
            "unitPrice": 500,
            "facilityId": "5a8fdc7e70292129407f9bee",
            "description": "",
            "facilityServiceId": "5a8fdc7e70292129407f9bf0",
            "serviceId": "5a9c6f98665bbc3878103c63",
            "patientId": "5a9c7340665bbc3878103c90",
            "quantity": 1,
            "totalPrice": 500,
            "unitDiscountedAmount": 0,
            "totalDiscoutedAmount": 0,
            "covered": {
              "verifiedAt": "2018-03-04T22:32:10.502Z",
              "billAccepted": true,
              "isVerify": true,
              "familyId": "5a9c7206665bbc3878103c7e",
              "coverType": "family"
            },
            "_id": "5a9c7343665bbc3878103c94",
            "updatedAt": "2018-03-04T22:34:40.211Z",
            "createdAt": "2018-03-04T22:29:23.499Z",
            "modifierId": [],
            "active": true,
            "isInvoiceGenerated": true,
            "isServiceEnjoyed": true,
            "paymentCompleted": true,
            "paymentStatus": [],
            "payments": [],
            "isBearerConfirmed": true
          },
          "billingId": "5a9c7343665bbc3878103c94"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a9c7340665bbc3878103c90",
        "updatedAt": "2018-03-04T22:29:20.654Z",
        "createdAt": "2018-03-04T22:29:20.654Z",
        "personId": "5a9c733f665bbc3878103c8d",
        "facilityId": "5a8fdc7e70292129407f9bee",
        "timeLines": [],
        "clientsNo": [],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planType": "wallet",
            "_id": "5a9c7340665bbc3878103c92",
            "isDefault": false,
            "planDetails": false
          },
          {
            "planType": "family",
            "bearerPersonId": "5a9c7230665bbc3878103c81",
            "_id": "5a9c7340665bbc3878103c91",
            "isDefault": true,
            "planDetails": {
              "familyId": "5a9c7206665bbc3878103c7e",
              "principalName": "Clement Timothy",
              "principalId": "7000"
            }
          }
        ],
        "isActive": false,
        "__v": 0,
        "age": "6 months",
        "personDetails": {
          "_id": "5a9c733f665bbc3878103c8d",
          "__v": 0,
          "apmisId": "SR-32629",
          "wallet": {
            "_id": "5a9c733f665bbc3878103c8e",
            "updatedAt": "2018-03-04T22:29:19.881Z",
            "createdAt": "2018-03-04T22:29:19.881Z",
            "transactions": [
              {
                "paidBy": "5a8fd87770292129407f9beb",
                "destinationType": "Person",
                "destinationId": "5a9c733f665bbc3878103c8d",
                "description": "Funded wallet via e-payment",
                "refCode": "765066",
                "sourceType": "Person",
                "sourceId": "5a8fd87770292129407f9beb",
                "_id": "5a9c746000f5d9262caf72a9",
                "updatedAt": "2018-03-04T22:34:08.125Z",
                "createdAt": "2018-03-04T22:34:08.125Z",
                "ledgerBalance": 500,
                "balance": 500,
                "transactionStatus": "Completed",
                "transactionMedium": "e-payment",
                "amount": 500,
                "transactionType": "Cr"
              }
            ],
            "ledgerBalance": 500,
            "balance": 500
          },
          "primaryContactPhoneNo": "09089765432",
          "motherMaidenName": "Yaya",
          "dateOfBirth": "2018-03-04T22:28:48.285Z",
          "gender": "Male",
          "lastName": "Oke",
          "firstName": "Aina",
          "title": "Mr.",
          "createdAt": "2018-03-04T22:29:19.882Z",
          "updatedAt": "2018-03-04T22:29:19.882Z",
          "nextOfKin": [],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": []
        },
        "facilityObj": {
          "name": "Mind Rest",
          "_id": "5a8fdc7e70292129407f9bee",
          "email": "info@mindrest.org",
          "primaryContactPhoneNo": "08038377330",
          "shortName": "MR"
        }
      }
    },
    {
      "_id": "5a9d14a55171473b8c681490",
      "updatedAt": "2018-03-05T09:57:57.005Z",
      "createdAt": "2018-03-05T09:57:57.005Z",
      "facilityId": "5a8fdc7e70292129407f9bee",
      "patientId": "5a9d13385171473b8c681488",
      "totalDiscount": 0,
      "subTotal": 500,
      "totalPrice": 500,
      "balance": 0,
      "invoiceNo": "IV/521/2548",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-05T09:57:57.003Z",
          "balance": 0,
          "paymentMethod": {
            "planDetails": {
              "principalId": "60010",
              "principalName": "Taiwo Emily",
              "familyId": "5a9c7206665bbc3878103c7e"
            },
            "isDefault": true,
            "_id": "5a9d13385171473b8c681489",
            "bearerPersonId": "5a9d10ac5171473b8c68147d",
            "planType": "family"
          },
          "description": "Medical Records-Patient Registration",
          "amountPaid": 500
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9d133d5171473b8c68148b",
          "billObject": {
            "serviceModifierObject": [],
            "facilityServiceObject": {
              "serviceId": "5a9c6f98665bbc3878103c63",
              "service": "Patient Registration",
              "category": "Medical Records",
              "categoryId": "5a8fdc7e70292129407f9bf6"
            },
            "patientObject": {
              "personDetails": {
                "__v": 0,
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [],
                "apmisId": "IT-76527",
                "wallet": {
                  "balance": 0,
                  "ledgerBalance": 0,
                  "transactions": [],
                  "createdAt": "2018-03-05T09:51:51.438Z",
                  "updatedAt": "2018-03-05T09:51:51.438Z",
                  "_id": "5a9d13375171473b8c681486"
                },
                "primaryContactPhoneNo": "08037321100",
                "motherMaidenName": "Tan",
                "dateOfBirth": "2018-03-05T09:51:17.493Z",
                "gender": "Female",
                "lastName": "Emily",
                "firstName": "Grace",
                "title": "Mrs.",
                "createdAt": "2018-03-05T09:51:51.441Z",
                "updatedAt": "2018-03-05T09:51:51.441Z",
                "_id": "5a9d13375171473b8c681485"
              },
              "age": "0 day",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": false,
                  "_id": "5a9d13385171473b8c68148a",
                  "planType": "wallet"
                },
                {
                  "planDetails": {
                    "principalId": "60010",
                    "principalName": "Taiwo Emily",
                    "familyId": "5a9c7206665bbc3878103c7e"
                  },
                  "isDefault": true,
                  "_id": "5a9d13385171473b8c681489",
                  "bearerPersonId": "5a9d10ac5171473b8c68147d",
                  "planType": "family"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8fdc7e70292129407f9bee",
              "personId": "5a9d13375171473b8c681485",
              "createdAt": "2018-03-05T09:51:52.270Z",
              "updatedAt": "2018-03-05T09:51:52.270Z",
              "_id": "5a9d13385171473b8c681488"
            },
            "serviceObject": {
              "name": "Patient Registration",
              "code": "PR001",
              "_id": "5a9c6f98665bbc3878103c63",
              "updatedAt": "2018-03-04T22:13:44.725Z",
              "createdAt": "2018-03-04T22:13:44.725Z",
              "panels": []
            },
            "unitPrice": 500,
            "facilityId": "5a8fdc7e70292129407f9bee",
            "description": "",
            "facilityServiceId": "5a8fdc7e70292129407f9bf0",
            "serviceId": "5a9c6f98665bbc3878103c63",
            "patientId": "5a9d13385171473b8c681488",
            "quantity": 1,
            "totalPrice": 500,
            "unitDiscountedAmount": 0,
            "totalDiscoutedAmount": 0,
            "covered": {
              "verifiedAt": "2018-03-05T09:53:28.299Z",
              "billAccepted": true,
              "isVerify": true,
              "familyId": "5a9c7206665bbc3878103c7e",
              "coverType": "family"
            },
            "_id": "5a9d133d5171473b8c68148c",
            "updatedAt": "2018-03-05T09:57:57.003Z",
            "createdAt": "2018-03-05T09:51:57.720Z",
            "modifierId": [],
            "active": true,
            "isInvoiceGenerated": true,
            "isServiceEnjoyed": true,
            "paymentCompleted": true,
            "paymentStatus": [],
            "payments": [],
            "isBearerConfirmed": true
          },
          "billingId": "5a9d133d5171473b8c68148c"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a9d13385171473b8c681488",
        "updatedAt": "2018-03-05T09:51:52.270Z",
        "createdAt": "2018-03-05T09:51:52.270Z",
        "personId": "5a9d13375171473b8c681485",
        "facilityId": "5a8fdc7e70292129407f9bee",
        "timeLines": [],
        "clientsNo": [],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planType": "wallet",
            "_id": "5a9d13385171473b8c68148a",
            "isDefault": false,
            "planDetails": false
          },
          {
            "planType": "family",
            "bearerPersonId": "5a9d10ac5171473b8c68147d",
            "_id": "5a9d13385171473b8c681489",
            "isDefault": true,
            "planDetails": {
              "familyId": "5a9c7206665bbc3878103c7e",
              "principalName": "Taiwo Emily",
              "principalId": "60010"
            }
          }
        ],
        "isActive": false,
        "__v": 0,
        "age": "6 months",
        "personDetails": {
          "_id": "5a9d13375171473b8c681485",
          "updatedAt": "2018-03-05T09:51:51.441Z",
          "createdAt": "2018-03-05T09:51:51.441Z",
          "title": "Mrs.",
          "firstName": "Grace",
          "lastName": "Emily",
          "gender": "Female",
          "dateOfBirth": "2018-03-05T09:51:17.493Z",
          "motherMaidenName": "Tan",
          "primaryContactPhoneNo": "08037321100",
          "wallet": {
            "_id": "5a9d13375171473b8c681486",
            "updatedAt": "2018-03-05T09:51:51.438Z",
            "createdAt": "2018-03-05T09:51:51.438Z",
            "transactions": [],
            "ledgerBalance": 0,
            "balance": 0
          },
          "apmisId": "IT-76527",
          "nextOfKin": [],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "__v": 0,
          "clientsNo": []
        },
        "facilityObj": {
          "name": "Mind Rest",
          "_id": "5a8fdc7e70292129407f9bee",
          "email": "info@mindrest.org",
          "primaryContactPhoneNo": "08038377330",
          "shortName": "MR"
        }
      }
    },
    {
      "_id": "5a9d36a199fc7d16a8d359ff",
      "updatedAt": "2018-03-05T12:22:57.146Z",
      "createdAt": "2018-03-05T12:22:57.146Z",
      "facilityId": "5a8d661bdb20d527d8e19f8c",
      "patientId": "5a9d1dcf99fc7d16a8d359df",
      "totalDiscount": 0,
      "subTotal": 1,
      "totalPrice": 1,
      "balance": 0,
      "invoiceNo": "IV/521/723",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-05T12:22:57.146Z",
          "balance": 0,
          "paymentMethod": {
            "planDetails": false,
            "isDefault": true,
            "_id": "5a9d1dcf99fc7d16a8d359e0",
            "bearerPersonId": "5a9d1dce99fc7d16a8d359dc",
            "planType": "wallet"
          },
          "description": "Medical Records-new registration",
          "amountPaid": 1
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9d1dcf99fc7d16a8d359e1",
          "billObject": {
            "serviceModifierObject": [],
            "facilityServiceObject": {
              "serviceId": "5a8d886170292129407f9b9c",
              "service": "new registration",
              "category": "Medical Records",
              "categoryId": "5a8d661bdb20d527d8e19f94"
            },
            "patientObject": {
              "personDetails": {
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [],
                "updatedAt": "2018-03-05T10:37:57.757Z",
                "createdAt": "2018-03-05T10:37:02.001Z",
                "title": "Mr.",
                "firstName": "Daniel",
                "lastName": "Lami",
                "gender": "Male",
                "dateOfBirth": "2007-03-04T23:00:00.000Z",
                "motherMaidenName": "Ololo",
                "primaryContactPhoneNo": "08055165779",
                "wallet": {
                  "balance": 5000,
                  "ledgerBalance": 5000,
                  "transactions": [
                    {
                      "transactionType": "Cr",
                      "amount": 5000,
                      "transactionMedium": "e-payment",
                      "transactionStatus": "Completed",
                      "balance": 5000,
                      "ledgerBalance": 5000,
                      "createdAt": "2018-03-05T12:22:17.488Z",
                      "updatedAt": "2018-03-05T12:22:17.488Z",
                      "_id": "5a9d367999fc7d16a8d359fe",
                      "sourceId": "5a8d671edb20d527d8e19f9d",
                      "sourceType": "Person",
                      "refCode": "674406",
                      "description": "Funded wallet via e-payment",
                      "destinationId": "5a9d1dce99fc7d16a8d359dc",
                      "destinationType": "Person",
                      "paidBy": "5a8d671edb20d527d8e19f9d"
                    }
                  ],
                  "createdAt": "2018-03-05T10:37:02.001Z",
                  "updatedAt": "2018-03-05T10:37:02.001Z",
                  "_id": "5a9d1dce99fc7d16a8d359dd"
                },
                "apmisId": "XP-69157",
                "__v": 0,
                "homeAddress": {
                  "street": "10, ede street",
                  "state": "Osun State",
                  "lga": "Ede North",
                  "country": "Nigeria",
                  "city": "Ile-Ife"
                },
                "email": "lami.akin@gmail.com",
                "_id": "5a9d1dce99fc7d16a8d359dc"
              },
              "age": "11 years",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": true,
                  "_id": "5a9d1dcf99fc7d16a8d359e0",
                  "bearerPersonId": "5a9d1dce99fc7d16a8d359dc",
                  "planType": "wallet"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8d661bdb20d527d8e19f8c",
              "personId": "5a9d1dce99fc7d16a8d359dc",
              "createdAt": "2018-03-05T10:37:03.173Z",
              "updatedAt": "2018-03-05T10:37:03.173Z",
              "_id": "5a9d1dcf99fc7d16a8d359df"
            },
            "serviceObject": {
              "_id": "5a8d886170292129407f9b9c",
              "code": "102",
              "name": "new registration",
              "updatedAt": "2018-02-21T14:55:29.185Z",
              "createdAt": "2018-02-21T14:55:29.185Z",
              "panels": []
            },
            "isBearerConfirmed": true,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-05T10:37:03.501Z",
            "updatedAt": "2018-03-05T12:22:57.146Z",
            "_id": "5a9d1dcf99fc7d16a8d359e2",
            "covered": {
              "coverType": "wallet"
            },
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 1,
            "quantity": 1,
            "patientId": "5a9d1dcf99fc7d16a8d359df",
            "serviceId": "5a8d886170292129407f9b9c",
            "facilityServiceId": "5a8d661bdb20d527d8e19f8e",
            "description": "",
            "facilityId": "5a8d661bdb20d527d8e19f8c",
            "unitPrice": 1
          },
          "billingId": "5a9d1dcf99fc7d16a8d359e2"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a9d1dcf99fc7d16a8d359df",
        "updatedAt": "2018-03-05T10:37:03.173Z",
        "createdAt": "2018-03-05T10:37:03.173Z",
        "personId": "5a9d1dce99fc7d16a8d359dc",
        "facilityId": "5a8d661bdb20d527d8e19f8c",
        "timeLines": [],
        "clientsNo": [],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planType": "wallet",
            "bearerPersonId": "5a9d1dce99fc7d16a8d359dc",
            "_id": "5a9d1dcf99fc7d16a8d359e0",
            "isDefault": true,
            "planDetails": false
          }
        ],
        "isActive": false,
        "__v": 0,
        "age": "11 years",
        "personDetails": {
          "_id": "5a9d1dce99fc7d16a8d359dc",
          "email": "lami.akin@gmail.com",
          "homeAddress": {
            "city": "Ile-Ife",
            "country": "Nigeria",
            "lga": "Ede North",
            "state": "Osun State",
            "street": "10, ede street"
          },
          "__v": 0,
          "apmisId": "XP-69157",
          "wallet": {
            "balance": 4999,
            "ledgerBalance": 4999,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 5000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 5000,
                "ledgerBalance": 5000,
                "createdAt": "2018-03-05T12:22:17.488Z",
                "updatedAt": "2018-03-05T12:22:17.488Z",
                "_id": "5a9d367999fc7d16a8d359fe",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "sourceType": "Person",
                "refCode": "674406",
                "description": "Funded wallet via e-payment",
                "destinationId": "5a9d1dce99fc7d16a8d359dc",
                "destinationType": "Person",
                "paidBy": "5a8d671edb20d527d8e19f9d"
              },
              {
                "transactionType": "Dr",
                "amount": 1,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 4999,
                "ledgerBalance": 4999,
                "createdAt": "2018-03-05T12:22:57.396Z",
                "updatedAt": "2018-03-05T12:22:57.396Z",
                "_id": "5a9d36a199fc7d16a8d35a00",
                "description": "Medical Records-new registration",
                "refCode": "371003"
              }
            ],
            "createdAt": "2018-03-05T10:37:02.001Z",
            "updatedAt": "2018-03-05T10:37:02.001Z",
            "_id": "5a9d1dce99fc7d16a8d359dd"
          },
          "primaryContactPhoneNo": "08055165779",
          "motherMaidenName": "Ololo",
          "dateOfBirth": "2007-03-04T23:00:00.000Z",
          "gender": "Male",
          "lastName": "Lami",
          "firstName": "Daniel",
          "title": "Mr.",
          "createdAt": "2018-03-05T10:37:02.001Z",
          "updatedAt": "2018-03-05T12:22:57.396Z",
          "nextOfKin": [],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": []
        },
        "facilityObj": {
          "name": "SHELL NIGERIA",
          "_id": "5a8d661bdb20d527d8e19f8c",
          "email": "ogunniran.seyi2@gmail.com",
          "primaryContactPhoneNo": "07030212799",
          "shortName": "AHF"
        }
      }
    },
    {
      "_id": "5a9e785da567394db8b2f2dd",
      "updatedAt": "2018-03-06T11:15:41.176Z",
      "createdAt": "2018-03-06T11:15:41.176Z",
      "facilityId": "5a8d661bdb20d527d8e19f8c",
      "patientId": "5a8d893570292129407f9ba6",
      "totalDiscount": 0,
      "subTotal": 5500,
      "totalPrice": 5500,
      "balance": 0,
      "invoiceNo": "IV/621/2127",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-06T11:15:41.174Z",
          "balance": 0,
          "paymentMethod": {
            "_id": "5a8d893570292129407f9ba7",
            "planType": "wallet",
            "isDefault": true,
            "planDetails": false
          },
          "description": "undefined-undefined",
          "amountPaid": 5500
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9e70eda567394db8b2f2d8",
          "billObject": {
            "serviceModifierObject": [],
            "patientObject": {
              "personDetails": {
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [
                  {
                    "relationship": "Brother",
                    "phoneNumber": "09085767734",
                    "fullName": "Tolu Kadejo",
                    "email": "tolukad@mail.com",
                    "address": "23 dundun"
                  }
                ],
                "homeAddress": {
                  "street": "24, Dundun Road",
                  "state": "Ekiti State",
                  "lga": "Ekiti East",
                  "country": "Nigeria",
                  "city": "Ikere-Ekiti"
                },
                "email": "fadet@mail.com",
                "__v": 0,
                "apmisId": "PN-57310",
                "wallet": {
                  "_id": "5a8d893470292129407f9ba4",
                  "updatedAt": "2018-02-21T14:59:00.010Z",
                  "createdAt": "2018-02-21T14:59:00.010Z",
                  "transactions": [
                    {
                      "paidBy": "5a8d671edb20d527d8e19f9d",
                      "destinationType": "Person",
                      "destinationId": "5a8d893470292129407f9ba3",
                      "description": "Funded wallet via e-payment",
                      "refCode": "020534",
                      "sourceType": "Person",
                      "sourceId": "5a8d671edb20d527d8e19f9d",
                      "_id": "5a9e71a8a567394db8b2f2dc",
                      "updatedAt": "2018-03-06T10:47:04.763Z",
                      "createdAt": "2018-03-06T10:47:04.763Z",
                      "ledgerBalance": 10000,
                      "balance": 10000,
                      "transactionStatus": "Completed",
                      "transactionMedium": "e-payment",
                      "amount": 10000,
                      "transactionType": "Cr"
                    }
                  ],
                  "ledgerBalance": 10000,
                  "balance": 10000
                },
                "primaryContactPhoneNo": "08038974509",
                "motherMaidenName": "Waku",
                "dateOfBirth": "2011-02-20T23:00:00.000Z",
                "gender": "Female",
                "lastName": "Adetola",
                "firstName": "Foluke",
                "title": "Mrs.",
                "createdAt": "2018-02-21T14:59:00.010Z",
                "updatedAt": "2018-03-06T11:11:07.132Z",
                "_id": "5a8d893470292129407f9ba3"
              },
              "age": "7 years",
              "isActive": false,
              "paymentPlan": [
                {
                  "_id": "5a8d893570292129407f9ba7",
                  "planType": "wallet",
                  "isDefault": true,
                  "planDetails": false
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [
                {
                  "clientNumber": "23",
                  "minorLocationId": {
                    "isActive": true,
                    "_id": "5a8f132270292129407f9bc2",
                    "name": "PPP lab",
                    "locationId": "59896b6bb3abed2f546bda58",
                    "description": ""
                  }
                },
                {
                  "clientNumber": "23",
                  "minorLocationId": {
                    "isActive": true,
                    "_id": "5a8f132270292129407f9bc2",
                    "name": "PPP lab",
                    "locationId": "59896b6bb3abed2f546bda58",
                    "description": ""
                  }
                }
              ],
              "timeLines": [],
              "updatedAt": "2018-03-06T11:10:57.008Z",
              "createdAt": "2018-02-21T14:59:01.228Z",
              "personId": "5a8d893470292129407f9ba3",
              "facilityId": "5a8d661bdb20d527d8e19f8c",
              "__v": 0,
              "_id": "5a8d893570292129407f9ba6"
            },
            "isBearerConfirmed": true,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-06T10:43:57.508Z",
            "updatedAt": "2018-03-06T11:15:41.174Z",
            "_id": "5a9e70eda567394db8b2f2d9",
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 5500,
            "covered": {
              "coverType": "wallet"
            },
            "quantity": 1,
            "patientId": "5a8d893570292129407f9ba6",
            "serviceId": "5a8f14fb70292129407f9bc8",
            "facilityServiceId": "5a8d661bdb20d527d8e19f8e",
            "description": "",
            "facilityId": "5a8d661bdb20d527d8e19f8c",
            "unitPrice": 5500
          },
          "billingId": "5a9e70eda567394db8b2f2d9"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a8d893570292129407f9ba6",
        "updatedAt": "2018-03-06T11:10:57.008Z",
        "createdAt": "2018-02-21T14:59:01.228Z",
        "personId": "5a8d893470292129407f9ba3",
        "facilityId": "5a8d661bdb20d527d8e19f8c",
        "__v": 0,
        "timeLines": [],
        "clientsNo": [
          {
            "minorLocationId": {
              "description": "",
              "locationId": "59896b6bb3abed2f546bda58",
              "name": "PPP lab",
              "_id": "5a8f132270292129407f9bc2",
              "isActive": true
            },
            "clientNumber": "23"
          },
          {
            "minorLocationId": {
              "description": "",
              "locationId": "59896b6bb3abed2f546bda58",
              "name": "PPP lab",
              "_id": "5a8f132270292129407f9bc2",
              "isActive": true
            },
            "clientNumber": "23"
          },
          {
            "minorLocationId": {
              "_id": "5a8f130270292129407f9bc0",
              "name": "Microbiology",
              "locationId": "59896b6bb3abed2f546bda58",
              "description": "",
              "isActive": true
            },
            "clientNumber": "Lab-0001"
          }
        ],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "_id": "5a8d893570292129407f9ba7",
            "planType": "wallet",
            "isDefault": true,
            "planDetails": false
          }
        ],
        "isActive": false,
        "age": "7 years",
        "personDetails": {
          "_id": "5a8d893470292129407f9ba3",
          "updatedAt": "2018-04-25T11:11:00.899Z",
          "createdAt": "2018-02-21T14:59:00.010Z",
          "title": "Mrs.",
          "firstName": "Foluke",
          "lastName": "Adetola",
          "gender": "Female",
          "dateOfBirth": "2011-02-20T23:00:00.000Z",
          "motherMaidenName": "Waku",
          "primaryContactPhoneNo": "08038974509",
          "wallet": {
            "balance": 7399,
            "ledgerBalance": 7399,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 10000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 10000,
                "ledgerBalance": 10000,
                "createdAt": "2018-03-06T10:47:04.763Z",
                "updatedAt": "2018-03-06T10:47:04.763Z",
                "_id": "5a9e71a8a567394db8b2f2dc",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "sourceType": "Person",
                "refCode": "020534",
                "description": "Funded wallet via e-payment",
                "destinationId": "5a8d893470292129407f9ba3",
                "destinationType": "Person",
                "paidBy": "5a8d671edb20d527d8e19f9d"
              },
              {
                "transactionType": "Dr",
                "amount": 1000,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 9000,
                "ledgerBalance": 9000,
                "createdAt": "2018-03-07T12:58:36.042Z",
                "updatedAt": "2018-03-07T12:58:36.042Z",
                "refCode": "876809",
                "description": "Laboratory-Pregnancy test -blood",
                "_id": "5a9fe1fc6e191d07f897d004"
              },
              {
                "transactionType": "Dr",
                "amount": 1000,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 8000,
                "ledgerBalance": 8000,
                "createdAt": "2018-03-07T13:52:53.294Z",
                "updatedAt": "2018-03-07T13:52:53.294Z",
                "_id": "5a9feeb56e191d07f897d047",
                "description": "Laboratory-Pregnancy test -blood",
                "refCode": "797737"
              },
              {
                "transactionType": "Dr",
                "amount": 600,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 7400,
                "ledgerBalance": 7400,
                "createdAt": "2018-03-09T09:10:21.865Z",
                "updatedAt": "2018-03-09T09:10:21.865Z",
                "refCode": "297063",
                "description": "Laboratory-Pregnancy test -blood",
                "_id": "5aa24f7d6e191d07f897d1bb"
              },
              {
                "transactionType": "Dr",
                "amount": 1,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 7399,
                "ledgerBalance": 7399,
                "createdAt": "2018-04-25T11:11:00.894Z",
                "updatedAt": "2018-04-25T11:11:00.894Z",
                "_id": "5ae062446e73c946200f572a",
                "description": "Laboratory-Reg",
                "refCode": "004134"
              }
            ],
            "createdAt": "2018-02-21T14:59:00.010Z",
            "updatedAt": "2018-02-21T14:59:00.010Z",
            "_id": "5a8d893470292129407f9ba4"
          },
          "apmisId": "PN-57310",
          "__v": 0,
          "email": "fadet@mail.com",
          "homeAddress": {
            "city": "Ikere-Ekiti",
            "country": "Nigeria",
            "lga": "Ekiti East",
            "state": "Ekiti State",
            "street": "24, Dundun Road"
          },
          "nextOfKin": [
            {
              "address": "23 dundun",
              "email": "tolukad@mail.com",
              "fullName": "Tolu Kadejo",
              "phoneNumber": "09085767734",
              "relationship": "Brother"
            }
          ],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": [
            {
              "minorLocationId": {
                "description": "",
                "locationId": "59896b6bb3abed2f546bda58",
                "name": "PPP lab",
                "_id": "5a8f132270292129407f9bc2",
                "isActive": true
              },
              "clientNumber": "23"
            },
            {
              "minorLocationId": {
                "description": "",
                "locationId": "59896b6bb3abed2f546bda58",
                "name": "PPP lab",
                "_id": "5a8f132270292129407f9bc2",
                "isActive": true
              },
              "clientNumber": "23"
            },
            {
              "minorLocationId": {
                "_id": "5a8f130270292129407f9bc0",
                "name": "Microbiology",
                "locationId": "59896b6bb3abed2f546bda58",
                "description": "",
                "isActive": true
              },
              "clientNumber": "Lab-0001"
            }
          ]
        },
        "facilityObj": {
          "name": "SHELL NIGERIA",
          "_id": "5a8d661bdb20d527d8e19f8c",
          "email": "ogunniran.seyi2@gmail.com",
          "primaryContactPhoneNo": "07030212799",
          "shortName": "AHF"
        }
      }
    },
    {
      "_id": "5a9e7edd0ab67e22fc0b063a",
      "updatedAt": "2018-03-06T11:43:25.970Z",
      "createdAt": "2018-03-06T11:43:25.970Z",
      "facilityId": "5a8d661bdb20d527d8e19f8c",
      "patientId": "5a8fe1cc70292129407f9c06",
      "totalDiscount": 0,
      "subTotal": 1000,
      "totalPrice": 1000,
      "balance": 0,
      "invoiceNo": "IV/621/8601",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-06T11:43:25.969Z",
          "balance": 0,
          "paymentMethod": {
            "planDetails": false,
            "isDefault": true,
            "_id": "5a8fe1cc70292129407f9c07",
            "planType": "wallet"
          },
          "description": "Laboratory-Pregnancy test -blood",
          "amountPaid": 1000
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9e7e380ab67e22fc0b0635",
          "billObject": {
            "serviceModifierObject": [],
            "facilityServiceObject": {
              "serviceId": "5a9d206c99fc7d16a8d359ef",
              "service": "Pregnancy test -blood",
              "category": "Laboratory",
              "categoryId": "5a8d661bdb20d527d8e19f95"
            },
            "patientObject": {
              "personDetails": {
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [],
                "updatedAt": "2018-02-23T09:41:30.875Z",
                "createdAt": "2018-02-23T09:41:30.875Z",
                "title": "Master",
                "firstName": "Tobi",
                "lastName": "Alellua",
                "gender": "Male",
                "dateOfBirth": "2000-02-22T23:00:00.000Z",
                "motherMaidenName": "Magareth",
                "primaryContactPhoneNo": "07034615930",
                "wallet": {
                  "balance": 5000,
                  "ledgerBalance": 5000,
                  "transactions": [
                    {
                      "transactionType": "Cr",
                      "amount": 5000,
                      "transactionMedium": "e-payment",
                      "transactionStatus": "Completed",
                      "balance": 5000,
                      "ledgerBalance": 5000,
                      "createdAt": "2018-03-06T11:42:23.300Z",
                      "updatedAt": "2018-03-06T11:42:23.300Z",
                      "_id": "5a9e7e9f0ab67e22fc0b0639",
                      "sourceId": "5a8d671edb20d527d8e19f9d",
                      "sourceType": "Person",
                      "refCode": "057886",
                      "description": "Funded wallet via e-payment",
                      "destinationId": "5a8fe1ca70292129407f9c03",
                      "destinationType": "Person",
                      "paidBy": "5a8d671edb20d527d8e19f9d"
                    }
                  ],
                  "createdAt": "2018-02-23T09:41:30.875Z",
                  "updatedAt": "2018-02-23T09:41:30.875Z",
                  "_id": "5a8fe1ca70292129407f9c04"
                },
                "apmisId": "JP-32981",
                "__v": 0,
                "_id": "5a8fe1ca70292129407f9c03"
              },
              "age": "18 years",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": true,
                  "_id": "5a8fe1cc70292129407f9c07",
                  "planType": "wallet"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8d661bdb20d527d8e19f8c",
              "personId": "5a8fe1ca70292129407f9c03",
              "createdAt": "2018-02-23T09:41:32.000Z",
              "updatedAt": "2018-02-23T09:41:32.000Z",
              "_id": "5a8fe1cc70292129407f9c06"
            },
            "serviceObject": {
              "panels": [],
              "createdAt": "2018-03-05T10:48:12.451Z",
              "updatedAt": "2018-03-05T10:48:12.451Z",
              "name": "Pregnancy test -blood",
              "_id": "5a9d206c99fc7d16a8d359ef"
            },
            "isBearerConfirmed": true,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-06T11:40:40.681Z",
            "updatedAt": "2018-03-06T11:43:25.969Z",
            "_id": "5a9e7e380ab67e22fc0b0636",
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 1000,
            "covered": {
              "coverType": "wallet"
            },
            "quantity": 1,
            "patientId": "5a8fe1cc70292129407f9c06",
            "serviceId": "5a9d206c99fc7d16a8d359ef",
            "facilityServiceId": "5a8d661bdb20d527d8e19f8e",
            "description": "",
            "facilityId": "5a8d661bdb20d527d8e19f8c",
            "unitPrice": 1000
          },
          "billingId": "5a9e7e380ab67e22fc0b0636"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a8fe1cc70292129407f9c06",
        "__v": 0,
        "facilityId": "5a8d661bdb20d527d8e19f8c",
        "personId": "5a8fe1ca70292129407f9c03",
        "createdAt": "2018-02-23T09:41:32.000Z",
        "updatedAt": "2018-03-28T07:53:57.571Z",
        "timeLines": [],
        "clientsNo": [
          {
            "clientNumber": "Lab-0002",
            "minorLocationId": "5a8f132270292129407f9bc2"
          },
          {
            "minorLocationId": {
              "_id": "5a8f132270292129407f9bc2",
              "name": "PPP lab",
              "locationId": "59896b6bb3abed2f546bda58",
              "description": "",
              "isActive": true
            },
            "clientNumber": "Lab-0005"
          }
        ],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planDetails": false,
            "isDefault": true,
            "planType": "wallet",
            "_id": "5a8fe1cc70292129407f9c07"
          }
        ],
        "isActive": false,
        "age": "18 years",
        "personDetails": {
          "_id": "5a8fe1ca70292129407f9c03",
          "__v": 0,
          "apmisId": "JP-32981",
          "wallet": {
            "balance": 3460,
            "ledgerBalance": 3460,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 5000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 5000,
                "ledgerBalance": 5000,
                "createdAt": "2018-03-06T11:42:23.300Z",
                "updatedAt": "2018-03-06T11:42:23.300Z",
                "_id": "5a9e7e9f0ab67e22fc0b0639",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "sourceType": "Person",
                "refCode": "057886",
                "description": "Funded wallet via e-payment",
                "destinationId": "5a8fe1ca70292129407f9c03",
                "destinationType": "Person",
                "paidBy": "5a8d671edb20d527d8e19f9d"
              },
              {
                "transactionType": "Dr",
                "amount": 1000,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 4000,
                "ledgerBalance": 4000,
                "createdAt": "2018-03-06T12:03:53.897Z",
                "updatedAt": "2018-03-06T12:03:53.897Z",
                "_id": "5a9e83a9eb5c742bc09b301d",
                "description": "Laboratory-Pregnancy test -blood",
                "refCode": "134819"
              },
              {
                "transactionType": "Dr",
                "amount": 500,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 3500,
                "ledgerBalance": 3500,
                "createdAt": "2018-03-08T09:17:18.345Z",
                "updatedAt": "2018-03-08T09:17:18.345Z",
                "refCode": "823901",
                "description": "undefined-undefined",
                "_id": "5aa0ff9e6e191d07f897d134"
              },
              {
                "transactionType": "Dr",
                "amount": 40,
                "transactionMedium": "wallet",
                "transactionStatus": "InComplete",
                "balance": 3460,
                "ledgerBalance": 3460,
                "createdAt": "2018-03-08T09:23:07.310Z",
                "updatedAt": "2018-03-08T09:23:07.310Z",
                "_id": "5aa100fb6e191d07f897d136",
                "description": "undefined-undefined",
                "refCode": "875371"
              }
            ],
            "createdAt": "2018-02-23T09:41:30.875Z",
            "updatedAt": "2018-02-23T09:41:30.875Z",
            "_id": "5a8fe1ca70292129407f9c04"
          },
          "primaryContactPhoneNo": "07034615930",
          "motherMaidenName": "Magareth",
          "dateOfBirth": "2000-02-22T23:00:00.000Z",
          "gender": "Male",
          "lastName": "Alellua",
          "firstName": "Tobi",
          "title": "Master",
          "createdAt": "2018-02-23T09:41:30.875Z",
          "updatedAt": "2018-03-08T09:23:07.310Z",
          "nextOfKin": [],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": [
            {
              "clientNumber": "Lab-0002",
              "minorLocationId": "5a8f132270292129407f9bc2"
            },
            {
              "minorLocationId": {
                "_id": "5a8f132270292129407f9bc2",
                "name": "PPP lab",
                "locationId": "59896b6bb3abed2f546bda58",
                "description": "",
                "isActive": true
              },
              "clientNumber": "Lab-0005"
            }
          ]
        },
        "facilityObj": {
          "name": "SHELL NIGERIA",
          "_id": "5a8d661bdb20d527d8e19f8c",
          "email": "ogunniran.seyi2@gmail.com",
          "primaryContactPhoneNo": "07030212799",
          "shortName": "AHF"
        }
      }
    },
    {
      "_id": "5a9e804399fc7d16a8d35ac4",
      "updatedAt": "2018-03-06T11:49:23.245Z",
      "createdAt": "2018-03-06T11:49:23.245Z",
      "facilityId": "5a8d661bdb20d527d8e19f8c",
      "patientId": "5a9d1e8599fc7d16a8d359e8",
      "totalDiscount": 0,
      "subTotal": 500,
      "totalPrice": 500,
      "balance": 0,
      "invoiceNo": "IV/621/538",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-06T11:49:23.245Z",
          "balance": 0,
          "paymentMethod": {
            "planDetails": false,
            "isDefault": true,
            "_id": "5a9d1e8599fc7d16a8d359e9",
            "bearerPersonId": "5a9d1e8399fc7d16a8d359e5",
            "planType": "wallet"
          },
          "description": "undefined-undefined",
          "amountPaid": 500
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9d688499fc7d16a8d35a1f",
          "billObject": {
            "serviceModifierObject": [],
            "patientObject": {
              "personDetails": {
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [],
                "updatedAt": "2018-03-05T10:44:53.273Z",
                "createdAt": "2018-03-05T10:40:03.877Z",
                "title": "Mrs.",
                "firstName": "Ojo",
                "lastName": "Omolola",
                "gender": "Female",
                "dateOfBirth": "2018-03-05T10:39:22.359Z",
                "motherMaidenName": "Susan",
                "primaryContactPhoneNo": "08055128371",
                "wallet": {
                  "balance": 6000,
                  "ledgerBalance": 6000,
                  "transactions": [
                    {
                      "transactionType": "Cr",
                      "amount": 6000,
                      "transactionMedium": "e-payment",
                      "transactionStatus": "Completed",
                      "balance": 6000,
                      "ledgerBalance": 6000,
                      "createdAt": "2018-03-06T11:49:04.030Z",
                      "updatedAt": "2018-03-06T11:49:04.030Z",
                      "_id": "5a9e803099fc7d16a8d35ac3",
                      "sourceId": "5a8d671edb20d527d8e19f9d",
                      "sourceType": "Person",
                      "refCode": "187132",
                      "description": "Funded wallet via e-payment",
                      "destinationId": "5a9d1e8399fc7d16a8d359e5",
                      "destinationType": "Person",
                      "paidBy": "5a8d671edb20d527d8e19f9d"
                    }
                  ],
                  "createdAt": "2018-03-05T10:40:03.861Z",
                  "updatedAt": "2018-03-05T10:40:03.861Z",
                  "_id": "5a9d1e8399fc7d16a8d359e6"
                },
                "apmisId": "RM-5713",
                "__v": 0,
                "homeAddress": {
                  "street": "private",
                  "state": "Ondo State",
                  "lga": "Akoko South-East",
                  "country": "Nigeria",
                  "city": "Oka-Akoko"
                },
                "email": "omolola_susan@gmail.com",
                "_id": "5a9d1e8399fc7d16a8d359e5"
              },
              "age": "1 day",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": true,
                  "_id": "5a9d1e8599fc7d16a8d359e9",
                  "bearerPersonId": "5a9d1e8399fc7d16a8d359e5",
                  "planType": "wallet"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8d661bdb20d527d8e19f8c",
              "personId": "5a9d1e8399fc7d16a8d359e5",
              "createdAt": "2018-03-05T10:40:05.041Z",
              "updatedAt": "2018-03-05T10:40:05.041Z",
              "_id": "5a9d1e8599fc7d16a8d359e8"
            },
            "isBearerConfirmed": false,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-05T15:55:48.023Z",
            "updatedAt": "2018-03-06T11:49:23.230Z",
            "_id": "5a9d688499fc7d16a8d35a20",
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 500,
            "quantity": 1,
            "patientId": "5a9d1e8599fc7d16a8d359e8",
            "serviceId": "5a8f178c70292129407f9bcb",
            "facilityServiceId": "5a8d661bdb20d527d8e19f8e",
            "description": "",
            "facilityId": "5a8d661bdb20d527d8e19f8c",
            "unitPrice": 500
          },
          "billingId": "5a9d688499fc7d16a8d35a20"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a9d1e8599fc7d16a8d359e8",
        "updatedAt": "2018-03-05T10:40:05.041Z",
        "createdAt": "2018-03-05T10:40:05.041Z",
        "personId": "5a9d1e8399fc7d16a8d359e5",
        "facilityId": "5a8d661bdb20d527d8e19f8c",
        "timeLines": [],
        "clientsNo": [],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planType": "wallet",
            "bearerPersonId": "5a9d1e8399fc7d16a8d359e5",
            "_id": "5a9d1e8599fc7d16a8d359e9",
            "isDefault": true,
            "planDetails": false
          }
        ],
        "isActive": false,
        "__v": 0,
        "age": "6 months",
        "personDetails": {
          "_id": "5a9d1e8399fc7d16a8d359e5",
          "email": "omolola_susan@gmail.com",
          "homeAddress": {
            "city": "Oka-Akoko",
            "country": "Nigeria",
            "lga": "Akoko South-East",
            "state": "Ondo State",
            "street": "private"
          },
          "__v": 0,
          "apmisId": "RM-5713",
          "wallet": {
            "balance": 5499,
            "ledgerBalance": 5499,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 6000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 6000,
                "ledgerBalance": 6000,
                "createdAt": "2018-03-06T11:49:04.030Z",
                "updatedAt": "2018-03-06T11:49:04.030Z",
                "paidBy": "5a8d671edb20d527d8e19f9d",
                "destinationType": "Person",
                "destinationId": "5a9d1e8399fc7d16a8d359e5",
                "description": "Funded wallet via e-payment",
                "refCode": "187132",
                "sourceType": "Person",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "_id": "5a9e803099fc7d16a8d35ac3"
              },
              {
                "transactionType": "Dr",
                "amount": 500,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 5500,
                "ledgerBalance": 5500,
                "createdAt": "2018-03-06T11:49:23.495Z",
                "updatedAt": "2018-03-06T11:49:23.495Z",
                "refCode": "696042",
                "description": "undefined-undefined",
                "_id": "5a9e804399fc7d16a8d35ac5"
              },
              {
                "transactionType": "Dr",
                "amount": 1,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 5499,
                "ledgerBalance": 5499,
                "createdAt": "2018-03-06T11:53:42.954Z",
                "updatedAt": "2018-03-06T11:53:42.954Z",
                "_id": "5a9e814699fc7d16a8d35ac8",
                "description": "Medical Records-new registration",
                "refCode": "063976"
              }
            ],
            "createdAt": "2018-03-05T10:40:03.861Z",
            "updatedAt": "2018-03-05T10:40:03.861Z",
            "_id": "5a9d1e8399fc7d16a8d359e6"
          },
          "primaryContactPhoneNo": "08055128371",
          "motherMaidenName": "Susan",
          "dateOfBirth": "2018-03-05T10:39:22.359Z",
          "gender": "Female",
          "lastName": "Omolola",
          "firstName": "Ojo",
          "title": "Mrs.",
          "createdAt": "2018-03-05T10:40:03.877Z",
          "updatedAt": "2018-03-06T11:53:42.954Z",
          "nextOfKin": [],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": []
        },
        "facilityObj": {
          "name": "SHELL NIGERIA",
          "_id": "5a8d661bdb20d527d8e19f8c",
          "email": "ogunniran.seyi2@gmail.com",
          "primaryContactPhoneNo": "07030212799",
          "shortName": "AHF"
        }
      }
    },
    {
      "_id": "5a9e814699fc7d16a8d35ac7",
      "updatedAt": "2018-03-06T11:53:42.693Z",
      "createdAt": "2018-03-06T11:53:42.693Z",
      "facilityId": "5a8d661bdb20d527d8e19f8c",
      "patientId": "5a9d1e8599fc7d16a8d359e8",
      "totalDiscount": 0,
      "subTotal": 1,
      "totalPrice": 1,
      "balance": 0,
      "invoiceNo": "IV/621/8055",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-06T11:53:42.673Z",
          "balance": 0,
          "paymentMethod": {
            "planDetails": false,
            "isDefault": true,
            "_id": "5a9d1e8599fc7d16a8d359e9",
            "bearerPersonId": "5a9d1e8399fc7d16a8d359e5",
            "planType": "wallet"
          },
          "description": "Medical Records-new registration",
          "amountPaid": 1
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9d1e8599fc7d16a8d359ea",
          "billObject": {
            "serviceModifierObject": [],
            "facilityServiceObject": {
              "serviceId": "5a8d886170292129407f9b9c",
              "service": "new registration",
              "category": "Medical Records",
              "categoryId": "5a8d661bdb20d527d8e19f94"
            },
            "patientObject": {
              "personDetails": {
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [],
                "updatedAt": "2018-03-06T11:49:23.495Z",
                "createdAt": "2018-03-05T10:40:03.877Z",
                "title": "Mrs.",
                "firstName": "Ojo",
                "lastName": "Omolola",
                "gender": "Female",
                "dateOfBirth": "2018-03-05T10:39:22.359Z",
                "motherMaidenName": "Susan",
                "primaryContactPhoneNo": "08055128371",
                "wallet": {
                  "_id": "5a9d1e8399fc7d16a8d359e6",
                  "updatedAt": "2018-03-05T10:40:03.861Z",
                  "createdAt": "2018-03-05T10:40:03.861Z",
                  "transactions": [
                    {
                      "paidBy": "5a8d671edb20d527d8e19f9d",
                      "destinationType": "Person",
                      "destinationId": "5a9d1e8399fc7d16a8d359e5",
                      "description": "Funded wallet via e-payment",
                      "refCode": "187132",
                      "sourceType": "Person",
                      "sourceId": "5a8d671edb20d527d8e19f9d",
                      "_id": "5a9e803099fc7d16a8d35ac3",
                      "updatedAt": "2018-03-06T11:49:04.030Z",
                      "createdAt": "2018-03-06T11:49:04.030Z",
                      "ledgerBalance": 6000,
                      "balance": 6000,
                      "transactionStatus": "Completed",
                      "transactionMedium": "e-payment",
                      "amount": 6000,
                      "transactionType": "Cr"
                    },
                    {
                      "refCode": "696042",
                      "description": "undefined-undefined",
                      "_id": "5a9e804399fc7d16a8d35ac5",
                      "updatedAt": "2018-03-06T11:49:23.495Z",
                      "createdAt": "2018-03-06T11:49:23.495Z",
                      "ledgerBalance": 5500,
                      "balance": 5500,
                      "transactionStatus": "Complete",
                      "transactionMedium": "wallet",
                      "amount": 500,
                      "transactionType": "Dr"
                    }
                  ],
                  "ledgerBalance": 5500,
                  "balance": 5500
                },
                "apmisId": "RM-5713",
                "__v": 0,
                "homeAddress": {
                  "street": "private",
                  "state": "Ondo State",
                  "lga": "Akoko South-East",
                  "country": "Nigeria",
                  "city": "Oka-Akoko"
                },
                "email": "omolola_susan@gmail.com",
                "_id": "5a9d1e8399fc7d16a8d359e5"
              },
              "age": "1 day",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": true,
                  "_id": "5a9d1e8599fc7d16a8d359e9",
                  "bearerPersonId": "5a9d1e8399fc7d16a8d359e5",
                  "planType": "wallet"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8d661bdb20d527d8e19f8c",
              "personId": "5a9d1e8399fc7d16a8d359e5",
              "createdAt": "2018-03-05T10:40:05.041Z",
              "updatedAt": "2018-03-05T10:40:05.041Z",
              "_id": "5a9d1e8599fc7d16a8d359e8"
            },
            "serviceObject": {
              "panels": [],
              "createdAt": "2018-02-21T14:55:29.185Z",
              "updatedAt": "2018-02-21T14:55:29.185Z",
              "_id": "5a8d886170292129407f9b9c",
              "code": "102",
              "name": "new registration"
            },
            "isBearerConfirmed": true,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-05T10:40:05.353Z",
            "updatedAt": "2018-03-06T11:53:42.673Z",
            "_id": "5a9d1e8599fc7d16a8d359eb",
            "covered": {
              "coverType": "wallet"
            },
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 1,
            "quantity": 1,
            "patientId": "5a9d1e8599fc7d16a8d359e8",
            "serviceId": "5a8d886170292129407f9b9c",
            "facilityServiceId": "5a8d661bdb20d527d8e19f8e",
            "description": "",
            "facilityId": "5a8d661bdb20d527d8e19f8c",
            "unitPrice": 1
          },
          "billingId": "5a9d1e8599fc7d16a8d359eb"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a9d1e8599fc7d16a8d359e8",
        "updatedAt": "2018-03-05T10:40:05.041Z",
        "createdAt": "2018-03-05T10:40:05.041Z",
        "personId": "5a9d1e8399fc7d16a8d359e5",
        "facilityId": "5a8d661bdb20d527d8e19f8c",
        "timeLines": [],
        "clientsNo": [],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planType": "wallet",
            "bearerPersonId": "5a9d1e8399fc7d16a8d359e5",
            "_id": "5a9d1e8599fc7d16a8d359e9",
            "isDefault": true,
            "planDetails": false
          }
        ],
        "isActive": false,
        "__v": 0,
        "age": "6 months",
        "personDetails": {
          "_id": "5a9d1e8399fc7d16a8d359e5",
          "email": "omolola_susan@gmail.com",
          "homeAddress": {
            "city": "Oka-Akoko",
            "country": "Nigeria",
            "lga": "Akoko South-East",
            "state": "Ondo State",
            "street": "private"
          },
          "__v": 0,
          "apmisId": "RM-5713",
          "wallet": {
            "balance": 5499,
            "ledgerBalance": 5499,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 6000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 6000,
                "ledgerBalance": 6000,
                "createdAt": "2018-03-06T11:49:04.030Z",
                "updatedAt": "2018-03-06T11:49:04.030Z",
                "paidBy": "5a8d671edb20d527d8e19f9d",
                "destinationType": "Person",
                "destinationId": "5a9d1e8399fc7d16a8d359e5",
                "description": "Funded wallet via e-payment",
                "refCode": "187132",
                "sourceType": "Person",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "_id": "5a9e803099fc7d16a8d35ac3"
              },
              {
                "transactionType": "Dr",
                "amount": 500,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 5500,
                "ledgerBalance": 5500,
                "createdAt": "2018-03-06T11:49:23.495Z",
                "updatedAt": "2018-03-06T11:49:23.495Z",
                "refCode": "696042",
                "description": "undefined-undefined",
                "_id": "5a9e804399fc7d16a8d35ac5"
              },
              {
                "transactionType": "Dr",
                "amount": 1,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 5499,
                "ledgerBalance": 5499,
                "createdAt": "2018-03-06T11:53:42.954Z",
                "updatedAt": "2018-03-06T11:53:42.954Z",
                "_id": "5a9e814699fc7d16a8d35ac8",
                "description": "Medical Records-new registration",
                "refCode": "063976"
              }
            ],
            "createdAt": "2018-03-05T10:40:03.861Z",
            "updatedAt": "2018-03-05T10:40:03.861Z",
            "_id": "5a9d1e8399fc7d16a8d359e6"
          },
          "primaryContactPhoneNo": "08055128371",
          "motherMaidenName": "Susan",
          "dateOfBirth": "2018-03-05T10:39:22.359Z",
          "gender": "Female",
          "lastName": "Omolola",
          "firstName": "Ojo",
          "title": "Mrs.",
          "createdAt": "2018-03-05T10:40:03.877Z",
          "updatedAt": "2018-03-06T11:53:42.954Z",
          "nextOfKin": [],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": []
        },
        "facilityObj": {
          "name": "SHELL NIGERIA",
          "_id": "5a8d661bdb20d527d8e19f8c",
          "email": "ogunniran.seyi2@gmail.com",
          "primaryContactPhoneNo": "07030212799",
          "shortName": "AHF"
        }
      }
    },
    {
      "_id": "5a9e83a8eb5c742bc09b301c",
      "updatedAt": "2018-03-06T12:03:52.600Z",
      "createdAt": "2018-03-06T12:03:52.600Z",
      "facilityId": "5a8d661bdb20d527d8e19f8c",
      "patientId": "5a8fe1cc70292129407f9c06",
      "totalDiscount": 0,
      "subTotal": 1000,
      "totalPrice": 1000,
      "balance": 0,
      "invoiceNo": "IV/621/2285",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-06T12:03:52.596Z",
          "balance": 0,
          "paymentMethod": {
            "planDetails": false,
            "isDefault": true,
            "_id": "5a8fe1cc70292129407f9c07",
            "planType": "wallet"
          },
          "description": "Laboratory-Pregnancy test -blood",
          "amountPaid": 1000
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9e8247eb5c742bc09b3019",
          "billObject": {
            "serviceModifierObject": [],
            "facilityServiceObject": {
              "serviceId": "5a9d206c99fc7d16a8d359ef",
              "service": "Pregnancy test -blood",
              "category": "Laboratory",
              "categoryId": "5a8d661bdb20d527d8e19f95"
            },
            "patientObject": {
              "personDetails": {
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [],
                "updatedAt": "2018-02-23T09:41:30.875Z",
                "createdAt": "2018-02-23T09:41:30.875Z",
                "title": "Master",
                "firstName": "Tobi",
                "lastName": "Alellua",
                "gender": "Male",
                "dateOfBirth": "2000-02-22T23:00:00.000Z",
                "motherMaidenName": "Magareth",
                "primaryContactPhoneNo": "07034615930",
                "wallet": {
                  "balance": 5000,
                  "ledgerBalance": 5000,
                  "transactions": [
                    {
                      "transactionType": "Cr",
                      "amount": 5000,
                      "transactionMedium": "e-payment",
                      "transactionStatus": "Completed",
                      "balance": 5000,
                      "ledgerBalance": 5000,
                      "createdAt": "2018-03-06T11:42:23.300Z",
                      "updatedAt": "2018-03-06T11:42:23.300Z",
                      "_id": "5a9e7e9f0ab67e22fc0b0639",
                      "sourceId": "5a8d671edb20d527d8e19f9d",
                      "sourceType": "Person",
                      "refCode": "057886",
                      "description": "Funded wallet via e-payment",
                      "destinationId": "5a8fe1ca70292129407f9c03",
                      "destinationType": "Person",
                      "paidBy": "5a8d671edb20d527d8e19f9d"
                    }
                  ],
                  "createdAt": "2018-02-23T09:41:30.875Z",
                  "updatedAt": "2018-02-23T09:41:30.875Z",
                  "_id": "5a8fe1ca70292129407f9c04"
                },
                "apmisId": "JP-32981",
                "__v": 0,
                "_id": "5a8fe1ca70292129407f9c03"
              },
              "age": "18 years",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": true,
                  "_id": "5a8fe1cc70292129407f9c07",
                  "planType": "wallet"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8d661bdb20d527d8e19f8c",
              "personId": "5a8fe1ca70292129407f9c03",
              "createdAt": "2018-02-23T09:41:32.000Z",
              "updatedAt": "2018-02-23T09:41:32.000Z",
              "_id": "5a8fe1cc70292129407f9c06"
            },
            "serviceObject": {
              "panels": [],
              "createdAt": "2018-03-05T10:48:12.451Z",
              "updatedAt": "2018-03-05T10:48:12.451Z",
              "name": "Pregnancy test -blood",
              "_id": "5a9d206c99fc7d16a8d359ef"
            },
            "isBearerConfirmed": true,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-06T11:57:59.324Z",
            "updatedAt": "2018-03-06T12:03:52.596Z",
            "_id": "5a9e8247eb5c742bc09b301a",
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 1000,
            "covered": {
              "coverType": "wallet"
            },
            "quantity": 1,
            "patientId": "5a8fe1cc70292129407f9c06",
            "serviceId": "5a9d206c99fc7d16a8d359ef",
            "facilityServiceId": "5a8d661bdb20d527d8e19f8e",
            "description": "",
            "facilityId": "5a8d661bdb20d527d8e19f8c",
            "unitPrice": 1000
          },
          "billingId": "5a9e8247eb5c742bc09b301a"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a8fe1cc70292129407f9c06",
        "__v": 0,
        "facilityId": "5a8d661bdb20d527d8e19f8c",
        "personId": "5a8fe1ca70292129407f9c03",
        "createdAt": "2018-02-23T09:41:32.000Z",
        "updatedAt": "2018-03-28T07:53:57.571Z",
        "timeLines": [],
        "clientsNo": [
          {
            "clientNumber": "Lab-0002",
            "minorLocationId": "5a8f132270292129407f9bc2"
          },
          {
            "minorLocationId": {
              "_id": "5a8f132270292129407f9bc2",
              "name": "PPP lab",
              "locationId": "59896b6bb3abed2f546bda58",
              "description": "",
              "isActive": true
            },
            "clientNumber": "Lab-0005"
          }
        ],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planDetails": false,
            "isDefault": true,
            "planType": "wallet",
            "_id": "5a8fe1cc70292129407f9c07"
          }
        ],
        "isActive": false,
        "age": "18 years",
        "personDetails": {
          "_id": "5a8fe1ca70292129407f9c03",
          "__v": 0,
          "apmisId": "JP-32981",
          "wallet": {
            "balance": 3460,
            "ledgerBalance": 3460,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 5000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 5000,
                "ledgerBalance": 5000,
                "createdAt": "2018-03-06T11:42:23.300Z",
                "updatedAt": "2018-03-06T11:42:23.300Z",
                "_id": "5a9e7e9f0ab67e22fc0b0639",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "sourceType": "Person",
                "refCode": "057886",
                "description": "Funded wallet via e-payment",
                "destinationId": "5a8fe1ca70292129407f9c03",
                "destinationType": "Person",
                "paidBy": "5a8d671edb20d527d8e19f9d"
              },
              {
                "transactionType": "Dr",
                "amount": 1000,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 4000,
                "ledgerBalance": 4000,
                "createdAt": "2018-03-06T12:03:53.897Z",
                "updatedAt": "2018-03-06T12:03:53.897Z",
                "_id": "5a9e83a9eb5c742bc09b301d",
                "description": "Laboratory-Pregnancy test -blood",
                "refCode": "134819"
              },
              {
                "transactionType": "Dr",
                "amount": 500,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 3500,
                "ledgerBalance": 3500,
                "createdAt": "2018-03-08T09:17:18.345Z",
                "updatedAt": "2018-03-08T09:17:18.345Z",
                "refCode": "823901",
                "description": "undefined-undefined",
                "_id": "5aa0ff9e6e191d07f897d134"
              },
              {
                "transactionType": "Dr",
                "amount": 40,
                "transactionMedium": "wallet",
                "transactionStatus": "InComplete",
                "balance": 3460,
                "ledgerBalance": 3460,
                "createdAt": "2018-03-08T09:23:07.310Z",
                "updatedAt": "2018-03-08T09:23:07.310Z",
                "_id": "5aa100fb6e191d07f897d136",
                "description": "undefined-undefined",
                "refCode": "875371"
              }
            ],
            "createdAt": "2018-02-23T09:41:30.875Z",
            "updatedAt": "2018-02-23T09:41:30.875Z",
            "_id": "5a8fe1ca70292129407f9c04"
          },
          "primaryContactPhoneNo": "07034615930",
          "motherMaidenName": "Magareth",
          "dateOfBirth": "2000-02-22T23:00:00.000Z",
          "gender": "Male",
          "lastName": "Alellua",
          "firstName": "Tobi",
          "title": "Master",
          "createdAt": "2018-02-23T09:41:30.875Z",
          "updatedAt": "2018-03-08T09:23:07.310Z",
          "nextOfKin": [],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": [
            {
              "clientNumber": "Lab-0002",
              "minorLocationId": "5a8f132270292129407f9bc2"
            },
            {
              "minorLocationId": {
                "_id": "5a8f132270292129407f9bc2",
                "name": "PPP lab",
                "locationId": "59896b6bb3abed2f546bda58",
                "description": "",
                "isActive": true
              },
              "clientNumber": "Lab-0005"
            }
          ]
        },
        "facilityObj": {
          "name": "SHELL NIGERIA",
          "_id": "5a8d661bdb20d527d8e19f8c",
          "email": "ogunniran.seyi2@gmail.com",
          "primaryContactPhoneNo": "07030212799",
          "shortName": "AHF"
        }
      }
    },
    {
      "_id": "5a9e9b6eda30e82d78786a65",
      "updatedAt": "2018-03-08T15:29:12.432Z",
      "createdAt": "2018-03-06T13:45:18.115Z",
      "facilityId": "5a8d661bdb20d527d8e19f8c",
      "patientId": "5a9d6d4f99fc7d16a8d35a25",
      "totalDiscount": 0,
      "subTotal": 1000,
      "totalPrice": 1000,
      "balance": 0,
      "invoiceNo": "IV/621/7177",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "amountPaid": 0,
          "paymentMethod": {
            "planType": "waved",
            "reason": "poor"
          },
          "description": "Laboratory - Pregnancy test -blood",
          "balance": 1000,
          "createdAt": "2018-03-06T15:51:22.928Z"
        },
        {
          "amountPaid": 0,
          "paymentMethod": {
            "planType": "waved",
            "reason": ""
          },
          "description": "Laboratory - Pregnancy test -blood",
          "balance": 1000,
          "createdAt": "2018-03-07T12:34:06.138Z"
        },
        {
          "amountPaid": 0,
          "paymentMethod": {
            "planType": "waved",
            "reason": "motherless"
          },
          "description": "Laboratory - Pregnancy test -blood",
          "balance": 1000,
          "createdAt": "2018-03-07T12:45:02.521Z"
        },
        {
          "amountPaid": 850,
          "paymentMethod": {
            "planType": "wallet",
            "bearerPersonId": "5a9d6d4e99fc7d16a8d35a22",
            "_id": "5a9d6d4f99fc7d16a8d35a26",
            "isDefault": true,
            "planDetails": false,
            "reason": null
          },
          "description": "Laboratory - Pregnancy test -blood",
          "balance": 150,
          "createdAt": "2018-03-07T12:47:57.782Z"
        },
        {
          "amountPaid": 150,
          "paymentMethod": {
            "planType": "wallet",
            "bearerPersonId": "5a9d6d4e99fc7d16a8d35a22",
            "_id": "5a9d6d4f99fc7d16a8d35a26",
            "isDefault": true,
            "planDetails": false,
            "reason": null
          },
          "description": "Laboratory - Pregnancy test -blood",
          "balance": 0,
          "createdAt": "2018-03-08T15:29:12.432Z"
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9d704f99fc7d16a8d35a34",
          "billObject": {
            "serviceModifierObject": [],
            "facilityServiceObject": {
              "serviceId": "5a9d206c99fc7d16a8d359ef",
              "service": "Pregnancy test -blood",
              "category": "Laboratory",
              "categoryId": "5a8d661bdb20d527d8e19f95"
            },
            "patientObject": {
              "personDetails": {
                "email": "jerryjayjerry@yahoo.com",
                "homeAddress": {
                  "street": "9 library avenue, ikot ekpene",
                  "state": "Akwa Ibom State",
                  "lga": "Ikot Abasi",
                  "country": "Nigeria",
                  "city": "Ikot Ekpene"
                },
                "__v": 0,
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [],
                "apmisId": "EF-1228",
                "wallet": {
                  "_id": "5a9d6d4e99fc7d16a8d35a23",
                  "updatedAt": "2018-03-05T16:16:14.076Z",
                  "createdAt": "2018-03-05T16:16:14.076Z",
                  "transactions": [],
                  "ledgerBalance": 0,
                  "balance": 0
                },
                "primaryContactPhoneNo": "08068800237",
                "motherMaidenName": "Yori",
                "dateOfBirth": "2000-03-04T23:00:00.000Z",
                "gender": "Male",
                "lastName": "Jerry",
                "firstName": "Jeremiah",
                "title": "Mr.",
                "createdAt": "2018-03-05T16:16:14.076Z",
                "updatedAt": "2018-03-05T16:18:48.803Z",
                "_id": "5a9d6d4e99fc7d16a8d35a22"
              },
              "age": "18 years",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": true,
                  "_id": "5a9d6d4f99fc7d16a8d35a26",
                  "bearerPersonId": "5a9d6d4e99fc7d16a8d35a22",
                  "planType": "wallet"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8d661bdb20d527d8e19f8c",
              "personId": "5a9d6d4e99fc7d16a8d35a22",
              "createdAt": "2018-03-05T16:16:15.341Z",
              "updatedAt": "2018-03-05T16:16:15.341Z",
              "_id": "5a9d6d4f99fc7d16a8d35a25"
            },
            "serviceObject": {
              "panels": [],
              "createdAt": "2018-03-05T10:48:12.451Z",
              "updatedAt": "2018-03-05T10:48:12.451Z",
              "name": "Pregnancy test -blood",
              "_id": "5a9d206c99fc7d16a8d359ef"
            },
            "isBearerConfirmed": false,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-05T16:29:03.712Z",
            "updatedAt": "2018-03-05T16:29:03.712Z",
            "_id": "5a9d704f99fc7d16a8d35a35",
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 1000,
            "quantity": 1,
            "patientId": "5a9d6d4f99fc7d16a8d35a25",
            "serviceId": "5a9d206c99fc7d16a8d359ef",
            "facilityServiceId": "5a8d661bdb20d527d8e19f8e",
            "description": "",
            "facilityId": "5a8d661bdb20d527d8e19f8c",
            "unitPrice": 1000
          },
          "billingId": "5a9d704f99fc7d16a8d35a35"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a9d6d4f99fc7d16a8d35a25",
        "updatedAt": "2018-03-05T16:16:15.341Z",
        "createdAt": "2018-03-05T16:16:15.341Z",
        "personId": "5a9d6d4e99fc7d16a8d35a22",
        "facilityId": "5a8d661bdb20d527d8e19f8c",
        "timeLines": [],
        "clientsNo": [],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planType": "wallet",
            "bearerPersonId": "5a9d6d4e99fc7d16a8d35a22",
            "_id": "5a9d6d4f99fc7d16a8d35a26",
            "isDefault": true,
            "planDetails": false
          }
        ],
        "isActive": false,
        "__v": 0,
        "age": "18 years",
        "personDetails": {
          "_id": "5a9d6d4e99fc7d16a8d35a22",
          "email": "jerryjayjerry@yahoo.com",
          "homeAddress": {
            "city": "Ikot Ekpene",
            "country": "Nigeria",
            "lga": "Ikot Abasi",
            "state": "Akwa Ibom State",
            "street": "9 library avenue, ikot ekpene"
          },
          "__v": 0,
          "apmisId": "EF-1228",
          "wallet": {
            "balance": 8999,
            "ledgerBalance": 8999,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 10000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 10000,
                "ledgerBalance": 10000,
                "createdAt": "2018-03-07T12:47:03.812Z",
                "updatedAt": "2018-03-07T12:47:03.812Z",
                "_id": "5a9fdf476e191d07f897cff6",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "sourceType": "Person",
                "refCode": "898451",
                "description": "Funded wallet via e-payment",
                "destinationId": "5a9d6d4e99fc7d16a8d35a22",
                "destinationType": "Person",
                "paidBy": "5a8d671edb20d527d8e19f9d"
              },
              {
                "transactionType": "Dr",
                "amount": 850,
                "transactionMedium": "wallet",
                "transactionStatus": "InComplete",
                "balance": 9150,
                "ledgerBalance": 9150,
                "createdAt": "2018-03-07T12:47:58.193Z",
                "updatedAt": "2018-03-07T12:47:58.193Z",
                "_id": "5a9fdf7e6e191d07f897cffa",
                "description": "Laboratory - Pregnancy test -blood",
                "refCode": "380526"
              },
              {
                "transactionType": "Dr",
                "amount": 1,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 9149,
                "ledgerBalance": 9149,
                "createdAt": "2018-03-07T12:48:22.707Z",
                "updatedAt": "2018-03-07T12:48:22.707Z",
                "refCode": "897641",
                "description": "Medical Records - new registration",
                "_id": "5a9fdf966e191d07f897cffb"
              },
              {
                "transactionType": "Dr",
                "amount": 150,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 8999,
                "ledgerBalance": 8999,
                "createdAt": "2018-03-08T15:29:12.852Z",
                "updatedAt": "2018-03-08T15:29:12.852Z",
                "_id": "5aa156c86e191d07f897d199",
                "description": "Laboratory - Pregnancy test -blood",
                "refCode": "438705"
              }
            ],
            "createdAt": "2018-03-05T16:16:14.076Z",
            "updatedAt": "2018-03-05T16:16:14.076Z",
            "_id": "5a9d6d4e99fc7d16a8d35a23"
          },
          "primaryContactPhoneNo": "08068800237",
          "motherMaidenName": "Yori",
          "dateOfBirth": "2000-03-04T23:00:00.000Z",
          "gender": "Male",
          "lastName": "Jerry",
          "firstName": "Jeremiah",
          "title": "Mr.",
          "createdAt": "2018-03-05T16:16:14.076Z",
          "updatedAt": "2018-03-08T15:29:12.868Z",
          "nextOfKin": [],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": []
        },
        "facilityObj": {
          "name": "SHELL NIGERIA",
          "_id": "5a8d661bdb20d527d8e19f8c",
          "email": "ogunniran.seyi2@gmail.com",
          "primaryContactPhoneNo": "07030212799",
          "shortName": "AHF"
        }
      }
    },
    {
      "_id": "5a9eab21dc8a1e2b20636de8",
      "updatedAt": "2018-03-07T12:48:22.191Z",
      "createdAt": "2018-03-06T14:52:17.301Z",
      "facilityId": "5a8d661bdb20d527d8e19f8c",
      "patientId": "5a9d6d4f99fc7d16a8d35a25",
      "totalDiscount": 0,
      "subTotal": 1,
      "totalPrice": 1,
      "balance": 0,
      "invoiceNo": "IV/621/174",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-06T14:52:17.289Z",
          "balance": 1,
          "paymentMethod": {
            "reason": "poor",
            "planType": "waved"
          },
          "description": "Medical Records-new registration",
          "amountPaid": 0
        },
        {
          "amountPaid": 0,
          "paymentMethod": {
            "planType": "waved",
            "reason": ""
          },
          "description": "Medical Records - new registration",
          "balance": 1,
          "createdAt": "2018-03-06T19:08:48.953Z"
        },
        {
          "amountPaid": 1,
          "paymentMethod": {
            "planType": "wallet",
            "bearerPersonId": "5a9d6d4e99fc7d16a8d35a22",
            "_id": "5a9d6d4f99fc7d16a8d35a26",
            "isDefault": true,
            "planDetails": false,
            "reason": null
          },
          "description": "Medical Records - new registration",
          "balance": 0,
          "createdAt": "2018-03-07T12:48:22.191Z"
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9d6d5099fc7d16a8d35a27",
          "billObject": {
            "serviceModifierObject": [],
            "facilityServiceObject": {
              "serviceId": "5a8d886170292129407f9b9c",
              "service": "new registration",
              "category": "Medical Records",
              "categoryId": "5a8d661bdb20d527d8e19f94"
            },
            "patientObject": {
              "personDetails": {
                "email": "jerryjayjerry@yahoo.com",
                "homeAddress": {
                  "street": "9 library avenue, ikot ekpene",
                  "state": "Akwa Ibom State",
                  "lga": "Ikot Abasi",
                  "country": "Nigeria",
                  "city": "Ikot Ekpene"
                },
                "__v": 0,
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [],
                "apmisId": "EF-1228",
                "wallet": {
                  "_id": "5a9d6d4e99fc7d16a8d35a23",
                  "updatedAt": "2018-03-05T16:16:14.076Z",
                  "createdAt": "2018-03-05T16:16:14.076Z",
                  "transactions": [],
                  "ledgerBalance": 0,
                  "balance": 0
                },
                "primaryContactPhoneNo": "08068800237",
                "motherMaidenName": "Yori",
                "dateOfBirth": "2000-03-04T23:00:00.000Z",
                "gender": "Male",
                "lastName": "Jerry",
                "firstName": "Jeremiah",
                "title": "Mr.",
                "createdAt": "2018-03-05T16:16:14.076Z",
                "updatedAt": "2018-03-05T16:18:48.803Z",
                "_id": "5a9d6d4e99fc7d16a8d35a22"
              },
              "age": "18 years",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": true,
                  "_id": "5a9d6d4f99fc7d16a8d35a26",
                  "bearerPersonId": "5a9d6d4e99fc7d16a8d35a22",
                  "planType": "wallet"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8d661bdb20d527d8e19f8c",
              "personId": "5a9d6d4e99fc7d16a8d35a22",
              "createdAt": "2018-03-05T16:16:15.341Z",
              "updatedAt": "2018-03-05T16:16:15.341Z",
              "_id": "5a9d6d4f99fc7d16a8d35a25"
            },
            "serviceObject": {
              "panels": [],
              "createdAt": "2018-02-21T14:55:29.185Z",
              "updatedAt": "2018-02-21T14:55:29.185Z",
              "_id": "5a8d886170292129407f9b9c",
              "code": "102",
              "name": "new registration"
            },
            "isBearerConfirmed": true,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-05T16:16:16.232Z",
            "updatedAt": "2018-03-06T14:52:17.289Z",
            "_id": "5a9d6d5099fc7d16a8d35a28",
            "covered": {
              "coverType": "wallet"
            },
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 1,
            "quantity": 1,
            "patientId": "5a9d6d4f99fc7d16a8d35a25",
            "serviceId": "5a8d886170292129407f9b9c",
            "facilityServiceId": "5a8d661bdb20d527d8e19f8e",
            "description": "",
            "facilityId": "5a8d661bdb20d527d8e19f8c",
            "unitPrice": 1
          },
          "billingId": "5a9d6d5099fc7d16a8d35a28"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a9d6d4f99fc7d16a8d35a25",
        "updatedAt": "2018-03-05T16:16:15.341Z",
        "createdAt": "2018-03-05T16:16:15.341Z",
        "personId": "5a9d6d4e99fc7d16a8d35a22",
        "facilityId": "5a8d661bdb20d527d8e19f8c",
        "timeLines": [],
        "clientsNo": [],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planType": "wallet",
            "bearerPersonId": "5a9d6d4e99fc7d16a8d35a22",
            "_id": "5a9d6d4f99fc7d16a8d35a26",
            "isDefault": true,
            "planDetails": false
          }
        ],
        "isActive": false,
        "__v": 0,
        "age": "18 years",
        "personDetails": {
          "_id": "5a9d6d4e99fc7d16a8d35a22",
          "email": "jerryjayjerry@yahoo.com",
          "homeAddress": {
            "city": "Ikot Ekpene",
            "country": "Nigeria",
            "lga": "Ikot Abasi",
            "state": "Akwa Ibom State",
            "street": "9 library avenue, ikot ekpene"
          },
          "__v": 0,
          "apmisId": "EF-1228",
          "wallet": {
            "balance": 8999,
            "ledgerBalance": 8999,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 10000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 10000,
                "ledgerBalance": 10000,
                "createdAt": "2018-03-07T12:47:03.812Z",
                "updatedAt": "2018-03-07T12:47:03.812Z",
                "_id": "5a9fdf476e191d07f897cff6",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "sourceType": "Person",
                "refCode": "898451",
                "description": "Funded wallet via e-payment",
                "destinationId": "5a9d6d4e99fc7d16a8d35a22",
                "destinationType": "Person",
                "paidBy": "5a8d671edb20d527d8e19f9d"
              },
              {
                "transactionType": "Dr",
                "amount": 850,
                "transactionMedium": "wallet",
                "transactionStatus": "InComplete",
                "balance": 9150,
                "ledgerBalance": 9150,
                "createdAt": "2018-03-07T12:47:58.193Z",
                "updatedAt": "2018-03-07T12:47:58.193Z",
                "_id": "5a9fdf7e6e191d07f897cffa",
                "description": "Laboratory - Pregnancy test -blood",
                "refCode": "380526"
              },
              {
                "transactionType": "Dr",
                "amount": 1,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 9149,
                "ledgerBalance": 9149,
                "createdAt": "2018-03-07T12:48:22.707Z",
                "updatedAt": "2018-03-07T12:48:22.707Z",
                "refCode": "897641",
                "description": "Medical Records - new registration",
                "_id": "5a9fdf966e191d07f897cffb"
              },
              {
                "transactionType": "Dr",
                "amount": 150,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 8999,
                "ledgerBalance": 8999,
                "createdAt": "2018-03-08T15:29:12.852Z",
                "updatedAt": "2018-03-08T15:29:12.852Z",
                "_id": "5aa156c86e191d07f897d199",
                "description": "Laboratory - Pregnancy test -blood",
                "refCode": "438705"
              }
            ],
            "createdAt": "2018-03-05T16:16:14.076Z",
            "updatedAt": "2018-03-05T16:16:14.076Z",
            "_id": "5a9d6d4e99fc7d16a8d35a23"
          },
          "primaryContactPhoneNo": "08068800237",
          "motherMaidenName": "Yori",
          "dateOfBirth": "2000-03-04T23:00:00.000Z",
          "gender": "Male",
          "lastName": "Jerry",
          "firstName": "Jeremiah",
          "title": "Mr.",
          "createdAt": "2018-03-05T16:16:14.076Z",
          "updatedAt": "2018-03-08T15:29:12.868Z",
          "nextOfKin": [],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": []
        },
        "facilityObj": {
          "name": "SHELL NIGERIA",
          "_id": "5a8d661bdb20d527d8e19f8c",
          "email": "ogunniran.seyi2@gmail.com",
          "primaryContactPhoneNo": "07030212799",
          "shortName": "AHF"
        }
      }
    },
    {
      "_id": "5a9eba5e71c21123a8ab8ee3",
      "updatedAt": "2018-03-07T12:40:12.568Z",
      "createdAt": "2018-03-06T15:57:18.741Z",
      "facilityId": "5a8d661bdb20d527d8e19f8c",
      "patientId": "5a9d78c699fc7d16a8d35a53",
      "totalDiscount": 0,
      "subTotal": 1,
      "totalPrice": 1,
      "balance": 0,
      "invoiceNo": "IV/621/1769",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "amountPaid": 0,
          "paymentMethod": {
            "planType": "waved",
            "reason": ""
          },
          "description": "Medical Records - new registration",
          "balance": 1,
          "createdAt": "2018-03-07T12:38:34.350Z"
        },
        {
          "amountPaid": 1,
          "paymentMethod": {
            "planType": "wallet",
            "bearerPersonId": "5a9d78c499fc7d16a8d35a50",
            "_id": "5a9d78c699fc7d16a8d35a54",
            "isDefault": true,
            "planDetails": false,
            "reason": null
          },
          "description": "Medical Records - new registration",
          "balance": 0,
          "createdAt": "2018-03-07T12:40:12.552Z"
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9d78c699fc7d16a8d35a55",
          "billObject": {
            "serviceModifierObject": [],
            "facilityServiceObject": {
              "serviceId": "5a8d886170292129407f9b9c",
              "service": "new registration",
              "category": "Medical Records",
              "categoryId": "5a8d661bdb20d527d8e19f94"
            },
            "patientObject": {
              "personDetails": {
                "email": "juytrfff@yahoo.co.uk",
                "homeAddress": {
                  "street": "7okon lane uyo",
                  "state": "Akwa Ibom State",
                  "lga": "Uyo",
                  "country": "Nigeria",
                  "city": "Uyo"
                },
                "__v": 0,
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [
                  {
                    "relationship": "Son",
                    "phoneNumber": "08065421354",
                    "fullName": "IME OKON AKPAN",
                    "email": "",
                    "address": "6UYO ROAD,UYO"
                  }
                ],
                "apmisId": "HL-96896",
                "wallet": {
                  "_id": "5a9d78c499fc7d16a8d35a51",
                  "updatedAt": "2018-03-05T17:05:08.772Z",
                  "createdAt": "2018-03-05T17:05:08.772Z",
                  "transactions": [],
                  "ledgerBalance": 0,
                  "balance": 0
                },
                "primaryContactPhoneNo": "08024125476",
                "motherMaidenName": "Vera Luke",
                "dateOfBirth": "1982-01-23T23:00:00.000Z",
                "gender": "Male",
                "lastName": "Okon",
                "firstName": "Imoh",
                "title": "Mr.",
                "createdAt": "2018-03-05T17:05:08.772Z",
                "updatedAt": "2018-03-05T17:14:13.042Z",
                "_id": "5a9d78c499fc7d16a8d35a50"
              },
              "age": "36 years",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": true,
                  "_id": "5a9d78c699fc7d16a8d35a54",
                  "bearerPersonId": "5a9d78c499fc7d16a8d35a50",
                  "planType": "wallet"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8d661bdb20d527d8e19f8c",
              "personId": "5a9d78c499fc7d16a8d35a50",
              "createdAt": "2018-03-05T17:05:10.209Z",
              "updatedAt": "2018-03-05T17:05:10.209Z",
              "_id": "5a9d78c699fc7d16a8d35a53"
            },
            "serviceObject": {
              "panels": [],
              "createdAt": "2018-02-21T14:55:29.185Z",
              "updatedAt": "2018-02-21T14:55:29.185Z",
              "_id": "5a8d886170292129407f9b9c",
              "code": "102",
              "name": "new registration"
            },
            "isBearerConfirmed": true,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-05T17:05:10.698Z",
            "updatedAt": "2018-03-05T17:05:10.698Z",
            "_id": "5a9d78c699fc7d16a8d35a56",
            "covered": {
              "coverType": "wallet"
            },
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 1,
            "quantity": 1,
            "patientId": "5a9d78c699fc7d16a8d35a53",
            "serviceId": "5a8d886170292129407f9b9c",
            "facilityServiceId": "5a8d661bdb20d527d8e19f8e",
            "description": "",
            "facilityId": "5a8d661bdb20d527d8e19f8c",
            "unitPrice": 1
          },
          "billingId": "5a9d78c699fc7d16a8d35a56"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a9d78c699fc7d16a8d35a53",
        "updatedAt": "2018-03-09T14:18:45.555Z",
        "createdAt": "2018-03-05T17:05:10.209Z",
        "personId": "5a9d78c499fc7d16a8d35a50",
        "facilityId": "5a8d661bdb20d527d8e19f8c",
        "timeLines": [],
        "clientsNo": [
          {
            "clientNumber": "N/A",
            "minorLocationId": "5a8f132270292129407f9bc2"
          }
        ],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planDetails": false,
            "isDefault": true,
            "_id": "5a9d78c699fc7d16a8d35a54",
            "bearerPersonId": "5a9d78c499fc7d16a8d35a50",
            "planType": "wallet"
          }
        ],
        "isActive": false,
        "__v": 0,
        "age": "36 years",
        "personDetails": {
          "_id": "5a9d78c499fc7d16a8d35a50",
          "updatedAt": "2018-06-28T14:10:46.591Z",
          "createdAt": "2018-03-05T17:05:08.772Z",
          "title": "Mr.",
          "firstName": "Imoh",
          "lastName": "Okon",
          "gender": "Male",
          "dateOfBirth": "1982-01-23T23:00:00.000Z",
          "motherMaidenName": "Vera Luke",
          "primaryContactPhoneNo": "08024125476",
          "wallet": {
            "balance": 5499,
            "ledgerBalance": 5499,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 5000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 5000,
                "ledgerBalance": 5000,
                "createdAt": "2018-03-07T12:19:11.362Z",
                "updatedAt": "2018-03-07T12:19:11.362Z",
                "paidBy": "5a8d671edb20d527d8e19f9d",
                "destinationType": "Person",
                "destinationId": "5a9d78c499fc7d16a8d35a50",
                "description": "Funded wallet via e-payment",
                "refCode": "645866",
                "sourceType": "Person",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "_id": "5a9fd8bf6e191d07f897cfee"
              },
              {
                "transactionType": "Cr",
                "amount": 6000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 11000,
                "ledgerBalance": 11000,
                "createdAt": "2018-03-07T12:23:33.077Z",
                "updatedAt": "2018-03-07T12:23:33.077Z",
                "_id": "5a9fd9c56e191d07f897cff0",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "sourceType": "Person",
                "refCode": "786210",
                "description": "Funded wallet via e-payment",
                "destinationId": "5a9d78c499fc7d16a8d35a50",
                "destinationType": "Person",
                "paidBy": "5a8d671edb20d527d8e19f9d"
              },
              {
                "transactionType": "Dr",
                "amount": 1,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 10999,
                "ledgerBalance": 10999,
                "createdAt": "2018-03-07T12:40:12.974Z",
                "updatedAt": "2018-03-07T12:40:12.974Z",
                "_id": "5a9fddac6e191d07f897cff3",
                "description": "Medical Records - new registration",
                "refCode": "993462"
              },
              {
                "transactionType": "Dr",
                "amount": 0,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 10999,
                "ledgerBalance": 10999,
                "createdAt": "2018-06-28T14:10:26.951Z",
                "updatedAt": "2018-06-28T14:10:26.951Z",
                "refCode": "840675",
                "description": "",
                "_id": "5b34ec5222dbe44efcdd949b"
              },
              {
                "transactionType": "Dr",
                "amount": 5500,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 5499,
                "ledgerBalance": 5499,
                "createdAt": "2018-06-28T14:10:46.591Z",
                "updatedAt": "2018-06-28T14:10:46.591Z",
                "_id": "5b34ec6622dbe44efcdd949d",
                "description": "",
                "refCode": "368250"
              }
            ],
            "createdAt": "2018-03-05T17:05:08.772Z",
            "updatedAt": "2018-03-05T17:05:08.772Z",
            "_id": "5a9d78c499fc7d16a8d35a51"
          },
          "apmisId": "HL-96896",
          "__v": 0,
          "homeAddress": {
            "city": "Uyo",
            "country": "Nigeria",
            "lga": "Uyo",
            "state": "Akwa Ibom State",
            "street": "7okon lane uyo"
          },
          "email": "juytrfff@yahoo.co.uk",
          "nextOfKin": [
            {
              "address": "6UYO ROAD,UYO",
              "email": "",
              "fullName": "IME OKON AKPAN",
              "phoneNumber": "08065421354",
              "relationship": "Son"
            }
          ],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": [
            {
              "clientNumber": "N/A",
              "minorLocationId": "5a8f132270292129407f9bc2"
            }
          ]
        },
        "facilityObj": {
          "name": "SHELL NIGERIA",
          "_id": "5a8d661bdb20d527d8e19f8c",
          "email": "ogunniran.seyi2@gmail.com",
          "primaryContactPhoneNo": "07030212799",
          "shortName": "AHF"
        }
      }
    },
    {
      "_id": "5a9ebb2371c21123a8ab8ee9",
      "updatedAt": "2018-03-06T16:00:35.957Z",
      "createdAt": "2018-03-06T16:00:35.957Z",
      "facilityId": "5a8d661bdb20d527d8e19f8c",
      "patientId": "5a9422c09bbfc825101d915c",
      "totalDiscount": 0,
      "subTotal": 1000,
      "totalPrice": 1000,
      "balance": 0,
      "invoiceNo": "IV/621/7083",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-06T16:00:35.941Z",
          "balance": 0,
          "paymentMethod": {
            "planDetails": false,
            "isDefault": true,
            "_id": "5a9422c09bbfc825101d915d",
            "planType": "wallet"
          },
          "description": "Laboratory-Pregnancy test -blood",
          "amountPaid": 1000
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9ebabe71c21123a8ab8ee4",
          "billObject": {
            "serviceModifierObject": [],
            "facilityServiceObject": {
              "serviceId": "5a9d206c99fc7d16a8d359ef",
              "service": "Pregnancy test -blood",
              "category": "Laboratory",
              "categoryId": "5a8d661bdb20d527d8e19f95"
            },
            "patientObject": {
              "personDetails": {
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [],
                "updatedAt": "2018-02-26T15:07:43.650Z",
                "createdAt": "2018-02-26T15:07:43.650Z",
                "title": "Mr.",
                "firstName": "Kunle",
                "lastName": "Ogunlesi",
                "gender": "Male",
                "dateOfBirth": "1954-02-25T23:00:00.000Z",
                "motherMaidenName": "Ogunwale",
                "primaryContactPhoneNo": "08134647539",
                "wallet": {
                  "balance": 6000,
                  "ledgerBalance": 6000,
                  "transactions": [
                    {
                      "transactionType": "Cr",
                      "amount": 6000,
                      "transactionMedium": "e-payment",
                      "transactionStatus": "Completed",
                      "balance": 6000,
                      "ledgerBalance": 6000,
                      "createdAt": "2018-03-06T15:59:56.222Z",
                      "updatedAt": "2018-03-06T15:59:56.222Z",
                      "_id": "5a9ebafc71c21123a8ab8ee8",
                      "sourceId": "5a8d671edb20d527d8e19f9d",
                      "sourceType": "Person",
                      "refCode": "540519",
                      "description": "Funded wallet via e-payment",
                      "destinationId": "5a9422bf9bbfc825101d9159",
                      "destinationType": "Person",
                      "paidBy": "5a8d671edb20d527d8e19f9d"
                    }
                  ],
                  "createdAt": "2018-02-26T15:07:43.650Z",
                  "updatedAt": "2018-02-26T15:07:43.650Z",
                  "_id": "5a9422bf9bbfc825101d915a"
                },
                "apmisId": "QS-88822",
                "__v": 0,
                "_id": "5a9422bf9bbfc825101d9159"
              },
              "age": "64 years",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": true,
                  "_id": "5a9422c09bbfc825101d915d",
                  "planType": "wallet"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8d661bdb20d527d8e19f8c",
              "personId": "5a9422bf9bbfc825101d9159",
              "createdAt": "2018-02-26T15:07:44.884Z",
              "updatedAt": "2018-02-26T15:07:44.884Z",
              "_id": "5a9422c09bbfc825101d915c"
            },
            "serviceObject": {
              "panels": [],
              "createdAt": "2018-03-05T10:48:12.451Z",
              "updatedAt": "2018-03-05T10:48:12.451Z",
              "name": "Pregnancy test -blood",
              "_id": "5a9d206c99fc7d16a8d359ef"
            },
            "isBearerConfirmed": true,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-06T15:58:54.688Z",
            "updatedAt": "2018-03-06T16:00:35.941Z",
            "_id": "5a9ebabe71c21123a8ab8ee5",
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 1000,
            "covered": {
              "coverType": "wallet"
            },
            "quantity": 1,
            "patientId": "5a9422c09bbfc825101d915c",
            "serviceId": "5a9d206c99fc7d16a8d359ef",
            "facilityServiceId": "5a8d661bdb20d527d8e19f8e",
            "description": "",
            "facilityId": "5a8d661bdb20d527d8e19f8c",
            "unitPrice": 1000
          },
          "billingId": "5a9ebabe71c21123a8ab8ee5"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a9422c09bbfc825101d915c",
        "updatedAt": "2018-02-26T15:07:44.884Z",
        "createdAt": "2018-02-26T15:07:44.884Z",
        "personId": "5a9422bf9bbfc825101d9159",
        "facilityId": "5a8d661bdb20d527d8e19f8c",
        "timeLines": [],
        "clientsNo": [],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planType": "wallet",
            "_id": "5a9422c09bbfc825101d915d",
            "isDefault": true,
            "planDetails": false
          }
        ],
        "isActive": false,
        "__v": 0,
        "age": "64 years",
        "personDetails": {
          "_id": "5a9422bf9bbfc825101d9159",
          "__v": 0,
          "apmisId": "QS-88822",
          "wallet": {
            "balance": 4997,
            "ledgerBalance": 4997,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 6000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 6000,
                "ledgerBalance": 6000,
                "createdAt": "2018-03-06T15:59:56.222Z",
                "updatedAt": "2018-03-06T15:59:56.222Z",
                "_id": "5a9ebafc71c21123a8ab8ee8",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "sourceType": "Person",
                "refCode": "540519",
                "description": "Funded wallet via e-payment",
                "destinationId": "5a9422bf9bbfc825101d9159",
                "destinationType": "Person",
                "paidBy": "5a8d671edb20d527d8e19f9d"
              },
              {
                "transactionType": "Dr",
                "amount": 1000,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 5000,
                "ledgerBalance": 5000,
                "createdAt": "2018-03-06T16:00:36.222Z",
                "updatedAt": "2018-03-06T16:00:36.222Z",
                "_id": "5a9ebb2471c21123a8ab8eea",
                "description": "Laboratory-Pregnancy test -blood",
                "refCode": "696818"
              },
              {
                "transactionType": "Dr",
                "amount": 2,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 4998,
                "ledgerBalance": 4998,
                "createdAt": "2018-04-24T10:17:06.059Z",
                "updatedAt": "2018-04-24T10:17:06.059Z",
                "refCode": "607338",
                "description": "Appointment - consultationAppointment - General consultation",
                "_id": "5adf04220d890b183c3bb833"
              },
              {
                "transactionType": "Dr",
                "amount": 1,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 4997,
                "ledgerBalance": 4997,
                "createdAt": "2018-04-24T16:28:05.608Z",
                "updatedAt": "2018-04-24T16:28:05.608Z",
                "_id": "5adf5b150d890b183c3bb86d",
                "description": "Appointment-consultation",
                "refCode": "759698"
              }
            ],
            "createdAt": "2018-02-26T15:07:43.650Z",
            "updatedAt": "2018-02-26T15:07:43.650Z",
            "_id": "5a9422bf9bbfc825101d915a"
          },
          "primaryContactPhoneNo": "08134647539",
          "motherMaidenName": "Ogunwale",
          "dateOfBirth": "1954-02-25T23:00:00.000Z",
          "gender": "Male",
          "lastName": "Ogunlesi",
          "firstName": "Kunle",
          "title": "Mr.",
          "createdAt": "2018-02-26T15:07:43.650Z",
          "updatedAt": "2018-04-24T16:28:05.608Z",
          "nextOfKin": [],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": []
        },
        "facilityObj": {
          "name": "SHELL NIGERIA",
          "_id": "5a8d661bdb20d527d8e19f8c",
          "email": "ogunniran.seyi2@gmail.com",
          "primaryContactPhoneNo": "07030212799",
          "shortName": "AHF"
        }
      }
    },
    {
      "_id": "5a9fd69b6e191d07f897cfec",
      "updatedAt": "2018-04-25T14:36:33.772Z",
      "createdAt": "2018-03-07T12:10:03.608Z",
      "facilityId": "5a8d661bdb20d527d8e19f8c",
      "patientId": "5a9d19ca99fc7d16a8d359ce",
      "totalDiscount": 0,
      "subTotal": 1000,
      "totalPrice": 1000,
      "balance": 0,
      "invoiceNo": "IV/721/1720",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-07T12:10:03.608Z",
          "balance": 1000,
          "paymentMethod": {
            "reason": "Motherless",
            "planType": "waved"
          },
          "description": "Laboratory-Pregnancy test -blood",
          "amountPaid": 0,
          "isItemTxnClosed": true
        },
        {
          "paymentDate": "2018-04-25T14:36:31.246Z",
          "date": null,
          "qty": null,
          "facilityServiceObject": null,
          "amountPaid": 1000,
          "totalPrice": 1000,
          "balance": 0,
          "isPaymentCompleted": true,
          "isWaiver": false,
          "waiverComment": "",
          "createdBy": "5a8d6733db20d527d8e19fa0"
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9ee7be71c21123a8ab8eeb",
          "billObject": {
            "serviceModifierObject": [],
            "facilityServiceObject": {
              "serviceId": "5a9d206c99fc7d16a8d359ef",
              "service": "Pregnancy test -blood",
              "category": "Laboratory",
              "categoryId": "5a8d661bdb20d527d8e19f95"
            },
            "patientObject": {
              "personDetails": {
                "email": "chimechimex@gmail.com",
                "homeAddress": {
                  "street": "enugu",
                  "state": "Enugu State",
                  "lga": "Ezeagu",
                  "country": "Nigeria",
                  "city": "Nsuku"
                },
                "__v": 0,
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [],
                "apmisId": "MY-63396",
                "wallet": {
                  "_id": "5a9d19c999fc7d16a8d359cc",
                  "updatedAt": "2018-03-05T10:19:53.013Z",
                  "createdAt": "2018-03-05T10:19:53.013Z",
                  "transactions": [],
                  "ledgerBalance": 0,
                  "balance": 0
                },
                "primaryContactPhoneNo": "07023453245",
                "motherMaidenName": "Chime",
                "dateOfBirth": "2000-03-04T23:00:00.000Z",
                "gender": "Male",
                "lastName": "Uche",
                "firstName": "Uche",
                "title": "Dr.",
                "createdAt": "2018-03-05T10:19:53.013Z",
                "updatedAt": "2018-03-05T10:21:41.509Z",
                "_id": "5a9d19c999fc7d16a8d359cb"
              },
              "age": "18 years",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": true,
                  "_id": "5a9d19ca99fc7d16a8d359cf",
                  "bearerPersonId": "5a9d19c999fc7d16a8d359cb",
                  "planType": "wallet"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8d661bdb20d527d8e19f8c",
              "personId": "5a9d19c999fc7d16a8d359cb",
              "createdAt": "2018-03-05T10:19:54.560Z",
              "updatedAt": "2018-03-05T10:19:54.560Z",
              "_id": "5a9d19ca99fc7d16a8d359ce"
            },
            "serviceObject": {
              "panels": [],
              "createdAt": "2018-03-05T10:48:12.451Z",
              "updatedAt": "2018-03-05T10:48:12.451Z",
              "name": "Pregnancy test -blood",
              "_id": "5a9d206c99fc7d16a8d359ef"
            },
            "isBearerConfirmed": true,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-06T19:10:54.505Z",
            "updatedAt": "2018-03-07T12:10:03.591Z",
            "_id": "5a9ee7be71c21123a8ab8eec",
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 1000,
            "covered": {
              "coverType": "wallet"
            },
            "quantity": 1,
            "patientId": "5a9d19ca99fc7d16a8d359ce",
            "serviceId": "5a9d206c99fc7d16a8d359ef",
            "facilityServiceId": "5a8d661bdb20d527d8e19f8e",
            "description": "",
            "facilityId": "5a8d661bdb20d527d8e19f8c",
            "unitPrice": 1000,
            "balance": 0
          },
          "billingId": "5a9ee7be71c21123a8ab8eec"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a9d19ca99fc7d16a8d359ce",
        "updatedAt": "2018-04-24T16:30:40.395Z",
        "createdAt": "2018-03-05T10:19:54.560Z",
        "personId": "5a9d19c999fc7d16a8d359cb",
        "facilityId": "5a8d661bdb20d527d8e19f8c",
        "timeLines": [],
        "clientsNo": [
          {
            "clientNumber": "HDIO9409234",
            "minorLocationId": "5a8f132270292129407f9bc2"
          }
        ],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planDetails": false,
            "isDefault": true,
            "_id": "5a9d19ca99fc7d16a8d359cf",
            "bearerPersonId": "5a9d19c999fc7d16a8d359cb",
            "planType": "wallet"
          }
        ],
        "isActive": false,
        "__v": 0,
        "age": "18 years",
        "personDetails": {
          "_id": "5a9d19c999fc7d16a8d359cb",
          "email": "chimechimex@gmail.com",
          "homeAddress": {
            "city": "Nsuku",
            "country": "Nigeria",
            "lga": "Ezeagu",
            "state": "Enugu State",
            "street": "enugu"
          },
          "__v": 0,
          "apmisId": "MY-63396",
          "wallet": {
            "balance": 4000,
            "ledgerBalance": 4000,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 5000,
                "transactionMedium": "cash",
                "transactionStatus": "Completed",
                "balance": 5000,
                "ledgerBalance": 5000,
                "createdAt": "2018-04-24T16:31:24.533Z",
                "updatedAt": "2018-04-24T16:31:24.533Z",
                "_id": "5adf5bdc0d890b183c3bb871",
                "sourceId": "5a8d661bdb20d527d8e19f8c",
                "sourceType": "Facility",
                "refCode": "175118",
                "description": "Funded wallet via cash payment",
                "destinationId": "5a9d19c999fc7d16a8d359cb",
                "destinationType": "Person",
                "paidBy": "5a8d671edb20d527d8e19f9d"
              },
              {
                "transactionType": "Dr",
                "amount": 1000,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 4000,
                "ledgerBalance": 4000,
                "createdAt": "2018-04-25T14:36:34.260Z",
                "updatedAt": "2018-04-25T14:36:34.260Z",
                "_id": "5ae092722e91ed3a7c2cfdfc",
                "description": "Laboratory - Pregnancy test -blood",
                "refCode": "323052"
              }
            ],
            "createdAt": "2018-03-05T10:19:53.013Z",
            "updatedAt": "2018-03-05T10:19:53.013Z",
            "_id": "5a9d19c999fc7d16a8d359cc"
          },
          "primaryContactPhoneNo": "07023453245",
          "motherMaidenName": "Chime",
          "dateOfBirth": "2000-03-04T23:00:00.000Z",
          "gender": "Male",
          "lastName": "Uche",
          "firstName": "Uche",
          "title": "Dr.",
          "createdAt": "2018-03-05T10:19:53.013Z",
          "updatedAt": "2018-04-25T14:36:34.260Z",
          "nextOfKin": [],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": [
            {
              "clientNumber": "HDIO9409234",
              "minorLocationId": "5a8f132270292129407f9bc2"
            }
          ]
        },
        "facilityObj": {
          "name": "SHELL NIGERIA",
          "_id": "5a8d661bdb20d527d8e19f8c",
          "email": "ogunniran.seyi2@gmail.com",
          "primaryContactPhoneNo": "07030212799",
          "shortName": "AHF"
        }
      }
    },
    {
      "_id": "5a9fda736e191d07f897cff1",
      "updatedAt": "2018-03-07T12:26:27.891Z",
      "createdAt": "2018-03-07T12:26:27.891Z",
      "facilityId": "5a8d661bdb20d527d8e19f8c",
      "patientId": "5a9d78c699fc7d16a8d35a53",
      "totalDiscount": 0,
      "subTotal": 5500,
      "totalPrice": 5500,
      "balance": 5500,
      "invoiceNo": "IV/721/3028",
      "paymentCompleted": false,
      "paymentStatus": "UNPAID",
      "payments": [
        {
          "createdAt": "2018-03-07T12:26:27.891Z",
          "balance": 5500,
          "paymentMethod": {
            "reason": "",
            "planType": "waved"
          },
          "description": "undefined-undefined",
          "amountPaid": 0
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9f276171c21123a8ab8ef7",
          "billObject": {
            "serviceModifierObject": [],
            "patientObject": {
              "personDetails": {
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [
                  {
                    "relationship": "Son",
                    "phoneNumber": "08065421354",
                    "fullName": "IME OKON AKPAN",
                    "email": "",
                    "address": "6UYO ROAD,UYO"
                  }
                ],
                "email": "juytrfff@yahoo.co.uk",
                "homeAddress": {
                  "street": "7okon lane uyo",
                  "state": "Akwa Ibom State",
                  "lga": "Uyo",
                  "country": "Nigeria",
                  "city": "Uyo"
                },
                "__v": 0,
                "apmisId": "HL-96896",
                "wallet": {
                  "balance": 11000,
                  "ledgerBalance": 11000,
                  "transactions": [
                    {
                      "transactionType": "Cr",
                      "amount": 5000,
                      "transactionMedium": "e-payment",
                      "transactionStatus": "Completed",
                      "balance": 5000,
                      "ledgerBalance": 5000,
                      "createdAt": "2018-03-07T12:19:11.362Z",
                      "updatedAt": "2018-03-07T12:19:11.362Z",
                      "paidBy": "5a8d671edb20d527d8e19f9d",
                      "destinationType": "Person",
                      "destinationId": "5a9d78c499fc7d16a8d35a50",
                      "description": "Funded wallet via e-payment",
                      "refCode": "645866",
                      "sourceType": "Person",
                      "sourceId": "5a8d671edb20d527d8e19f9d",
                      "_id": "5a9fd8bf6e191d07f897cfee"
                    },
                    {
                      "transactionType": "Cr",
                      "amount": 6000,
                      "transactionMedium": "e-payment",
                      "transactionStatus": "Completed",
                      "balance": 11000,
                      "ledgerBalance": 11000,
                      "createdAt": "2018-03-07T12:23:33.077Z",
                      "updatedAt": "2018-03-07T12:23:33.077Z",
                      "_id": "5a9fd9c56e191d07f897cff0",
                      "sourceId": "5a8d671edb20d527d8e19f9d",
                      "sourceType": "Person",
                      "refCode": "786210",
                      "description": "Funded wallet via e-payment",
                      "destinationId": "5a9d78c499fc7d16a8d35a50",
                      "destinationType": "Person",
                      "paidBy": "5a8d671edb20d527d8e19f9d"
                    }
                  ],
                  "createdAt": "2018-03-05T17:05:08.772Z",
                  "updatedAt": "2018-03-05T17:05:08.772Z",
                  "_id": "5a9d78c499fc7d16a8d35a51"
                },
                "primaryContactPhoneNo": "08024125476",
                "motherMaidenName": "Vera Luke",
                "dateOfBirth": "1982-01-23T23:00:00.000Z",
                "gender": "Male",
                "lastName": "Okon",
                "firstName": "Imoh",
                "title": "Mr.",
                "createdAt": "2018-03-05T17:05:08.772Z",
                "updatedAt": "2018-03-05T17:14:13.042Z",
                "_id": "5a9d78c499fc7d16a8d35a50"
              },
              "age": "36 years",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": true,
                  "_id": "5a9d78c699fc7d16a8d35a54",
                  "bearerPersonId": "5a9d78c499fc7d16a8d35a50",
                  "planType": "wallet"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8d661bdb20d527d8e19f8c",
              "personId": "5a9d78c499fc7d16a8d35a50",
              "createdAt": "2018-03-05T17:05:10.209Z",
              "updatedAt": "2018-03-05T17:05:10.209Z",
              "_id": "5a9d78c699fc7d16a8d35a53"
            },
            "isBearerConfirmed": true,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": false,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-06T23:42:25.474Z",
            "updatedAt": "2018-03-07T12:26:27.891Z",
            "_id": "5a9f276171c21123a8ab8ef8",
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 5500,
            "covered": {
              "coverType": "wallet"
            },
            "quantity": 1,
            "patientId": "5a9d78c699fc7d16a8d35a53",
            "serviceId": "5a8f14fb70292129407f9bc8",
            "facilityServiceId": "5a8d661bdb20d527d8e19f8e",
            "description": "",
            "facilityId": "5a8d661bdb20d527d8e19f8c",
            "unitPrice": 5500
          },
          "billingId": "5a9f276171c21123a8ab8ef8"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a9d78c699fc7d16a8d35a53",
        "updatedAt": "2018-03-09T14:18:45.555Z",
        "createdAt": "2018-03-05T17:05:10.209Z",
        "personId": "5a9d78c499fc7d16a8d35a50",
        "facilityId": "5a8d661bdb20d527d8e19f8c",
        "timeLines": [],
        "clientsNo": [
          {
            "clientNumber": "N/A",
            "minorLocationId": "5a8f132270292129407f9bc2"
          }
        ],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planDetails": false,
            "isDefault": true,
            "_id": "5a9d78c699fc7d16a8d35a54",
            "bearerPersonId": "5a9d78c499fc7d16a8d35a50",
            "planType": "wallet"
          }
        ],
        "isActive": false,
        "__v": 0,
        "age": "36 years",
        "personDetails": {
          "_id": "5a9d78c499fc7d16a8d35a50",
          "updatedAt": "2018-06-28T14:10:46.591Z",
          "createdAt": "2018-03-05T17:05:08.772Z",
          "title": "Mr.",
          "firstName": "Imoh",
          "lastName": "Okon",
          "gender": "Male",
          "dateOfBirth": "1982-01-23T23:00:00.000Z",
          "motherMaidenName": "Vera Luke",
          "primaryContactPhoneNo": "08024125476",
          "wallet": {
            "balance": 5499,
            "ledgerBalance": 5499,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 5000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 5000,
                "ledgerBalance": 5000,
                "createdAt": "2018-03-07T12:19:11.362Z",
                "updatedAt": "2018-03-07T12:19:11.362Z",
                "paidBy": "5a8d671edb20d527d8e19f9d",
                "destinationType": "Person",
                "destinationId": "5a9d78c499fc7d16a8d35a50",
                "description": "Funded wallet via e-payment",
                "refCode": "645866",
                "sourceType": "Person",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "_id": "5a9fd8bf6e191d07f897cfee"
              },
              {
                "transactionType": "Cr",
                "amount": 6000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 11000,
                "ledgerBalance": 11000,
                "createdAt": "2018-03-07T12:23:33.077Z",
                "updatedAt": "2018-03-07T12:23:33.077Z",
                "_id": "5a9fd9c56e191d07f897cff0",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "sourceType": "Person",
                "refCode": "786210",
                "description": "Funded wallet via e-payment",
                "destinationId": "5a9d78c499fc7d16a8d35a50",
                "destinationType": "Person",
                "paidBy": "5a8d671edb20d527d8e19f9d"
              },
              {
                "transactionType": "Dr",
                "amount": 1,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 10999,
                "ledgerBalance": 10999,
                "createdAt": "2018-03-07T12:40:12.974Z",
                "updatedAt": "2018-03-07T12:40:12.974Z",
                "_id": "5a9fddac6e191d07f897cff3",
                "description": "Medical Records - new registration",
                "refCode": "993462"
              },
              {
                "transactionType": "Dr",
                "amount": 0,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 10999,
                "ledgerBalance": 10999,
                "createdAt": "2018-06-28T14:10:26.951Z",
                "updatedAt": "2018-06-28T14:10:26.951Z",
                "refCode": "840675",
                "description": "",
                "_id": "5b34ec5222dbe44efcdd949b"
              },
              {
                "transactionType": "Dr",
                "amount": 5500,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 5499,
                "ledgerBalance": 5499,
                "createdAt": "2018-06-28T14:10:46.591Z",
                "updatedAt": "2018-06-28T14:10:46.591Z",
                "_id": "5b34ec6622dbe44efcdd949d",
                "description": "",
                "refCode": "368250"
              }
            ],
            "createdAt": "2018-03-05T17:05:08.772Z",
            "updatedAt": "2018-03-05T17:05:08.772Z",
            "_id": "5a9d78c499fc7d16a8d35a51"
          },
          "apmisId": "HL-96896",
          "__v": 0,
          "homeAddress": {
            "city": "Uyo",
            "country": "Nigeria",
            "lga": "Uyo",
            "state": "Akwa Ibom State",
            "street": "7okon lane uyo"
          },
          "email": "juytrfff@yahoo.co.uk",
          "nextOfKin": [
            {
              "address": "6UYO ROAD,UYO",
              "email": "",
              "fullName": "IME OKON AKPAN",
              "phoneNumber": "08065421354",
              "relationship": "Son"
            }
          ],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": [
            {
              "clientNumber": "N/A",
              "minorLocationId": "5a8f132270292129407f9bc2"
            }
          ]
        },
        "facilityObj": {
          "name": "SHELL NIGERIA",
          "_id": "5a8d661bdb20d527d8e19f8c",
          "email": "ogunniran.seyi2@gmail.com",
          "primaryContactPhoneNo": "07030212799",
          "shortName": "AHF"
        }
      }
    },
    {
      "_id": "5a9fdbdc6e191d07f897cff2",
      "updatedAt": "2018-06-28T14:10:45.419Z",
      "createdAt": "2018-03-07T12:32:28.864Z",
      "facilityId": "5a8d661bdb20d527d8e19f8c",
      "patientId": "5a9d78c699fc7d16a8d35a53",
      "totalDiscount": 0,
      "subTotal": 5500,
      "totalPrice": 5500,
      "balance": 0,
      "invoiceNo": "IV/721/7525",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-07T12:32:28.864Z",
          "balance": 5500,
          "paymentMethod": {
            "reason": "",
            "planType": "waved"
          },
          "description": "undefined-undefined",
          "amountPaid": 0,
          "isItemTxnClosed": true
        },
        {
          "paymentDate": "2018-06-28T14:10:41.582Z",
          "date": null,
          "qty": null,
          "facilityServiceObject": null,
          "amountPaid": 5500,
          "totalPrice": 5500,
          "balance": 0,
          "isPaymentCompleted": true,
          "isWaiver": false,
          "waiverComment": "",
          "createdBy": "5a8d6733db20d527d8e19fa0"
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9f06db71c21123a8ab8ef3",
          "billObject": {
            "serviceModifierObject": [],
            "patientObject": {
              "personDetails": {
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [
                  {
                    "relationship": "Son",
                    "phoneNumber": "08065421354",
                    "fullName": "IME OKON AKPAN",
                    "email": "",
                    "address": "6UYO ROAD,UYO"
                  }
                ],
                "email": "juytrfff@yahoo.co.uk",
                "homeAddress": {
                  "street": "7okon lane uyo",
                  "state": "Akwa Ibom State",
                  "lga": "Uyo",
                  "country": "Nigeria",
                  "city": "Uyo"
                },
                "__v": 0,
                "apmisId": "HL-96896",
                "wallet": {
                  "balance": 11000,
                  "ledgerBalance": 11000,
                  "transactions": [
                    {
                      "transactionType": "Cr",
                      "amount": 5000,
                      "transactionMedium": "e-payment",
                      "transactionStatus": "Completed",
                      "balance": 5000,
                      "ledgerBalance": 5000,
                      "createdAt": "2018-03-07T12:19:11.362Z",
                      "updatedAt": "2018-03-07T12:19:11.362Z",
                      "paidBy": "5a8d671edb20d527d8e19f9d",
                      "destinationType": "Person",
                      "destinationId": "5a9d78c499fc7d16a8d35a50",
                      "description": "Funded wallet via e-payment",
                      "refCode": "645866",
                      "sourceType": "Person",
                      "sourceId": "5a8d671edb20d527d8e19f9d",
                      "_id": "5a9fd8bf6e191d07f897cfee"
                    },
                    {
                      "transactionType": "Cr",
                      "amount": 6000,
                      "transactionMedium": "e-payment",
                      "transactionStatus": "Completed",
                      "balance": 11000,
                      "ledgerBalance": 11000,
                      "createdAt": "2018-03-07T12:23:33.077Z",
                      "updatedAt": "2018-03-07T12:23:33.077Z",
                      "_id": "5a9fd9c56e191d07f897cff0",
                      "sourceId": "5a8d671edb20d527d8e19f9d",
                      "sourceType": "Person",
                      "refCode": "786210",
                      "description": "Funded wallet via e-payment",
                      "destinationId": "5a9d78c499fc7d16a8d35a50",
                      "destinationType": "Person",
                      "paidBy": "5a8d671edb20d527d8e19f9d"
                    }
                  ],
                  "createdAt": "2018-03-05T17:05:08.772Z",
                  "updatedAt": "2018-03-05T17:05:08.772Z",
                  "_id": "5a9d78c499fc7d16a8d35a51"
                },
                "primaryContactPhoneNo": "08024125476",
                "motherMaidenName": "Vera Luke",
                "dateOfBirth": "1982-01-23T23:00:00.000Z",
                "gender": "Male",
                "lastName": "Okon",
                "firstName": "Imoh",
                "title": "Mr.",
                "createdAt": "2018-03-05T17:05:08.772Z",
                "updatedAt": "2018-03-05T17:14:13.042Z",
                "_id": "5a9d78c499fc7d16a8d35a50"
              },
              "age": "36 years",
              "__v": 0,
              "isActive": false,
              "paymentPlan": [
                {
                  "planDetails": false,
                  "isDefault": true,
                  "_id": "5a9d78c699fc7d16a8d35a54",
                  "bearerPersonId": "5a9d78c499fc7d16a8d35a50",
                  "planType": "wallet"
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [],
              "timeLines": [],
              "facilityId": "5a8d661bdb20d527d8e19f8c",
              "personId": "5a9d78c499fc7d16a8d35a50",
              "createdAt": "2018-03-05T17:05:10.209Z",
              "updatedAt": "2018-03-05T17:05:10.209Z",
              "_id": "5a9d78c699fc7d16a8d35a53"
            },
            "isBearerConfirmed": true,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-06T21:23:39.251Z",
            "updatedAt": "2018-03-07T12:32:28.864Z",
            "_id": "5a9f06db71c21123a8ab8ef4",
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 5500,
            "covered": {
              "coverType": "wallet"
            },
            "quantity": 1,
            "patientId": "5a9d78c699fc7d16a8d35a53",
            "serviceId": "5a8f14fb70292129407f9bc8",
            "facilityServiceId": "5a8d661bdb20d527d8e19f8e",
            "description": "",
            "facilityId": "5a8d661bdb20d527d8e19f8c",
            "unitPrice": 5500,
            "balance": 0
          },
          "billingId": "5a9f06db71c21123a8ab8ef4"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a9d78c699fc7d16a8d35a53",
        "updatedAt": "2018-03-09T14:18:45.555Z",
        "createdAt": "2018-03-05T17:05:10.209Z",
        "personId": "5a9d78c499fc7d16a8d35a50",
        "facilityId": "5a8d661bdb20d527d8e19f8c",
        "timeLines": [],
        "clientsNo": [
          {
            "clientNumber": "N/A",
            "minorLocationId": "5a8f132270292129407f9bc2"
          }
        ],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "planDetails": false,
            "isDefault": true,
            "_id": "5a9d78c699fc7d16a8d35a54",
            "bearerPersonId": "5a9d78c499fc7d16a8d35a50",
            "planType": "wallet"
          }
        ],
        "isActive": false,
        "__v": 0,
        "age": "36 years",
        "personDetails": {
          "_id": "5a9d78c499fc7d16a8d35a50",
          "updatedAt": "2018-06-28T14:10:46.591Z",
          "createdAt": "2018-03-05T17:05:08.772Z",
          "title": "Mr.",
          "firstName": "Imoh",
          "lastName": "Okon",
          "gender": "Male",
          "dateOfBirth": "1982-01-23T23:00:00.000Z",
          "motherMaidenName": "Vera Luke",
          "primaryContactPhoneNo": "08024125476",
          "wallet": {
            "balance": 5499,
            "ledgerBalance": 5499,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 5000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 5000,
                "ledgerBalance": 5000,
                "createdAt": "2018-03-07T12:19:11.362Z",
                "updatedAt": "2018-03-07T12:19:11.362Z",
                "paidBy": "5a8d671edb20d527d8e19f9d",
                "destinationType": "Person",
                "destinationId": "5a9d78c499fc7d16a8d35a50",
                "description": "Funded wallet via e-payment",
                "refCode": "645866",
                "sourceType": "Person",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "_id": "5a9fd8bf6e191d07f897cfee"
              },
              {
                "transactionType": "Cr",
                "amount": 6000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 11000,
                "ledgerBalance": 11000,
                "createdAt": "2018-03-07T12:23:33.077Z",
                "updatedAt": "2018-03-07T12:23:33.077Z",
                "_id": "5a9fd9c56e191d07f897cff0",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "sourceType": "Person",
                "refCode": "786210",
                "description": "Funded wallet via e-payment",
                "destinationId": "5a9d78c499fc7d16a8d35a50",
                "destinationType": "Person",
                "paidBy": "5a8d671edb20d527d8e19f9d"
              },
              {
                "transactionType": "Dr",
                "amount": 1,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 10999,
                "ledgerBalance": 10999,
                "createdAt": "2018-03-07T12:40:12.974Z",
                "updatedAt": "2018-03-07T12:40:12.974Z",
                "_id": "5a9fddac6e191d07f897cff3",
                "description": "Medical Records - new registration",
                "refCode": "993462"
              },
              {
                "transactionType": "Dr",
                "amount": 0,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 10999,
                "ledgerBalance": 10999,
                "createdAt": "2018-06-28T14:10:26.951Z",
                "updatedAt": "2018-06-28T14:10:26.951Z",
                "refCode": "840675",
                "description": "",
                "_id": "5b34ec5222dbe44efcdd949b"
              },
              {
                "transactionType": "Dr",
                "amount": 5500,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 5499,
                "ledgerBalance": 5499,
                "createdAt": "2018-06-28T14:10:46.591Z",
                "updatedAt": "2018-06-28T14:10:46.591Z",
                "_id": "5b34ec6622dbe44efcdd949d",
                "description": "",
                "refCode": "368250"
              }
            ],
            "createdAt": "2018-03-05T17:05:08.772Z",
            "updatedAt": "2018-03-05T17:05:08.772Z",
            "_id": "5a9d78c499fc7d16a8d35a51"
          },
          "apmisId": "HL-96896",
          "__v": 0,
          "homeAddress": {
            "city": "Uyo",
            "country": "Nigeria",
            "lga": "Uyo",
            "state": "Akwa Ibom State",
            "street": "7okon lane uyo"
          },
          "email": "juytrfff@yahoo.co.uk",
          "nextOfKin": [
            {
              "address": "6UYO ROAD,UYO",
              "email": "",
              "fullName": "IME OKON AKPAN",
              "phoneNumber": "08065421354",
              "relationship": "Son"
            }
          ],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": [
            {
              "clientNumber": "N/A",
              "minorLocationId": "5a8f132270292129407f9bc2"
            }
          ]
        },
        "facilityObj": {
          "name": "SHELL NIGERIA",
          "_id": "5a8d661bdb20d527d8e19f8c",
          "email": "ogunniran.seyi2@gmail.com",
          "primaryContactPhoneNo": "07030212799",
          "shortName": "AHF"
        }
      }
    },
    {
      "_id": "5a9fe0d66e191d07f897cfff",
      "updatedAt": "2018-03-07T12:53:42.279Z",
      "createdAt": "2018-03-07T12:53:42.279Z",
      "facilityId": "5a8d661bdb20d527d8e19f8c",
      "patientId": "5a8d893570292129407f9ba6",
      "totalDiscount": 5500,
      "subTotal": 5500,
      "totalPrice": 0,
      "balance": 0,
      "invoiceNo": "IV/721/1204",
      "paymentCompleted": true,
      "paymentStatus": "PAID",
      "payments": [
        {
          "createdAt": "2018-03-07T12:53:42.279Z",
          "balance": 0,
          "paymentMethod": {
            "reason": "Na my padi",
            "planType": "waved"
          },
          "description": "undefined-undefined",
          "amountPaid": 0
        }
      ],
      "billingIds": [
        {
          "billModelId": "5a9fe03d6e191d07f897cffc",
          "billObject": {
            "serviceModifierObject": [],
            "patientObject": {
              "personDetails": {
                "secondaryContactPhoneNo": [],
                "personProfessions": [],
                "nextOfKin": [
                  {
                    "relationship": "Brother",
                    "phoneNumber": "09085767734",
                    "fullName": "Tolu Kadejo",
                    "email": "tolukad@mail.com",
                    "address": "23 dundun"
                  }
                ],
                "homeAddress": {
                  "street": "24, Dundun Road",
                  "state": "Ekiti State",
                  "lga": "Ekiti East",
                  "country": "Nigeria",
                  "city": "Ikere-Ekiti"
                },
                "email": "fadet@mail.com",
                "__v": 0,
                "apmisId": "PN-57310",
                "wallet": {
                  "_id": "5a8d893470292129407f9ba4",
                  "updatedAt": "2018-02-21T14:59:00.010Z",
                  "createdAt": "2018-02-21T14:59:00.010Z",
                  "transactions": [
                    {
                      "paidBy": "5a8d671edb20d527d8e19f9d",
                      "destinationType": "Person",
                      "destinationId": "5a8d893470292129407f9ba3",
                      "description": "Funded wallet via e-payment",
                      "refCode": "020534",
                      "sourceType": "Person",
                      "sourceId": "5a8d671edb20d527d8e19f9d",
                      "_id": "5a9e71a8a567394db8b2f2dc",
                      "updatedAt": "2018-03-06T10:47:04.763Z",
                      "createdAt": "2018-03-06T10:47:04.763Z",
                      "ledgerBalance": 10000,
                      "balance": 10000,
                      "transactionStatus": "Completed",
                      "transactionMedium": "e-payment",
                      "amount": 10000,
                      "transactionType": "Cr"
                    }
                  ],
                  "ledgerBalance": 10000,
                  "balance": 10000
                },
                "primaryContactPhoneNo": "08038974509",
                "motherMaidenName": "Waku",
                "dateOfBirth": "2011-02-20T23:00:00.000Z",
                "gender": "Female",
                "lastName": "Adetola",
                "firstName": "Foluke",
                "title": "Mrs.",
                "createdAt": "2018-02-21T14:59:00.010Z",
                "updatedAt": "2018-03-06T11:11:07.132Z",
                "_id": "5a8d893470292129407f9ba3"
              },
              "age": "7 years",
              "isActive": false,
              "paymentPlan": [
                {
                  "_id": "5a8d893570292129407f9ba7",
                  "planType": "wallet",
                  "isDefault": true,
                  "planDetails": false
                }
              ],
              "orders": [],
              "tags": [],
              "clientsNo": [
                {
                  "clientNumber": "23",
                  "minorLocationId": {
                    "isActive": true,
                    "_id": "5a8f132270292129407f9bc2",
                    "name": "PPP lab",
                    "locationId": "59896b6bb3abed2f546bda58",
                    "description": ""
                  }
                },
                {
                  "clientNumber": "23",
                  "minorLocationId": {
                    "isActive": true,
                    "_id": "5a8f132270292129407f9bc2",
                    "name": "PPP lab",
                    "locationId": "59896b6bb3abed2f546bda58",
                    "description": ""
                  }
                }
              ],
              "timeLines": [],
              "updatedAt": "2018-03-06T11:10:57.008Z",
              "createdAt": "2018-02-21T14:59:01.228Z",
              "personId": "5a8d893470292129407f9ba3",
              "facilityId": "5a8d661bdb20d527d8e19f8c",
              "__v": 0,
              "_id": "5a8d893570292129407f9ba6"
            },
            "isBearerConfirmed": true,
            "payments": [],
            "paymentStatus": [],
            "paymentCompleted": true,
            "isServiceEnjoyed": true,
            "isInvoiceGenerated": true,
            "active": true,
            "modifierId": [],
            "createdAt": "2018-03-07T12:51:09.327Z",
            "updatedAt": "2018-03-07T12:53:42.279Z",
            "_id": "5a9fe03d6e191d07f897cffd",
            "totalDiscoutedAmount": 0,
            "unitDiscountedAmount": 0,
            "totalPrice": 5500,
            "covered": {
              "coverType": "wallet"
            },
            "quantity": 1,
            "patientId": "5a8d893570292129407f9ba6",
            "serviceId": "5a8f14fb70292129407f9bc8",
            "facilityServiceId": "5a8d661bdb20d527d8e19f8e",
            "description": "",
            "facilityId": "5a8d661bdb20d527d8e19f8c",
            "unitPrice": 5500
          },
          "billingId": "5a9fe03d6e191d07f897cffd"
        }
      ],
      "isWalkIn": false,
      "__v": 0,
      "patientObject": {
        "_id": "5a8d893570292129407f9ba6",
        "updatedAt": "2018-03-06T11:10:57.008Z",
        "createdAt": "2018-02-21T14:59:01.228Z",
        "personId": "5a8d893470292129407f9ba3",
        "facilityId": "5a8d661bdb20d527d8e19f8c",
        "__v": 0,
        "timeLines": [],
        "clientsNo": [
          {
            "minorLocationId": {
              "description": "",
              "locationId": "59896b6bb3abed2f546bda58",
              "name": "PPP lab",
              "_id": "5a8f132270292129407f9bc2",
              "isActive": true
            },
            "clientNumber": "23"
          },
          {
            "minorLocationId": {
              "description": "",
              "locationId": "59896b6bb3abed2f546bda58",
              "name": "PPP lab",
              "_id": "5a8f132270292129407f9bc2",
              "isActive": true
            },
            "clientNumber": "23"
          },
          {
            "minorLocationId": {
              "_id": "5a8f130270292129407f9bc0",
              "name": "Microbiology",
              "locationId": "59896b6bb3abed2f546bda58",
              "description": "",
              "isActive": true
            },
            "clientNumber": "Lab-0001"
          }
        ],
        "tags": [],
        "orders": [],
        "paymentPlan": [
          {
            "_id": "5a8d893570292129407f9ba7",
            "planType": "wallet",
            "isDefault": true,
            "planDetails": false
          }
        ],
        "isActive": false,
        "age": "7 years",
        "personDetails": {
          "_id": "5a8d893470292129407f9ba3",
          "updatedAt": "2018-04-25T11:11:00.899Z",
          "createdAt": "2018-02-21T14:59:00.010Z",
          "title": "Mrs.",
          "firstName": "Foluke",
          "lastName": "Adetola",
          "gender": "Female",
          "dateOfBirth": "2011-02-20T23:00:00.000Z",
          "motherMaidenName": "Waku",
          "primaryContactPhoneNo": "08038974509",
          "wallet": {
            "balance": 7399,
            "ledgerBalance": 7399,
            "transactions": [
              {
                "transactionType": "Cr",
                "amount": 10000,
                "transactionMedium": "e-payment",
                "transactionStatus": "Completed",
                "balance": 10000,
                "ledgerBalance": 10000,
                "createdAt": "2018-03-06T10:47:04.763Z",
                "updatedAt": "2018-03-06T10:47:04.763Z",
                "_id": "5a9e71a8a567394db8b2f2dc",
                "sourceId": "5a8d671edb20d527d8e19f9d",
                "sourceType": "Person",
                "refCode": "020534",
                "description": "Funded wallet via e-payment",
                "destinationId": "5a8d893470292129407f9ba3",
                "destinationType": "Person",
                "paidBy": "5a8d671edb20d527d8e19f9d"
              },
              {
                "transactionType": "Dr",
                "amount": 1000,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 9000,
                "ledgerBalance": 9000,
                "createdAt": "2018-03-07T12:58:36.042Z",
                "updatedAt": "2018-03-07T12:58:36.042Z",
                "refCode": "876809",
                "description": "Laboratory-Pregnancy test -blood",
                "_id": "5a9fe1fc6e191d07f897d004"
              },
              {
                "transactionType": "Dr",
                "amount": 1000,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 8000,
                "ledgerBalance": 8000,
                "createdAt": "2018-03-07T13:52:53.294Z",
                "updatedAt": "2018-03-07T13:52:53.294Z",
                "_id": "5a9feeb56e191d07f897d047",
                "description": "Laboratory-Pregnancy test -blood",
                "refCode": "797737"
              },
              {
                "transactionType": "Dr",
                "amount": 600,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 7400,
                "ledgerBalance": 7400,
                "createdAt": "2018-03-09T09:10:21.865Z",
                "updatedAt": "2018-03-09T09:10:21.865Z",
                "refCode": "297063",
                "description": "Laboratory-Pregnancy test -blood",
                "_id": "5aa24f7d6e191d07f897d1bb"
              },
              {
                "transactionType": "Dr",
                "amount": 1,
                "transactionMedium": "wallet",
                "transactionStatus": "Complete",
                "balance": 7399,
                "ledgerBalance": 7399,
                "createdAt": "2018-04-25T11:11:00.894Z",
                "updatedAt": "2018-04-25T11:11:00.894Z",
                "_id": "5ae062446e73c946200f572a",
                "description": "Laboratory-Reg",
                "refCode": "004134"
              }
            ],
            "createdAt": "2018-02-21T14:59:00.010Z",
            "updatedAt": "2018-02-21T14:59:00.010Z",
            "_id": "5a8d893470292129407f9ba4"
          },
          "apmisId": "PN-57310",
          "__v": 0,
          "email": "fadet@mail.com",
          "homeAddress": {
            "city": "Ikere-Ekiti",
            "country": "Nigeria",
            "lga": "Ekiti East",
            "state": "Ekiti State",
            "street": "24, Dundun Road"
          },
          "nextOfKin": [
            {
              "address": "23 dundun",
              "email": "tolukad@mail.com",
              "fullName": "Tolu Kadejo",
              "phoneNumber": "09085767734",
              "relationship": "Brother"
            }
          ],
          "personProfessions": [],
          "secondaryContactPhoneNo": [],
          "clientsNo": [
            {
              "minorLocationId": {
                "description": "",
                "locationId": "59896b6bb3abed2f546bda58",
                "name": "PPP lab",
                "_id": "5a8f132270292129407f9bc2",
                "isActive": true
              },
              "clientNumber": "23"
            },
            {
              "minorLocationId": {
                "description": "",
                "locationId": "59896b6bb3abed2f546bda58",
                "name": "PPP lab",
                "_id": "5a8f132270292129407f9bc2",
                "isActive": true
              },
              "clientNumber": "23"
            },
            {
              "minorLocationId": {
                "_id": "5a8f130270292129407f9bc0",
                "name": "Microbiology",
                "locationId": "59896b6bb3abed2f546bda58",
                "description": "",
                "isActive": true
              },
              "clientNumber": "Lab-0001"
            }
          ]
        },
        "facilityObj": {
          "name": "SHELL NIGERIA",
          "_id": "5a8d661bdb20d527d8e19f8c",
          "email": "ogunniran.seyi2@gmail.com",
          "primaryContactPhoneNo": "07030212799",
          "shortName": "AHF"
        }
      }
    }
  ]
}