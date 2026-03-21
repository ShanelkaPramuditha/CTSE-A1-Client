import { createFileRoute } from '@tanstack/react-router';
import {
  Package,
  Search,
  SlidersHorizontal,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
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

export const Route = createFileRoute('/_authenticated/_admin/admin/products')({
  component: AdminProductsManagement,
});

const INVENTORY = [
  {
    id: 'PROD-001',
    name: 'AirPods Max',
    category: 'Audio',
    stock: 45,
    price: '$549.00',
    status: 'In Stock',
  },
  {
    id: 'PROD-002',
    name: 'MacBook Pro 16"',
    category: 'Laptops',
    stock: 12,
    price: '$2,499.00',
    status: 'Low Stock',
  },
  {
    id: 'PROD-003',
    name: 'iPad Air',
    category: 'Tablets',
    stock: 0,
    price: '$599.00',
    status: 'Out of Stock',
  },
  {
    id: 'PROD-004',
    name: 'iPhone 15 Pro',
    category: 'Phones',
    stock: 89,
    price: '$999.00',
    status: 'In Stock',
  },
];

function AdminProductsManagement() {
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
        <Button size='lg' className='shadow-lg'>
          <Plus className='h-5 w-5 mr-2' />
          Create Product
        </Button>
      </div>

      <Card className='border-none shadow-sm shadow-black/5'>
        <CardHeader className='pb-0'>
          <div className='flex flex-col md:flex-row justify-between gap-4'>
            <div className='relative w-full md:w-96'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input placeholder='Search catalog...' className='pl-10' />
            </div>
            <Button variant='outline' size='icon'>
              <SlidersHorizontal className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent className='pt-6'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVENTORY.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className='font-medium'>{item.name}</div>
                    <div className='text-xs text-muted-foreground'>{item.id}</div>
                  </TableCell>
                  <TableCell className='text-muted-foreground'>{item.category}</TableCell>
                  <TableCell className='font-mono'>{item.price}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'In Stock'
                          ? 'bg-green-500/10 text-green-600'
                          : item.status === 'Low Stock'
                            ? 'bg-orange-500/10 text-orange-600'
                            : 'bg-red-500/10 text-red-600'
                      }`}
                    >
                      {item.status}
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
                        <DropdownMenuItem className='text-red-600'>
                          <Trash2 className='h-4 w-4 mr-2' /> Delete Record
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
