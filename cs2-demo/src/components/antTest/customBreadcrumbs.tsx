import React from "react";
import styled from "styled-components";
import { Breadcrumb } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "../../features/navigation/navigationSlice";
import { RootState } from "../../app/store";

const StyledBreadcrumb = styled(Breadcrumb)`
  padding: 8px 16px;

  border-radius: 8px;
`;

const BreadcrumbItem = styled(Breadcrumb.Item)`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Breadcrumbs = () => {
  const dispatch = useDispatch();
  const currentPath = useSelector(
    (state: RootState) => state.navigation.currentPage
  ); // Assuming it's a path-like string

  const pathSegments = currentPath.split("/").filter(Boolean); // Remove any empty segments
  const breadcrumbItems = pathSegments.map((segment, index, array) => {
    // Reconstruct the path up to the current segment
    const pathToSegment = array.slice(0, index + 1).join("/");
    return { label: segment, path: pathToSegment };
  });

  const handleBreadcrumbClick = (path: string) => {
    dispatch(setCurrentPage(path));
  };

  return (
    <StyledBreadcrumb>
      {breadcrumbItems.map((item, index) => (
        <BreadcrumbItem
          key={index}
          onClick={() => handleBreadcrumbClick(item.path)}
          // Last item is not clickable
          //style={{ cursor: index === breadcrumbItems.length - 1 ? 'default' : 'pointer' }}
        >
          {item.label}
        </BreadcrumbItem>
      ))}
    </StyledBreadcrumb>
  );
};

export default Breadcrumbs;
