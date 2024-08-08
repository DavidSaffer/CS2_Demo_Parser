import React from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setCurrentPage } from "../../features/navigation/navigationSlice";
import { IoHome, IoHomeOutline } from "react-icons/io5";
import { AiFillFile, AiOutlineFile } from "react-icons/ai";
import { AiFillFolder, AiOutlineFolder } from "react-icons/ai";
import { RiFileListFill, RiFileListLine } from "react-icons/ri";
import { IoIosHelpCircle, IoIosHelpCircleOutline } from "react-icons/io";
import { IoSettingsSharp, IoSettingsOutline } from "react-icons/io5";

const SidebarContainer = styled.div`
  grid-area: sidenav;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.text};
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-right: 2px solid ${(props) => props.theme.colors.accent};
`;

const MenuItem = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background-color: ${(props) =>
    props.selected ? props.theme.colors.hover : "transparent"};
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  //   text-decoration: ${(props) => (props.selected ? "underline" : "none")};
  &:hover {
    background-color: ${(props) => props.theme.colors.hover};
    cursor: pointer;
  }
  border-radius: 4px;
`;

const IconWrapper = styled.div`
  margin-right: 10px; /* Adjust the value as needed for the desired spacing */
  display: flex;
  align-items: center; /* Ensures icons are centered vertically */
`;

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.navigation.currentPage);

  const handleMenuItemClick = (page: string) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <SidebarContainer>
      <MenuItem
        selected={currentPage === "Home"}
        onClick={() => handleMenuItemClick("Home")}
      >
        <IconWrapper>
          {currentPage === "Home" ? <IoHome /> : <IoHomeOutline />}
        </IconWrapper>
        Home
      </MenuItem>
      <MenuItem
        selected={currentPage === "Individual"}
        onClick={() => handleMenuItemClick("Individual")}
      >
        <IconWrapper>
          {currentPage === "Individual" ? <AiFillFile /> : <AiOutlineFile />}
        </IconWrapper>
        Individual
      </MenuItem>
      <MenuItem
        selected={currentPage === "Batch"}
        onClick={() => handleMenuItemClick("Batch")}
      >
        <IconWrapper>
          {currentPage === "Batch" ? <AiFillFolder /> : <AiOutlineFolder />}
        </IconWrapper>
        Batch
      </MenuItem>
      <MenuItem
        selected={currentPage === "Matches"}
        onClick={() => handleMenuItemClick("Matches")}
      >
        <IconWrapper>
          {currentPage === "Matches" ? <RiFileListFill /> : <RiFileListLine />}
        </IconWrapper>
        Matches
      </MenuItem>
      <MenuItem
        selected={currentPage === "Help"}
        onClick={() => handleMenuItemClick("Help")}
      >
        <IconWrapper>
          {currentPage === "Help" ? (
            <IoIosHelpCircle />
          ) : (
            <IoIosHelpCircleOutline />
          )}
        </IconWrapper>
        Help
      </MenuItem>
      <MenuItem
        selected={currentPage === "Settings"}
        onClick={() => handleMenuItemClick("Settings")}
      >
        <IconWrapper>
          {currentPage === "Settings" ? (
            <IoSettingsSharp />
          ) : (
            <IoSettingsOutline />
          )}
        </IconWrapper>
        Settings
      </MenuItem>
    </SidebarContainer>
  );
};

export default Sidebar;
