import { prisma } from "@/lib/prisma";

export const getProducts = async () => {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getProduct = async (id: string) => {
  return await prisma.product.findFirst({
    where: { id },
  });
};

export const getProductUnique = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
  });
};

export const getProductCount = async () => {
  const productCount = await prisma.product.count();
  return productCount;
};

export const createProduct = async () => {
  const newProduct = await prisma.product.create({
    data: {
      title: "Test Product",
      price: 19.99,
    },
  });

  console.log(newProduct);
};

export const updateProduct = async () => {
  const updateProduct = await prisma.product.update({
    where: { id: "0d96c7b3-c04b-45a2-8b32-2c4518ec2c45" },
    data: {
      title: "Updated Test Product",
      price: 29.99,
    },
  });

  console.log(updateProduct);
};

export const removeProduct = async () => {
  const removeProduct = await prisma.product.delete({
    where: { id: "0d96c7b3-c04b-45a2-8b32-2c4518ec2c45" },
  });

  console.log(removeProduct);
};

export const getProductPriceLte = async () => {
  const products = await prisma.product.findMany({
    where: {
      price: {
        lte: 500, // <= 500
      },
    },
  });

  console.log(products);
};

export const getProductPriceGte = async () => {
  const products = await prisma.product.findMany({
    where: {
      price: {
        gte: 500, // >= 500
      },
    },
  });

  console.log(products);
};

export const getProductByPrice = async () => {
  const products = await prisma.product.findMany({
    where: {
      price: {
        lte: 300, // <= 300
        gte: 200, // >= 200
      },
    },
  });

  console.log(products);
};
