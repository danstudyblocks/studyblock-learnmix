import { defineRouteConfig } from "@medusajs/admin-sdk";
import { PhotoSolid, MagnifyingGlass } from "@medusajs/icons";
import {
  Container,
  Heading,
  Table,
  Button,
  Drawer,
  Input,
  IconButton,
  Toaster,
  toast,
} from "@medusajs/ui";
import { useEffect, useMemo, useState } from "react";
//@ts-ignore
import { debounce } from "lodash";
import CreateDigitalProductForm from "../../components/create-digital-product-form";

const DigitalProductsPage = () => {
  const [digitalProducts, setDigitalProducts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageLimit = 20;
  const [count, setCount] = useState(0);
  const pagesCount = useMemo(() => Math.ceil(count / pageLimit), [count]);
  const canNextPage = useMemo(() => currentPage < pagesCount - 1, [currentPage, pagesCount]);
  const canPreviousPage = useMemo(() => currentPage > 0, [currentPage]);

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
        setCurrentPage(0); // Reset to first page on search
      }, 300),
    []
  );

  const nextPage = () => {
    if (canNextPage) {
      console.log("Next page clicked, currentPage:", currentPage, "pagesCount:", pagesCount);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (canPreviousPage) {
      console.log("Previous page clicked, currentPage:", currentPage);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const fetchProducts = async () => {
    try {
      const query = new URLSearchParams({
        limit: `${pageLimit}`,
        offset: `${pageLimit * currentPage}`,
        ...(searchQuery && { q: searchQuery }), // Add search query
      });
      const res = await fetch(`/admin/digital-products?${query.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const { digital_products, count: totalCount } = await res.json();
      const digital_products_without_template_data = digital_products.filter(
        (product: any) => !product.isTemplate || !product.template_data
      );
      setDigitalProducts(digital_products_without_template_data);
      setCount(totalCount); // Use API's total count
    } catch (err) {
      console.error("Error fetching products:", err);
      //@ts-ignore
      toast.error("Error fetching digital products", { description: err.message });
    }
  };

  // Client-side filtering as fallback
  const filteredDigitalProducts = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") return digitalProducts;
    const lowerQuery = searchQuery.toLowerCase();
    return digitalProducts.filter(
      (product) =>
        product.name?.toLowerCase().includes(lowerQuery) ||
        product.product_variant?.product_id?.toLowerCase().includes(lowerQuery)
    );
  }, [digitalProducts, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery]);

  return (
    <Container>
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Digital Products</Heading>
        <div className="flex gap-2">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search digital products..."
              value={searchQuery}
              onChange={(e) => debouncedSetSearchQuery(e.target.value)}
              className="w-64 pr-10"
            />
            <IconButton
              variant="transparent"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <MagnifyingGlass />
            </IconButton>
          </div>
          <Drawer open={open} onOpenChange={setOpen}>
            <Drawer.Trigger onClick={() => setOpen(true)} asChild>
              <Button>Create</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Create Product</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body className="overflow-auto">
                <CreateDigitalProductForm
                  onSuccess={() => {
                    setOpen(false);
                    setCurrentPage(0);
                    fetchProducts();
                  }}
                />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
        </div>
      </div>
      {filteredDigitalProducts.length > 0 ? (
        <>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Media Preview</Table.HeaderCell>
                <Table.HeaderCell>Product Variant</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredDigitalProducts.map((digitalProduct) => (
                <Table.Row key={digitalProduct.id}>
                  <Table.Cell>{digitalProduct.name}</Table.Cell>
                  <Table.Cell>
                    {digitalProduct.medias.length > 0 ? (
                      digitalProduct.medias
                        .filter((media: any) => media.type === "preview")
                        .slice(
                          0,
                          Math.ceil(
                            digitalProduct.medias.filter((media: any) => media.type === "preview")
                              .length / 2
                          )
                        )
                        .map((media: any) => (
                          <div key={media.id}>
                            {media.mimeType.startsWith("image") ? (
                              <img
                                src={`https://studyblocksimages.s3.us-west-2.amazonaws.com/${media.fileId}`}
                                alt="Preview"
                                width={50}
                                height={50}
                              />
                            ) : (
                              <a
                                href={`https://studyblocksimages.s3.us-west-2.amazonaws.com/${media.fileId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {media.mimeType}
                              </a>
                            )}
                          </div>
                        ))
                    ) : (
                      <span>No media available</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {digitalProduct?.product_variant?.product_id || "No Variant"}
                  </Table.Cell>
                  <Table.Cell>
                    {digitalProduct?.product_variant?.product_id ? (
                      <a href={`/app/products/${digitalProduct?.product_variant?.product_id}`}>
                        View Product
                      </a>
                    ) : (
                      <span>No product to view</span>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Table.Pagination
            count={count}
            pageSize={pageLimit}
            pageIndex={currentPage}
            pageCount={pagesCount}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            previousPage={previousPage}
            nextPage={nextPage}
          />
        </>
      ) : (
        <p>No digital products found.</p>
      )}
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Digital Products",
  icon: PhotoSolid,
});

export default DigitalProductsPage;