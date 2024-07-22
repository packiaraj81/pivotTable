import { render, screen } from "@testing-library/react";
import PivotTable from "./PivotTable";
import PivotTable from "./PivotTable";

test("renders learn react link", () => {
  render(<PivotTable />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
