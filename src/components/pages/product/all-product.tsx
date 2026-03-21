import { ShoppingBag, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Minimalist Chair', price: '$299', rating: 4.8, sold: '1.2k+' },
  { id: 2, name: 'Sleek Desk', price: '$499', rating: 4.9, sold: '800+' },
  { id: 3, name: 'Smart Light', price: '$59', rating: 4.5, sold: '3.5k+' },
];

export function AllProductsPage() {
  return (
    <div className='p-6 space-y-8'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold'>Featured Products</h1>
        <p className='text-muted-foreground'>
          Discover our handpicked collection for your workspace.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {MOCK_PRODUCTS.map((product) => (
          <Link
            key={product.id}
            to='/products/$productId'
            params={{ productId: product.id.toString() }}
            className='block'
          >
            <Card className='overflow-hidden hover:shadow-lg transition-shadow border-none bg-accent/50 h-full'>
              <div className='aspect-square w-full bg-muted flex items-center justify-center'>
                <ShoppingBag className='h-12 w-12 text-muted-foreground/30' />
              </div>
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>Premium Quality</CardDescription>
                  </div>
                  <span className='font-bold text-lg'>{product.price}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-4 text-sm text-muted-foreground mb-6'>
                  <div className='flex items-center gap-1'>
                    <Star className='h-4 w-4 text-yellow-500 fill-yellow-500' />
                    {product.rating}
                  </div>
                  <div className='flex items-center gap-1'>
                    <TrendingUp className='h-4 w-4' />
                    {product.sold} sold
                  </div>
                </div>
                <Button className='w-full' variant='default'>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
