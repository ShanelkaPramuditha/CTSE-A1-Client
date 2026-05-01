import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useOrders } from '@/queries/order-list.queries';

export const Route = createFileRoute('/_authenticated/_user/orders')({
  component: UserOrdersPage,
});

function UserOrdersPage() {
  const { data: orders, isLoading, isError, error } = useOrders();

  if (isLoading) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-6 text-sm text-destructive'>
        {(error as Error)?.message || 'Failed to load orders'}
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6 max-w-5xl mx-auto'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>My Orders</h1>
        <p className='text-muted-foreground'>Track your placed orders.</p>
      </div>

      {!orders || orders.length === 0 ? (
        <Card>
          <CardContent className='py-8 text-muted-foreground'>No orders yet.</CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {orders.map((order) => (
            <Card key={order._id}>
              <CardHeader>
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <CardTitle className='text-base'>Order #{order._id}</CardTitle>
                    <CardDescription>
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Date N/A'}
                    </CardDescription>
                  </div>
                  <Badge variant='secondary'>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='space-y-1 text-sm'>
                  {order.items.map((item) => (
                    <div
                      key={`${order._id}-${item.productId}`}
                      className='flex justify-between gap-4'
                    >
                      <span className='truncate'>
                        {item.productName} x {item.quantity}
                      </span>
                      <span>LKR {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className='pt-2 border-t flex items-center justify-between font-semibold'>
                  <span>Total</span>
                  <span>LKR {order.totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
