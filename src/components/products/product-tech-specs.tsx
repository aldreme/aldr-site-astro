import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import type { DimensionMeasurements, ElectricalSpecs, ProductSpecs, TemperatureRange } from "./types";

interface Props {
  productTechSpecs: ProductSpecs;
}

function kilogramsToPounds(kg: number) {
  return (kg * 2.20462);
}

function weightStr(weight: number) {
  return `${weight.toFixed(2)} KG / ${kilogramsToPounds(weight).toFixed(2)} lbs`;
}

function centimetersToInches(cm: number) {
  return (cm * 0.393701);
}

function dimensionStr(dimension: DimensionMeasurements) {
  return `${dimension.width.toFixed(2)}cm(W) x ${dimension.length.toFixed(2)}cm(L) x ${dimension.height.toFixed(2)}cm(H) / ${centimetersToInches(dimension.width).toFixed(2)}"(W) x ${centimetersToInches(dimension.length).toFixed(2)}"(L) x ${centimetersToInches(dimension.height).toFixed(2)}"(H)`;
}

function litresToGallons(litres: number) {
  return (litres * 0.264172);
}

function volumeStr(volume: number) {
  return `${volume.toFixed(2)} L / ${litresToGallons(volume).toFixed(2)} gallons`;
}

function celciusToFahrenheit(celcius: number) {
  return (celcius * 9 / 5 + 32);
}

function signedTemperature(temperature: number) {
  let temperatureStr = `${temperature.toFixed(2)}`;

  if (temperature > 0) {
    temperatureStr = `+${temperature.toFixed(2)}`;
  }

  if (temperature < 0) {
    temperatureStr = `${temperature.toFixed(2)}`;
  }

  return temperatureStr
}

function opTemperatureStr(temperature: TemperatureRange) {
  return `${signedTemperature(temperature.min)}°C to ${signedTemperature(temperature.max)}°C / ${signedTemperature(celciusToFahrenheit(temperature.min))}°F to ${signedTemperature(celciusToFahrenheit(temperature.max))}°F`;
}

function electricalSpecsStr(electricalSpecs: ElectricalSpecs) {
  return `${electricalSpecs.voltage.min.toFixed(2)} - ${electricalSpecs.voltage.max.toFixed(2)} VAC, ${electricalSpecs.current.min.toFixed(2)} - ${electricalSpecs.current.max.toFixed(2)} A, ${electricalSpecs.power.min.toFixed(2)} - ${electricalSpecs.power.max.toFixed(2)} kW`;
}

function BadgeCustomizable() {
  return (
    <Badge className="bg-blue-500 select-none hover:bg-blue-400">customizable</Badge>
  );
}

export function ProductTechSpecs({ productTechSpecs }: Props) {
  if (!productTechSpecs) return null;

  const externalDimension = productTechSpecs.dimension?.external;
  const internalDimension = productTechSpecs.dimension?.internal;
  return (
    <div className="rounded-md border border-zinc-200 overflow-hidden">
      <Table className="w-full">
        <TableBody>
          {
            externalDimension && (
              <TableRow className="even:bg-zinc-50 hover:bg-zinc-100">
                <TableCell className="font-semibold text-zinc-700 w-1/3 bg-zinc-50/50">External Dimensions</TableCell>
                <TableCell className="font-mono text-zinc-600">{dimensionStr(externalDimension)}</TableCell>
                <TableCell className="w-10">
                  {
                    productTechSpecs.dimension?.customizable && <BadgeCustomizable />
                  }
                </TableCell>
              </TableRow>
            )
          }

          {
            internalDimension && (
              <TableRow className="even:bg-zinc-50 hover:bg-zinc-100">
                <TableCell className="font-semibold text-zinc-700 bg-zinc-50/50">Internal Dimensions</TableCell>
                <TableCell className="font-mono text-zinc-600">{dimensionStr(internalDimension)}</TableCell>
                <TableCell>
                  {
                    productTechSpecs.dimension?.customizable && <BadgeCustomizable />
                  }
                </TableCell>
              </TableRow>
            )
          }

          {
            productTechSpecs.weight && (
              <TableRow className="even:bg-zinc-50 hover:bg-zinc-100">
                <TableCell className="font-semibold text-zinc-700 bg-zinc-50/50">Weight</TableCell>
                <TableCell className="font-mono text-zinc-600">{weightStr(productTechSpecs.weight.value)}</TableCell>
                <TableCell>
                  {
                    productTechSpecs.weight.customizable && <BadgeCustomizable />
                  }
                </TableCell>
              </TableRow>
            )
          }

          {
            productTechSpecs.volume !== undefined && (
              <TableRow className="even:bg-zinc-50 hover:bg-zinc-100">
                <TableCell className="font-semibold text-zinc-700 bg-zinc-50/50">Volume</TableCell>
                <TableCell className="font-mono text-zinc-600">{volumeStr(productTechSpecs.volume.value)}</TableCell>
                <TableCell>
                  {
                    productTechSpecs.volume.customizable && <BadgeCustomizable />
                  }
                </TableCell>
              </TableRow>
            )
          }

          {
            productTechSpecs.material && (
              <TableRow className="even:bg-zinc-50 hover:bg-zinc-100">
                <TableCell className="font-semibold text-zinc-700 bg-zinc-50/50">Material</TableCell>
                <TableCell className="text-zinc-600">{productTechSpecs.material.value}</TableCell>
                <TableCell>
                  {
                    productTechSpecs.material.customizable && <BadgeCustomizable />
                  }
                </TableCell>
              </TableRow>
            )
          }

          {
            productTechSpecs.process_technology && (
              <TableRow className="even:bg-zinc-50 hover:bg-zinc-100">
                <TableCell className="font-semibold text-zinc-700 bg-zinc-50/50">Process</TableCell>
                <TableCell className="text-zinc-600">{productTechSpecs.process_technology.value.map(v => v.toUpperCase()).join(', ')}</TableCell>
                <TableCell>
                  {
                    productTechSpecs.process_technology.customizable && <BadgeCustomizable />
                  }
                </TableCell>
              </TableRow>
            )
          }

          {
            productTechSpecs.operating_temperature && (
              <TableRow className="even:bg-zinc-50 hover:bg-zinc-100">
                <TableCell className="font-semibold text-zinc-700 bg-zinc-50/50">Operating Temp.</TableCell>
                <TableCell className="font-mono text-zinc-600">{opTemperatureStr(productTechSpecs.operating_temperature)}</TableCell>
                <TableCell>
                  {
                    productTechSpecs.operating_temperature.customizable && <BadgeCustomizable />
                  }
                </TableCell>
              </TableRow>
            )
          }

          {
            productTechSpecs.electrical && (
              <TableRow className="even:bg-zinc-50 hover:bg-zinc-100">
                <TableCell className="font-semibold text-zinc-700 bg-zinc-50/50">Electrical</TableCell>
                <TableCell className="font-mono text-zinc-600">{electricalSpecsStr(productTechSpecs.electrical)}</TableCell>
                <TableCell>
                  {
                    productTechSpecs.electrical.customizable && <BadgeCustomizable />
                  }
                </TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </div>
  )
}