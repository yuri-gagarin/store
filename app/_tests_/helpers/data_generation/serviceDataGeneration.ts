import faker from "faker";
// models and model intefaces //
import { IBusinessAccount } from "../../../models/BusinessAccount";
import Service, { IService } from "../../../models/Service";
// additional types and interfaces //
import { ServiceData } from "../../../controllers/services_controller/type_declarations/servicesControllerTypes";


export const generateMockServiceData = (numberToGenerate: number): ServiceData[] => {
  const mockServices: ServiceData[] = [];
  for (let i = 0; i < numberToGenerate; i++) {
    const newMockService: ServiceData = {
      name: faker.company.companyName(),
      price: faker.commerce.price(10, 100),
      description: faker.lorem.paragraph(),
      images: []
    };
    mockServices.push(newMockService);
  } 
  return mockServices;
}
/**
 * Creates a set number of mock {Service} objects.
 * @param numOfServices - number of mock {Service} models to create.
 * @param businessAccountId - 'BusinessAcccount' model _id to tie the service to.
 */
export const createServices = (numOfServices: number, businessAccountId: string): Promise<IService[]> => {
  const createdServices: Promise<IService>[] = [];

  for (let i = 0; i < numOfServices; i++) {
    createdServices.push(Service.create({
      businessAccountId: businessAccountId,
      name: faker.lorem.word(),
      description: faker.lorem.paragraphs(2),
      price: faker.commerce.price(1, 100),
      images: []
    }));
  }
  return Promise.all(createdServices);
};