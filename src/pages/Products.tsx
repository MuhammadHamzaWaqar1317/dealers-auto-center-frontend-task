import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, RefreshCw } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useGetCategoriesQuery,
} from "@/store/slices/apiSlice";
import {
  setSearchQuery,
  setSelectedCategory,
  setSortOption,
  selectSearchQuery,
  selectSelectedCategory,
  selectSortOption,
} from "@/store/slices/productSlice";
import type { Product } from "@/components/ProductCard";

const ITEMS_PER_PAGE = 8;

const Products = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const searchQuery = useSelector(selectSearchQuery); 
  const selectedCategory = useSelector(selectSelectedCategory);
  const sortOption = useSelector(selectSortOption);

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localSearch));
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);


  const searchId = searchQuery.trim() ? parseInt(searchQuery, 10) : null;
  const isValidSearchId = searchId !== null && !isNaN(searchId);


  const { data: allProducts = [], isLoading: isLoadingAll, error: errorAll, refetch: refetchAll } = useGetProductsQuery(undefined, { skip: isValidSearchId });
  const { data: categoryProducts = [], isLoading: isLoadingCategory, error: errorCategory, refetch: refetchCategory } = useGetProductsByCategoryQuery(
    selectedCategory,
    { skip: selectedCategory === "all" || isValidSearchId }
  );
  const { data: productById, isLoading: isLoadingId, error: errorId, refetch: refetchId } = useGetProductByIdQuery(
    searchId!,
    { skip: !isValidSearchId }
  );
  const { data: categories = [] } = useGetCategoriesQuery();

  let products: Product[] = [];
  let isLoading: boolean;
  let error: unknown;

  if (isValidSearchId) {
    products = productById ? [productById] : [];
    isLoading = isLoadingId;
    error = errorId;
  } else if (selectedCategory === "all") {
    products = allProducts;
    isLoading = isLoadingAll;
    error = errorAll;
  } else {
    products = categoryProducts;
    isLoading = isLoadingCategory;
    error = errorCategory;
  }

  if (selectedCategory !== "all" && !isValidSearchId) {
    products = products.filter((p) => p.category === selectedCategory);
  }

  const filtered = useMemo(() => {
    let result = [...products];
    switch (sortOption) {
      case "name-asc": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "name-desc": result.sort((a, b) => b.title.localeCompare(a.title)); break;
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
    }
    return result;
  }, [products, sortOption]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [searchQuery, sortOption, selectedCategory]);

  const handleRefetch = () => {
    if (isValidSearchId) {
      refetchId();
    } else if (selectedCategory === "all") {
      refetchAll();
    } else {
      refetchCategory();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Products</h1>
        <p className="mt-1 text-muted-foreground">Discover our curated collection</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by product ID..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={(v) => dispatch(setSelectedCategory(v))}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOption} onValueChange={(v) => dispatch(setSortOption(v))}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="name-asc">Name A–Z</SelectItem>
            <SelectItem value="name-desc">Name Z–A</SelectItem>
            <SelectItem value="price-asc">Price: Low → High</SelectItem>
            <SelectItem value="price-desc">Price: High → Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-lg font-medium text-foreground">Something went wrong</p>
          <p className="text-sm text-muted-foreground">{(error as Error).message || "Failed to fetch products"}</p>
          <Button onClick={handleRefetch} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        </div>
      ) : paginated.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-medium text-foreground">No products found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
