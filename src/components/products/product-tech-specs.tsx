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
  const externalDimension = productTechSpecs.dimension.external;
  const internalDimension = productTechSpecs.dimension.internal;
  return (
    <Table className="w-full max-w-screen-xl">
      {/* Table body with vertical entries (label on the left, value on the right) */}
      <TableBody>
        {
          externalDimension && (
            <TableRow>
              <TableCell className="font-medium">External Size</TableCell>
              <TableCell>{dimensionStr(externalDimension)}</TableCell>
              <TableCell>
                {
                  productTechSpecs.dimension.customizable && <BadgeCustomizable />
                }
              </TableCell>
            </TableRow>
          )
        }

        {
          internalDimension && (
            <TableRow>
              <TableCell className="font-medium">Internal Size</TableCell>
              <TableCell>{dimensionStr(internalDimension)}</TableCell>
              <TableCell>
                {
                  productTechSpecs.dimension.customizable && <BadgeCustomizable />
                }
              </TableCell>
            </TableRow>
          )
        }

        <TableRow>
          <TableCell className="font-medium">Weight</TableCell>
          <TableCell>{weightStr(productTechSpecs.weight.value)}</TableCell>
          <TableCell>
            {
              productTechSpecs.weight.customizable && <BadgeCustomizable />
            }
          </TableCell>
        </TableRow>

        {
          productTechSpecs.volume !== undefined && (
            <TableRow>
              <TableCell className="font-medium">Volume</TableCell>
              <TableCell>{volumeStr(productTechSpecs.volume.value)}</TableCell>
              <TableCell>
                {
                  productTechSpecs.volume.customizable && <BadgeCustomizable />
                }
              </TableCell>
            </TableRow>
          )
        }

        <TableRow>
          <TableCell className="font-medium">Material</TableCell>
          <TableCell>{productTechSpecs.material.value}</TableCell>
          <TableCell>
            {
              productTechSpecs.material.customizable && <BadgeCustomizable />
            }
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Process</TableCell>
          <TableCell>{productTechSpecs.process_technology.value.map(v => v.toUpperCase()).join(', ')}</TableCell>
          <TableCell>
            {
              productTechSpecs.process_technology.customizable && <BadgeCustomizable />
            }
          </TableCell>
        </TableRow>

        {
          productTechSpecs.operating_temperature && (
            <TableRow>
              <TableCell className="font-medium">Operating Temperature Range</TableCell>
              <TableCell>{opTemperatureStr(productTechSpecs.operating_temperature)}</TableCell>
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
            <TableRow>
              <TableCell className="font-medium">Electrical Specifications</TableCell>
              <TableCell>{electricalSpecsStr(productTechSpecs.electrical)}</TableCell>
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
  )
}