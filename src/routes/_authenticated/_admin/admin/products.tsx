import { createFileRoute } from '@tanstack/react-router';
import { AlertCircle, ChevronLeft, ChevronRight, Loader2, Package, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProduct, useProducts } from '@/queries/product.queries';

const PAGE_LIMIT = 10;

export const Route = createFileRoute('/_authenticated/_admin/admin/products')({
  component: AdminProductsManagement,
});

function AdminProductsManagement() {
  const [page, setPage] = useState(0);
  const skip = page * PAGE_LIMIT;
  const {
    data: productsResponse,
    isLoading,
    error,
    isFetching,
  } = useProducts({
    skip,
    limit: PAGE_LIMIT,
  });
  const createProduct = useCreateProduct();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const products = productsResponse?.data ?? [];
  const total = productsResponse?.total ?? 0;
  const totalPages = productsResponse?.totalPages ?? 0;
  const hasMore = productsResponse?.hasMore ?? false;

  const rangeLabel = useMemo(() => {
    if (products.length === 0) {
      return '0 products';
    }

    const start = skip + 1;
    const end = skip + products.length;
    return `${start}-${end}`;
  }, [products.length, skip]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setCategory('');
    setImageUrl('');
    setFieldErrors({});
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!name.trim()) nextErrors.name = 'Name is required.';
    if (!description.trim()) nextErrors.description = 'Description is required.';
    if (!category.trim()) nextErrors.category = 'Category is required.';
    if (!price.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      nextErrors.price = 'Price must be a positive number.';
    }
    if (!stock.trim() || Number.isNaN(parsedStock) || parsedStock < 0) {
      nextErrors.stock = 'Stock must be zero or greater.';
    }
    if (imageUrl.trim() && !/^https?:\/\//i.test(imageUrl.trim())) {
      nextErrors.imageUrl = 'Image URL must be a valid http(s) URL.';
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    createProduct.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        stock: parsedStock,
        category: category.trim(),
        imageUrl: imageUrl.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Product created successfully');
          resetForm();
        },
        onError: (mutationError) => {
          toast.error(mutationError.message || 'Failed to create product');
        },
      },
    );
  };

  return (
    <div className='space-y-8 p-6'>
      <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <div className='flex items-center gap-3'>
          <div className='rounded-xl bg-blue-500/10 p-2 text-blue-500'>
            <Package className='h-8 w-8' />
          </div>
          <div>
            <h1 className='text-3xl font-bold'>Inventory Management</h1>
            <p className='text-muted-foreground'>Create products and review the live catalog.</p>
          </div>
        </div>
      </div>

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]'>
        <Card className='border-none shadow-sm shadow-black/5'>
          <CardHeader>
            <CardTitle>Create Product</CardTitle>
            <CardDescription>Admin-only product creation through the API gateway.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className='grid gap-4 md:grid-cols-2' onSubmit={handleSubmit}>
              <div className='space-y-2 md:col-span-1'>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' value={name} onChange={(event) => setName(event.target.value)} />
                {fieldErrors.name && <p className='text-sm text-red-600'>{fieldErrors.name}</p>}
              </div>
              <div className='space-y-2 md:col-span-1'>
                <Label htmlFor='category'>Category</Label>
                <Input
                  id='category'
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                />
                {fieldErrors.category && (
                  <p className='text-sm text-red-600'>{fieldErrors.category}</p>
                )}
              </div>
              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={5}
                />
                {fieldErrors.description && (
                  <p className='text-sm text-red-600'>{fieldErrors.description}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='price'>Price</Label>
                <Input
                  id='price'
                  type='number'
                  min='0'
                  step='0.01'
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
                {fieldErrors.price && <p className='text-sm text-red-600'>{fieldErrors.price}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='stock'>Stock</Label>
                <Input
                  id='stock'
                  type='number'
                  min='0'
                  step='1'
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                />
                {fieldErrors.stock && <p className='text-sm text-red-600'>{fieldErrors.stock}</p>}
              </div>
              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='imageUrl'>Image URL</Label>
                <Input
                  id='imageUrl'
                  type='url'
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder='https://example.com/product.jpg'
                />
                {fieldErrors.imageUrl && (
                  <p className='text-sm text-red-600'>{fieldErrors.imageUrl}</p>
                )}
              </div>
              <div className='md:col-span-2'>
                <Separator className='my-2' />
                <div className='flex items-center justify-between gap-4'>
                  <p className='text-sm text-muted-foreground'>
                    Product names, descriptions, prices, stock, and category are required.
                  </p>
                  <Button type='submit' disabled={createProduct.isPending} className='min-w-40'>
                    {createProduct.isPending ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className='mr-2 h-4 w-4' />
                        Create Product
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className='border-none shadow-sm shadow-black/5'>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>
              Latest products returned by the paginated catalog endpoint.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {isLoading && (
              <div className='flex items-center justify-center py-12'>
                <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
              </div>
            )}
            {error && (
              <div className='flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700'>
                <AlertCircle className='h-5 w-5' />
                <p className='text-sm'>Failed to load recent products.</p>
              </div>
            )}
            {!isLoading && !error && products.length === 0 && (
              <p className='py-12 text-center text-sm text-muted-foreground'>
                No products returned from the catalog yet.
              </p>
            )}
            {!isLoading && !error && products.length > 0 && (
              <div className='space-y-4'>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                  <p className='text-sm text-muted-foreground'>
                    Showing {rangeLabel} of {total} products{isFetching ? ' · Updating...' : ''}
                  </p>
                  <div className='flex items-center gap-3'>
                    <Button
                      variant='outline'
                      onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
                      disabled={page === 0 || isFetching}
                    >
                      <ChevronLeft className='mr-2 h-4 w-4' />
                      Previous
                    </Button>
                    <Button
                      onClick={() => setPage((currentPage) => currentPage + 1)}
                      disabled={!hasMore || isFetching}
                    >
                      Next
                      <ChevronRight className='ml-2 h-4 w-4' />
                    </Button>
                  </div>
                </div>
                <div className='overflow-hidden rounded-xl border'>
                  <table className='w-full text-sm'>
                    <thead className='bg-muted/50 text-left'>
                      <tr>
                        <th className='px-4 py-3 font-medium'>Product</th>
                        <th className='px-4 py-3 font-medium'>Category</th>
                        <th className='px-4 py-3 font-medium'>Price</th>
                        <th className='px-4 py-3 font-medium'>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => {
                        const availableStock = product.availableStock ?? product.stock ?? 0;
                        return (
                          <tr key={product._id} className='border-t'>
                            <td className='px-4 py-3'>
                              <div className='font-medium'>{product.name}</div>
                              <div className='text-xs text-muted-foreground'>{product._id}</div>
                            </td>
                            <td className='px-4 py-3 text-muted-foreground'>{product.category}</td>
                            <td className='px-4 py-3 font-mono'>${product.price.toFixed(2)}</td>
                            <td className='px-4 py-3'>{availableStock}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className='text-xs text-muted-foreground'>
                  Page {page + 1} of {Math.max(totalPages, 1)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
