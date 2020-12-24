import faker from "faker";
import { IBusinessAccount } from "../../../models/BusinessAccount"; 
import Product, { IProduct } from "../../../models/Product";
import { ProductData } from "../../../controllers/products_controller/type_declarations/productsControllerTypes";

//
export const generateMockProductData = (numOfProds: number): ProductData[] => {
  const prodData: ProductData[] = [];
  for (let i = 0; i < numOfProds; i++) {
    prodData.push({
      name: faker.commerce.product(),
      price: faker.commerce.price(10, 100),
      description: faker.lorem.paragraph(),
      details: faker.lorem.paragraph()
    });
  }
  return prodData;
}
/**
 * Creates a set number of mock {Product} objects.
 * @param numOfProducts - Number of products to create.
 * @param busAccountId - BusinessAccount model id to tie the product to.
 * @returns Promise<IProduct[]>
 */
export const createProducts = (numOfProducts: number, busAccountId: string): Promise<IProduct[]> => {
  const createdProducts: Promise<IProduct>[] = [];

  for (let i = 0; i < numOfProducts; i++) {
    createdProducts.push(Product.create({
      businessAccountId: busAccountId,
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      details: faker.lorem.paragraphs(3),
      price: faker.commerce.price(1, 100),
      images: [],
      createdAt: new Date(Date.now()),
      editedAt: new Date(Date.now())
    }));
  }
  return Promise.all(createdProducts);
};