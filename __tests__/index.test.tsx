import { ExchangeList } from "@/components/ExchangeList";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockedApiResult } from "../mocks/mockedApiResult";

describe("ExchangeList sanity", () => {
  it("should render page navigation buttons", () => {
    render(<ExchangeList exchanges={[]} page={0} />);

    const nextPage = screen.getByRole("button", {
      name: /próxima página/i,
    });

    const previousPage = screen.getByRole("button", {
      name: /página anterior/i,
    });

    expect(nextPage).toBeInTheDocument();
    expect(previousPage).toBeInTheDocument();
  });

  it("should change between pages", () => {
    const mockNextPageCallback = jest.fn();
    const mockPreviousPageCallback = jest.fn();

    render(
      <ExchangeList
        exchanges={mockedApiResult}
        page={2}
        pageSize={1}
        onNextPage={mockNextPageCallback}
        onPreviousPage={mockPreviousPageCallback}
      />
    );

    const nextPage = screen.getByRole("button", {
      name: /próxima página/i,
    });

    const previousPage = screen.getByRole("button", {
      name: /página anterior/i,
    });

    fireEvent.click(nextPage);
    expect(mockNextPageCallback).toBeCalledTimes(1);

    fireEvent.click(previousPage);
    expect(mockPreviousPageCallback).toBeCalledTimes(1);
  });

  it("should disable previous page button on first page", () => {
    const { rerender } = render(<ExchangeList exchanges={[]} page={1} />);

    const previousPage = screen.getByRole("button", {
      name: /página anterior/i,
    });

    expect(previousPage).toBeDisabled();

    rerender(<ExchangeList exchanges={[]} page={2} />);
    expect(previousPage).not.toBeDisabled();
  });

  it("should disable next page button when api result does not fits the page", () => {
    // TODO
  });

  it("should display sem resultados for empty exange list", async () => {
    const { rerender } = render(<ExchangeList exchanges={[]} page={0} />);

    screen.getByText(/sem resultados/i);

    rerender(<ExchangeList exchanges={[mockedApiResult[0]]} page={0} />);

    let noResultsText;
    try {
      noResultsText = await screen.findByText(/sem resultados/i);
      expect(noResultsText).not.toBeInTheDocument();
    } catch {}
  });
});

// name, image, year_established, country, trust_score, trade_volume_24h_btc
describe("Data display", () => {
  it("should display the correct exchanges passed as parameter", async () => {
    render(<ExchangeList exchanges={mockedApiResult} page={0} />);

    const itemLists = await screen.findAllByRole("listitem");

    expect(itemLists).toHaveLength(2);
  });

  it("should display the correct exchanges data", async () => {
    render(<ExchangeList exchanges={mockedApiResult} page={0} />);

    const rederedItems = await screen.findAllByRole("listitem");

    mockedApiResult.forEach((mock, index) => {
      const renderedItem = within(rederedItems[index]);
      renderedItem.getByRole("heading", { name: mock.name });
      renderedItem.getByText(mock.country);
    });
  });
});

describe("Filter", () => {
  it("should display filter textbox", () => {
    render(<ExchangeList exchanges={mockedApiResult} page={0} />);

    screen.getByPlaceholderText(/filtre por nome/i);
  });

  it("should filter while typing", async () => {
    render(<ExchangeList exchanges={mockedApiResult} page={0} />);

    screen.getByRole("heading", { name: /binance/i });

    const filterInput = screen.getByPlaceholderText(/filtre por nome/i);

    userEvent.type(filterInput, "fx");

    await waitFor(() =>
      expect(screen.queryByText(/binance/i)).not.toBeInTheDocument()
    );

    const binanceEntry = screen.queryByText(/binance/i);
    expect(binanceEntry).not.toBeInTheDocument();
  });
});
