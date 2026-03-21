import { createFileRoute, Link } from '@tanstack/react-router';
import { z } from 'zod';
import {
  ShoppingBag,
  Star,
  TrendingUp,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { useAddCartItem } from '@/queries/cart.queries';
import { toast } from 'sonner';

// Validation for product ID
const productIdSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

export const Route = createFileRoute('/_public/products/$productId')({
  parseParams: (params) => productIdSchema.parse(params),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddCartItem();

  // In a real app, you would fetch data here using a query hook
  // const { data: product, isLoading } = useProduct(productId);

  const product = {
    id: productId,
    name: 'Minimalist Premium Chair',
    price: 299,
    description:
      'Experience ultimate comfort with our Minimalist Premium Chair. Designed for long hours of focus, it features ergonomic support, premium fabric, and a sleek modern aesthetic that fits any workspace.',
    rating: 4.8,
    reviews: 124,
    stock: 15,
    category: 'Furniture',
    features: ['Ergonomic Design', 'Premium Breathable Fabric', 'Adjustable Height', '360° Swivel'],
  };

  return (
    <div className='max-w-7xl mx-auto px-6 py-10 space-y-10'>
      {/* Navigation */}
      <Link
        to='/'
        className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors'
      >
        <ArrowLeft className='h-4 w-4' />
        Back to Catalog
      </Link>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
        {/* Product Image Section */}
        <div className='space-y-4'>
          <div className='aspect-square rounded-3xl bg-accent/50 flex items-center justify-center border border-accent overflow-hidden'>
            <ShoppingBag className='h-32 w-32 text-muted-foreground/20' />
          </div>
          <div className='grid grid-cols-4 gap-4'>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='aspect-square rounded-xl bg-accent/30 border border-accent/50 flex items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors'
              >
                <ShoppingBag className='h-8 w-8 text-muted-foreground/20' />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className='flex flex-col space-y-6'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Badge variant='secondary' className='rounded-full'>
                {product.category}
              </Badge>
              <Badge
                variant='outline'
                className='rounded-full text-green-600 border-green-200 bg-green-50'
              >
                In Stock
              </Badge>
            </div>
            <h1 className='text-4xl font-bold tracking-tight text-foreground'>{product.name}</h1>
            <div className='flex items-center gap-4 text-sm'>
              <div className='flex items-center gap-1 text-yellow-500'>
                <Star className='h-4 w-4 fill-yellow-500' />
                <span className='font-medium'>{product.rating}</span>
              </div>
              <span className='text-muted-foreground'>{product.reviews} customer reviews</span>
              <Separator orientation='vertical' className='h-4' />
              <div className='flex items-center gap-1 text-primary'>
                <TrendingUp className='h-4 w-4' />
                <span className='font-medium'>Bestseller</span>
              </div>
            </div>
          </div>

          <p className='text-3xl font-bold'>${product.price}</p>

          <p className='text-muted-foreground leading-relaxed'>{product.description}</p>

          <Separator />

          {/* Features */}
          <div className='grid grid-cols-2 gap-4'>
            {product.features.map((feature) => (
              <div key={feature} className='flex items-center gap-2 text-sm'>
                <ShieldCheck className='h-4 w-4 text-primary' />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Actions */}
          <div className='space-y-4 pt-4'>
            <div className='flex items-center gap-6'>
              <div className='flex items-center border rounded-full p-1 bg-accent/30'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-full h-8 w-8'
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className='h-3 w-3' />
                </Button>
                <span className='w-10 text-center font-medium'>{quantity}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-full h-8 w-8'
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  <Plus className='h-3 w-3' />
                </Button>
              </div>
              <p className='text-sm text-muted-foreground'>
                Only {product.stock} units left in stock
              </p>
            </div>

            <div className='flex gap-4'>
              <Button
                size='lg'
                className='flex-1 h-14 text-lg rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30'
                disabled={addToCart.isPending}
                onClick={() => {
                  addToCart.mutate(
                    {
                      productId: product.id,
                      productName: product.name,
                      price: product.price,
                      quantity,
                    },
                    {
                      onSuccess: () => {
                        toast.success(`Added ${product.name} to cart`);
                        setQuantity(1);
                      },
                      onError: (error) => {
                        toast.error(error.message || 'Failed to add to cart. Please log in first.');
                      },
                    },
                  );
                }}
              >
                {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button size='lg' variant='outline' className='h-14 rounded-2xl'>
                Wishlist
              </Button>
            </div>
          </div>

          {/* Shipping/Returns Info */}
          <div className='grid grid-cols-2 gap-4 pt-4'>
            <div className='flex items-start gap-3 p-4 rounded-2xl bg-accent/20 border border-accent/50'>
              <Truck className='h-5 w-5 text-primary' />
              <div className='space-y-1'>
                <p className='text-sm font-semibold'>Fast Delivery</p>
                <p className='text-xs text-muted-foreground'>Ships within 24-48 hours</p>
              </div>
            </div>
            <div className='flex items-start gap-3 p-4 rounded-2xl bg-accent/20 border border-accent/50'>
              <RotateCcw className='h-5 w-5 text-primary' />
              <div className='space-y-1'>
                <p className='text-sm font-semibold'>30-Day Returns</p>
                <p className='text-xs text-muted-foreground'>Hassle-free money back</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
