import { createFileRoute } from '@tanstack/react-router';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const Route = createFileRoute('/_authenticated/_user/cart')({
  component: UserCartPage,
});

const CART_ITEMS = [
  { id: 1, name: 'Minimalist Chair', price: 299, quantity: 1 },
  { id: 2, name: 'Smart Light', price: 59, quantity: 2 },
];

function UserCartPage() {
  const subtotal = CART_ITEMS.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 20;
  const total = subtotal + shipping;

  return (
    <div className='p-6 space-y-8 max-w-5xl mx-auto'>
      <div className='flex items-center gap-3'>
        <div className='p-2 bg-primary/10 rounded-xl text-primary'>
          <ShoppingCart className='h-8 w-8' />
        </div>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Your Cart</h1>
          <p className='text-muted-foreground'>Review your items before proceeding to checkout.</p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Cart Items */}
        <div className='lg:col-span-2 space-y-4'>
          {CART_ITEMS.map((item) => (
            <Card key={item.id} className='bg-card/50 border-none shadow-sm'>
              <CardContent className='p-4 flex items-center gap-4'>
                <div className='h-20 w-20 bg-muted rounded-lg flex items-center justify-center shrink-0'>
                  <ShoppingCart className='h-8 w-8 text-muted-foreground/30' />
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold truncate'>{item.name}</h3>
                  <p className='text-sm text-muted-foreground'>SKU: CTSE-{item.id}00</p>
                  <div className='mt-2 flex items-center gap-4'>
                    <p className='font-bold'>${item.price}</p>
                    <div className='flex items-center border rounded-md px-1'>
                      <Button variant='ghost' size='icon' className='h-7 w-7'>
                        <Minus className='h-3 w-3' />
                      </Button>
                      <span className='px-2 text-sm'>{item.quantity}</span>
                      <Button variant='ghost' size='icon' className='h-7 w-7'>
                        <Plus className='h-3 w-3' />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-red-500 hover:text-red-600 hover:bg-red-500/10'
                >
                  <Trash2 className='h-5 w-5' />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div className='lg:col-span-1'>
          <Card className='border-none shadow-lg shadow-black/5 sticky top-24 bg-primary/5'>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Final subtotal including tax.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Subtotal</span>
                <span className='font-medium'>${subtotal}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Estimated Shipping</span>
                <span className='font-medium'>${shipping}</span>
              </div>
              <Separator />
              <div className='flex justify-between text-lg font-bold'>
                <span>Total</span>
                <span className='text-primary'>${total}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className='w-full h-12 shadow-md shadow-primary/20' size='lg'>
                <CreditCard className='h-5 w-5 mr-4' />
                Proceed to Payment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
