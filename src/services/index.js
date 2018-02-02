const users = require('./users/users.service.js');
const facilityModules = require('./facility-modules/facility-modules.service.js');
const facilityOwnerships = require('./facility-ownerships/facility-ownerships.service.js');
const facilityTypes = require('./facility-types/facility-types.service.js');
const facilityClasses = require('./facility-classes/facility-classes.service.js');
const titles = require('./titles/titles.service.js');
const locations = require('./locations/locations.service.js');
const relationships = require('./relationships/relationships.service.js');
const genders = require('./genders/genders.service.js');
const maritalStatuses = require('./marital-statuses/marital-statuses.service.js');
const getTokens = require('./get-tokens/get-tokens.service.js');
const facilities = require('./facilities/facilities.service.js');
const uploadImages = require('./upload-images/upload-images.service.js');
const countries = require('./countries/countries.service.js');
const people = require('./people/people.service.js');
const emailers = require('./emailers/emailers.service.js');
const patients = require('./patients/patients.service.js');
const smsSenders = require('./sms-senders/sms-senders.service.js');
const saveFacility = require('./save-facility/save-facility.service.js');
const savePerson = require('./save-person/save-person.service.js');
const employees = require('./employees/employees.service.js');
const appointments = require('./appointments/appointments.service.js');
const categoryTypes = require('./category-types/category-types.service.js');
const resendToken = require('./resend-token/resend-token.service.js');
const joinFacilityChannel = require('./join-facility-channel/join-facility-channel.service.js');
const serviceTags = require('./service-tags/service-tags.service.js');
const products = require('./products/products.service.js');
const billings = require('./billings/billings.service.js');
const invoices = require('./invoices/invoices.service.js');
const organisationServices = require('./organisation-services/organisation-services.service.js');
const inPatients = require('./in-patients/in-patients.service.js');
const inpatientTransferStatuses = require('./inpatient-transfer-statuses/inpatient-transfer-statuses.service.js');
const inpatientWaitingLists = require('./inpatient-waiting-lists/inpatient-waiting-lists.service.js');
const inpatientWaitingTypes = require('./inpatient-waiting-types/inpatient-waiting-types.service.js');
const vitaLocations = require('./vita-locations/vita-locations.service.js');
const vitalPositions = require('./vital-positions/vital-positions.service.js');
const vitalRythms = require('./vital-rythms/vital-rythms.service.js');
const forms = require('./forms/forms.service.js');
const formScopeLevels = require('./form-scope-levels/form-scope-levels.service.js');
const formTypes = require('./form-types/form-types.service.js');
const orderMgtTemplates = require('./order-mgt-templates/order-mgt-templates.service.js');
const facilityPrices = require('./facility-prices/facility-prices.service.js');
const diagnosises = require('./diagnosises/diagnosises.service.js');
const laboratoryRequests = require('./laboratory-requests/laboratory-requests.service.js');
const laboratoryReports = require('./laboratory-reports/laboratory-reports.service.js');
const documentations = require('./documentations/documentations.service.js');
const symptoms = require('./symptoms/symptoms.service.js');
const stores = require('./stores/stores.service.js');
const storeRequisitions = require('./store-requisitions/store-requisitions.service.js');
const inventoryTransactionTypes = require('./inventory-transaction-types/inventory-transaction-types.service.js');
const inventoryTransfers = require('./inventory-transfers/inventory-transfers.service.js');
const investigations = require('./investigations/investigations.service.js');
const investigationReportTypes = require('./investigation-report-types/investigation-report-types.service.js');
const purchaseEntries = require('./purchase-entries/purchase-entries.service.js');
const inventories = require('./inventories/inventories.service.js');
const purchaseOrders = require('./purchase-orders/purchase-orders.service.js');
const professions = require('./professions/professions.service.js');
const assignEmployeeUnit = require('./assign-employee-unit/assign-employee-unit.service.js');
const prescriptions = require('./prescriptions/prescriptions.service.js');
const prescriptionPriorities = require('./prescription-priorities/prescription-priorities.service.js');
const presentations = require('./presentations/presentations.service.js');
const productRoutes = require('./product-routes/product-routes.service.js');
const productTypes = require('./product-types/product-types.service.js');
const productVariants = require('./product-variants/product-variants.service.js');
const assignWorkspace = require('./assign-workspace/assign-workspace.service.js');
const workspaces = require('./workspaces/workspaces.service.js');
const auditTray = require('./audit-tray/audit-tray.service.js');
const bedTypes = require('./bed-types/bed-types.service.js');
const clientTypes = require('./client-types/client-types.service.js');
const companycovers = require('./companycovers/companycovers.service.js');
const companycovercategories = require('./companycovercategories/companycovercategories.service.js');
const companyHealthCover = require('./company-health-cover/company-health-cover.service.js');
const consultingRoom = require('./consulting-room/consulting-room.service.js');
const corperateFacility = require('./corperate-facility/corperate-facility.service.js');
const dictionary = require('./dictionary/dictionary.service.js');
const dischargeType = require('./discharge-type/discharge-type.service.js');
const dispense = require('./dispense/dispense.service.js');
const dispenseAssessment = require('./dispense-assessment/dispense-assessment.service.js');
const docUpload = require('./doc-upload/doc-upload.service.js');
const drugStrength = require('./drug-strength/drug-strength.service.js');
const externalPrescription = require('./external-prescription/external-prescription.service.js');
const facilityAccessControl = require('./facility-access-control/facility-access-control.service.js');
const feature = require('./feature/feature.service.js');
const changePassword = require('./change-password/change-password.service.js');
const facilityServiceRender = require('./facility-service-render/facility-service-render.service.js');
const family = require('./family/family.service.js');
const familyHealthCover = require('./family-health-cover/family-health-cover.service.js');
const fluid = require('./fluid/fluid.service.js');
const frequency = require('./frequency/frequency.service.js');
const genericName = require('./generic-name/generic-name.service.js');
const globalService = require('./global-service/global-service.service.js');
const addNetworks = require('./add-networks/add-networks.service.js');
const passwordReset = require('./password-reset/password-reset.service.js');
const hmos = require('./hmos/hmos.service.js');
const tagDictioneries = require('./tag-dictioneries/tag-dictioneries.service.js');
const searchTags = require('./search-tags/search-tags.service.js');
const uploadExcel = require('./upload-excel/upload-excel.service.js');
const familyBeneficiaries = require('./family-beneficiaries/family-beneficiaries.service.js');
const searchNetworkFacilities = require('./search-network-facilities/search-network-facilities.service.js');
const generateUser = require('./generate-user/generate-user.service.js');
const pendingBills = require('./pending-bills/pending-bills.service.js');
const todayInvoices = require('./today-invoices/today-invoices.service.js');
const locSummaryCashes = require('./loc-summary-cashes/loc-summary-cashes.service.js');
const makePayments = require('./make-payments/make-payments.service.js');
const fundWallet = require('./fund-wallet/fund-wallet.service.js');
const joinNetwork = require('./join-network/join-network.service.js');
const securityQuestion = require('./security-question/security-question.service.js');
const searchPeople = require('./search-people/search-people.service.js');
const facilityServiceItems = require('./facility-service-items/facility-service-items.service.js');
const billFacilityServices = require('./bill-facility-services/bill-facility-services.service.js');
const drugGenericList = require('./drug-generic-list/drug-generic-list.service.js');
const payments = require('./payments/payments.service.js');
const uploadFacade = require('./upload-facade/upload-facade.service.js');
const facilityRoles = require('./facility-roles/facility-roles.service.js');
const saveEmployee = require('./save-employee/save-employee.service.js');
const scheduleTypes = require('./schedule-types/schedule-types.service.js');
const schedules = require('./schedules/schedules.service.js');
const timezones = require('./timezones/timezones.service.js');
const billManagers = require('./bill-managers/bill-managers.service.js');
const customFacilityModules = require('./custom-facility-modules/custom-facility-modules.service.js');
const appointmentTypes = require('./appointment-types/appointment-types.service.js');
const orderstatus = require('./orderstatus/orderstatus.service.js');
module.exports = function (app) {
  app.configure(users);
  app.configure(facilityOwnerships);
  app.configure(facilityTypes);
  app.configure(facilityClasses);
  app.configure(facilityModules);
  app.configure(titles);
  app.configure(locations);
  app.configure(relationships);
  app.configure(genders);
  app.configure(maritalStatuses);
  app.configure(getTokens);
  app.configure(facilities);
  app.configure(uploadImages);
  app.configure(countries);
  app.configure(people);
  app.configure(emailers);
  app.configure(patients);
  app.configure(smsSenders);
  app.configure(saveFacility);
  app.configure(savePerson);
  app.configure(employees);
  app.configure(appointments);
  app.configure(categoryTypes);
  app.configure(resendToken);
  app.configure(joinFacilityChannel);
  app.configure(serviceTags);
  app.configure(products);
  app.configure(billings);
  app.configure(invoices);
  app.configure(organisationServices);
  app.configure(inPatients);
  app.configure(inpatientTransferStatuses);
  app.configure(inpatientWaitingLists);
  app.configure(inpatientWaitingTypes);
  app.configure(vitaLocations);
  app.configure(vitalPositions);
  app.configure(vitalRythms);
  app.configure(forms);
  app.configure(formScopeLevels);
  app.configure(formTypes);
  app.configure(orderMgtTemplates);
  app.configure(facilityPrices);
  app.configure(diagnosises);
  app.configure(laboratoryRequests);
  app.configure(laboratoryReports);
  app.configure(documentations);
  app.configure(symptoms);
  app.configure(stores);
  app.configure(storeRequisitions);
  app.configure(inventoryTransactionTypes);
  app.configure(inventoryTransfers);
  app.configure(investigations);
  app.configure(investigationReportTypes);
  app.configure(purchaseEntries);
  app.configure(inventories);
  app.configure(purchaseOrders);
  app.configure(professions);
  app.configure(assignEmployeeUnit);
  app.configure(prescriptions);
  app.configure(prescriptionPriorities);
  app.configure(presentations);
  app.configure(productRoutes);
  app.configure(productTypes);
  app.configure(productVariants);
  app.configure(assignWorkspace);
  app.configure(workspaces);
  app.configure(auditTray);
  app.configure(bedTypes);
  app.configure(clientTypes);
  app.configure(companycovers);
  app.configure(companycovercategories);
  app.configure(companyHealthCover);
  app.configure(consultingRoom);
  app.configure(corperateFacility);
  app.configure(dictionary);
  app.configure(dischargeType);
  app.configure(dispense);
  app.configure(dispenseAssessment);
  app.configure(docUpload);
  app.configure(drugStrength);
  app.configure(externalPrescription);
  app.configure(facilityAccessControl);
  app.configure(feature);
  app.configure(changePassword);
  app.configure(facilityServiceRender);
  app.configure(family);
  app.configure(familyHealthCover);
  app.configure(fluid);
  app.configure(frequency);
  app.configure(genericName);
  app.configure(globalService);
  app.configure(addNetworks);
  app.configure(passwordReset);
  app.configure(hmos);
  app.configure(tagDictioneries);
  app.configure(searchTags);
  app.configure(uploadExcel);
  app.configure(familyBeneficiaries);
  app.configure(searchNetworkFacilities);
  app.configure(generateUser);
  app.configure(pendingBills);
  app.configure(todayInvoices);
  app.configure(locSummaryCashes);
  app.configure(makePayments);
  app.configure(fundWallet);
  app.configure(joinNetwork);
  app.configure(securityQuestion);
  app.configure(searchPeople);
  app.configure(facilityServiceItems);
  app.configure(billFacilityServices);
  app.configure(drugGenericList);
  app.configure(payments);
  app.configure(uploadFacade);
  app.configure(facilityRoles);
  app.configure(saveEmployee);
  app.configure(scheduleTypes);
  app.configure(schedules);
  app.configure(timezones);
  app.configure(billManagers);
  app.configure(customFacilityModules);
  app.configure(appointmentTypes);
  app.configure(orderstatus);
};
