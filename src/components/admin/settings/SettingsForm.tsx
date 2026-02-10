
import { supabase } from "@/lib/supabase";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Textarea
} from "@heroui/react";
import { useEffect, useState } from "react";

export default function SettingsForm() {
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("site_config").select("*");
    if (error) console.error(error);
    else {
      const configMap: any = {};
      data?.forEach(item => {
        configMap[item.key] = item.value;
      });
      setConfig(configMap);
    }
    setLoading(false);
  };

  const handleSave = async (key: string, value: any) => {
    setSaving(true);
    const { error } = await supabase.from("site_config").upsert({ key, value });
    if (error) alert("Error saving: " + error.message);
    else alert("Saved!");
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full space-y-8 max-w-3xl mx-auto pb-24">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Site Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage global website configuration and content</p>
      </div>

      <div className="grid gap-8">
        {/* Contact Info */}
        <Card className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 p-4">
          <CardHeader className="flex flex-col items-start gap-1 pb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Contact Information</h3>
            <p className="text-sm text-gray-500">Public contact details shown in header and footer</p>
          </CardHeader>
          <Divider className="opacity-50" />
          <CardBody className="space-y-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="US Office Phone"
                placeholder="+1 (xxx) xxx-xxxx"
                variant="bordered"
                labelPlacement="outside"
                classNames={{ inputWrapper: "rounded-2xl h-11" }}
                value={config.contact_info?.tel_us || ""}
                onChange={(e) => setConfig({
                  ...config,
                  contact_info: { ...config.contact_info, tel_us: e.target.value }
                })}
              />
              <Input
                label="CN Office Phone"
                placeholder="+86 (xxx) xxxx-xxxx"
                variant="bordered"
                labelPlacement="outside"
                classNames={{ inputWrapper: "rounded-2xl h-11" }}
                value={config.contact_info?.tel_cn || ""}
                onChange={(e) => setConfig({
                  ...config,
                  contact_info: { ...config.contact_info, tel_cn: e.target.value }
                })}
              />
            </div>
            <Input
              label="Support Email"
              placeholder="contact@aldr.com"
              variant="bordered"
              labelPlacement="outside"
              classNames={{ inputWrapper: "rounded-2xl h-11" }}
              value={config.contact_info?.email || ""}
              onChange={(e) => setConfig({
                ...config,
                contact_info: { ...config.contact_info, email: e.target.value }
              })}
            />
            <Textarea
              label="HQ Office Address"
              placeholder="Enter full address..."
              variant="bordered"
              labelPlacement="outside"
              classNames={{ inputWrapper: "rounded-2xl" }}
              value={config.contact_info?.address || ""}
              onChange={(e) => setConfig({
                ...config,
                contact_info: { ...config.contact_info, address: e.target.value }
              })}
            />
          </CardBody>
          <CardFooter className="pt-2">
            <Button
              color="primary"
              radius="full"
              className="px-8 font-semibold shadow-lg shadow-blue-500/20"
              onPress={() => handleSave("contact_info", config.contact_info)}
              isLoading={saving}
            >
              Save Information
            </Button>
          </CardFooter>
        </Card>

        {/* Hero Section */}
        <Card className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 p-4">
          <CardHeader className="flex flex-col items-start gap-1 pb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Home Hero Content</h3>
            <p className="text-sm text-gray-500">Customize the main hero messaging on the landing page</p>
          </CardHeader>
          <Divider className="opacity-50" />
          <CardBody className="space-y-6 py-6">
            <Input
              label="Primary Heading (H1)"
              variant="bordered"
              labelPlacement="outside"
              classNames={{ inputWrapper: "rounded-2xl h-11" }}
              value={config.home_hero?.title_h1 || "Trusted by Global Industry Leaders"}
              onChange={(e) => setConfig({
                ...config,
                home_hero: { ...config.home_hero, title_h1: e.target.value }
              })}
            />
            <Textarea
              label="Sub-heading (H2)"
              variant="bordered"
              labelPlacement="outside"
              classNames={{ inputWrapper: "rounded-2xl" }}
              minRows={3}
              value={config.home_hero?.title_h2 || "High Quality Cleanroom Stainless Steel Furnitures"}
              onChange={(e) => setConfig({
                ...config,
                home_hero: { ...config.home_hero, title_h2: e.target.value }
              })}
            />
          </CardBody>
          <CardFooter className="pt-2">
            <Button
              color="primary"
              radius="full"
              className="px-8 font-semibold shadow-lg shadow-blue-500/20"
              onPress={() => handleSave("home_hero", config.home_hero)}
              isLoading={saving}
            >
              Update Hero Content
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
