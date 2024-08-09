import React from "react";
import styled from "styled-components";
import { Table } from "antd";

// Styled Table using styled-components
const StyledTable = styled(Table)`
  &&& {
    background-color: transparent !important;
  }
  &&& .css-dev-only-do-not-override-d2lrxs {
    background-color: transparent !important;
  }
  &&& {
    .ant-table-container {
      border-radius: 8px; // Set the border-radius for the whole table
      overflow: hidden; // Ensure the inner elements don't overflow the rounded corners
      border: 0px solid #ccc;
      background: transparent;
    }

    .ant-table-thead > tr > th {
      background-color: ${(props) => props.theme.table.header};
      color: ${(props) => props.theme.table.text};
      first-child {
        border-top-left-radius: 8px; // Round the top-left corner of the table header
      }
      last-child {
        border-top-right-radius: 8px; // Round the top-right corner of the table header
      }
    }

    .ant-table-tbody > tr > td {
      background-color: ${(props) => props.theme.table.body};
      color: ${(props) => props.theme.colors.text};
    }

    .ant-table-tbody > tr:last-child > td {
      first-child {
        // Exclude the cells to the right of this
        border-bottom-left-radius: 8px; // Round the bottom-left corner of the last row
      }
      last-child {
        // Exclude the cells to the left of this
        border-bottom-right-radius: 8px; // Round the bottom-right corner of the last row
      }
      border-bottom: none;
    }
  }
`;

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: start;
  flex-direction: column;
`;

const BackgroundCard = styled.div`
  /* background-color: ${(props) => props.theme.colors.secondary}; */
  padding: 30px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ResultTitle = styled.h1`
  margin-top: 0px;
`;

// Sample data for Ant Design Table
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
];

export default function AntdStyledComponents() {
  return (
    <StyledContainer>
      <BackgroundCard>
        <ResultTitle>Results</ResultTitle>
        <StyledTable columns={columns} dataSource={data} pagination={false} />
      </BackgroundCard>
    </StyledContainer>
  );
}
