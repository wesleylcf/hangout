import React, { ReactNode, useContext } from "react";
import { Menu } from "antd";
import { Logo } from ".";
import {
  MenuOutlined,
  PlusSquareOutlined,
  CalendarOutlined,
  SettingOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { GlobalContext } from "../../contexts/GlobalContext";

interface MenuBarItem {
  label?: ReactNode;
  key: string;
  icon?: ReactNode;
  title?: string;
}

const ProtectedItems: MenuBarItem[] = [
  {
    label: (
      <div className="flex flex-row items-center justify-center">
        <PlusSquareOutlined className="pr-1" />
        CreateEvent
      </div>
    ),
    key: "create-event",
  },
  {
    label: (
      <div className="flex flex-row items-center justify-center">
        <CalendarOutlined className="pr-1" />
        Events
      </div>
    ),
    key: "list-events",
  },
  {
    label: (
      <div className="flex flex-row items-center justify-center">
        <SettingOutlined className="pr-1" />
        Settings
      </div>
    ),
    key: "user-settings",
  },
];

export const MenuBar = () => {
  const { me } = useContext(GlobalContext);
  const router = useRouter();

  const PublicItems: MenuBarItem[] = [getLoginOrSignup(router.asPath)];

  return (
    <nav className="flex flew-row bg-white justify-between">
      <Logo />
      <Menu
        items={me ? ProtectedItems : PublicItems}
        mode="horizontal"
        className="w-3/6 justify-end"
        expandIcon={<MenuOutlined />}
        onClick={({ key }) => router.push(`/${key}`)}
      />
    </nav>
  );
};

function getLoginOrSignup(path: string) {
  return path === "/signup" || path === "/"
    ? {
        label: (
          <div className="flex flex-row items-center justify-center">
            <LoginOutlined className="pr-1" />
            Login
          </div>
        ),
        key: "login",
      }
    : {
        label: (
          <div className="flex flex-row items-center justify-center">
            <UserAddOutlined className="pr-1" />
            Sign Up
          </div>
        ),
        key: "signup",
      };
}
