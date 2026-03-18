import { defineRouteConfig } from "@medusajs/admin-sdk";
import { PhotoSolid } from "@medusajs/icons";
import {
  Container,
  Heading,
  Table,
  Button,
  Drawer,
  Toaster,
  toast,
  Input,
  IconButton,
} from "@medusajs/ui";
import { MagnifyingGlass } from "@medusajs/icons";
import { useEffect, useMemo, useState } from "react";
//@ts-ignore
import { debounce } from "lodash";
import CreateDigitalProductForm from "../../components/create-template-form";
import EditTemplateForm from "../../components/edit-template-form";

const DigitalProductsPage = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const pageLimit = 20;
  const [count, setCount] = useState(0);

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
        // Don't reset page on search since we're doing client-side filtering
      }, 300),
    []
  );

  // Client-side filtering
  const filteredTemplates = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") return templates;
    const lowerQuery = searchQuery.toLowerCase();
    return templates.filter(
      (template) =>
        template.name?.toLowerCase().includes(lowerQuery) ||
        template.category_top?.toLowerCase().includes(lowerQuery) ||
        template.category_sub?.toLowerCase().includes(lowerQuery) ||
        template.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
    );
  }, [templates, searchQuery]);
  
  // Calculate pagination based on filtered results
  const pagesCount = useMemo(() => Math.ceil(filteredTemplates.length / pageLimit), [filteredTemplates.length, pageLimit]);
  const canNextPage = useMemo(() => currentPage < pagesCount - 1, [currentPage, pagesCount]);
  const canPreviousPage = useMemo(() => currentPage > 0, [currentPage]);
  
  // Paginate filtered templates
  const paginatedTemplates = useMemo(() => {
    const start = currentPage * pageLimit;
    const end = start + pageLimit;
    return filteredTemplates.slice(start, end);
  }, [filteredTemplates, currentPage, pageLimit]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSetSearchQuery(value);
  };

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
      });
      const res = await fetch(`/admin/digital-products?${query.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const { digital_products, count: totalCount } = await res.json();
      
      // Filter for templates only (isTemplate === true) and exclude blocks
      const digital_products_with_template_data = digital_products.filter(
        (product: any) => {
          // Must have isTemplate flag set to true
          if (!product.isTemplate) {
            return false;
          }
          
          // Exclude blocks - blocks should only appear in mini-templates admin area
          const isBlock = 
            product.category_top?.toLowerCase() === "blocks" ||
            product.category_sub?.toLowerCase() === "blocks" ||
            product.tags?.some((tag: string) => tag?.toLowerCase?.()?.includes("block"));
          
          return !isBlock;
        }
      );
      
      setTemplates(digital_products_with_template_data);
      setCount(digital_products_with_template_data.length);
    } catch (err) {
      console.error("Error fetching products:", err);
      //@ts-ignore
      toast.error("Error fetching templates", { description: err.message });
    }
  };
  
  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      const res = await fetch(`/admin/digital-products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete template");
      }
      toast.success("Template deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting template:", err);
      //@ts-ignore
      toast.error("Error deleting template", { description: err.message });
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`/admin/digital-products/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch template");
      const { digital_product } = await res.json();
      setSelectedTemplate(digital_product);
      setIsEditing(true);
      setOpen(true);
    } catch (err) {
      console.error("Error fetching template for edit:", err);
      //@ts-ignore
      toast.error("Error loading template", { description: err.message });
    }
  };

  const handleCloseDrawer = () => {
    setOpen(false);
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  return (
    <Container>
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Templates</Heading>
        <div className="flex gap-2">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search templates..."
              value={inputValue}
              onChange={handleSearchChange}
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
            <Drawer.Trigger
              onClick={() => {
                setIsEditing(false);
                setSelectedTemplate(null);
                setOpen(true);
              }}
              asChild
            >
              <Button>Create</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>{isEditing ? "Edit Template" : "Create Template"}</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body className="overflow-auto">
                {isEditing && selectedTemplate ? (
                  <EditTemplateForm
                    initialData={{
                      id: selectedTemplate.id,
                      name: selectedTemplate.name,
                      creator_id: selectedTemplate.creator_id,
                      is_premium: selectedTemplate.is_premium,
                      isTemplate: selectedTemplate.isTemplate,
                      show_in_studio: selectedTemplate.show_in_studio,
                      category_top: selectedTemplate.category_top,
                      category_sub: selectedTemplate.category_sub,
                      tags: selectedTemplate.tags,
                      thumbnail: selectedTemplate.thumbnail,
                      medias: selectedTemplate.medias,
                      template_data: selectedTemplate.template_data,
                      product: { title: selectedTemplate.product?.title || "" },
                    }}
                    onSuccess={() => {
                      handleCloseDrawer();
                      fetchProducts();
                    }}
                  />
                ) : (
                  <CreateDigitalProductForm
                    onSuccess={() => {
                      handleCloseDrawer();
                      setCurrentPage(0);
                      fetchProducts();
                    }}
                  />
                )}
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
        </div>
      </div>
      {paginatedTemplates.length > 0 ? (
        <>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Thumbnail</Table.HeaderCell>
                <Table.HeaderCell>Top Category</Table.HeaderCell>
                <Table.HeaderCell>Sub Category</Table.HeaderCell>
                <Table.HeaderCell>Tags</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedTemplates.map((digitalProduct) => (
                <Table.Row key={digitalProduct.id}>
                  <Table.Cell>{digitalProduct.name}</Table.Cell>
                  <Table.Cell>
                    {digitalProduct.thumbnail ? (
                      <img
                        src={digitalProduct.thumbnail}
                        alt="Thumbnail"
                        width={50}
                        height={50}
                        className="object-cover"
                      />
                    ) : (
                      <span>No thumbnail</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>{digitalProduct.category_top || "N/A"}</Table.Cell>
                  <Table.Cell>{digitalProduct.category_sub || "N/A"}</Table.Cell>
                  <Table.Cell>
                    {digitalProduct.tags?.length > 0 ? digitalProduct.tags.join(", ") : "No tags"}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleEdit(digitalProduct.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(digitalProduct.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Table.Pagination
            count={filteredTemplates.length}
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
        <p>No templates found.</p>
      )}
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Templates",
  icon: PhotoSolid,
});

export default DigitalProductsPage;