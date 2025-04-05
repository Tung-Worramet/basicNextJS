import { getProduct } from "@/db/products";

interface PrismaProductIdPageProps {
  params: Promise<{ id: string }>;
}

const PrismaProductPage = async ({ params }: PrismaProductIdPageProps) => {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return <div>ไม่พบสินค้า</div>;
  }

  return <div>Title: {product?.title}</div>;
};

export default PrismaProductPage;
