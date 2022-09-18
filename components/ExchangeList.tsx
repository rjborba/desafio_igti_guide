import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { IExange } from "types/IExchange";

const ListWrapper = styled.ul`
  padding: 2rem;
  list-style: none;

  li {
    background-color: lightgrey; // <Thing> when hovered
    border-radius: 12px;
    overflow: hidden;
    margin: 1rem;
  }
`;

const StyledButton = styled.button`
  background-color: transparent;
  border: 1px solid black;
  border-radius: 5px;
  padding: 12px;
  margin: 16px 32px;

  :hover {
    cursor: pointer;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const InputWrapper = styled.div`
  width: 100%;
  padding: 0 32px;
  margin-top: 18px;

  input {
    width: 100%;
    height: 42px;
    padding: 0 12px;
  }
`;

interface CountWrapperProps {
  visible: boolean;
}

const CountWrapper = styled.div<CountWrapperProps>`
  margin-left: 32px;
  margin-top: 12px;
  display: ${(props) =>
    props.visible !== undefined && !props.visible ? "none" : "block"};
`;

const TitleWapper = styled.h3`
  display: flex;
  align-items: center;

  div {
    margin-left: 8px;
  }
`;

interface ListComponentProps {
  exchanges: IExange[];
  page?: number;
  pageSize?: number;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
}

export const ExchangeList = ({
  exchanges,
  page = 1,
  pageSize = 100,
  onNextPage = () => {},
  onPreviousPage = () => {},
}: ListComponentProps) => {
  const [filterText, setFilterText] = useState("");
  const [filteredList, setFilteredLis] = useState<any[]>([]);

  useEffect(() => {
    if (exchanges) {
      setFilteredLis(
        exchanges.filter((item: any) =>
          item.name.toLowerCase().includes(filterText.toLowerCase().trim())
        )
      );
    } else {
      setFilteredLis([]);
    }
  }, [exchanges, filterText]);

  const renderList = () => {
    return (
      <ListWrapper>
        {filteredList.map((item: any) => (
          <li key={item.id} style={{ padding: "1rem" }}>
            <TitleWapper>
              <Image
                width={50}
                height={50}
                src={
                  !item.image || item.image.includes("missing_small")
                    ? "/placeholder.png"
                    : item.image
                }
              />
              <div>{item.name}</div>
            </TitleWapper>
            <div>
              Ano da criação: <b>{item.year_established}</b>
            </div>
            <div>
              Pais: <b>{item.country}</b>
            </div>
            <div>
              Pontuação: <b>{item.trust_score}</b>
            </div>
            <div>
              Volume de trade (24 horas): <b>{item.trade_volume_24h_btc}</b>
            </div>
          </li>
        ))}
      </ListWrapper>
    );
  };

  return (
    <div>
      <ButtonWrapper>
        <StyledButton
          disabled={page === 1}
          onClick={() => {
            setFilterText("");
            onPreviousPage();
          }}
        >
          Página Anterior
        </StyledButton>
        <StyledButton
          disabled={exchanges.length < pageSize}
          onClick={() => {
            setFilterText("");
            onNextPage();
          }}
        >
          Próxima Página
        </StyledButton>
      </ButtonWrapper>
      <InputWrapper>
        <input
          value={filterText}
          placeholder="Filtre por nome"
          onChange={(event) => setFilterText(event.target.value)}
        />
      </InputWrapper>
      <CountWrapper visible={filterText.length > 0}>
        Exibindo {filteredList.length} de {exchanges.length}
      </CountWrapper>

      {exchanges.length === 0 ? <div>Sem resultados</div> : renderList()}
    </div>
  );
};
