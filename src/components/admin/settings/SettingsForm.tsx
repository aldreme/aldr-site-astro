
import { supabase } from "@/lib/supabase";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Tab,
  Tabs,
  Textarea
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useAdminTranslation } from "../AdminI18nProvider";

type ConfigItem = {
  key: string;
  value: any;
  translations: Record<string, any> | null;
};

export default function SettingsForm() {
  const { t } = useAdminTranslation(); // Added t() initialization
  const [config, setConfig] = useState<Record<string, ConfigItem>>({}); // Renamed items to config, setItems to setConfig
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>("en");

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("site_config").select("*");
    if (error) console.error(error);
    else {
      const configMap: Record<string, ConfigItem> = {};
      data?.forEach(item => {
        configMap[item.key] = item;
      });
      setConfig(configMap); // Changed setItems to setConfig
    }
    setLoading(false);
  };

  const handleSave = async (key: string, currentItem: ConfigItem) => {
    setSaving(true);

    // If saving English (default), update 'value'. 
    // If saving other lang effectively, we update 'translations'.
    // BUT the UI state is unified. 

    const { error } = await supabase.from("site_config").upsert({
      key,
      value: currentItem.value,
      translations: currentItem.translations
    });

    if (error) alert("Error saving: " + error.message);
    else alert("Saved!");
    setSaving(false);
  };

  const updateField = (key: string, field: string, newValue: string) => {
    const item = config[key] || { key, value: {}, translations: {} }; // Changed items to config

    if (selectedLang === 'en') {
      // Update Default Value
      setConfig({ // Changed setItems to setConfig
        ...config, // Changed items to config
        [key]: {
          ...item,
          value: { ...item.value, [field]: newValue }
        }
      });
    } else {
      // Update Translation
      const currentTranslations = item.translations || {};
      const langTranslation = currentTranslations[selectedLang] || {};

      setConfig({ // Changed setItems to setConfig
        ...config, // Changed items to config
        [key]: {
          ...item,
          translations: {
            ...currentTranslations,
            [selectedLang]: {
              ...langTranslation,
              [field]: newValue
            }
          }
        }
      });
    }
  };

  const getValue = (key: string, field: string) => {
    const item = config[key]; // Changed items to config
    if (!item) return "";

    if (selectedLang === 'en') {
      return item.value?.[field] || "";
    } else {
      return item.translations?.[selectedLang]?.[field] || "";
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full space-y-8 max-w-3xl mx-auto pb-24">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('admin.settings.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('admin.settings.subtitle')}</p>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-gray-100 dark:border-zinc-800 w-fit">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 px-3">{t('admin.settings.tabs.label')}</span>
        <Tabs
          aria-label="Language Options"
          selectedKey={selectedLang}
          onSelectionChange={(key) => setSelectedLang(key as string)}
          color="primary"
          radius="full"
          classNames={{
            cursor: "w-full",
            tab: "px-6 h-9",
            tabContent: "group-data-[selected=true]:text-white"
          }}
        >
          <Tab key="en" title={t('admin.settings.tabs.en')} />
          <Tab key="zh" title={t('admin.settings.tabs.zh')} />
        </Tabs>
      </div>

      <div className="grid gap-8">
        {/* Contact Info */}
        <Card className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 p-4">
          <CardHeader className="flex flex-col items-start gap-1 pb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('admin.settings.cards.contact.title')}</h3>
            <p className="text-sm text-gray-500">{t('admin.settings.cards.contact.subtitle')}</p>
          </CardHeader>
          <Divider className="opacity-50" />
          <CardBody className="space-y-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('admin.settings.form.us_phone')}
                placeholder="+1 (xxx) xxx-xxxx"
                variant="bordered"
                labelPlacement="outside"
                classNames={{ inputWrapper: "rounded-2xl h-11" }}
                value={getValue("contact_info", "tel_us")}
                onChange={(e) => updateField("contact_info", "tel_us", e.target.value)}
              />
              <Input
                label={t('admin.settings.form.cn_phone')}
                placeholder="+86 (xxx) xxxx-xxxx"
                variant="bordered"
                labelPlacement="outside"
                classNames={{ inputWrapper: "rounded-2xl h-11" }}
                value={getValue("contact_info", "tel_cn")}
                onChange={(e) => updateField("contact_info", "tel_cn", e.target.value)}
              />
            </div>
            <Input
              label={t('admin.settings.form.email')}
              placeholder="contact@aldr.com"
              variant="bordered"
              labelPlacement="outside"
              classNames={{ inputWrapper: "rounded-2xl h-11" }}
              value={getValue("contact_info", "email")}
              onChange={(e) => updateField("contact_info", "email", e.target.value)}
            />
            <Textarea
              label={t('admin.settings.form.address')}
              placeholder="Enter full address..."
              variant="bordered"
              labelPlacement="outside"
              classNames={{ inputWrapper: "rounded-2xl" }}
              value={getValue("contact_info", "address")}
              onChange={(e) => updateField("contact_info", "address", e.target.value)}
            />
          </CardBody>
          <CardFooter className="pt-2">
            <Button
              color="primary"
              radius="full"
              className="px-8 font-semibold shadow-lg shadow-blue-500/20"
              onPress={() => handleSave("contact_info", config["contact_info"])} // Changed items to config
              isLoading={saving}
            >
              {t('admin.settings.cards.contact.save')}
            </Button>
          </CardFooter>
        </Card>

        {/* Hero Section */}
        <Card className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 p-4">
          <CardHeader className="flex flex-col items-start gap-1 pb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('admin.settings.cards.hero.title')}</h3>
            <p className="text-sm text-gray-500">{t('admin.settings.cards.hero.subtitle')}</p>
          </CardHeader>
          <Divider className="opacity-50" />
          <CardBody className="space-y-6 py-6">
            <Input
              label={t('admin.settings.form.h1')}
              variant="bordered"
              labelPlacement="outside"
              classNames={{ inputWrapper: "rounded-2xl h-11" }}
              value={getValue("home_hero", "title_h1")}
              onChange={(e) => updateField("home_hero", "title_h1", e.target.value)}
            />
            <Textarea
              label={t('admin.settings.form.h2')}
              variant="bordered"
              labelPlacement="outside"
              classNames={{ inputWrapper: "rounded-2xl" }}
              minRows={3}
              value={getValue("home_hero", "title_h2")}
              onChange={(e) => updateField("home_hero", "title_h2", e.target.value)}
            />
          </CardBody>
          <CardFooter className="pt-2">
            <Button
              color="primary"
              radius="full"
              className="px-8 font-semibold shadow-lg shadow-blue-500/20"
              onPress={() => handleSave("home_hero", config["home_hero"])} // Changed items to config
              isLoading={saving}
            >
              {t('admin.settings.cards.hero.save')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
