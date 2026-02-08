
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cartItems, clearCart, isCartOpen, removeCartItem, updateCartItemQuantity } from '@/store/cart';
import { useStore } from '@nanostores/react';
import { Minus, Plus, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function CartSheet() {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);
  const items = Object.values($cartItems);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Here you would implement the actual API call
    console.log('Submitting RFQ:', {
      customer: formData,
      items: items
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      clearCart();
      isCartOpen.set(false);
      setFormData({ name: '', email: '', company: '', notes: '' });
    }, 2000);
  };

  return (
    <Sheet open={$isCartOpen} onOpenChange={isCartOpen.set}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>Request for Quote</SheetTitle>
          <SheetDescription>
            Review your selected items and submit a consolidated request.
          </SheetDescription>
        </SheetHeader>

        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <Send className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Request Sent!</h3>
            <p className="text-zinc-500">We'll get back to you shortly with a formal quote.</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 my-4">
              {items.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-zinc-400">
                  Your cart is empty
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-2">
                      {/* Image placeholder or actual image if available */}
                      <div className="w-16 h-16 bg-zinc-100 rounded-md flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1 mix-blend-multiply" />
                        ) : (
                          <div className="w-8 h-8 bg-zinc-200 rounded-full" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-zinc-900 line-clamp-1">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-mono w-8 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto text-red-400 hover:text-red-500 hover:bg-red-50" onClick={() => removeCartItem(item.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Separator className="my-4" />

                  <form id="rfq-form" onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <h3 className="font-semibold text-sm">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="name" className="text-xs">Name</Label>
                        <Input id="name" required placeholder="John Doe"
                          value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="company" className="text-xs">Company</Label>
                        <Input id="company" placeholder="Acme Pharma"
                          value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-xs">Work Email</Label>
                      <Input id="email" type="email" required placeholder="john@company.com"
                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="notes" className="text-xs">Project Notes (Optional)</Label>
                      <Input id="notes" placeholder="e.g., Delivery needed by Q3..."
                        value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>
                  </form>
                </div>
              )}
            </ScrollArea>
            <SheetFooter className="mt-auto border-t pt-4">
              <Button type="submit" form="rfq-form" className="w-full bg-blue-600 hover:bg-blue-700" disabled={items.length === 0}>
                Send Request {items.length > 0 && `(${items.length} Items)`}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
