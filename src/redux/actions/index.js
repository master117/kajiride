import { SEARCH_INPUT, LOGGED_IN, LOGGED_OUT } from "../../constants/action-types";

export function searchInput(payload) {
  return { type: SEARCH_INPUT, payload }
};

export function loggedIn(payload) {
  return { type: LOGGED_IN, payload }
};

export function loggedOut(payload) {
  return { type: LOGGED_OUT, payload }
};