"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
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
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {data.items.map((item, index) => (
          <Fragment key={`frag-item-${index}`}>
            <BreadcrumbItem key={index}>
              {item.href ? (
                <BreadcrumbLink href={item.href} className="max-w-40 truncate md:max-w-none">
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="max-w-56 truncate md:max-w-none">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {index < data.items.length - 1 && <BreadcrumbSeparator key={`separator-${index}`} />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
