import { Link } from '@tanstack/react-router';
import { Package, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types/product';
import { ProductImage } from '@/components/pages/product/product-image';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const inStock = product.availableStock > 0;

  return (
    <Card className='group overflow-hidden border-none bg-accent/40 shadow-sm transition-all hover:shadow-lg hover:bg-accent/60 h-full flex flex-col'>
      <Link
        to='/products/$productId'
        params={{ productId: product.id }}
        className='block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-xl space-y-3'
      >
        <div className='aspect-[4/3] w-full overflow-hidden border-b border-border/50'>
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            iconClassName='h-14 w-14 group-hover:scale-105 transition-transform duration-300'
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]'
          />
        </div>
        <CardHeader className='space-y-2'>
          <div className='flex flex-wrap items-start justify-between gap-2'>
            <div className='space-y-1 min-w-0'>
              <CardTitle className='text-lg leading-tight line-clamp-2'>{product.name}</CardTitle>
              <CardDescription className='flex flex-wrap items-center gap-2'>
                <Badge variant='secondary' className='rounded-md font-normal'>
                  {product.category}
                </Badge>
                <span className='inline-flex items-center gap-1 text-xs'>
                  <Package className='h-3.5 w-3.5' />
                  {product.availableStock} in stock
                </span>
                {product.totalOrders > 0 && (
                  <span className='inline-flex items-center gap-1 text-xs text-muted-foreground'>
                    <TrendingUp className='h-3.5 w-3.5' />
                    {product.totalOrders} orders
                  </span>
                )}
              </CardDescription>
            </div>
            <span className='shrink-0 font-semibold text-lg tabular-nums'>
              {priceFormatter.format(product.price)}
            </span>
          </div>
        </CardHeader>
      </Link>
      <CardContent className='mt-auto pt-0 flex flex-col gap-3'>
        <p className='text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]'>
          {product.description}
        </p>
        <div className='flex flex-col sm:flex-row gap-2'>
          {inStock ? (
            <>
              <Button
                type='button'
                variant='outline'
                className='flex-1'
                onClick={() => {
                  toast.success(`${product.name} added to cart`);
                }}
              >
                Add to cart
              </Button>
              <Button className='flex-1' asChild>
                <Link to='/products/$productId' params={{ productId: product.id }}>
                  View details
                </Link>
              </Button>
            </>
          ) : (
            <Button className='flex-1' disabled>
              Out of stock
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
