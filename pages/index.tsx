import { ExchangeList } from "@/components/ExchangeList";
import { useState } from "react";
import useSWR from "swr";

const pageSize = 100;
export default function Home() {
  const [pageIndex, setPageIndex] = useState(1);

  const { data, error } = useSWR(
    `https://api.coingecko.com/api/v3/exchanges/?per_page=${pageSize}&page=${pageIndex}`,
    (...args) => fetch(...args).then(async (res) => res.json())
  );

  if (error) {
    return <div>Error! Reload the page</div>;
  }

  if (!data) {
    return <div>Loading</div>;
  }

  return (
    <ExchangeList
      exchanges={data}
      page={pageIndex}
      pageSize={pageSize}
      onNextPage={() => {
        setPageIndex((p) => p + 1);
      }}
      onPreviousPage={() => {
        setPageIndex((p) => p - 1);
      }}
    />
  );
}
