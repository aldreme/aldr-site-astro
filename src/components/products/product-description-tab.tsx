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


interface Props {
  productDescription: string;
  productFeatures: string[];
  className?: string;
}

export function ProductDescriptionTab({ productDescription, productFeatures, className }: Props) {
  return (
    <Tabs defaultValue="description" className={className}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
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