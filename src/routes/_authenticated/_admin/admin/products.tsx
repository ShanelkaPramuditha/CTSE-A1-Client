import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  Search,
  SlidersHorizontal,
  Plus,
  MoreHorizontal,
  Edit,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { productService } from '@/services/product.service';
import type { Product, PagedProductsResponse } from '@/types/product';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useCreateProduct } from '@/queries/product.queries';

export const Route = createFileRoute('/_authenticated/_admin/admin/products')({
  component: AdminProductsManagement,
});

const lkrFormatter = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
  maximumFractionDigits: 2,
});

function getStockStatus(product: Product) {
  const availableStock = product.availableStock ?? product.stock;

  if (availableStock <= 0) {
    return 'Out of Stock';
  }

  if (availableStock <= 10) {
    return 'Low Stock';
  }

  return 'In Stock';
}

function AdminProductsManagement() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const createMutation = useCreateProduct();

  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    // Explicit result typing keeps list operations strongly typed.
    queryFn: (): Promise<PagedProductsResponse> =>
      productService.getProducts({ limit: 48, offset: 0 }),
    queryKey: ['admin-products', 'list'],
  });

  const filteredProducts = useMemo(() => {
    const products = productsResponse?.data ?? [];
    const trimmedSearch = search.trim().toLowerCase();

    if (!trimmedSearch) {
      return products;
    }

    return products.filter((product) => {
      const name = product.name.toLowerCase();
      const category = product.category.toLowerCase();
      return name.includes(trimmedSearch) || category.includes(trimmedSearch);
    });
  }, [productsResponse, search]);

  return (
    <div className='p-6 space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-blue-500/10 rounded-xl text-blue-500'>
            <Package className='h-8 w-8' />
          </div>
          <div>
            <h1 className='text-3xl font-bold'>Inventory Management</h1>
            <p className='text-muted-foreground'>Total control over your product catalog.</p>
          </div>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size='lg' className='shadow-lg'>
              <Plus className='h-5 w-5 mr-2' />
              Create Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Product</DialogTitle>
              <DialogDescription>Add a new product to the catalog.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const fd = new FormData(form);
                const payload = {
                  name: String(fd.get('name') ?? '').trim(),
                  description: String(fd.get('description') ?? '').trim(),
                  price: Number(fd.get('price') ?? 0),
                  stock: Number(fd.get('stock') ?? 0),
                  category: String(fd.get('category') ?? '').trim(),
                  imageUrl: String(fd.get('imageUrl') ?? '').trim() || undefined,
                };

                createMutation.mutate(payload, {
                  onSuccess: () => {
                    setCreateOpen(false);
                    form.reset();
                    toast.success('Product created successfully');
                  },
                  onError: (error) => {
                    toast.error(
                      error instanceof Error ? error.message : 'Failed to create product',
                    );
                  },
                });
              }}
            >
              <div className='grid gap-3'>
                <div>
                  <label className='text-sm font-medium'>Name</label>
                  <Input name='name' required />
                </div>
                <div>
                  <label className='text-sm font-medium'>Description</label>
                  <Textarea name='description' required />
                </div>
                <div className='grid grid-cols-3 gap-2'>
                  <Input name='price' type='number' step='0.01' placeholder='Price' required />
                  <Input name='stock' type='number' placeholder='Stock' required />
                  <Input name='category' placeholder='Category' required />
                </div>
                <div>
                  <label className='text-sm font-medium'>Image URL</label>
                  <Input name='imageUrl' placeholder='https://...' />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type='button' variant='outline'>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type='submit' disabled={createMutation.isLoading}>
                    {createMutation.isLoading ? 'Creating...' : 'Create Product'}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className='border-none shadow-sm shadow-black/5'>
        <CardHeader className='pb-0'>
          <div className='flex flex-col md:flex-row justify-between gap-4'>
            <div className='relative w-full md:w-96'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search catalog...'
                className='pl-10'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Button variant='outline' size='icon'>
              <SlidersHorizontal className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent className='pt-6'>
          {isLoading ? (
            <div className='flex items-center gap-2 py-6 text-sm text-muted-foreground'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Loading products...
            </div>
          ) : null}

          {isError ? (
            <div className='rounded-md border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive'>
              {(error as Error)?.message || 'Failed to load products'}
            </div>
          ) : null}

          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Ordered</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((item) => {
                const status = getStockStatus(item);
                const availableStock = item.availableStock ?? item.stock;
                const orderedQuantity = item.orderedQuantity ?? 0;

                return (
                  <TableRow key={item._id}>
                    <TableCell>
                      <div className='font-medium'>{item.name}</div>
                      <div className='text-xs text-muted-foreground'>{item._id}</div>
                    </TableCell>
                    <TableCell className='text-muted-foreground'>{item.category}</TableCell>
                    <TableCell className='font-mono'>{lkrFormatter.format(item.price)}</TableCell>
                    <TableCell>{availableStock}</TableCell>
                    <TableCell>{orderedQuantity}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          status === 'In Stock'
                            ? 'bg-green-500/10 text-green-600'
                            : status === 'Low Stock'
                              ? 'bg-orange-500/10 text-orange-600'
                              : 'bg-red-500/10 text-red-600'
                        }`}
                      >
                        {status}
                      </span>
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-40'>
                          <DropdownMenuLabel>Product Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className='h-4 w-4 mr-2' /> Edit Info
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}

              {!isLoading && !isError && filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-6 text-center text-sm text-muted-foreground'>
                    No products found.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
