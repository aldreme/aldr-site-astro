"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@heroui/react";
import { Fragment } from "react/jsx-runtime";

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
      <BreadcrumbList className="flex flex-row items-center justify-start">
        {data.items.map((item, index) => (
          <Fragment key={`frag-item-${index}`}>
            <BreadcrumbItem className="flex flex-row items-center justify-center" key={index}>
              <BreadcrumbLink
                asChild
                className="max-w-20 truncate md:max-w-none"
              >
                {item.href ? <Button as='a' href={item.href}>{item.label}</Button> : <BreadcrumbPage>{item.label}</BreadcrumbPage>}
              </BreadcrumbLink>
            </BreadcrumbItem>

            {index < data.items.length - 1 && <BreadcrumbSeparator key={`separator-${index}`} />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
