import { prisma } from "@/lib/prisma";

const PrismaPage = async () => {
  const products = await prisma.product.findMany();
  console.log(products);

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h1>Title: {product.title}</h1>
          <p>Price: {product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default PrismaPage;
