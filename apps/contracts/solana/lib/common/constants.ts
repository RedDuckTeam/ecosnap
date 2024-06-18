import { Program } from "@coral-xyz/anchor";
import { Gc } from "../../target/types/GC";

const anchor = require("@coral-xyz/anchor");

export const SEEDS = {
  GC_STATE: "global_state",
};
export const program = anchor.workspace.Gc as Program<Gc>;
