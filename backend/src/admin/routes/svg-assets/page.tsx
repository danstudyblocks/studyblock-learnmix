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
import SvgAssetUploadModal from "../../components/svg-asset-management/SvgAssetUploadModal";
import SvgAssetEditModal from "../../components/svg-asset-management/SvgAssetEditModal";

const SvgAssetsPage = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
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

  const fetchAssets = async () => {
    try {
      const query = new URLSearchParams({
        limit: `${pageLimit}`,
        offset: `${pageLimit * currentPage}`,
        ...(searchQuery && { search: searchQuery }), // Add search query
      });
      const res = await fetch(`/admin/svg-assets?${query.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch assets");
      const { svg_assets, count: totalCount } = await res.json();
      setAssets(svg_assets || []);
      setCount(totalCount || svg_assets?.length || 0);
    } catch (err) {
      console.error("Error fetching assets:", err);
      //@ts-ignore
      toast.error("Error fetching assets", { description: err.message });
    }
  };

  // Client-side filtering as fallback
  const filteredAssets = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") return assets;
    const lowerQuery = searchQuery.toLowerCase();
    return assets.filter(
      (asset) =>
        asset.name?.toLowerCase().includes(lowerQuery) ||
        asset.description?.toLowerCase().includes(lowerQuery) ||
        asset.category_top?.toLowerCase().includes(lowerQuery) ||
        asset.category_sub?.toLowerCase().includes(lowerQuery) ||
        asset.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
    );
  }, [assets, searchQuery]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this icon asset?")) return;
    try {
      const res = await fetch(`/admin/svg-assets/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete asset");
      }
      toast.success("Icon asset deleted successfully");
      fetchAssets();
    } catch (err) {
      console.error("Error deleting asset:", err);
      //@ts-ignore
      toast.error("Error deleting asset", { description: err.message });
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`/admin/svg-assets/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch asset");
      const { svg_asset } = await res.json();
      setSelectedAsset(svg_asset);
      setIsEditing(true);
      setOpen(true);
    } catch (err) {
      console.error("Error fetching asset for edit:", err);
      //@ts-ignore
      toast.error("Error loading asset", { description: err.message });
    }
  };

  const handleCloseDrawer = () => {
    setOpen(false);
    setIsEditing(false);
    setSelectedAsset(null);
  };

  const handleAssetCreate = (newAsset: any) => {
    setAssets([newAsset, ...assets]);
    setCount(prev => prev + 1);
    handleCloseDrawer();
  };

  const handleAssetUpdate = (updatedAsset: any) => {
    setAssets(assets.map(asset => asset.id === updatedAsset.id ? updatedAsset : asset));
    handleCloseDrawer();
  };

  useEffect(() => {
    fetchAssets();
  }, [currentPage, searchQuery]);

  return (
    <Container>
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Icon Assets (SVG/WebP)</Heading>
        <div className="flex gap-2">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search assets..."
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
                setSelectedAsset(null);
                setOpen(true);
              }}
              asChild
            >
              <Button>Create</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>{isEditing ? "Edit Icon Asset" : "Create Icon Asset"}</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body className="overflow-auto">
                {isEditing && selectedAsset ? (
                  <SvgAssetEditModal
                    asset={selectedAsset}
                    onClose={handleCloseDrawer}
                    onSuccess={handleAssetUpdate}
                  />
                ) : (
                  <SvgAssetUploadModal
                    onClose={handleCloseDrawer}
                    onSuccess={handleAssetCreate}
                  />
                )}
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
        </div>
      </div>
      {filteredAssets.length > 0 ? (
        <>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Preview</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Top Category</Table.HeaderCell>
                <Table.HeaderCell>Sub Category</Table.HeaderCell>
                <Table.HeaderCell>Tags</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredAssets.map((asset) => (
                <Table.Row key={asset.id}>
                  <Table.Cell>{asset.name}</Table.Cell>
                  <Table.Cell>
                    {asset.thumbnail ? (
                      <img
                        src={asset.thumbnail}
                        alt="Preview"
                        width={50}
                        height={50}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                        {asset.mime_type?.includes('webp') ? 'WebP' : 'SVG'}
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      asset.is_premium 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {asset.is_premium ? 'Premium' : 'Free'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{asset.category_top || "N/A"}</Table.Cell>
                  <Table.Cell>{asset.category_sub || "N/A"}</Table.Cell>
                  <Table.Cell>
                    {asset.tags?.length > 0 ? asset.tags.join(", ") : "No tags"}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleEdit(asset.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(asset.id)}
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
        <p>No icon assets found.</p>
      )}
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Icon Assets",
  icon: PhotoSolid,
});

export default SvgAssetsPage;
