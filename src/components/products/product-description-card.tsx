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
import { cn } from "@/lib/utils";
import { Divider } from "@heroui/react";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
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

interface CustomerInquiry {
  cxRepName: string,
  cxRepTitle?: string,
  cxCompany: string,
  cxRepOccupation?: string,
  cxContactNumber?: string,
  cxAddress?: string,
  cxEmailAddress: string,
  cxInquirySubject: string,
  cxInquiryMessage: string,
  cxInquiryQuantity?: number,
  cxInquiryExpectedDeliveryDate?: Date,
  cxInquiryProduct: string,
}

interface Store {
  customerInquiry: CustomerInquiry,
  setCustomerInquiry: React.Dispatch<React.SetStateAction<CustomerInquiry>>
}

const CustomerInquiryContext = createContext<Store>({} as Store);

function QuantityInput() {
  const ctx = useContext(CustomerInquiryContext);
  return (
    <Input type='number' min={1} placeholder='Enter quantity' className='w-48'
      onChange={e =>
        ctx.setCustomerInquiry({ ...ctx.customerInquiry, cxInquiryQuantity: Number(e.target.value) })
      }
    />
  );
}

function ExpectedDeliveryDatePicker() {
  const [date, setDate] = useState<Date>()

  const ctx = useContext(CustomerInquiryContext);

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
            ctx.setCustomerInquiry({ ...ctx.customerInquiry, cxInquiryExpectedDeliveryDate: e })
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
  const ctx = useContext(CustomerInquiryContext);

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
                    ctx.setCustomerInquiry({ ...ctx.customerInquiry, cxRepTitle: currentValue })
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
  const ctx = useContext(CustomerInquiryContext);

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
            ctx.setCustomerInquiry({ ...ctx.customerInquiry, cxRepName: e.target.value })
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
            ctx.setCustomerInquiry({ ...ctx.customerInquiry, cxCompany: e.target.value })
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
            ctx.setCustomerInquiry({ ...ctx.customerInquiry, cxRepOccupation: e.target.value })
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
            ctx.setCustomerInquiry({ ...ctx.customerInquiry, cxContactNumber: e.target.value })
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
            ctx.setCustomerInquiry({ ...ctx.customerInquiry, cxAddress: e.target.value })
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
            ctx.setCustomerInquiry({ ...ctx.customerInquiry, cxEmailAddress: e.target.value })
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
            ctx.setCustomerInquiry({ ...ctx.customerInquiry, cxInquirySubject: e.target.value })
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
            ctx.setCustomerInquiry({ ...ctx.customerInquiry, cxInquiryMessage: e.target.value })
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
  const ctx = useContext(CustomerInquiryContext);

  const sendInquiry = async () => {
    const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_KEY;

    const cxInquiryApiEndpoint = `${SUPABASE_URL}/functions/v1/cx_inquiry`;

    try {
      const resp = await fetch(cxInquiryApiEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          inquiry: {
            cx_rep_name: ctx.customerInquiry.cxRepName,
            cx_rep_title: ctx.customerInquiry.cxRepTitle,
            cx_company: ctx.customerInquiry.cxCompany,
            cx_rep_occupation: ctx.customerInquiry.cxRepOccupation,
            cx_contact_number: ctx.customerInquiry.cxContactNumber,
            cx_address: ctx.customerInquiry.cxAddress,
            cx_email_addr: ctx.customerInquiry.cxEmailAddress,
            cx_inquiry_subject: ctx.customerInquiry.cxInquirySubject,
            cx_inquiry_msg: ctx.customerInquiry.cxInquiryMessage,
            quantity_needed: ctx.customerInquiry.cxInquiryQuantity,
            expected_delivery_date: ctx.customerInquiry.cxInquiryExpectedDeliveryDate,
            cx_inquiry_product: ctx.customerInquiry.cxInquiryProduct,
          },
        })
      });

      if (!resp.ok) {
        console.error(`failed to send the inquiry, error: ${await resp.text()}`);
        return;
      }

      console.info('inquiry sent successfully');
    } catch (err) {
      console.error(`failed to send the inquiry, error: ${err}`);
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
          <Button type='submit' onClick={sendInquiry}>Send Inquiry</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ProductDescriptionCard(props: Props) {
  const { productName, productDescription, productFeatures, className } = props;

  const [customerInquiry, setCustomerInquiry] = useState<CustomerInquiry>({ cxInquiryProduct: productName } as CustomerInquiry);

  return (
    <CustomerInquiryContext.Provider value={{ customerInquiry, setCustomerInquiry }}>
      <div className='flex flex-col w-full md:h-full md:ml-32 md:items-stretch md:justify-between md:justify-items-stretch'>
        <h1 className='text-3xl md:text-5xl font-semibold align-top my-5'>{productName}</h1>

        <ProductDescriptionTab className='w-auto mt-[2vmin]' productDescription={productDescription} productFeatures={productFeatures} />

        <div className='flex flex-col justify-between items-start pt-10 md:justify-between md:items-start md:h-full'>
          <CustomerInputsSection />

          <Divider className='border-1 my-3 border-solid border-gray-100' />

          <GetQuoteButtonWithDialog />
        </div>
      </div>
    </CustomerInquiryContext.Provider>
  )
}