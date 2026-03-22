import { createFileRoute } from '@tanstack/react-router';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, PackageOpen } from 'lucide-react';
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
import { Spinner } from '@/components/ui/spinner';
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from '@/queries/cart.queries';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/_user/cart')({
  component: UserCartPage,
});

function UserCartPage() {
  const { data: cart, isLoading, isError } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem.mutate(
      { productId, quantity: newQuantity },
      {
        onError: (error) => {
          toast.error(error.message || 'Failed to update item');
        },
      },
    );
  };

  const handleRemoveItem = (productId: string) => {
    removeItem.mutate(
      { productId },
      {
        onSuccess: () => toast.success('Item removed from cart'),
        onError: (error) => {
          toast.error(error.message || 'Failed to remove item');
        },
      },
    );
  };

  const handleClearCart = () => {
    clearCart.mutate(undefined, {
      onSuccess: () => toast.success('Cart cleared'),
      onError: (error) => {
        toast.error(error.message || 'Failed to clear cart');
      },
    });
  };

  if (isLoading) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground'>
        <PackageOpen className='h-16 w-16' />
        <p>Failed to load your cart. Please try again.</p>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const shipping = items.length > 0 ? 20 : 0;
  const total = (cart?.totalAmount ?? 0) + shipping;

  return (
    <div className='p-6 space-y-8 max-w-5xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-primary/10 rounded-xl text-primary'>
            <ShoppingCart className='h-8 w-8' />
          </div>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Your Cart</h1>
            <p className='text-muted-foreground'>
              {items.length === 0
                ? 'Your cart is empty.'
                : `${items.length} item${items.length > 1 ? 's' : ''} in your cart.`}
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <Button
            variant='ghost'
            className='text-red-500 hover:text-red-600 hover:bg-red-500/10'
            onClick={handleClearCart}
            disabled={clearCart.isPending}
          >
            <Trash2 className='h-4 w-4 mr-2' />
            Clear All
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-muted-foreground gap-4'>
          <PackageOpen className='h-20 w-20 opacity-30' />
          <p className='text-lg'>Nothing here yet. Start shopping!</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-2 space-y-4'>
            {items.map((item) => (
              <Card key={item.productId} className='bg-card/50 border-none shadow-sm'>
                <CardContent className='p-4 flex items-center gap-4'>
                  <div className='h-20 w-20 bg-muted rounded-lg flex items-center justify-center shrink-0'>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className='h-full w-full object-cover rounded-lg'
                      />
                    ) : (
                      <ShoppingCart className='h-8 w-8 text-muted-foreground/30' />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold truncate'>{item.productName}</h3>
                    <p className='text-sm text-muted-foreground'>${item.price.toFixed(2)} each</p>
                    <div className='mt-2 flex items-center gap-4'>
                      <p className='font-bold'>LKR{(item.price * item.quantity).toFixed(2)}</p>
                      <div className='flex items-center border rounded-md px-1'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-7 w-7'
                          disabled={item.quantity <= 1 || updateItem.isPending}
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className='h-3 w-3' />
                        </Button>
                        <span className='px-2 text-sm'>{item.quantity}</span>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-7 w-7'
                          disabled={updateItem.isPending}
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className='h-3 w-3' />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-red-500 hover:text-red-600 hover:bg-red-500/10'
                    disabled={removeItem.isPending}
                    onClick={() => handleRemoveItem(item.productId)}
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
                <CardDescription>Final subtotal including shipping.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span className='font-medium'>${(cart?.totalAmount ?? 0).toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Estimated Shipping</span>
                  <span className='font-medium'>${shipping.toFixed(2)}</span>
                </div>
                <Separator />
                <div className='flex justify-between text-lg font-bold'>
                  <span>Total</span>
                  <span className='text-primary'>${total.toFixed(2)}</span>
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
      )}
    </div>
  );
}
