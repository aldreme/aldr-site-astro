import { Button } from "@/components/ui/button";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Divider } from "@heroui/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { ProductDescriptionTab } from "./product-description-tab";

interface Props {
  productName: string,
  productDescription?: string,
  productFeatures?: string[],
  className?: string;
}

function ExpectedDeliveryDatePicker() {
  const [date, setDate] = useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-32 justify-start text-left font-normal",
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
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export function ProductDescriptionCard(props: Props) {
  const { productName, productDescription, productFeatures, className } = props;

  return (
    <div className='flex flex-col w-full md:ml-32 md:items-stretch md:justify-between'>
      <h1 className='text-3xl md:text-5xl font-semibold align-top my-5'>{productName}</h1>

      <ProductDescriptionTab className='w-auto mt-[2vmin]' />

      <div className='flex flex-col justify-between items-start pt-10 md:justify-between md:items-start md:h-full'>
        <div className='flex flex-col justify-between items-start md:w-[24rem]'>
          <div className='flex flex-col mb-5 mr-10 md:w-full md:mr-0 md:flex-row md:justify-between md:items-center'>
            <h2 className='text-xl mb-2 mr-3'>Quantity Needed</h2>
            <Input type='number' min={1} placeholder='Enter quantity' className='w-32' />
          </div>

          <div className='flex flex-col mb-5 mr-10 md:w-full md:mr-0 md:flex-row md:justify-between md:items-center'>
            <h2 className='text-xl mb-2 mr-3'>Expected Delivery Date</h2>
            <ExpectedDeliveryDatePicker />
          </div>
        </div>

        <Divider className='border-1 my-3 border-solid border-gray-100' />

        <Button size={'lg'}>Get a Quote</Button>
      </div>
    </div>
  )
}