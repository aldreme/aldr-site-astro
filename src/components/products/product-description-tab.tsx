import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
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
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="specs">Specs</TabsTrigger>
      </TabsList>
      <TabsContent value="description">
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
            </div>
            <div className="space-y-1">
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="features">
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
            </div>
            <div className="space-y-1">
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="specs">
        <Card>
          <CardHeader>
            <CardTitle>Specs</CardTitle>
            <CardDescription>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
            </div>
            <div className="space-y-1">
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}