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
  className?: string;
}

export function ProductDescriptionTab({ className }: Props) {
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec feugiat orci id nibh suscipit molestie. Quisque imperdiet tortor vel arcu condimentum convallis. Pellentesque semper turpis quis velit pulvinar pharetra. Sed libero quam, auctor eu viverra imperdiet, porttitor nec nunc. Curabitur commodo ante quis ex tincidunt, in pulvinar erat luctus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas vestibulum tellus enim, sed porttitor dolor finibus non. Aenean sodales lobortis ipsum gravida venenatis. Donec at scelerisque ligula.
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="features">
        <Card>
          <CardContent className="p-6">
            <div>
              <ul className="list-disc list-inside">
                <li>Lorem ipsum dolor sit amet</li>
                <li>consectetur adipiscing elit</li>
                <li>Donec feugiat orci id nibh suscipit molestie</li>
                <li>Quisque imperdiet tortor vel arcu condimentum convallis</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}