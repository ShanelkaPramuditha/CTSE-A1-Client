import { useMemo, useState } from 'react';
import {
  Package,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  ExternalLink,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteProduct, useProducts } from '@/queries/product.queries';
import { CreateProductDialog } from '@/components/pages/admin/create-product-dialog';
import { ProductImage } from '@/components/pages/product/product-image';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function stockStatus(availableStock: number) {
  if (availableStock === 0)
    return { label: 'Out of stock', className: 'bg-red-500/10 text-red-600' };
  if (availableStock < 10)
    return { label: 'Low stock', className: 'bg-orange-500/10 text-orange-600' };
  return { label: 'In stock', className: 'bg-green-500/10 text-green-600' };
}

export function AdminInventoryPage() {
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const { data: products, isLoading, isError, error } = useProducts();
  const deleteProduct = useDeleteProduct();

  const filtered = useMemo(() => {
    if (!products) return [];
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q),
    );
  }, [products, search]);

  return (
    <div className='p-6 space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-blue-500/10 rounded-xl text-blue-500'>
            <Package className='h-8 w-8' />
          </div>
          <div>
            <h1 className='text-3xl font-bold'>Inventory</h1>
            <p className='text-muted-foreground'>Manage your product catalog.</p>
          </div>
        </div>
        <CreateProductDialog />
      </div>

      {isError ? (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Could not load products</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Something went wrong. Try again later.'}
          </AlertDescription>
        </Alert>
      ) : null}

      <Card className='border-none shadow-sm shadow-black/5'>
        <CardHeader className='pb-0'>
          <div className='flex flex-col md:flex-row justify-between gap-4'>
            <div className='relative w-full md:w-96'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search by name, category, or id…'
                className='pl-10'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant='outline' size='icon' type='button' aria-label='Filters (placeholder)'>
              <SlidersHorizontal className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent className='pt-6'>
          {isLoading ? (
            <div className='space-y-3'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-12 w-full' />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className='text-center text-muted-foreground py-10'>
                      {search ? 'No matches.' : 'No products yet. Create one to get started.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item) => {
                    const status = stockStatus(item.availableStock);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className='flex items-center gap-3 min-w-0'>
                            <div className='h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-border/60 bg-muted'>
                              <ProductImage
                                src={item.imageUrl}
                                alt={item.name}
                                className='h-full w-full object-cover'
                                iconClassName='h-6 w-6'
                              />
                            </div>
                            <div className='min-w-0'>
                              <div className='font-medium'>{item.name}</div>
                              <div className='text-xs text-muted-foreground font-mono truncate max-w-[220px]'>
                                {item.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='text-muted-foreground'>{item.category}</TableCell>
                        <TableCell className='font-mono tabular-nums'>
                          {priceFormatter.format(item.price)}
                        </TableCell>
                        <TableCell className='tabular-nums'>{item.availableStock}</TableCell>
                        <TableCell className='tabular-nums text-muted-foreground'>
                          {item.totalOrders} · {item.orderedQuantity} sold
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </TableCell>
                        <TableCell className='text-right'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='icon'>
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-48'>
                              <DropdownMenuLabel>Product</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link
                                  to='/products/$productId'
                                  params={{ productId: item.id }}
                                  className='cursor-pointer'
                                >
                                  <ExternalLink className='h-4 w-4 mr-2' />
                                  View storefront
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant='destructive'
                                className='text-destructive focus:text-destructive'
                                onClick={() => setDeleteTarget({ id: item.id, name: item.name })}
                              >
                                <Trash2 className='h-4 w-4 mr-2' />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleteProduct.isPending) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `“${deleteTarget.name}” will be removed from the catalog. This can’t be undone.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteProduct.isPending}>Cancel</AlertDialogCancel>
            <Button
              variant='destructive'
              disabled={deleteProduct.isPending || !deleteTarget}
              onClick={() => {
                if (!deleteTarget) return;
                deleteProduct.mutate(deleteTarget.id, {
                  onSuccess: () => {
                    setDeleteTarget(null);
                    toast.success('Product deleted');
                  },
                  onError: (err: unknown) => {
                    toast.error(err instanceof Error ? err.message : 'Could not delete product');
                  },
                });
              }}
            >
              {deleteProduct.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
