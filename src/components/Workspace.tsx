"use client";
import dynamic from "next/dynamic";
import { Spinner } from "./ui";
import type { Preset } from "./WorkspaceInner";

const Inner = dynamic(() => import("./WorkspaceInner"), { ssr: false, loading: () => <Spinner label="Laddar arbetsytan …" /> });
export function Workspace(props: { preset?: Preset; storageKey?: string; height?: number }) { return <Inner {...props} />; }
export type { Preset };
