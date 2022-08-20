import "../styles/globals.css";
import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import { Layout } from "../components/layout";
import React, { useEffect, useState } from "react";
import {
  Me,
  GlobalContextProps,
  GlobalContext,
} from "../contexts/GlobalContext";
import { Spin } from "../components/common";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const [me, setMe] = useState<Me>();
  // setIsAppLoaded after login
  const [isAppLoaded, setIsAppLoaded] = useState(true);
  const contextValue: GlobalContextProps = {
    me: me!,
    setMe,
  };
  return (
    <GlobalContext.Provider value={contextValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GlobalContext.Provider>
  );
}

export default MyApp;
