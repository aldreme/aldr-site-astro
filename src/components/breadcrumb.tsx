"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Link } from "@heroui/link";

export interface BreadcrumbItemData {
  href?: string;
  label: string;
}

export interface BreadcrumbData {
  items: BreadcrumbItemData[];
}

interface Props {
  data: BreadcrumbData;
}

export function BreadcrumbResponsive({ data }: Props) {
  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className="mb-8">
      <BreadcrumbList>
        {data.items.map((item, index) => (
          <BreadcrumbItem className="flex flex-row items-center justify-center" key={index}>
            <>
              <BreadcrumbLink
                asChild
                className="max-w-20 truncate md:max-w-none"
              >
                <Link href={item.href ? item.href : '#'}>{item.label}</Link>
              </BreadcrumbLink>

              {index < data.items.length - 1 && <BreadcrumbSeparator />}
            </>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
