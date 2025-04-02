const DynamicPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  console.log(id);

  return <div>{id}</div>;
};
export default DynamicPage;
