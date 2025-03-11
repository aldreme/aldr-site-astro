import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from '@/lib/types/database.types';
import { cn } from "@/lib/utils";
import { Divider } from "@heroui/react";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { ProductDescriptionTab } from "./product-description-tab";

interface Props {
  productName: string,
  productDescription: string,
  productFeatures: string[],
  className?: string;
}

type CustomerRfq = Omit<Database['public']['Tables']['customer_request_for_quotes']['Insert'], 'created_at' | 'updated_at'>;

interface Store {
  cxRfq: CustomerRfq,
  setCxRfq: React.Dispatch<React.SetStateAction<CustomerRfq>>
}

const CustomerRfqContext = createContext<Store>({} as Store);

function QuantityInput() {
  const ctx = useContext(CustomerRfqContext);
  return (
    <Input id='quantity' type='number' min={1} placeholder='Enter quantity' className='w-48'
      onChange={e =>
        ctx.setCxRfq({ ...ctx.cxRfq, quantity_needed: Number(e.target.value) })
      }
    />
  );
}

function ExpectedDeliveryDatePicker() {
  const [date, setDate] = useState<Date>()

  const ctx = useContext(CustomerRfqContext);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-48 justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={e => {
            setDate(e)
            ctx.setCxRfq({ ...ctx.cxRfq, expected_delivery_date: e?.toDateString() })
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function CustomerInputsSection() {
  return (
    <div className='flex flex-col justify-between items-start md:w-[28rem]'>
      <div className='flex flex-col mb-5 mr-10 md:w-full md:mr-0 md:flex-row md:justify-between md:items-center'>
        <h2 className='text-xl mb-2 mr-3 font-semibold'>Quantity Needed</h2>
        <QuantityInput />
      </div>

      <div className='flex flex-col mb-5 mr-10 md:w-full md:mr-0 md:flex-row md:justify-between md:items-center'>
        <h2 className='text-xl mb-2 mr-3 font-semibold'>Expected Delivery Date</h2>
        <ExpectedDeliveryDatePicker />
      </div>
    </div>
  );
}

function TitleCombobox() {
  const ctx = useContext(CustomerRfqContext);

  const titles = [
    {
      value: "",
      label: "",
    },
    {
      value: "none",
      label: "None",
    },
    {
      value: "mr",
      label: "Mr.",
    },
    {
      value: "mrs",
      label: "Mrs.",
    },
    {
      value: "miss",
      label: "Miss",
    },
    {
      value: "ms",
      label: "Ms.",
    },
    {
      value: "dr",
      label: "Dr.",
    },
  ]

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-32 justify-between col-span-3"
        >
          {value
            ? titles.find((titles) => titles.value === value)?.label
            : "Select title..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Command>
          <CommandInput placeholder="Search title..." />
          <CommandList>
            <CommandEmpty>No title found.</CommandEmpty>
            <CommandGroup>
              {titles.map((titles) => (
                <CommandItem
                  key={titles.value}
                  value={titles.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    ctx.setCxRfq({ ...ctx.cxRfq, cx_rep_title: currentValue })
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {titles.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === titles.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function GetQuoteDialogInputs() {
  const ctx = useContext(CustomerRfqContext);

  return (
    <div className="grid gap-4 md:py-4">
      <div className="grid grid-cols-4 md:grid-cols-8 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <TitleCombobox />

        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          defaultValue=""
          placeholder="Your first and last name"
          className="col-span-3"
          onChange={e =>
            ctx.setCxRfq({ ...ctx.cxRfq, cx_rep_name: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 items-center gap-4">
        <Label htmlFor="company" className="text-right">
          Company
        </Label>
        <Input
          id="company"
          defaultValue=""
          placeholder="Your company name"
          className="col-span-3"
          onChange={e =>
            ctx.setCxRfq({ ...ctx.cxRfq, cx_company: e.target.value })
          }
        />

        <Label htmlFor="occupation" className="text-right">
          Occupation
        </Label>
        <Input
          id="occupation"
          defaultValue=""
          placeholder="Your occupation in the company"
          className="col-span-3"
          onChange={e =>
            ctx.setCxRfq({ ...ctx.cxRfq, cx_rep_occupation: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 items-center gap-4">
        <Label htmlFor="phone" className="text-right">
          Phone number
        </Label>
        <Input
          id="phone"
          defaultValue=""
          placeholder="Your phone number"
          className="col-span-3"
          onChange={e =>
            ctx.setCxRfq({ ...ctx.cxRfq, cx_contact_number: e.target.value })
          }
        />

        <Label htmlFor="address" className="text-right">
          Address
        </Label>
        <Input
          id="address"
          defaultValue=""
          placeholder="Your address for shipping"
          className="col-span-3"
          onChange={e =>
            ctx.setCxRfq({ ...ctx.cxRfq, cx_address: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email address
        </Label>
        <Input
          id="email"
          defaultValue=""
          placeholder="Your email address for contact"
          className="col-span-3"
          onChange={e =>
            ctx.setCxRfq({ ...ctx.cxRfq, cx_email_addr: e.target.value })
          }
        />

        <Label htmlFor="subject" className="text-right">
          Subject
        </Label>
        <Input
          id="subject"
          defaultValue=""
          placeholder="The subject of your inquiry"
          className="col-span-3"
          onChange={e =>
            ctx.setCxRfq({ ...ctx.cxRfq, cx_rfq_subject: e.target.value })
          }
        />
      </div>


      <div className="grid grid-cols-4 md:grid-cols-8 items-center gap-4">
        <Label htmlFor="message" className="text-end h-full">
          Message
        </Label>

        <Textarea
          className="w-full col-span-7"
          placeholder="The detailed information of your inquiry"
          onChange={e =>
            ctx.setCxRfq({ ...ctx.cxRfq, cx_rfq_msg: e.target.value })
          }
        />
      </div>
    </div>
  );
}

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function GetQuoteButtonWithDialog() {
  const ctx = useContext(CustomerRfqContext);
  const [sendingRfq, setSendingRfq] = useState<boolean>(false);

  const sendRfq = async () => {
    const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_KEY;

    const cxRfqApiEndpoint = `${SUPABASE_URL}/functions/v1/cx_rfq`;

    console.info(`request to be sent: ${JSON.stringify({ rfq: ctx.cxRfq })}`);

    try {
      setSendingRfq(true);

      const resp = await fetch(cxRfqApiEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          rfq: ctx.cxRfq,
        })
      });

      if (!resp.ok) {
        console.error(`failed to send the rfq, error: ${await resp.text()}`);
        return;
      }

      console.info('rfq sent successfully');
    } catch (err) {
      console.error(`failed to send the rfq, error: ${err}`);
    } finally {
      setSendingRfq(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'lg'}>Get a Quote</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[40rem]">
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg">Get a Quote</DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            Please help fill out this form for us, more information can help us better estimate your needs and provide a more accurate quote.
          </DialogDescription>
        </DialogHeader>

        <GetQuoteDialogInputs />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='ghost'>Cancel</Button>
          </DialogClose>
          <Button disabled={sendingRfq} type='submit' onClick={sendRfq}>
            {
              sendingRfq &&
              <Loader2 className="animate-spin" />
            }
            {
              sendingRfq ? "Please wait" : "Send Request for Quote"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ProductDescriptionCard(props: Props) {
  const { productName, productDescription, productFeatures, className } = props;

  const [cxRfq, setCxRfq] = useState<CustomerRfq>({ cx_rfq_product: productName } as CustomerRfq);

  return (
    <CustomerRfqContext.Provider value={{ cxRfq: cxRfq, setCxRfq: setCxRfq }}>
      <div className='flex flex-col w-full md:h-full md:ml-32 md:items-stretch md:justify-between md:justify-items-stretch'>
        <h1 className='text-3xl md:text-5xl font-semibold align-top my-5'>{productName}</h1>

        <ProductDescriptionTab className='w-auto mt-[2vmin]' productDescription={productDescription} productFeatures={productFeatures} />

        <div className='flex flex-col justify-between items-start pt-10 md:justify-between md:items-start md:h-full'>
          <CustomerInputsSection />

          <Divider className='border-1 my-3 border-solid border-gray-100' />

          <GetQuoteButtonWithDialog />
        </div>
      </div>
    </CustomerRfqContext.Provider>
  )
}