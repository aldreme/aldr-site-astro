import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ui, useTranslations } from "@/i18n/ui";


interface Props {
  productDescription: string;
  productFeatures: string[];
  className?: string;
  lang?: string;
}

export function ProductDescriptionTab({ productDescription, productFeatures, className, lang = 'en' }: Props) {
  const t = useTranslations(lang as keyof typeof ui);
  return (
    <Tabs defaultValue="description" className={className}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="description">{t('product.tabs.description') || 'Description'}</TabsTrigger>
        <TabsTrigger value="features">{t('product.tabs.features') || 'Features'}</TabsTrigger>
      </TabsList>
      <TabsContent value="description">
        <Card>
          <CardContent className="p-6">
            <div>
              <p>
                {productDescription}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="features">
        <Card>
          <CardContent className="p-6">
            <div>
              <ul className="list-disc list-inside">
                {
                  productFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))
                }
              </ul>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}