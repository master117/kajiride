import { SEARCH_INPUT } from "../../constants/action-types";

export function searchInput(payload) {
  return { type: SEARCH_INPUT, payload }
};