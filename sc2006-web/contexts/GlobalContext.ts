import { LoginRes } from "../../sc2006-common/src/api-models";
import { createContext } from "react";

export type UpdateState<S> = (
  state: Partial<S> | ((prevState: S) => Partial<S>)
) => void;

export interface Me {
  username: string;
}

export interface GlobalContextProps {
  me: Me;
  setMe: (me: Me) => void;
}

export const GlobalContext = createContext<GlobalContextProps>(
  undefined as any
);
