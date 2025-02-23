import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export function ProductTechSpecs() {
  return (
    <Table className="w-full max-w-md">
      {/* Table body with vertical entries (label on the left, value on the right) */}
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">External Size</TableCell>
          <TableCell>160cm(W) x 180cm(L) x 80cm(H)</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Internal Size</TableCell>
          <TableCell>160cm(W) x 180cm(L) x 80cm(H)</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Weight</TableCell>
          <TableCell>30 KG / 45 lbs</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Volume</TableCell>
          <TableCell>20 L / 5 gallons</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Material</TableCell>
          <TableCell>304 Stainless Steel</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Process</TableCell>
          <TableCell>Seamless Welding, Mirror Finishing</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Operating Temperature Range</TableCell>
          <TableCell>-50C to +200C</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Electrical Specifications</TableCell>
          <TableCell>220–240 VAC, 15 A, 3.6 kW</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}