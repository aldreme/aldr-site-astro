
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { cartItems, clearCart, isCartOpen, removeCartItem, rfqContactStore, updateCartItemQuantity, type CartItem } from '@/store/cart';
import { useStore } from '@nanostores/react';
import { format, isValid, parseISO } from 'date-fns';
import { CalendarIcon, Minus, Plus, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function CartSheet() {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);
  const $rfqContact = useStore(rfqContactStore);
  const items = Object.values($cartItems) as CartItem[];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const dateValue = $rfqContact.expectedDeliveryDate ? parseISO($rfqContact.expectedDeliveryDate) : undefined;
  const safeDate = dateValue && isValid(dateValue) ? dateValue : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { supabase } = await import('@/lib/supabase');

      const itemsWithoutImages = items.map(({ image, ...rest }) => rest);

      const rfqPayload = {
        cx_rep_name: $rfqContact.name,
        cx_company: $rfqContact.company,
        cx_email_addr: $rfqContact.email,
        cx_rfq_subject: `Consolidated RFQ (${items.length} items)`,
        cx_rfq_msg: $rfqContact.notes || 'No additional notes.',
        expected_delivery_date: $rfqContact.expectedDeliveryDate || null,
        cx_rfq_product: items[0].name, // Using first item as primary product reference
        cx_rfq_items: itemsWithoutImages, // Multi-product details in the new JSONB column
        quantity_needed: items.reduce((acc, item) => acc + item.quantity, 0)
      };

      const { error } = await supabase.functions.invoke('cx_rfq', {
        body: { rfq: rfqPayload }
      });

      if (error) throw error;

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        clearCart();
        isCartOpen.set(false);
        rfqContactStore.set({ name: '', email: '', company: '', notes: '', expectedDeliveryDate: undefined });
      }, 3000);
    } catch (error) {
      console.error('Failed to submit RFQ:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                    <div className="space-y-2 mb-6">
                      <h3 className="font-semibold text-sm">Expected Delivery</h3>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal text-sm h-10",
                              !safeDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {safeDate ? format(safeDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={safeDate}
                            onSelect={(date) => rfqContactStore.set({
                              ...$rfqContact,
                              expectedDeliveryDate: date ? format(date, 'yyyy-MM-dd') : undefined
                            })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <h3 className="font-semibold text-sm">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="name" className="text-xs">Name</Label>
                        <Input id="name" required placeholder="John Doe"
                          value={$rfqContact.name} onChange={e => rfqContactStore.set({ ...$rfqContact, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="company" className="text-xs">Company</Label>
                        <Input id="company" placeholder="Acme Pharma"
                          value={$rfqContact.company} onChange={e => rfqContactStore.set({ ...$rfqContact, company: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-xs">Work Email</Label>
                      <Input id="email" type="email" required placeholder="john@company.com"
                        value={$rfqContact.email} onChange={e => rfqContactStore.set({ ...$rfqContact, email: e.target.value })}
                      />
                    </div>


                    <div className="space-y-1">
                      <Label htmlFor="notes" className="text-xs">Project Notes (Optional)</Label>
                      <Input id="notes" placeholder="e.g., Delivery needed by Q3..."
                        value={$rfqContact.notes} onChange={e => rfqContactStore.set({ ...$rfqContact, notes: e.target.value })}
                      />
                    </div>
                  </form>
                </div>
              )}
            </ScrollArea>
            <SheetFooter className="mt-auto border-t pt-4">
              <Button type="submit" form="rfq-form" className="w-full bg-blue-600 hover:bg-blue-700" disabled={items.length === 0 || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Plus className="mr-2 h-4 w-4 animate-spin rotate-45" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    Send Request {items.length > 0 && `(${items.length} Items)`}
                  </>
                )}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
