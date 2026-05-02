import { createFileRoute, useRouter } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { PackageOpen } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { useCart } from '@/queries/cart.queries';
import { useCheckout } from '@/queries/order.queries';
import { checkoutSchema, type CheckoutSchema } from '@/schemas/order/checkout.schema';

export const Route = createFileRoute('/_authenticated/_user/checkout')({
  component: CheckoutPage,
});

function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading, isError } = useCart();
  const checkout = useCheckout();

  const items = cart?.items ?? [];
  const total = cart?.totalAmount ?? 0;

  const form = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'COD',
      address: {
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '',
      },
      card: undefined,
    },
  });

  const { control, getValues, setValue } = form;

  const paymentMethod = useWatch({
    control,
    name: 'paymentMethod',
  });

  useEffect(() => {
    if (paymentMethod === 'CARD') {
      const currentCard = getValues('card');
      if (!currentCard) {
        setValue('card', {
          cardHolderName: '',
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
        });
      }
      return;
    }

    // COD: ensure card details are cleared so they can't block submit.
    setValue('card', undefined);
  }, [paymentMethod, getValues, setValue]);

  const onSubmit = (values: CheckoutSchema) => {
    checkout.mutate(values, {
      onSuccess: (order) => {
        toast.success(`Order placed successfully (${order.status})`);
        router.navigate({ to: '/orders' });
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to place order');
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
        <p>Failed to load checkout data. Please try again.</p>
        <Button variant='outline' onClick={() => router.navigate({ to: '/cart' })}>
          Back to Cart
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className='p-6 space-y-6 max-w-3xl mx-auto'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Checkout</h1>
          <p className='text-muted-foreground'>Your cart is empty.</p>
        </div>
        <Card>
          <CardContent className='py-10 flex flex-col items-center gap-4 text-muted-foreground'>
            <PackageOpen className='h-16 w-16 opacity-40' />
            <p>No items to checkout.</p>
            <Button onClick={() => router.navigate({ to: '/cart' })}>Go to Cart</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-8 max-w-5xl mx-auto'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Checkout</h1>
          <p className='text-muted-foreground'>
            Review items, add delivery details, and choose payment.
          </p>
        </div>
        <Button variant='outline' onClick={() => router.navigate({ to: '/cart' })}>
          Back to Cart
        </Button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Items from your cart.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {items.map((item) => (
                <div key={item.productId} className='flex items-center justify-between gap-4'>
                  <div className='min-w-0'>
                    <div className='font-medium truncate'>{item.productName}</div>
                    <div className='text-sm text-muted-foreground'>Qty {item.quantity}</div>
                  </div>
                  <div className='font-semibold'>LKR {(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
              <Separator />
              <div className='flex items-center justify-between text-lg font-bold'>
                <span>Total</span>
                <span className='text-primary'>LKR {total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
              <CardDescription>Where should we deliver your order?</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='address.fullName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder='John Doe' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='address.phone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder='07XXXXXXXX' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='address.addressLine1'
                      render={({ field }) => (
                        <FormItem className='md:col-span-2'>
                          <FormLabel>Address Line 1</FormLabel>
                          <FormControl>
                            <Input placeholder='Street address' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='address.addressLine2'
                      render={({ field }) => (
                        <FormItem className='md:col-span-2'>
                          <FormLabel>Address Line 2 (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder='Apartment, suite, etc.' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='address.city'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder='Colombo' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='address.postalCode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder='00100' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className='space-y-4'>
                    <div>
                      <div className='font-semibold'>Payment Method</div>
                      <div className='text-sm text-muted-foreground'>
                        Choose how you want to pay.
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name='paymentMethod'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className='grid grid-cols-1 md:grid-cols-2 gap-4'
                            >
                              <label className='flex items-center gap-3 rounded-md border p-4 cursor-pointer'>
                                <RadioGroupItem value='COD' />
                                <div>
                                  <div className='font-medium'>Cash on Delivery</div>
                                  <div className='text-xs text-muted-foreground'>
                                    Pay when you receive the order.
                                  </div>
                                </div>
                              </label>
                              <label className='flex items-center gap-3 rounded-md border p-4 cursor-pointer'>
                                <RadioGroupItem value='CARD' />
                                <div>
                                  <div className='font-medium'>Card Payment</div>
                                  <div className='text-xs text-muted-foreground'>
                                    Enter card details (simulated).
                                  </div>
                                </div>
                              </label>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {paymentMethod === 'CARD' ? (
                      <div className='rounded-md border p-4 space-y-4'>
                        <div className='font-semibold'>Card Details</div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <FormField
                            control={form.control}
                            name='card.cardHolderName'
                            render={({ field }) => (
                              <FormItem className='md:col-span-2'>
                                <FormLabel>Cardholder Name</FormLabel>
                                <FormControl>
                                  <Input placeholder='Name on card' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='card.cardNumber'
                            render={({ field }) => (
                              <FormItem className='md:col-span-2'>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='1234 5678 9012 3456'
                                    inputMode='numeric'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='card.expiryMonth'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Month</FormLabel>
                                <FormControl>
                                  <Input placeholder='MM' inputMode='numeric' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='card.expiryYear'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Year</FormLabel>
                                <FormControl>
                                  <Input placeholder='YY or YYYY' inputMode='numeric' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='card.cvv'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input placeholder='***' inputMode='numeric' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <CardFooter className='px-0'>
                    <Button type='submit' className='w-full h-12' disabled={checkout.isPending}>
                      {checkout.isPending ? 'Placing order...' : 'Place Order'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className='lg:col-span-1'>
          <Card className='border-none shadow-lg shadow-black/5 sticky top-24 bg-primary/5'>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Final total for this order.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Subtotal</span>
                <span className='font-medium'>LKR {total.toFixed(2)}</span>
              </div>
              <Separator />
              <div className='flex justify-between text-lg font-bold'>
                <span>Total</span>
                <span className='text-primary'>LKR {total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => form.handleSubmit(onSubmit)()}
                disabled={checkout.isPending}
              >
                {checkout.isPending ? 'Placing order...' : 'Place Order'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
